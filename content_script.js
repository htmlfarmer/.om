// content_script.js

// --- GLOBALS ---
// Remove duplicate declarations of activeSettings and other globals
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

// --- LOGGING ---
function log(scriptName, message, ...args) {
  const now = new Date();
  const time = now.toLocaleTimeString();
  console.log(`[${scriptName}] [${time}] ${message}`, ...args);
}

// --- SETTINGS LISTENER ---
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "settingsUpdated") {
    log('CS', "Settings update received:", request.settings);
    activeSettings = request.settings;
    [cite_start]applyAllSettings(activeSettings); [cite: 2]
    sendResponse && sendResponse({status: "Settings received"});
  } else if (request.action === "playBackgroundAudio") {
    playSpecificAudio(request.audioUrl);
    sendResponse && sendResponse({status: "Audio play request received"});
  } else if (request.action === "maqamShifted") {
    log('CS', `Maqam shifted to: ${request.maqam}`);
    [cite_start]// Potentially trigger visual/auditory cues based on Maqam shift [cite: 2]
    [cite_start]updateSensoryCuesForMaqam(request.maqam, activeSettings); [cite: 2]
    sendResponse && sendResponse({status: "Maqam shift noted"});
  [cite_start]} else if (request.action === "displayFirasahPrompt") { // New message handler [cite: 2]
    [cite_start]displayFirasahPrompt(request.message, request.duration); [cite: 2]
    sendResponse && sendResponse({status: "Firasah prompt displayed"});
  }
  return true;
});

[cite_start]// Function to apply all settings (called on load and on update) [cite: 2]
function applyAllSettings(settings) {
    [cite_start]applyMuraqabaSettings(settings); [cite: 2]
    [cite_start]applyDhikrSettings(settings); [cite: 2]
    [cite_start]// NEW: Apply Ehsaas-driven visual adjustments [cite: 2]
    [cite_start]applyEhsaasVisuals(settings); [cite: 2]
    [cite_start]// NEW: Configure Firasah prompt context [cite: 2]
    [cite_start]configureFirasahPromptContext(settings); [cite: 2]
    // Call other apply...Settings functions here
}

[cite_start]// NEW FUNCTION: Apply Ehsaas-driven visual adjustments [cite: 2]
function applyEhsaasVisuals(settings) {
    const overallEhsaasIntensity = settings?.dynamicState?.OverallEhsaasIntensity ?? 0.5; [cite_start]// Default to 0.5 [cite: 2]
    const currentDeviFocus = settings?.dynamicState?.CurrentDeviFocus ?? 'Maa Saraswati'; [cite_start]// Default [cite: 2]

    const body = document.body;

    [cite_start]// Adjust global opacity/filter based on Ehsaas Intensity [cite: 2]
    body.style.opacity = 0.8 + (overallEhsaasIntensity * 0.2); [cite_start]// Range from 0.8 to 1.0 [cite: 2]
    [cite_start]// Example: Apply a subtle filter based on Ehsaas and Devi focus [cite: 2]
    if (currentDeviFocus === 'Maa Saraswati') {
        [cite_start]body.style.filter = `contrast(${1 + (overallEhsaasIntensity * 0.1)}) brightness(${1 + (overallEhsaasIntensity * 0.05)})`; [cite: 2]
    } else if (currentDeviFocus === 'Lakshmi/Venus') {
        [cite_start]body.style.filter = `saturate(${1 + (overallEhsaasIntensity * 0.15)})`; [cite: 2]
    } else {
        [cite_start]body.style.filter = 'none'; [cite: 2]
    }

    [cite_start]log('CS', `Applied Ehsaas visuals: Intensity=${overallEhsaasIntensity}, Devi=${currentDeviFocus}`); [cite: 2]
}

[cite_start]// NEW FUNCTION: Configure Firasah Prompt Context [cite: 2]
function configureFirasahPromptContext(settings) {
  const firasahPromptFrequency = settings?.userParams?.FirasahPromptFrequency ?? 'occasional'; [cite_start]// Default [cite: 2]
  const currentDeviFocus = settings?.dynamicState?.CurrentDeviFocus ?? 'Maa Saraswati'; [cite_start]// Default [cite: 2]

  [cite_start]if (firasahPromptFrequency !== 'never') { // Only if prompts are enabled [cite: 2]
    // Example: Show a Firasah prompt when certain keywords are detected,
    // tailored to the current Devi focus. This would require content analysis,
    // which might be done more effectively in the background script or a dedicated module.
    // For now, a conceptual link:
    [cite_start]log('CS', `Firasah prompts are ${firasahPromptFrequency}. Current Devi focus: ${currentDeviFocus}.`); [cite: 2]
    // If you were to implement content analysis here, you'd add listeners for DOM changes
    [cite_start]// or run checks on page load. [cite: 2]
  }
}

[cite_start]// Example for getWisdomBtn: (already in original code, showing how it could be linked) [cite: 2]
function ensureGetWisdomBtn() {
  let getWisdomBtn = document.getElementById('getWisdomBtn');
  if (!getWisdomBtn) {
    getWisdomBtn = document.createElement('button');
    getWisdomBtn.id = 'getWisdomBtn';
    getWisdomBtn.textContent = 'Get Wisdom';
    getWisdomBtn.style.position = 'fixed';
    getWisdomBtn.style.bottom = '80px';
    getWisdomBtn.style.right = '30px';
    getWisdomBtn.style.zIndex = '999999';
    document.body.appendChild(getWisdomBtn);

    getWisdomBtn.addEventListener('click', () => {
      [cite_start]// Send a message to background.js to request wisdom based on CurrentDeviFocus [cite: 2]
      [cite_start]chrome.runtime.sendMessage({ action: "requestDeviWisdom", devi: activeSettings?.dynamicState?.CurrentDeviFocus }, (response) => { [cite: 2]
        [cite_start]if (response && response.wisdom) { [cite: 2]
          [cite_start]alert(`Divine Wisdom from ${activeSettings.dynamicState.CurrentDeviFocus}:\\n\\n\"${response.wisdom}\"`); [cite: 2]
        [cite_start]} else { [cite: 2]
          [cite_start]alert("Could not retrieve wisdom at this time."); [cite: 2]
        }
      });
    });
  }
}

// Call this when the content script loads
chrome.runtime.sendMessage({ action: "requestInitialSettings" }, function(response) {
  if (chrome.runtime.lastError) {
    console.warn("Could not request initial settings:", chrome.runtime.lastError.message);
  } else if (response && response.settings) {
    console.log("Content script received initial settings:", response.settings);
    activeSettings = response.settings;
    applyAllSettings(activeSettings);
  } else {
     console.warn("No initial settings received or unexpected response.");
  }
});

// --- GLOBALS ---
// Remove duplicate declarations of activeSettings and other globals
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

// --- LOGGING ---
function log(scriptName, message, ...args) {
  const now = new Date();
  const time = now.toLocaleTimeString();
  console.log(`[${scriptName}] [${time}] ${message}`, ...args);
}

// --- SETTINGS LISTENER ---
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
    displayFirasahPrompt(request.promptText);
    sendResponse && sendResponse({status: "Firasah prompt displayed"});
  } else if (request.action === "triggerSubconsciousVerbalRitual") {
    log('CS', `Triggering ritual: ${request.ritualText}`);
    displaySubconsciousVerbalRitual(request.ritualText);
    sendResponse && sendResponse({status: "Ritual displayed"});
  }
  return true;
});

// --- INITIAL SETTINGS REQUEST ---
chrome.runtime.sendMessage({ action: "requestInitialSettings" }, function(response) {
  if (chrome.runtime.lastError) {
    console.warn("Could not request initial settings:", chrome.runtime.lastError.message);
    return;
  }
  if (response && response.settings) {
    log('CS', "Initial settings received:", response.settings);
    activeSettings = response.settings;
    applyAllSettings(activeSettings);
  } else {
    console.warn("No initial settings received or unexpected response.");
  }
});

// --- APPLY ALL SETTINGS ---
function applyAllSettings(settings) {
  applyMuraqabaSettings(settings);
  applyDhikrSettings(settings);
  applyDhikrStreamSound(settings);
  applyMuraqabaMushtarakCue(settings);
  // ...add more feature hooks here...
}

// --- MURAQABA OVERLAY ---
function applyMuraqabaSettings(settings) {
  const isEnabled = settings?.featureToggles?.EnableMuraqaba === true;
  if (muraqabaOverlayElement) {
    muraqabaOverlayElement.remove();
    muraqabaOverlayElement = null;
  }
  if (isEnabled) {
    muraqabaOverlayElement = document.createElement('div');
    muraqabaOverlayElement.id = MURAQABA_OVERLAY_ID;
    muraqabaOverlayElement.style.position = 'fixed';
    muraqabaOverlayElement.style.top = '0';
    muraqabaOverlayElement.style.left = '0';
    muraqabaOverlayElement.style.width = '100vw';
    muraqabaOverlayElement.style.height = '100vh';
    muraqabaOverlayElement.style.pointerEvents = 'none';
    muraqabaOverlayElement.style.zIndex = '999999';
    muraqabaOverlayElement.style.background = 'rgba(173,216,230,0.08)';
    document.body.appendChild(muraqabaOverlayElement);
  } else {
    document.body.style.filter = 'none';
  }
}

// --- DHIKR WATERMARK ---
// Fix: settings.UserParams should be settings.userParams (case-sensitive)
function applyDhikrSettings(settings) {
  const isEnabled = settings?.featureToggles?.EnableDhikr === true;
  dhikrWatermarkElement = document.getElementById(DHIKR_WATERMARK_ID);
  if (isEnabled) {
    const dhikrText = settings?.userParams?.DhikrList?.split(',')[0].trim() || "Default Dhikr";
    if (!dhikrWatermarkElement) {
      dhikrWatermarkElement = document.createElement('div');
      dhikrWatermarkElement.id = DHIKR_WATERMARK_ID;
      dhikrWatermarkElement.style.position = 'fixed';
      dhikrWatermarkElement.style.bottom = '10px';
      dhikrWatermarkElement.style.right = '10px';
      dhikrWatermarkElement.style.pointerEvents = 'none';
      dhikrWatermarkElement.style.zIndex = '9999999';
      dhikrWatermarkElement.style.fontFamily = 'serif';
      dhikrWatermarkElement.style.padding = '5px 10px';
      dhikrWatermarkElement.style.borderRadius = '5px';
      document.body.appendChild(dhikrWatermarkElement);
    }
    dhikrWatermarkElement.textContent = dhikrText;
    dhikrWatermarkElement.style.fontSize = '20px';
    dhikrWatermarkElement.style.color = 'rgba(0,0,0,0.5)';
    dhikrWatermarkElement.style.backgroundColor = 'rgba(255,255,255,0.2)';
    dhikrWatermarkElement.style.display = 'block';
  } else if (dhikrWatermarkElement) {
    dhikrWatermarkElement.style.display = 'none';
  }
}

// --- DHIKR STREAM SOUND ---
// Fix: settings.UserParams should be settings.userParams (case-sensitive)
function applyDhikrStreamSound(settings) {
  const enableDhikrSound = settings?.featureToggles?.EnableDhikrStreamSound === true;
  const dhikrAudioFile = settings?.userParams?.DhikrAudioFile || "sounds/dhikr_om.mp3";
  if (enableDhikrSound) {
    if (!dhikrAudio) {
      dhikrAudio = new Audio(chrome.runtime.getURL(dhikrAudioFile));
      dhikrAudio.loop = true;
      dhikrAudio.volume = 0.05;
    }
    dhikrAudio.play().catch(e => log('CS', 'Error playing Dhikr audio:', e.message));
  } else if (dhikrAudio) {
    dhikrAudio.pause();
    dhikrAudio.currentTime = 0;
  }
}

// --- MURAQABA MUSHTARAK CUE ---
function applyMuraqabaMushtarakCue(settings) {
  const isActive = settings?.featureToggles?.EnableMuraqabaMushtarak && settings?.dynamicState?.CurrentMuraqabaMushtarakSession === 'active';
  let collectiveAura = document.getElementById('dilKiDastakCollectiveAura');
  if (isActive) {
    if (!collectiveAura) {
      collectiveAura = document.createElement('div');
      collectiveAura.id = 'dilKiDastakCollectiveAura';
      collectiveAura.style.position = 'fixed';
      collectiveAura.style.top = '0';
      collectiveAura.style.left = '0';
      collectiveAura.style.right = '0';
      collectiveAura.style.bottom = '0';
      collectiveAura.style.backgroundColor = 'rgba(138,43,226,0.05)';
      collectiveAura.style.pointerEvents = 'none';
      collectiveAura.style.zIndex = '9999';
      document.body.appendChild(collectiveAura);
    }
  } else if (collectiveAura) {
    collectiveAura.remove();
  }
}

// --- PLAY SPECIFIC AUDIO ---
function playSpecificAudio(audioUrl) {
  const audio = new Audio(audioUrl);
  audio.volume = 0.1;
  audio.play().catch(e => log('CS', 'Error playing specific audio:', e.message));
}

// --- MAQAM SHIFT DISPLAY ---
function displayMaqamShift(newMaqam) {
  let maqamMessageElement = document.getElementById('dilKiDastakMaqamMessage');
  if (!maqamMessageElement) {
    maqamMessageElement = document.createElement('div');
    maqamMessageElement.id = 'dilKiDastakMaqamMessage';
    maqamMessageElement.style.position = 'fixed';
    maqamMessageElement.style.top = '20px';
    maqamMessageElement.style.left = '50%';
    maqamMessageElement.style.transform = 'translateX(-50%)';
    maqamMessageElement.style.backgroundColor = 'rgba(100,149,237,0.9)';
    maqamMessageElement.style.color = 'white';
    maqamMessageElement.style.padding = '8px 15px';
    maqamMessageElement.style.borderRadius = '5px';
    maqamMessageElement.style.zIndex = '99999999';
    maqamMessageElement.style.opacity = '0';
    maqamMessageElement.style.transition = 'opacity 0.5s ease-in-out';
    document.body.appendChild(maqamMessageElement);
  }
  maqamMessageElement.textContent = `Maqam: ${newMaqam}`;
  maqamMessageElement.style.opacity = '1';
  setTimeout(() => { maqamMessageElement.style.opacity = '0'; }, 3000);
}

// --- ADJUST SETTINGS FOR MAQAM ---
function adjustSettingsForMaqam(maqamType) {
  if (!activeSettings.DynamicState) activeSettings.DynamicState = {};
  switch(maqamType) {
    case "worldly_knowledge":
      activeSettings.DynamicState.CurrentDeviFocus = "Maa Saraswati";
      activeSettings.DynamicState.OverallEhsaasIntensity = 0.6;
      break;
    case "social_connection":
      activeSettings.DynamicState.CurrentDeviFocus = "Maa Lakshmi";
      activeSettings.DynamicState.OverallEhsaasIntensity = 0.5;
      break;
    case "contemplation":
      activeSettings.DynamicState.CurrentDeviFocus = "Maa Kali";
      activeSettings.DynamicState.OverallEhsaasIntensity = 0.8;
      break;
    case "recreation":
      activeSettings.DynamicState.CurrentDeviFocus = "Maa Lakshmi";
      activeSettings.DynamicState.OverallEhsaasIntensity = 0.4;
      break;
    case "creative_expression":
      activeSettings.DynamicState.CurrentDeviFocus = "Maa Saraswati";
      activeSettings.DynamicState.OverallEhsaasIntensity = 0.7;
      break;
    default:
      activeSettings.DynamicState.CurrentDeviFocus = "Universal Devi";
      activeSettings.DynamicState.OverallEhsaasIntensity = 0.5;
      break;
  }
  chrome.runtime.sendMessage({
    action: "updateDynamicState",
    dynamicState: activeSettings.DynamicState
  });
}

// --- FIRASAH PROMPT DISPLAY ---
function displayFirasahPrompt(promptText) {
  if (!activeSettings?.featureToggles?.EnableFirasahPrompts) return;
  if (firasahPromptElement) firasahPromptElement.remove();
  firasahPromptElement = document.createElement('div');
  firasahPromptElement.id = FIRASAH_PROMPT_ID;
  firasahPromptElement.style.position = 'fixed';
  firasahPromptElement.style.bottom = '20px';
  firasahPromptElement.style.left = '50%';
  firasahPromptElement.style.transform = 'translateX(-50%)';
  firasahPromptElement.style.backgroundColor = 'rgba(75,0,130,0.9)';
  firasahPromptElement.style.color = 'white';
  firasahPromptElement.style.padding = '12px 20px';
  firasahPromptElement.style.borderRadius = '8px';
  firasahPromptElement.style.zIndex = '999999999';
  firasahPromptElement.style.opacity = '0';
  firasahPromptElement.style.transition = 'opacity 0.5s ease-in-out';
  firasahPromptElement.style.maxWidth = '80%';
  firasahPromptElement.style.textAlign = 'center';
  firasahPromptElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
  firasahPromptElement.style.fontStyle = 'italic';
  firasahPromptElement.innerHTML = `🌟 <b>A Whisper of Firasah:</b><br>${promptText}`;
  document.body.appendChild(firasahPromptElement);
  setTimeout(() => { firasahPromptElement.style.opacity = '1'; }, 100);
  setTimeout(() => {
    firasahPromptElement.style.opacity = '0';
    setTimeout(() => { if (firasahPromptElement) firasahPromptElement.remove(); firasahPromptElement = null; }, 600);
  }, 8000);
}

// --- SUBCONSCIOUS VERBAL RITUAL DISPLAY ---
function displaySubconsciousVerbalRitual(ritualText) {
  if (!activeSettings?.featureToggles?.EnableSubconsciousVerbalRituals) return;
  let ritualElement = document.getElementById('dilKiDastakVerbalRitual');
  if (!ritualElement) {
    ritualElement = document.createElement('div');
    ritualElement.id = 'dilKiDastakVerbalRitual';
    ritualElement.style.position = 'fixed';
    ritualElement.style.top = '50%';
    ritualElement.style.left = '50%';
    ritualElement.style.transform = 'translate(-50%, -50%)';
    ritualElement.style.backgroundColor = 'rgba(0,128,0,0.8)';
    ritualElement.style.color = 'white';
    ritualElement.style.padding = '15px 25px';
    ritualElement.style.borderRadius = '10px';
    ritualElement.style.zIndex = '9999999999';
    ritualElement.style.opacity = '0';
    ritualElement.style.transition = 'opacity 0.7s, transform 0.7s';
    ritualElement.style.fontWeight = 'bold';
    ritualElement.style.fontSize = '1.5em';
    ritualElement.style.textAlign = 'center';
    ritualElement.style.boxShadow = '0 5px 20px rgba(0,0,0,0.4)';
    document.body.appendChild(ritualElement);
  }
  ritualElement.textContent = ritualText;
  ritualElement.style.opacity = '1';
  ritualElement.style.transform = 'translate(-50%, -50%) scale(1.1)';
  setTimeout(() => {
    ritualElement.style.opacity = '0';
    ritualElement.style.transform = 'translate(-50%, -50%) scale(0.9)';
    setTimeout(() => { if (ritualElement) ritualElement.remove(); }, 800);
  }, 4000);
}

// --- CHUPA HUA RATAN (Hidden Gem) ---
const CHUPA_HUA_RATAN_ID = 'dilKiDastakChupaHuaRatan';
function createAndPlaceChupaHuaRatan() {
  let existingRatan = document.getElementById(CHUPA_HUA_RATAN_ID);
  if (existingRatan) existingRatan.remove();
  const ratan = document.createElement('div');
  ratan.id = CHUPA_HUA_RATAN_ID;
  ratan.textContent = '💎';
  ratan.title = 'A Chupa Hua Ratan awaits your discovery!';
  ratan.style.position = 'fixed';
  ratan.style.zIndex = '999999';
  ratan.style.cursor = 'pointer';
  ratan.style.fontSize = '20px';
  ratan.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  ratan.style.top = `${Math.random() * (window.innerHeight - 50)}px`;
  ratan.style.opacity = '0.05';
  ratan.style.transition = 'opacity 0.3s';
  ratan.onmouseover = () => { ratan.style.opacity = '0.5'; };
  ratan.onmouseout = () => { ratan.style.opacity = '0.05'; };
  ratan.addEventListener('click', () => {
    log('CS', 'Chupa Hua Ratan discovered!');
    ratan.textContent = '✨';
    ratan.style.opacity = '1';
    ratan.style.backgroundColor = 'rgba(255,255,0,0.5)';
    ratan.style.borderRadius = '50%';
    ratan.style.padding = '5px';
    chrome.runtime.sendMessage({ action: "chupaHuaRatanDiscovered" });
    setTimeout(() => { ratan.remove(); }, 2000);
  });
  document.body.appendChild(ratan);
  log('CS', 'Chupa Hua Ratan placed on page.');
}
document.addEventListener('DOMContentLoaded', createAndPlaceChupaHuaRatan);

// --- OPTIONAL: Add more features here as needed ---

// --- GLOBAL STYLE FOR FADE EFFECTS ---
const globalMsgStyle = document.createElement('style');
globalMsgStyle.textContent = `
    @keyframes fadeEffect {
        from {opacity: 0;}
        to {opacity: 1;}
    }
    .fade-in-out {
        animation: fadeEffect 0.5s forwards;
    }
`;
document.head.appendChild(globalMsgStyle);

// --- SHUKR DISPLAY ELEMENT SAFETY ---
// Fix: Only create shukrDisplayElement if it doesn't exist, and avoid duplicate elements
function updateShukrDisplay(count) {
  let shukrDisplayElement = document.getElementById('shukrDisplayElement');
  if (!shukrDisplayElement) {
    shukrDisplayElement = document.createElement('div');
    shukrDisplayElement.id = 'shukrDisplayElement';
    shukrDisplayElement.style.position = 'fixed';
    shukrDisplayElement.style.bottom = '30px';
    shukrDisplayElement.style.right = '30px';
    shukrDisplayElement.style.background = 'rgba(255,255,255,0.8)';
    shukrDisplayElement.style.padding = '8px 16px';
    shukrDisplayElement.style.borderRadius = '8px';
    shukrDisplayElement.style.zIndex = '999999';
    document.body.appendChild(shukrDisplayElement);
  }
  shukrDisplayElement.textContent = `Shukr Count: ${count}`;
}

// Example for getWisdomBtn:
function ensureGetWisdomBtn() {
  let getWisdomBtn = document.getElementById('getWisdomBtn');
  if (!getWisdomBtn) {
    getWisdomBtn = document.createElement('button');
    getWisdomBtn.id = 'getWisdomBtn';
    getWisdomBtn.textContent = 'Get Wisdom';
    getWisdomBtn.style.position = 'fixed';
    getWisdomBtn.style.bottom = '80px';
    getWisdomBtn.style.right = '30px';
    getWisdomBtn.style.zIndex = '999999';
    document.body.appendChild(getWisdomBtn);
  }
  return getWisdomBtn;
}

// When using these elements elsewhere, always call the ensure function first
// Example usage:
// let getWisdomBtn = ensureGetWisdomBtn();
// getWisdomBtn.onclick = function() { ... };

// --- ADVANCED: Add a spiritual "insight clustering" algorithm for Firasah prompts ---
// This clusters similar prompts to avoid repetition and enhance diversity of spiritual guidance.

function clusterPrompts(prompts, numClusters = 5) {
  // Use a simple k-means-like clustering based on string similarity (Levenshtein distance)
  // For brevity, use a fast Jaccard similarity on word sets
  function jaccard(a, b) {
    const setA = new Set(a.toLowerCase().split(/\W+/));
    const setB = new Set(b.toLowerCase().split(/\W+/));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
  }

  // Randomly initialize cluster centers
  let centers = [];
  for (let i = 0; i < numClusters; i++) {
    centers.push(prompts[Math.floor(Math.random() * prompts.length)]);
  }

  let assignments = new Array(prompts.length).fill(0);
  let changed = true;
  let iter = 0;
  while (changed && iter < 10) {
    changed = false;
    // Assign each prompt to the closest center
    for (let i = 0; i < prompts.length; i++) {
      let best = 0, bestScore = -1;
      for (let j = 0; j < centers.length; j++) {
        const score = jaccard(prompts[i], centers[j]);
        if (score > bestScore) {
          bestScore = score;
          best = j;
        }
      }
      if (assignments[i] !== best) {
        assignments[i] = best;
        changed = true;
      }
    }
    // Update centers
    for (let j = 0; j < centers.length; j++) {
      const cluster = prompts.filter((_, idx) => assignments[idx] === j);
      if (cluster.length > 0) {
        centers[j] = cluster.reduce((a, b) => a.length < b.length ? a : b); // New center is the "medoid"
      }
    }
    iter++;
  }

  return assignments;
}

// --- SPIRITUAL ASTROPHYSICS & COSMIC HISTORY FEATURES ---

function addSpiritualAstrophysicsFeatures() {
  if (document.getElementById('astroPhysicsBtn')) return;

  // 1. Cosmic Sufi Star Map (shows a random ancient constellation and its spiritual meaning)
  const starMapBtn = document.createElement('button');
  starMapBtn.id = 'astroPhysicsBtn';
  starMapBtn.className = 'reflection-btn';
  starMapBtn.innerHTML = `🌌 Cosmic Star Map`;
  starMapBtn.style.position = 'fixed';
  starMapBtn.style.bottom = '140px';
  starMapBtn.style.right = '30px';
  starMapBtn.style.zIndex = '999999';
  starMapBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  starMapBtn.onclick = function() {
    const constellations = [
      { name: "Orion", meaning: "The Hunter – Symbol of cosmic struggle and spiritual quest." },
      { name: "Pleiades (Seven Sisters)", meaning: "Unity, spiritual family, and guidance in darkness." },
      { name: "Ursa Major", meaning: "The Great Bear – Guidance, the Pole Star, and steadfastness." },
      { name: "Sirius", meaning: "The Dog Star – Ancient Egypt: the soul's journey and rebirth." },
      { name: "Aquila", meaning: "The Eagle – Divine messenger, ascension, and vision." },
      { name: "Cassiopeia", meaning: "The Queen – Humility and the dangers of pride." },
      { name: "Scorpius", meaning: "The Scorpion – Transformation, death, and rebirth." },
      { name: "Sagittarius", meaning: "The Archer – Focus, spiritual aim, and the journey to truth." },
      { name: "Andromeda", meaning: "The Chained Woman – Liberation from ego and cosmic rescue." },
      { name: "Lyra", meaning: "The Lyre – Harmony, music of the spheres, and divine resonance." }
    ];
    const c = constellations[Math.floor(Math.random() * constellations.length)];
    alert(`✨ ${c.name}\n${c.meaning}`);
  };

  // 2. Ancient Cosmic Calendar (shows a random date from a spiritual calendar)
  const calendarBtn = document.createElement('button');
  calendarBtn.id = 'astroCalendarBtn';
  calendarBtn.className = 'reflection-btn';
  calendarBtn.innerHTML = `🪐 Ancient Cosmic Calendar`;
  calendarBtn.style.position = 'fixed';
  calendarBtn.style.bottom = '100px';
  calendarBtn.style.right = '30px';
  calendarBtn.style.zIndex = '999999';
  calendarBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  calendarBtn.onclick = function() {
    const calendars = [
      "Mayan Long Count: 13.0.0.0.0 (Dec 21, 2012) – Cycle of renewal.",
      "Egyptian Sothic Cycle: Sirius rising – New Year, rebirth.",
      "Babylonian New Year: Akitu Festival – Cosmic order restored.",
      "Islamic Mi'raj: Prophet's Night Journey – Ascension through the heavens.",
      "Hindu Yugas: Satya Yuga – Age of Truth and cosmic harmony.",
      "Chinese Lunar New Year: Spring Festival – Renewal and cosmic balance.",
      "Zoroastrian Nowruz: Vernal Equinox – Light over darkness.",
      "Jewish Rosh Hashanah: Head of the Year – Cosmic judgment and renewal."
    ];
    alert("🌠 " + calendars[Math.floor(Math.random() * calendars.length)]);
  };

  // 3. Sufi Cosmic Breath (visualizes the breath as a journey through the cosmos)
  const breathBtn = document.createElement('button');
  breathBtn.id = 'cosmicBreathBtn';
  breathBtn.className = 'reflection-btn';
  breathBtn.innerHTML = `💫 Sufi Cosmic Breath`;
  breathBtn.style.position = 'fixed';
  breathBtn.style.bottom = '60px';
  breathBtn.style.right = '30px';
  breathBtn.style.zIndex = '999999';
  breathBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  breathBtn.onclick = function() {
    alert("Inhale: Imagine drawing in starlight from the edge of the universe.\nHold: Let the cosmic energy fill your heart.\nExhale: Release your breath as a blessing to all beings.");
  };

  // 4. Ancient Astrological Wisdom (random wisdom from ancient astrologers)
  const astroWisdomBtn = document.createElement('button');
  astroWisdomBtn.id = 'astroWisdomBtn';
  astroWisdomBtn.className = 'reflection-btn';
  astroWisdomBtn.innerHTML = `🌠 Ancient Astro Wisdom`;
  astroWisdomBtn.style.position = 'fixed';
  astroWisdomBtn.style.bottom = '180px';
  astroWisdomBtn.style.right = '30px';
  astroWisdomBtn.style.zIndex = '999999';
  astroWisdomBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  astroWisdomBtn.onclick = function() {
    const wisdoms = [
      "As above, so below. – Hermetic maxim",
      "The stars incline, they do not compel. – Ptolemy",
      "Every soul is born under a star. – Sufi tradition",
      "The moon is a faithful witness to the tides of the heart.",
      "The Milky Way is the path of souls returning home.",
      "The cosmos is within us; we are made of star-stuff. – Carl Sagan",
      "When you look at the stars, you are looking at your ancestors.",
      "The dance of the planets is the music of destiny."
    ];
    alert("🪐 " + wisdoms[Math.floor(Math.random() * wisdoms.length)]);
  };

  // 5. Cosmic Mantra Generator (ancient mantras for cosmic harmony)
  const mantraBtn = document.createElement('button');
  mantraBtn.id = 'cosmicMantraBtn';
  mantraBtn.className = 'reflection-btn';
  mantraBtn.innerHTML = `🔭 Cosmic Mantra`;
  mantraBtn.style.position = 'fixed';
  mantraBtn.style.bottom = '220px';
  mantraBtn.style.right = '30px';
  mantraBtn.style.zIndex = '999999';
  mantraBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  mantraBtn.onclick = function() {
    const mantras = [
      "Om Mani Padme Hum – Jewel in the Lotus.",
      "La ilaha illallah – There is no god but God.",
      "Om Tat Sat – That is the Truth.",
      "SubhanAllahi wa bihamdihi – Glory and praise to God.",
      "Sh'ma Yisrael – Hear, O Israel.",
      "Gayatri Mantra – May we attain that excellent glory of the Sun.",
      "Allahu Akbar – God is the Greatest.",
      "Om Shanti Shanti Shanti – Peace, peace, peace."
    ];
    alert("✨ Cosmic Mantra:\n" + mantras[Math.floor(Math.random() * mantras.length)]);
  };

  // 6. Ancient Astral Navigation (shows a navigation tip from ancient mariners)
  const navBtn = document.createElement('button');
  navBtn.id = 'astroNavBtn';
  navBtn.className = 'reflection-btn';
  navBtn.innerHTML = `🧭 Astral Navigation`;
  navBtn.style.position = 'fixed';
  navBtn.style.bottom = '260px';
  navBtn.style.right = '30px';
  navBtn.style.zIndex = '999999';
  navBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  navBtn.onclick = function() {
    const navs = [
      "Find the North Star (Polaris) to guide your way at night.",
      "The Southern Cross points to the South Celestial Pole.",
      "The rising of Sirius marked the Nile flood in Egypt.",
      "The Pleiades signal planting and harvest times in many cultures.",
      "The moon's phases guide the timing of rituals and journeys.",
      "The Milky Way was the 'Path of Souls' for many ancient peoples."
    ];
    alert("🌌 Ancient Navigation Tip:\n" + navs[Math.floor(Math.random() * navs.length)]);
  };

  // 7. Cosmic Reflection Prompt (deep question about your place in the universe)
  const cosmicPromptBtn = document.createElement('button');
  cosmicPromptBtn.id = 'cosmicPromptBtn';
  cosmicPromptBtn.className = 'reflection-btn';
  cosmicPromptBtn.innerHTML = `🌙 Cosmic Reflection`;
  cosmicPromptBtn.style.position = 'fixed';
  cosmicPromptBtn.style.bottom = '300px';
  cosmicPromptBtn.style.right = '30px';
  cosmicPromptBtn.style.zIndex = '999999';
  cosmicPromptBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  cosmicPromptBtn.onclick = function() {
    const prompts = [
      "If your soul were a star, which would it be and why?",
      "What ancient constellation do you feel most connected to?",
      "How does the movement of the moon affect your inner tides?",
      "What does the night sky teach you about patience and time?",
      "If you could send a message to the cosmos, what would it be?",
      "How do you find your way when you feel lost in the universe?",
      "What is your personal North Star?"
    ];
    alert("🌠 Cosmic Reflection:\n" + prompts[Math.floor(Math.random() * prompts.length)]);
  };

  // Insert all buttons into the page
  document.body.appendChild(starMapBtn);
  document.body.appendChild(calendarBtn);
  document.body.appendChild(breathBtn);
  document.body.appendChild(astroWisdomBtn);
  document.body.appendChild(mantraBtn);
  document.body.appendChild(navBtn);
  document.body.appendChild(cosmicPromptBtn);
}

// Call this when the content script loads
chrome.runtime.sendMessage({ action: "requestInitialSettings" }, function(response) {
  if (chrome.runtime.lastError) {
    console.warn("Could not request initial settings:", chrome.runtime.lastError.message);
  } else if (response && response.settings) {
    console.log("Content script received initial settings:", response.settings);
    activeSettings = response.settings;
    applyAllSettings(activeSettings);
    addSpiritualAstrophysicsFeatures(); // Ensure features are added after settings are applied
  } else {
     console.warn("No initial settings received or unexpected response.");
  }
});

// --- GLOBALS ---
// Remove duplicate declarations of activeSettings and other globals
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

// --- LOGGING ---
function log(scriptName, message, ...args) {
  const now = new Date();
  const time = now.toLocaleTimeString();
  console.log(`[${scriptName}] [${time}] ${message}`, ...args);
}

// --- SETTINGS LISTENER ---
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
    displayFirasahPrompt(request.promptText);
    sendResponse && sendResponse({status: "Firasah prompt displayed"});
  } else if (request.action === "triggerSubconsciousVerbalRitual") {
    log('CS', `Triggering ritual: ${request.ritualText}`);
    displaySubconsciousVerbalRitual(request.ritualText);
    sendResponse && sendResponse({status: "Ritual displayed"});
  }
  return true;
});

// --- INITIAL SETTINGS REQUEST ---
chrome.runtime.sendMessage({ action: "requestInitialSettings" }, function(response) {
  if (chrome.runtime.lastError) {
    console.warn("Could not request initial settings:", chrome.runtime.lastError.message);
    return;
  }
  if (response && response.settings) {
    log('CS', "Initial settings received:", response.settings);
    activeSettings = response.settings;
    applyAllSettings(activeSettings);
  } else {
    console.warn("No initial settings received or unexpected response.");
  }
});

// --- APPLY ALL SETTINGS ---
function applyAllSettings(settings) {
  applyMuraqabaSettings(settings);
  applyDhikrSettings(settings);
  applyDhikrStreamSound(settings);
  applyMuraqabaMushtarakCue(settings);
  // ...add more feature hooks here...
}

// --- MURAQABA OVERLAY ---
function applyMuraqabaSettings(settings) {
  const isEnabled = settings?.featureToggles?.EnableMuraqaba === true;
  if (muraqabaOverlayElement) {
    muraqabaOverlayElement.remove();
    muraqabaOverlayElement = null;
  }
  if (isEnabled) {
    muraqabaOverlayElement = document.createElement('div');
    muraqabaOverlayElement.id = MURAQABA_OVERLAY_ID;
    muraqabaOverlayElement.style.position = 'fixed';
    muraqabaOverlayElement.style.top = '0';
    muraqabaOverlayElement.style.left = '0';
    muraqabaOverlayElement.style.width = '100vw';
    muraqabaOverlayElement.style.height = '100vh';
    muraqabaOverlayElement.style.pointerEvents = 'none';
    muraqabaOverlayElement.style.zIndex = '999999';
    muraqabaOverlayElement.style.background = 'rgba(173,216,230,0.08)';
    document.body.appendChild(muraqabaOverlayElement);
  } else {
    document.body.style.filter = 'none';
  }
}

// --- DHIKR WATERMARK ---
// Fix: settings.UserParams should be settings.userParams (case-sensitive)
function applyDhikrSettings(settings) {
  const isEnabled = settings?.featureToggles?.EnableDhikr === true;
  dhikrWatermarkElement = document.getElementById(DHIKR_WATERMARK_ID);
  if (isEnabled) {
    const dhikrText = settings?.userParams?.DhikrList?.split(',')[0].trim() || "Default Dhikr";
    if (!dhikrWatermarkElement) {
      dhikrWatermarkElement = document.createElement('div');
      dhikrWatermarkElement.id = DHIKR_WATERMARK_ID;
      dhikrWatermarkElement.style.position = 'fixed';
      dhikrWatermarkElement.style.bottom = '10px';
      dhikrWatermarkElement.style.right = '10px';
      dhikrWatermarkElement.style.pointerEvents = 'none';
      dhikrWatermarkElement.style.zIndex = '9999999';
      dhikrWatermarkElement.style.fontFamily = 'serif';
      dhikrWatermarkElement.style.padding = '5px 10px';
      dhikrWatermarkElement.style.borderRadius = '5px';
      document.body.appendChild(dhikrWatermarkElement);
    }
    dhikrWatermarkElement.textContent = dhikrText;
    dhikrWatermarkElement.style.fontSize = '20px';
    dhikrWatermarkElement.style.color = 'rgba(0,0,0,0.5)';
    dhikrWatermarkElement.style.backgroundColor = 'rgba(255,255,255,0.2)';
    dhikrWatermarkElement.style.display = 'block';
  } else if (dhikrWatermarkElement) {
    dhikrWatermarkElement.style.display = 'none';
  }
}

// --- DHIKR STREAM SOUND ---
// Fix: settings.UserParams should be settings.userParams (case-sensitive)
function applyDhikrStreamSound(settings) {
  const enableDhikrSound = settings?.featureToggles?.EnableDhikrStreamSound === true;
  const dhikrAudioFile = settings?.userParams?.DhikrAudioFile || "sounds/dhikr_om.mp3";
  if (enableDhikrSound) {
    if (!dhikrAudio) {
      dhikrAudio = new Audio(chrome.runtime.getURL(dhikrAudioFile));
      dhikrAudio.loop = true;
      dhikrAudio.volume = 0.05;
    }
    dhikrAudio.play().catch(e => log('CS', 'Error playing Dhikr audio:', e.message));
  } else if (dhikrAudio) {
    dhikrAudio.pause();
    dhikrAudio.currentTime = 0;
  }
}

// --- MURAQABA MUSHTARAK CUE ---
function applyMuraqabaMushtarakCue(settings) {
  const isActive = settings?.featureToggles?.EnableMuraqabaMushtarak && settings?.dynamicState?.CurrentMuraqabaMushtarakSession === 'active';
  let collectiveAura = document.getElementById('dilKiDastakCollectiveAura');
  if (isActive) {
    if (!collectiveAura) {
      collectiveAura = document.createElement('div');
      collectiveAura.id = 'dilKiDastakCollectiveAura';
      collectiveAura.style.position = 'fixed';
      collectiveAura.style.top = '0';
      collectiveAura.style.left = '0';
      collectiveAura.style.right = '0';
      collectiveAura.style.bottom = '0';
      collectiveAura.style.backgroundColor = 'rgba(138,43,226,0.05)';
      collectiveAura.style.pointerEvents = 'none';
      collectiveAura.style.zIndex = '9999';
      document.body.appendChild(collectiveAura);
    }
  } else if (collectiveAura) {
    collectiveAura.remove();
  }
}

// --- PLAY SPECIFIC AUDIO ---
function playSpecificAudio(audioUrl) {
  const audio = new Audio(audioUrl);
  audio.volume = 0.1;
  audio.play().catch(e => log('CS', 'Error playing specific audio:', e.message));
}

// --- MAQAM SHIFT DISPLAY ---
function displayMaqamShift(newMaqam) {
  let maqamMessageElement = document.getElementById('dilKiDastakMaqamMessage');
  if (!maqamMessageElement) {
    maqamMessageElement = document.createElement('div');
    maqamMessageElement.id = 'dilKiDastakMaqamMessage';
    maqamMessageElement.style.position = 'fixed';
    maqamMessageElement.style.top = '20px';
    maqamMessageElement.style.left = '50%';
    maqamMessageElement.style.transform = 'translateX(-50%)';
    maqamMessageElement.style.backgroundColor = 'rgba(100,149,237,0.9)';
    maqamMessageElement.style.color = 'white';
    maqamMessageElement.style.padding = '8px 15px';
    maqamMessageElement.style.borderRadius = '5px';
    maqamMessageElement.style.zIndex = '99999999';
    maqamMessageElement.style.opacity = '0';
    maqamMessageElement.style.transition = 'opacity 0.5s ease-in-out';
    document.body.appendChild(maqamMessageElement);
  }
  maqamMessageElement.textContent = `Maqam: ${newMaqam}`;
  maqamMessageElement.style.opacity = '1';
  setTimeout(() => { maqamMessageElement.style.opacity = '0'; }, 3000);
}

// --- ADJUST SETTINGS FOR MAQAM ---
function adjustSettingsForMaqam(maqamType) {
  if (!activeSettings.DynamicState) activeSettings.DynamicState = {};
  switch(maqamType) {
    case "worldly_knowledge":
      activeSettings.DynamicState.CurrentDeviFocus = "Maa Saraswati";
      activeSettings.DynamicState.OverallEhsaasIntensity = 0.6;
      break;
    case "social_connection":
      activeSettings.DynamicState.CurrentDeviFocus = "Maa Lakshmi";
      activeSettings.DynamicState.OverallEhsaasIntensity = 0.5;
      break;
    case "contemplation":
      activeSettings.DynamicState.CurrentDeviFocus = "Maa Kali";
      activeSettings.DynamicState.OverallEhsaasIntensity = 0.8;
      break;
    case "recreation":
      activeSettings.DynamicState.CurrentDeviFocus = "Maa Lakshmi";
      activeSettings.DynamicState.OverallEhsaasIntensity = 0.4;
      break;
    case "creative_expression":
      activeSettings.DynamicState.CurrentDeviFocus = "Maa Saraswati";
      activeSettings.DynamicState.OverallEhsaasIntensity = 0.7;
      break;
    default:
      activeSettings.DynamicState.CurrentDeviFocus = "Universal Devi";
      activeSettings.DynamicState.OverallEhsaasIntensity = 0.5;
      break;
  }
  chrome.runtime.sendMessage({
    action: "updateDynamicState",
    dynamicState: activeSettings.DynamicState
  });
}

// --- FIRASAH PROMPT DISPLAY ---
function displayFirasahPrompt(promptText) {
  if (!activeSettings?.featureToggles?.EnableFirasahPrompts) return;
  if (firasahPromptElement) firasahPromptElement.remove();
  firasahPromptElement = document.createElement('div');
  firasahPromptElement.id = FIRASAH_PROMPT_ID;
  firasahPromptElement.style.position = 'fixed';
  firasahPromptElement.style.bottom = '20px';
  firasahPromptElement.style.left = '50%';
  firasahPromptElement.style.transform = 'translateX(-50%)';
  firasahPromptElement.style.backgroundColor = 'rgba(75,0,130,0.9)';
  firasahPromptElement.style.color = 'white';
  firasahPromptElement.style.padding = '12px 20px';
  firasahPromptElement.style.borderRadius = '8px';
  firasahPromptElement.style.zIndex = '999999999';
  firasahPromptElement.style.opacity = '0';
  firasahPromptElement.style.transition = 'opacity 0.5s ease-in-out';
  firasahPromptElement.style.maxWidth = '80%';
  firasahPromptElement.style.textAlign = 'center';
  firasahPromptElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
  firasahPromptElement.style.fontStyle = 'italic';
  firasahPromptElement.innerHTML = `🌟 <b>A Whisper of Firasah:</b><br>${promptText}`;
  document.body.appendChild(firasahPromptElement);
  setTimeout(() => { firasahPromptElement.style.opacity = '1'; }, 100);
  setTimeout(() => {
    firasahPromptElement.style.opacity = '0';
    setTimeout(() => { if (firasahPromptElement) firasahPromptElement.remove(); firasahPromptElement = null; }, 600);
  }, 8000);
}

// --- SUBCONSCIOUS VERBAL RITUAL DISPLAY ---
function displaySubconsciousVerbalRitual(ritualText) {
  if (!activeSettings?.featureToggles?.EnableSubconsciousVerbalRituals) return;
  let ritualElement = document.getElementById('dilKiDastakVerbalRitual');
  if (!ritualElement) {
    ritualElement = document.createElement('div');
    ritualElement.id = 'dilKiDastakVerbalRitual';
    ritualElement.style.position = 'fixed';
    ritualElement.style.top = '50%';
    ritualElement.style.left = '50%';
    ritualElement.style.transform = 'translate(-50%, -50%)';
    ritualElement.style.backgroundColor = 'rgba(0,128,0,0.8)';
    ritualElement.style.color = 'white';
    ritualElement.style.padding = '15px 25px';
    ritualElement.style.borderRadius = '10px';
    ritualElement.style.zIndex = '9999999999';
    ritualElement.style.opacity = '0';
    ritualElement.style.transition = 'opacity 0.7s, transform 0.7s';
    ritualElement.style.fontWeight = 'bold';
    ritualElement.style.fontSize = '1.5em';
    ritualElement.style.textAlign = 'center';
    ritualElement.style.boxShadow = '0 5px 20px rgba(0,0,0,0.4)';
    document.body.appendChild(ritualElement);
  }
  ritualElement.textContent = ritualText;
  ritualElement.style.opacity = '1';
  ritualElement.style.transform = 'translate(-50%, -50%) scale(1.1)';
  setTimeout(() => {
    ritualElement.style.opacity = '0';
    ritualElement.style.transform = 'translate(-50%, -50%) scale(0.9)';
    setTimeout(() => { if (ritualElement) ritualElement.remove(); }, 800);
  }, 4000);
}

// --- CHUPA HUA RATAN (Hidden Gem) ---
const CHUPA_HUA_RATAN_ID = 'dilKiDastakChupaHuaRatan';
function createAndPlaceChupaHuaRatan() {
  let existingRatan = document.getElementById(CHUPA_HUA_RATAN_ID);
  if (existingRatan) existingRatan.remove();
  const ratan = document.createElement('div');
  ratan.id = CHUPA_HUA_RATAN_ID;
  ratan.textContent = '💎';
  ratan.title = 'A Chupa Hua Ratan awaits your discovery!';
  ratan.style.position = 'fixed';
  ratan.style.zIndex = '999999';
  ratan.style.cursor = 'pointer';
  ratan.style.fontSize = '20px';
  ratan.style.left = `${Math.random() * (window.innerWidth - 50)}px`;
  ratan.style.top = `${Math.random() * (window.innerHeight - 50)}px`;
  ratan.style.opacity = '0.05';
  ratan.style.transition = 'opacity 0.3s';
  ratan.onmouseover = () => { ratan.style.opacity = '0.5'; };
  ratan.onmouseout = () => { ratan.style.opacity = '0.05'; };
  ratan.addEventListener('click', () => {
    log('CS', 'Chupa Hua Ratan discovered!');
    ratan.textContent = '✨';
    ratan.style.opacity = '1';
    ratan.style.backgroundColor = 'rgba(255,255,0,0.5)';
    ratan.style.borderRadius = '50%';
    ratan.style.padding = '5px';
    chrome.runtime.sendMessage({ action: "chupaHuaRatanDiscovered" });
    setTimeout(() => { ratan.remove(); }, 2000);
  });
  document.body.appendChild(ratan);
  log('CS', 'Chupa Hua Ratan placed on page.');
}
document.addEventListener('DOMContentLoaded', createAndPlaceChupaHuaRatan);

// --- OPTIONAL: Add more features here as needed ---

// --- GLOBAL STYLE FOR FADE EFFECTS ---
const globalMsgStyle = document.createElement('style');
globalMsgStyle.textContent = `
    @keyframes fadeEffect {
        from {opacity: 0;}
        to {opacity: 1;}
    }
    .fade-in-out {
        animation: fadeEffect 0.5s forwards;
    }
`;
document.head.appendChild(globalMsgStyle);

// --- SHUKR DISPLAY ELEMENT SAFETY ---
// Fix: Only create shukrDisplayElement if it doesn't exist, and avoid duplicate elements
function updateShukrDisplay(count) {
  let shukrDisplayElement = document.getElementById('shukrDisplayElement');
  if (!shukrDisplayElement) {
    shukrDisplayElement = document.createElement('div');
    shukrDisplayElement.id = 'shukrDisplayElement';
    shukrDisplayElement.style.position = 'fixed';
    shukrDisplayElement.style.bottom = '30px';
    shukrDisplayElement.style.right = '30px';
    shukrDisplayElement.style.background = 'rgba(255,255,255,0.8)';
    shukrDisplayElement.style.padding = '8px 16px';
    shukrDisplayElement.style.borderRadius = '8px';
    shukrDisplayElement.style.zIndex = '999999';
    document.body.appendChild(shukrDisplayElement);
  }
  shukrDisplayElement.textContent = `Shukr Count: ${count}`;
}

// Example for getWisdomBtn:
function ensureGetWisdomBtn() {
  let getWisdomBtn = document.getElementById('getWisdomBtn');
  if (!getWisdomBtn) {
    getWisdomBtn = document.createElement('button');
    getWisdomBtn.id = 'getWisdomBtn';
    getWisdomBtn.textContent = 'Get Wisdom';
    getWisdomBtn.style.position = 'fixed';
    getWisdomBtn.style.bottom = '80px';
    getWisdomBtn.style.right = '30px';
    getWisdomBtn.style.zIndex = '999999';
    document.body.appendChild(getWisdomBtn);
  }
  return getWisdomBtn;
}

// When using these elements elsewhere, always call the ensure function first
// Example usage:
// let getWisdomBtn = ensureGetWisdomBtn();
// getWisdomBtn.onclick = function() { ... };

// --- ADVANCED: Add a spiritual "insight clustering" algorithm for Firasah prompts ---
// This clusters similar prompts to avoid repetition and enhance diversity of spiritual guidance.

function clusterPrompts(prompts, numClusters = 5) {
  // Use a simple k-means-like clustering based on string similarity (Levenshtein distance)
  // For brevity, use a fast Jaccard similarity on word sets
  function jaccard(a, b) {
    const setA = new Set(a.toLowerCase().split(/\W+/));
    const setB = new Set(b.toLowerCase().split(/\W+/));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return intersection.size / union.size;
  }

  // Randomly initialize cluster centers
  let centers = [];
  for (let i = 0; i < numClusters; i++) {
    centers.push(prompts[Math.floor(Math.random() * prompts.length)]);
  }

  let assignments = new Array(prompts.length).fill(0);
  let changed = true;
  let iter = 0;
  while (changed && iter < 10) {
    changed = false;
    // Assign each prompt to the closest center
    for (let i = 0; i < prompts.length; i++) {
      let best = 0, bestScore = -1;
      for (let j = 0; j < centers.length; j++) {
        const score = jaccard(prompts[i], centers[j]);
        if (score > bestScore) {
          bestScore = score;
          best = j;
        }
      }
      if (assignments[i] !== best) {
        assignments[i] = best;
        changed = true;
      }
    }
    // Update centers
    for (let j = 0; j < centers.length; j++) {
      const cluster = prompts.filter((_, idx) => assignments[idx] === j);
      if (cluster.length > 0) {
        centers[j] = cluster.reduce((a, b) => a.length < b.length ? a : b); // New center is the "medoid"
      }
    }
    iter++;
  }

  return assignments;
}

// --- SPIRITUAL ASTROPHYSICS & COSMIC HISTORY FEATURES ---

function addSpiritualAstrophysicsFeatures() {
  if (document.getElementById('astroPhysicsBtn')) return;

  // 1. Cosmic Sufi Star Map (shows a random ancient constellation and its spiritual meaning)
  const starMapBtn = document.createElement('button');
  starMapBtn.id = 'astroPhysicsBtn';
  starMapBtn.className = 'reflection-btn';
  starMapBtn.innerHTML = `🌌 Cosmic Star Map`;
  starMapBtn.style.position = 'fixed';
  starMapBtn.style.bottom = '140px';
  starMapBtn.style.right = '30px';
  starMapBtn.style.zIndex = '999999';
  starMapBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  starMapBtn.onclick = function() {
    const constellations = [
      { name: "Orion", meaning: "The Hunter – Symbol of cosmic struggle and spiritual quest." },
      { name: "Pleiades (Seven Sisters)", meaning: "Unity, spiritual family, and guidance in darkness." },
      { name: "Ursa Major", meaning: "The Great Bear – Guidance, the Pole Star, and steadfastness." },
      { name: "Sirius", meaning: "The Dog Star – Ancient Egypt: the soul's journey and rebirth." },
      { name: "Aquila", meaning: "The Eagle – Divine messenger, ascension, and vision." },
      { name: "Cassiopeia", meaning: "The Queen – Humility and the dangers of pride." },
      { name: "Scorpius", meaning: "The Scorpion – Transformation, death, and rebirth." },
      { name: "Sagittarius", meaning: "The Archer – Focus, spiritual aim, and the journey to truth." },
      { name: "Andromeda", meaning: "The Chained Woman – Liberation from ego and cosmic rescue." },
      { name: "Lyra", meaning: "The Lyre – Harmony, music of the spheres, and divine resonance." }
    ];
    const c = constellations[Math.floor(Math.random() * constellations.length)];
    alert(`✨ ${c.name}\n${c.meaning}`);
  };

  // 2. Ancient Cosmic Calendar (shows a random date from a spiritual calendar)
  const calendarBtn = document.createElement('button');
  calendarBtn.id = 'astroCalendarBtn';
  calendarBtn.className = 'reflection-btn';
  calendarBtn.innerHTML = `🪐 Ancient Cosmic Calendar`;
  calendarBtn.style.position = 'fixed';
  calendarBtn.style.bottom = '100px';
  calendarBtn.style.right = '30px';
  calendarBtn.style.zIndex = '999999';
  calendarBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  calendarBtn.onclick = function() {
    const calendars = [
      "Mayan Long Count: 13.0.0.0.0 (Dec 21, 2012) – Cycle of renewal.",
      "Egyptian Sothic Cycle: Sirius rising – New Year, rebirth.",
      "Babylonian New Year: Akitu Festival – Cosmic order restored.",
      "Islamic Mi'raj: Prophet's Night Journey – Ascension through the heavens.",
      "Hindu Yugas: Satya Yuga – Age of Truth and cosmic harmony.",
      "Chinese Lunar New Year: Spring Festival – Renewal and cosmic balance.",
      "Zoroastrian Nowruz: Vernal Equinox – Light over darkness.",
      "Jewish Rosh Hashanah: Head of the Year – Cosmic judgment and renewal."
    ];
    alert("🌠 " + calendars[Math.floor(Math.random() * calendars.length)]);
  };

  // 3. Sufi Cosmic Breath (visualizes the breath as a journey through the cosmos)
  const breathBtn = document.createElement('button');
  breathBtn.id = 'cosmicBreathBtn';
  breathBtn.className = 'reflection-btn';
  breathBtn.innerHTML = `💫 Sufi Cosmic Breath`;
  breathBtn.style.position = 'fixed';
  breathBtn.style.bottom = '60px';
  breathBtn.style.right = '30px';
  breathBtn.style.zIndex = '999999';
  breathBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  breathBtn.onclick = function() {
    alert("Inhale: Imagine drawing in starlight from the edge of the universe.\nHold: Let the cosmic energy fill your heart.\nExhale: Release your breath as a blessing to all beings.");
  };

  // 4. Ancient Astrological Wisdom (random wisdom from ancient astrologers)
  const astroWisdomBtn = document.createElement('button');
  astroWisdomBtn.id = 'astroWisdomBtn';
  astroWisdomBtn.className = 'reflection-btn';
  astroWisdomBtn.innerHTML = `🌠 Ancient Astro Wisdom`;
  astroWisdomBtn.style.position = 'fixed';
  astroWisdomBtn.style.bottom = '180px';
  astroWisdomBtn.style.right = '30px';
  astroWisdomBtn.style.zIndex = '999999';
  astroWisdomBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  astroWisdomBtn.onclick = function() {
    const wisdoms = [
      "As above, so below. – Hermetic maxim",
      "The stars incline, they do not compel. – Ptolemy",
      "Every soul is born under a star. – Sufi tradition",
      "The moon is a faithful witness to the tides of the heart.",
      "The Milky Way is the path of souls returning home.",
      "The cosmos is within us; we are made of star-stuff. – Carl Sagan",
      "When you look at the stars, you are looking at your ancestors.",
      "The dance of the planets is the music of destiny."
    ];
    alert("🪐 " + wisdoms[Math.floor(Math.random() * wisdoms.length)]);
  };

  // 5. Cosmic Mantra Generator (ancient mantras for cosmic harmony)
  const mantraBtn = document.createElement('button');
  mantraBtn.id = 'cosmicMantraBtn';
  mantraBtn.className = 'reflection-btn';
  mantraBtn.innerHTML = `🔭 Cosmic Mantra`;
  mantraBtn.style.position = 'fixed';
  mantraBtn.style.bottom = '220px';
  mantraBtn.style.right = '30px';
  mantraBtn.style.zIndex = '999999';
  mantraBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  mantraBtn.onclick = function() {
    const mantras = [
      "Om Mani Padme Hum – Jewel in the Lotus.",
      "La ilaha illallah – There is no god but God.",
      "Om Tat Sat – That is the Truth.",
      "SubhanAllahi wa bihamdihi – Glory and praise to God.",
      "Sh'ma Yisrael – Hear, O Israel.",
      "Gayatri Mantra – May we attain that excellent glory of the Sun.",
      "Allahu Akbar – God is the Greatest.",
      "Om Shanti Shanti Shanti – Peace, peace, peace."
    ];
    alert("✨ Cosmic Mantra:\n" + mantras[Math.floor(Math.random() * mantras.length)]);
  };

  // 6. Ancient Astral Navigation (shows a navigation tip from ancient mariners)
  const navBtn = document.createElement('button');
  navBtn.id = 'astroNavBtn';
  navBtn.className = 'reflection-btn';
  navBtn.innerHTML = `🧭 Astral Navigation`;
  navBtn.style.position = 'fixed';
  navBtn.style.bottom = '260px';
  navBtn.style.right = '30px';
  navBtn.style.zIndex = '999999';
  navBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  navBtn.onclick = function() {
    const navs = [
      "Find the North Star (Polaris) to guide your way at night.",
      "The Southern Cross points to the South Celestial Pole.",
      "The rising of Sirius marked the Nile flood in Egypt.",
      "The Pleiades signal planting and harvest times in many cultures.",
      "The moon's phases guide the timing of rituals and journeys.",
      "The Milky Way was the 'Path of Souls' for many ancient peoples."
    ];
    alert("🌌 Ancient Navigation Tip:\n" + navs[Math.floor(Math.random() * navs.length)]);
  };

  // 7. Cosmic Reflection Prompt (deep question about your place in the universe)
  const cosmicPromptBtn = document.createElement('button');
  cosmicPromptBtn.id = 'cosmicPromptBtn';
  cosmicPromptBtn.className = 'reflection-btn';
  cosmicPromptBtn.innerHTML = `🌙 Cosmic Reflection`;
  cosmicPromptBtn.style.position = 'fixed';
  cosmicPromptBtn.style.bottom = '300px';
  cosmicPromptBtn.style.right = '30px';
  cosmicPromptBtn.style.zIndex = '999999';
  cosmicPromptBtn.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
  cosmicPromptBtn.onclick = function() {
    const prompts = [
      "If your soul were a star, which would it be and why?",
      "What ancient constellation do you feel most connected to?",
      "How does the movement of the moon affect your inner tides?",
      "What does the night sky teach you about patience and time?",
      "If you could send a message to the cosmos, what would it be?",
      "How do you find your way when you feel lost in the universe?",
      "What is your personal North Star?"
    ];
    alert("🌠 Cosmic Reflection:\n" + prompts[Math.floor(Math.random() * prompts.length)]);
  };

  // Insert all buttons into the page
  document.body.appendChild(starMapBtn);
  document.body.appendChild(calendarBtn);
  document.body.appendChild(breathBtn);
  document.body.appendChild(astroWisdomBtn);
  document.body.appendChild(mantraBtn);
  document.body.appendChild(navBtn);
  document.body.appendChild(cosmicPromptBtn);
}

// Call this when the content script loads
chrome.runtime.sendMessage({ action: "requestInitialSettings" }, function(response) {
  if (chrome.runtime.lastError) {
    console.warn("Could not request initial settings:", chrome.runtime.lastError.message);
  } else if (response && response.settings) {
    console.log("Content script received initial settings:", response.settings);
    activeSettings = response.settings;
    applyAllSettings(activeSettings);
    addSpiritualAstrophysicsFeatures(); // Ensure features are added after settings are applied
  } else {
     console.warn("No initial settings received or unexpected response.");
  }
});

// --- GLOBALS ---
// Remove duplicate declarations of activeSettings and other globals
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

// --- LOGGING ---
function log(scriptName, message, ...args) {
  const now = new Date();
  const time = now.toLocaleTimeString();
  console.log(`[${scriptName}] [${time}] ${message}`, ...args);
}

// --- SETTINGS LISTENER ---
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
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
    displayFirasahPrompt(request.promptText);
    sendResponse && sendResponse({status: "Firasah prompt displayed"});
  } else if (request.action === "triggerSubconsciousVerbalRitual") {
    log('CS', `Triggering ritual: ${request.ritualText}`);
    displaySubconsciousVerbalRitual(request.ritualText);
    sendResponse && sendResponse({status: "Ritual displayed"});
  }
  return true;
});

// --- INITIAL SETTINGS REQUEST ---
chrome.runtime.sendMessage({ action: "requestInitialSettings" }, function(response) {
  if (chrome