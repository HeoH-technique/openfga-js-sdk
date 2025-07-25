"use strict";
/**
 * JavaScript and Node.js SDK for OpenFGA
 *
 * API version: 1.x
 * Website: https://openfga.dev
 * Documentation: https://openfga.dev/docs
 * Support: https://openfga.dev/community
 * License: [Apache-2.0](https://github.com/openfga/js-sdk/blob/main/LICENSE)
 *
 * NOTE: This file was auto generated by OpenAPI Generator (https://openapi-generator.tech). DO NOT EDIT.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryAttributes = exports.TelemetryAttribute = void 0;
const url_1 = require("url");
var TelemetryAttribute;
(function (TelemetryAttribute) {
    TelemetryAttribute["FgaClientRequestClientId"] = "fga-client.request.client_id";
    TelemetryAttribute["FgaClientRequestMethod"] = "fga-client.request.method";
    TelemetryAttribute["FgaClientRequestModelId"] = "fga-client.request.model_id";
    TelemetryAttribute["FgaClientRequestStoreId"] = "fga-client.request.store_id";
    TelemetryAttribute["FgaClientResponseModelId"] = "fga-client.response.model_id";
    TelemetryAttribute["FgaClientUser"] = "fga-client.user";
    TelemetryAttribute["HttpClientRequestDuration"] = "http.client.request.duration";
    TelemetryAttribute["FgaClientRequestBatchCheckSize"] = "fga-client.request.batch_check_size";
    TelemetryAttribute["HttpHost"] = "http.host";
    TelemetryAttribute["HttpRequestMethod"] = "http.request.method";
    TelemetryAttribute["HttpRequestResendCount"] = "http.request.resend_count";
    TelemetryAttribute["HttpResponseStatusCode"] = "http.response.status_code";
    TelemetryAttribute["HttpServerRequestDuration"] = "http.server.request.duration";
    TelemetryAttribute["UrlScheme"] = "url.scheme";
    TelemetryAttribute["UrlFull"] = "url.full";
    TelemetryAttribute["UserAgentOriginal"] = "user_agent.original";
})(TelemetryAttribute || (exports.TelemetryAttribute = TelemetryAttribute = {}));
class TelemetryAttributes {
    static prepare(attributes, filter) {
        attributes = attributes || {};
        // ensure we are always using a set
        filter = new Set(filter) || new Set();
        const result = {};
        for (const key in attributes) {
            if (filter.has(key)) {
                result[key] = attributes[key];
            }
        }
        return result;
    }
    static fromRequest({ userAgent, fgaMethod, httpMethod, url, resendCount, start, credentials, attributes = {}, }) {
        if (fgaMethod)
            attributes[TelemetryAttribute.FgaClientRequestMethod] = fgaMethod;
        if (userAgent)
            attributes[TelemetryAttribute.UserAgentOriginal] = userAgent;
        if (httpMethod)
            attributes[TelemetryAttribute.HttpRequestMethod] = httpMethod;
        if (url) {
            const parsedUrl = new url_1.URL(url);
            attributes[TelemetryAttribute.HttpHost] = parsedUrl.hostname;
            attributes[TelemetryAttribute.UrlScheme] = parsedUrl.protocol;
            attributes[TelemetryAttribute.UrlFull] = url;
        }
        if (start)
            attributes[TelemetryAttribute.HttpClientRequestDuration] = Math.round(performance.now() - start);
        if (resendCount)
            attributes[TelemetryAttribute.HttpRequestResendCount] = resendCount;
        if (credentials && credentials.method === "client_credentials") {
            attributes[TelemetryAttribute.FgaClientRequestClientId] = credentials.configuration.clientId;
        }
        return attributes;
    }
    static fromResponse({ response, attributes = {}, }) {
        if (response?.status)
            attributes[TelemetryAttribute.HttpResponseStatusCode] = response.status;
        const responseHeaders = response?.headers || {};
        const responseModelId = responseHeaders["openfga-authorization-model-id"];
        const responseQueryDuration = responseHeaders["fga-query-duration-ms"] ? parseInt(responseHeaders["fga-query-duration-ms"], 10) : undefined;
        if (responseModelId) {
            attributes[TelemetryAttribute.FgaClientResponseModelId] = responseModelId;
        }
        if (typeof responseQueryDuration !== "undefined" && Number.isFinite(responseQueryDuration)) {
            attributes[TelemetryAttribute.HttpServerRequestDuration] = responseQueryDuration;
        }
        return attributes;
    }
    static fromRequestBody(body, attributes = {}) {
        if (body?.authorization_model_id) {
            attributes[TelemetryAttribute.FgaClientRequestModelId] = body.authorization_model_id;
        }
        if (body?.tuple_key?.user) {
            attributes[TelemetryAttribute.FgaClientUser] = body.tuple_key.user;
        }
        if (body?.checks?.length) {
            attributes[TelemetryAttribute.FgaClientRequestBatchCheckSize] = body.checks.length;
        }
        return attributes;
    }
}
exports.TelemetryAttributes = TelemetryAttributes;
