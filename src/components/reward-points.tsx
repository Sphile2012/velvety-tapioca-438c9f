import { Trophy, Star, Flame, Gift } from "lucide-react";
import { serverGetRewardPoints, serverGetRewardActivities, serverGetRewardTiers, type RewardPoints, type RewardActivity, type RewardTier } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";

export function RewardPoints() {
  const { user } = useAuth();
  const [rewardPoints, setRewardPoints] = useState<RewardPoints | null>(null);
  const [activities, setActivities] = useState<RewardActivity[]>([]);
  const [tiers, setTiers] = useState<RewardTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRewardData = async () => {
      if (user) {
        try {
          const [points, acts, tierData] = await Promise.all([
            serverGetRewardPoints(user.id),
            serverGetRewardActivities(user.id),
            serverGetRewardTiers(),
          ]);
          setRewardPoints(points);
          setActivities(acts);
          setTiers(tierData);
        } catch (error) {
          console.error("Failed to load reward data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadRewardData();
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

  if (!rewardPoints) return null;

  const currentTier = tiers.find(t => t.name === rewardPoints.tier);
  const nextTier = tiers.find(t => t.pointsRequired > rewardPoints.totalPoints);

  const tierColors: Record<string, string> = {
    bronze: "text-amber-700",
    silver: "text-gray-400",
    gold: "text-yellow-500",
    platinum: "text-cyan-400",
  };

  return (
    <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Rewards & Points</h3>
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Available Points</p>
          <p className="text-3xl font-bold text-foreground">{rewardPoints.availablePoints.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Current Tier</p>
          <p className={`text-2xl font-bold ${tierColors[rewardPoints.tier] || 'text-foreground'}`}>
            {rewardPoints.tier.charAt(0).toUpperCase() + rewardPoints.tier.slice(1)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6 p-4 bg-gradient-to-r from-shield/20 to-transparent rounded-xl">
        <Flame className="w-6 h-6 text-orange-500" />
        <div>
          <p className="text-sm font-medium text-foreground">{rewardPoints.streakDays} Day Streak</p>
          <p className="text-xs text-muted-foreground">Keep it up for bonus points!</p>
        </div>
      </div>

      {nextTier && (
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress to {nextTier.name.charAt(0).toUpperCase() + nextTier.name.slice(1)}</span>
            <span className="font-medium text-foreground">{rewardPoints.totalPoints.toLocaleString()} / {nextTier.pointsRequired.toLocaleString()}</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-shield to-primary transition-all" 
              style={{ width: `${Math.min(100, (rewardPoints.totalPoints / nextTier.pointsRequired) * 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">Recent Activity</h4>
        <div className="space-y-2">
          {activities.slice(0, 3).map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString()}
                    {activity.multiplier > 1 && ` • ${activity.multiplier}x multiplier`}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-green-500">+{activity.pointsEarned}</span>
            </div>
          ))}
        </div>
      </div>

      {currentTier && (
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            {currentTier.name.charAt(0).toUpperCase() + currentTier.name.slice(1)} Benefits
          </h4>
          <ul className="space-y-1">
            {currentTier.benefits.map((benefit, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <Gift className="w-3 h-3 text-primary" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
