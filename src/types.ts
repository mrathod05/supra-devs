/**
 * Type definitions for Supra DevTools
 * @module types
 */

/**
 * Supra Chain IDs
 * @typedef {string} SupraChainId
 * @example "6" // Testnet
 * @example "8" // Mainnet
 */
export type SupraChainId = "6" | "8";

/**
 * Parameters for executing entry functions (state-changing operations)
 * @template T - Type of function arguments array
 */
export interface EntryFunctionParams<T extends unknown[]> {
  /** Contract address (e.g., "0x1") */
  contractAddress: string;
  /** Module name within the contract */
  moduleName: string;
  /** Entry function name */
  functionName: string;
  /** Function arguments */
  functionArgs: T;
  /** Type arguments for generic functions */
  typeArgs?: any[]; // TxnBuilderTypes.TypeTag[]
  /** Supra client instance for transaction building */
  supraClient: any;
}

/**
 * Parameters for executing view functions (read-only operations)
 * @template T - Type of view function arguments
 */
export interface ViewFunctionParams<T extends unknown[] = unknown[]> {
  /** Contract address (e.g., "0x1") */
  contractAddress: string;
  /** Module name within the contract */
  moduleName: string;
  /** View function name */
  functionName: string;
  /** Function arguments */
  functionArgs?: T;
  /** Type arguments for generic functions */
  typeArgs?: string[];
  /** Abort controller for canceling requests */
  abortController?: AbortController;
}

/**
 * Transaction parameters
 */
export interface SendTxParams {
  /** Serialized transaction data in hex format */
  data: string;
  /** Sender address */
  from: string;
  /** Chain ID */
  chainId: string | number;
  /** Transaction options */
  options: {
    waitForTransaction: boolean;
  };
}

/**
 * View function request body for RPC calls
 */
export interface ViewFunctionBody {
  /** Function identifier: "address::module::function" */
  function: string;
  /** Type arguments for generic functions */
  type_arguments: string[];
  /** Function arguments */
  arguments: unknown[];
}

/**
 * Message signature response
 */
export interface SignatureResponse {
  /** Public key from wallet */
  publicKey: string;
  /** Signed message */
  signature: string;
}

/**
 * Account details
 */
export interface AccountDetails {
  /** Wallet address */
  address: string;
  /** Account domain/name (if available) */
  domain: string;
}

/**
 * Wallet context type - all wallet-related operations and state
 */
export interface WalletContextType {
  /** Whether wallet is connected */
  isConnected: boolean;
  /** Whether Starkey wallet extension is installed */
  isStarkeyInstalled: boolean;
  /** Connected account address */
  account: string | null;
  /** Account domain or name */
  domain: string | null;
  /** Current account balance in SUPRA tokens */
  balance: string;
  /** Current chain ID */
  chainId: SupraChainId;
  /** Connect wallet to specified network */
  connectWallet: (networkId: string) => Promise<void>;
  /** Disconnect wallet */
  disconnectWallet: () => void;
  /** Switch to a different network */
  switchNetwork: (chainId: string) => Promise<void>;
  /** Update account balance */
  updateBalance: (address: string) => Promise<void>;
  /** Sign a message with wallet */
  signMessage: (
    message: string
  ) => Promise<SignatureResponse | Record<string, never>>;
  /** Sign message with v2 protocol */
  signMessageV2: (message: string) => Promise<SignatureResponse>;
  /** Ensure transaction dependencies are met */
  ensureTxDependencies: () => { isConnected: true; account: string };
  /** Execute an entry function (state-changing) */
  executeEntryFunction: <T extends Uint8Array<ArrayBufferLike>[]>(
    params: EntryFunctionParams<T>
  ) => Promise<string>;
  /** Execute a view function (read-only) */
  executeViewFunction: <TArgs extends unknown[], TResult = unknown>(
    params: ViewFunctionParams<TArgs>
  ) => Promise<TResult>;
  /** Switch network on Supra */
  switchNetworkSupra: (chainId: string) => Promise<string | null>;
  /** Get transaction scanner URL for a transaction hash */
  fetchTransactionScanURL: (txHash: string) => string;
}

/**
 * Starkey wallet provider interface
 */
export interface StarkeyProvider {
  account: () => Promise<string[]>;
  connect: (options: {
    chainId: string;
    multiple: boolean;
  }) => Promise<string[]>;
  disconnect: () => Promise<void>;
  getChainId: () => Promise<{ chainId: SupraChainId }>;
  changeNetwork: (options: {
    networkId: string;
  }) => Promise<{ chainId: SupraChainId } | null>;
  signMessage: (options: { message: string }) => Promise<SignatureResponse>;
  sendTransaction: (params: SendTxParams) => Promise<string>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeListener?: (event: string, callback: (...args: any[]) => void) => void;
}

/**
 * Supra network configuration
 */
export interface SupraNetworkConfig {
  /** RPC endpoint */
  rpc: string;
  /** Block explorer URL */
  scan: string;
}

/**
 * Supra networks configuration map
 */
export interface SupraNetworks {
  [chainId: string]: SupraNetworkConfig;
}
