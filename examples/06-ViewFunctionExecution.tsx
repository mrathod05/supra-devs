/**
 * Example: View Function Execution
 * Demonstrates reading blockchain data with view functions
 * Works in both React and Next.js projects
 * 
 * @see https://github.com/mrathod05/supra-devs
 */

'use client'

import React, { useEffect, useState, type FC } from 'react'
import { useWallet, type ViewFunctionParams } from '@mrathod05/supra-devs'

interface ViewFunctionState {
    data: string
    loading: boolean
    error: string
}

/**
 * ViewFunctionExample Component
 * Execute view functions to read blockchain data
 */
const ViewFunctionExample: FC = () => {
    const { isConnected, account, executeViewFunction } = useWallet()
    const [state, setState] = useState<ViewFunctionState>({
        data: '',
        loading: false,
        error: '',
    })

    useEffect(() => {
        if (!isConnected || !account) return

        const fetchData = async (): Promise<void> => {
            setState({ data: '', loading: true, error: '' })

            try {
                const params: ViewFunctionParams = {
                    contractAddress: '0x1',
                    moduleName: 'coin',
                    functionName: 'balance',
                    functionArgs: [account],
                    typeArgs: ['0x1::supra_coin::SupraCoin'],
                }

                const result = await executeViewFunction(params)

                setState({
                    data: JSON.stringify(result, null, 2),
                    loading: false,
                    error: '',
                })
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data'
                setState({
                    data: '',
                    loading: false,
                    error: errorMessage,
                })
            }
        }

        fetchData()
    }, [isConnected, account, executeViewFunction])

    if (!isConnected) {
        return (
            <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <p style={{ color: '#666' }}>Connect your wallet to view blockchain data</p>
            </div>
        )
    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>View Function Execution</h2>

            <div style={{ marginBottom: '15px' }}>
                <p>
                    <strong>Function:</strong> <code>0x1::coin::balance&lt;0x1::supra_coin::SupraCoin&gt;</code>
                </p>
                <p>
                    <strong>Account:</strong> <code>{account}</code>
                </p>
            </div>

            {state.loading && (
                <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                    <p style={{ margin: '0', color: '#1976d2' }}>Loading blockchain data...</p>
                </div>
            )}

            {state.error && (
                <div style={{ padding: '15px', backgroundColor: '#ffcccc', borderRadius: '4px' }}>
                    <p style={{ margin: '0', color: '#cc0000', fontSize: '12px' }}>
                        ❌ Error: {state.error}
                    </p>
                </div>
            )}

            {state.data && (
                <div>
                    <h3>Response Data</h3>
                    <pre
                        style={{
                            padding: '15px',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            overflowX: 'auto',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                        }}
                    >
                        {state.data}
                    </pre>
                </div>
            )}

            <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                    💡 <strong>Tip:</strong> View functions are read-only and don't require transactions.
                </p>
            </div>
        </div>
    )
}

export default ViewFunctionExample
