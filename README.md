![npm](https://img.shields.io/npm/v/coin-flip-sdk?color=blueviolet) ![Stacks Mainnet](https://img.shields.io/badge/Stacks-Mainnet-blueviolet) ![license](https://img.shields.io/badge/license-MIT-blue)

# coin-flip-sdk

TypeScript SDK for interacting with the Coin Flip contract on Stacks.

## Installation

```bash
npm install coin-flip-sdk
```

## Usage

```ts
import { getLeaderboard, getTotalFlips, createFlipCall } from "coin-flip-sdk";

const total = await getTotalFlips();
const leaderboard = await getLeaderboard();
const tx = createFlipCall();
```

## License

MIT
