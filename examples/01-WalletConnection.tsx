/**
 * Example: Basic Wallet Connection
 * Demonstrates how to connect and disconnect wallet
 * Works in both React and Next.js projects
 * 
 * @see https://github.com/mrathod05/supra-devs
 */

'use client'

import React, { type FC } from 'react'
import { useWallet } from '@mrathod05/supra-devs'

/**
 * WalletConnection Component
 * Basic wallet connection/disconnection UI
 */
const WalletConnection: FC = () => {
    const { isConnected, account, connectWallet, disconnectWallet, isStarkeyInstalled } = useWallet()

    const handleConnect = async (networkId: string): Promise<void> => {
        try {
            await connectWallet(networkId)
        } catch (error) {
            console.error('Failed to connect wallet:', error)
        }
    }

    if (!isStarkeyInstalled) {
        return (
            <div style={{ padding: '20px', border: '1px solid #ff6b6b', borderRadius: '8px' }}>
                <p style={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                    ⚠️ Starkey Wallet is not installed
                </p>
                <p>
                    Please install the <a href="https://starkey.app" target="_blank" rel="noopener noreferrer">
                        Starkey Wallet Extension
                    </a>
                    {' '}to use this dApp
                </p>
            </div>
        )
    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Wallet Connection</h2>
            {isConnected ? (
                <>
                    <div style={{ marginBottom: '15px' }}>
                        <p>
                            <strong>Status:</strong> <span style={{ color: '#51cf66' }}>✓ Connected</span>
                        </p>
                        <p>
                            <strong>Account:</strong> {account?.substring(0, 10)}...{account?.substring(account.length - 4)}
                        </p>
                    </div>
                    <button
                        onClick={() => disconnectWallet()}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#ff4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px',
                        }}
                    >
                        Disconnect Wallet
                    </button>
                </>
            ) : (
                <>
                    <p style={{ marginBottom: '15px' }}>
                        <strong>Status:</strong> <span style={{ color: '#ff6b6b' }}>✗ Not Connected</span>
                    </p>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                            onClick={() => handleConnect('8')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#4444ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            Connect to Mainnet
                        </button>
                        <button
                            onClick={() => handleConnect('6')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#44ff44',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '14px',
                            }}
                        >
                            Connect to Testnet
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default WalletConnection
