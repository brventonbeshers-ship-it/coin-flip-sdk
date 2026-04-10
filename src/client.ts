import { STACKS_MAINNET } from "@stacks/network";
import {
  PostConditionMode,
  cvToValue,
  hexToCV,
  principalCV,
  serializeCV,
} from "@stacks/transactions";
import type {
  CoinFlipConfig,
  LeaderEntry,
  ReadOnlyResponse,
  FlipCall,
} from "./types";

export const DEFAULT_CONFIG: Required<CoinFlipConfig> = {
  contractAddress: "SP1Q7YR67R6WGP28NXDJD1WZ11REPAAXRJJ3V6RKM",
  contractName: "coin-flip",
  apiBase: "https://api.mainnet.hiro.so",
  network: STACKS_MAINNET,
};

function resolveConfig(overrides: CoinFlipConfig = {}): Required<CoinFlipConfig> {
  return { ...DEFAULT_CONFIG, ...overrides };
}

function serializeCvToHex(cv: unknown): string {
  const serialized = serializeCV(cv as never);
  if (typeof serialized === "string") {
    return serialized.startsWith("0x") ? serialized : `0x${serialized}`;
  }
  return `0x${Buffer.from(serialized).toString("hex")}`;
}

export async function callReadOnly(
  functionName: string,
  args: string[] = [],
  config: CoinFlipConfig = {}
): Promise<ReadOnlyResponse> {
  const resolved = resolveConfig(config);
  const response = await fetch(
    `${resolved.apiBase}/v2/contracts/call-read/${resolved.contractAddress}/${resolved.contractName}/${functionName}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: resolved.contractAddress,
        arguments: args,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Read-only call failed with status ${response.status}`);
  }

  return response.json() as Promise<ReadOnlyResponse>;
}

function normalizeLeaderboardValue(raw: unknown): LeaderEntry[] {
  const entries = Array.isArray(raw) ? raw : [];

  return entries
    .map(item => {
      const entry =
        item && typeof item === "object" && "value" in item
          ? (item as { value: unknown }).value
          : item;
      const record = entry as {
        who?: { value?: string } | string;
        flips?: { value?: string | number } | string | number;
      };

      return {
        who: String(record?.who && typeof record.who === "object" ? record.who.value ?? "" : record?.who ?? ""),
        flips: Number(
          record?.flips && typeof record.flips === "object"
            ? record.flips.value ?? 0
            : record?.flips ?? 0
        ),
      };
    })
    .filter(entry => entry.who && entry.flips > 0);
}

export async function getTotalFlips(config: CoinFlipConfig = {}): Promise<number> {
  const data = await callReadOnly("get-total-flips", [], config);
  if (!data.okay || !data.result) {
    return 0;
  }

  const clarityValue = hexToCV(data.result);
  const parsed = cvToValue(clarityValue, true) as { value?: unknown } | unknown;
  return Number(
    parsed && typeof parsed === "object" && "value" in parsed
      ? parsed.value ?? 0
      : parsed ?? 0
  );
}

export async function getUserFlips(
  userAddress: string,
  config: CoinFlipConfig = {}
): Promise<number> {
  const principalArg = serializeCvToHex(principalCV(userAddress));
  const data = await callReadOnly("get-user-flips", [principalArg], config);
  if (!data.okay || !data.result) {
    return 0;
  }

  const clarityValue = hexToCV(data.result);
  const parsed = cvToValue(clarityValue, true) as { value?: unknown } | unknown;
  return Number(
    parsed && typeof parsed === "object" && "value" in parsed
      ? parsed.value ?? 0
      : parsed ?? 0
  );
}

export async function getUserLastSide(
  userAddress: string,
  config: CoinFlipConfig = {}
): Promise<number> {
  const principalArg = serializeCvToHex(principalCV(userAddress));
  const data = await callReadOnly("get-user-last-side", [principalArg], config);
  if (!data.okay || !data.result) {
    return 0;
  }

  const clarityValue = hexToCV(data.result);
  const parsed = cvToValue(clarityValue, true) as { value?: unknown } | unknown;
  return Number(
    parsed && typeof parsed === "object" && "value" in parsed
      ? parsed.value ?? 0
      : parsed ?? 0
  );
}

export async function getLeaderboard(
  config: CoinFlipConfig = {}
): Promise<LeaderEntry[]> {
  const data = await callReadOnly("get-leaderboard", [], config);
  if (!data.okay || !data.result) {
    return [];
  }

  const clarityValue = hexToCV(data.result);
  const parsed = cvToValue(clarityValue, true);
  return normalizeLeaderboardValue(parsed);
}

export function createFlipCall(config: CoinFlipConfig = {}): FlipCall {
  const resolved = resolveConfig(config);
  return {
    contractAddress: resolved.contractAddress,
    contractName: resolved.contractName,
    functionName: "flip",
    functionArgs: [],
    postConditionMode: PostConditionMode.Deny,
    postConditions: [],
    network: resolved.network,
  };
}

export class CoinFlipClient {
  private readonly config: Required<CoinFlipConfig>;

  constructor(config: CoinFlipConfig = {}) {
    this.config = resolveConfig(config);
  }

  getTotalFlips(): Promise<number> {
    return getTotalFlips(this.config);
  }

  getUserFlips(userAddress: string): Promise<number> {
    return getUserFlips(userAddress, this.config);
  }

  getUserLastSide(userAddress: string): Promise<number> {
    return getUserLastSide(userAddress, this.config);
  }

  getLeaderboard(): Promise<LeaderEntry[]> {
    return getLeaderboard(this.config);
  }

  createFlipCall(): FlipCall {
    return createFlipCall(this.config);
  }
}
