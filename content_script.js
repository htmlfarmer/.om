// content_script.js

// --- GLOBALS ---
if (typeof window.activeSettings === 'undefined') {
  window.activeSettings = null;
}
let dhikrWatermarkElement = null;
let muraqabaOverlayElement = null;
let firasahPromptElement = null;
let dhikrAudio = null;
const DHIKR_WATERMARK_ID = 'dilKiDastakDhikrWatermark_ID';
const MURAQABA_OVERLAY_ID = 'dilKiDastakMuraqabaOverlay_ID';
const FIRASAH_PROMPT_ID = 'dilKiDastakFirasahPrompt_ID';

// Ensure window.browser is polyfilled if it's not native
if (typeof browser === 'undefined' && typeof chrome !== 'undefined') {
  window.browser = chrome;
  console.log("Polyfilling browser API with chrome in content_script.");
} else if (typeof browser !== 'undefined') {
  console.log("Using native browser API (Firefox) in content_script.");
}


// --- LOGGING ---
function log(scriptName, message, ...args) {
  const now = new Date();
  const time = now.toLocaleTimeString();
  console.log(`[${scriptName}] [${time}] ${message}`, ...args);
}

// --- SETTINGS LISTENER ---
browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "settingsUpdated") {
    log('CS', "Settings update received:", request.settings);
    activeSettings = request.settings;
    applyAllSettings(activeSettings);
    sendResponse && sendResponse({status: "Settings received"});
  } else if (request.action === "playBackgroundAudio") {
    playSpecificAudio(request.audioUrl);
    sendResponse && sendResponse({status: "Audio play request received"});
  } else if (request.action === "maqamShifted") {
    log('CS', `Maqam shifted to: ${request.newMaqam}`);
    displayMaqamShift(request.newMaqam);
    adjustSettingsForMaqam(request.newMaqam);
    applyAllSettings(activeSettings);
    sendResponse && sendResponse({status: "Maqam shift acknowledged"});
  } else if (request.action === "displayFirasahPrompt") {
    log('CS', `Received Firasah prompt: ${request.promptText}`);
    displayFirasahPrompt(request.promptText, request.tonalArchitectureCues); // Pass cues
    sendResponse && sendResponse({status: "Firasah prompt displayed"});
  } else if (request.action === "triggerSubconsciousVerbalRitual") {
    log('CS', `Triggering ritual: ${request.ritualText}`);
    displaySubconsciousVerbalRitual(request.ritualText); // New function call
    sendResponse && sendResponse({ status: "Subconscious Verbal Ritual displayed" });
  }
});

// --- APPLY SETTINGS TO PAGE ---
function applyAllSettings(settings) {
  if (!settings) {
    log('CS', "No settings to apply.");
    return;
  }

  log('CS', "Applying settings:", settings);

  // Dhikr Watermark
  if (settings.EnableDhikr && settings.UserParams.DhikrList) {
    displayDhikrWatermark(settings.UserParams.DhikrList);
  } else {
    removeDhikrWatermark();
  }

  // Muraqaba Overlay
  if (settings.EnableMuraqaba && settings.UserParams.MuraqabaThemePreference) {
    displayMuraqabaOverlay(settings.UserParams.MuraqabaThemePreference, settings.UserParams.MuraqabaIntensityPreference);
  } else {
    removeMuraqabaOverlay();
  }

  // Adjust page visuals based on Ehsaas/Maqam
  if (settings.UserParams.MaqamAnalysisEnabled) {
      applyEhsaasVisuals(settings.DynamicState.OverallEhsaasIntensity, settings.DynamicState.CurrentDeviFocus);
  } else {
      removeEhsaasVisuals();
  }
}

// --- DHIKR WATERMARK FUNCTIONS ---
function displayDhikrWatermark(dhikrText) {
  if (!dhikrWatermarkElement) {
    dhikrWatermarkElement = document.createElement('div');
    dhikrWatermarkElement.id = DHIKR_WATERMARK_ID;
    document.body.appendChild(dhikrWatermarkElement);
  }
  dhikrWatermarkElement.textContent = dhikrText.split(',')[0].trim(); // Just use the first dhikr for simplicity
  dhikrWatermarkElement.style.display = 'block';
  log('CS', 'Dhikr Watermark displayed.');
}

function removeDhikrWatermark() {
  if (dhikrWatermarkElement) {
    dhikrWatermarkElement.remove();
    dhikrWatermarkElement = null;
    log('CS', 'Dhikr Watermark removed.');
  }
}

// --- MURAQABA OVERLAY FUNCTIONS ---
function displayMuraqabaOverlay(theme, intensity) {
  if (!muraqabaOverlayElement) {
    muraqabaOverlayElement = document.createElement('div');
    muraqabaOverlayElement.id = MURAQABA_OVERLAY_ID;
    document.body.appendChild(muraqabaOverlayElement);
  }
  muraqabaOverlayElement.style.display = 'block';
  muraqabaOverlayElement.style.opacity = intensity / 100; // Apply intensity
  // Apply theme-specific styles (e.g., background image, color)
  muraqabaOverlayElement.className = `muraqaba-overlay ${theme}`;
  document.body.classList.add('muraqaba-active'); // Add body class for overall effects
  log('CS', `Muraqaba Overlay displayed with theme: ${theme}, intensity: ${intensity}.`);
}

function removeMuraqabaOverlay() {
  if (muraqabaOverlayElement) {
    muraqabaOverlayElement.remove();
    muraqabaOverlayElement = null;
    document.body.classList.remove('muraqaba-active');
    log('CS', 'Muraqaba Overlay removed.');
  }
}

// --- FIRASAH PROMPT FUNCTIONS ---
function displayFirasahPrompt(promptText, tonalCues = {}) {
  if (!firasahPromptElement) {
    firasahPromptElement = document.createElement('div');
    firasahPromptElement.id = FIRASAH_PROMPT_ID;
    document.body.appendChild(firasahPromptElement);
  }
  firasahPromptElement.textContent = promptText;
  firasahPromptElement.style.display = 'block';

  // Apply tonal architecture cues
  if (tonalCues.pauseDelay) {
      firasahPromptElement.style.animationDelay = `${tonalCues.pauseDelay}s`;
  }
  if (tonalCues.emphasisClass) {
      firasahPromptElement.classList.add(tonalCues.emphasisClass);
  }
  // Reset after a delay
  setTimeout(() => {
    removeFirasahPrompt();
  }, 10000); // Display for 10 seconds
  log('CS', 'Firasah Prompt displayed.');
}

function removeFirasahPrompt() {
  if (firasahPromptElement) {
    firasahPromptElement.remove();
    firasahPromptElement = null;
    log('CS', 'Firasah Prompt removed.');
  }
}

// --- SUBCONSCIOUS VERBAL RITUALS ---
function displaySubconsciousVerbalRitual(ritualText) {
    let ritualElement = document.createElement('div');
    ritualElement.id = 'dilKiDastakVerbalRitual';
    ritualElement.textContent = ritualText;
    document.body.appendChild(ritualElement);

    // Basic styling for now
    ritualElement.style.position = 'fixed';
    ritualElement.style.bottom = '20px';
    ritualElement.style.left = '50%';
    ritualElement.style.transform = 'translateX(-50%)';
    ritualElement.style.background = 'rgba(255, 255, 255, 0.9)';
    ritualElement.style.padding = '10px 15px';
    ritualElement.style.borderRadius = '5px';
    ritualElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    ritualElement.style.zIndex = '9999';
    ritualElement.style.opacity = '0'; // Start invisible
    ritualElement.style.transition = 'opacity 1s ease-in-out';

    setTimeout(() => {
        ritualElement.style.opacity = '1'; // Fade in
    }, 100);

    setTimeout(() => {
        ritualElement.style.opacity = '0'; // Fade out
        ritualElement.addEventListener('transitionend', () => ritualElement.remove());
    }, 5000); // Display for 5 seconds
    log('CS', 'Subconscious Verbal Ritual displayed.');
}

// --- EHSAAS / MAQAM VISUALS ---
function applyEhsaasVisuals(ehsaasIntensity, deviFocus) {
    // This is a conceptual implementation. Real visuals would be more complex.
    document.body.style.filter = `blur(${ehsaasIntensity * 2}px) grayscale(${ehsaasIntensity * 0.5})`;
    document.body.style.transition = 'filter 1s ease-in-out';
    log('CS', `Applied Ehsaas visuals: Intensity ${ehsaasIntensity}, Devi Focus ${deviFocus}.`);
}

function removeEhsaasVisuals() {
    document.body.style.filter = 'none';
    log('CS', 'Removed Ehsaas visuals.');
}

// --- AUDIO PLAYBACK ---
function playSpecificAudio(audioUrl) {
  if (dhikrAudio) {
    dhikrAudio.pause();
    dhikrAudio.currentTime = 0;
  }
  dhikrAudio = new Audio(audioUrl);
  dhikrAudio.volume = 0.7; // Example volume
  dhikrAudio.play().catch(e => log('CS', 'Audio playback failed:', e));
  log('CS', `Playing audio: ${audioUrl}`);
}

// --- Initial setup on page load ---
// Request current settings from background script as soon as content script loads
browser.runtime.sendMessage({ action: "getSettings" }, function(response) {
    if (response && response.settings) {
        window.activeSettings = response.settings;
        applyAllSettings(window.activeSettings);
        log('CS', 'Initial settings received from background.');
    } else {
        log('CS', 'No initial settings received from background.');
    }
});

// Helper for displaying Maqam shift (visual cue on page)
function displayMaqamShift(newMaqam) {
    let maqamDiv = document.createElement('div');
    maqamDiv.id = 'maqamShiftNotification';
    maqamDiv.textContent = `Maqam Shift: ${newMaqam}`;
    Object.assign(maqamDiv.style, {
        position: 'fixed',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#fff',
        padding: '10px 20px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: '10000',
        opacity: '0',
        transition: 'opacity 0.5s ease-in-out',
        color: '#333'
    });
    document.body.appendChild(maqamDiv);
    setTimeout(() => maqamDiv.style.opacity = '1', 100);
    setTimeout(() => {
        maqamDiv.style.opacity = '0';
        maqamDiv.addEventListener('transitionend', () => maqamDiv.remove());
    }, 5000);
}

// Helper to adjust settings based on Maqam (e.g., change frequencies)
function adjustSettingsForMaqam(newMaqam) {
    log('CS', `Adjusting settings for Maqam: ${newMaqam}`);
    // Example: This would be more complex and driven by RuhaniNuskha.txt
    if (newMaqam === "Beginner") {
        if (window.activeSettings) {
            window.activeSettings.DynamicState.ReminderFrequency = "Frequent";
        }
    } else if (newMaqam === "Devotee") {
        if (window.activeSettings) {
            window.activeSettings.DynamicState.ReminderFrequency = "Occasional";
        }
    }
    // Note: To persist these, you'd need to send them back to the background script to save.
}