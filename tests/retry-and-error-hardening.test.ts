/**
 * Regression tests for the retry loop and error hardening of this fork:
 * - a retry config without a usable maxRetry must never turn a 429/5xx into a success;
 * - Write (not idempotent) must not be replayed after a 5xx;
 * - errors from the token exchange must not carry the client secret.
 */

import * as nock from "nock";
import { inspect } from "util";
import axios from "axios";

import {
  ClientWriteStatus,
  CredentialsMethod,
  FgaApiError,
  FgaApiInternalError,
  FgaApiRateLimitExceededError,
  FgaApiValidationError,
  OpenFgaClient,
} from "../index";
import { attemptHttpRequest } from "../common";
import {
  baseConfig,
  OPENFGA_API_TOKEN_ISSUER,
  OPENFGA_API_URL,
  OPENFGA_CLIENT_SECRET,
  OPENFGA_STORE_ID,
} from "./helpers/default-config";
import { getNocks } from "./helpers/nocks";

const nocks = getNocks(nock);
nock.disableNetConnect();

const tuple = {
  user: "user:81684243-9356-4421-8fbf-a4f8d36aa31b",
  relation: "admin",
  object: "workspace:1",
};

const noAuth = { method: CredentialsMethod.None } as const;

describe("retry loop", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it("defaults maxRetry when retryParams has none, and throws once retries are exhausted", async () => {
    const fgaClient = new OpenFgaClient({ ...baseConfig, credentials: noAuth, retryParams: { minWaitInMs: 1 } });
    const scope = nock(OPENFGA_API_URL)
      .post(`/stores/${OPENFGA_STORE_ID}/check`)
      .times(3)
      .reply(500, { code: "internal_error", message: "nock error" });

    await expect(fgaClient.check(tuple)).rejects.toThrow(FgaApiInternalError);
    expect(scope.isDone()).toBe(true);
  });

  it("throws instead of resolving empty when a per-call maxRetry is NaN", async () => {
    const fgaClient = new OpenFgaClient({ ...baseConfig, credentials: noAuth });
    nock(OPENFGA_API_URL)
      .post(`/stores/${OPENFGA_STORE_ID}/check`)
      .times(3)
      .reply(429, { code: "rate_limit_exceeded", message: "nock error" });

    await expect(
      fgaClient.check(tuple, { retryParams: { maxRetry: Number(undefined), minWaitInMs: 1 } }),
    ).rejects.toThrow(FgaApiRateLimitExceededError);
  });

  it("never reports a write as successful when the server answered 5xx", async () => {
    const fgaClient = new OpenFgaClient({ ...baseConfig, credentials: noAuth, retryParams: { minWaitInMs: 1 } });
    nock(OPENFGA_API_URL)
      .post(`/stores/${OPENFGA_STORE_ID}/write`)
      .reply(503, { code: "unavailable", message: "nock error" });

    await expect(fgaClient.write({ writes: [tuple] })).rejects.toThrow(FgaApiInternalError);
  });

  it("attemptHttpRequest throws with a non-numeric maxRetry", async () => {
    nock(OPENFGA_API_URL).get("/x").reply(500, {});

    await expect(
      attemptHttpRequest({ url: `${OPENFGA_API_URL}/x`, method: "GET" }, { maxRetry: NaN, minWaitInMs: 1 }, axios.create()),
    ).rejects.toThrow(FgaApiInternalError);
  });

  it("still retries non-write calls after a 5xx", async () => {
    const fgaClient = new OpenFgaClient({ ...baseConfig, credentials: noAuth, retryParams: { maxRetry: 3, minWaitInMs: 1 } });
    nock(OPENFGA_API_URL)
      .post(`/stores/${OPENFGA_STORE_ID}/check`)
      .reply(500, { code: "internal_error", message: "nock error" });
    nock(OPENFGA_API_URL)
      .post(`/stores/${OPENFGA_STORE_ID}/check`)
      .reply(200, { allowed: true });

    const result = await fgaClient.check(tuple);
    expect(result.allowed).toBe(true);
  });
});

describe("Write is not replayed after a 5xx", () => {
  let fgaClient: OpenFgaClient;

  beforeEach(() => {
    fgaClient = new OpenFgaClient({ ...baseConfig, credentials: noAuth, retryParams: { maxRetry: 3, minWaitInMs: 1 } });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it("surfaces the 5xx and does not resend the same write", async () => {
    nock(OPENFGA_API_URL)
      .post(`/stores/${OPENFGA_STORE_ID}/write`)
      .reply(502, { code: "internal_error", message: "bad gateway" });
    const replay = nock(OPENFGA_API_URL)
      .post(`/stores/${OPENFGA_STORE_ID}/write`)
      .reply(400, { code: "write_failed_due_to_invalid_input", message: "cannot write a tuple which already exists" });

    await expect(fgaClient.write({ writes: [tuple] })).rejects.toThrow(FgaApiInternalError);
    expect(replay.isDone()).toBe(false);
  });

  it("marks the tuple failed in non-transaction mode without resending it", async () => {
    nock(OPENFGA_API_URL)
      .post(`/stores/${OPENFGA_STORE_ID}/write`)
      .reply(500, { code: "internal_error", message: "nock error" });
    const replay = nocks.write(OPENFGA_STORE_ID);

    const data = await fgaClient.write({ writes: [tuple] }, { transaction: { disable: true } });
    expect(data.writes[0].status).toBe(ClientWriteStatus.FAILURE);
    expect(replay.isDone()).toBe(false);
  });

  it("still retries a write after a 429, which the server did not process", async () => {
    nock(OPENFGA_API_URL)
      .post(`/stores/${OPENFGA_STORE_ID}/write`)
      .reply(429, { code: "rate_limit_exceeded", message: "nock error" });
    const retried = nocks.write(OPENFGA_STORE_ID);

    const data = await fgaClient.write({ writes: [tuple] });
    expect(retried.isDone()).toBe(true);
    expect(data.writes[0].status).toBe(ClientWriteStatus.SUCCESS);
  });
});

describe("token exchange errors do not carry the client secret", () => {
  afterEach(() => {
    nock.cleanAll();
  });

  const expectNoSecret = (err: unknown) => {
    expect(err).toBeInstanceOf(FgaApiError);
    expect(JSON.stringify((err as FgaApiError).requestData) ?? "").not.toContain(OPENFGA_CLIENT_SECRET);
    expect(inspect(err, { depth: 5 })).not.toContain(OPENFGA_CLIENT_SECRET);
    expect(JSON.stringify(err)).not.toContain(OPENFGA_CLIENT_SECRET);
  };

  it("on a 400 from the token endpoint", async () => {
    nock(`https://${OPENFGA_API_TOKEN_ISSUER}`)
      .post("/protocol/openid-connect/token")
      .reply(400, { error: "unauthorized_client" });
    const fgaClient = new OpenFgaClient({ ...baseConfig });

    const err = await fgaClient.check(tuple).catch((e) => e);
    expectNoSecret(err);
    expect((err as FgaApiError).statusCode).toBe(400);
  });

  it("on a network error from the token endpoint", async () => {
    nock(`https://${OPENFGA_API_TOKEN_ISSUER}`)
      .post("/protocol/openid-connect/token")
      .replyWithError(Object.assign(new Error("connect ECONNREFUSED"), { code: "ECONNREFUSED" }));
    const fgaClient = new OpenFgaClient({ ...baseConfig });

    const err = await fgaClient.check(tuple).catch((e) => e);
    expectNoSecret(err);
  });

  it("keeps requestData for ordinary API errors", async () => {
    nocks.tokenExchange(OPENFGA_API_TOKEN_ISSUER);
    nock(OPENFGA_API_URL)
      .post(`/stores/${OPENFGA_STORE_ID}/check`)
      .reply(400, { code: "validation_error", message: "nock error" });
    const fgaClient = new OpenFgaClient({ ...baseConfig });

    const err = await fgaClient.check(tuple).catch((e) => e);
    expect(err).toBeInstanceOf(FgaApiValidationError);
    expect(String((err as FgaApiError).requestData)).toContain(tuple.object);
  });
});
