import { useState, useEffect } from "react";
import {
  serverAnalyzeCommunityHealthMetrics,
  serverGenerateCommunityHealthInsights,
  serverGetActivePublicHealthAlerts,
  type CommunityHealthMetrics,
  type CommunityHealthInsight,
  type PublicHealthAlert
} from "@/lib/api";
import { Activity, AlertTriangle, TrendingUp, TrendingDown, MapPin, Users, Heart, Shield, Bell } from "lucide-react";

export function CommunityIntelligence() {
  const [metrics, setMetrics] = useState<CommunityHealthMetrics | null>(null);
  const [insights, setInsights] = useState<CommunityHealthInsight[]>([]);
  const [alerts, setAlerts] = useState<PublicHealthAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion] = useState("Johannesburg");

  useEffect(() => {
    loadCommunityData();
  }, [selectedRegion]);

  async function loadCommunityData() {
    setLoading(true);
    try {
      const [metricsData, insightsData, alertsData] = await Promise.all([
        serverAnalyzeCommunityHealthMetrics(selectedRegion),
        serverGenerateCommunityHealthInsights(selectedRegion),
        serverGetActivePublicHealthAlerts(selectedRegion),
      ]);
      setMetrics(metricsData);
      setInsights(insightsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error("Failed to load community data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "moderate": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === "improving" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : trend === "declining" ? (
      <TrendingDown className="h-4 w-4 text-red-600" />
    ) : (
      <Activity className="h-4 w-4 text-gray-600" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI for Safer Communities</h2>
          <p className="text-muted-foreground mt-1">Real-time community health intelligence and safety alerts</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{selectedRegion}</span>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Active Public Health Alerts
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-semibold capitalize">{alert.alertType.replace(/_/g, " ")}</span>
                  </div>
                  <span className="text-xs font-medium uppercase">{alert.severity}</span>
                </div>
                <p className="text-sm mb-3">{alert.description}</p>
                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="font-medium">Affected Areas:</span> {alert.affectedAreas.join(", ")}
                  </div>
                  <div className="text-xs">
                    <span className="font-medium">Recommended Actions:</span>
                  </div>
                  <ul className="text-xs list-disc list-inside space-y-1">
                    {alert.recommendedActions.map((action: string, i: number) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                  {alert.resources.length > 0 && (
                    <div className="text-xs pt-2 border-t">
                      <span className="font-medium">Resources:</span>
                      <div className="mt-1 space-y-1">
                        {alert.resources.map((resource: { name: string; contact: string; type: string }, i: number) => (
                          <div key={i} className="flex justify-between">
                            <span>{resource.name}</span>
                            <span className="font-mono">{resource.contact}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community Health Metrics */}
      {metrics && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Community Health Metrics
          </h3>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[
              { label: "Average Stress Level", value: metrics.averageStressLevel, icon: Activity, max: 100 },
              { label: "Sleep Quality", value: metrics.averageSleepQuality, icon: Heart, max: 100 },
              { label: "Activity Level", value: metrics.averageActivityLevel, icon: Users, max: 100 },
              { label: "Mental Health Score", value: metrics.averageMentalHealthScore, icon: Shield, max: 100 },
            ].map((metric) => (
              <div key={metric.label} className="p-4 rounded-lg bg-card border">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-1">
                    {getTrendIcon(metrics.trendDirection)}
                  </div>
                </div>
                <div className="text-2xl font-bold">{metric.value}%</div>
                <div className="text-xs text-muted-foreground">{metric.label}</div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community Insights */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            AI-Generated Community Insights
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border-2 ${getSeverityColor(insight.severity)}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-semibold capitalize">
                    {insight.insightType.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs font-medium uppercase">{insight.severity}</span>
                </div>
                <p className="text-sm mb-3">{insight.description}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Affected Population:</span>
                    <span className="font-medium">{insight.affectedPopulation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="font-medium">{insight.confidence}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Data Points:</span>
                    <span className="font-medium">{insight.dataPoints.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Anonymized:</span>
                    <span className={`font-medium ${insight.anonymizedData ? "text-green-600" : "text-red-600"}`}>
                      {insight.anonymizedData ? "✓ Yes" : "✗ No"}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <span className="font-medium">Recommended Actions:</span>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      {insight.recommendedActions.map((action: string, i: number) => (
                        <li key={i}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="p-4 rounded-lg bg-muted/50 border text-sm">
        <div className="flex items-start gap-2">
          <Shield className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="font-semibold">Privacy Protected</p>
            <p className="text-muted-foreground">
              All community insights are generated using anonymized, aggregated data. No individual personal information is exposed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
