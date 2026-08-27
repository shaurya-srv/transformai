/**
 * Incident Response Chain
 *
 * Blockchain-backed incident lifecycle management.
 * Every action during incident response is recorded immutably.
 */

import { anchorContent } from "./blockchain";

export type IncidentSeverity = "P1-critical" | "P2-high" | "P3-medium" | "P4-low";
export type IncidentStatus = "detected" | "triaging" | "contained" | "eradicating" | "recovering" | "resolved" | "post-mortem";
export type IncidentAction = "created" | "escalated" | "assigned" | "notified" | "contained" | "patched" | "resolved" | "analyzed";

export interface IncidentEvent {
  id: string;
  action: IncidentAction;
  actor: string;
  role: string;
  description: string;
  timestamp: string;
  blockchainTxId?: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  affectedSystems: string[];
  assignedTo: string[];
  events: IncidentEvent[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  rootCause?: string;
  remediation?: string;
  blockchainAnchored: boolean;
}

const INCIDENT_KEY = "transformai_incidents";
let incidentCounter = 0;

function getIncidents(): Incident[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(INCIDENT_KEY) || "[]"); } catch { return []; }
}

function saveIncidents(incidents: Incident[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(INCIDENT_KEY, JSON.stringify(incidents));
}

async function addEventToIncident(
  incident: Incident,
  action: IncidentAction,
  actor: string,
  role: string,
  description: string
): Promise<IncidentEvent> {
  const event: IncidentEvent = {
    id: `IE-${Date.now().toString(36)}`,
    action,
    actor,
    role,
    description,
    timestamp: new Date().toISOString(),
  };

  // Anchor event to blockchain
  const block = await anchorContent(
    JSON.stringify({ incidentId: incident.id, action, actor, description, timestamp: event.timestamp }),
    { type: "transformation", format: "incident_event" }
  );
  event.blockchainTxId = block.id;

  incident.events.push(event);
  incident.updatedAt = new Date().toISOString();
  return event;
}

/**
 * Create a new incident
 */
export async function createIncident(
  title: string,
  severity: IncidentSeverity,
  description: string,
  affectedSystems: string[],
  createdBy: string,
  createdByRole: string
): Promise<Incident> {
  incidentCounter++;
  const incident: Incident = {
    id: `INC-${String(incidentCounter).padStart(4, "0")}`,
    title,
    severity,
    status: "detected",
    description,
    affectedSystems,
    assignedTo: [createdBy],
    events: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    blockchainAnchored: true,
  };

  await addEventToIncident(incident, "created", createdBy, createdByRole, `Incident created: ${title}`);

  const incidents = getIncidents();
  incidents.push(incident);
  saveIncidents(incidents);
  return incident;
}

/**
 * Update incident status
 */
export async function updateIncidentStatus(
  incidentId: string,
  newStatus: IncidentStatus,
  actor: string,
  role: string,
  description?: string
): Promise<Incident | null> {
  const incidents = getIncidents();
  const incident = incidents.find((i) => i.id === incidentId);
  if (!incident) return null;

  incident.status = newStatus;
  await addEventToIncident(incident, "notified", actor, role, description || `Status changed to ${newStatus}`);

  if (newStatus === "resolved") {
    incident.resolvedAt = new Date().toISOString();
  }

  saveIncidents(incidents);
  return incident;
}

/**
 * Add event to incident
 */
export async function addIncidentEvent(
  incidentId: string,
  action: IncidentAction,
  actor: string,
  role: string,
  description: string
): Promise<Incident | null> {
  const incidents = getIncidents();
  const incident = incidents.find((i) => i.id === incidentId);
  if (!incident) return null;

  await addEventToIncident(incident, action, actor, role, description);
  saveIncidents(incidents);
  return incident;
}

/**
 * Get all incidents
 */
export function getIncidentsList(): Incident[] {
  return getIncidents().reverse();
}

/**
 * Get incident stats
 */
export function getIncidentStats(): {
  total: number;
  active: number;
  resolved: number;
  critical: number;
  avgResolutionTime: string;
} {
  const incidents = getIncidents();
  const active = incidents.filter((i) => i.status !== "resolved" && i.status !== "post-mortem");
  const resolved = incidents.filter((i) => i.resolvedAt);
  const critical = incidents.filter((i) => i.severity === "P1-critical" && i.status !== "resolved");

  let avgMs = 0;
  if (resolved.length > 0) {
    const totalMs = resolved.reduce((sum, i) => {
      if (i.resolvedAt) return sum + (new Date(i.resolvedAt).getTime() - new Date(i.createdAt).getTime());
      return sum;
    }, 0);
    avgMs = totalMs / resolved.length;
  }

  const avgHours = Math.round(avgMs / (1000 * 60 * 60) * 10) / 10;

  return {
    total: incidents.length,
    active: active.length,
    resolved: resolved.length,
    critical: critical.length,
    avgResolutionTime: avgHours > 0 ? avgHours + "h" : "N/A",
  };
}

/**
 * Clear incidents (for testing)
 */
export function clearIncidents(): void {
  localStorage.removeItem(INCIDENT_KEY);
}
