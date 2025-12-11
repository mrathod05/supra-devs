/**
 * Example: Message Signing
 * Demonstrates message signing with wallet verification
 * Works in both React and Next.js projects
 * 
 * @see https://github.com/mrathod05/supra-devs
 */

'use client'

import React, { useState, type FC } from 'react'
import { useWallet } from '@mrathod05/supra-devs'

interface SignatureResult {
    publicKey: string
    signature: string
}

/**
 * MessageSigner Component
 * Sign messages with wallet and display signature
 */
const MessageSigner: FC = () => {
    const { isConnected, signMessage, signMessageV2 } = useWallet()
    const [message, setMessage] = useState<string>('')
    const [signature, setSignature] = useState<SignatureResult | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [version, setVersion] = useState<'v1' | 'v2'>('v1')

    const handleSign = async (): Promise<void> => {
        if (!message.trim()) {
            alert('Please enter a message')
            return
        }

        setLoading(true)
        try {
            let result: SignatureResult | Record<string, never>

            if (version === 'v2') {
                result = await signMessageV2(message)
            } else {
                result = await signMessage(message)
            }

            if ('signature' in result && result.signature) {
                setSignature(result as SignatureResult)
            } else {
                alert('Failed to sign message')
            }
        } catch (error) {
            console.error('Failed to sign message:', error)
            alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    if (!isConnected) {
        return (
            <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <p style={{ color: '#666' }}>Connect your wallet to sign messages</p>
            </div>
        )
    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Sign Message</h2>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                    <strong>Signature Version:</strong>
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                            type="radio"
                            value="v1"
                            checked={version === 'v1'}
                            onChange={(e) => setVersion(e.target.value as 'v1' | 'v2')}
                        />
                        V1
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <input
                            type="radio"
                            value="v2"
                            checked={version === 'v2'}
                            onChange={(e) => setVersion(e.target.value as 'v1' | 'v2')}
                        />
                        V2
                    </label>
                </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                    <strong>Message:</strong>
                </label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter message to sign"
                    rows={4}
                    style={{
                        width: '100%',
                        padding: '10px',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                    }}
                />
            </div>

            <button
                onClick={handleSign}
                disabled={loading || !message.trim()}
                style={{
                    padding: '10px 20px',
                    backgroundColor: loading ? '#ccc' : '#4444ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                }}
            >
                {loading ? 'Signing...' : 'Sign Message'}
            </button>

            {signature && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    <h3>Signature Details</h3>

                    <div style={{ marginBottom: '15px' }}>
                        <strong>Public Key:</strong>
                        <code
                            style={{
                                display: 'block',
                                marginTop: '5px',
                                padding: '10px',
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                wordBreak: 'break-all',
                                fontSize: '12px',
                                overflowX: 'auto',
                            }}
                        >
                            {signature.publicKey}
                        </code>
                    </div>

                    <div>
                        <strong>Signature:</strong>
                        <code
                            style={{
                                display: 'block',
                                marginTop: '5px',
                                padding: '10px',
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                wordBreak: 'break-all',
                                fontSize: '12px',
                                overflowX: 'auto',
                            }}
                        >
                            {signature.signature}
                        </code>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MessageSigner
