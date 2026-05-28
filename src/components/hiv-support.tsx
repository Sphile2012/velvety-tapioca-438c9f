import { useState, useEffect } from "react";
import {
  serverGetHIVHealthRecord,
  serverGetCounselingSessions,
  serverGetWellnessMonitoring,
  serverGetARTAdherenceReminders,
  serverGetConfidentialResources,
  serverGetPersonalizedHealthGuidance,
  type HIVHealthRecord,
  type ConfidentialCounselingSession,
  type WellnessMonitoring,
  type ARTAdherenceReminder,
  type ConfidentialResource,
} from "@/lib/api";
import {
  Shield,
  Lock,
  Heart,
  Calendar,
  Activity,
  Phone,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  MessageCircle,
  FileText,
  Eye,
  EyeOff,
} from "lucide-react";

export function HIVSupport() {
  const [healthRecord, setHealthRecord] = useState<HIVHealthRecord | null>(null);
  const [counselingSessions, setCounselingSessions] = useState<ConfidentialCounselingSession[]>([]);
  const [wellnessLogs, setWellnessLogs] = useState<WellnessMonitoring[]>([]);
  const [reminders, setReminders] = useState<ARTAdherenceReminder[]>([]);
  const [resources, setResources] = useState<ConfidentialResource[]>([]);
  const [guidance, setGuidance] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [activeTab, setActiveTab] = useState<"health" | "counseling" | "wellness" | "resources">("health");

  useEffect(() => {
    loadHIVSupportData();
  }, []);

  async function loadHIVSupportData() {
    setLoading(true);
    try {
      const userId = "user-1";

      const [healthData, counselingData, wellnessData, remindersData, resourcesData, guidanceData] = await Promise.all([
        serverGetHIVHealthRecord(userId),
        serverGetCounselingSessions(userId),
        serverGetWellnessMonitoring(userId, new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0], new Date().toISOString().split("T")[0]),
        serverGetARTAdherenceReminders(userId, new Date().toISOString().split("T")[0]),
        serverGetConfidentialResources(),
        serverGetPersonalizedHealthGuidance(userId),
      ]);

      setHealthRecord(healthData);
      setCounselingSessions(counselingData);
      setWellnessLogs(wellnessData);
      setReminders(remindersData);
      setResources(resourcesData);
      setGuidance(guidanceData);
    } catch (error) {
      console.error("Failed to load HIV support data:", error);
    } finally {
      setLoading(false);
    }
  }

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case "maximum":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "enhanced":
        return "text-blue-600 bg-blue-50 border-blue-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Privacy Notice */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Secure HIV Support</h2>
          <p className="text-muted-foreground mt-1">Confidential healthcare support with encrypted records</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSensitiveData(!showSensitiveData)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-accent transition-colors"
          >
            {showSensitiveData ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="text-sm hidden sm:inline">{showSensitiveData ? "Hide" : "Show"} Details</span>
            <span className="text-sm sm:hidden">{showSensitiveData ? "Hide" : "Show"}</span>
          </button>
        </div>
      </div>

      {/* Privacy Banner */}
      <div className="p-4 rounded-lg bg-purple-50 border-2 border-purple-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <p className="font-semibold text-purple-900">Your Privacy is Protected</p>
            <p className="text-sm text-purple-700">
              All health records are encrypted and stored with maximum security. Your data is never shared without your explicit consent.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("health")}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === "health"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <Heart className="w-4 h-4 inline mr-2" />
          Health Record
        </button>
        <button
          onClick={() => setActiveTab("counseling")}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === "counseling"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <MessageCircle className="w-4 h-4 inline mr-2" />
          Counseling
        </button>
        <button
          onClick={() => setActiveTab("wellness")}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === "wellness"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <Activity className="w-4 h-4 inline mr-2" />
          Wellness
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === "resources"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <Phone className="w-4 h-4 inline mr-2" />
          Resources
        </button>
      </div>

      {/* Health Record Tab */}
      {activeTab === "health" && healthRecord && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Health Record</h3>
            <span className={`text-xs font-medium uppercase px-2 py-1 rounded-full ${getPrivacyLevelColor(healthRecord.privacyLevel)}`}>
              {healthRecord.privacyLevel} Privacy
            </span>
          </div>

          <div className="p-4 rounded-lg border bg-card">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Encrypted Status */}
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                <Lock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Encrypted</p>
                  <p className="text-xs text-muted-foreground">AES-256 encryption</p>
                </div>
              </div>

              {/* Diagnosis Date */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Diagnosis Date</p>
                <p className="font-medium">{new Date(healthRecord.diagnosisDate).toLocaleDateString()}</p>
              </div>

              {/* CD4 Count */}
              {showSensitiveData && healthRecord.currentCD4Count && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-muted-foreground">CD4 Count</p>
                  <p className="text-2xl font-bold text-green-700">{healthRecord.currentCD4Count}</p>
                  <p className="text-xs text-green-600">cells/mm³ - Normal range</p>
                </div>
              )}

              {/* Viral Load */}
              {showSensitiveData && healthRecord.viralLoad && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-muted-foreground">Viral Load</p>
                  <p className="text-2xl font-bold text-blue-700">{healthRecord.viralLoad}</p>
                  <p className="text-xs text-blue-600">copies/mL - Undetectable</p>
                </div>
              )}

              {/* ART Regimen */}
              {showSensitiveData && healthRecord.currentARTRegimen && (
                <div className="p-3 bg-muted/50 rounded-lg md:col-span-2">
                  <p className="text-sm text-muted-foreground">Current ART Regimen</p>
                  <p className="font-medium">{healthRecord.currentARTRegimen}</p>
                </div>
              )}

              {/* Adherence Rate */}
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-muted-foreground">Adherence Rate</p>
                <p className="text-2xl font-bold text-green-700">{healthRecord.adherenceRate}%</p>
                <p className="text-xs text-green-600">Excellent</p>
              </div>

              {/* Checkup Info */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Last Checkup</p>
                <p className="font-medium">{new Date(healthRecord.lastCheckup).toLocaleDateString()}</p>
                {healthRecord.nextCheckup && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Next: {new Date(healthRecord.nextCheckup).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {healthRecord.notes && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">{healthRecord.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Counseling Tab */}
      {activeTab === "counseling" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Confidential Counseling</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Calendar className="w-4 h-4" />
              Book Session
            </button>
          </div>

          <div className="grid gap-4">
            {counselingSessions.map((session) => (
              <div key={session.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <MessageCircle className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">{session.counselorName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.sessionDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs capitalize">{session.sessionType.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                  {session.isEncrypted && (
                    <div className="flex items-center gap-1 text-xs text-purple-600">
                      <Lock className="w-3 h-3" />
                      <span>Encrypted</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 mb-3">
                  <p className="text-sm font-medium">Topics Discussed:</p>
                  <div className="flex flex-wrap gap-2">
                    {session.topics.map((topic, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {session.followUpActions.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium">Follow-up Actions:</p>
                    <ul className="text-sm list-disc list-inside mt-1 space-y-1">
                      {session.followUpActions.map((action, i) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {session.nextSession && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Next session: {new Date(session.nextSession).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wellness Tab */}
      {activeTab === "wellness" && (
        <div className="space-y-6">
          {/* Today's Reminders */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Today's ART Reminders
            </h3>
            <div className="grid gap-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-lg border-2 ${reminder.taken
                      ? "text-green-600 bg-green-50 border-green-200"
                      : reminder.skipped
                        ? "text-red-600 bg-red-50 border-red-200"
                        : "text-gray-600 bg-gray-50 border-gray-200"
                    }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {reminder.taken ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : reminder.skipped ? (
                        <AlertCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                      <div>
                        <p className="font-medium">{reminder.medicationName}</p>
                        <p className="text-xs">
                          {new Date(reminder.scheduledTime).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm italic">{reminder.supportMessage}</p>
                  {reminder.takenAt && (
                    <p className="text-xs mt-2 text-muted-foreground">
                      Taken at {new Date(reminder.takenAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Wellness Monitoring */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Wellness Logs
            </h3>
            <div className="grid gap-3">
              {wellnessLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {new Date(log.timestamp).toLocaleDateString()} at{" "}
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Mood</p>
                      <p className="font-medium capitalize">{log.mood}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Energy</p>
                      <p className="font-medium capitalize">{log.energyLevel}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sleep</p>
                      <p className="font-medium capitalize">{log.sleepQuality}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Stress</p>
                      <p className="font-medium capitalize">{log.stressLevel}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center gap-2">
                      {log.medicationTaken ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className="text-sm">Medication taken</span>
                    </div>
                  </div>

                  {log.notes && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">{log.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Personalized Guidance */}
          {guidance && (
            <div className="space-y-4 pt-6 border-t">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Personalized Health Guidance
              </h3>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg border bg-card">
                  <p className="font-semibold mb-2">Adherence Tips</p>
                  <ul className="text-sm space-y-1">
                    {guidance.adherenceTips.map((tip: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <p className="font-semibold mb-2">Wellness Recommendations</p>
                  <ul className="text-sm space-y-1">
                    {guidance.wellnessRecommendations.map((rec: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <p className="font-semibold mb-2">Mental Health Support</p>
                  <ul className="text-sm space-y-1">
                    {guidance.mentalHealthSupport.map((support: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <Heart className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
                        <span>{support}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <p className="font-semibold mb-2">Nutrition Advice</p>
                  <ul className="text-sm space-y-1">
                    {guidance.nutritionAdvice.map((advice: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>{advice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Confidential Resources</h3>
          <p className="text-sm text-muted-foreground">
            Free, confidential support available 24/7. All services are stigma-free.
          </p>

          <div className="grid gap-4">
            {resources.map((resource) => (
              <div key={resource.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{resource.name}</p>
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {resource.is24_7 && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">24/7</span>
                    )}
                    {resource.isConfidential && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">Confidential</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {resource.languages.map((lang, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full">
                        {lang}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono font-bold">{resource.contact}</span>
                    <button className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                      Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Crisis Banner */}
          <div className="p-4 rounded-lg bg-red-50 border-2 border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900">In Crisis?</p>
                <p className="text-sm text-red-700">
                  If you're in immediate distress, please call the National AIDS Helpline at 0800-012-322 (toll-free, 24/7).
                  You are not alone. Help is available.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="p-4 rounded-lg bg-muted/50 border text-sm">
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="font-semibold">Confidential & Secure</p>
            <p className="text-muted-foreground">
              All data is encrypted and stored in compliance with healthcare privacy regulations. You have full control over who can access your information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
