import type { StacksNetwork } from "@stacks/network";
import type { PostConditionMode } from "@stacks/transactions";

export interface CoinFlipConfig {
  contractAddress?: string;
  contractName?: string;
  apiBase?: string;
  network?: StacksNetwork;
}

export interface LeaderEntry {
  who: string;
  flips: number;
}

export interface ReadOnlyResponse {
  okay?: boolean;
  result?: string;
  cause?: string;
}

export interface FlipCall {
  contractAddress: string;
  contractName: string;
  functionName: "flip";
  functionArgs: [];
  postConditionMode: PostConditionMode;
  postConditions: [];
  network: StacksNetwork;
}
