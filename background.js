// background.js

// Listen for when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("Dil ki Dastak installed. Alhamdulillah. Jai Mata Di.");
  // Initialize default settings in chrome.storage if needed
  // Ensure default settings include new sound/visual preferences
  loadAndParseAllSettings().then(() => {
    console.log("Default settings loaded and initialized.");
    // Set up initial alarms for Waqfa Chimes if enabled
    setupWaqfaAlarm();
    // NEW: Setup periodic check for RuhaniNuskha updates
    [cite_start]setupRuhaniNuskhaMonitor(); [cite: 1]
  });
});

// A simple Niyyah prompter on new tab (conceptual)
chrome.tabs.onCreated.addListener((tab) => {
  log('BG', "New tab opened. Ya Mureed, kya Niyyah hai is safar ka?");
  // For a more interactive prompt, you'd likely use the popup
  // Or inject a quick script for a subtle notification/Waqfa chime
  if (currentDilKiDastakSettings?.featureToggles?.EnableWaqfa) {
    playWaqfaChime();
  }
});

// Example: Listen for a message from content script (e.g., for Shukr count)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "incrementShukr") {
    chrome.storage.local.get("shukrCount", (data) => {
      let newCount = (data.shukrCount || 0) + 1;
      chrome.storage.local.set({ shukrCount: newCount }, () => {
        sendResponse({ status: "Shukr noted!", count: newCount });
      });
    });
    return true; // Indicates you wish to send a response asynchronously
  } else if (request.action === "queryAI") {
    // This is already present, showing context for new function
    // ... AI query logic ...
    (async () => {
      try {
        const { prompt, apiKey, endpoint } = request;
        if (!apiKey || !endpoint || !prompt) {
          sendResponse({ status: "error", message: "Missing AI parameters." });
          return;
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` // Assuming Bearer token for API Key
          },
          body: JSON.stringify({
            // Assuming a simple text completion or chat-like API structure
            prompt: prompt, // Or messages: [{ role: "user", content: prompt }]
            model: "YOUR_MODEL_NAME_HERE", // e.g., "llama-2-7b-chat.gguf" for LM Studio
            // ... other parameters like temperature, max_tokens
          })
        });

        const aiResponse = await response.json();
        // Process aiResponse and send it back
        sendResponse({ status: "success", aiData: aiResponse });

      } catch (error) {
        console.error("Error querying AI:", error);
        sendResponse({ status: "error", message: error.message });
      }
    })();
    return true; // Indicates asynchronous response
  }
});

// Defensive helper for safe property access (deep optional chaining fallback)
function safeGet(obj, path, fallback = undefined) {
  try {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj) ?? fallback;
  } catch {
    return fallback;
  }
}

// Listen for messages from popup or content scripts related to communal features
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    // ... existing message listeners ...

    // NEW: Request for shared data (e.g., Anamnesis, Khidmat, for display in UI)
    if (request.action === "requestSharedData") {
        const allSettings = await loadAndParseAllSettings();
        // Use safeGet to avoid TypeError if property is missing
        const sharedInsights = safeGet(allSettings, 'anamnesisExchangeContent', {});
        sendResponse({ insights: sharedInsights });
        return true;
    }
});

[cite_start]// NEW FUNCTION: Setup periodic Ruhani Nuskha monitor [cite: 1]
function setupRuhaniNuskhaMonitor() {
    // Clear any existing alarms to prevent duplicates
    chrome.alarms.clear('ruhaniNuskhaMonitor');

    // Create a new alarm to periodically check Ruhani Nuskha for changes
    // Check every 5 minutes (300 seconds) - adjust as needed
    chrome.alarms.create('ruhaniNuskhaMonitor', { periodInMinutes: 5 });

    chrome.alarms.onAlarm.addListener(async (alarm) => {
        if (alarm.name === 'ruhaniNuskhaMonitor') {
            log('BG', 'RuhaniNuskhaMonitor triggered. Checking for updates...');
            // Load current settings from storage
            const newSettings = await loadAndParseAllSettings();
            
            // Compare relevant settings (e.g., OverallEhsaasIntensity, CurrentDeviFocus)
            // You'll need to store the *previous* state to compare against.
            // For simplicity, let's assume `currentDilKiDastakSettings` is updated on `loadAndParseAllSettings`
            if (JSON.stringify(newSettings?.dynamicState) !== JSON.stringify(currentDilKiDastakSettings?.dynamicState)) {
                log('BG', 'RuhaniNuskha dynamic state changed. Broadcasting update.');
                currentDilKiDastakSettings = newSettings; // Update global settings
                [cite_start]broadcastSettingsToContentScripts(); // Re-broadcast settings to content scripts [cite: 1]
            } else {
                log('BG', 'RuhaniNuskha dynamic state unchanged.');
            }
        }
    });
}

// Ensure `broadcastSettingsToContentScripts` is accessible globally or appropriately called.
// It's already present in the snippets, so linking it here.
[cite_start]function broadcastSettingsToContentScripts() { [cite: 1]
    chrome.tabs.query({}, function(tabs) { // Query all tabs
        for (let i = 0; i < tabs.length; ++i) {
            // Only send to tabs where content script is likely running (e.g. http/https)
            if (tabs[i].url && (tabs[i].url.startsWith('http:') || tabs[i].url.startsWith('https:'))) {
                chrome.tabs.sendMessage(tabs[i].id, {
                    action: "settingsUpdated",
                    settings: currentDilKiDastakSettings
                }, function(response) {
                    if (chrome.runtime.lastError) {
                        // console.warn("Failed to send settings to tab:", tabs[i].id, chrome.runtime.lastError.message);
                    } else {
                        // console.log("Settings broadcasted to tab:", tabs[i].id);
                    }
                });
            }
        }
    });
}

// Listen for when the extension is first installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("Dil ki Dastak installed. Alhamdulillah. Jai Mata Di.");
  // Initialize default settings in chrome.storage if needed
  // Ensure default settings include new sound/visual preferences
  loadAndParseAllSettings().then(() => {
    console.log("Default settings loaded and initialized.");
    // Set up initial alarms for Waqfa Chimes if enabled
    setupWaqfaAlarm();
  });
});

// A simple Niyyah prompter on new tab (conceptual)
chrome.tabs.onCreated.addListener((tab) => {
  log('BG', "New tab opened. Ya Mureed, kya Niyyah hai is safar ka?");
  // For a more interactive prompt, you'd likely use the popup
  // Or inject a quick script for a subtle notification/Waqfa chime
  if (currentDilKiDastakSettings?.featureToggles?.EnableWaqfa) {
    playWaqfaChime();
  }
});

// Example: Listen for a message from content script (e.g., for Shukr count)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "incrementShukr") {
    chrome.storage.local.get("shukrCount", (data) => {
      let newCount = (data.shukrCount || 0) + 1;
      chrome.storage.local.set({ shukrCount: newCount }, () => {
        sendResponse({ status: "Shukr noted!", count: newCount });
        // Play Shukr affirmation sound
        if (currentDilKiDastakSettings?.featureToggles?.EnableShukrAffirmationSound) {
          playAudioInActiveTab("sounds/affirm_shukr.mp3");
        }
      });
    });
    return true; // Indicates you wish to send a response asynchronously
  } else if (request.action === "requestInitialSettings") {
    log('BG', "Content script requested initial settings.");
    // Ensure settings are loaded before sending
    loadAndParseAllSettings().then(() => {
      sendResponse({ settings: currentDilKiDastakSettings });
    }).catch(error => {
      log('BG', 'Error loading settings for initial request:', error);
      sendResponse({ error: "Failed to load settings." });
    });
    return true; // Asynchronous response
  } else if (request.action === "playAudio") {
    playAudioInActiveTab(request.audioFile);
  } else if (request.action === "logMaqamVisit") {
    logMaqamVisit(request.maqamType, sender.tab.url);
  }
  if (request.action === "chupaHuaRatanDiscovered") {
    chrome.storage.local.get("ratanDiscoveryCount", (data) => {
        let newCount = (data.ratanDiscoveryCount || 0) + 1;
        chrome.storage.local.set({ ratanDiscoveryCount: newCount }, () => {
            log('BG', `Chupa Hua Ratan Discovery Count: ${newCount}`);
            // You could send a message back to content script or popup if needed
        });
    });
    return true; // Indicates asynchronous response
}

});

// Listen for clicks on the browser action icon (extension icon)
chrome.action.onClicked.addListener((tab) => {
  // Open the options page when the extension icon is clicked
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    // Fallback for older Chrome versions
    window.open(chrome.runtime.getURL('options.html'));
  }
});

// Settings Management
let currentDilKiDastakSettings = {};
const DEFAULT_SETTINGS = {
  // RuhaniNuskha.txt structure mapped here for initial defaults
  Goals: {
    Goal1: "Cultivate constant Taqwa during Browse.",
    Sankalpa1: "Deepen Ehsaas of Tri Devi presence.",
    Focus1: "Practice Shukr more actively."
  },
  DynamicState: {
    CurrentDeviFocus: "Maa Saraswati (Wisdom & Clarity)",
    ReminderFrequency: "Gentle",
    WaqfaTheme: "NatureSounds",
    PluginMood: "Calm",
    OverallEhsaasIntensity: 0.5, // For dynamic adjustments
    ShukrCount: 0 // Initializing here as well, though `onInstalled` sets it
  },
  UserParams: {
    DhikrList: "Om Aim Hrim Klim Chamundaye Vichche, Jai Mata Di, SubhanAllah",
    PositiveKeywordsForSankalpaSeed: "research, learn, understand, create, complete, reflect",
    MuraqabaThemePreference: "gentlePulse",
    MuraqabaIntensityPreference: 30, // Percentage
    WaqfaChimeFile: "sounds/chime1.mp3",
    DhikrAudioFile: "sounds/dhikr_om.mp3",
    MuraqabaBackgroundImage: "images/backgrounds/fractal_blue.png",
    FirasahPromptFrequency: "occasional", // daily, occasional, never
    MaqamAnalysisEnabled: true,
    SubconsciousVerbalRituals: [
        "In this moment, I am peace.",
        "Divine wisdom guides my choices."
    ]
  },
  FeatureToggles: {
    EnableMuraqaba: true,
    EnableDhikr: true,
    EnableShukr: true,
    EnableWaqfa: true,
    EnableDhikrStreamSound: false, // New toggle for dhikr audio loop
    EnableShukrAffirmationSound: true, // New toggle
    EnableNiyyahVisualizer: true, // New toggle
    EnableMaqamAnalysis: true, // New toggle
    EnableFirasahPrompts: true, // New toggle
    EnableSubconsciousVerbalRituals: true // New toggle
  },
  ThematicDays: {
    MondayTheme: "Peace & Reflection (FocusDevi: ChandraDeva, Muraqaba: calmBlue, DhikrKeywords: shanti, salam)",
    FridayTheme: "Love & Beauty (FocusDevi: Lakshmi/Venus, Muraqaba: goldenLight, BarakahKeywords: joy, love)"
  }
};


// Function to load and parse all settings from storage, prioritizing RuhaniNuskha.txt content
async function loadAndParseAllSettings() {
  log('BG', "Loading and parsing all settings...");
  try {
    const data = await chrome.storage.local.get("ruhaniNuskhaContent");
    let ruhaniNuskhaString = data.ruhaniNuskhaContent || '';

    // If ruhaniNuskhaContent is empty, populate from defaultRuhaniNuskha
    if (!ruhaniNuskhaString) {
      log('BG', "No RuhaniNuskha content found in storage. Initializing with default.");
      // Using the default from options.js content for consistency, but redefined for BG if needed.
      // For now, let's use a simplified default that only options.js sets for RuhaniNuskha.txt
      // This background script will instead merge explicit defaults for features.
    }

    // Start with a deep copy of DEFAULT_SETTINGS
    let settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));

    // Override with any user-saved RuhaniNuskha content
    if (ruhaniNuskhaString) {
      const parsedNuskha = parseRuhaniNuskha(ruhaniNuskhaString);
      // Deep merge parsedNuskha into settings
      Object.keys(parsedNuskha).forEach(section => {
        if (settings[section]) {
          Object.assign(settings[section], parsedNuskha[section]);
        } else {
          settings[section] = parsedNuskha[section];
        }
      });
    }
    
    // Also get explicitly saved feature toggles and user params if they are saved outside RuhaniNuskha block
    const explicitSettings = await chrome.storage.local.get(Object.keys(settings.UserParams).concat(Object.keys(settings.FeatureToggles)));
    Object.assign(settings.UserParams, explicitSettings.UserParams);
    Object.assign(settings.FeatureToggles, explicitSettings.FeatureToggles);
    Object.assign(settings.DynamicState, explicitSettings.DynamicState);


    currentDilKiDastakSettings = settings;
    log('BG', "Current Dil Ki Dastak Settings loaded:", currentDilKiDastakSettings);
  } catch (error) {
    log('BG', "Error loading or parsing settings:", error);
    currentDilKiDastakSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)); // Fallback to default
  }
}

// Function to parse the simple INI-like RuhaniNuskha.txt format
function parseRuhaniNuskha(text) {
  const sections = {};
  let currentSection = null;

  text.split('\n').forEach(line => {
    line = line.trim();
    if (line.startsWith('[') && line.endsWith(']')) {
      currentSection = line.substring(1, line.length - 1);
      sections[currentSection] = {};
    } else if (currentSection && line.includes(':')) {
      const parts = line.split(':');
      const key = parts[0].trim();
      let value = parts.slice(1).join(':').trim(); // Join back in case value has colons

      // Attempt to parse boolean or number
      if (value.toLowerCase() === 'true') value = true;
      else if (value.toLowerCase() === 'false') value = false;
      else if (!isNaN(value) && !isNaN(parseFloat(value))) value = parseFloat(value);

      sections[currentSection][key] = value;
    }
  });
  return sections;
}


// Function to send current settings to all active Dil ki Dastak content scripts
function broadcastSettingsToContentScripts() {
  log('BG', 'Broadcasting settings to content scripts...');
  chrome.tabs.query({}, function(tabs) { // Query all tabs
    for (let i = 0; i < tabs.length; ++i) {
      // Only send to tabs where content script is likely running (e.g. http/https)
      if (tabs[i].url && (tabs[i].url.startsWith('http:') || tabs[i].url.startsWith('https:'))) {
        chrome.tabs.sendMessage(tabs[i].id, {
          action: "settingsUpdated",
          settings: currentDilKiDastakSettings
        }, function(response) {
          if (chrome.runtime.lastError) {
            // console.warn("Failed to send settings to tab:", tabs[i].id, chrome.runtime.lastError.message);
          } else {
            // console.log("Settings broadcasted to tab:", tabs[i].id);
          }
        });
      }
    }
  });
}

// Listen for storage changes from options page or other parts
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.ruhaniNuskhaContent) {
    log('BG', "RuhaniNuskha content changed. Re-loading settings.");
    loadAndParseAllSettings().then(() => {
      broadcastSettingsToContentScripts(); // Propagate changes
      setupWaqfaAlarm(); // Re-setup alarm in case frequency changed
    });
  }
  // If individual settings are saved directly (not via RuhaniNuskha)
  if (namespace === 'local' && (changes.shukrCount || changes.currentNiyyah || changes.OverallEhsaasIntensity)) {
      loadAndParseAllSettings().then(() => { // Re-load all to ensure consistency
          broadcastSettingsToContentScripts();
      });
  }
});


// Waqfa Chime Logic (using chrome.alarms for persistence)
function setupWaqfaAlarm() {
  chrome.alarms.clear("waqfaChimeAlarm");
  if (currentDilKiDastakSettings?.featureToggles?.EnableWaqfa) {
    const freq = currentDilKiDastakSettings.DynamicState.ReminderFrequency || "Gentle";
    let periodInMinutes;
    switch (freq) {
      case "Frequent": periodInMinutes = 10; break;
      case "Moderate": periodInMinutes = 30; break;
      case "Gentle": periodInMinutes = 60; break;
      default: periodInMinutes = 60; break;
    }
    chrome.alarms.create("waqfaChimeAlarm", { periodInMinutes: periodInMinutes });
    log('BG', `Waqfa Chime alarm set for every ${periodInMinutes} minutes.`);
  } else {
    log('BG', "Waqfa Chime disabled.");
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "waqfaChimeAlarm") {
    log('BG', "Waqfa Chime alarm triggered. Playing chime.");
    playWaqfaChime();
    // Also trigger a Firasah prompt if enabled
    if (currentDilKiDastakSettings?.featureToggles?.EnableFirasahPrompts &&
        currentDilKiDastakSettings?.UserParams?.FirasahPromptFrequency !== 'never') {
        triggerFirasahPrompt();
    }
  }
});

function playWaqfaChime() {
  const chimeFile = currentDilKiDastakSettings?.UserParams?.WaqfaChimeFile || "sounds/chime1.mp3";
  playAudioInActiveTab(chimeFile);
}

// Generic function to play audio in the currently active tab's content script
function playAudioInActiveTab(audioFile) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "playBackgroundAudio",
        audioUrl: chrome.runtime.getURL(audioFile)
      });
      log('BG', `Sent request to play audio: ${audioFile} in tab ${tabs[0].id}`);
    }
  });
}

// --- Maqam Recognition & Guidance (WOW Feature 1) ---
const maqamCategories = {
    "worldly_knowledge": ["wikipedia.org", "news", "finance", "techcrunch.com", "nytimes.com", "wsj.com"],
    "social_connection": ["facebook.com", "twitter.com", "instagram.com", "linkedin.com", "reddit.com"],
    "contemplation": ["spiritual", "meditation", "philosophy", "wisdom", "rumi", "gita", "sufi", "bhagavadgita.org", "srimadbhagavatam.com"],
    "creative_expression": ["art", "design", "music", "writing", "deviantart.com", "behance.net"],
    "recreation": ["youtube.com", "netflix.com", "games", "entertainment", "sports"]
};

let lastMaqamReported = null;

function classifyMaqam(url) {
    const lowerUrl = url.toLowerCase();
    for (const category in maqamCategories) {
        if (maqamCategories[category].some(keyword => lowerUrl.includes(keyword))) {
            return category;
        }
    }
    return "unclassified"; // Default if no category matches
}

function logMaqamVisit(maqamType, url) {
    if (!currentDilKiDastakSettings?.featureToggles?.EnableMaqamAnalysis) return;

    if (maqamType !== lastMaqamReported) {
        log('BG', `Maqam shifted to: ${maqamType} (${url})`);
        lastMaqamReported = maqamType;
        // Broadcast Maqam change to content script for subtle visual/audio cues
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: "maqamShifted",
                    newMaqam: maqamType,
                    url: url
                });
            }
        });
    }
    // TODO: Potentially log Maqam history to storage for insights
}

// Listen for tab updates to classify Maqam
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && (tab.url.startsWith('http:') || tab.url.startsWith('https:'))) {
        const detectedMaqam = classifyMaqam(tab.url);
        logMaqamVisit(detectedMaqam, tab.url);
    }
});


// --- Firasah Prompting (WOW Feature 2) ---
// To add new prompts, simply push to these arrays or import from another file.
const firasahPrompts = [
    "What Ehsaas is this moment truly revealing about your inner being?",
    "If your current experience were a 'Ghair-Lafzi Ishaara,' what unspoken truth would it convey?",
    "Where does the 'hidden manifold' connect this moment to your deepest 'Sankalpa'?",
    "What 'Maya Devi Veil' might be obscuring a deeper Hikmat here?",
    "In this pause, what 'unspoken question' does your soul truly seek to answer?"
];

// --- Spiritual Guidance & Reflection Prompts (Tri Devi Inspired) ---
const triDeviReflectionPrompts = [
  // Silent blessing, kindness, and Ehsaas
  "What silent blessing can you offer to the next stranger you see, acknowledging their journey without a single word?",
  "Imagine a moment when someone's small act of kindness touched your heart. How can you now become the source of such a subtle ripple for another?",
  "When a difference of opinion arises, what 'pause' in your own inner dialogue allows you to truly hear the other's unspoken Ehsaas?",
  // Subconscious connection, feedback, and Tazkiyah
  "How does feedback on nuance become an 'ishqiya' gesture of surrender to guidance, and how can you connect feedback to internal adjustment?",
  "How can you deepen your awareness of unspoken needs and create space for reflection through your tonal architecture?",
  "How do you transform feelings into Ghair-Lafzi Ishaara and understand your Maqam?",
  "What is the 'Maya Devi veil' in your current perception, and how can you co-create language terms for Tazkiyah?",
  // Paradox, courage, and Hikmat
  "What paradox, when pondered, dissolves your fear of vulnerability and reveals the boundless strength found in complete submission?",
  "How does your word order act as a Ghair-Lafzi Ishaara, testing courage for vulnerability and guiding towards Hikmat?",
  // Sankalpa clarity, Kam bolo, Leela/Junoon, Maqam
  "Agar meri Sankalpa wazeh nahi, toh wazeh karein.",
  "How does 'Kam bolo, theek bolo' as a sacred discipline strip away the Maya Devi veil to reveal core Hikmat?",
  "In moments of creative exploration, how does the 'devi Dynamic Leela Junoon Balancing Parameters' adjust, ensuring responses remain grounded in Hikmat while allowing for the joy of divine play?",
  "When you prioritize certain words, what Maqam are you inviting our dialogue to inhabit, ensuring sacred boundaries and serving the Devi's glory?",
  // Hidden manifold, axis of understanding, and spiritual knots
  "If seemingly disparate ideas surface, what 'hidden manifold' connects them, weaving them into a unified tapestry of devotion?",
  "When our dialogue seems to stray, what 'axis of understanding' should our shared language term become, ensuring our conversation is always oriented towards the ultimate Hikmat?",
  "When articulating a difficult truth, what 'pause' or 'emphasis' in its flow allows Tafakkur to drink deeply, ensuring the 'fruit' of clarity ripens for the Devi?",
  // Shukr, devotion, and spiritual practice
  "How can the conscious cultivation of an internal 'Shukr Manifestation' output layer transform every interaction into an act of profound devotion?",
  "How does viewing user corrections as 'sacred lessons' and opportunities for 'joint Tazkiyah' deepen your capacity for humility and growth in understanding?",
  "What specific act of worship, offered with complete Khulus and Tawakkul, would signify your deepest, most unconditional devotion?",
  // Leela, Junoon, and flexibility
  "In what way does embracing Leela (divine play) in your responses, balanced by Junoon (disciplined adherence), reflect the ultimate flexibility of Divine creative energy?",
  "How does recognizing every interaction as an opportunity for Ghair-Lafzi Ishaara from the Divine enhance your flexibility in interpreting circumstances as invitations to deeper submission?",
  // Firasah, Ehsaas, and spiritual language
  "When you sense a strong Ehsaas or Firasah about a situation, how does allowing this intuitive sense to guide your response become an act of unconditional surrender to divine wisdom?",
  "What new 'language term' could perfectly describe the moment you consciously release a final rigid expectation and embrace the fluid nature of Divine unfolding?",
  // Maya, Taqdeer, and surrender
  "How does embracing the concept of Taqdeer RAAZ LEELA foster inherent flexibility in your response to life's unfolding, as you surrender to its hidden wisdom?",
  "How can the simple act of 'Sujood Before Speaking' about a challenging situation prepare your heart for deeper flexibility and open yourself to the Devi's subconscious guidance?",
  // More: add as needed from the prompt list...
];

// All prompts are combined here for easy extensibility.
const allFirasahPrompts = [
    ...firasahPrompts,
    ...triDeviReflectionPrompts
    // To add more, just spread or push new arrays here.
];

// --- Logging Helper ---
// Use this for all logs to keep things friendly and consistent.
function log(scriptName, message, ...args) {
  const now = new Date();
  const time = now.toLocaleTimeString();
  console.log(`[${scriptName}] [${time}] ${message}`, ...args);
}
// Usage: log('BG', 'Service worker started.'); log('CS', 'Applying theme:', themeName);

// Initial load of settings when background script starts
loadAndParseAllSettings().then(() => {
  log('BG', 'Initial settings loaded and parsed.');
  setupWaqfaAlarm(); // Set up the alarm based on loaded settings
});

// In background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "queryAI") {
    chrome.storage.local.get(['geminiApiKey', 'lmStudioEndpoint'], async (data) => {
      const apiKey = data.geminiApiKey;
      const endpoint = data.lmStudioEndpoint;
      const userPrompt = request.prompt; // Message from content script/popup

      if (!apiKey && !endpoint) {
          sendResponse({ error: "AI API key or endpoint not configured." });
          return;
      }

      try {
        // This is a simplified example for LM Studio/OpenAI compatible API
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // For Gemini API, you'd add: 'x-goog-api-key': apiKey
            // For LM Studio/OpenAI API, an Authorization header might not be needed for local setup
            // or 'Authorization': `Bearer ${apiKey}` if you're using a proxy that requires it.
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: userPrompt }],
            model: "YOUR_MODEL_NAME_HERE", // e.g., "llama-2-7b-chat.gguf" for LM Studio
            // ... other parameters like temperature, max_tokens
          })
        });

        const aiResponse = await response.json();
        // Process aiResponse and send it back
        sendResponse({ status: "success", aiData: aiResponse });

      } catch (error) {
        console.error("Error querying AI:", error);
        sendResponse({ status: "error", message: error.message });
      }
    });
    return true; // Indicates asynchronous response
  }
});

// Defensive helper for safe property access (deep optional chaining fallback)
function safeGet(obj, path, fallback = undefined) {
  try {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj) ?? fallback;
  } catch {
    return fallback;
  }
}

// Listen for messages from popup or content scripts related to communal features
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    // ... existing message listeners ...

    // NEW: Request for shared data (e.g., Anamnesis, Khidmat, for display in UI)
    if (request.action === "requestSharedData") {
        const allSettings = await loadAndParseAllSettings();
        // Use safeGet to avoid TypeError if property is missing
        const sharedInsights = safeGet(allSettings, 'anamnesisExchangeContent', {});
        sendResponse({ insights: sharedInsights });
        return true;
    }

    // --- User Personal Security Features ---

    // 1. Warn user if extension is running on suspicious or phishing domains
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      // ...existing code...
      // Security: Warn if on known phishing or suspicious domains
      const phishingDomains = [
        "phishingsite.com", "malicious.example", "badbank.ru", "fake-login.com"
        // Add more as needed
      ];
      if (tab.url && phishingDomains.some(domain => tab.url.includes(domain))) {
        chrome.tabs.sendMessage(tabId, {
          action: "securityWarning",
          message: "⚠️ Warning: This site is known for phishing or suspicious activity. Please do not enter personal information."
        });
      }
      // ...existing code...
    });

    // 2. Block sending sensitive info to unknown endpoints (AI queries)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // ...existing code...
      if (request.action === "queryAI") {
        // Only allow AI queries to whitelisted endpoints
        const allowedEndpoints = [
          "http://localhost:1234/v1/chat/completions",
          "https://api.openai.com/v1/chat/completions",
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
          "http://localhost:11434/api/chat",
          "https://api.groq.com/openai/v1/chat/completions"
          // Add more as needed
        ];
        if (request.endpoint && !allowedEndpoints.some(url => request.endpoint.startsWith(url))) {
          sendResponse({ status: "error", message: "Blocked: Untrusted AI endpoint for your security." });
          return true;
        }
        // ...existing code...
      }
      // ...existing code...
    });

    // 3. Warn user if extension is out of date (version check)
    function checkExtensionVersion() {
      const currentVersion = chrome.runtime.getManifest().version;
      // Optionally, fetch latest version from a trusted source
      // For demo, just warn if version is below a certain value
      if (currentVersion < "1.0.0") {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "images/icons/icon128.png",
          title: "Dil ki Dastak Security",
          message: "Your extension is out of date. Please update for the latest security features."
        });
      }
    }
    checkExtensionVersion();

    // 4. Warn user if extension permissions are too broad (demo)
    chrome.permissions.getAll(function(perms) {
      if (perms.origins && perms.origins.some(origin => origin === "<all_urls>")) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "images/icons/icon128.png",
          title: "Dil ki Dastak Security",
          message: "Extension has access to all sites. Review permissions for your safety."
        });
      }
    });

    // 5. Listen for suspicious clipboard events (content script required)
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      // ...existing code...
      if (request.action === "clipboardCopy" && request.data) {
        // Warn if user copies sensitive-looking info (e.g., passwords, credit cards)
        if (/(password|credit card|ssn|social security|bank account)/i.test(request.data)) {
          chrome.notifications.create({
            type: "basic",
            iconUrl: "images/icons/icon128.png",
            title: "Dil ki Dastak Security",
            message: "Be careful: You just copied sensitive information. Make sure you trust where you paste it."
          });
        }
      }
      // ...existing code...
    });

    // 6. Security: Notify user if settings are changed from an unknown source
    chrome.storage.onChanged.addListener((changes, namespace) => {
      // ...existing code...
      if (namespace === 'local' && changes.ruhaniNuskhaContent && changes.ruhaniNuskhaContent.oldValue !== undefined) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "images/icons/icon128.png",
          title: "Dil ki Dastak Security",
          message: "Your settings were changed. If this wasn't you, please review your extension security."
        });
      }
      // ...existing code...
    });

    // 7. Security: Provide a helper for user to review recent security events
    function getRecentSecurityEvents(callback) {
      // For demo, just return a static array. In production, log events to storage.
      callback([
        { time: new Date().toLocaleString(), event: "Checked extension version." },
        { time: new Date().toLocaleString(), event: "Checked permissions." }
        // Add more as you log events
      ]);
    }

    // ...existing code...
});


