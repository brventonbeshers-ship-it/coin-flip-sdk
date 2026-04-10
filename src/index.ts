import type { CoinFlipClient } from "./client";

export {
  CoinFlipClient,
  DEFAULT_CONFIG,
  callReadOnly,
  createFlipCall,
  getLeaderboard,
  getTotalFlips,
  getUserFlips,
  getUserLastSide,
} from "./client";

export type {
  CoinFlipConfig,
  LeaderEntry,
  ReadOnlyResponse,
  FlipCall,
} from "./types";

export type TotalFlipsResult = Awaited<
  ReturnType<CoinFlipClient["getTotalFlips"]>
>;
