// background.js

// --- GLOBALS ---
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

// --- LOGGING HELPER ---
function log(scriptName, message, ...args) {
  const now = new Date();
  const time = now.toLocaleTimeString();
  console.log(`[${scriptName}] [${time}] ${message}`, ...args);
}

// --- SETTINGS MANAGEMENT ---
async function loadAndParseAllSettings() {
  log('BG', "Loading and parsing all settings...");
  try {
    const data = await chrome.storage.local.get("ruhaniNuskhaContent");
    let ruhaniNuskhaString = data.ruhaniNuskhaContent || '';
    if (!ruhaniNuskhaString) {
      log('BG', "No RuhaniNuskha content found in storage. Initializing with default.");
    }
    let settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    if (ruhaniNuskhaString) {
      const parsedNuskha = parseRuhaniNuskha(ruhaniNuskhaString);
      Object.keys(parsedNuskha).forEach(section => {
        if (settings[section]) {
          Object.assign(settings[section], parsedNuskha[section]);
        } else {
          settings[section] = parsedNuskha[section];
        }
      });
    }
    const explicitSettings = await chrome.storage.local.get(Object.keys(settings.UserParams).concat(Object.keys(settings.FeatureToggles)));
    Object.assign(settings.UserParams, explicitSettings.UserParams);
    Object.assign(settings.FeatureToggles, explicitSettings.FeatureToggles);
    Object.assign(settings.DynamicState, explicitSettings.DynamicState);
    currentDilKiDastakSettings = settings;
    log('BG', "Current Dil Ki Dastak Settings loaded:", currentDilKiDastakSettings);
    return settings;
  } catch (error) {
    log('BG', "Error loading or parsing settings:", error);
    currentDilKiDastakSettings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
    return currentDilKiDastakSettings;
  }
}

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

// --- BROADCAST SETTINGS ---
function broadcastSettingsToContentScripts() {
  log('BG', 'Broadcasting settings to content scripts...');
  chrome.tabs.query({}, function(tabs) {
    for (let i = 0; i < tabs.length; ++i) {
      if (tabs[i].url && (tabs[i].url.startsWith('http:') || tabs[i].url.startsWith('https:'))) {
        chrome.tabs.sendMessage(tabs[i].id, {
          action: "settingsUpdated",
          settings: currentDilKiDastakSettings
        });
      }
    }
  });
}

// --- SAFE GET ---
function safeGet(obj, path, fallback = undefined) {
  try {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj) ?? fallback;
  } catch {
    return fallback;
  }
}

// --- WAQFA CHIME LOGIC ---
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

// --- MAQAM RECOGNITION ---
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
}

// --- FIRASAH PROMPTS ---
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

// --- EXTENSION INSTALLED/UPDATED ---
chrome.runtime.onInstalled.addListener(() => {
  log("BG", "Dil ki Dastak installed. Alhamdulillah. Jai Mata Di.");
  loadAndParseAllSettings().then(() => {
    log("BG", "Default settings loaded and initialized.");
    setupWaqfaAlarm();
    setupRuhaniNuskhaMonitor();
  });
});

// --- NEW TAB EVENT ---
chrome.tabs.onCreated.addListener((tab) => {
  log('BG', "New tab opened. Ya Mureed, kya Niyyah hai is safar ka?");
  if (currentDilKiDastakSettings?.featureToggles?.EnableWaqfa) {
    playWaqfaChime();
  }
});

// --- TAB UPDATED EVENT ---
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && (tab.url.startsWith('http:') || tab.url.startsWith('https:'))) {
    const detectedMaqam = classifyMaqam(tab.url);
    logMaqamVisit(detectedMaqam, tab.url);
    // Security: Warn if on known phishing or suspicious domains
    const phishingDomains = [
      "phishingsite.com", "malicious.example", "badbank.ru", "fake-login.com"
    ];
    if (tab.url && phishingDomains.some(domain => tab.url.includes(domain))) {
      chrome.tabs.sendMessage(tabId, {
        action: "securityWarning",
        message: "⚠️ Warning: This site is known for phishing or suspicious activity. Please do not enter personal information."
      });
    }
  }
});

// --- ON MESSAGE LISTENER ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "incrementShukr") {
    chrome.storage.local.get("shukrCount", (data) => {
      let newCount = (data.shukrCount || 0) + 1;
      chrome.storage.local.set({ shukrCount: newCount }, () => {
        sendResponse({ status: "Shukr noted!", count: newCount });
        if (currentDilKiDastakSettings?.featureToggles?.EnableShukrAffirmationSound) {
          playAudioInActiveTab("sounds/affirm_shukr.mp3");
        }
      });
    });
    return true;
  } else if (request.action === "requestInitialSettings") {
    log('BG', "Content script requested initial settings.");
    loadAndParseAllSettings().then(() => {
      sendResponse({ settings: currentDilKiDastakSettings });
    }).catch(error => {
      log('BG', 'Error loading settings for initial request:', error);
      sendResponse({ error: "Failed to load settings." });
    });
    return true;
  } else if (request.action === "playAudio") {
    playAudioInActiveTab(request.audioFile);
  } else if (request.action === "logMaqamVisit") {
    logMaqamVisit(request.maqamType, sender.tab.url);
  } else if (request.action === "chupaHuaRatanDiscovered") {
    chrome.storage.local.get("ratanDiscoveryCount", (data) => {
      let newCount = (data.ratanDiscoveryCount || 0) + 1;
      chrome.storage.local.set({ ratanDiscoveryCount: newCount }, () => {
        log('BG', `Chupa Hua Ratan Discovery Count: ${newCount}`);
      });
    });
    return true;
  } else if (request.action === "queryAI") {
    chrome.storage.local.get(['geminiApiKey', 'lmStudioEndpoint'], async (data) => {
      const apiKey = data.geminiApiKey;
      const endpoint = data.lmStudioEndpoint;
      const userPrompt = request.prompt;
      if (!apiKey && !endpoint) {
        sendResponse({ error: "AI API key or endpoint not configured." });
        return;
      }
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [{ role: "user", content: userPrompt }],
            model: "YOUR_MODEL_NAME_HERE"
          })
        });
        const aiResponse = await response.json();
        sendResponse({ status: "success", aiData: aiResponse });
      } catch (error) {
        console.error("Error querying AI:", error);
        sendResponse({ status: "error", message: error.message });
      }
    });
    return true;
  } else if (request.action === "requestSharedData") {
    loadAndParseAllSettings().then((allSettings) => {
      const sharedInsights = safeGet(allSettings, 'anamnesisExchangeContent', {});
      sendResponse({ insights: sharedInsights });
    });
    return true;
  } else if (request.action === "clipboardCopy" && request.data) {
    if (/(password|credit card|ssn|social security|bank account)/i.test(request.data)) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "images/icons/icon128.png",
        title: "Dil ki Dastak Security",
        message: "Be careful: You just copied sensitive information. Make sure you trust where you paste it."
      });
    }
  }
});

// --- EXTENSION ICON CLICK ---
chrome.action.onClicked.addListener((tab) => {
  if (chrome.runtime.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open(chrome.runtime.getURL('options.html'));
  }
});

// --- STORAGE CHANGE LISTENER ---
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.ruhaniNuskhaContent) {
    log('BG', "RuhaniNuskha content changed. Re-loading settings.");
    loadAndParseAllSettings().then(() => {
      broadcastSettingsToContentScripts();
      setupWaqfaAlarm();
    });
    // Security: Notify user if settings are changed from an unknown source
    if (changes.ruhaniNuskhaContent.oldValue !== undefined) {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "images/icons/icon128.png",
        title: "Dil ki Dastak Security",
        message: "Your settings were changed. If this wasn't you, please review your extension security."
      });
    }
  }
  if (namespace === 'local' && (changes.shukrCount || changes.currentNiyyah || changes.OverallEhsaasIntensity)) {
    loadAndParseAllSettings().then(() => {
      broadcastSettingsToContentScripts();
    });
  }
});

// --- RUHANI NUSKHA MONITOR ---
function setupRuhaniNuskhaMonitor() {
  chrome.alarms.clear('ruhaniNuskhaMonitor');
  chrome.alarms.create('ruhaniNuskhaMonitor', { periodInMinutes: 5 });
  chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'ruhaniNuskhaMonitor') {
      log('BG', 'RuhaniNuskhaMonitor triggered. Checking for updates...');
      const newSettings = await loadAndParseAllSettings();
      if (JSON.stringify(newSettings?.dynamicState) !== JSON.stringify(currentDilKiDastakSettings?.dynamicState)) {
        log('BG', 'RuhaniNuskha dynamic state changed. Broadcasting update.');
        currentDilKiDastakSettings = newSettings;
        broadcastSettingsToContentScripts();
      } else {
        log('BG', 'RuhaniNuskha dynamic state unchanged.');
      }
    }
  });
}

// --- SECURITY: EXTENSION VERSION CHECK ---
function checkExtensionVersion() {
  const currentVersion = chrome.runtime.getManifest().version;
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

// --- SECURITY: PERMISSIONS CHECK ---
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

// --- SECURITY: RECENT EVENTS HELPER ---
function getRecentSecurityEvents(callback) {
  callback([
    { time: new Date().toLocaleString(), event: "Checked extension version." },
    { time: new Date().toLocaleString(), event: "Checked permissions." }
  ]);
}


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


