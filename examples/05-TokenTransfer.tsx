/**
 * Example: Token Transfer
 * Demonstrates executing entry functions to transfer tokens
 * Works in both React and Next.js projects
 * 
 * @see https://github.com/mrathod05/supra-devs
 */

'use client'

import React, { useState, type FC } from 'react'
import { useWallet, toSupraQuant, fromSupraQuant, type EntryFunctionParams } from '@mrathod05/supra-devs'

interface TransferFormState {
    recipient: string
    amount: string
    txHash: string
    loading: boolean
    error: string
}

/**
 * TokenTransfer Component
 * Execute token transfer transactions
 */
const TokenTransfer: FC = () => {
    const { isConnected, account, executeEntryFunction, fetchTransactionScanURL, ensureTxDependencies } =
        useWallet()

    const [form, setForm] = useState<TransferFormState>({
        recipient: '',
        amount: '',
        txHash: '',
        loading: false,
        error: '',
    })

    const handleInputChange = (field: keyof Omit<TransferFormState, 'txHash' | 'loading' | 'error'>, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
            error: '', // Clear error when user modifies input
        }))
    }

    const handleTransfer = async (): Promise<void> => {
        if (!form.recipient.trim()) {
            setForm((prev) => ({ ...prev, error: 'Please enter recipient address' }))
            return
        }

        if (!form.amount || parseFloat(form.amount) <= 0) {
            setForm((prev) => ({ ...prev, error: 'Please enter valid amount' }))
            return
        }

        setForm((prev) => ({ ...prev, loading: true, error: '' }))

        try {
            // Ensure wallet is connected
            ensureTxDependencies()

            // Mock SupraClient for this example
            // In real usage, import from 'supra-l1-sdk'
            const mockSupraClient = {
                getAccountInfo: async () => ({ sequence_number: BigInt(0) }),
                createSerializedRawTxObject: async () => new Uint8Array(),
            }

            const quants = toSupraQuant(parseFloat(form.amount))

            const params: EntryFunctionParams<any[]> = {
                contractAddress: '0x1',
                moduleName: 'coin',
                functionName: 'transfer',
                functionArgs: [form.recipient, quants],
                typeArgs: ['0x1::supra_coin::SupraCoin'],
                supraClient: mockSupraClient,
            }

            const txHash = await executeEntryFunction(params)

            setForm((prev) => ({
                ...prev,
                txHash,
                recipient: '',
                amount: '',
            }))
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            setForm((prev) => ({
                ...prev,
                error: `Transfer failed: ${errorMessage}`,
            }))
        } finally {
            setForm((prev) => ({ ...prev, loading: false }))
        }
    }

    if (!isConnected) {
        return (
            <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <p style={{ color: '#666' }}>Connect your wallet to transfer tokens</p>
            </div>
        )
    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Token Transfer</h2>

            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <p style={{ margin: '0', fontSize: '12px' }}>
                    <strong>From:</strong> {account?.substring(0, 15)}...
                </p>
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                    <strong>Recipient Address:</strong>
                </label>
                <input
                    type="text"
                    value={form.recipient}
                    onChange={(e) => handleInputChange('recipient', e.target.value)}
                    placeholder="0x..."
                    style={{
                        width: '100%',
                        padding: '10px',
                        boxSizing: 'border-box',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                    }}
                />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                    <strong>Amount (SUPRA):</strong>
                </label>
                <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    style={{
                        width: '100%',
                        padding: '10px',
                        boxSizing: 'border-box',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '14px',
                    }}
                />
                {form.amount && (
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                        Quants: {toSupraQuant(parseFloat(form.amount))}
                    </p>
                )}
            </div>

            {form.error && (
                <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#ffcccc', borderRadius: '4px' }}>
                    <p style={{ margin: '0', color: '#cc0000', fontSize: '12px' }}>❌ {form.error}</p>
                </div>
            )}

            <button
                onClick={handleTransfer}
                disabled={form.loading || !form.recipient || !form.amount}
                style={{
                    padding: '10px 20px',
                    backgroundColor: form.loading ? '#ccc' : '#4444ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: form.loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    width: '100%',
                }}
            >
                {form.loading ? 'Processing Transfer...' : 'Transfer Tokens'}
            </button>

            {form.txHash && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#ccffcc', borderRadius: '4px' }}>
                    <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#00aa00' }}>
                        ✓ Transfer Successful!
                    </p>
                    <p style={{ margin: '0 0 10px 0', fontSize: '12px' }}>
                        <strong>Transaction Hash:</strong>
                        <code
                            style={{
                                display: 'block',
                                marginTop: '5px',
                                padding: '5px',
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                wordBreak: 'break-all',
                            }}
                        >
                            {form.txHash}
                        </code>
                    </p>
                    <a
                        href={fetchTransactionScanURL(form.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: '#4444ff',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: 'bold',
                        }}
                    >
                        View on Suprascan →
                    </a>
                </div>
            )}
        </div>
    )
}

export default TokenTransfer
