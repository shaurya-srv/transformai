/**
 * Multi-Signature Approval System
 *
 * Enterprise content approval workflow with blockchain-backed audit trail.
 * Content requires N-of-M approvers before it can be published/exported.
 */

import { anchorContent } from "./blockchain";

export type ApprovalRole = "legal" | "pr" | "security" | "engineering" | "executive" | "compliance";

export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired";

export interface Approver {
  id: string;
  name: string;
  role: ApprovalRole;
  avatar?: string;
}

export interface ApprovalSignature {
  approverId: string;
  approverName: string;
  role: ApprovalRole;
  status: ApprovalStatus;
  timestamp: string;
  comment?: string;
  blockchainTxId?: string;
}

export interface ApprovalPolicy {
  id: string;
  name: string;
  description: string;
  requiredRoles: ApprovalRole[];
  minSignatures: number;
  maxDaysToApprove: number;
  autoExpire: boolean;
}

export interface ApprovalRequest {
  id: string;
  contentId: string;
  contentTitle: string;
  contentPreview: string;
  contentType: string;
  policy: ApprovalPolicy;
  signatures: ApprovalSignature[];
  status: "pending" | "approved" | "rejected" | "expired";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  requiredSignatures: number;
  currentSignatures: number;
  blockchainAnchored: boolean;
}

// Predefined enterprise policies
export const APPROVAL_POLICIES: ApprovalPolicy[] = [
  {
    id: "external-comms",
    name: "External Communications",
    description: "All public-facing content requires Legal + PR + Security sign-off.",
    requiredRoles: ["legal", "pr", "security"],
    minSignatures: 3,
    maxDaysToApprove: 3,
    autoExpire: true,
  },
  {
    id: "security-advisory",
    name: "Security Advisory",
    description: "Security advisories require Security + Legal + Executive approval.",
    requiredRoles: ["security", "legal", "executive"],
    minSignatures: 3,
    maxDaysToApprove: 1,
    autoExpire: true,
  },
  {
    id: "customer-notification",
    name: "Customer Notification",
    description: "Customer-facing notifications need Compliance + PR approval.",
    requiredRoles: ["compliance", "pr"],
    minSignatures: 2,
    maxDaysToApprove: 2,
    autoExpire: true,
  },
  {
    id: "internal-only",
    name: "Internal Content",
    description: "Internal documents need one manager approval.",
    requiredRoles: ["engineering"],
    minSignatures: 1,
    maxDaysToApprove: 7,
    autoExpire: false,
  },
  {
    id: "incident-response",
    name: "Incident Response",
    description: "Incident reports need Security + Executive fast-track approval.",
    requiredRoles: ["security", "executive"],
    minSignatures: 2,
    maxDaysToApprove: 1,
    autoExpire: true,
  },
];

// Default approvers for demo
export const DEFAULT_APPROVERS: Approver[] = [
  { id: "app-1", name: "Sarah Chen", role: "legal", avatar: "SC" },
  { id: "app-2", name: "Marcus Webb", role: "pr", avatar: "MW" },
  { id: "app-3", name: "Priya Sharma", role: "security", avatar: "PS" },
  { id: "app-4", name: "James Liu", role: "executive", avatar: "JL" },
  { id: "app-5", name: "Ana Rodriguez", role: "compliance", avatar: "AR" },
  { id: "app-6", name: "Dev Patel", role: "engineering", avatar: "DP" },
];

let requestCounter = 0;

// Storage
const REQUEST_KEY = "transformai_approval_requests";

function getRequests(): ApprovalRequest[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(REQUEST_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRequests(requests: ApprovalRequest[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REQUEST_KEY, JSON.stringify(requests));
}

/**
 * Create a new approval request
 */
export async function createApprovalRequest(
  contentTitle: string,
  contentPreview: string,
  contentFull: string,
  contentType: string,
  policyId: string,
  createdBy: string
): Promise<ApprovalRequest> {
  const policy = APPROVAL_POLICIES.find((p) => p.id === policyId) || APPROVAL_POLICIES[0];
  requestCounter++;

  // Anchor content to blockchain
  const blockRecord = await anchorContent(contentFull, {
    type: "transformation",
    format: contentType,
  });

  const request: ApprovalRequest = {
    id: `AR-${String(requestCounter).padStart(4, "0")}`,
    contentId: `content_${Date.now()}`,
    contentTitle,
    contentPreview,
    contentType,
    policy,
    signatures: [],
    status: "pending",
    createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    requiredSignatures: policy.minSignatures,
    currentSignatures: 0,
    blockchainAnchored: true,
  };

  const requests = getRequests();
  requests.push(request);
  saveRequests(requests);

  return request;
}

/**
 * Approve or reject a request
 */
export async function signRequest(
  requestId: string,
  approverId: string,
  approverName: string,
  role: ApprovalRole,
  decision: "approved" | "rejected",
  comment?: string
): Promise<ApprovalRequest | null> {
  const requests = getRequests();
  const request = requests.find((r) => r.id === requestId);
  if (!request) return null;

  // Create signature
  const signature: ApprovalSignature = {
    approverId,
    approverName,
    role,
    status: decision,
    timestamp: new Date().toISOString(),
    comment,
  };

  // Anchor signature to blockchain
  const sigBlock = await anchorContent(
    JSON.stringify({ requestId, approverId, decision, timestamp: signature.timestamp }),
    { type: "transformation", format: "approval_signature" }
  );
  signature.blockchainTxId = sigBlock.id;

  // Update signatures
  request.signatures.push(signature);
  request.currentSignatures = request.signatures.filter((s) => s.status === "approved").length;
  request.updatedAt = new Date().toISOString();

  // Check if any signature is rejection
  if (decision === "rejected") {
    request.status = "rejected";
  }
  // Check if enough approvals
  else if (request.currentSignatures >= request.requiredSignatures) {
    request.status = "approved";
  }

  saveRequests(requests);
  return request;
}

/**
 * Get all approval requests
 */
export function getApprovalRequests(): ApprovalRequest[] {
  return getRequests().reverse();
}

/**
 * Get pending requests count
 */
export function getPendingCount(): number {
  return getRequests().filter((r) => r.status === "pending").length;
}

/**
 * Check if a specific role has already signed
 */
export function hasRoleSigned(request: ApprovalRequest, role: ApprovalRole): boolean {
  return request.signatures.some((s) => s.role === role && s.status !== "rejected");
}

/**
 * Clear all requests (for testing)
 */
export function clearApprovalRequests(): void {
  localStorage.removeItem(REQUEST_KEY);
}
