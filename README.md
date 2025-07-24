# BitLoan - DeFi Lending on Internet Computer Protocol

BitLoan is a decentralized finance (DeFi) lending platform built on the Internet Computer Protocol (ICP). It allows users to deposit cryptocurrency as collateral and borrow assets based on AI-powered risk assessment.

## Features

- Deposit cryptocurrency as collateral
- Borrow assets against your collateral
- AI-powered risk assessment
- Real-time monitoring of collateral ratios
- Repayment of loans with interest

## Project Structure

- **Frontend**: Next.js application with React components
- **Backend**: Internet Computer canisters written in Motoko

## Development

### Prerequisites

- [DFINITY Canister SDK (dfx)](https://sdk.dfinity.org/docs/quickstart/local-quickstart.html)
- Node.js and npm/pnpm

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   pnpm install
   ```
3. Start the local Internet Computer replica:
   ```
   dfx start --background
   ```
4. Deploy the canisters:
   ```
   dfx deploy
   ```
5. Start the frontend development server:
   ```
   pnpm run dev
   ```

## License

MIT
