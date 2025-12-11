# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-11

### Added

- **Initial Release** - Comprehensive Supra dApp development toolkit with React 19.2.1 support
- ✨ `useWallet` Hook - Complete wallet state management and operations
  - Wallet connection and disconnection
  - Account and balance management
  - Network switching functionality
  - Chain ID tracking
- 🔐 Message Signing
  - `signMessage()` - Sign messages with signature verification
  - `signMessageV2()` - V2 protocol message signing
- 📡 Blockchain Interactions
  - `executeEntryFunction()` - Execute state-changing contract functions
  - `executeViewFunction()` - Execute read-only contract functions
  - `ensureTxDependencies()` - Verify transaction prerequisites
- 🔄 Network Management
  - `switchNetwork()` - Switch between networks
  - `switchNetworkSupra()` - Supra-specific network switching
  - Support for Testnet (ID: 6) and Mainnet (ID: 8)
- 💰 Utility Functions
  - `toSupraQuant()` - Convert SUPRA to smallest units
  - `fromSupraQuant()` - Convert smallest units to SUPRA
  - `addAddressPadding()` - Pad addresses to 32 bytes
  - `remove0xPrefix()` - Remove hex prefix from strings
- 📊 Balance Management
  - Real-time balance fetching and updates
  - Automatic balance refresh on network changes
  - Debounced balance updates
- 🪙 Starkey Wallet Integration
  - Automatic wallet detection
  - Event listeners for account and network changes
  - Mobile redirect support
- 📦 Complete Type Definitions
  - Full TypeScript support
  - Comprehensive type exports
  - JSDoc documentation for all functions and types
- 📚 Documentation
  - Comprehensive README with quick start guide
  - Detailed API reference with examples
  - Usage examples for common scenarios
  - Network configuration documentation
- ⚙️ Project Setup
  - TypeScript configuration with JSX support
  - CommonJS output format
  - Declaration files generation
  - Source maps for debugging
  - Proper peer dependency configuration for React

### Features

- **React Context API** - Efficient state management using React Context
- **Client-side Rendering** - Use 'use client' directive for Next.js compatibility
- **Error Handling** - Comprehensive error handling with meaningful messages
- **Performance Optimizations**
  - useCallback memoization for functions
  - useRef for tracking async operations
  - Debounced balance updates
  - Interval-based wallet availability polling
- **Browser Support** - Works with all modern browsers (Chrome, Firefox, Safari, Edge)
- **Module System** - CommonJS export for Node.js/webpack environments

### Configuration

- React 19.2.1 with automatic JSX transformation
- Configured for CommonJS and ESM builds
- Node.js 16+ support
- TypeScript 5.8+
- Strict type checking enabled
- ES2020 target for modern JavaScript features

### Dependencies

- `supra-l1-sdk@^0.0.10` - Supra blockchain SDK
- `tweetnacl@^1.0.3` - Cryptographic operations

### Development Dependencies

- `typescript@^5.8.3` - TypeScript compiler
- `@types/node@^22.14.1` - Node.js type definitions
- `@types/react@^19.0.0` - React 19 type definitions
- `@types/tweetnacl@^1.0.3` - TweetNaCl type definitions
- `react@^19.2.1` - React 19.2.1 for development
- `react-dom@^19.2.1` - React DOM 19.2.1 for development

## Future Releases

### Planned for v1.1.0

- [ ] ESM (ES Modules) build output
- [ ] Enhanced error codes and documentation
- [ ] Transaction history tracking
- [ ] Gas estimation utilities
- [ ] Multiple wallet support (beyond Starkey)
- [ ] Unit tests and integration tests

### Planned for v2.0.0

- [ ] Native wallet provider for non-extension wallets
- [ ] WalletConnect integration
- [ ] Advanced transaction builder utilities
- [ ] Smart contract interaction helpers
- [ ] State management integration examples (Redux, Zustand)

## How to Upgrade

### From v0.x to v1.0.0

This is a major rewrite with significant improvements:

1. **Import paths unchanged** - All exports remain compatible
2. **New utilities** - Additional helper functions added
3. **Type improvements** - More specific TypeScript types
4. **Documentation** - Comprehensive API reference added

No breaking changes if you're using the basic wallet connection and hooks.

## Reporting Issues

If you encounter any issues, please:

1. Check existing GitHub issues
2. Provide a detailed description with reproduction steps
3. Include your environment details (OS, Node version, React version)
4. Share error messages and stack traces

## Support

For questions or suggestions, please open a GitHub discussion or issue on the [repository](https://github.com/mrathod05/supra-devs).
