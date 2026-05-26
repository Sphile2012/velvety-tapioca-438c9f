import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (for demo purposes)
const storage = {
  users: new Map(),
  profiles: new Map(),
  onboardingProgress: new Map(),
  devices: new Map(),
  hivRecords: new Map(),
  counselingSessions: new Map(),
  wellnessLogs: new Map(),
  artReminders: new Map(),
  appointments: new Map(),
  medications: new Map(),
  treatmentPlans: new Map(),
};

// Load data from file if exists
function loadData() {
  const dataFile = path.join(__dirname, 'data.json');
  if (fs.existsSync(dataFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
      Object.keys(storage).forEach(key => {
        if (data[key]) {
          storage[key] = new Map(Object.entries(data[key]));
        }
      });
      console.log('Data loaded from file');
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }
}

// Save data to file
function saveData() {
  const data = {};
  Object.keys(storage).forEach(key => {
    data[key] = Object.fromEntries(storage[key]);
  });
  const dataFile = path.join(__dirname, 'data.json');
  try {
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
}

// Initialize storage
loadData();

// API Routes

// User endpoints
app.post('/api/users', async (req, res) => {
  try {
    const { id, email, name } = req.body;
    storage.users.set(id, { id, email, name, createdAt: new Date().toISOString() });
    saveData();
    res.json({ success: true, user: { id, email, name } });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: 'Failed to create user' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const user = storage.users.get(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

// Profile endpoints
app.post('/api/profiles', async (req, res) => {
  try {
    const profile = req.body;
    storage.profiles.set(profile.id, profile);
    saveData();
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ success: false, error: 'Failed to save profile' });
  }
});

app.get('/api/profiles/:userId', async (req, res) => {
  try {
    const profile = Array.from(storage.profiles.values()).find(p => p.userId === req.params.userId);
    if (!profile) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
});

app.put('/api/profiles/:userId', async (req, res) => {
  try {
    const profile = req.body;
    const existingProfile = Array.from(storage.profiles.values()).find(p => p.userId === req.params.userId);
    if (existingProfile) {
      storage.profiles.set(existingProfile.id, { ...existingProfile, ...profile, updatedAt: new Date().toISOString() });
      saveData();
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, error: 'Failed to update profile' });
  }
});

// Onboarding progress endpoints
app.post('/api/onboarding-progress', async (req, res) => {
  try {
    const progress = req.body;
    storage.onboardingProgress.set(progress.userId, progress);
    saveData();
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving onboarding progress:', error);
    res.status(500).json({ success: false, error: 'Failed to save onboarding progress' });
  }
});

app.get('/api/onboarding-progress/:userId', async (req, res) => {
  try {
    const progress = storage.onboardingProgress.get(req.params.userId);
    if (!progress) {
      return res.status(404).json({ success: false, error: 'Progress not found' });
    }
    res.json(progress);
  } catch (error) {
    console.error('Error fetching onboarding progress:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch onboarding progress' });
  }
});

// Device endpoints
app.post('/api/devices', async (req, res) => {
  try {
    const device = req.body;
    const userDevices = storage.devices.get(device.userId) || [];
    userDevices.push(device);
    storage.devices.set(device.userId, userDevices);
    saveData();
    res.json(device);
  } catch (error) {
    console.error('Error connecting device:', error);
    res.status(500).json({ success: false, error: 'Failed to connect device' });
  }
});

app.get('/api/devices/:userId', async (req, res) => {
  try {
    const devices = storage.devices.get(req.params.userId) || [];
    res.json(devices);
  } catch (error) {
    console.error('Error fetching devices:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch devices' });
  }
});

// HIV Support endpoints
app.post('/api/hiv-records', async (req, res) => {
  try {
    const record = req.body;
    const userRecords = storage.hivRecords.get(record.userId) || [];
    userRecords.push(record);
    storage.hivRecords.set(record.userId, userRecords);
    saveData();
    res.json({ success: true, record });
  } catch (error) {
    console.error('Error saving HIV record:', error);
    res.status(500).json({ success: false, error: 'Failed to save HIV record' });
  }
});

app.get('/api/hiv-records/:userId', async (req, res) => {
  try {
    const records = storage.hivRecords.get(req.params.userId) || [];
    res.json(records);
  } catch (error) {
    console.error('Error fetching HIV records:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch HIV records' });
  }
});

// Appointments endpoints
app.post('/api/appointments', async (req, res) => {
  try {
    const appointment = req.body;
    const userAppointments = storage.appointments.get(appointment.userId) || [];
    userAppointments.push(appointment);
    storage.appointments.set(appointment.userId, userAppointments);
    saveData();
    res.json({ success: true, appointment });
  } catch (error) {
    console.error('Error saving appointment:', error);
    res.status(500).json({ success: false, error: 'Failed to save appointment' });
  }
});

app.get('/api/appointments/:userId', async (req, res) => {
  try {
    const appointments = storage.appointments.get(req.params.userId) || [];
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch appointments' });
  }
});

// Medications endpoints
app.post('/api/medications', async (req, res) => {
  try {
    const medication = req.body;
    const userMedications = storage.medications.get(medication.userId) || [];
    userMedications.push(medication);
    storage.medications.set(medication.userId, userMedications);
    saveData();
    res.json({ success: true, medication });
  } catch (error) {
    console.error('Error saving medication:', error);
    res.status(500).json({ success: false, error: 'Failed to save medication' });
  }
});

app.get('/api/medications/:userId', async (req, res) => {
  try {
    const medications = storage.medications.get(req.params.userId) || [];
    res.json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch medications' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
