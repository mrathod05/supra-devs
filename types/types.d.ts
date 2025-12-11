// supra-l1-sdk type definitions
declare module "supra-l1-sdk" {
  import {
    TxnBuilderTypes,
    BCS,
    SupraAccount,
    AnyRawTransaction,
    HexString,
  } from "supra-l1-sdk-core";

  export interface AccountInfo {
    sequence_number: bigint;
    authentication_key: string;
  }

  export interface TransactionResponse {
    txHash: string;
    result: any;
  }

  export interface OptionalTransactionArgs {
    optionalTransactionPayloadArgs?: any;
    enableTransactionWaitAndSimulationArgs?: any;
  }

  export class SupraClient {
    supraNodeURL: string;
    chainId: TxnBuilderTypes.ChainId;

    constructor(url: string, chainId?: number);

    static init(url: string): Promise<SupraClient>;

    getChainId(): Promise<TxnBuilderTypes.ChainId>;
    getGasPrice(): Promise<bigint>;
    getAccountInfo(account: HexString): Promise<AccountInfo>;
    isAccountExists(account: HexString): Promise<boolean>;

    transferSupraCoin(
      senderAccount: SupraAccount,
      receiverAccountAddr: HexString,
      amount: bigint,
      optionalTransactionArgs?: OptionalTransactionArgs
    ): Promise<TransactionResponse>;

    transferCoin(
      senderAccount: SupraAccount,
      receiverAccountAddr: HexString,
      amount: bigint,
      coinType: string,
      optionalTransactionArgs?: OptionalTransactionArgs
    ): Promise<TransactionResponse>;

    createRawTxObject(
      senderAddr: HexString,
      senderSequenceNumber: bigint,
      moduleAddr: string,
      moduleName: string,
      functionName: string,
      functionTypeArgs: TxnBuilderTypes.TypeTag[],
      functionArgs: Uint8Array[],
      optionalTransactionPayloadArgs?: any
    ): Promise<TxnBuilderTypes.RawTransaction>;

    getSendTxPayload(
      senderAccount: SupraAccount,
      rawTxn: TxnBuilderTypes.RawTransaction
    ): any;

    static signSupraTransaction(
      senderAccount: SupraAccount,
      rawTxn: AnyRawTransaction
    ): HexString;

    static createSignedTransaction(
      senderAccount: SupraAccount,
      rawTxn: TxnBuilderTypes.RawTransaction
    ): TxnBuilderTypes.SignedTransaction;

    getAccountResources(account: HexString, paginationArgs?: any): Promise<any>;
    getTransactionStatus(transactionHash: string): Promise<any>;
    waitForTransactionCompletion(txHash: string): Promise<any>;

    sendTx(
      sendTxJsonPayload: any,
      enableTransactionWaitAndSimulationArgs?: any
    ): Promise<TransactionResponse>;

    createSerializedRawTxObject(
      senderAddr: HexString,
      senderSequenceNumber: bigint,
      moduleAddr: string,
      moduleName: string,
      functionName: string,
      functionTypeArgs: TxnBuilderTypes.TypeTag[],
      functionArgs: Uint8Array[],
      optionalTransactionPayloadArgs?: any
    ): Promise<Uint8Array>;

    sendTxUsingSerializedRawTransaction(
      senderAccount: SupraAccount,
      serializedRawTransaction: Uint8Array<ArrayBufferLike>,
      enableTransactionWaitAndSimulationArgs?: any
    ): Promise<TransactionResponse>;
  }

  export { TxnBuilderTypes, BCS, HexString, SupraAccount, AnyRawTransaction };
}
