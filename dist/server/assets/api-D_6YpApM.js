async function authenticateUser(credentials) {
  if (credentials.email && credentials.password && credentials.password.length >= 6) {
    return {
      success: true,
      token: "simulated-jwt-token-" + crypto.randomUUID(),
      userId: "user-" + crypto.randomUUID(),
      user: {
        id: "user-" + crypto.randomUUID(),
        email: credentials.email,
        name: "User",
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  }
  return {
    success: false,
    error: "Invalid credentials"
  };
}
async function signupUser(credentials) {
  if (credentials.email && credentials.password && credentials.name) {
    if (credentials.password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters"
      };
    }
    const userId = "user-" + crypto.randomUUID();
    return {
      success: true,
      token: "simulated-jwt-token-" + crypto.randomUUID(),
      userId,
      user: {
        id: userId,
        email: credentials.email,
        name: credentials.name,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      }
    };
  }
  return {
    success: false,
    error: "All fields are required"
  };
}
async function sendChatMessage(message, conversationHistory = []) {
  const responses = {
    default: "I'm here to help you with your health and wellness journey. What would you like to know?",
    hello: "Hello! I'm your Aegis Health AI assistant. I can help you with questions about your health data, wellness goals, or how to use the platform.",
    help: "I can assist you with:\n• Understanding your health metrics\n• Setting wellness goals\n• Navigating the platform\n• Privacy and security questions\n• Reward system information",
    health: "Your health data includes heart rate variability, sleep quality, stress levels, and activity metrics. I can help you understand what these numbers mean for your wellness journey.",
    rewards: "The Aegis reward system incentivizes healthy behaviors through points. You earn points for consistent activity, good sleep, and achieving your wellness goals.",
    security: "Aegis uses bank-level security with end-to-end encryption, multi-factor authentication, and AI-driven fraud detection to keep your health data safe."
  };
  const lowerMessage = message.toLowerCase();
  let response = responses.default;
  for (const [key, value] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      response = value;
      break;
    }
  }
  const assistantMessage = {
    id: crypto.randomUUID(),
    role: "assistant",
    content: response,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  };
  return {
    message: assistantMessage,
    suggestions: [
      "Tell me about my health metrics",
      "How do rewards work?",
      "Is my data secure?",
      "Help me set a goal"
    ]
  };
}
async function serverAuthenticateUser(credentials) {
  "use server";
  return await authenticateUser(credentials);
}
async function serverSignupUser(credentials) {
  "use server";
  return await signupUser(credentials);
}
async function serverSendChatMessage(message, conversationHistory = []) {
  "use server";
  return await sendChatMessage(message, conversationHistory);
}
export {
  serverSendChatMessage as a,
  serverSignupUser as b,
  serverAuthenticateUser as s
};
