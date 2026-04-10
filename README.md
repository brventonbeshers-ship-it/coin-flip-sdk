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
