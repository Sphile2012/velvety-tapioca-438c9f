// Backend API functions for Aegis Health

export interface HealthData {
  userId: string;
  timestamp: string;
  vitals: {
    heartRate: number;
    hrv: number;
    spo2: number;
    stress: "low" | "moderate" | "high";
    sleep: string;
    mood: "energized" | "steady" | "tired" | "stressed";
  };
  activity: {
    steps: number;
    calories: number;
    activeMinutes: number;
    intensity: "low" | "moderate" | "high";
  };
  device: {
    id: string;
    vendor: string;
    model: string;
    location: string;
    battery: number;
    lastSynced: string;
  };
  reported: {
    steps: number;
    sleepHours: number;
    stressReported: "low" | "moderate" | "high";
    reportSource: "wearable" | "manual";
  };
  consent: {
    sharingLevel: "full" | "limited" | "emergency";
    lastUpdated: string;
    approvedByUser: boolean;
    scopes: string[];
  };
  accessContext?: {
    authMethod: string;
    loginLocation: string;
    deviceFingerprint: string;
    failedLoginAttempts: number;
    unknownDevice: boolean;
    impossibleTravel: boolean;
  };
  trends: {
    sleepQuality: number;
    stressLevels: number;
    activityConsistency: number;
    nutritionScore: number;
  };
}

export interface FraudDetectionResult {
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  flags: string[];
  explanation: string;
  escalated: boolean;
}

export interface SecurityAssessmentResult {
  riskLevel: "low" | "medium" | "high";
  confidence: number;
  flags: string[];
  explanation: string;
  escalated: boolean;
}

export interface AuthResult {
  success: boolean;
  token?: string;
  userId?: string;
  error?: string;
}

// Simulated backend functions (in production, these would call real APIs)

export async function getHealthData(userId: string): Promise<HealthData> {
  // Simulated API call
  return {
    userId,
    timestamp: new Date().toISOString(),
    vitals: {
      heartRate: 72,
      hrv: 45,
      spo2: 98,
      stress: "low",
      sleep: "7h 42m",
      mood: "steady",
    },
    activity: {
      steps: 8432,
      calories: 2450,
      activeMinutes: 45,
      intensity: "moderate",
    },
    device: {
      id: "wearable-365",
      vendor: "AegisBand",
      model: "A12 Pro",
      location: "Lagos, NG",
      battery: 82,
      lastSynced: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
    reported: {
      steps: 8200,
      sleepHours: 7.7,
      stressReported: "low",
      reportSource: "wearable",
    },
    consent: {
      sharingLevel: "full",
      lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      approvedByUser: true,
      scopes: ["activity", "sleep", "stress", "location"],
    },
    trends: {
      sleepQuality: 87,
      stressLevels: 42,
      activityConsistency: 78,
      nutritionScore: 65,
    },
  };
}

export async function submitHealthData(
  data: Partial<HealthData>,
): Promise<{ success: boolean; id: string }> {
  // Simulated API call
  return {
    success: true,
    id: crypto.randomUUID(),
  };
}

export async function detectFraud(healthData: HealthData): Promise<FraudDetectionResult> {
  const flags: string[] = [];
  const explanations: string[] = [];

  // Health-pattern checks
  if (healthData.activity.steps > 50000) {
    flags.push("Unrealistic step count detected");
    explanations.push("Step counts are far above your typical daily range.");
  }

  if (
    healthData.vitals.heartRate <= 60 &&
    healthData.vitals.spo2 === 100 &&
    healthData.vitals.stress === "low"
  ) {
    flags.push("Suspiciously perfect vitals pattern");
    explanations.push("Vitals are unusually ideal across multiple sensors.");
  }

  if (
    Math.abs(healthData.activity.steps - healthData.reported.steps) /
      Math.max(1, healthData.reported.steps) >
    0.35
  ) {
    flags.push("Wearable and self-reported data mismatch");
    explanations.push("Reported steps differ significantly from wearable telemetry.");
  }

  if (
    healthData.reported.reportSource === "manual" &&
    healthData.activity.intensity === "high" &&
    healthData.vitals.stress !== "high"
  ) {
    flags.push("Manual entry pattern inconsistent with observed intensity");
    explanations.push("Self-reported stress and wearable activity do not align.");
  }

  if (healthData.accessContext) {
    if (healthData.accessContext.unknownDevice) {
      flags.push("Unknown device used for access");
      explanations.push("A new or untrusted device accessed the account.");
    }
    if (healthData.accessContext.failedLoginAttempts >= 3) {
      flags.push("Repeated failed login attempts");
      explanations.push(
        "Multiple failed logins may indicate credential stuffing or account probing.",
      );
    }
    if (healthData.accessContext.impossibleTravel) {
      flags.push("Impossible travel detected");
      explanations.push("Login locations changed too quickly for human travel.");
    }
  }

  const riskLevel = flags.length === 0 ? "low" : flags.length === 1 ? "medium" : "high";
  const baseConfidence = 0.9;
  const confidence = Math.min(0.99, baseConfidence + flags.length * 0.02);

  return {
    riskLevel,
    confidence,
    flags,
    escalated: riskLevel === "high",
    explanation:
      flags.length > 0
        ? `Aegis detected ${flags.length} suspicious pattern${flags.length > 1 ? "s" : ""}: ${explanations.join(" ")}`
        : "Health and access signals appear consistent and within expected bounds.",
  };
}

export async function detectSecurityAnomaly(
  healthData: HealthData,
): Promise<SecurityAssessmentResult> {
  const flags: string[] = [];
  const explanations: string[] = [];

  if (!healthData.consent.approvedByUser) {
    flags.push("Consent missing or revoked");
    explanations.push("Data access is not authorized by the current consent record.");
  }

  if (healthData.accessContext) {
    if (healthData.accessContext.unknownDevice) {
      flags.push("Unknown device access");
      explanations.push("A device that has not been registered accessed the account.");
    }
    if (healthData.accessContext.failedLoginAttempts >= 3) {
      flags.push("Multiple failed logins");
      explanations.push(
        "Repeated failed login attempts may indicate an account compromise attempt.",
      );
    }
    if (healthData.accessContext.impossibleTravel) {
      flags.push("Impossible travel login pattern");
      explanations.push("The login sequence violates expected travel time between locations.");
    }
  }

  const riskLevel = flags.length === 0 ? "low" : flags.length === 1 ? "medium" : "high";
  const confidence = Math.min(0.98, 0.8 + flags.length * 0.05);

  return {
    riskLevel,
    confidence,
    flags,
    explanation:
      flags.length > 0
        ? `Detected ${flags.length} access or consent anomalies: ${explanations.join(" ")}`
        : "Security posture is strong and access patterns are consistent.",
    escalated: riskLevel === "high",
  };
}

export function isAuthorized(role: "member" | "provider" | "admin", scope: string): boolean {
  const permissions: Record<string, string[]> = {
    member: ["view:self", "share:consent"],
    provider: ["view:care-plan", "view:consent"],
    admin: ["view:any", "manage:access", "audit:logs"],
  };

  return permissions[role]?.includes(scope) ?? false;
}

export function createConsentSummary(data: HealthData) {
  return `This record is shared at ${data.consent.sharingLevel} level. Consent was last updated on ${new Date(
    data.consent.lastUpdated,
  ).toLocaleDateString()}. Approved by user: ${data.consent.approvedByUser ? "yes" : "no"}.`;
}

export async function authenticateUser(credentials: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  // Simulated authentication
  if (credentials.email && credentials.password) {
    return {
      success: true,
      token: "simulated-jwt-token",
      userId: "user-123",
    };
  }

  return {
    success: false,
    error: "Invalid credentials",
  };
}

export async function getAuditLogs(
  userId: string,
): Promise<Array<{ timestamp: string; action: string; details: string }>> {
  // Simulated audit logs
  return [
    {
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      action: "DATA_ACCESS",
      details: "Health data accessed by user",
    },
    {
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      action: "LOGIN_SUCCESS",
      details: "User authenticated via Face ID + WebAuthn",
    },
    {
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      action: "CONSENT_GRANTED",
      details: "Data sharing consent granted to Dr. Adeyemi",
    },
  ];
}

// Server functions with "use server" directive for TanStack Start
export async function serverGetHealthData(userId: string) {
  "use server";
  return await getHealthData(userId);
}

export async function serverSubmitHealthData(data: Partial<HealthData>) {
  "use server";
  return await submitHealthData(data);
}

export async function serverDetectFraud(healthData: HealthData) {
  "use server";
  return await detectFraud(healthData);
}

export async function serverAuthenticateUser(credentials: { email: string; password: string }) {
  "use server";
  return await authenticateUser(credentials);
}

export async function serverGetAuditLogs(userId: string) {
  "use server";
  return await getAuditLogs(userId);
}
