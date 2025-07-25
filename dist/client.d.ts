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
import { AxiosResponse, AxiosInstance } from "axios";
import { OpenFgaApi } from "./api";
import { Assertion, CheckError, CheckRequest, CheckRequestTupleKey, CheckResponse, ConsistencyPreference, ContextualTupleKeys, CreateStoreRequest, CreateStoreResponse, ExpandRequest, ExpandRequestTupleKey, ExpandResponse, GetStoreResponse, ListObjectsRequest, ListObjectsResponse, ListStoresResponse, ListUsersRequest, ListUsersResponse, ReadAssertionsResponse, ReadAuthorizationModelResponse, ReadAuthorizationModelsResponse, ReadChangesResponse, ReadRequestTupleKey, ReadResponse, TupleKey, TupleKeyWithoutCondition, WriteAuthorizationModelRequest, WriteAuthorizationModelResponse } from "./apiModel";
import { BaseAPI } from "./base";
import { PromiseResult } from "./common";
import { Configuration, RetryParams, UserConfigurationParams } from "./configuration";
export type UserClientConfigurationParams = UserConfigurationParams & {
    storeId?: string;
    authorizationModelId?: string;
};
export declare class ClientConfiguration extends Configuration {
    /**
     * provide storeId
     *
     * @type {string}
     * @memberof ClientConfiguration
     */
    storeId?: string;
    /**
     * provide authorizationModelId
     *
     * @type {string}
     * @memberof ClientConfiguration
     */
    authorizationModelId?: string;
    constructor(params?: UserClientConfigurationParams);
    isValid(): boolean;
}
export interface ClientRequestOpts {
    retryParams?: RetryParams;
    headers?: Record<string, string>;
}
export interface StoreIdOpts {
    storeId?: string;
}
export interface AuthorizationModelIdOpts {
    authorizationModelId?: string;
}
export interface ConsistencyOpts {
    consistency?: ConsistencyPreference;
}
export type ClientRequestOptsWithStoreId = ClientRequestOpts & StoreIdOpts;
export type ClientRequestOptsWithAuthZModelId = ClientRequestOpts & StoreIdOpts & AuthorizationModelIdOpts;
export type ClientRequestOptsWithConsistency = ClientRequestOpts & StoreIdOpts & AuthorizationModelIdOpts & ConsistencyOpts;
export type PaginationOptions = {
    pageSize?: number;
    continuationToken?: string;
};
export type ClientCheckRequest = CheckRequestTupleKey & Pick<CheckRequest, "context"> & {
    contextualTuples?: Array<TupleKey>;
};
export type ClientBatchCheckClientRequest = ClientCheckRequest[];
export type ClientBatchCheckSingleClientResponse = {
    _request: ClientCheckRequest;
} & ({
    allowed: boolean;
    $response: AxiosResponse<CheckResponse>;
} | {
    allowed: undefined;
    error: Error;
});
export interface ClientBatchCheckClientResponse {
    result: ClientBatchCheckSingleClientResponse[];
}
export interface ClientBatchCheckClientRequestOpts {
    maxParallelRequests?: number;
}
export type ClientBatchCheckItem = {
    user: string;
    relation: string;
    object: string;
    correlationId?: string;
    contextualTuples?: ContextualTupleKeys;
    context?: object;
};
export type ClientBatchCheckRequest = {
    checks: ClientBatchCheckItem[];
};
export interface ClientBatchCheckRequestOpts {
    maxParallelRequests?: number;
    maxBatchSize?: number;
}
export type ClientBatchCheckSingleResponse = {
    allowed: boolean;
    request: ClientBatchCheckItem;
    correlationId: string;
    error?: CheckError;
};
export interface ClientBatchCheckResponse {
    result: ClientBatchCheckSingleResponse[];
}
export interface ClientWriteRequestOpts {
    transaction?: {
        disable?: boolean;
        maxPerChunk?: number;
        maxParallelRequests?: number;
    };
}
export interface ClientWriteRequest {
    writes?: TupleKey[];
    deletes?: TupleKeyWithoutCondition[];
}
export declare enum ClientWriteStatus {
    SUCCESS = "success",
    FAILURE = "failure"
}
export interface ClientWriteSingleResponse {
    tuple_key: TupleKey;
    status: ClientWriteStatus;
    err?: Error;
}
export interface ClientWriteResponse {
    writes: ClientWriteSingleResponse[];
    deletes: ClientWriteSingleResponse[];
}
export interface ClientListRelationsResponse {
    relations: string[];
}
export interface ClientReadChangesRequest {
    type: string;
    startTime?: string;
}
export type ClientExpandRequest = ExpandRequestTupleKey & Omit<ExpandRequest, "tuple_key" | "authorization_model_id" | "contextual_tuples" | "consistency"> & {
    contextualTuples?: Array<TupleKey>;
};
export type ClientReadRequest = ReadRequestTupleKey;
export type ClientListObjectsRequest = Omit<ListObjectsRequest, "authorization_model_id" | "contextual_tuples" | "consistency"> & {
    contextualTuples?: Array<TupleKey>;
};
export type ClientListUsersRequest = Omit<ListUsersRequest, "authorization_model_id" | "contextual_tuples" | "consistency"> & {
    contextualTuples?: Array<TupleKey>;
};
export type ClientListRelationsRequest = Omit<ClientCheckRequest, "relation" | "consistency"> & {
    relations?: string[];
};
export type ClientWriteAssertionsRequest = (CheckRequestTupleKey & Pick<Assertion, "expectation">)[];
export declare class OpenFgaClient extends BaseAPI {
    protected axios?: AxiosInstance | undefined;
    api: OpenFgaApi;
    authorizationModelId?: string;
    storeId?: string;
    protected configuration: ClientConfiguration;
    constructor(configuration: ClientConfiguration | UserClientConfigurationParams, axios?: AxiosInstance | undefined);
    protected getStoreId(options?: StoreIdOpts, isOptional?: boolean): string | undefined;
    protected getAuthorizationModelId(options?: AuthorizationModelIdOpts): string | undefined;
    /**
     * checkValidApiConnection - Ensures that the credentials are valid for calling the API
     * If the authorization model id is available, this will attempt to get that model
     * Otherwise this will attempt to get the latest authorization model
     * @param {ClientRequestOptsWithAuthZModelId} [options]
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    checkValidApiConnection(options?: ClientRequestOptsWithAuthZModelId): Promise<void>;
    /**********
     * Stores *
     **********/
    /**
     * ListStores - Get a paginated list of stores.
     * @summary List all stores
     * @param {ClientRequestOpts & PaginationOptions} [options]
     * @param {number} [options.pageSize]
     * @param {string} [options.continuationToken]
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     * @throws { FgaError }
     */
    listStores(options?: ClientRequestOptsWithAuthZModelId & PaginationOptions): PromiseResult<ListStoresResponse>;
    /**
     * CreateStore - Initialize a store
     * @param {CreateStoreRequest} body
     * @param {ClientRequestOpts} [options]
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    createStore(body: CreateStoreRequest, options?: ClientRequestOpts): PromiseResult<CreateStoreResponse>;
    /**
     * GetStore - Get information about the current store
     * @param {ClientRequestOptsWithStoreId} [options]
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    getStore(options?: ClientRequestOptsWithStoreId): PromiseResult<GetStoreResponse>;
    /**
     * DeleteStore - Delete a store
     * @param {ClientRequestOptsWithStoreId} [options]
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    deleteStore(options?: ClientRequestOptsWithStoreId): PromiseResult<void>;
    /************************
     * Authorization Models *
     ************************/
    /**
     * ReadAuthorizationModels - Read all authorization models
     * @param {ClientRequestOpts & PaginationOptions} [options]
     * @param {number} [options.pageSize]
     * @param {string} [options.continuationToken]
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    readAuthorizationModels(options?: ClientRequestOptsWithStoreId & PaginationOptions): PromiseResult<ReadAuthorizationModelsResponse>;
    /**
     * WriteAuthorizationModel - Create a new version of the authorization model
     * @param {WriteAuthorizationModelRequest} body
     * @param {ClientRequestOptsWithStoreId} [options]
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    writeAuthorizationModel(body: WriteAuthorizationModelRequest, options?: ClientRequestOptsWithStoreId): PromiseResult<WriteAuthorizationModelResponse>;
    /**
     * ReadAuthorizationModel - Read the current authorization model
     * @param {ClientRequestOptsWithAuthZModelId} [options]
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    readAuthorizationModel(options?: ClientRequestOptsWithAuthZModelId): PromiseResult<ReadAuthorizationModelResponse>;
    /**
     * ReadLatestAuthorizationModel - Read the latest authorization model for the current store
     * @param {ClientRequestOpts} [options]
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    readLatestAuthorizationModel(options?: ClientRequestOpts): PromiseResult<ReadAuthorizationModelResponse>;
    /***********************
     * Relationship Tuples *
     ***********************/
    /**
     * Read Changes - Read the list of historical relationship tuple writes and deletes
     * @param {ClientReadChangesRequest} [body]
     * @param {ClientRequestOpts & PaginationOptions} [options]
     * @param {number} [options.pageSize]
     * @param {string} [options.continuationToken]
     * @param {string} [body.startTime]
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    readChanges(body?: ClientReadChangesRequest, options?: ClientRequestOptsWithStoreId & PaginationOptions): PromiseResult<ReadChangesResponse>;
    /**
     * Read - Read tuples previously written to the store (does not evaluate)
     * @param {ClientReadRequest} body
     * @param {ClientRequestOpts & PaginationOptions & ConsistencyOpts} [options]
     * @param {number} [options.pageSize]
     * @param {string} [options.continuationToken]
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {ConsistencyPreference} [options.consistency] - The consistency preference to use
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    read(body?: ClientReadRequest, options?: ClientRequestOptsWithStoreId & PaginationOptions & ConsistencyOpts): PromiseResult<ReadResponse>;
    /**
     * Write - Create or delete relationship tuples
     * @param {ClientWriteRequest} body
     * @param {ClientRequestOptsWithAuthZModelId & ClientWriteRequestOpts} [options]
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration
     * @param {object} [options.transaction]
     * @param {boolean} [options.transaction.disable] - Disables running the write in a transaction mode. Defaults to `false`
     * @param {number} [options.transaction.maxPerChunk] - Max number of items to send in a single transaction chunk. Defaults to `1`
     * @param {number} [options.transaction.maxParallelRequests] - Max requests to issue in parallel. Defaults to `10`
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    write(body: ClientWriteRequest, options?: ClientRequestOptsWithAuthZModelId & ClientWriteRequestOpts): Promise<ClientWriteResponse>;
    /**
     * WriteTuples - Utility method to write tuples, wraps Write
     * @param {TupleKey[]} tuples
     * @param {ClientRequestOptsWithAuthZModelId & ClientWriteRequestOpts} [options]
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration
     * @param {object} [options.transaction]
     * @param {boolean} [options.transaction.disable] - Disables running the write in a transaction mode. Defaults to `false`
     * @param {number} [options.transaction.maxPerChunk] - Max number of items to send in a single transaction chunk. Defaults to `1`
     * @param {number} [options.transaction.maxParallelRequests] - Max requests to issue in parallel. Defaults to `10`
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    writeTuples(tuples: TupleKey[], options?: ClientRequestOptsWithAuthZModelId & ClientWriteRequestOpts): Promise<ClientWriteResponse>;
    /**
     * DeleteTuples - Utility method to delete tuples, wraps Write
     * @param {TupleKeyWithoutCondition[]} tuples
     * @param {ClientRequestOptsWithAuthZModelId & ClientWriteRequestOpts} [options]
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration
     * @param {object} [options.transaction]
     * @param {boolean} [options.transaction.disable] - Disables running the write in a transaction mode. Defaults to `false`
     * @param {number} [options.transaction.maxPerChunk] - Max number of items to send in a single transaction chunk. Defaults to `1`
     * @param {number} [options.transaction.maxParallelRequests] - Max requests to issue in parallel. Defaults to `10`
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    deleteTuples(tuples: TupleKeyWithoutCondition[], options?: ClientRequestOptsWithAuthZModelId & ClientWriteRequestOpts): Promise<ClientWriteResponse>;
    /************************
     * Relationship Queries *
     ************************/
    /**
     * Check - Check if a user has a particular relation with an object (evaluates)
     * @param {ClientCheckRequest} body
     * @param {ClientRequestOptsWithConsistency} [options]
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {ConsistencyPreference} [options.consistency] - The consistency preference to use
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    check(body: ClientCheckRequest, options?: ClientRequestOptsWithConsistency): PromiseResult<CheckResponse>;
    /**
     * BatchCheck - Run a set of checks (evaluates) by calling the single check endpoint multiple times in parallel.
     * @param {ClientBatchCheckClientRequest} body
     * @param {ClientRequestOptsWithAuthZModelId & ClientBatchCheckClientRequestOpts} [options]
     * @param {number} [options.maxParallelRequests] - Max number of requests to issue in parallel. Defaults to `10`
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration
     * @param {string} [options.consistency] - Optional consistency level for the request. Default is `MINIMIZE_LATENCY`
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    clientBatchCheck(body: ClientBatchCheckClientRequest, options?: ClientRequestOptsWithConsistency & ClientBatchCheckClientRequestOpts): Promise<ClientBatchCheckClientResponse>;
    private singleBatchCheck;
    /**
     * BatchCheck - Run a set of checks (evaluates) by calling the batch-check endpoint.
     * Given the provided list of checks, it will call batch check, splitting the checks into batches based
     * on the `options.maxBatchSize` parameter (default 50 checks) if needed.
     * @param {ClientBatchCheckClientRequest} body
     * @param {ClientRequestOptsWithAuthZModelId & ClientBatchCheckClientRequestOpts} [options]
     * @param {number} [options.maxParallelRequests] - Max number of requests to issue in parallel, if executing multiple requests. Defaults to `10`
     * @param {number} [options.maxBatchSize] - Max number of checks to include in a single batch check request. Defaults to `50`.
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration.
     * @param {string} [options.consistency] -
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    batchCheck(body: ClientBatchCheckRequest, options?: ClientRequestOptsWithConsistency & ClientBatchCheckRequestOpts): Promise<ClientBatchCheckResponse>;
    /**
     * Expand - Expands the relationships in userset tree format (evaluates)
     * @param {ClientExpandRequest} body
     * @param {string} body.relation The relation
     * @param {string} body.object The object, must be of the form: `<type>:<id>`
     * @param {ClientRequestOptsWithConsistency} [options]
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {ConsistencyPreference} [options.consistency] - The consistency preference to use
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    expand(body: ClientExpandRequest, options?: ClientRequestOptsWithConsistency): PromiseResult<ExpandResponse>;
    /**
     * ListObjects - List the objects of a particular type that the user has a certain relation to (evaluates)
     * @param {ClientListObjectsRequest} body
     * @param {ClientRequestOptsWithConsistency} [options]
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {ConsistencyPreference} [options.consistency] - The consistency preference to use
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    listObjects(body: ClientListObjectsRequest, options?: ClientRequestOptsWithConsistency): PromiseResult<ListObjectsResponse>;
    /**
     * ListRelations - List all the relations a user has with an object (evaluates)
     * @param {object} listRelationsRequest
     * @param {string} listRelationsRequest.user The user object, must be of the form: `<type>:<id>`
     * @param {string} listRelationsRequest.object The object, must be of the form: `<type>:<id>`
     * @param {string[]} listRelationsRequest.relations The list of relations to check
     * @param {TupleKey[]} listRelationsRequest.contextualTuples The contextual tuples to send
     * @param {object} listRelationsRequest.context The contextual tuples to send
     * @param options
     */
    listRelations(listRelationsRequest: ClientListRelationsRequest, options?: ClientRequestOptsWithConsistency & ClientBatchCheckClientRequestOpts): Promise<ClientListRelationsResponse>;
    /**
     * ListUsers - List the objects of a particular type that the user has a certain relation to (evaluates)
     * @param {ClientListUsersRequest} body
     * @param {ClientRequestOptsWithConsistency} [options]
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {ConsistencyPreference} [options.consistency] - The consistency preference to use
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    listUsers(body: ClientListUsersRequest, options?: ClientRequestOptsWithConsistency): PromiseResult<ListUsersResponse>;
    /**************
     * Assertions *
     **************/
    /**
     * ReadAssertions - Read assertions for a particular authorization model
     * @param {ClientRequestOptsWithAuthZModelId} [options]
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    readAssertions(options?: ClientRequestOptsWithAuthZModelId): PromiseResult<ReadAssertionsResponse>;
    /**
     * WriteAssertions - Updates assertions for a particular authorization model
     * @param {ClientWriteAssertionsRequest} assertions
     * @param {ClientRequestOptsWithAuthZModelId} [options]
     * @param {string} [options.authorizationModelId] - Overrides the authorization model id in the configuration
     * @param {object} [options.headers] - Custom headers to send alongside the request
     * @param {object} [options.retryParams] - Override the retry parameters for this request
     * @param {number} [options.retryParams.maxRetry] - Override the max number of retries on each API request
     * @param {number} [options.retryParams.minWaitInMs] - Override the minimum wait before a retry is initiated
     */
    writeAssertions(assertions: ClientWriteAssertionsRequest, options?: ClientRequestOptsWithAuthZModelId): PromiseResult<void>;
}
