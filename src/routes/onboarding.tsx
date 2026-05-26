import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ShieldCheck, User, Activity, Utensils, Heart, Watch, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { saveUserProfile, saveOnboardingProgress, generatePersonalizedPlan, connectDevice, getConnectedDevices, type UserProfile, type ConnectedDevice } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [completedOnboarding, setCompletedOnboarding] = useState(false);
  const [bluetoothAvailable, setBluetoothAvailable] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [personalizedPlan, setPersonalizedPlan] = useState<any>(null);

  const [formData, setFormData] = useState<Partial<UserProfile>>({
    userId: user?.id || "",
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
    createdAt: new Date().toISOString(),
    completed: false,
  });

  const totalSteps = 6;

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Fitness Goals", icon: Activity },
    { number: 3, title: "Dietary Preferences", icon: Utensils },
    { number: 4, title: "Wellness Metrics", icon: Heart },
    { number: 5, title: "Activity Level", icon: Activity },
    { number: 6, title: "Connect Devices", icon: Watch },
  ];

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      // Save progress
      if (user) {
        await saveOnboardingProgress({
          userId: user.id,
          currentStep: currentStep + 1,
          totalSteps,
          completedSteps: steps.slice(0, currentStep).map((s) => s.title),
          startedAt: new Date().toISOString(),
        });
      }
    } else {
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) {
      toast.error("Please sign in to complete onboarding.");
      return;
    }

    if (!formData.personalInfo?.age || !formData.personalInfo?.weight || !formData.personalInfo?.height) {
      toast.error("Please complete your personal information before finishing.");
      return;
    }

    setIsLoading(true);
    try {
      const completeProfile: UserProfile = {
        ...formData,
        userId: user.id,
        completed: true,
      } as UserProfile;

      const saveResult = await saveUserProfile(completeProfile);

      if (!saveResult.success) {
        toast.error(saveResult.error || "Failed to save profile");
        return;
      }

      const plan = await generatePersonalizedPlan(completeProfile);
      setPersonalizedPlan(plan);

      await saveOnboardingProgress({
        userId: user.id,
        currentStep: totalSteps,
        totalSteps,
        completedSteps: steps.map((s) => s.title),
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
      });

      toast.success("Profile completed successfully!");

      // If user arrived here from the signup flow, record analytics and go straight to the dashboard
      const fromSignup = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("from") === "signup";
      if (fromSignup) {
        try {
          toast.info("Recording completion analytics...");
          // best-effort analytics call (no hard dependency on backend)
          if (typeof fetch !== "undefined") {
            void fetch("/api/analytics", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ event: "signup_onboarding_complete", userId: user.id, timestamp: new Date().toISOString() }),
            }).catch((err) => console.warn("Analytics call failed:", err));
          }
        } catch (err) {
          console.warn("Analytics dispatch error", err);
        }

        toast.success("Profile completed — redirecting to app");
        navigate({ to: "/" });
        return;
      }

      setCompletedOnboarding(true);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    const loadDevices = async () => {
      try {
        const devices = await getConnectedDevices(user.id);
        setConnectedDevices(devices);
      } catch (error) {
        console.error(error);
        toast.error("Unable to load connected devices.");
      }
    };

    loadDevices();
  }, [user]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && "bluetooth" in navigator) {
      setBluetoothAvailable(true);
    }
  }, []);

  const handleFinish = () => {
    navigate({ to: "/" });
  };

  const handleConnectDevice = async (method: "bluetooth" | "qr" | "phone" = "bluetooth") => {
    if (!user) {
      toast.error("Please sign in to connect a device.");
      return;
    }

    setIsScanning(true);
    let devicePayload: Omit<ConnectedDevice, "id" | "userId" | "lastSynced">;

    try {
      if (method === "bluetooth") {
        if (!navigator.bluetooth) {
          throw new Error("Bluetooth is not supported in this browser.");
        }

        const bluetoothDevice = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
          optionalServices: ["heart_rate", "battery_service"],
        });

        devicePayload = {
          deviceName: bluetoothDevice.name || "Bluetooth Device",
          deviceType: "fitness_tracker",
          brand: "Bluetooth",
          model: bluetoothDevice.id,
          isActive: true,
          dataTypes: ["heart_rate", "steps", "sleep"],
        };
      } else if (method === "qr") {
        devicePayload = {
          deviceName: "QR Connected Device",
          deviceType: "smartwatch",
          brand: "Scan QR",
          model: "QR-DEVICE-001",
          isActive: true,
          dataTypes: ["steps", "heart_rate"],
        };
      } else {
        devicePayload = {
          deviceName: "Phone App Device",
          deviceType: "smartwatch",
          brand: "Mobile App",
          model: "MOBILE-APP-001",
          isActive: true,
          dataTypes: ["steps", "sleep", "heart_rate"],
        };
      }

      const newDevice = await connectDevice(user.id, devicePayload);
      setConnectedDevices((prev) => [...prev, newDevice]);
      toast.success("Device connected successfully!");
    } catch (error: any) {
      if (error?.name === "NotFoundError") {
        toast.error("No Bluetooth device selected.");
      } else if (error?.name === "NotAllowedError" || error?.name === "SecurityError") {
        toast.error("Bluetooth permission denied or unavailable.");
      } else {
        toast.error(error?.message || "Failed to connect device.");
      }
      console.error(error);
    } finally {
      setIsScanning(false);
    }
  };

  const updateFormData = (section: keyof UserProfile, data: any) => {
    setFormData((prev) => {
      const sectionData = prev[section as keyof UserProfile] as any;
      return {
        ...prev,
        [section]: { ...sectionData, ...data },
      };
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Personal Information</h3>
            <p className="text-muted-foreground">Let's start with some basic information about you.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Age</label>
                <input
                  type="number"
                  value={formData.personalInfo?.age || ""}
                  onChange={(e) => updateFormData("personalInfo", { age: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="25"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Gender</label>
                <select
                  value={formData.personalInfo?.gender || "prefer_not_to_say"}
                  onChange={(e) => updateFormData("personalInfo", { gender: e.target.value as any })}
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
                  value={formData.personalInfo?.weight || ""}
                  onChange={(e) => updateFormData("personalInfo", { weight: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="70"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Height (cm)</label>
                <input
                  type="number"
                  value={formData.personalInfo?.height || ""}
                  onChange={(e) => updateFormData("personalInfo", { height: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="175"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Fitness Goals</h3>
            <p className="text-muted-foreground">What are your main fitness objectives?</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Primary Goal</label>
                <select
                  value={formData.fitnessGoals?.primaryGoal || "general_fitness"}
                  onChange={(e) => updateFormData("fitnessGoals", { primaryGoal: e.target.value as any })}
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
                  value={formData.fitnessGoals?.timeline || "3 months"}
                  onChange={(e) => updateFormData("fitnessGoals", { timeline: e.target.value })}
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
                  value={formData.activityLevel?.dailyStepGoal || 10000}
                  onChange={(e) => updateFormData("activityLevel", { dailyStepGoal: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="10000"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Dietary Preferences</h3>
            <p className="text-muted-foreground">Tell us about your eating habits.</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Diet Type</label>
                <select
                  value={formData.dietaryPreferences?.dietType || "omnivore"}
                  onChange={(e) => updateFormData("dietaryPreferences", { dietType: e.target.value as any })}
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
                  value={formData.dietaryPreferences?.caloriesPerDay || 2000}
                  onChange={(e) => updateFormData("dietaryPreferences", { caloriesPerDay: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="2000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Water Intake Goal (glasses/day)</label>
                <input
                  type="number"
                  value={formData.dietaryPreferences?.waterIntakeGoal || 8}
                  onChange={(e) => updateFormData("dietaryPreferences", { waterIntakeGoal: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="8"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Wellness Metrics</h3>
            <p className="text-muted-foreground">How are you feeling overall?</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Stress Level</label>
                <select
                  value={formData.wellnessMetrics?.stressLevel || "moderate"}
                  onChange={(e) => updateFormData("wellnessMetrics", { stressLevel: e.target.value as any })}
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
                  value={formData.wellnessMetrics?.sleepHours || 7}
                  onChange={(e) => updateFormData("wellnessMetrics", { sleepHours: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="7"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sleep Quality</label>
                <select
                  value={formData.wellnessMetrics?.sleepQuality || "good"}
                  onChange={(e) => updateFormData("wellnessMetrics", { sleepQuality: e.target.value as any })}
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
                  value={formData.wellnessMetrics?.energyLevel || "moderate"}
                  onChange={(e) => updateFormData("wellnessMetrics", { energyLevel: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="low">Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Activity Level</h3>
            <p className="text-muted-foreground">How active are you currently?</p>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Current Activity Level</label>
                <select
                  value={formData.activityLevel?.currentLevel || "moderately_active"}
                  onChange={(e) => updateFormData("activityLevel", { currentLevel: e.target.value as any })}
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
                  value={formData.activityLevel?.weeklyExerciseDays || 3}
                  onChange={(e) => updateFormData("activityLevel", { weeklyExerciseDays: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="3"
                />
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">Connect Devices</h3>
            <p className="text-muted-foreground">Choose how you'd like to connect your device for automatic data collection.</p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-border bg-muted/50 p-4 text-sm text-foreground">
                <p className="font-medium">Browser readiness</p>
                <p className="mt-2">
                  {bluetoothAvailable
                    ? "Bluetooth is supported in this browser. You can pair directly if your device allows it."
                    : "Bluetooth is unavailable in this browser. Use QR code scanning or the cellphone app instead."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleConnectDevice("bluetooth")}
                disabled={isScanning || !bluetoothAvailable}
                className="group flex flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-background p-5 text-center transition hover:border-primary/70 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Watch className="w-6 h-6 text-primary transition group-hover:text-primary" />
                <span className="text-sm font-semibold text-foreground">Bluetooth</span>
                <span className="text-xs text-muted-foreground">Pair nearby devices</span>
              </button>

              <button
                type="button"
                onClick={() => handleConnectDevice("qr")}
                disabled={isScanning}
                className="group flex flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-background p-5 text-center transition hover:border-primary/70 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-lg">📷</span>
                </div>
                <span className="text-sm font-semibold text-foreground">Scan QR Code</span>
                <span className="text-xs text-muted-foreground">Quick setup via code</span>
              </button>

              <button
                type="button"
                onClick={() => handleConnectDevice("phone")}
                disabled={isScanning}
                className="group flex flex-col items-center justify-center gap-3 rounded-3xl border border-border bg-background p-5 text-center transition hover:border-primary/70 hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-lg">📱</span>
                </div>
                <span className="text-sm font-semibold text-foreground">Cellphone App</span>
                <span className="text-xs text-muted-foreground">Use your phone</span>
              </button>
            </div>

            <div className="space-y-3">
              {connectedDevices.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Connected Devices</p>
                  {connectedDevices.map((device) => (
                    <div key={device.id} className="flex flex-col gap-2 rounded-3xl border border-border bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <Watch className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{device.deviceName}</p>
                          <p className="text-xs text-muted-foreground">{device.brand} {device.model}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{device.isActive ? "Active" : "Inactive"}</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                You can connect devices later in your settings.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (completedOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 px-4 py-8 sm:py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500/10 mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">You're all set!</h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Your profile is complete and your device connections are ready.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-card space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-border bg-muted/70 p-5">
                <h2 className="text-base font-semibold text-foreground">Plan Summary</h2>
                <p className="mt-3 text-sm text-muted-foreground">A quick overview of your tailored plan.</p>
                <div className="mt-4 space-y-3 text-sm text-foreground">
                  <p>{personalizedPlan?.fitnessPlan}</p>
                  <p>{personalizedPlan?.nutritionPlan}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-border bg-muted/70 p-5">
                <h2 className="text-base font-semibold text-foreground">Connected Devices</h2>
                <p className="mt-3 text-sm text-muted-foreground">Devices stored in your browser session.</p>
                <div className="mt-4 space-y-2 text-sm">
                  {connectedDevices.length > 0 ? (
                    connectedDevices.map((device) => (
                      <div key={device.id} className="rounded-2xl bg-background/80 p-3">
                        <p className="font-medium text-foreground">{device.deviceName}</p>
                        <p className="text-xs text-muted-foreground">{device.brand} • {device.model}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No active devices were connected yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-muted/70 p-5">
              <h2 className="text-base font-semibold text-foreground">Recommendations</h2>
              <ul className="mt-3 space-y-2 text-sm text-foreground">
                {personalizedPlan?.wellnessRecommendations?.map((item: string, index: number) => (
                  <li key={index} className="rounded-xl bg-background/80 p-3">{item}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleFinish}
                className="w-full sm:w-auto rounded-xl bg-shield px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition"
              >
                Go to Dashboard
              </button>
              <p className="text-xs text-muted-foreground">
                Your onboarding progress has been saved and your session is ready to continue.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 px-4 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-shield shadow-glow mb-4">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Complete Your Profile</h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 px-4">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${step.number <= currentStep
                    ? "bg-shield text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                  }`}
              >
                {step.number < currentStep ? (
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <span className="hidden sm:block text-xs text-muted-foreground mt-2">{step.title}</span>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-muted rounded-full mb-8">
          <div
            className="h-full bg-shield transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {/* Form Card */}
        <div className="rounded-2xl sm:rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 shadow-card">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-card text-foreground hover:bg-accent transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-shield text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                "Processing..."
              ) : currentStep === totalSteps ? (
                <>
                  Complete <CheckCircle className="w-4 h-4" />
                </>
              ) : (
                <>
                  Next <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Skip Option */}
        {currentStep < totalSteps && (
          <button
            onClick={() => navigate({ to: "/" })}
            className="w-full mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
