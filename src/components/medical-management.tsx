import { useState, useEffect } from "react";
import {
  serverGetMedicalAppointments,
  serverGetMedications,
  serverGetMedicationReminders,
  serverGetTreatmentPlans,
  serverGetChronicConditions,
  serverGetSymptomLogs,
  serverCalculateMedicationAdherence,
  type MedicalAppointment,
  type Medication,
  type MedicationReminder,
  type TreatmentPlan,
  type ChronicCondition,
  type SymptomLog,
} from "@/lib/api";
import {
  Calendar,
  Pill,
  ClipboardList,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Bell,
  Plus,
  TrendingUp,
  Heart,
  Stethoscope,
  FileText,
} from "lucide-react";

export function MedicalManagement() {
  const [appointments, setAppointments] = useState<MedicalAppointment[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [chronicConditions, setChronicConditions] = useState<ChronicCondition[]>([]);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"appointments" | "medications" | "treatment" | "conditions">("appointments");

  useEffect(() => {
    loadMedicalData();
  }, []);

  async function loadMedicalData() {
    setLoading(true);
    try {
      // Simulated user ID - in production, this would come from auth context
      const userId = "user-1";
      
      const [appointmentsData, medicationsData, treatmentPlansData, chronicConditionsData] = await Promise.all([
        serverGetMedicalAppointments(userId),
        serverGetMedications(userId),
        serverGetTreatmentPlans(userId),
        serverGetChronicConditions(userId),
      ]);

      setAppointments(appointmentsData);
      setMedications(medicationsData);
      setTreatmentPlans(treatmentPlansData);
      setChronicConditions(chronicConditionsData);

      // Load reminders for today
      const today = new Date().toISOString().split("T")[0];
      const remindersData = await serverGetMedicationReminders(userId, today);
      setReminders(remindersData);

      // Load recent symptom logs
      const startDate = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
      const endDate = new Date().toISOString().split("T")[0];
      const symptomLogsData = await serverGetSymptomLogs(userId, startDate, endDate);
      setSymptomLogs(symptomLogsData);
    } catch (error) {
      console.error("Failed to load medical data:", error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
      case "active":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "confirmed":
        return "text-green-600 bg-green-50 border-green-200";
      case "completed":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      case "stable":
        return "text-green-600 bg-green-50 border-green-200";
      case "improving":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      case "worsening":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "text-green-600 bg-green-50 border-green-200";
      case "moderate":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "severe":
        return "text-red-600 bg-red-50 border-red-200";
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Smart Medical Management</h2>
          <p className="text-muted-foreground mt-1">AI-powered healthcare management and medication adherence</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("appointments")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "appointments"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Appointments
        </button>
        <button
          onClick={() => setActiveTab("medications")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "medications"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Pill className="w-4 h-4 inline mr-2" />
          Medications
        </button>
        <button
          onClick={() => setActiveTab("treatment")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "treatment"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="w-4 h-4 inline mr-2" />
          Treatment Plans
        </button>
        <button
          onClick={() => setActiveTab("conditions")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "conditions"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className="w-4 h-4 inline mr-2" />
          Conditions
        </button>
      </div>

      {/* Appointments Tab */}
      {activeTab === "appointments" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Schedule Appointment
            </button>
          </div>

          <div className="grid gap-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className={`p-4 rounded-lg border-2 ${getStatusColor(appointment.status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <Stethoscope className="w-5 h-5 mt-1" />
                    <div>
                      <p className="font-semibold">{appointment.doctorName}</p>
                      <p className="text-sm">{appointment.doctorSpecialty}</p>
                      <p className="text-xs text-muted-foreground">{appointment.hospitalClinic}</p>
                    </div>
                  </div>
                  <span className="text-xs font-medium uppercase px-2 py-1 rounded-full">
                    {appointment.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.time} ({appointment.duration} min)</span>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="font-medium">Reason:</span> {appointment.reason}
                </div>

                {appointment.reminderSent && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Bell className="w-3 h-3" />
                    <span>Reminder sent</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medications Tab */}
      {activeTab === "medications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Medications</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add Medication
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {medications.map((medication) => (
              <div key={medication.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <Pill className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold">{medication.name}</p>
                      {medication.genericName && (
                        <p className="text-xs text-muted-foreground">{medication.genericName}</p>
                      )}
                      <p className="text-sm">{medication.dosage} • {medication.frequency}</p>
                    </div>
                  </div>
                  {medication.isActive && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prescribed by:</span>
                    <span className="font-medium">{medication.prescribedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Adherence:</span>
                    <span className="font-medium">{medication.adherenceRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Refills:</span>
                    <span className="font-medium">{medication.refillsRemaining}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground">{medication.instructions}</p>
                </div>

                {medication.sideEffects && medication.sideEffects.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-muted-foreground">Side Effects:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {medication.sideEffects.map((effect, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full">
                          {effect}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Today's Reminders */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Today's Reminders
            </h4>
            <div className="grid gap-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-lg border-2 ${
                    reminder.taken
                      ? "text-green-600 bg-green-50 border-green-200"
                      : reminder.skipped
                      ? "text-red-600 bg-red-50 border-red-200"
                      : "text-gray-600 bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
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
                    <span className="text-xs font-medium uppercase">
                      {reminder.taken ? "Taken" : reminder.skipped ? "Skipped" : "Pending"}
                    </span>
                  </div>
                  {reminder.takenAt && (
                    <p className="text-xs mt-2 text-muted-foreground">
                      Taken at {new Date(reminder.takenAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Treatment Plans Tab */}
      {activeTab === "treatment" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Treatment Plans</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Create Plan
            </button>
          </div>

          <div className="grid gap-4">
            {treatmentPlans.map((plan) => (
              <div key={plan.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-lg">{plan.condition}</p>
                    <p className="text-sm text-muted-foreground">Dr. {plan.doctorName}</p>
                  </div>
                  <span className={`text-xs font-medium uppercase px-2 py-1 rounded-full ${getStatusColor(plan.status)}`}>
                    {plan.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{plan.progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${plan.progress}%` }}
                    />
                  </div>
                </div>

                {/* Goals */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Treatment Goals</p>
                  <ul className="text-sm space-y-1">
                    {plan.goals.map((goal, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Medications */}
                {plan.medications.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Medications</p>
                    <div className="flex flex-wrap gap-2">
                      {plan.medications.map((med, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-up Schedule */}
                {plan.followUpSchedule.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Follow-up Schedule</p>
                    <div className="space-y-2">
                      {plan.followUpSchedule.map((followUp, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{new Date(followUp.date).toLocaleDateString()}</span>
                          <span className="text-muted-foreground">•</span>
                          <span>{followUp.purpose}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conditions Tab */}
      {activeTab === "conditions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Chronic Conditions</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Add Condition
            </button>
          </div>

          <div className="grid gap-4">
            {chronicConditions.map((condition) => (
              <div key={condition.id} className="p-4 rounded-lg border bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-semibold text-lg">{condition.condition}</p>
                      <p className="text-sm text-muted-foreground">
                        Diagnosed {new Date(condition.diagnosisDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm">Managing: Dr. {condition.managingDoctor}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`text-xs font-medium uppercase px-2 py-1 rounded-full ${getSeverityColor(condition.severity)}`}>
                      {condition.severity}
                    </span>
                    <span className={`text-xs font-medium uppercase px-2 py-1 rounded-full ${getStatusColor(condition.status)}`}>
                      {condition.status}
                    </span>
                  </div>
                </div>

                {/* Medications */}
                {condition.medications.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Current Medications</p>
                    <div className="flex flex-wrap gap-2">
                      {condition.medications.map((med, i) => (
                        <span key={i} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {med}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checkup Information */}
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Last Checkup</p>
                    <p className="font-medium">{new Date(condition.lastCheckup).toLocaleDateString()}</p>
                  </div>
                  {condition.nextCheckup && (
                    <div>
                      <p className="text-muted-foreground">Next Checkup</p>
                      <p className="font-medium">{new Date(condition.nextCheckup).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>

                {/* Emergency Contacts */}
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Emergency Contacts
                  </p>
                  <div className="space-y-1">
                    {condition.emergencyContacts.map((contact, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{contact.name} ({contact.relationship})</span>
                        <span className="font-mono">{contact.phone}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {condition.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">{condition.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Recent Symptom Logs */}
          {symptomLogs.length > 0 && (
            <div className="space-y-3 pt-6 border-t">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Symptom Logs
              </h4>
              <div className="grid gap-3">
                {symptomLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">
                          {new Date(log.timestamp).toLocaleDateString()} at{" "}
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <span className={`text-xs font-medium uppercase px-2 py-1 rounded-full ${getSeverityColor(log.symptoms[0]?.severity || "mild")}`}>
                        {log.symptoms[0]?.severity || "mild"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Symptoms</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {log.symptoms.map((symptom, i) => (
                            <span key={i} className="text-xs px-2 py-1 bg-muted rounded-full">
                              {symptom.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {log.vitals && (
                        <div className="text-sm">
                          <p className="font-medium">Vitals</p>
                          <div className="grid grid-cols-2 gap-2 mt-1 text-xs">
                            {log.vitals.bloodPressure && (
                              <div>
                                <span className="text-muted-foreground">BP:</span>{" "}
                                {log.vitals.bloodPressure.systolic}/{log.vitals.bloodPressure.diastolic}
                              </div>
                            )}
                            {log.vitals.heartRate && (
                              <div>
                                <span className="text-muted-foreground">HR:</span> {log.vitals.heartRate} bpm
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {log.triggers && log.triggers.length > 0 && (
                        <div className="text-sm">
                          <p className="font-medium">Triggers</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {log.triggers.map((trigger, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                {trigger}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {log.notes && (
                        <div className="text-sm text-muted-foreground">{log.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Privacy Notice */}
      <div className="p-4 rounded-lg bg-muted/50 border text-sm">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="font-semibold">HIPAA Compliant</p>
            <p className="text-muted-foreground">
              All medical data is encrypted and stored securely in compliance with healthcare privacy regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
