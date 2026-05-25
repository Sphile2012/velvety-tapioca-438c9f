import { Activity, Heart, Brain, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { serverAnalyzeLifestyleScore, serverGetSpendingData, type LifestyleScore } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";

export function LifestyleScore() {
  const { user } = useAuth();
  const [lifestyleScore, setLifestyleScore] = useState<LifestyleScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLifestyleScore = async () => {
      if (user) {
        try {
          // Simulated health data history
          const healthData = await Array.from({ length: 30 }, (_, i) => ({
            userId: user.id,
            timestamp: new Date(Date.now() - i * 86400000).toISOString(),
            vitals: {
              heartRate: 70 + Math.random() * 10,
              hrv: 40 + Math.random() * 10,
              spo2: 95 + Math.random() * 5,
              stress: Math.random() > 0.5 ? "low" : "moderate" as "low" | "moderate" | "high",
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

          const spendingData = await serverGetSpendingData(user.id);
          const score = await serverAnalyzeLifestyleScore(user.id, healthData, spendingData);
          setLifestyleScore(score);
        } catch (error) {
          console.error("Failed to load lifestyle score:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadLifestyleScore();
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

  if (!lifestyleScore) return null;

  const scoreColor = lifestyleScore.overall >= 80 ? "text-green-500" : lifestyleScore.overall >= 60 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Lifestyle Score</h3>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full border-8 border-border flex items-center justify-center">
            <div className="text-center">
              <span className={`text-4xl font-bold ${scoreColor}`}>{lifestyleScore.overall}</span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <Activity className="w-6 h-6 mx-auto mb-1 text-blue-500" />
          <p className="text-sm font-medium text-foreground">{lifestyleScore.physical}</p>
          <p className="text-xs text-muted-foreground">Physical</p>
        </div>
        <div className="text-center">
          <Brain className="w-6 h-6 mx-auto mb-1 text-purple-500" />
          <p className="text-sm font-medium text-foreground">{lifestyleScore.mental}</p>
          <p className="text-xs text-muted-foreground">Mental</p>
        </div>
        <div className="text-center">
          <Heart className="w-6 h-6 mx-auto mb-1 text-pink-500" />
          <p className="text-sm font-medium text-foreground">{lifestyleScore.social}</p>
          <p className="text-xs text-muted-foreground">Social</p>
        </div>
        <div className="text-center">
          <DollarSign className="w-6 h-6 mx-auto mb-1 text-green-500" />
          <p className="text-sm font-medium text-foreground">{lifestyleScore.financial}</p>
          <p className="text-xs text-muted-foreground">Financial</p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Breakdown</h4>
        {Object.entries(lifestyleScore.breakdown).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all" 
                  style={{ width: `${value}%` }}
                />
              </div>
              <span className="text-sm font-medium text-foreground w-8 text-right">{value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Trends</h4>
        <div className="flex justify-between text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">Week</p>
            <p className={`font-medium ${lifestyleScore.trends.week > lifestyleScore.overall ? 'text-green-500' : 'text-red-500'}`}>
              {lifestyleScore.trends.week > lifestyleScore.overall ? <TrendingUp className="w-4 h-4 inline" /> : <TrendingDown className="w-4 h-4 inline" />}
              {lifestyleScore.trends.week}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Month</p>
            <p className={`font-medium ${lifestyleScore.trends.month > lifestyleScore.overall ? 'text-green-500' : 'text-red-500'}`}>
              {lifestyleScore.trends.month > lifestyleScore.overall ? <TrendingUp className="w-4 h-4 inline" /> : <TrendingDown className="w-4 h-4 inline" />}
              {lifestyleScore.trends.month}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">Quarter</p>
            <p className={`font-medium ${lifestyleScore.trends.quarter > lifestyleScore.overall ? 'text-green-500' : 'text-red-500'}`}>
              {lifestyleScore.trends.quarter > lifestyleScore.overall ? <TrendingUp className="w-4 h-4 inline" /> : <TrendingDown className="w-4 h-4 inline" />}
              {lifestyleScore.trends.quarter}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
