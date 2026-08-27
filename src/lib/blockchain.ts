/**
 * Blockchain Content Verification System
 * 
 * Provides immutable content anchoring and verification:
 * - SHA-256 content hashing
 * - Simulated distributed ledger (hash chain)
 * - Public verification endpoint
 * - Audit trail for all transformations
 */

export interface BlockchainRecord {
  id: string;
  blockNumber: number;
  timestamp: string;
  contentHash: string;
  contentPreview: string;
  metadata: {
    type: "source" | "output" | "transformation";
    format?: string;
    sourceId?: string;
    projectId?: string;
    userId?: string;
  };
  previousHash: string;
  blockHash: string;
  verified: boolean;
}

export interface VerificationResult {
  valid: boolean;
  record: BlockchainRecord | null;
  chainValid: boolean;
  tamperDetected: boolean;
  message: string;
}

export interface ChainStats {
  totalBlocks: number;
  totalSources: number;
  totalOutputs: number;
  lastBlockTime: string;
  chainIntegrity: boolean;
}

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const CHAIN_KEY = "transformai_blockchain";
const COUNTER_KEY = "transformai_block_counter";

function getChain(): BlockchainRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CHAIN_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveChain(chain: BlockchainRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAIN_KEY, JSON.stringify(chain));
}

function getBlockCounter(): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(COUNTER_KEY) || "0", 10);
}

function incrementBlockCounter(): number {
  const current = getBlockCounter();
  const next = current + 1;
  localStorage.setItem(COUNTER_KEY, String(next));
  return next;
}

export async function anchorContent(
  content: string,
  metadata: BlockchainRecord["metadata"]
): Promise<BlockchainRecord> {
  const chain = getChain();
  const lastBlock = chain[chain.length - 1];
  const previousHash = lastBlock ? lastBlock.blockHash : "0".repeat(64);

  const contentHash = await sha256(content);
  const blockNumber = incrementBlockCounter();
  const timestamp = new Date().toISOString();

  const blockData = `${previousHash}|${contentHash}|${timestamp}|${blockNumber}`;
  const blockHash = await sha256(blockData);

  const record: BlockchainRecord = {
    id: `block_${blockNumber}_${Date.now().toString(36)}`,
    blockNumber,
    timestamp,
    contentHash,
    contentPreview: content.substring(0, 200) + (content.length > 200 ? "..." : ""),
    metadata,
    previousHash,
    blockHash,
    verified: true,
  };

  chain.push(record);
  saveChain(chain);

  return record;
}

export async function verifyContent(
  content: string,
  recordId?: string
): Promise<VerificationResult> {
  const chain = getChain();
  const contentHash = await sha256(content);

  let record = chain.find((r) => r.contentHash === contentHash);

  if (recordId) {
    const byId = chain.find((r) => r.id === recordId);
    if (byId) record = byId;
  }

  if (!record) {
    return {
      valid: false,
      record: null,
      chainValid: false,
      tamperDetected: false,
      message: "Content not found in blockchain. It may not have been anchored.",
    };
  }

  const contentMatches = record.contentHash === contentHash;
  const chainValid = verifyChainIntegrity(chain);

  if (!contentMatches) {
    return {
      valid: false,
      record,
      chainValid,
      tamperDetected: true,
      message: "TAMPER DETECTED: Content does not match blockchain record. This content has been modified since it was anchored.",
    };
  }

  return {
    valid: true,
    record,
    chainValid,
    tamperDetected: false,
    message: `Verified. Block #${record.blockNumber} -- Anchored at ${new Date(record.timestamp).toLocaleString()}`,
  };
}

export function verifyChainIntegrity(chain?: BlockchainRecord[]): boolean {
  const records = chain || getChain();
  for (let i = 1; i < records.length; i++) {
    if (records[i].previousHash !== records[i - 1].blockHash) {
      return false;
    }
  }
  return true;
}

export function getChainStats(): ChainStats {
  const chain = getChain();
  const sources = chain.filter((r) => r.metadata.type === "source").length;
  const outputs = chain.filter((r) => r.metadata.type === "output").length;

  return {
    totalBlocks: chain.length,
    totalSources: sources,
    totalOutputs: outputs,
    lastBlockTime: chain.length > 0 ? chain[chain.length - 1].timestamp : "Never",
    chainIntegrity: verifyChainIntegrity(chain),
  };
}

export function getAuditTrail(projectId?: string): BlockchainRecord[] {
  const chain = getChain();
  if (projectId) {
    return chain.filter((r) => r.metadata.projectId === projectId);
  }
  return chain;
}

export function getRecentBlocks(limit: number = 20): BlockchainRecord[] {
  return getChain().slice(-limit).reverse();
}

export function clearBlockchain(): void {
  localStorage.removeItem(CHAIN_KEY);
  localStorage.removeItem(COUNTER_KEY);
}
