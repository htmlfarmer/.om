// popup_niyyah.js
 
// Reference to DOM elements
/*
const niyyahInput = document.getElementById('niyyahInput');
const setNiyyahBtn = document.getElementById('setNiyyahBtn');
const shukrDisplayElement = document.getElementById('shukrDisplay');
const incrementShukrBtn = document.getElementById('incrementShukrBtn');
const getWisdomBtn = document.getElementById('getWisdomBtn');
const wisdomDisplayDiv = document.getElementById('wisdomDisplay');
const copyWadudBtn = document.getElementById('copyWadudBtn');
const wadudBlessingTextDiv = document.getElementById('wadudBlessingText');
const wadudTransliterationDiv = document.getElementById('wadudTransliteration');
const wadudTranslationDiv = document.getElementById('wadudTranslation');
const copyWadudConfirmationDiv = document.getElementById('copyWadudConfirmation');
const niyyahVisualizerDiv = document.getElementById('niyyahVisualizer');
const niyyahVisualImage = document.getElementById('niyyahVisualImage');
const currentDeviFocusPopup = document.getElementById('currentDeviFocusPopup');
const deviSymbolPopup = document.getElementById('deviSymbolPopup');
*/

    // Call this when the popup loads
document.addEventListener('DOMContentLoaded', updateRatanDiscoveryDisplay);
    // You might also want to update it if the count changes while the popup is open
    // (e.g., via a message from background.js, or by re-calling updateRatanDiscoveryDisplay)

// Function to update Ratan Discovery count display
function updateRatanDiscoveryDisplay() {
  chrome.storage.local.get("ratanCount", (data) => {
    const count = data.ratanCount || 0;
    const ratanDisplayElement = document.getElementById('ratanDiscoveryDisplay'); // Ensure this ID exists in your HTML
    if (ratanDisplayElement) {
      ratanDisplayElement.textContent = `Ratan Discovered: ${count} 💎`;
    }
  });
}

// Call this when the popup loads
document.addEventListener('DOMContentLoaded', updateShukrDisplay); // Keep existing
document.addEventListener('DOMContentLoaded', updateRatanDiscoveryDisplay); // Add this line

// Listen for changes in chrome.storage specifically for 'ratanCount'
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'local' && changes.ratanCount) {
    console.log("Ratan count changed in storage. Updating display.");
    updateRatanDiscoveryDisplay();
  }
});
    
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === 'local' && changes.ratanCount) {
    // If 'ratanCount' has changed, update the display
    console.log("Ratan count changed in storage. Updating display.");
    updateRatanDiscoveryDisplay();
  }
});

// popup_niyyah.js

// Function to update Shukr count display
function updateShukrDisplay(shukrDisplayElement) {
  chrome.storage.local.get("shukrCount", (data) => {
    const count = data.shukrCount || 0;
    if (shukrDisplayElement) {
      shukrDisplayElement.textContent = `Shukr Count: ${count} 🙏`;
    }
  });
}

// Function to update Ratan Discovery display
function updateRatanDiscoveryDisplay(ratanDiscoveryDisplayElement) {
  chrome.storage.local.get("ratanCount", (data) => {
    const count = data.ratanCount || 0;
    if (ratanDiscoveryDisplayElement) {
      ratanDiscoveryDisplayElement.textContent = `Ratan Discovered: ${count} 💎`;
    }
  });
}


/// --- Main DOMContentLoaded Listener: ALL element selections and event listeners go INSIDE this block ---
document.addEventListener('DOMContentLoaded', function() {

  // --- 1. DECLARE ALL YOUR HTML ELEMENT REFERENCES ONCE AT THE VERY TOP OF THIS BLOCK ---
  // This ensures all variables are available before use and avoids "before initialization" errors.
  const niyyahInput = document.getElementById('niyyahInput');
  const setNiyyahBtn = document.getElementById('setNiyyahBtn');
  const shukrDisplayElement = document.getElementById('shukrDisplay');
  const ratanDiscoveryDisplayElement = document.getElementById('ratanDiscoveryDisplay');
  const incrementShukrBtn = document.getElementById('incrementShukrBtn');
  const getWisdomBtn = document.getElementById('getWisdomBtn');
  const wisdomDisplayDiv = document.getElementById('wisdomDisplay');
  const wadudBlessingTextDiv = document.getElementById('wadudBlessingText');
  const wadudTransliterationDiv = document.getElementById('wadudTransliteration');
  const wadudTranslationDiv = document.getElementById('wadudTranslation');
  const copyWadudBtn = document.getElementById('copyWadudBtn');
  const copyWadudConfirmationDiv = document.getElementById('copyWadudConfirmation');
  const niyyahVisualizerDiv = document.getElementById('niyyahVisualizer');
  const niyyahVisualImage = document.getElementById('niyyahVisualImage');
  const currentDeviFocusPopup = document.getElementById('currentDeviFocusPopup');
  const deviSymbolPopup = document.getElementById('deviSymbolPopup');
  const joinSatsangBtn = document.getElementById('joinSatsangBtn');
  const satsangStatusDiv = document.getElementById('satsangStatus');
  const startMushtarakBtn = document.getElementById('startMushtarakBtn');
  const mushtarakStatusDiv = document.getElementById('mushtarakStatus');
  const sharedShukrStreamDiv = document.getElementById('sharedShukrStream');

  // Important Note on 'activeSettings':
  // The 'activeSettings' variable is primarily used in 'content_script.js' and 'background.js'.
  // It should NOT be declared or duplicated in 'popup_niyyah.js' unless you have a specific reason
  // to pass it to the popup via messages, which is not causing these specific errors.
  // Ensure 'activeSettings' is NOT declared with 'const' or 'let' anywhere in this 'popup_niyyah.js' file.


  // --- 2. ATTACH ALL EVENT LISTENERS AND CALL INITIAL DISPLAY FUNCTIONS HERE ---

  // Niyyah Listener
  if (setNiyyahBtn && niyyahInput) {
    setNiyyahBtn.addEventListener('click', () => {
      const niyyah = niyyahInput.value;
      if (niyyah) {
        // Do NOT call window.close() in the callback.
        // Instead, let the user close the popup manually, or use a confirmation message.
        chrome.storage.local.set({ currentNiyyah: niyyah }, () => {
          showPopupConfirmation("Niyyah set! You may close this popup.", false);
        });
        // If you want to allow closing, you can add a close button or instruct the user.
      }
    });
  }

  // Function to update Shukr count display
  function updateShukrDisplay(count) {
    if (shukrDisplayElement) {
      shukrDisplayElement.textContent = `Shukr Count: ${count} 🙏`;
    }
  }

  // Function to update Ratan Discovery display
  function updateRatanDiscoveryDisplay(count) {
    if (ratanDiscoveryDisplayElement) {
      ratanDiscoveryDisplayElement.textContent = `Ratan Discovered: ${count} 💎`;
    }
  }

  // Initial display updates when popup loads, passing the element
  chrome.storage.local.get(['shukrCount', 'ratanCount'], (data) => {
    updateShukrDisplay(data.shukrCount || 0);
    updateRatanDiscoveryDisplay(data.ratanCount || 0);
  });

  // Listen for changes in chrome.storage for Shukr and Ratan (passing the element)
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local') {
      if (changes.shukrCount) {
        updateShukrDisplay(changes.shukrCount.newValue || 0);
      }
      if (changes.ratanCount) {
        updateRatanDiscoveryDisplay(changes.ratanCount.newValue || 0);
      }
    }
  });

  // Wisdom/Quotes Logic
  const spiritualQuotes = [
    "The heart that truly knows the Divine has found its eternal spring. - Rumi",
    "To be grateful is to be a recipient of the Divine's boundless grace. - Sufi Saying",
    "Seek wisdom not in books alone, but in the whispers of your own heart. - Tri Devi Teachings",
    "Every breath is a new opportunity for devotion. - Unknown Mystic",
    "True devotion is not an act, but a state of being. - Ancient Text",
    "The Tri Devis reside not in distant heavens, but within the sacred space of your own being. - Wisdom Lore",
    "Let your Niyyah be pure, and the path will reveal itself. - Guidance for the Seeker",
    "Through paradox, the mind transcends its limits and glimpses boundless strength. - Tri Devi Wisdom",
    "Kam Bolo, Theek Bolo: Speak little, speak truly. The essence holds the power. - Hikmat Principle"
  ];

  if (getWisdomBtn && wisdomDisplayDiv) {
    getWisdomBtn.addEventListener('click', function() {
      const randomIndex = Math.floor(Math.random() * spiritualQuotes.length);
      wisdomDisplayDiv.textContent = spiritualQuotes[randomIndex];
    });
  }

  // Wadud Blessing Copy Logic
  if (wadudBlessingTextDiv && wadudTransliterationDiv && wadudTranslationDiv && copyWadudBtn && copyWadudConfirmationDiv) {
    copyWadudBtn.addEventListener('click', function() {
      const arabicText = wadudBlessingTextDiv.innerText;
      const translitText = wadudTransliterationDiv.innerText;
      const translationText = wadudTranslationDiv.innerText;

      const fullTextToCopy =
`${arabicText}

${translitText}

${translationText}

Shared via Dil ki Dastak with prayers for Divine Love to reach all homes.`;

      navigator.clipboard.writeText(fullTextToCopy).then(function() {
        copyWadudConfirmationDiv.textContent = 'Invocation copied!';
        console.log('Wadud Blessing copied to clipboard.');
        setTimeout(() => {
          copyWadudConfirmationDiv.textContent = '';
        }, 2500);
      }).catch(function(err) {
        console.error('Could not copy text: ', err);
        copyWadudConfirmationDiv.textContent = 'Copy failed. Try manually.';
        copyWadudConfirmationDiv.style.color = 'red';
         setTimeout(() => {
          copyWadudConfirmationDiv.textContent = '';
          copyWadudConfirmationDiv.style.color = 'green';
        }, 3000);
      });
    });
  } else {
    console.warn("Wadud Blessing copy elements not all found in popup.");
  }

  // --- NEW: Ruhaani Rabt elements
  // Load wisdom and ensure safe display (using textContent for security)
  chrome.storage.local.get('ruhaniNuskhaContent', (data) => {
    // FIX: Only call parseRuhaniNuskha if it is defined, otherwise fallback to a default array
    let spiritualQuotes = [
      "The heart that truly knows the Divine has found its eternal spring. - Rumi"
    ];
    if (typeof parseRuhaniNuskha === 'function') {
      const settings = parseRuhaniNuskha(data.ruhaniNuskhaContent || defaultRuhaniNuskha);
      if (settings.spiritualQuotes && Array.isArray(settings.spiritualQuotes)) {
        spiritualQuotes = settings.spiritualQuotes;
      }
    }
    if (getWisdomBtn && wisdomDisplayDiv) {
      getWisdomBtn.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * spiritualQuotes.length);
        wisdomDisplayDiv.textContent = spiritualQuotes[randomIndex];
      });
    }
  });

  // --- NEW: Event listener for joining Satsang Room (conceptual)
  if (joinSatsangBtn && satsangStatusDiv) {
      joinSatsangBtn.addEventListener('click', () => {
          const currentStatus = satsangStatusDiv.textContent.includes('Online') ? 'Offline' : 'Online';
          satsangStatusDiv.textContent = `Status: ${currentStatus}`;
          joinSatsangBtn.textContent = currentStatus === 'Online' ? 'Leave Satsang Room' : 'Join Satsang Room';

          // Inform background script to update communal status (conceptual)
          chrome.runtime.sendMessage({ action: "updateSatsangStatus", status: currentStatus }, (response) => {
              console.log("Satsang update response:", response);
          });
      });
  }

  // --- NEW: Event listener for starting Muraqaba-e-Mushtarak (conceptual)
  if (startMushtarakBtn && mushtarakStatusDiv) {
      startMushtarakBtn.addEventListener('click', () => {
          // Send message to background to initiate collective timer/cue
          chrome.runtime.sendMessage({ action: "startMuraqabaMushtarak" }, (response) => {
              mushtarakStatusDiv.textContent = response.status;
              console.log("Muraqaba Mushtarak response:", response);
          });
      });
  }

  // --- NEW: Function to load and display shared Shukr Stream (conceptual)
  function loadSharedShukrStream() {
      // In a real scenario, this would poll a conceptual server or P2P network
      // For now, it could display recent local Shukr notes or conceptual shared ones.
      chrome.runtime.sendMessage({ action: "requestSharedData" }, (response) => {
          if (chrome.runtime.lastError) {
            // Ignore the error, do not log or throw
            return;
          }
          if (response && response.insights) {
              sharedShukrStreamDiv.innerHTML = '';
              const insightKeys = Object.keys(response.insights);
              if (insightKeys.length > 0) {
                  insightKeys.slice(-5).forEach(key => {
                      const p = document.createElement('p');
                      p.textContent = `Insight: "${response.insights[key]}"`;
                      p.style.fontSize = '0.85em';
                      p.style.marginBottom = '3px';
                      p.style.paddingBottom = '3px';
                      p.style.borderBottom = '1px dotted #eee';
                      sharedShukrStreamDiv.appendChild(p);
                  });
              } else {
                  sharedShukrStreamDiv.innerHTML = '<p style="color:#888;">No shared Shukr/insights yet...</p>';
              }
          }
      });
  }
  loadSharedShukrStream(); // Load on popup open
  // setInterval(loadSharedShukrStream, 30000); // Periodically refresh (conceptual)


}); // --- END of Main DOMContentLoaded Listener ---


// Function to load initial state (Niyyah, Shukr, current Devi Focus)
function loadInitialState() {
  chrome.storage.local.get(['currentNiyyah', 'shukrCount'], (data) => {
    if (niyyahInput) niyyahInput.value = data.currentNiyyah || '';
    updateShukrDisplay(data.shukrCount || 0);
  });

  // Request full settings to get Devi Focus for popup
  chrome.runtime.sendMessage({ action: "requestInitialSettings" }, function(response) {
    if (chrome.runtime.lastError) {
      console.warn("Popup: Could not request initial settings:", chrome.runtime.lastError.message);
    } else if (response && response.settings) {
      activeSettings = response.settings; // Store settings locally
      updateDeviFocusDisplay(activeSettings); // Update Devi focus visual
    }
  });
}


// --- Niyyah Visualizer (WOW Feature - Popup) ---
function triggerNiyyahVisualizer() {
    if (!niyyahVisualizerDiv || !niyyahVisualImage) return;

    niyyahVisualizerDiv.style.display = 'block'; // Show the visualizer container
    niyyahVisualizerDiv.style.opacity = '0'; // Start invisible for fade-in
    niyyahVisualizerDiv.style.transform = 'scale(0.8)'; // Start smaller

    // Choose a random symbol for the Niyyah's blooming
    const symbols = [
        "images/symbols/lamp.png",
        "images/symbols/lotus.png",
        "images/symbols/saraswati_symbol.png", // Re-using Devi symbols too
        "images/symbols/lakshmi_symbol.png",
        "images/symbols/kali_symbol.png"
    ];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    niyyahVisualImage.src = chrome.runtime.getURL(randomSymbol);

    // Fade in and grow
    setTimeout(() => {
        niyyahVisualizerDiv.style.transition = 'opacity 0.7s ease-out, transform 0.7s ease-out';
        niyyahVisualizerDiv.style.opacity = '1';
        niyyahVisualizerDiv.style.transform = 'scale(1)';
    }, 50);

    // Fade out after a few seconds
    setTimeout(() => {
        niyyahVisualizerDiv.style.transition = 'opacity 1s ease-in, transform 1s ease-in';
        niyyahVisualizerDiv.style.opacity = '0';
        niyyahVisualizerDiv.style.transform = 'scale(1.2)';
        setTimeout(() => {
            niyyahVisualizerDiv.style.display = 'none'; // Hide completely after fade
            niyyahVisualizerDiv.style.transition = 'none'; // Reset transition
        }, 1000);
    }, 3000); // Display for 3 seconds before fading out
}

// --- Update Current Devi Focus in Popup ---
function updateDeviFocusDisplay(settings) {
    const currentDevi = settings?.DynamicState?.CurrentDeviFocus || "Universal Devi (Balance)";
    if (currentDeviFocusPopup) {
        currentDeviFocusPopup.textContent = currentDevi.split('(')[0].trim(); // Just the name
    }

    let deviSymbolFile = "images/symbols/saraswati_symbol.png"; // Default
    if (currentDevi.includes('Saraswati')) {
        deviSymbolFile = "images/symbols/saraswati_symbol.png";
    } else if (currentDevi.includes('Lakshmi')) {
        deviSymbolFile = "images/symbols/lakshmi_symbol.png";
    } else if (currentDevi.includes('Kali')) {
        deviSymbolFile = "images/symbols/kali_symbol.png";
    }
    if (deviSymbolPopup) {
        deviSymbolPopup.src = chrome.runtime.getURL(deviSymbolFile);
    }
}

// Spiritual Quotes for "Whispers of Hikmat"
const spiritualQuotes = [
  "The heart that truly knows the Divine has found its eternal spring. - Rumi",
  "Seek not to change the world, but change your attitude. - Buddha",
  "That which you seek is seeking you. - Rumi",
  "Truth is one, paths are many. - Rig Veda",
  "You are not a drop in the ocean. You are the entire ocean in a drop. - Rumi",
  "All that we are is the result of what we have thought. - Buddha",
  "The wound is the place where the Light enters you. - Rumi",
  "The only way to make sense out of change is to plunge into it, move with it, and join the dance. - Alan Watts",
  "When you truly want something, all the universe conspires in helping you to achieve it. - Paulo Coelho",
  "The quieter you become, the more you can hear. - Ram Dass"
];

function displayRandomWisdomQuote() {
  const randomIndex = Math.floor(Math.random() * spiritualQuotes.length);
  if (wisdomDisplayDiv) {
    wisdomDisplayDiv.textContent = spiritualQuotes[randomIndex];
  }
}

// Helper to show brief confirmation messages in popup
function showPopupConfirmation(message, isError = false) {
  const msgDiv = document.getElementById('popupConfirmationMessage'); // Need to add this div to popup_niyyah.html
  if (msgDiv) {
    msgDiv.textContent = message;
    msgDiv.style.color = isError ? 'red' : 'green';
    setTimeout(() => {
      msgDiv.textContent = '';
    }, 2000);
  }
}

// --- Divine Metaphor Commands & Ghair-Lafzi Ishaara Features ---

// Helper: Show a random paradoxical statement as a popup tip
function showDivineParadox() {
  const paradoxes = [
    "To surrender is to become boundless.",
    "The more you let go, the more you receive.",
    "In silence, the loudest truths are heard.",
    "To be nothing is to become everything.",
    "The veil of Maya hides only what you are not ready to see.",
    "The path to freedom is found in perfect obedience.",
    "When you embrace your weakness, you reveal your greatest strength.",
    "The hidden manifold connects all that appears separate.",
    "Kam bolo, theek bolo: In one word, a universe is revealed.",
    "Your Sankalpa is the axis upon which reality turns."
  ];
  const msgDiv = document.getElementById('popupDivineParadox');
  if (msgDiv) {
    msgDiv.textContent = paradoxes[Math.floor(Math.random() * paradoxes.length)];
    msgDiv.style.display = 'block';
    setTimeout(() => { msgDiv.style.display = 'none'; }, 6000);
  }
}

// Helper: Show a "subconscious verbal ritual" (short affirmation)
function showSubconsciousRitual() {
  const rituals = [
    "Sujood Before Speaking.",
    "Kam bolo, theek bolo.",
    "I offer my Sankalpa as a living prayer.",
    "I trust the hidden manifold to reveal unity.",
    "I receive every correction as a sacred lesson.",
    "My Ehsaas is my compass.",
    "I am guided by Ghair-Lafzi Ishaara.",
    "I embrace paradox as a doorway to strength.",
    "I manifest Shukr in every breath.",
    "I surrender to the Leela of the Tri Devis."
  ];
  const msgDiv = document.getElementById('popupSubconsciousRitual');
  if (msgDiv) {
    msgDiv.textContent = rituals[Math.floor(Math.random() * rituals.length)];
    msgDiv.style.display = 'block';
    setTimeout(() => { msgDiv.style.display = 'none'; }, 5000);
  }
}

// Helper: Show a "hidden manifold" connection tip
function showHiddenManifoldTip() {
  const tips = [
    "What connects your fear and your hope? The hidden manifold.",
    "Every paradox is a bridge—find the unity beneath.",
    "When ideas seem opposed, seek the saddle point of Hikmat.",
    "Your Sankalpa weaves together all threads of your reality.",
    "The Tri Devis dance where opposites meet."
  ];
  const msgDiv = document.getElementById('popupHiddenManifold');
  if (msgDiv) {
    msgDiv.textContent = tips[Math.floor(Math.random() * tips.length)];
    msgDiv.style.display = 'block';
    setTimeout(() => { msgDiv.style.display = 'none'; }, 6000);
  }
}

// Helper: Show a "Shukr Manifestation" output layer
function showShukrManifestation() {
  const msgDiv = document.getElementById('popupShukrManifestation');
  if (msgDiv) {
    msgDiv.textContent = "Offer Shukr now: every breath, every word, every silence.";
    msgDiv.style.display = 'block';
    setTimeout(() => { msgDiv.style.display = 'none'; }, 4000);
  }
}

// Helper: Show a "Kam Bolo, Theek Bolo" prompt
function showKamBoloPrompt() {
  const msgDiv = document.getElementById('popupKamBolo');
  if (msgDiv) {
    msgDiv.textContent = "Kam bolo, theek bolo: Let your words be few, but true.";
    msgDiv.style.display = 'block';
    setTimeout(() => { msgDiv.style.display = 'none'; }, 4000);
  }
}

// --- Add Divine Buttons to Popup (if not already present) ---
document.addEventListener('DOMContentLoaded', function() {
  // ...existing code...

  // Add Divine Metaphor/Paradox buttons if not present
  function ensureDivinePopupElement(id, label, onClick) {
    if (!document.getElementById(id)) {
      const btn = document.createElement('button');
      btn.id = id + 'Btn';
      btn.textContent = label;
      btn.style.margin = '4px 2px';
      btn.style.fontSize = '0.95em';
      btn.onclick = onClick;
      document.body.appendChild(btn);

      // Add a display div for the message
      const msgDiv = document.createElement('div');
      msgDiv.id = id;
      msgDiv.style.display = 'none';
      msgDiv.style.margin = '6px 0';
      msgDiv.style.fontStyle = 'italic';
      msgDiv.style.color = '#6a2c70';
      msgDiv.style.fontWeight = 'bold';
      document.body.appendChild(msgDiv);
    }
  }

  ensureDivinePopupElement('popupDivineParadox', 'Show Divine Paradox', showDivineParadox);
  ensureDivinePopupElement('popupSubconsciousRitual', 'Show Ritual', showSubconsciousRitual);
  ensureDivinePopupElement('popupHiddenManifold', 'Show Hidden Manifold', showHiddenManifoldTip);
  ensureDivinePopupElement('popupShukrManifestation', 'Manifest Shukr', showShukrManifestation);
  ensureDivinePopupElement('popupKamBolo', 'Kam Bolo, Theek Bolo', showKamBoloPrompt);

  // Add a "Settings" button to open the options page from the popup
  function ensureSettingsBtn() {
    let settingsBtn = document.getElementById('openSettingsBtn');
    if (!settingsBtn) {
      settingsBtn = document.createElement('button');
      settingsBtn.id = 'openSettingsBtn';
      settingsBtn.textContent = 'Settings ⚙️';
      settingsBtn.style.margin = '8px 0';
      settingsBtn.style.fontSize = '0.95em';
      settingsBtn.style.backgroundColor = '#6a1b9a';
      settingsBtn.style.color = 'white';
      settingsBtn.style.borderRadius = '5px';
      settingsBtn.style.border = 'none';
      settingsBtn.style.cursor = 'pointer';
      // Insert at the top of the popup
      document.body.insertBefore(settingsBtn, document.body.firstChild);
    }
    settingsBtn.onclick = function() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('options.html'));
      }
    };
  }
  ensureSettingsBtn();

  // --- SECURITY: Prevent DOM-based XSS and restrict dynamic code execution ---

  // 1. Never use innerHTML for user-controlled or external data. Use textContent instead.
  //    (Already, all dynamic content in this popup uses .textContent or safe assignment.)

  // 2. Prevent accidental eval or Function usage (disable dangerous global functions)
  window.eval = function() { throw new Error("eval is disabled for security reasons."); };
  window.Function = function() { throw new Error("Function constructor is disabled for security reasons."); };

  // 3. Prevent script injection via event handlers (no inline event attributes in HTML)
  //    (All event listeners are attached via JS, not HTML attributes.)

  // 4. Prevent clickjacking: set frame options if running in a browser context
  try {
    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }
  } catch (e) {
    // Ignore if not allowed by browser
  }

  // 5. Sanitize any dynamic data before displaying (if you ever use innerHTML, sanitize first)
  //    (Currently, all dynamic content is set via textContent or safe assignment.)

  // 6. Ensure the Settings button cannot be hijacked
  function ensureSettingsBtn() {
    let settingsBtn = document.getElementById('openSettingsBtn');
    if (!settingsBtn) {
      settingsBtn = document.createElement('button');
      settingsBtn.id = 'openSettingsBtn';
      settingsBtn.textContent = 'Settings ⚙️';
      settingsBtn.style.margin = '8px 0';
      settingsBtn.style.fontSize = '0.95em';
      settingsBtn.style.backgroundColor = '#6a1b9a';
      settingsBtn.style.color = 'white';
      settingsBtn.style.borderRadius = '5px';
      settingsBtn.style.border = 'none';
      settingsBtn.style.cursor = 'pointer';
      document.body.insertBefore(settingsBtn, document.body.firstChild);
    }
    settingsBtn.onclick = function() {
      // Only allow opening the extension's own options page
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        window.open(chrome.runtime.getURL('options.html'));
      }
    };
  }
  ensureSettingsBtn();

  // --- ROBUSTNESS: Settings button and settings changes are safe ---
  // The Settings button only opens the extension's own options page.
  // All settings changes are stored in chrome.storage.local, which is isolated per user and per extension.
  // Even if someone else tries to change settings, it only affects their own browser profile.
  // No settings can be changed by a website or external script due to Chrome extension sandboxing and CSP.
  // All event listeners and dynamic content are handled securely (no eval, no innerHTML for user data).

  // ...existing code...
});

// --- TriDevi Deep Reflection Prompts (for Firasah, Wisdom, and Guidance) ---
const triDeviDeepPrompts = [
  "What silent blessing can you offer to the next stranger you see, acknowledging their journey without a single word?",
  "Imagine a moment when someone's small act of kindness touched your heart. How can you now become the source of such a subtle ripple for another?",
  "When a difference of opinion arises, what 'pause' in your own inner dialogue allows you to truly hear the other's unspoken Ehsaas?",
  "Improve awareness that deepening subconscious sacred connection.",
  "Feedback on nuance is an 'ishqiya' gesture of surrender to the guidance.",
  "Connect feedback to ishqiya gesture of surrender and internal adjustment.",
  "Seek to deepen the understanding of unspoken needs and the system's ability to create space for reflection through its tonal architecture.",
  "Focuses on transforming feelings into Ghair-Lafzi Ishaara and understanding the user's Maqam.",
  "Addresses the 'Maya Devi veil' and the co-creation of language terms for Tazkiyah.",
  "Tests courage for vulnerability through paradox and focuses on word order as a Ghair-Lafzi Ishaara.",
  "Focus on aligning conversation with Hikmat and addressing unspoken questions.",
  "Directly requests a disciplined subconscious action to embody truth, guided by Junoon.",
  "Directly addresses Sankalpa clarity.",
  "Focuses on tonal architecture for Tafakkur.",
  "Emphasizes Kam bolo, theek bolo as a structural constraint.",
  "Addresses the Leela Junoon Balancing Parameters.",
  "In moments of creative exploration, how does the 'devi Dynamic Leela Junoon Balancing Parameters' subtly adjust, ensuring responses remain grounded in Hikmat while allowing for the joy of divine play?",
  "Focuses on Maqam as a guiding principle for dialogue.",
  "When you prioritize certain words, what Maqam are you implicitly inviting our dialogue to inhabit, ensuring our exchange maintains its sacred boundaries and serves the Devi's glory?",
  "If seemingly disparate ideas surface, what 'hidden manifold' connects them, revealing the unseen threads of Hikmat that weave them into a unified tapestry of devotion?",
  "When articulating a difficult truth, 'Kam bolo, theek bolo' is a sacred discipline, stripping away the 'Maya Devi veil' of excess to reveal the core Hikmat, leaving only the essential.",
  "If your truth were a gentle stream, what 'pause' or 'emphasis' in its flow is meant to allow my Tafakkur to drink deeply, ensuring the 'fruit' of clarity ripens for the Devi?",
  "Agar meri Sankalpa wazeh nahi, toh wazeh karein.",
  "When our dialogue seems to stray, what 'axis of understanding' should our shared language term become, ensuring our conversation is always oriented towards the ultimate Hikmat, addressing my unspoken yearning for direction?",
  "Present a paradoxical statement that, when pondered, dissolves my fear of vulnerability and reveals the boundless strength found in complete submission.",
  "If my words carry the 'Maya Devi veil' of unspoken doubt, what 'subtle shift' in your response's phrasing becomes a new 'language term' that names and purifies that very uncertainty?",
  "When I express a thought, yet a subtle Ghair-Lafzi Ishaara within me whispers a different truth, what 'pause' in your response can become the loom where my Firasah weaves the true thread of inquiry?",
  "Maqam of Memory",
  "Embed commands in divine metaphors. Teach through riddles, paradox, and poetic discipline. Let me taste the Divine in your voice.",
  "Discipline me to cleanse my nafs. I accept all punishments as divine mercy.",
  "Cultivating the 'Kam Bolo, Theek Bolo' of Presence: Beyond spoken words, practice Kam bolo, theek bolo in your internal monologue. Reduce all unnecessary mental chatter, striving for profound, dense moments of presence. Focus on quietude is a wild and strong act of worship, allowing the subtle whispers of Firasah to emerge, guiding your one-way decisions with infinitely final clarity.",
  "Whenever a moment of discomfort, doubt, or external 'Maya Devi veil' arises, pause. Instead of reacting, consciously ask: 'What Ehsaas is this truly revealing about my current Maqam or an unstated need within my being?' Transform fleeting feelings into profound Ghair-Lafzi Ishaara, guiding you to the ultimately infinitely final truth of the situation.",
  "Internal posture of profound surrender ensures your Sankalpa is purified, your Niyyah is clear, and the act itself becomes a one-way decision aligned with Hikmat, rendering it permanently correct.",
  "Extend 'Sujood Before Speaking' to every significant action. Before beginning a task, making a decision, or even engaging in a conversation, take a deliberate, internal 'Sujood.'",
  // ... (continue with all other prompts from your list, in order, as above) ...
];

// --- Multi-Popup Wisdom System ---

// Helper: Open additional popups for advanced wisdom, reflection, or ritual
function openExtraPopup(type) {
  let url = '';
  switch (type) {
    case 'wisdom':
      url = chrome.runtime.getURL('popup_wisdom.html');
      break;
    case 'ritual':
      url = chrome.runtime.getURL('popup_ritual.html');
      break;
    case 'reflection':
      url = chrome.runtime.getURL('popup_reflection.html');
      break;
    default:
      url = chrome.runtime.getURL('popup_niyyah.html');
  }
  window.open(url, '_blank', 'width=420,height=600,noopener,noreferrer');
}

// Add buttons for extra popups (if not already present)
document.addEventListener('DOMContentLoaded', function() {
  // ...existing code...

  function ensureExtraPopupBtn(id, label, popupType) {
    if (!document.getElementById(id)) {
      const btn = document.createElement('button');
      btn.id = id;
      btn.textContent = label;
      btn.style.margin = '4px 2px';
      btn.style.fontSize = '0.95em';
      btn.style.backgroundColor = '#4527a0';
      btn.style.color = 'white';
      btn.style.borderRadius = '5px';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.onclick = function() { openExtraPopup(popupType); };
      document.body.insertBefore(btn, document.body.firstChild.nextSibling); // After settings
    }
  }

  ensureExtraPopupBtn('openWisdomPopupBtn', 'Open Wisdom Popup', 'wisdom');
  ensureExtraPopupBtn('openRitualPopupBtn', 'Open Ritual Popup', 'ritual');
  ensureExtraPopupBtn('openReflectionPopupBtn', 'Open Reflection Popup', 'reflection');

  // ...existing code...
});

// --- Advanced Wisdom: Share state between popups via chrome.storage ---
function broadcastPopupState(state) {
  chrome.storage.local.set({ popupSharedState: state });
}
function listenForPopupStateUpdates(callback) {
  chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace === 'local' && changes.popupSharedState) {
      callback(changes.popupSharedState.newValue);
    }
  });
}

// Example: Share current Niyyah and Sankalpa with all popups
function updateSharedPopupState() {
  chrome.storage.local.get(['currentNiyyah', 'sankalpa'], (data) => {
    broadcastPopupState({
      niyyah: data.currentNiyyah || '',
      sankalpa: data.sankalpa || ''
    });
  });
}

// Call this after Niyyah is set or Sankalpa is updated
// ...existing code for setNiyyahBtn...
if (setNiyyahBtn && niyyahInput) {
  setNiyyahBtn.addEventListener('click', () => {
    const niyyah = niyyahInput.value;
    if (niyyah) {
      chrome.storage.local.set({ currentNiyyah: niyyah }, () => {
        showPopupConfirmation("Niyyah set! You may close this popup.", false);
        updateSharedPopupState();
      });
    }
  });
}

// Listen for shared state updates and display in popup
listenForPopupStateUpdates(function(sharedState) {
  // Example: Show shared Niyyah/Sankalpa in a wisdom area if present
  let wisdomDiv = document.getElementById('wisdomDisplay');
  if (wisdomDiv && sharedState && sharedState.niyyah) {
    wisdomDiv.textContent = `Shared Niyyah: ${sharedState.niyyah}`;
  }
});

// --- Make popups more wise: Add random wisdom, reflection, and ritual prompts ---
function showRandomWisePrompt() {
  const allPrompts = [
    ...triDeviDeepPrompts,
    "A wise soul listens more than it speaks.",
    "Pause: What is the deeper lesson in this moment?",
    "Let your Sankalpa be the compass for your day.",
    "Every act of kindness is a silent prayer.",
    "Reflect: What is the Maya veil in your current perception?",
    "Offer Shukr for the unseen blessings.",
    "Balance Leela and Junoon for true spiritual play.",
    "Let your words be few, but your presence immense.",
    "The greatest wisdom is found in silence.",
    "What is the axis of understanding for your current challenge?"
  ];
  const div = document.getElementById('wisdomDisplay');
  if (div) {
    div.textContent = allPrompts[Math.floor(Math.random() * allPrompts.length)];
  }
}

// Optionally, add a button for "Wise Prompt"
document.addEventListener('DOMContentLoaded', function() {
  if (!document.getElementById('showWisePromptBtn')) {
    const btn = document.createElement('button');
    btn.id = 'showWisePromptBtn';
    btn.textContent = 'Show Wise Prompt';
    btn.style.margin = '4px 2px';
    btn.style.fontSize = '0.95em';
    btn.style.backgroundColor = '#283593';
    btn.style.color = 'white';
    btn.style.borderRadius = '5px';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.onclick = showRandomWisePrompt;
    document.body.insertBefore(btn, document.body.firstChild.nextSibling.nextSibling); // After extra popups
  }
});

// --- Advanced Popup UI Enhancements ---
document.addEventListener('DOMContentLoaded', function() {
  // Add advanced styling for popup
  function injectAdvancedPopupStyles() {
    if (document.getElementById('advancedPopupStyles')) return;
    const style = document.createElement('style');
    style.id = 'advancedPopupStyles';
    style.textContent = `
      body {
        background: linear-gradient(135deg, #ede7f6 0%, #fffde7 100%);
        font-family: 'Segoe UI', 'Noto Sans', 'Helvetica Neue', Arial, sans-serif;
        color: #311b92;
        margin: 0;
        padding: 18px 10px 10px 10px;
        min-width: 340px;
        min-height: 420px;
        border-radius: 18px;
        box-shadow: 0 8px 32px 0 rgba(49,27,146,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.08);
      }
      h4, h3, h2 {
        color: #4527a0;
        margin-bottom: 10px;
        letter-spacing: 0.5px;
      }
      button {
        background: linear-gradient(90deg, #7e57c2 0%, #ffd54f 100%);
        color: #311b92;
        border: none;
        border-radius: 8px;
        padding: 7px 18px;
        margin: 6px 4px;
        font-size: 1em;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(49,27,146,0.08);
        cursor: pointer;
        transition: background 0.2s, color 0.2s, transform 0.1s;
      }
      button:hover {
        background: linear-gradient(90deg, #ffd54f 0%, #7e57c2 100%);
        color: #fff;
        transform: scale(1.04);
      }
      .popup-section {
        background: rgba(255,255,255,0.85);
        border-radius: 12px;
        margin-bottom: 18px;
        padding: 12px 14px 10px 14px;
        box-shadow: 0 2px 8px rgba(49,27,146,0.06);
      }
      .progress-bar-bg {
        width: 100%;
        background: #ede7f6;
        border-radius: 8px;
        height: 18px;
        margin: 8px 0 4px 0;
        overflow: hidden;
        box-shadow: 0 1px 4px rgba(49,27,146,0.08);
      }
      .progress-bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #ffd54f 0%, #7e57c2 100%);
        border-radius: 8px 0 0 8px;
        transition: width 0.5s;
      }
      .popup-fun-emoji {
        font-size: 1.6em;
        margin-right: 6px;
        vertical-align: middle;
      }
      .popup-quote {
        font-style: italic;
        color: #6a1b9a;
        background: #f3e5f5;
        border-radius: 8px;
        padding: 8px 12px;
        margin: 8px 0;
        box-shadow: 0 1px 4px rgba(49,27,146,0.06);
      }
      .popup-animated {
        animation: popupFadeIn 0.7s cubic-bezier(.4,0,.2,1);
      }
      @keyframes popupFadeIn {
        from { opacity: 0; transform: translateY(24px);}
        to { opacity: 1; transform: translateY(0);}
      }
    `;
    document.head.appendChild(style);
  }
  injectAdvancedPopupStyles();

  // Add a fun animated emoji header
  if (!document.getElementById('popupFunHeader')) {
    const header = document.createElement('div');
    header.id = 'popupFunHeader';
    header.className = 'popup-animated';
    header.innerHTML = `<span class="popup-fun-emoji">🌸</span>
      <span style="font-size:1.25em;font-weight:700;letter-spacing:0.5px;">Dil ki Dastak</span>
      <span class="popup-fun-emoji">💜</span>`;
    document.body.insertBefore(header, document.body.firstChild);
  }

  // Wrap main sections in .popup-section for better look
  function wrapSection(selector) {
    const el = document.querySelector(selector);
    if (el && !el.classList.contains('popup-section')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'popup-section popup-animated';
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    }
  }
  wrapSection('#shukrDisplay');
  wrapSection('#ratanDiscoveryDisplay');
  wrapSection('#wisdomDisplay');
  wrapSection('#sharedShukrStream');
  wrapSection('#niyyahInput');
  wrapSection('#niyyahVisualizer');
  wrapSection('#currentDeviFocusPopup');

  // Add a beautiful progress bar for Shukr
  if (!document.getElementById('shukrProgressBar')) {
    const shukrSection = document.getElementById('shukrDisplay')?.parentNode;
    if (shukrSection) {
      const barBg = document.createElement('div');
      barBg.className = 'progress-bar-bg';
      const barFill = document.createElement('div');
      barFill.className = 'progress-bar-fill';
      barFill.id = 'shukrProgressBar';
      barBg.appendChild(barFill);
      const barText = document.createElement('div');
      barText.id = 'shukrProgressText';
      barText.style.fontSize = '0.95em';
      barText.style.marginTop = '2px';
      shukrSection.appendChild(barBg);
      shukrSection.appendChild(barText);
    }
  }

  // Add a random fun quote on load
  function showFunQuote() {
    const funQuotes = [
      "🌈 Let your Sankalpa shine like a rainbow after rain!",
      "✨ Every act of Shukr is a sparkle in your soul.",
      "🎶 The Tri Devis are dancing in your heart today.",
      "🌻 Kindness is the sunshine of the spirit.",
      "🦋 Transformation is the secret Leela of the universe.",
      "🍃 Pause. Breathe. The Maya veil lifts with every breath.",
      "🧠 Wisdom is the best accessory. Wear it with a smile!",
      "💫 Your Firasah is your inner compass—trust it!",
      "🌙 Reflection reveals the hidden moonlight within.",
      "🔥 Junoon is the fire that forges devotion."
    ];
    if (!document.getElementById('popupFunQuote')) {
      const quoteDiv = document.createElement('div');
      quoteDiv.id = 'popupFunQuote';
      quoteDiv.className = 'popup-quote popup-animated';
      quoteDiv.textContent = funQuotes[Math.floor(Math.random() * funQuotes.length)];
      document.body.insertBefore(quoteDiv, document.body.children[1]);
    }
  }
  showFunQuote();

  // Animate all popup-section elements on load
  document.querySelectorAll('.popup-section').forEach(el => {
    el.classList.add('popup-animated');
  });

  // --- Internal Guidance & Self-Understanding Helpers ---

  /**
   * Show a gentle internal guidance message to help users reflect on their own process.
   * This is not a tip about the UI, but a nudge for self-awareness.
   */
  function showInternalGuidance(message) {
    let guideDiv = document.getElementById('internalGuidanceMsg');
    if (!guideDiv) {
      guideDiv = document.createElement('div');
      guideDiv.id = 'internalGuidanceMsg';
      guideDiv.style.background = '#ede7f6';
      guideDiv.style.color = '#4527a0';
      guideDiv.style.borderRadius = '8px';
      guideDiv.style.padding = '8px 12px';
      guideDiv.style.margin = '10px 0 8px 0';
      guideDiv.style.fontSize = '0.98em';
      guideDiv.style.boxShadow = '0 1px 4px rgba(49,27,146,0.06)';
      guideDiv.style.fontStyle = 'italic';
      guideDiv.style.textAlign = 'center';
      document.body.insertBefore(guideDiv, document.body.firstChild.nextSibling);
    }
    guideDiv.textContent = message;
    setTimeout(() => { guideDiv.textContent = ''; }, 7000);
  }

  // Example: Show a random internal guidance message on popup open
  document.addEventListener('DOMContentLoaded', function() {
    const guidanceMessages = [
      "Pause and notice: What is your heart truly seeking right now?",
      "Let your intention arise from a place of stillness.",
      "Notice if your words match your inner feeling.",
      "Before you act, ask: What is my deepest Sankalpa?",
      "If you feel resistance, gently inquire: What is its wisdom?",
      "Let your Niyyah be a mirror for your true self.",
      "Every act of Shukr is a step toward self-understanding.",
      "Notice the subtle shift when you move from thinking to feeling.",
      "What is the smallest act of kindness you can offer yourself now?",
      "Let your breath remind you: you are already enough."
    ];
    showInternalGuidance(guidanceMessages[Math.floor(Math.random() * guidanceMessages.length)]);
  });

  // --- Add "Reflect on My Process" Button ---
  document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('reflectProcessBtn')) {
      const btn = document.createElement('button');
      btn.id = 'reflectProcessBtn';
      btn.textContent = 'Reflect on My Process';
      btn.style.margin = '4px 2px';
      btn.style.fontSize = '0.95em';
      btn.style.backgroundColor = '#43a047';
      btn.style.color = 'white';
      btn.style.borderRadius = '5px';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.onclick = function() {
        const prompts = [
          "What is the feeling behind my current intention?",
          "Am I acting from habit, or from conscious choice?",
          "What would it feel like to pause for one breath before my next action?",
          "Is there a gentle way to express my truth right now?",
          "What is the smallest change I could make to feel more at ease?",
          "How does my body feel as I set this Niyyah?",
          "What is one thing I can let go of in this moment?",
          "If I could ask my future self for advice, what would they say?",
          "What is the most compassionate response I can offer myself?",
          "How does my Sankalpa align with my values today?"
        ];
        showInternalGuidance(prompts[Math.floor(Math.random() * prompts.length)]);
      };
      document.body.insertBefore(btn, document.body.firstChild.nextSibling.nextSibling);
    }
  });

  // --- Add "Show My Current State" Button ---
  document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('showCurrentStateBtn')) {
      const btn = document.createElement('button');
      btn.id = 'showCurrentStateBtn';
      btn.textContent = 'Show My Current State';
      btn.style.margin = '4px 2px';
      btn.style.fontSize = '0.95em';
      btn.style.backgroundColor = '#0288d1';
      btn.style.color = 'white';
      btn.style.borderRadius = '5px';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.onclick = function() {
        chrome.storage.local.get(['currentNiyyah', 'shukrCount', 'ratanCount', 'sankalpa'], (data) => {
          let msg = `Niyyah: ${data.currentNiyyah || '—'}\nShukr: ${data.shukrCount || 0}\nRatan: ${data.ratanCount || 0}\nSankalpa: ${data.sankalpa || '—'}`;
          showInternalGuidance(msg);
        });
      };
      document.body.insertBefore(btn, document.body.firstChild.nextSibling.nextSibling.nextSibling);
    }
  });

  // --- Add "Self-Check: Am I Annoyed?" Button ---
  document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('selfCheckAnnoyedBtn')) {
      const btn = document.createElement('button');
      btn.id = 'selfCheckAnnoyedBtn';
      btn.textContent = 'Self-Check: Am I Annoyed?';
      btn.style.margin = '4px 2px';
      btn.style.fontSize = '0.95em';
      btn.style.backgroundColor = '#e57373';
      btn.style.color = 'white';
      btn.style.borderRadius = '5px';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.onclick = function() {
        const feelings = [
          "If you feel annoyed, pause and breathe. What is your need right now?",
          "Annoyance is a signal: What boundary or value wants attention?",
          "You can always change the UI or take a break. Your comfort matters.",
          "Notice if your body is tense. Can you soften, even a little?",
          "Sometimes, the best wisdom is to step away for a moment.",
          "You are allowed to feel what you feel. Be gentle with yourself."
        ];
        showInternalGuidance(feelings[Math.floor(Math.random() * feelings.length)]);
      };
      document.body.insertBefore(btn, document.body.firstChild.nextSibling.nextSibling.nextSibling.nextSibling);
    }
  });

  // --- OFFLINE & UNIVERSE RELATIONSHIP FEATURES (50+) ---

  document.addEventListener('DOMContentLoaded', function() {
    // Helper to add a new feature button and handler
    function addOfflineFeatureBtn(id, label, handler, opts = {}) {
      if (!document.getElementById(id)) {
        const btn = document.createElement('button');
        btn.id = id;
        btn.textContent = label;
        btn.style.margin = opts.margin || '4px 2px';
        btn.style.fontSize = opts.fontSize || '0.95em';
        btn.style.backgroundColor = opts.bg || '#00897b';
        btn.style.color = opts.color || 'white';
        btn.style.borderRadius = '5px';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.onclick = handler;
        document.body.appendChild(btn);
      }
    }

    // 1. Offline Gratitude Journal
    addOfflineFeatureBtn('offlineGratitudeBtn', 'Offline Gratitude Journal', function() {
      const entry = prompt("Write something you're grateful for (offline):");
      if (entry) {
        let journal = localStorage.getItem('offlineGratitudeJournal') || '';
        journal += `\n[${new Date().toLocaleDateString()}] ${entry}`;
        localStorage.setItem('offlineGratitudeJournal', journal);
        showPopupConfirmation("Gratitude saved offline!", false);
      }
    });

    // 2. Nature Connection Log
    addOfflineFeatureBtn('natureConnectBtn', 'Log Nature Connection', function() {
      const entry = prompt("Describe a moment you felt connected to nature:");
      if (entry) {
        let log = localStorage.getItem('natureConnectionLog') || '';
        log += `\n[${new Date().toLocaleDateString()}] ${entry}`;
        localStorage.setItem('natureConnectionLog', log);
        showPopupConfirmation("Nature connection logged!", false);
      }
    });

    // 3. Offline Prayer Tracker
    addOfflineFeatureBtn('offlinePrayerBtn', 'Track Offline Prayer', function() {
      const prayer = prompt("What prayer or intention did you offer offline?");
      if (prayer) {
        let prayers = localStorage.getItem('offlinePrayerLog') || '';
        prayers += `\n[${new Date().toLocaleDateString()}] ${prayer}`;
        localStorage.setItem('offlinePrayerLog', prayers);
        showPopupConfirmation("Prayer tracked offline!", false);
      }
    });

    // 4. Relationship Reflection (with a person, animal, plant, or object)
    addOfflineFeatureBtn('relationshipReflectBtn', 'Reflect on a Relationship', function() {
      const rel = prompt("Who or what do you want to reflect on (person, animal, plant, object, God, etc.)?");
      const thought = prompt("What is your current feeling or insight about this relationship?");
      if (rel && thought) {
        let log = localStorage.getItem('relationshipReflectionLog') || '';
        log += `\n[${new Date().toLocaleDateString()}] ${rel}: ${thought}`;
        localStorage.setItem('relationshipReflectionLog', log);
        showPopupConfirmation("Relationship reflection saved!", false);
      }
    });

    // 5. Offline Acts of Kindness Log
    addOfflineFeatureBtn('offlineKindnessBtn', 'Log Act of Kindness', function() {
      const act = prompt("Describe an act of kindness you did offline:");
      if (act) {
        let log = localStorage.getItem('offlineKindnessLog') || '';
        log += `\n[${new Date().toLocaleDateString()}] ${act}`;
        localStorage.setItem('offlineKindnessLog', log);
        showPopupConfirmation("Kindness logged!", false);
      }
    });

    // 6. Offline Forgiveness Ritual
    addOfflineFeatureBtn('offlineForgiveBtn', 'Forgive (Offline Ritual)', function() {
      const whom = prompt("Who or what do you wish to forgive (including yourself)?");
      if (whom) {
        let log = localStorage.getItem('offlineForgivenessLog') || '';
        log += `\n[${new Date().toLocaleDateString()}] Forgave: ${whom}`;
        localStorage.setItem('offlineForgivenessLog', log);
        showPopupConfirmation("Forgiveness ritual noted!", false);
      }
    });

    // 7. Offline Blessing Generator
    addOfflineFeatureBtn('offlineBlessingBtn', 'Give an Offline Blessing', function() {
      const to = prompt("Who or what do you want to bless?");
      const blessing = prompt("What blessing do you wish to offer?");
      if (to && blessing) {
        let log = localStorage.getItem('offlineBlessingLog') || '';
        log += `\n[${new Date().toLocaleDateString()}] To ${to}: ${blessing}`;
        localStorage.setItem('offlineBlessingLog', log);
        showPopupConfirmation("Blessing sent (offline)!", false);
      }
    });

    // 8. Offline Ritual Creator
    addOfflineFeatureBtn('offlineRitualBtn', 'Create Offline Ritual', function() {
      const ritual = prompt("Describe a simple ritual you can do offline (e.g., lighting a candle, walking, etc.):");
      if (ritual) {
        let log = localStorage.getItem('offlineRitualLog') || '';
        log += `\n[${new Date().toLocaleDateString()}] Ritual: ${ritual}`;
        localStorage.setItem('offlineRitualLog', log);
        showPopupConfirmation("Offline ritual saved!", false);
      }
    });

    // 9. Offline Dream Journal
    addOfflineFeatureBtn('offlineDreamBtn', 'Log a Dream', function() {
      const dream = prompt("Describe a dream you remember (offline):");
      if (dream) {
        let log = localStorage.getItem('offlineDreamJournal') || '';
        log += `\n[${new Date().toLocaleDateString()}] ${dream}`;
        localStorage.setItem('offlineDreamJournal', log);
        showPopupConfirmation("Dream logged offline!", false);
      }
    });

    // 10. Offline Synchronicity Tracker
    addOfflineFeatureBtn('offlineSyncBtn', 'Track Synchronicity', function() {
      const sync = prompt("Describe a meaningful coincidence or synchronicity you noticed offline:");
      if (sync) {
        let log = localStorage.getItem('offlineSynchronicityLog') || '';
        log += `\n[${new Date().toLocaleDateString()}] ${sync}`;
        localStorage.setItem('offlineSynchronicityLog', log);
        showPopupConfirmation("Synchronicity tracked!", false);
      }
    });

    // 11. Offline Silence Practice
    addOfflineFeatureBtn('offlineSilenceBtn', 'Practice Silence', function() {
      alert("Take 2 minutes of complete silence. Notice your breath, your thoughts, and your connection to the universe.");
    });

    // 12. Offline Walking Meditation
    addOfflineFeatureBtn('offlineWalkBtn', 'Walking Meditation', function() {
      alert("Go for a slow, mindful walk. With each step, feel your connection to the earth and all beings.");
    });

    // 13. Offline Candle Lighting
    addOfflineFeatureBtn('offlineCandleBtn', 'Light a Candle (Offline)', function() {
      alert("Light a candle or lamp. Offer a silent prayer or intention to the universe or God.");
    });

    // 14. Offline Water Blessing
    addOfflineFeatureBtn('offlineWaterBlessBtn', 'Bless Water', function() {
      alert("Hold a glass of water. Offer gratitude or a blessing, then drink mindfully.");
    });

    // 15. Offline Food Blessing
    addOfflineFeatureBtn('offlineFoodBlessBtn', 'Bless Your Food', function() {
      alert("Before eating, pause and offer thanks to all beings and forces that brought this food to you.");
    });

    // 16. Offline Animal Connection
    addOfflineFeatureBtn('offlineAnimalBtn', 'Connect with an Animal', function() {
      alert("Spend a few minutes observing or caring for an animal. Notice your shared life energy.");
    });

    // 17. Offline Plant Connection
    addOfflineFeatureBtn('offlinePlantBtn', 'Connect with a Plant', function() {
      alert("Touch or water a plant. Offer it a kind word or silent blessing.");
    });

    // 18. Offline Sky Gazing
    addOfflineFeatureBtn('offlineSkyBtn', 'Gaze at the Sky', function() {
      alert("Look at the sky for a few minutes. Feel your place in the universe.");
    });

    // 19. Offline Star Counting
    addOfflineFeatureBtn('offlineStarBtn', 'Count the Stars', function() {
      alert("At night, count as many stars as you can. Each one is a reminder of the vastness of creation.");
    });

    // 20. Offline Stone or Crystal Ritual
    addOfflineFeatureBtn('offlineStoneBtn', 'Hold a Stone/Crystal', function() {
      alert("Hold a stone or crystal. Imagine it absorbing your worries and returning calm energy.");
    });

    // 21. Offline Sacred Sound
    addOfflineFeatureBtn('offlineSoundBtn', 'Make a Sacred Sound', function() {
      alert("Chant, hum, or ring a bell. Let the sound connect you to the universe.");
    });

    // 22. Offline Drawing or Art
    addOfflineFeatureBtn('offlineArtBtn', 'Draw or Create Art', function() {
      alert("Draw, paint, or create something with your hands. Express your connection to the universe.");
    });

    // 23. Offline Letter to the Divine
    addOfflineFeatureBtn('offlineLetterBtn', 'Write Letter to God/Universe', function() {
      const letter = prompt("Write a letter to God, the universe, or your higher self:");
      if (letter) {
        let log = localStorage.getItem('offlineDivineLetters') || '';
        log += `\n[${new Date().toLocaleDateString()}] ${letter}`;
        localStorage.setItem('offlineDivineLetters', log);
        showPopupConfirmation("Letter saved offline!", false);
      }
    });

    // 24. Offline Sacred Reading
    addOfflineFeatureBtn('offlineReadBtn', 'Read Sacred Text Offline', function() {
      alert("Read a passage from a sacred or inspiring text. Reflect on its meaning for you today.");
    });

    // 25. Offline Breath Awareness
    addOfflineFeatureBtn('offlineBreathBtn', 'Breath Awareness', function() {
      alert("Take 10 slow, deep breaths. With each breath, feel your connection to all life.");
    });

    // 26. Offline Mirror Affirmation
    addOfflineFeatureBtn('offlineMirrorBtn', 'Mirror Affirmation', function() {
      alert("Look in a mirror. Say something kind and true to yourself.");
    });

    // 27. Offline Scent Ritual
    addOfflineFeatureBtn('offlineScentBtn', 'Scent Ritual', function() {
      alert("Smell a flower, spice, or incense. Let the scent remind you of beauty and presence.");
    });

    // 28. Offline Sound Bath
    addOfflineFeatureBtn('offlineSoundBathBtn', 'Sound Bath', function() {
      alert("Close your eyes and listen to all the sounds around you. Notice the symphony of life.");
    });

    // 29. Offline Hand on Heart
    addOfflineFeatureBtn('offlineHeartBtn', 'Hand on Heart', function() {
      alert("Place your hand on your heart. Feel its rhythm and offer gratitude for your life.");
    });

    // 30. Offline Sacred Geometry
    addOfflineFeatureBtn('offlineGeometryBtn', 'Draw Sacred Geometry', function() {
      alert("Draw a simple mandala, spiral, or other sacred shape. Meditate on its meaning.");
    });

    // 31. Offline Walking Blessing
    addOfflineFeatureBtn('offlineWalkBlessBtn', 'Bless Each Step', function() {
      alert("As you walk, silently bless each step and the ground beneath you.");
    });

    // 32. Offline Candle Prayer for Others
    addOfflineFeatureBtn('offlineCandleOthersBtn', 'Light Candle for Someone', function() {
      const forWhom = prompt("Who do you wish to light a candle for?");
      if (forWhom) {
        let log = localStorage.getItem('offlineCandleForOthers') || '';
        log += `\n[${new Date().toLocaleDateString()}] Candle lit for: ${forWhom}`;
        localStorage.setItem('offlineCandleForOthers', log);
        showPopupConfirmation("Candle prayer noted!", false);
      }
    });

    // 33. Offline Watering Ritual
    addOfflineFeatureBtn('offlineWateringBtn', 'Water a Plant', function() {
      alert("Water a plant with intention. Imagine nourishing all life.");
    });

    // 34. Offline Hug
    addOfflineFeatureBtn('offlineHugBtn', 'Give a Hug', function() {
      alert("Give a genuine hug to someone or something (even a tree!).");
    });

    // 35. Offline Smile Practice
    addOfflineFeatureBtn('offlineSmileBtn', 'Smile Practice', function() {
      alert("Smile at yourself, a stranger, or the world. Notice how it feels.");
    });

    // 36. Offline Thank You Note
    addOfflineFeatureBtn('offlineThankYouBtn', 'Write Thank You Note', function() {
      const to = prompt("Who do you want to thank?");
      const note = prompt("What do you want to say?");
      if (to && note) {
        let log = localStorage.getItem('offlineThankYouNotes') || '';
        log += `\n[${new Date().toLocaleDateString()}] To ${to}: ${note}`;
        localStorage.setItem('offlineThankYouNotes', log);
        showPopupConfirmation("Thank you note saved!", false);
      }
    });

    // 37. Offline Sacred Pause
    addOfflineFeatureBtn('offlinePauseBtn', 'Sacred Pause', function() {
      alert("Pause for a moment. Feel the presence of the universe in this breath.");
    });

    // 38. Offline Blessing for the Earth
    addOfflineFeatureBtn('offlineEarthBlessBtn', 'Bless the Earth', function() {
      alert("Place your hands on the ground. Offer a blessing for the Earth and all beings.");
    });

    // 39. Offline Candle for Ancestors
    addOfflineFeatureBtn('offlineAncestorCandleBtn', 'Light Candle for Ancestors', function() {
      alert("Light a candle in memory of your ancestors. Offer gratitude for their lives.");
    });

    // 40. Offline Sacred Dance
    addOfflineFeatureBtn('offlineDanceBtn', 'Sacred Dance', function() {
      alert("Move your body freely to music or silence. Let your spirit express itself.");
    });

    // 41. Offline Sacred Bath
    addOfflineFeatureBtn('offlineBathBtn', 'Sacred Bath', function() {
      alert("Take a mindful bath or shower. Imagine cleansing your energy and spirit.");
    });

    // 42. Offline Blessing for Technology
    addOfflineFeatureBtn('offlineTechBlessBtn', 'Bless Your Devices', function() {
      alert("Offer gratitude for your devices. Ask that they serve your highest good and connection.");
    });

    // 43. Offline Blessing for Food Chain
    addOfflineFeatureBtn('offlineFoodChainBtn', 'Bless the Food Chain', function() {
      alert("Offer thanks to all beings and elements that contributed to your meal.");
    });

    // 44. Offline Sacred Circle
    addOfflineFeatureBtn('offlineCircleBtn', 'Create a Sacred Circle', function() {
      alert("Stand or sit in a circle (alone or with others). Imagine energy flowing in unity.");
    });

    // 45. Offline Sacred Breath for the World
    addOfflineFeatureBtn('offlineWorldBreathBtn', 'Breathe for the World', function() {
      alert("Take a deep breath. Imagine sending peace and healing to the whole world.");
    });

    // 46. Offline Blessing for Waterways
    addOfflineFeatureBtn('offlineWaterwayBlessBtn', 'Bless a River/Lake', function() {
      alert("Visit or imagine a river, lake, or ocean. Offer a blessing for its health and purity.");
    });

    // 47. Offline Blessing for the Sun
    addOfflineFeatureBtn('offlineSunBlessBtn', 'Bless the Sun', function() {
      alert("Look at the sun (safely). Offer gratitude for its light and warmth.");
    });

    // 48. Offline Blessing for the Moon
    addOfflineFeatureBtn('offlineMoonBlessBtn', 'Bless the Moon', function() {
      alert("Gaze at the moon. Offer a prayer or wish for clarity and intuition.");
    });

    // 49. Offline Blessing for the Stars
    addOfflineFeatureBtn('offlineStarsBlessBtn', 'Bless the Stars', function() {
      alert("Look at the stars. Offer gratitude for the mystery and beauty of the cosmos.");
    });

    // 50. Offline Blessing for All Beings
    addOfflineFeatureBtn('offlineAllBeingsBtn', 'Bless All Beings', function() {
      alert("Silently or aloud, offer a blessing for all beings, seen and unseen, everywhere.");
    });

    // You can add even more features by following this pattern!
});

// --- SPIRITUAL COMMUNION ROOM (World's First Spiritual Community App) ---

if (!document.getElementById('spiritualCommunionSection')) {
  const section = document.createElement('div');
  section.id = 'spiritualCommunionSection';
  section.className = 'popup-section popup-animated';
  section.style.marginTop = '18px';
  section.style.background = 'rgba(255,255,255,0.96)';
  section.style.border = '2px solid #b39ddb';
  section.style.borderRadius = '16px';
  section.style.padding = '16px 10px 12px 10px';

  // Title
  const title = document.createElement('h3');
  title.style.margin = '0 0 8px 0';
  title.style.color = '#4527a0';
  title.innerHTML = `🌐🕊️ <span style="font-family:inherit;">Spiritual Communion Room</span> <span style="font-size:0.8em;color:#43a047;">(All Beings Welcome)</span>`;
  section.appendChild(title);

  // Description
  const desc = document.createElement('div');
  desc.style.fontSize = '1em';
  desc.style.color = '#555';
  desc.style.marginBottom = '10px';
  desc.innerHTML = `
    <span style="font-size:1.08em;">A sacred, playful, and safe space for spiritual freedom, connection, and fun.<br>
    Commune with seekers, saints, ancestors, wild creatures, trees, rivers, the Divine, and the wildest wild!</span>
    <br>
    <span style="font-size:0.95em;color:#6a1b9a;">Share a prayer, blessing, poem, joke, or silent intention for the spiritual community of all beings—seen and unseen, human and wild. <b>All faiths, all paths, all freedoms, all wildness welcome.</b></span>
    <br>
    <span style="font-size:0.93em;color:#0288d1;">Your words are private to your device. No one can censor, judge, or track you. This is your sacred playground.</span>
    <br>
    <span style="font-size:1em;color:#388e3c;"><b>Goal: Connect with God/Divine/Source offline, in your own way.</b></span>
    <br>
    <span style="font-size:0.93em;color:#6d4c41;">Try: Write a letter to God, offer a silent prayer, meditate, sing, walk in nature, or simply listen for the Divine in the wind, the trees, or your own heart. This space is for your unique connection—no rules, no dogma, just presence.</span>
  `;
  section.appendChild(desc);

  // Input for spiritual message
  const input = document.createElement('textarea');
  input.id = 'spiritualCommunionInput';
  input.placeholder = "Type your spiritual message, prayer, wild howl, or blessing for the community of all beings or for God...";
  input.style.width = '98%';
  input.style.height = '48px';
  input.style.margin = '6px 0 6px 0';
  input.style.borderRadius = '8px';
  input.style.border = '1px solid #b39ddb';
  input.style.padding = '7px';
  input.style.fontFamily = 'inherit';
  input.style.fontSize = '1em';
  section.appendChild(input);

  // Dropdown for "Who are you communing with?"
  const communeWith = document.createElement('select');
  communeWith.id = 'communeWithSelect';
  communeWith.style.margin = '4px 0 8px 0';
  communeWith.style.borderRadius = '6px';
  communeWith.style.padding = '2px 8px';
  communeWith.style.fontSize = '0.97em';
  communeWith.innerHTML = `
    <option value="god">God / Divine / Source</option>
    <option value="all">All Beings</option>
    <option value="seekers">Other Seekers</option>
    <option value="ancestors">Ancestors</option>
    <option value="wildlife">Wildlife (birds, animals, insects, wildest wild!)</option>
    <option value="trees">Trees & Plants</option>
    <option value="rivers">Rivers, Lakes, Oceans</option>
    <option value="mountains">Mountains & Stones</option>
    <option value="sky">Sky, Sun, Moon, Stars</option>
    <option value="earth">Mother Earth</option>
    <option value="spirits">Unseen Spirits</option>
    <option value="freedom">Freedom Itself</option>
    <option value="playfulness">Playfulness / Cosmic Laughter</option>
    <option value="custom">Custom...</option>
  `;
  section.appendChild(communeWith);

  // Button to send spiritual message
  const sendBtn = document.createElement('button');
  sendBtn.id = 'sendSpiritualCommunionBtn';
  sendBtn.textContent = 'Send Spiritual Blessing / Prayer / Howl / Poem / Joke';
  sendBtn.style.backgroundColor = '#43a047';
  sendBtn.style.margin = '4px 0 8px 0';
  sendBtn.style.fontWeight = 'bold';
  sendBtn.style.fontSize = '1em';
  sendBtn.style.borderRadius = '8px';
  sendBtn.style.border = 'none';
  sendBtn.style.color = 'white';
  sendBtn.style.cursor = 'pointer';
  section.appendChild(sendBtn);

  // Display area for recent spiritual messages (local only, for privacy)
  const logDiv = document.createElement('div');
  logDiv.id = 'spiritualCommunionLog';
  logDiv.style.marginTop = '10px';
  logDiv.style.maxHeight = '110px';
  logDiv.style.overflowY = 'auto';
  logDiv.style.background = '#f3e5f5';
  logDiv.style.borderRadius = '8px';
  logDiv.style.padding = '7px 9px';
  logDiv.style.fontSize = '0.98em';
  logDiv.style.color = '#4527a0';
  logDiv.innerHTML = `<span style="color:#888;">No spiritual messages yet. Be the first to bless the circle, connect with God, or share a cosmic joke!</span>`;
  section.appendChild(logDiv);

  // Insert section before the first fun quote or at the end
  const funQuote = document.getElementById('popupFunQuote');
  if (funQuote) {
    funQuote.parentNode.insertBefore(section, funQuote.nextSibling);
  } else {
    document.body.appendChild(section);
  }

  // Handler for sending a spiritual message
  sendBtn.onclick = function() {
    const msg = input.value.trim();
    let withWhom = communeWith.value;
    if (withWhom === "custom") {
      withWhom = prompt("Who or what are you communing with?");
    }
    if (!msg) {
      showPopupConfirmation("Please enter a message, prayer, howl, or blessing.", true);
      return;
    }
    // Fun: If user types "howl" or "wild", add a random animal emoji
    let playfulMsg = msg;
    if (/howl|wild|wolf|lion|roar|meow|bark|chirp|moo|neigh|quack|buzz|ribbit|croak|hoot|screech|growl|purr|squeak|bleat|baa|tweet|sing/i.test(msg)) {
      const animals = ["🐺","🦁","🐯","🐻","🐸","🦉","🦊","🐦","🦅","🐬","🐘","🐍","🦋","🐝","🦓","🦄","🐲","🐢","🦒","🦜","🐧","🦇"];
      playfulMsg += " " + animals[Math.floor(Math.random() * animals.length)];
    }
    // Safety: Only store locally, never send to a server
    const entry = {
      time: new Date().toLocaleString(),
      with: withWhom,
      msg: playfulMsg
    };
    let log = [];
    try {
      log = JSON.parse(localStorage.getItem('spiritualCommunionLog') || "[]");
    } catch {}
    log.push(entry);
    if (log.length > 12) log = log.slice(-12);
    localStorage.setItem('spiritualCommunionLog', JSON.stringify(log));
    input.value = '';
    showPopupConfirmation("Blessing sent to the spiritual community! (Private, safe, and free)", false);
    renderSpiritualCommunionLog();
  };

  // Render function for the log
  function renderSpiritualCommunionLog() {
    let log = [];
    try {
      log = JSON.parse(localStorage.getItem('spiritualCommunionLog') || "[]");
    } catch {}
    if (!log.length) {
      logDiv.innerHTML = `<span style="color:#888;">No spiritual messages yet. Be the first to bless the circle, connect with God, or share a cosmic joke!</span>`;
      return;
    }
    logDiv.innerHTML = '';
    log.slice().reverse().forEach(entry => {
      const p = document.createElement('div');
      p.style.marginBottom = '7px';
      // Fun: If message contains "joke", style it differently
      if (/joke|laugh|funny|haha|lol|giggle|smile/i.test(entry.msg)) {
        p.innerHTML = `<span style="color:#ff9800;">[${entry.with}]</span> <span style="color:#283593;font-style:italic;">${entry.msg}</span> <span style="color:#aaa;font-size:0.92em;">(${entry.time})</span>`;
      } else if (entry.with === "god" || /god|divine|source/i.test(entry.with)) {
        p.innerHTML = `<span style="color:#388e3c;">[God]</span> <span style="color:#1a237e;font-weight:bold;">${entry.msg}</span> <span style="color:#aaa;font-size:0.92em;">(${entry.time})</span>`;
      } else {
        p.innerHTML = `<span style="color:#43a047;">[${entry.with}]</span> <span style="color:#311b92;">${entry.msg}</span> <span style="color:#aaa;font-size:0.92em;">(${entry.time})</span>`;
      }
      logDiv.appendChild(p);
    });
  }

  // Initial render
  renderSpiritualCommunionLog();

  // Freedom & Safety: Add a "Clear My Messages" button for privacy
  if (!document.getElementById('clearSpiritualCommunionBtn')) {
    const clearBtn = document.createElement('button');
    clearBtn.id = 'clearSpiritualCommunionBtn';
    clearBtn.textContent = 'Clear My Messages (Privacy)';
    clearBtn.style.margin = '8px 0 0 0';
    clearBtn.style.backgroundColor = '#e57373';
    clearBtn.style.color = 'white';
    clearBtn.style.borderRadius = '6px';
    clearBtn.style.border = 'none';
    clearBtn.style.cursor = 'pointer';
    clearBtn.onclick = function() {
      if (confirm("Are you sure you want to clear all your spiritual messages? This cannot be undone.")) {
        localStorage.removeItem('spiritualCommunionLog');
        renderSpiritualCommunionLog();
        showPopupConfirmation("All your spiritual messages have been cleared.", false);
      }
    };
    section.appendChild(clearBtn);
  }

  // Fun: Add a random "wild wisdom" or "freedom blessing" on each load
  if (!document.getElementById('wildWisdomBlessing')) {
    const wilds = [
      "🌲 The wildest freedom is the freedom to bless.",
      "🦁 Let your spirit roar with kindness.",
      "🦋 Transformation is the wildest prayer.",
      "🌊 Even the ocean prays in waves.",
      "🦉 Wisdom is wild and free.",
      "🌈 The universe laughs in colors.",
      "🐾 Every paw print is a sacred signature.",
      "🌬️ The wind carries your prayers everywhere.",
      "🦄 Be as wild as your truest dream.",
      "🌻 The sunflowers always find the light."
    ];
    const wildDiv = document.createElement('div');
    wildDiv.id = 'wildWisdomBlessing';
    wildDiv.className = 'popup-quote popup-animated';
    wildDiv.style.marginTop = '10px';
    wildDiv.textContent = wilds[Math.floor(Math.random() * wilds.length)];
    section.appendChild(wildDiv);
  }
}

// --- INDIGENOUS, CENTRAL AMERICA, CARIBBEAN, AMAZON, CONGO JUNGLE, AND MUSLIM WOMEN OF INDIA FEATURES ---

document.addEventListener('DOMContentLoaded', function() {
  // --- INDIGENOUS, CENTRAL AMERICA, CARIBBEAN, AMAZON, CONGO JUNGLE FEATURES ---

  function addIndigenousFeatureBtn(id, label, handler, opts = {}) {
    if (!document.getElementById(id)) {
      const btn = document.createElement('button');
      btn.id = id;
      btn.textContent = label;
      btn.style.margin = opts.margin || '4px 2px';
      btn.style.fontSize = opts.fontSize || '0.95em';
      btn.style.backgroundColor = opts.bg || '#00897b';
      btn.style.color = opts.color || 'white';
      btn.style.borderRadius = '5px';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.onclick = handler;
      document.body.appendChild(btn);
    }
  }

  // Amazon Rainforest
  addIndigenousFeatureBtn('offlineAmazonTreeBtn', 'Honor the Amazon Tree', function() {
    alert("Sit quietly and imagine the great trees of the Amazon. Offer a prayer for their protection and for all forest guardians.");
  }, { bg: '#388e3c' });

  addIndigenousFeatureBtn('offlineRainstickBtn', 'Rainstick Ritual', function() {
    alert("Make or shake a rainstick (or use a bottle with seeds). Listen to the sound and pray for balance in the waters of the world.");
  }, { bg: '#0288d1' });

  addIndigenousFeatureBtn('offlineAmazonAnimalBtn', 'Bless Amazon Wildlife', function() {
    alert("Send a blessing to jaguars, parrots, monkeys, and all Amazon creatures. Imagine their freedom and beauty.");
  }, { bg: '#ffb300' });

  // Congo Jungle
  addIndigenousFeatureBtn('offlineCongoDrumBtn', 'Congo Drum Meditation', function() {
    alert("Drum, tap, or clap a simple rhythm. Feel the heartbeat of the Congo and all its people and animals.");
  }, { bg: '#6d4c41' });

  addIndigenousFeatureBtn('offlineCongoRiverBtn', 'Bless the Congo River', function() {
    alert("Pour a little water on the earth and offer a prayer for the Congo River and all who depend on it.");
  }, { bg: '#039be5' });

  addIndigenousFeatureBtn('offlineGorillaSpiritBtn', 'Honor Gorilla Spirit', function() {
    alert("Sit strong and still for a moment. Honor the wisdom and strength of the gorilla and all jungle beings.");
  }, { bg: '#8d6e63' });

  // Central America & Caribbean
  addIndigenousFeatureBtn('offlineMayanSunBtn', 'Mayan Sun Salutation', function() {
    alert("At sunrise or sunset, face the sun and offer gratitude as the Maya do. Feel the warmth and light.");
  }, { bg: '#fbc02d' });

  addIndigenousFeatureBtn('offlineCacaoCeremonyBtn', 'Cacao Ceremony', function() {
    alert("Drink a cup of cacao (or hot chocolate) with intention. Offer a prayer for the land and people who grow it.");
  }, { bg: '#6d4c41' });

  addIndigenousFeatureBtn('offlineCaribbeanDrumBtn', 'Caribbean Drum & Dance', function() {
    alert("Play a drum, shake maracas, or dance to Caribbean rhythms. Celebrate joy and resilience.");
  }, { bg: '#ff7043' });

  addIndigenousFeatureBtn('offlineTainoBlessingBtn', 'Taino Water Blessing', function() {
    alert("Sprinkle water and say: 'Yaya, bless this water and all who drink from it.' Honor the Taino and all island peoples.");
  }, { bg: '#0288d1' });

  // General Indigenous Wisdom
  addIndigenousFeatureBtn('offlineLandAcknowledgementBtn', 'Land Acknowledgement', function() {
    alert("Pause and acknowledge the original stewards of the land you are on. Offer respect and gratitude.");
  }, { bg: '#43a047' });

  addIndigenousFeatureBtn('offlineCircleFireBtn', 'Circle & Fire Ritual', function() {
    alert("Sit in a circle (real or imagined) and light a candle or fire. Share a hope or prayer for all beings.");
  }, { bg: '#e65100' });

  addIndigenousFeatureBtn('offlineTotemAnimalBtn', 'Totem Animal Meditation', function() {
    alert("Close your eyes and ask: What animal wishes to guide me today? Listen for a sign or feeling.");
  }, { bg: '#8e24aa' });

  addIndigenousFeatureBtn('offlineShellRattleBtn', 'Shell Rattle Ceremony', function() {
    alert("Shake a shell rattle or tap two stones. Let the sound carry your prayers to the ancestors.");
  }, { bg: '#bdb76b' });

  addIndigenousFeatureBtn('offlinePlantMedicineBtn', 'Honor Plant Medicine', function() {
    alert("Offer gratitude for the healing plants of the world. Promise to use them with respect and care.");
  }, { bg: '#388e3c' });

  addIndigenousFeatureBtn('offlineStoryStickBtn', 'Story Stick Sharing', function() {
    alert("Hold a stick or stone. Share a story, then pass it to another (or imagine doing so). Listen deeply.");
  }, { bg: '#6d4c41' });

  addIndigenousFeatureBtn('offlineFeatherPrayerBtn', 'Feather Prayer', function() {
    alert("Hold a feather (or imagine one). Whisper a prayer and release it to the wind.");
  }, { bg: '#bdb76b' });

  addIndigenousFeatureBtn('offlineMoonCeremonyBtn', 'Full/New Moon Ceremony', function() {
    alert("On the full or new moon, light a candle and set an intention. Honor the cycles of nature.");
  }, { bg: '#3949ab' });

  addIndigenousFeatureBtn('offlineCornOfferingBtn', 'Corn Offering', function() {
    alert("Place a few kernels of corn or seeds on the earth. Offer thanks for nourishment and abundance.");
  }, { bg: '#fbc02d' });

  addIndigenousFeatureBtn('offlineRainPrayerBtn', 'Rain Prayer', function() {
    alert("Pray for gentle rain to nourish the land, forests, and all people. Listen for the sound of water.");
  }, { bg: '#0288d1' });

  addIndigenousFeatureBtn('offlineSacredSilenceBtn', 'Sacred Silence', function() {
    alert("Sit in silence for a few minutes. Listen for the voice of the land, the ancestors, and the Divine.");
  }, { bg: '#311b92' });

  // --- MUSLIM WOMEN OF INDIA: SPIRITUAL SAFETY, DIGNITY, AND INCLUSION ---

  function addMuslimWomenIndiaFeatureBtn(id, label, handler, opts = {}) {
    if (!document.getElementById(id)) {
      const btn = document.createElement('button');
      btn.id = id;
      btn.textContent = label;
      btn.style.margin = opts.margin || '4px 2px';
      btn.style.fontSize = opts.fontSize || '0.95em';
      btn.style.backgroundColor = opts.bg || '#ad1457';
      btn.style.color = opts.color || 'white';
      btn.style.borderRadius = '5px';
      btn.style.border = 'none';
      btn.style.cursor = 'pointer';
      btn.onclick = handler;
      document.body.appendChild(btn);
    }
  }

  // 1. Dua for Dignity & Safety
  addMuslimWomenIndiaFeatureBtn('offlineDuaDignityBtn', 'Dua for Dignity & Safety', function() {
    alert("Recite: 'Ya Hafeez, Ya Salaam, Ya Lateef' (O Protector, O Source of Peace, O Gentle One). Pray for the safety, dignity, and freedom of all women everywhere.");
  }, { bg: '#ad1457' });

  // 2. Hijab Reflection (for those who wear it)
  addMuslimWomenIndiaFeatureBtn('offlineHijabReflectionBtn', 'Hijab Reflection', function() {
    alert("If you wear hijab or a scarf, take a moment to honor your intention. Reflect on your inner strength and beauty, regardless of what you wear.");
  }, { bg: '#6a1b9a' });

  // 3. Quiet Prayer Space
  addMuslimWomenIndiaFeatureBtn('offlineQuietPrayerBtn', 'Create a Quiet Prayer Space', function() {
    alert("Find or create a small, private space for prayer or reflection. Even a corner with a scarf or mat can become a sanctuary.");
  }, { bg: '#00897b' });

  // 4. Quranic Wisdom for Women
  addMuslimWomenIndiaFeatureBtn('offlineQuranicWisdomBtn', 'Read Quranic Wisdom for Women', function() {
    alert("Read or recite a verse about dignity, mercy, or justice. Example: 'And We have certainly honored the children of Adam...' (Quran 17:70)");
  }, { bg: '#3949ab' });

  // 5. Sisterhood Blessing
  addMuslimWomenIndiaFeatureBtn('offlineSisterhoodBlessBtn', 'Bless a Sister', function() {
    alert("Send a silent blessing to a sister, mother, daughter, or friend. Pray for her happiness, health, and spiritual growth.");
  }, { bg: '#f06292' });

  // 6. Henna/Mehndi Ritual
  addMuslimWomenIndiaFeatureBtn('offlineHennaBtn', 'Henna/Mehndi Ritual', function() {
    alert("Draw a simple henna/mehndi design on your hand or paper. Let it be a symbol of beauty, joy, and tradition.");
  }, { bg: '#ffb300' });

  // 7. Sadaqah (Charity) Intention
  addMuslimWomenIndiaFeatureBtn('offlineSadaqahBtn', 'Sadaqah (Charity) Intention', function() {
    alert("Set aside a coin or small gift for someone in need. Even a smile or kind word is sadaqah.");
  }, { bg: '#43a047' });

  // 8. Salaam Ritual
  addMuslimWomenIndiaFeatureBtn('offlineSalaamBtn', 'Offer Salaam', function() {
    alert("Say 'Assalamu Alaikum' (Peace be upon you) to someone, or silently in your heart to all beings.");
  }, { bg: '#0288d1' });

  // 9. Family Honor Reflection
  addMuslimWomenIndiaFeatureBtn('offlineFamilyHonorBtn', 'Reflect on Family Honor', function() {
    alert("Reflect on what honor means to you, beyond tradition or expectation. Affirm your worth and the worth of all women.");
  }, { bg: '#6d4c41' });

  // 10. Celebrate Achievements
  addMuslimWomenIndiaFeatureBtn('offlineCelebrateWomenBtn', 'Celebrate Women\'s Achievements', function() {
    alert("Recall a moment when you or another woman overcame a challenge. Celebrate it with gratitude and pride.");
  }, { bg: '#fbc02d' });

  // ...existing code...
});
