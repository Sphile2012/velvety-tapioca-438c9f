import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { User, Activity, Utensils, Heart, Watch, CheckCircle, ChevronLeft, Save, Shield } from "lucide-react";
import { getUserProfile, saveUserProfile, type UserProfile } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    personalInfo: {
      age: 0,
      weight: 0,
      height: 0,
      gender: "prefer_not_to_say",
    },
    fitnessGoals: {
      primaryGoal: "general_fitness",
      secondaryGoals: [],
      timeline: "3 months",
    },
    dietaryPreferences: {
      dietType: "omnivore",
      allergies: [],
      restrictions: [],
      caloriesPerDay: 2000,
      waterIntakeGoal: 8,
    },
    wellnessMetrics: {
      stressLevel: "moderate",
      sleepHours: 7,
      sleepQuality: "good",
      energyLevel: "moderate",
      mood: "good",
    },
    activityLevel: {
      currentLevel: "moderately_active",
      weeklyExerciseDays: 3,
      preferredActivities: [],
      dailyStepGoal: 10000,
    },
    medicalConditions: {
      hasConditions: false,
      conditions: [],
      medications: [],
      injuries: [],
      limitations: [],
    },
    healthTargets: {
      targetHeartRateZone: "moderate",
      targetSleepHours: 8,
      targetStressLevel: "low",
      targetActivityMinutes: 30,
    },
  });

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  async function loadProfile() {
    if (!user) return;
    setIsLoading(true);
    try {
      const userProfile = await getUserProfile(user.id);
      if (userProfile) {
        setProfile(userProfile);
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    if (!user) return;
    setIsSaving(true);
    try {
      const completeProfile: UserProfile = {
        ...profile,
        userId: user.id,
        completed: true,
      } as UserProfile;

      const result = await saveUserProfile(completeProfile);
      if (result.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  const updateProfile = (section: keyof UserProfile, data: any) => {
    setProfile((prev) => {
      const sectionData = prev[section as keyof UserProfile] as any;
      return {
        ...prev,
        [section]: { ...sectionData, ...data },
      };
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 px-4 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <button
            onClick={() => navigate({ to: "/" })}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-foreground hover:bg-accent transition-colors w-full sm:w-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Profile Settings</h1>
        </div>

        {/* Privacy Notice */}
        <div className="p-4 rounded-lg bg-purple-50 border-2 border-purple-200 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-purple-600 mt-0.5" />
            <div>
              <p className="font-semibold text-purple-900">Your Privacy is Protected</p>
              <p className="text-sm text-purple-700">
                All your health data is encrypted and stored securely. You have full control over your information.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Age</label>
                <input
                  type="number"
                  value={profile.personalInfo?.age || ""}
                  onChange={(e) => updateProfile("personalInfo", { age: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Gender</label>
                <select
                  value={profile.personalInfo?.gender || "prefer_not_to_say"}
                  onChange={(e) => updateProfile("personalInfo", { gender: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Weight (kg)</label>
                <input
                  type="number"
                  value={profile.personalInfo?.weight || ""}
                  onChange={(e) => updateProfile("personalInfo", { weight: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Height (cm)</label>
                <input
                  type="number"
                  value={profile.personalInfo?.height || ""}
                  onChange={(e) => updateProfile("personalInfo", { height: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Fitness Goals */}
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-primary/10">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Fitness Goals</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Primary Goal</label>
                <select
                  value={profile.fitnessGoals?.primaryGoal || "general_fitness"}
                  onChange={(e) => updateProfile("fitnessGoals", { primaryGoal: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="general_fitness">General Fitness</option>
                  <option value="stress_management">Stress Management</option>
                  <option value="better_sleep">Better Sleep</option>
                  <option value="athletic_performance">Athletic Performance</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Timeline</label>
                <select
                  value={profile.fitnessGoals?.timeline || "3 months"}
                  onChange={(e) => updateProfile("fitnessGoals", { timeline: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="1 month">1 Month</option>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="1 year">1 Year</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Daily Step Goal</label>
                <input
                  type="number"
                  value={profile.activityLevel?.dailyStepGoal || 10000}
                  onChange={(e) => updateProfile("activityLevel", { dailyStepGoal: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Dietary Preferences */}
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-primary/10">
                <Utensils className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Dietary Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Diet Type</label>
                <select
                  value={profile.dietaryPreferences?.dietType || "omnivore"}
                  onChange={(e) => updateProfile("dietaryPreferences", { dietType: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="omnivore">Omnivore</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Daily Calories</label>
                <input
                  type="number"
                  value={profile.dietaryPreferences?.caloriesPerDay || 2000}
                  onChange={(e) => updateProfile("dietaryPreferences", { caloriesPerDay: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Water Intake Goal (glasses/day)</label>
                <input
                  type="number"
                  value={profile.dietaryPreferences?.waterIntakeGoal || 8}
                  onChange={(e) => updateProfile("dietaryPreferences", { waterIntakeGoal: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>

          {/* Wellness Metrics */}
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-primary/10">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Wellness Metrics</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Stress Level</label>
                <select
                  value={profile.wellnessMetrics?.stressLevel || "moderate"}
                  onChange={(e) => updateProfile("wellnessMetrics", { stressLevel: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sleep Hours (average)</label>
                <input
                  type="number"
                  step="0.5"
                  value={profile.wellnessMetrics?.sleepHours || 7}
                  onChange={(e) => updateProfile("wellnessMetrics", { sleepHours: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sleep Quality</label>
                <select
                  value={profile.wellnessMetrics?.sleepQuality || "good"}
                  onChange={(e) => updateProfile("wellnessMetrics", { sleepQuality: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="poor">Poor</option>
                  <option value="fair">Fair</option>
                  <option value="good">Good</option>
                  <option value="excellent">Excellent</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Energy Level</label>
                <select
                  value={profile.wellnessMetrics?.energyLevel || "moderate"}
                  onChange={(e) => updateProfile("wellnessMetrics", { energyLevel: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Activity Level */}
          <div className="rounded-2xl sm:rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-primary/10">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Activity Level</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Current Activity Level</label>
                <select
                  value={profile.activityLevel?.currentLevel || "moderately_active"}
                  onChange={(e) => updateProfile("activityLevel", { currentLevel: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="sedentary">Sedentary (mostly sitting)</option>
                  <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                  <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                  <option value="very_active">Very Active (6-7 days/week)</option>
                  <option value="extremely_active">Extremely Active (physical job)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Weekly Exercise Days</label>
                <input
                  type="number"
                  min="0"
                  max="7"
                  value={profile.activityLevel?.weeklyExerciseDays || 3}
                  onChange={(e) => updateProfile("activityLevel", { weeklyExerciseDays: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl bg-shield text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full sm:w-auto"
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
