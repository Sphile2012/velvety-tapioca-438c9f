import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, ArrowRight, User, Activity, Utensils, Heart, Watch, CheckCircle, ChevronRight, ChevronLeft, Bluetooth, QrCode, Smartphone, Battery } from "lucide-react";
import {
  serverSaveUserProfile,
  serverSaveOnboardingProgress,
  serverGeneratePersonalizedPlan,
  serverConnectDevice,
  serverGetConnectedDevices,
  serverScanBluetoothDevices,
  serverConnectBluetoothDevice,
  serverScanQRCode,
  serverConnectViaQRCode,
  serverConnectCellphoneApp,
  type UserProfile,
  type ConnectedDevice,
  type BluetoothDevice,
  type QRCodeResult
} from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

// Type declarations for Web Bluetooth API
declare global {
  interface Navigator {
    bluetooth?: {
      requestDevice(options: {
        acceptAllDevices?: boolean;
        optionalServices?: string[];
      }): Promise<BluetoothDevice>;
    };
  }

  interface BluetoothDevice {
    id: string;
    name?: string;
  }
}

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

function Onboarding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [personalizedPlan, setPersonalizedPlan] = useState<any>(null);
  const [isScanningBluetooth, setIsScanningBluetooth] = useState(false);
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [discoveredBluetoothDevices, setDiscoveredBluetoothDevices] = useState<BluetoothDevice[]>([]);

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
    console.log('handleNext called', { currentStep, totalSteps, isLoading });
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      // Save progress
      if (user) {
        await serverSaveOnboardingProgress({
          userId: user.id,
          currentStep: currentStep + 1,
          totalSteps,
          completedSteps: steps.slice(0, currentStep).map(s => s.title),
          startedAt: new Date().toISOString(),
        });
      }
    } else {
      console.log('Calling handleComplete');
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Save complete profile
      const completeProfile: UserProfile = {
        ...formData,
        userId: user.id,
        completed: true,
      } as UserProfile;

      const saveResult = await serverSaveUserProfile(completeProfile);

      if (saveResult.success) {
        // Generate personalized plan
        const plan = await serverGeneratePersonalizedPlan(completeProfile);
        setPersonalizedPlan(plan);

        // Mark onboarding as complete
        await serverSaveOnboardingProgress({
          userId: user.id,
          currentStep: totalSteps,
          totalSteps,
          completedSteps: steps.map(s => s.title),
          startedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        });

        toast.success("Profile completed successfully!");

        // Navigate to dashboard immediately
        navigate({ to: "/" });
      } else {
        toast.error(saveResult.error || "Failed to save profile");
      }
    } catch (error) {
      toast.error("An error occurred during onboarding");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectDevice = async () => {
    if (!user) return;

    try {
      const newDevice = await serverConnectDevice(user.id, {
        deviceName: "New Device",
        deviceType: "fitness_tracker",
        brand: "Generic",
        model: "Tracker Pro",
        isActive: true,
        dataTypes: ["steps", "heart_rate", "sleep"],
        connectionMethod: "manual",
      });

      setConnectedDevices([...connectedDevices, newDevice]);
      toast.success("Device connected successfully!");
    } catch (error) {
      toast.error("Failed to connect device");
    }
  };

  const handleBluetoothConnection = async () => {
    if (!user) return;

    setIsScanningBluetooth(true);
    setDiscoveredBluetoothDevices([]);

    try {
      toast.loading("Scanning for Bluetooth devices...", { duration: 5000 });

      // Try to use Web Bluetooth API for actual device scanning
      if (navigator.bluetooth && navigator.bluetooth.requestDevice) {
        try {
          const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: ['battery_service', 'heart_rate', 'generic_access']
          });

          toast.dismiss();

          if (device) {
            const bluetoothDevice: BluetoothDevice = {
              id: device.id,
              name: device.name || 'Unknown Device',
              deviceType: 'BLE Device',
              signalStrength: Math.floor(Math.random() * 30) + 70,
              isPaired: false
            };

            setDiscoveredBluetoothDevices([bluetoothDevice]);
            toast.success(`Found device: ${device.name}. Select to connect.`);
          }
        } catch (bluetoothError) {
          toast.dismiss();
          console.log('Bluetooth scan cancelled or failed, using simulation');
          await fallbackToSimulation();
        }
      } else {
        toast.dismiss();
        toast.info("Web Bluetooth not supported in this browser. Using simulated devices.");
        await fallbackToSimulation();
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to scan for Bluetooth devices. Please ensure Bluetooth is enabled.");
      setIsScanningBluetooth(false);
    }
  };

  const fallbackToSimulation = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const devices = await serverScanBluetoothDevices();
    setDiscoveredBluetoothDevices(devices);

    if (devices.length === 0) {
      toast.error("No Bluetooth devices found. Make sure Bluetooth is enabled and devices are in pairing mode.");
      setIsScanningBluetooth(false);
      return;
    }

    toast.success(`Found ${devices.length} device(s). Select a device to connect.`);
  };

  const handleConnectBluetoothDevice = async (deviceId: string) => {
    if (!user) return;

    try {
      toast.loading("Connecting to device...");
      const connectedDevice = await serverConnectBluetoothDevice(deviceId, user.id);
      setConnectedDevices([...connectedDevices, connectedDevice]);
      setDiscoveredBluetoothDevices([]);
      setIsScanningBluetooth(false);
      toast.dismiss();
      toast.success(`Connected to ${connectedDevice.deviceName} via Bluetooth`);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to connect to device. Please try again.");
    }
  };

  const handleQRCodeConnection = async () => {
    if (!user) return;

    setIsScanningQR(true);

    try {
      toast.loading("Scanning QR code...", { duration: 3000 });

      // Simulate camera scanning delay
      await new Promise(resolve => setTimeout(resolve, 2500));

      const qrResult = await serverScanQRCode();
      toast.dismiss();
      setIsScanningQR(false);

      const connectedDevice = await serverConnectViaQRCode(qrResult, user.id);
      setConnectedDevices([...connectedDevices, connectedDevice]);
      toast.success(`Connected to ${connectedDevice.deviceName} via QR code`);
    } catch (error) {
      toast.dismiss();
      setIsScanningQR(false);
      toast.error("Failed to scan QR code. Please ensure camera access is granted.");
    }
  };

  const handleCellphoneConnection = async () => {
    if (!user) return;

    try {
      toast.loading("Connecting via cellphone app...");
      const phoneNumber = prompt("Enter your cellphone number for app connection:");
      toast.dismiss();

      if (!phoneNumber) {
        toast.error("Phone number is required");
        return;
      }

      const connectedDevice = await serverConnectCellphoneApp(phoneNumber, user.id);
      setConnectedDevices([...connectedDevices, connectedDevice]);
      toast.success(`Connected to ${connectedDevice.deviceName} via cellphone app`);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to connect via cellphone app");
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

            <div className="space-y-4">
              {/* Connection Method Options */}
              <div className="grid gap-4 md:grid-cols-3">
                {/* Bluetooth Option */}
                <button
                  onClick={() => handleBluetoothConnection()}
                  disabled={isScanningBluetooth || isScanningQR}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all relative">
                    {isScanningBluetooth ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    ) : (
                      <Bluetooth className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-medium">Bluetooth</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isScanningBluetooth ? "Scanning..." : "Pair nearby devices"}
                    </p>
                  </div>
                </button>

                {/* QR Code Option */}
                <button
                  onClick={() => handleQRCodeConnection()}
                  disabled={isScanningBluetooth || isScanningQR}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all relative">
                    {isScanningQR ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    ) : (
                      <QrCode className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-medium">Scan QR Code</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isScanningQR ? "Scanning..." : "Quick setup via code"}
                    </p>
                  </div>
                </button>

                {/* Cellphone App Option */}
                <button
                  onClick={() => handleCellphoneConnection()}
                  disabled={isScanningBluetooth || isScanningQR}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-accent/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-all">
                    <Smartphone className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-foreground font-medium">Cellphone App</p>
                    <p className="text-xs text-muted-foreground mt-1">Use your phone</p>
                  </div>
                </button>
              </div>

              {/* Discovered Bluetooth Devices */}
              {discoveredBluetoothDevices.length > 0 && (
                <div className="space-y-3 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Discovered Devices</p>
                  <div className="space-y-2">
                    {discoveredBluetoothDevices.map((device) => (
                      <button
                        key={device.id}
                        onClick={() => handleConnectBluetoothDevice(device.id)}
                        className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Bluetooth className="w-5 h-5 text-blue-600" />
                          <div className="text-left">
                            <p className="text-sm font-medium text-blue-900">{device.name}</p>
                            <p className="text-xs text-blue-700">Signal: {device.signalStrength}%</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {device.deviceType}
                          </span>
                          <ArrowRight className="w-4 h-4 text-blue-600" />
                        </div>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setIsScanningBluetooth(false);
                      setDiscoveredBluetoothDevices([]);
                    }}
                    className="text-xs text-blue-700 hover:text-blue-900 underline"
                  >
                    Cancel scanning
                  </button>
                </div>
              )}

              {/* QR Code Scanning Animation */}
              {isScanningQR && (
                <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-lg">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-48 h-48 bg-white rounded-lg border-2 border-purple-300 flex items-center justify-center">
                      <div className="absolute inset-4 border-2 border-purple-400 rounded-lg animate-pulse" />
                      <div className="absolute inset-8 border-2 border-purple-400 rounded-lg animate-pulse delay-100" />
                      <QrCode className="w-16 h-16 text-purple-600" />
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-purple-600 animate-scan" />
                    </div>
                    <p className="text-sm text-purple-900">Scanning QR code...</p>
                    <p className="text-xs text-purple-700">Point your camera at the device's QR code</p>
                  </div>
                </div>
              )}

              {/* Connected Devices */}
              {connectedDevices.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Connected Devices</p>
                  {connectedDevices.map((device) => (
                    <div key={device.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Watch className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{device.deviceName}</p>
                          <p className="text-xs text-muted-foreground">
                            {device.brand} {device.model} • {device.connectionMethod.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {device.batteryLevel && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Battery className="w-4 h-4" />
                            <span>{device.batteryLevel}%</span>
                          </div>
                        )}
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                You can connect devices later in your settings
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
        </div>

        {/* Navigation Buttons - Outside form card */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-border" style={{ position: 'relative', zIndex: 1000 }}>
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
            onClick={(e) => {
              console.log('Complete button clicked', { isLoading, currentStep, totalSteps });
              e.preventDefault();
              e.stopPropagation();
              handleNext();
            }}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-shield text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            type="button"
            style={{ position: 'relative', zIndex: 1000 }}
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
