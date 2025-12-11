/**
 * Example: Network Switching
 * Demonstrates switching between Supra networks
 * Works in both React and Next.js projects
 * 
 * @see https://github.com/mrathod05/supra-devs
 */

'use client'

import React, { type FC } from 'react'
import { useWallet, type SupraChainId } from '@mrathod05/supra-devs'

interface NetworkConfig {
    id: SupraChainId
    name: string
    rpc: string
    explorer: string
}

const NETWORKS: NetworkConfig[] = [
    {
        id: '6',
        name: 'Testnet',
        rpc: 'https://rpc-testnet.supra.com',
        explorer: 'https://testnet.suprascan.io',
    },
    {
        id: '8',
        name: 'Mainnet',
        rpc: 'https://rpc.supra.com',
        explorer: 'https://suprascan.io',
    },
]

/**
 * NetworkSwitcher Component
 * Switch between Supra networks
 */
const NetworkSwitcher: FC = () => {
    const { isConnected, chainId, switchNetwork } = useWallet()

    const currentNetwork = NETWORKS.find((n) => n.id === chainId)
    const otherNetwork = NETWORKS.find((n) => n.id !== chainId)

    const handleSwitch = async (): Promise<void> => {
        if (!otherNetwork) return

        try {
            await switchNetwork(otherNetwork.id)
        } catch (error) {
            console.error('Failed to switch network:', error)
            alert(`Failed to switch network: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    if (!isConnected) {
        return (
            <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <p style={{ color: '#666' }}>Connect your wallet to manage networks</p>
            </div>
        )
    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Network Management</h2>

            <div style={{ marginBottom: '20px' }}>
                <h3>Current Network</h3>
                <div
                    style={{
                        padding: '15px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px',
                        border: '2px solid #4444ff',
                    }}
                >
                    <p style={{ marginBottom: '5px' }}>
                        <strong>{currentNetwork?.name}</strong> <span style={{ color: '#4444ff' }}>●</span>
                    </p>
                    <p style={{ color: '#666', fontSize: '12px', marginBottom: '5px' }}>
                        RPC: <code>{currentNetwork?.rpc}</code>
                    </p>
                    <a
                        href={currentNetwork?.explorer}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#4444ff', fontSize: '12px', textDecoration: 'none' }}
                    >
                        View on Suprascan →
                    </a>
                </div>
            </div>

            <div>
                <h3>Available Networks</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {NETWORKS.map((network) => (
                        <div
                            key={network.id}
                            style={{
                                padding: '10px',
                                border: network.id === chainId ? '2px solid #4444ff' : '1px solid #ddd',
                                borderRadius: '4px',
                                backgroundColor: network.id === chainId ? '#f0f0ff' : 'white',
                            }}
                        >
                            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                                {network.name}
                            </p>
                            {network.id !== chainId && (
                                <button
                                    onClick={handleSwitch}
                                    style={{
                                        padding: '8px 12px',
                                        backgroundColor: '#44ff44',
                                        color: 'black',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        width: '100%',
                                    }}
                                >
                                    Switch to {network.name}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                <p style={{ margin: '0', fontSize: '12px' }}>
                    ⚠️ Switching networks requires wallet interaction. Make sure your wallet is connected.
                </p>
            </div>
        </div>
    )
}

export default NetworkSwitcher
