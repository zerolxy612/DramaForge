# drama web3 AIGC short drama

Tech stack and scaffolding for a Web3 short-drama product where AIGC produces scripts/scenes and users mint/collect them on-chain.

## Architecture choices
- **Frontend:** Next.js (App Router, React 18, TypeScript) with Tailwind CSS for layout, RainbowKit + wagmi + viem for wallet UX, SSR-ready for SEO.
- **Contracts:** Hardhat (TypeScript) with OpenZeppelin base contracts; sample `ShortDramaHub` for publishing AIGC outputs (IPFS/Arweave CIDs) and emitting events for the frontend.
- **Package manager:** pnpm workspace (`apps/web`, `contracts`) to share tooling later.

## Getting started
1) Install deps once network is available:
   ```bash
   pnpm install
   ```
2) Frontend:
   ```bash
   cd apps/web
   pnpm dev
   ```
   Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` in `.env.local` for RainbowKit.
3) Contracts (Sepolia example):
   ```bash
   cd contracts
   cp .env.example .env
   pnpm test
   pnpm hardhat run scripts/deploy.ts --network sepolia
   ```

## Project layout
- `apps/web` – Next.js app with wallet connect, hero, and ready-to-plug AIGC API calls.
- `contracts` – Hardhat config + sample `ShortDramaHub.sol` and deploy script.

## Next steps
- Plug your AIGC backend (OpenAI/Claude/etc.) into `apps/web/app/page.tsx` action handlers.
- Add storage upload (e.g., web3.storage / pinata) and persist CID in `ShortDramaHub.publish`.
- Wire contract address/ABI into the frontend after deployment.
