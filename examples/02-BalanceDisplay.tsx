/**
 * Example: Display Balance
 * Shows how to fetch and display wallet balance
 * Works in both React and Next.js projects
 * 
 * @see https://github.com/mrathod05/supra-devs
 */

'use client'

import React, { useEffect, type FC } from 'react'
import { useWallet } from '@mrathod05/supra-devs'

/**
 * BalanceDisplay Component
 * Fetches and displays current wallet balance
 */
const BalanceDisplay: FC = () => {
    const { isConnected, account, balance, updateBalance } = useWallet()

    useEffect(() => {
        if (isConnected && account) {
            updateBalance(account)
        }
    }, [isConnected, account, updateBalance])

    if (!isConnected) {
        return (
            <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <p style={{ color: '#666' }}>Connect your wallet to view balance</p>
            </div>
        )
    }

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Your Balance</h2>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4444ff', marginBottom: '10px' }}>
                {balance} SUPRA
            </div>
            <p style={{ color: '#666', fontSize: '14px' }}>
                Account: {account?.substring(0, 20)}...
            </p>
            <button
                onClick={() => account && updateBalance(account)}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#4444ff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginTop: '10px',
                }}
            >
                Refresh Balance
            </button>
        </div>
    )
}

export default BalanceDisplay
