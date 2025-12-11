# Supra DevTools Examples

Complete working examples with full TypeScript support for building Supra dApps.

## Examples Overview

All examples are built with React 19 and work seamlessly in both React and Next.js projects.

### 1. **Wallet Connection** (`01-WalletConnection.tsx`)
- Connect/disconnect wallet
- Check wallet installation
- Display account information
- Support for both Testnet and Mainnet

**Key Features:**
- Starkey wallet detection
- Network selection
- Error handling
- Responsive UI

**Use in React:**
```tsx
import WalletConnection from '@mrathod05/supra-devs/examples/01-WalletConnection'

export default function App() {
  return <WalletConnection />
}
```

**Use in Next.js (App Router):**
```tsx
import dynamic from 'next/dynamic'

const WalletConnection = dynamic(
  () => import('@mrathod05/supra-devs/examples/01-WalletConnection'),
  { ssr: false }
)

export default function Page() {
  return <WalletConnection />
}
```

---

### 2. **Balance Display** (`02-BalanceDisplay.tsx`)
- Fetch wallet balance
- Real-time balance updates
- Refresh functionality
- Error handling

**Key Features:**
- Automatic balance polling
- Formatted display
- Refresh button
- Account display

---

### 3. **Message Signing** (`03-MessageSigning.tsx`)
- Sign messages with wallet
- Support for V1 and V2 signing protocols
- Display signatures
- Signature verification

**Key Features:**
- Message input
- Protocol selection
- Signature display
- Public key display
- Error handling

---

### 4. **Network Switching** (`04-NetworkSwitching.tsx`)
- Switch between Testnet and Mainnet
- Display network information
- RPC endpoints
- Block explorer links

**Key Features:**
- Network configuration
- One-click switching
- RPC and explorer URLs
- Current network indicator

---

### 5. **Token Transfer** (`05-TokenTransfer.tsx`)
- Execute token transfers
- Input validation
- Transaction feedback
- Suprascan integration

**Key Features:**
- Recipient address input
- Amount conversion (SUPRA ↔ Quants)
- Transaction hash display
- Explorer link
- Loading states

---

### 6. **View Function Execution** (`06-ViewFunctionExecution.tsx`)
- Execute read-only view functions
- Blockchain data queries
- JSON response display
- Error handling

**Key Features:**
- View function calls
- Auto-refresh on account change
- Response formatting
- Error display

---

## Getting Started

### Installation

```bash
npm install @mrathod05/supra-devs
```

### Setup Provider (Required)

Wrap your app with `WalletProvider`:

**React:**
```tsx
import { WalletProvider } from '@mrathod05/supra-devs'
import App from './App'

export default function Root() {
  return (
    <WalletProvider>
      <App />
    </WalletProvider>
  )
}
```

**Next.js (App Router):**
```tsx
'use client'

import { WalletProvider } from '@mrathod05/supra-devs'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  )
}
```

### Use Examples

All examples are ready to use - just import and include in your components:

```tsx
import WalletConnection from '@mrathod05/supra-devs/examples/01-WalletConnection'
import BalanceDisplay from '@mrathod05/supra-devs/examples/02-BalanceDisplay'
import MessageSigner from '@mrathod05/supra-devs/examples/03-MessageSigning'

export default function Dashboard() {
  return (
    <>
      <WalletConnection />
      <BalanceDisplay />
      <MessageSigner />
    </>
  )
}
```

---

## React 19 Features Used

All examples leverage React 19 features:

- ✅ Automatic JSX transformation (no React import needed)
- ✅ Hooks (useState, useEffect, useContext)
- ✅ FC (FunctionComponent) type
- ✅ Type inference
- ✅ Use Client directive for browser-only components

---

## Next.js Compatibility

### App Router (Recommended)
```tsx
'use client'

import WalletConnection from '@mrathod05/supra-devs/examples/01-WalletConnection'

export default function Page() {
  return <WalletConnection />
}
```

### Pages Router
```tsx
import { useEffect } from 'react'
import WalletConnection from '@mrathod05/supra-devs/examples/01-WalletConnection'

export default function Page() {
  const [mounted, setMounted] = useEffect(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <WalletConnection />
}
```

### Dynamic Imports (SSR Disabled)
```tsx
import dynamic from 'next/dynamic'

const WalletConnection = dynamic(
  () => import('@mrathod05/supra-devs/examples/01-WalletConnection'),
  { ssr: false }
)

export default function Page() {
  return <WalletConnection />
}
```

---

## Styling

Examples use inline styles for maximum portability. To customize:

1. **Copy the component** to your project
2. **Modify styles** to match your design
3. **Use CSS modules** or Tailwind classes
4. **Add your branding** and styling

Example with Tailwind:
```tsx
<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
  {/* ... */}
</button>
```

---

## TypeScript Support

All examples include full TypeScript support:

```tsx
interface YourState {
  data: string
  loading: boolean
  error: string
}

const [state, setState] = React.useState<YourState>({
  data: '',
  loading: false,
  error: '',
})
```

---

## Common Patterns

### Error Handling
```tsx
try {
  await executeFunction()
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  setError(message)
}
```

### Loading States
```tsx
const [loading, setLoading] = useState(false)

const handleAction = async () => {
  setLoading(true)
  try {
    // ... perform action
  } finally {
    setLoading(false)
  }
}
```

### Conditional Rendering
```tsx
if (!isConnected) {
  return <p>Connect wallet first</p>
}

return <ComponentContent />
```

---

## API Reference

For detailed API documentation, see:
👉 [Full API Reference](https://github.com/mrathod05/supra-devs#api-reference)

## Support

- **Issues**: https://github.com/mrathod05/supra-devs/issues
- **Discussions**: https://github.com/mrathod05/supra-devs/discussions
- **Documentation**: https://github.com/mrathod05/supra-devs#readme

---

## License

MIT - See LICENSE file for details

---

**Last Updated:** December 11, 2025
**Framework Versions:** React 19+, Next.js 13+
