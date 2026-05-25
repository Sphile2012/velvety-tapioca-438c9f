import {
  getHealthData,
  submitHealthData,
  detectFraud,
  detectSecurityAnomaly,
  authenticateUser,
  getAuditLogs,
} from "./api";

// Server functions for TanStack Start
// These run on the server and can be called from the client

export async function serverGetHealthData(userId: string) {
  "use server";
  return await getHealthData(userId);
}

export async function serverSubmitHealthData(data: any) {
  "use server";
  return await submitHealthData(data);
}

export async function serverDetectFraud(healthData: any) {
  "use server";
  return await detectFraud(healthData);
}

export async function serverDetectSecurity(healthData: any) {
  "use server";
  return await detectSecurityAnomaly(healthData);
}

export async function serverAuthenticateUser(credentials: { email: string; password: string }) {
  "use server";
  return await authenticateUser(credentials);
}

export async function serverGetAuditLogs(userId: string) {
  "use server";
  return await getAuditLogs(userId);
}
