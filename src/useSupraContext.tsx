/**
 * Supra Wallet Context and Provider
 * @packageDocumentation
 */

'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

import nacl from 'tweetnacl'
import { fromSupraQuant, remove0xPrefix } from './utils'
import type {
  EntryFunctionParams,
  ViewFunctionParams,
  SendTxParams,
  ViewFunctionBody,
  SupraChainId,
  WalletContextType,
} from './types'

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    starkey?: Partial<{
      supra: any
    }>
  }
}

// Create the Wallet Context
const WalletContext = createContext<WalletContextType | undefined>(undefined)
const DEFAULT_BALANCE = '0.00'

const SUPRA = {
  "8": {
    rpc: "https://rpc-mainnet.supra.com",
    scan: "https://suprascan.io"
  },
  "6": { rpc: "https://rpc-testnet.supra.com", scan: "https://testnet.suprascan.io", },
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize all state to safe defaults
  const [isStarkeyInstalled, setIsStarkeyInstalled] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [accountDetails, setAccountDetails] = useState<{ address: string; domain: string } | null>(null)
  const [balance, setBalance] = useState<string>(DEFAULT_BALANCE)
  const [chainId, setChainId] = useState<SupraChainId>("6")

  // Use ref to track if we're already fetching balance
  const isFetchingBalance = useRef(false)

  const supraConfig = SUPRA[chainId];

  const getProvider = (): any => {
    if (typeof window === 'undefined') return null

    if ('starkey' in window) {
      const provider = (window as Window).starkey?.supra

      if (provider) {
        setIsStarkeyInstalled(true)
        return provider
      }
      // Only handle mobile redirect on client side
      if (typeof navigator !== 'undefined') {
        const userAgent = navigator.userAgent
        if (/android/i.test(userAgent) || /iPad|iPhone|iPod/.test(userAgent)) {
          window.open(
            `https://starkey.app/dApps?url=${encodeURIComponent(`${window.location.href}?wallet_connect_onload=true`)}`,
          )
        }
      }

      return null
    }

    return null
  }

  const switchNetworkSupra = async (networkId: string): Promise<string | null> => {
    if (typeof window === 'undefined') return null

    const provider = getProvider()
    if (provider) {
      try {
        const result = await provider.changeNetwork({ networkId })
        if (result) return result.chainId
        return null
      } catch {
        return null
      }
    }

    return null
  }

  const signMessageV2 = async (message: string): Promise<{ publicKey: string; signature: string }> => {
    const provider = getProvider()
    if (!provider) return { publicKey: '', signature: '' }
    const hexString = `0x${Buffer.from(message, 'utf8').toString('hex')}`
    const response = await provider.signMessage({ message: hexString })

    if (!response?.signature) return { publicKey: '', signature: '' }

    return response
  }

  // Memoize getBalance to prevent unnecessary recreations
  const getBalance = useCallback(async (address: string): Promise<string> => {
    try {
      const res = await executeViewFunction<string[], { result: number[] }>({
        contractAddress: "0x1",
        functionName: "balance",
        moduleName: "coin",
        typeArgs: ['0x1::supra_coin::SupraCoin'],
        functionArgs: [address]
      })
      if (res.result?.[0] && +res.result[0] > 0) {
        return Number(fromSupraQuant(BigInt(res.result[0]))).toFixed(4)
      }

      return DEFAULT_BALANCE
    } catch (error) {
      console.error(`Failed to fetch balance for ${address}`, error)
      return DEFAULT_BALANCE
    }
  }, [])

  // Update balance with debouncing
  const updateBalance = useCallback(
    async (address: string) => {
      if (typeof window === 'undefined' || !address || isFetchingBalance.current) return

      isFetchingBalance.current = true
      try {
        const newBalance = await getBalance(address)
        setBalance(newBalance)
      } catch (error) {
        console.error('Failed to fetch balance:', error)
      } finally {
        isFetchingBalance.current = false
      }
    },
    [getBalance],
  )

  const updateWallet = useCallback(async () => {
    if (typeof window === 'undefined') return

    const provider = getProvider()
    if (provider) {
      try {
        const accounts = await provider.account()
        if (accounts.length > 0) {
          const account = accounts[0]
          setAccountDetails({ address: account, domain: '' })

          const res = await provider.getChainId()
          setChainId(res.chainId)
          setIsConnected(true)
          await updateBalance(account)
        }
      } catch (error) {
        console.error('Failed to update wallet:', error)
      }
    }
  }, [updateBalance])

  // Only run wallet detection and setup on client side
  useEffect(() => {
    if (typeof window === 'undefined') return

    const provider = getProvider()
    if (provider) {
      provider.on?.('accountChanged', handleAccountsChanged)
      provider.on?.('networkChanged', handleChainChanged)
      provider.on('disconnect', resetWalletState)
      void updateWallet()
    } else {
      // Poll for wallet availability
      const intervalId = setInterval(() => {
        if ((window as Window).starkey) {
          clearInterval(intervalId)
          setIsStarkeyInstalled(true)
          void updateWallet()
        }
      }, 500)

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId)
      }, 5000)

      return () => {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
      }
    }
  }, [updateWallet])

  const fetchTransactionScanURL = (txHash: string): string => `${supraConfig.scan}/tx/${txHash}`

  // Connect Wallet
  const connectWallet = async (networkId: string): Promise<any> => {
    if (typeof window === 'undefined') return

    try {
      const provider = getProvider()
      if (!provider) {
        throw new Error('Wallet not available')
      }

      const accounts = await provider.connect({
        chainId: networkId,
        multiple: false,
      })
      await updateWallet()
      return accounts[0] || null
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const resetWalletState = (): void => {
    setIsConnected(false)
    setAccountDetails(null)
    setBalance(DEFAULT_BALANCE)
    setChainId("8")
  }

  // Disconnect Wallet
  const disconnectWallet = async (): Promise<void> => {
    if (typeof window === 'undefined') return

    const provider = getProvider()
    if (provider) {
      await provider.disconnect()
    }

    resetWalletState()
  }

  // Handle accounts change
  const handleAccountsChanged = (accounts: string[]): void => {
    if (accounts.length === 0) {
      void disconnectWallet()
    } else {
      void updateWallet()
    }
  }

  // Handle chain change
  const handleChainChanged = async (networkId: SupraChainId): Promise<void> => {
    setChainId(networkId)
    if (accountDetails?.address) {
      await updateBalance(accountDetails.address)
    }
  }

  // Switch network
  const switchNetwork = async (networkId: string): Promise<void> => {
    if (typeof window === 'undefined') return

    const provider = getProvider()
    if (provider) {
      await provider.changeNetwork({ networkId })
    }
  }

  // Sign message
  const signMessage = async (message: string): Promise<any> => {
    if (typeof window === 'undefined') return {}

    const provider = getProvider()
    if (!provider) return {}

    try {
      const hexString = `0x${Buffer.from(message, 'utf8').toString('hex')}`
      const response = await provider.signMessage({ message: hexString })
      if (response?.signature) {
        const { publicKey, signature } = response
        const sign = remove0xPrefix(signature)
        const key = remove0xPrefix(publicKey)
        const verified = nacl.sign.detached.verify(
          new TextEncoder().encode(message),
          Uint8Array.from(Buffer.from(sign, 'hex')),
          Uint8Array.from(Buffer.from(key, 'hex')),
        )
        if (!verified) {
          return {}
        }
        return response
      }
      throw new Error(response.error.message)

    } catch (error) {
      console.error('Failed to sign message:', error)
      return {}
    }
  }

  const sendTx = async (payload: SendTxParams): Promise<any> => {
    if (typeof window === 'undefined') return null

    const provider = getProvider()
    if (!provider) return null

    try {
      const txHash = await provider.sendTransaction(payload)
      return txHash
    } catch (error) {
      console.error('Failed to send transaction:', error)
      return null
    }
  }

  const ensureTxDependencies = (): {
    isConnected: true;
    account: string;
  } => {
    if (!isConnected || !accountDetails?.address) {
      throw new Error('Wallet not connected')
    }

    return { isConnected, account: accountDetails.address }
  }

  const fetchViewFunction = async <T = unknown,>(body: ViewFunctionBody, abortController?: AbortController): Promise<T> => {
    try {
      const res = await fetch(`${supraConfig.rpc}/rpc/v2/view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: abortController?.signal,
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`HTTP error! status: ${res.status}, message: ${errorText}`)
      }

      const data = await res.json()
      return data
    } catch (error) {
      console.error('API call failed:', error)
      throw error
    }
  }

  const executeEntryFunction = async <T extends Uint8Array<ArrayBufferLike>[]>({
    contractAddress,
    moduleName,
    functionName,
    functionArgs,
    typeArgs = [],
    supraClient,
  }: EntryFunctionParams<T>): Promise<string> => {
    try {
      const { account } = ensureTxDependencies()
      // Use the account directly as string, HexString.ensure would be from supra-l1-sdk
      const senderAccount = account

      // Optional transaction payload arguments
      const optionalTransactionPayloadArgs = {}

      // Get account information
      const accountInfo = await supraClient.getAccountInfo(senderAccount)

      // Create serialized raw transaction object
      const rawTx = await supraClient.createSerializedRawTxObject(
        senderAccount,
        accountInfo.sequence_number,
        contractAddress,
        moduleName,
        functionName,
        typeArgs,
        functionArgs,
        optionalTransactionPayloadArgs,
      )

      // Convert to hex string
      const convertedToHexData = Buffer.from(rawTx).toString('hex')

      // Prepare transaction parameters
      const params: SendTxParams = {
        data: convertedToHexData,
        from: account,
        chainId,
        options: {
          waitForTransaction: true,
        },
      }

      // Send transaction (implement sendTx based on your setup)
      const txHash = await sendTx(params)
      if (txHash) {
        await updateBalance(account)
      }
      return txHash
    } catch (error) {
      throw error
    }
  }

  const executeViewFunction = async <TArgs extends unknown[] = unknown[], TResult = unknown>({
    contractAddress,
    moduleName,
    functionName,
    functionArgs = [] as unknown as TArgs,
    typeArgs = [],
    abortController,
  }: ViewFunctionParams<TArgs>): Promise<TResult> => {
    try {
      // Format the function identifier as "address::module::function"
      const functionIdentifier = `${contractAddress}::${moduleName}::${functionName}`

      // Prepare the request body
      const body: ViewFunctionBody = {
        function: functionIdentifier,
        type_arguments: typeArgs,
        arguments: functionArgs,
      }

      // Make the API call
      const response = await fetchViewFunction<TResult>(body, abortController)

      return response
    } catch (error) {
      console.error('View function execution failed:', error)
      throw error
    }
  }

  // Provide context value
  const contextValue: WalletContextType = {
    isConnected,
    isStarkeyInstalled,
    account: accountDetails?.address || null,
    domain: accountDetails?.domain || null,
    balance,
    chainId,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    updateBalance,
    signMessage,
    signMessageV2,
    ensureTxDependencies,
    executeViewFunction,
    executeEntryFunction,
    switchNetworkSupra,
    fetchTransactionScanURL,
  }

  return <WalletContext.Provider value={contextValue}>{children}</WalletContext.Provider>
}

// Custom hook to use WalletContext
export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a Starkey Wallet Provider')
  }
  return context
}
