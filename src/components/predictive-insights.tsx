import { AlertTriangle, TrendingUp, Lightbulb, ShieldAlert } from "lucide-react";
import { serverGeneratePredictiveInsights, serverGenerateEarlyWarnings, serverGetHealthData, type PredictiveInsight, type EarlyWarning, type HealthData } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";

export function PredictiveInsights() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [warnings, setWarnings] = useState<EarlyWarning[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPredictiveData = async () => {
      if (user) {
        try {
          // Simulated health data history
          const healthHistory = await Array.from({ length: 14 }, (_, i) => ({
            userId: user.id,
            timestamp: new Date(Date.now() - i * 86400000).toISOString(),
            vitals: {
              heartRate: 70 + Math.random() * 10,
              hrv: 40 + Math.random() * 10,
              spo2: 95 + Math.random() * 5,
              stress: Math.random() > 0.6 ? "low" : Math.random() > 0.3 ? "moderate" : "high" as "low" | "moderate" | "high",
              sleep: `${6 + Math.random() * 3}h ${Math.floor(Math.random() * 60)}m`,
              mood: "steady" as const,
            },
            activity: {
              steps: 5000 + Math.random() * 5000,
              calories: 2000 + Math.random() * 500,
              activeMinutes: 30 + Math.random() * 30,
              intensity: "moderate" as const,
            },
            device: {
              id: "wearable-365",
              vendor: "AegisBand",
              model: "A12 Pro",
              location: "Lagos, NG",
              battery: 80 + Math.random() * 20,
              lastSynced: new Date().toISOString(),
            },
            reported: {
              steps: 5000 + Math.random() * 5000,
              sleepHours: 6 + Math.random() * 3,
              stressReported: "low" as const,
              reportSource: "wearable" as const,
            },
            consent: {
              sharingLevel: "full" as const,
              lastUpdated: new Date().toISOString(),
              approvedByUser: true,
              scopes: ["activity", "sleep", "stress"],
            },
            trends: {
              sleepQuality: 80 + Math.random() * 20,
              stressLevels: 30 + Math.random() * 40,
              activityConsistency: 70 + Math.random() * 30,
              nutritionScore: 60 + Math.random() * 40,
            },
          }));

          const [predInsights, earlyWarnings] = await Promise.all([
            serverGeneratePredictiveInsights(user.id, healthHistory),
            serverGetHealthData(user.id).then(data => serverGenerateEarlyWarnings(data, healthHistory)),
          ]);
          setInsights(predInsights);
          setWarnings(earlyWarnings);
        } catch (error) {
          console.error("Failed to load predictive data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadPredictiveData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-card">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const hasAlerts = insights.length > 0 || warnings.length > 0;

  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Predictive Insights
      </h3>

      {!hasAlerts ? (
        <div className="text-center py-8">
          <ShieldAlert className="w-12 h-12 mx-auto mb-3 text-green-500" />
          <p className="text-sm text-muted-foreground">No concerns detected. Your health trends look positive!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {warnings.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Early Warnings
              </h4>
              <div className="space-y-2">
                {warnings.map((warning) => (
                  <div key={warning.id} className={`p-3 rounded-lg border ${
                    warning.urgency === "high" ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800" :
                    warning.urgency === "medium" ? "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800" :
                    "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800"
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground capitalize">{warning.metric.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Current: {warning.currentValue} • Threshold: {warning.threshold}
                        </p>
                        {warning.recommendedActions.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {warning.recommendedActions.map((action, i) => (
                              <li key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                                <Lightbulb className="w-3 h-3" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        warning.urgency === "high" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                        warning.urgency === "medium" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" :
                        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                      }`}>
                        {warning.urgency}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {insights.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-blue-500" />
                AI Predictions
              </h4>
              <div className="space-y-2">
                {insights.map((insight) => (
                  <div key={insight.id} className={`p-3 rounded-lg border ${
                    insight.severity === "high" ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800" :
                    insight.severity === "medium" ? "bg-orange-50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-800" :
                    "bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800"
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-foreground capitalize">{insight.category}</p>
                      <span className="text-xs text-muted-foreground">{Math.round(insight.confidence * 100)}% confidence</span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{insight.prediction}</p>
                    <p className="text-xs text-muted-foreground mb-2">{insight.historicalContext}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Timeframe: {insight.timeframe}</span>
                      {insight.preventiveActions.length > 0 && (
                        <span className="text-xs text-primary">{insight.preventiveActions.length} actions</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
