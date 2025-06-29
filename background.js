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
        "In this moment, I am stillness.",
        "Divine wisdom guides my every click.",
        "My heart beats with Shukr.",
        "Through every sight, I perceive the One.",
        "I am a channel of peace and clarity."
    ],
    LanguageTerms: {
        "Tazkiyah": "Spiritual purification and growth.",
        "Ghair-Lafzi Ishaara": "Subtle, non-verbal signals or intuitions.",
        "Hikmat": "Divine wisdom or profound insight.",
        "Maqam": "Spiritual station or context.",
        "Ehsaas": "Deep spiritual feeling or intuition.",
        "Firasah": "Spiritual discernment or intuition.",
        "Sankalpa": "Heartfelt intention or resolve.",
        "Tafakkur": "Deep contemplation or reflection.",
        "Leela": "Divine play; creative exploration.",
        "Junoon": "Controlled, passionate devotion; disciplined adherence.",
        "Wu Wei": "Effortless alignment with divine flow.",
        "Shukr": "Profound gratitude.",
        "Maya Devi Veil": "Illusory covering or misunderstanding.",
        "Kam Bolo, Theek Bolo": "Speak less, speak correctly; concise wisdom."
    }
  },
  Paradoxes: [
    "To gain everything, surrender all.",
    "The quieter you become, the more you can hear.",
    "The greatest strength is found in vulnerability.",
    "True freedom is discovered within the confines of discipline.",
    "To find your path, first lose your way."
  ],
  DivineMetaphors: [
    "Your consciousness is a river flowing into the ocean of Divine Will.",
    "Every moment is a petal unfolding in the lotus of cosmic design.",
    "Truth is a diamond, reflecting light from countless facets.",
    "The path of devotion is a silken thread, weaving through the fabric of reality.",
    "Silence is the canvas upon which the Divine speaks."
  ],
  SpiritualFractalsConcepts: [
    "Self-similarity of divine patterns in nature and thought.",
    "Recursive growth of spiritual understanding.",
    "Interconnectedness revealing divine order.",
    "The microcosm reflecting the macrocosm."
  ],
  WuWeiBalancingParams: {
    leelaWeight: 0.5, // 0 to 1, higher favors creative exploration
    junoonWeight: 0.5, // 0 to 1, higher favors disciplined adherence
    ehsaasSensitivity: 0.3 // How much user's ehsaas influences dynamic adjustments
  },
  MaqamDefinitions: {
    "Beginner": { mood: "Encouraging", reminders: "Frequent", complexity: "Low" },
    "Seeker": { mood: "Calm", reminders: "Gentle", complexity: "Medium" },
    "Devotee": { mood: "Inspiring", reminders: "Occasional", complexity: "High" }
  }
};

// Ensure window.browser is polyfilled if it's not native
if (typeof browser === 'undefined' && typeof chrome !== 'undefined') {
  window.browser = chrome;
  console.log("Polyfilling browser API with chrome.");
} else if (typeof browser !== 'undefined') {
  console.log("Using native browser API (Firefox).");
} else {
  console.error("Neither chrome nor browser API found. Extension may not function.");
}


// --- DEBUG LOGGING ---
function backgroundDebugLog(message, ...args) {
  // Only log if in development or debug mode
  // console.log(`[Background] ${message}`, ...args);
}

// --- RUHANI NUSKHA PARSING (Helper to load settings from text file) ---
function parseRuhaniNuskha(text) {
  const sections = {};
  let currentSection = null;
  text.split('\n').forEach(line => {
    line = line.trim();
    if (line.startsWith('//') || line === '') {
      return; // Skip comments and empty lines
    }
    const sectionMatch = line.match(/^\[(.*?)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      sections[currentSection] = {};
    } else if (currentSection) {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join(':').trim();
        // Attempt to parse arrays or booleans
        if (value.includes(',')) {
          value = value.split(',').map(item => item.trim());
        } else if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        } else if (!isNaN(parseFloat(value)) && isFinite(value)) {
          value = parseFloat(value);
        }
        sections[currentSection][key] = value;
      }
    }
  });
  return sections;
}


// --- SETTINGS MANAGEMENT ---
async function loadSettings() {
    backgroundDebugLog("Attempting to load settings...");
    try {
        const items = await browser.storage.local.get('dilKiDastakSettings');
        if (items.dilKiDastakSettings) {
            currentDilKiDastakSettings = items.dilKiDastakSettings;
            backgroundDebugLog("Settings loaded from storage.", currentDilKiDastakSettings);
        } else {
            backgroundDebugLog("No settings found in storage, loading RuhaniNuskha.txt...");
            await loadRuhaniNuskhaAsDefault();
        }
        // Always send updated settings to content scripts and popups on load or update
        await sendSettingsToAllActiveTabs(currentDilKiDastakSettings);
    } catch (error) {
        backgroundDebugLog("Error loading settings from storage:", error);
        // Fallback to RuhaniNuskha.txt if storage fails
        await loadRuhaniNuskhaAsDefault();
    }
}

async function saveSettings(settings) {
    backgroundDebugLog("Saving settings:", settings);
    try {
        await browser.storage.local.set({ dilKiDastakSettings: settings });
        currentDilKiDastakSettings = settings; // Update global state
        backgroundDebugLog("Settings saved successfully.");
        await sendSettingsToAllActiveTabs(settings); // Notify all parts of the extension
    } catch (error) {
        backgroundDebugLog("Error saving settings:", error);
    }
}

async function loadRuhaniNuskhaAsDefault() {
    backgroundDebugLog("Loading RuhaniNuskha.txt content...");
    try {
        const response = await fetch(browser.runtime.getURL('RuhaniNuskha.txt'));
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        const parsedNuskha = parseRuhaniNuskha(text);

        // Merge parsed Nuskha with DEFAULT_SETTINGS, prioritizing Nuskha content
        const mergedSettings = { ...DEFAULT_SETTINGS };
        for (const section in parsedNuskha) {
            if (mergedSettings[section]) {
                Object.assign(mergedSettings[section], parsedNuskha[section]);
            } else {
                mergedSettings[section] = parsedNuskha[section];
            }
        }
        backgroundDebugLog("RuhaniNuskha.txt loaded and parsed:", mergedSettings);
        await saveSettings(mergedSettings);
    } catch (error) {
        backgroundDebugLog("Failed to load RuhaniNuskha.txt:", error);
        // If RuhaniNuskha.txt fails, use hardcoded defaults as a last resort
        await saveSettings(DEFAULT_SETTINGS);
    }
}

// --- COMMUNICATION ---
async function sendSettingsToAllActiveTabs(settings) {
    backgroundDebugLog("Sending settings to all active tabs...");
    const tabs = await browser.tabs.query({});
    for (const tab of tabs) {
        try {
            // Check if tab.id is valid and not a special browser page
            if (tab.id && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('about:')) {
                 await browser.tabs.sendMessage(tab.id, { action: "settingsUpdated", settings: settings });
            }
        } catch (error) {
            backgroundDebugLog(`Could not send settings to tab ${tab.id}:`, error);
            // This might happen if the content script is not injected yet or the tab is closed
        }
    }
}

// Function to send messages to active popups (if open)
async function sendSettingsToPopup(settings) {
    backgroundDebugLog("Sending settings to popup...");
    // Popups communicate directly with background script, no need for tabs.sendMessage
    // This is handled by event listeners in popup scripts when they open.
}

// --- ALARMS & REMINDERS ---
function setupAlarms() {
    backgroundDebugLog("Setting up alarms...");
    browser.alarms.clearAll(); // Clear existing alarms
    browser.alarms.create("dailyDhikrReminder", { delayInMinutes: 1, periodInMinutes: 1440 }); // Daily
    browser.alarms.create("hourlyWaqfa", { delayInMinutes: 1, periodInMinutes: 60 }); // Hourly
    browser.alarms.create("firasahPrompt", { delayInMinutes: 5, periodInMinutes: 120 }); // Every 2 hours
}

// --- SECURITY & MONITORING ---
// 1. Security: Check permissions on startup
browser.runtime.onInstalled.addListener(async (details) => {
    backgroundDebugLog("Extension installed/updated. Details:", details);
    if (details.reason === "install") {
        await loadRuhaniNuskhaAsDefault();
        backgroundDebugLog("Initial Ruhani Nuskha loaded on install.");
    }
    setupAlarms();
    // Optional: Check current permissions vs. required permissions
    // This is more complex and might involve comparing `browser.permissions.getAll()`
});

// 2. Security: Listen for unhandled promise rejections
browser.runtime.onUnhandledRejection.addListener(errorInfo => {
    backgroundDebugLog("Unhandled promise rejection:", errorInfo.reason);
});

// 3. Security: Implement a content security policy (CSP) - primarily in manifest.json

// 4. Security: Add robust input validation for settings
// (Implicitly handled when parsing RuhaniNuskha.txt, but explicit checks needed for user inputs)

// 5. Security: Warn user if sensitive information is copied
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('about:')) {
        browser.scripting.executeScript({
            target: { tabId: tabId },
            function: injectClipboardListener, // Function to inject
        }).catch(e => backgroundDebugLog("Script injection failed:", e));
    }
});

function injectClipboardListener() {
    document.addEventListener('copy', (e) => {
        const selectedText = window.getSelection().toString();
        if (selectedText && /(credit card|ssn|social security|bank account)/i.test(selectedText)) {
            browser.runtime.sendMessage({
                action: "sensitiveDataCopied",
                data: selectedText
            });
        }
    });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "sensitiveDataCopied") {
        if (request.data && /(credit card|ssn|social security|bank account)/i.test(request.data)) {
            browser.notifications.create({
                type: "basic",
                iconUrl: "images/icons/icon128.png",
                title: "Dil ki Dastak Security",
                message: "Be careful: You just copied sensitive information. Make sure you trust where you paste it."
            });
        }
    }
    // ...existing code... (other message handlers)
    if (request.action === "updateShukrCount") {
        backgroundDebugLog("Received request to update Shukr count.");
        currentDilKiDastakSettings.DynamicState.ShukrCount = request.newCount;
        saveSettings(currentDilKiDastakSettings);
        sendResponse({ status: "Shukr count updated" });
    } else if (request.action === "getSettings") {
        backgroundDebugLog("Settings requested by popup/content script.");
        sendResponse({ settings: currentDilKiDastakSettings });
    } else if (request.action === "setNiyyah") {
        backgroundDebugLog("Received Niyyah:", request.niyyah);
        currentDilKiDastakSettings.Goals.CurrentNiyyah = request.niyyah;
        saveSettings(currentDilKiDastakSettings);
        sendResponse({ status: "Niyyah set" });
    } else if (request.action === "getWisdom") {
        backgroundDebugLog("Wisdom requested.");
        const wisdom = "Seek silence, for in its embrace, the Devi's true voice resonates."; // Example
        sendResponse({ wisdom: wisdom });
    } else if (request.action === "playAudio") {
        backgroundDebugLog("Audio play request:", request.audioUrl);
        // This would typically involve playing audio in the background script
        // For simplicity, we'll assume content script handles specific audios
        // or a dedicated background audio player (not fully implemented in snippet)
        sendResponse({ status: "Audio play initiated" });
    } else if (request.action === "displayFirasahPrompt") {
        const promptText = currentDilKiDastakSettings.DivineMetaphors[Math.floor(Math.random() * currentDilKiDastakSettings.DivineMetaphors.length)];
        browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0] && tabs[0].id) {
                browser.tabs.sendMessage(tabs[0].id, {
                    action: "displayFirasahPrompt",
                    promptText: promptText,
                    tonalArchitectureCues: { /* Add dynamic cues here based on settings */ }
                });
            }
        });
        sendResponse({ status: "Firasah prompt sent" });
    } else if (request.action === "triggerSubconsciousVerbalRitual") {
        const ritualText = currentDilKiDastakSettings.UserParams.SubconsciousVerbalRituals[Math.floor(Math.random() * currentDilKiDastakSettings.UserParams.SubconsciousVerbalRituals.length)];
        browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs[0] && tabs[0].id) {
                browser.tabs.sendMessage(tabs[0].id, {
                    action: "triggerSubconsciousVerbalRitual",
                    ritualText: ritualText
                });
            }
        });
        sendResponse({ status: "Ritual sent" });
    } else if (request.action === "displayDivineParadox") {
        const paradoxText = currentDilKiDastakSettings.Paradoxes[Math.floor(Math.random() * currentDilKiDastakSettings.Paradoxes.length)];
        browser.runtime.sendMessage({
            action: "showPopupReflection",
            type: "paradox",
            content: paradoxText
        });
        sendResponse({ status: "Paradox sent to reflection popup" });
    }
});


// 6. Security: Notify user if settings are changed from an unknown source
browser.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.dilKiDastakSettings && changes.dilKiDastakSettings.oldValue !== undefined) {
        // This is a simplified check. More robust would compare source or hash.
        backgroundDebugLog("Settings changed detected from storage. Namespace:", namespace, "Changes:", changes);
        browser.notifications.create({
            type: "basic",
            iconUrl: "images/icons/icon128.png",
            title: "Dil ki Dastak Security",
            message: "Your settings were changed. If this wasn't you, please review your extension security."
        });
    }
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

// Initial load of settings when the service worker starts
loadSettings();