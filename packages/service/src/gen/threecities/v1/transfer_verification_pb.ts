// @generated by protoc-gen-es v1.10.0 with parameter "target=ts"
// @generated from file threecities/v1/transfer_verification.proto (package threecities.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message threecities.v1.TransferVerificationRequest
 */
export class TransferVerificationRequest extends Message<TransferVerificationRequest> {
  /**
   * @generated from field: threecities.v1.TransferVerificationRequest.TrustedData trusted = 1;
   */
  trusted?: TransferVerificationRequest_TrustedData;

  /**
   * @generated from field: threecities.v1.TransferVerificationRequest.UntrustedData untrusted_to_be_verified = 2;
   */
  untrustedToBeVerified?: TransferVerificationRequest_UntrustedData;

  constructor(data?: PartialMessage<TransferVerificationRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "threecities.v1.TransferVerificationRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "trusted", kind: "message", T: TransferVerificationRequest_TrustedData },
    { no: 2, name: "untrusted_to_be_verified", kind: "message", T: TransferVerificationRequest_UntrustedData },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TransferVerificationRequest {
    return new TransferVerificationRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TransferVerificationRequest {
    return new TransferVerificationRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TransferVerificationRequest {
    return new TransferVerificationRequest().fromJsonString(jsonString, options);
  }

  static equals(a: TransferVerificationRequest | PlainMessage<TransferVerificationRequest> | undefined, b: TransferVerificationRequest | PlainMessage<TransferVerificationRequest> | undefined): boolean {
    return proto3.util.equals(TransferVerificationRequest, a, b);
  }
}

/**
 * from the point of view of the verification client (caller), these data are trusted and will be used to verify the untrustedToBeVerified data
 *
 * @generated from message threecities.v1.TransferVerificationRequest.TrustedData
 */
export class TransferVerificationRequest_TrustedData extends Message<TransferVerificationRequest_TrustedData> {
  /**
   * primary currency of transfer being verified. Must be "USD". NB we already support ETH transfer amount verification via usd_per_eth, just not ETH-denominated requests. TODO unify with LogicalAssetTicker by exporting the proto file from @3cities/core
   *
   * @generated from field: string currency = 1;
   */
  currency = "";

  /**
   * full-precision logical asset amount denominated in `currency` to expect was successfully transferred in the transfer being verified
   *
   * @generated from field: string logical_asset_amount = 2;
   */
  logicalAssetAmount = "";

  /**
   * allowlist of tokens to permit for a successfully verified transfer. WARNING today, not all supported tokens by 3cities are supported by 3cities on every chain (ie. the matrix of tokens * chains is incomplete), so if a ticker in tokenTickerAllowList is not available on the passed chainId, then any transfers of that token will not be detected and verification will fail as if the transfer never happened
   *
   * @generated from field: repeated string token_ticker_allowlist = 3;
   */
  tokenTickerAllowlist: string[] = [];

  /**
   * ETH price in USD exchange rate to be used when verifying logical asset amounts
   *
   * @generated from field: double usd_per_eth = 4;
   */
  usdPerEth = 0;

  /**
   * receiver address on the passed chainId where transfer being verified is expected to have been sent
   *
   * @generated from field: string receiver_address = 5;
   */
  receiverAddress = "";

  constructor(data?: PartialMessage<TransferVerificationRequest_TrustedData>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "threecities.v1.TransferVerificationRequest.TrustedData";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "currency", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "logical_asset_amount", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "token_ticker_allowlist", kind: "scalar", T: 9 /* ScalarType.STRING */, repeated: true },
    { no: 4, name: "usd_per_eth", kind: "scalar", T: 1 /* ScalarType.DOUBLE */ },
    { no: 5, name: "receiver_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TransferVerificationRequest_TrustedData {
    return new TransferVerificationRequest_TrustedData().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TransferVerificationRequest_TrustedData {
    return new TransferVerificationRequest_TrustedData().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TransferVerificationRequest_TrustedData {
    return new TransferVerificationRequest_TrustedData().fromJsonString(jsonString, options);
  }

  static equals(a: TransferVerificationRequest_TrustedData | PlainMessage<TransferVerificationRequest_TrustedData> | undefined, b: TransferVerificationRequest_TrustedData | PlainMessage<TransferVerificationRequest_TrustedData> | undefined): boolean {
    return proto3.util.equals(TransferVerificationRequest_TrustedData, a, b);
  }
}

/**
 * from the point of view of the verification client (caller), these data are untrusted and will be verified. Verification will be successful if and only if all these untrusted data are proven to be correct and match/correspond to the trusted data. NB as always, the RPC providers used by verification are assumed to be trustworthy - clients are trusting their RPC providers to facilitate verification
 *
 * @generated from message threecities.v1.TransferVerificationRequest.UntrustedData
 */
export class TransferVerificationRequest_UntrustedData extends Message<TransferVerificationRequest_UntrustedData> {
  /**
   * chainId on which the transfer is being verified
   *
   * @generated from field: uint32 chain_id = 1;
   */
  chainId = 0;

  /**
   * transaction hash of the transfer being verified
   *
   * @generated from field: string transaction_hash = 2;
   */
  transactionHash = "";

  /**
   * optional. senderAddress whose transfer to receiverAddress is being verified. NB senderAddress must match caip222StyleSignature.message.senderAddress if both are defined. The idea is that senderAddress may optionally be provided without a caip222StyleSignature to verify a transfer without also authenticating the sender
   *
   * @generated from field: string sender_address = 3;
   */
  senderAddress = "";

  /**
   * optional. A signature to authenticate senderAddress. If defined, the signature will be verified against 3cities's trusted caip222 message schema (domain, types, primaryType). This only proves that the signer of senderAddress provided the signature to the verification client (eg. to securely associate an onchain payment with an offchain order ID) and proves nothing about the transfer being verified. The provided `message` is expected to be JSON conforming to the typescript type Caip222StyleMessageToSign
   *
   * @generated from field: threecities.v1.TransferVerificationRequest.SignatureData caip222_style_signature = 4;
   */
  caip222StyleSignature?: TransferVerificationRequest_SignatureData;

  constructor(data?: PartialMessage<TransferVerificationRequest_UntrustedData>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "threecities.v1.TransferVerificationRequest.UntrustedData";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "chain_id", kind: "scalar", T: 13 /* ScalarType.UINT32 */ },
    { no: 2, name: "transaction_hash", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "sender_address", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "caip222_style_signature", kind: "message", T: TransferVerificationRequest_SignatureData },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TransferVerificationRequest_UntrustedData {
    return new TransferVerificationRequest_UntrustedData().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TransferVerificationRequest_UntrustedData {
    return new TransferVerificationRequest_UntrustedData().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TransferVerificationRequest_UntrustedData {
    return new TransferVerificationRequest_UntrustedData().fromJsonString(jsonString, options);
  }

  static equals(a: TransferVerificationRequest_UntrustedData | PlainMessage<TransferVerificationRequest_UntrustedData> | undefined, b: TransferVerificationRequest_UntrustedData | PlainMessage<TransferVerificationRequest_UntrustedData> | undefined): boolean {
    return proto3.util.equals(TransferVerificationRequest_UntrustedData, a, b);
  }
}

/**
 * @generated from message threecities.v1.TransferVerificationRequest.SignatureData
 */
export class TransferVerificationRequest_SignatureData extends Message<TransferVerificationRequest_SignatureData> {
  /**
   * @generated from field: string message = 1;
   */
  message = "";

  /**
   * @generated from field: string signature = 2;
   */
  signature = "";

  constructor(data?: PartialMessage<TransferVerificationRequest_SignatureData>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "threecities.v1.TransferVerificationRequest.SignatureData";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "message", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "signature", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TransferVerificationRequest_SignatureData {
    return new TransferVerificationRequest_SignatureData().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TransferVerificationRequest_SignatureData {
    return new TransferVerificationRequest_SignatureData().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TransferVerificationRequest_SignatureData {
    return new TransferVerificationRequest_SignatureData().fromJsonString(jsonString, options);
  }

  static equals(a: TransferVerificationRequest_SignatureData | PlainMessage<TransferVerificationRequest_SignatureData> | undefined, b: TransferVerificationRequest_SignatureData | PlainMessage<TransferVerificationRequest_SignatureData> | undefined): boolean {
    return proto3.util.equals(TransferVerificationRequest_SignatureData, a, b);
  }
}

/**
 * Response type for the result of a verification
 *
 * @generated from message threecities.v1.TransferVerificationResponse
 */
export class TransferVerificationResponse extends Message<TransferVerificationResponse> {
  /**
   * true iff the transfer verification was successful
   *
   * @generated from field: bool is_verified = 1;
   */
  isVerified = false;

  /**
   * description of verification result. Eg. if success, "0.023 ETH sent on Arbitrum One", if failure, "ChainID 3933 is not supported", "Insufficient confirmations, wanted=2, found=1"
   *
   * @generated from field: string description = 2;
   */
  description = "";

  /**
   * optional error. Empty string indicates undefined. Always undefined if is_verified
   *
   * @generated from field: string error = 3;
   */
  error = "";

  constructor(data?: PartialMessage<TransferVerificationResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "threecities.v1.TransferVerificationResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "is_verified", kind: "scalar", T: 8 /* ScalarType.BOOL */ },
    { no: 2, name: "description", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "error", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): TransferVerificationResponse {
    return new TransferVerificationResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): TransferVerificationResponse {
    return new TransferVerificationResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): TransferVerificationResponse {
    return new TransferVerificationResponse().fromJsonString(jsonString, options);
  }

  static equals(a: TransferVerificationResponse | PlainMessage<TransferVerificationResponse> | undefined, b: TransferVerificationResponse | PlainMessage<TransferVerificationResponse> | undefined): boolean {
    return proto3.util.equals(TransferVerificationResponse, a, b);
  }
}

