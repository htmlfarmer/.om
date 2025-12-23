// popup_niyyah.js

// Ensure window.browser is polyfilled if it's not native
if (typeof browser === 'undefined' && typeof chrome !== 'undefined') {
  window.browser = chrome;
  console.log("Polyfilling browser API with chrome in popup_niyyah.");
} else if (typeof browser !== 'undefined') {
  console.log("Using native browser API (Firefox) in popup_niyyah.");
}


function popupDebugLog(message, ...args) {
    // console.log(`[Niyyah Popup] ${message}`, ...args);
}

document.addEventListener('DOMContentLoaded', async function() {
    popupDebugLog('DOMContentLoaded event fired for popup_niyyah.html');

    const niyyahInput = document.getElementById('niyyahInput');
    const setNiyyahBtn = document.getElementById('setNiyyahBtn');
    const shukrDisplayElement = document.getElementById('shukrDisplay');
    const incrementShukrBtn = document.getElementById('incrementShukrBtn');
    const getWisdomBtn = document.getElementById('getWisdomBtn');
    const wisdomDisplayDiv = document.getElementById('wisdomDisplay');
    const currentDeviFocusPopup = document.getElementById('currentDeviFocusPopup');
    const deviSymbolPopup = document.getElementById('deviSymbolPopup');
    const popupDivineParadoxBtn = document.getElementById('popupDivineParadoxBtn');
    const popupSubconsciousRitualBtn = document.getElementById('popupSubconsciousRitualBtn');
    const popupHiddenManifoldBtn = document.getElementById('popupHiddenManifoldBtn');
    const popupShukrManifestationBtn = document.getElementById('popupShukrManifestationBtn');
    const popupKamBoloBtn = document.getElementById('popupKamBoloBtn');
    const revealRatanBtn = document.getElementById('revealRatanBtn');
    const ratanDiscoveryDisplay = document.getElementById('ratanDiscoveryDisplay');
    const appActiveToggle = document.getElementById('appActiveToggle');
    const niyyahMessage = document.getElementById('niyyahMessage');
    const openOptionsPageBtn = document.getElementById('openOptionsPage');

    // Debounce function to prevent excessive API calls
    let debounceTimer;
    function debounce(func, delay) {
        return function(...args) {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    if (openOptionsPageBtn) {
        openOptionsPageBtn.addEventListener('click', () => {
            browser.runtime.openOptionsPage();
        });
    }

    // Real-time Niyyah reflection
    const handleNiyyahInput = debounce(async (niyyah) => {
        if (niyyah) {
            try {
                showMessage(niyyahMessage, "Contemplating the reflection...");

                const response = await browser.runtime.sendMessage({
                    action: "invokeGemini",
                    actionDescription: `The user is typing their Niyyah (intention) and has paused. The current intention is: "${niyyah}"`
                });

                if (response && response.data && response.data.interpretation) {
                    showMessage(niyyahMessage, response.data.interpretation, '#4a148c', 7000);
                } else {
                    showMessage(niyyahMessage, "The mirror is still.", '#6d4c41', 3000);
                }
            } catch (error) {
                popupDebugLog("Error during real-time Niyyah reflection:", error);
                showMessage(niyyahMessage, "A veil descends.", '#d32f2f');
            }
        }
    }, 1500); // 1.5-second pause

    niyyahInput.addEventListener('input', () => {
        const niyyah = niyyahInput.value.trim();
        handleNiyyahInput(niyyah);
    });

    // Set Niyyah button now only saves the final intention
    setNiyyahBtn.addEventListener('click', async () => {
        const niyyah = niyyahInput.value.trim();
        if (niyyah) {
            try {
                await browser.runtime.sendMessage({ action: "setNiyyah", niyyah: niyyah });
                showMessage(niyyahMessage, "Niyyah has been sealed in the heart.", 'green', 3000);
            } catch (error) {
                popupDebugLog("Error saving final Niyyah:", error);
                showMessage(niyyahMessage, "Could not seal the Niyyah.", '#d32f2f');
            }
        } else {
            showMessage(niyyahMessage, "Please state your Niyyah before sealing it.", '#d32f2f');
        }
    });

    // Load and display initial settings
    async function loadAndDisplaySettings() {
        popupDebugLog("Requesting settings from background script...");
        try {
            const response = await browser.runtime.sendMessage({ action: "getSettings" });
            if (response && response.settings) {
                const settings = response.settings;
                popupDebugLog("Settings received:", settings);
                if (settings.Goals && settings.Goals.CurrentNiyyah) {
                    niyyahInput.value = settings.Goals.CurrentNiyyah;
                }
                if (settings.DynamicState && settings.DynamicState.ShukrCount !== undefined) {
                    shukrDisplayElement.textContent = `Shukr Count: ${settings.DynamicState.ShukrCount}`;
                }
                if (settings.DynamicState && settings.DynamicState.CurrentDeviFocus) {
                    currentDeviFocusPopup.textContent = settings.DynamicState.CurrentDeviFocus;
                    // Update Devi symbol based on focus (simple example)
                    const deviSymbolMap = {
                        "Maa Saraswati (Wisdom & Clarity)": "images/icons/saraswati.png", // Placeholder, add real images
                        "Maa Lakshmi (Prosperity & Abundance)": "images/icons/lakshmi.png",
                        "Maa Kali (Transformation & Power)": "images/icons/kali.png"
                    };
                    deviSymbolPopup.src = browser.runtime.getURL(deviSymbolMap[settings.DynamicState.CurrentDeviFocus] || "images/icons/icon48.png");
                }
                // Update Ratan Discovery Display (example)
                if (settings.DynamicState && settings.DynamicState.RatanCount !== undefined) {
                    ratanDiscoveryDisplay.textContent = `${settings.DynamicState.RatanCount} Gems Found`;
                }
            } else {
                popupDebugLog("No settings received or settings are empty.");
            }
        } catch (error) {
            popupDebugLog("Error fetching settings:", error);
        }
    }

    // Set Niyyah
    setNiyyahBtn.addEventListener('click', async () => {
        const niyyah = niyyahInput.value.trim();
        if (niyyah) {
            try {
                // First, set the Niyyah in storage
                await browser.runtime.sendMessage({ action: "setNiyyah", niyyah: niyyah });
                showMessage(niyyahMessage, "Niyyah sealed. Seeking final reflection...");

                // Then, invoke Gemini for wisdom on this final action
                const response = await browser.runtime.sendMessage({
                    action: "invokeGemini",
                    actionDescription: `The user has finalized their Niyyah (intention): "${niyyah}"`
                });

                if (response && response.data && response.data.interpretation) {
                    showMessage(niyyahMessage, response.data.interpretation, '#4a148c', 6000);
                } else {
                    showMessage(niyyahMessage, "The final mirror remains silent for now.", '#6d4c41', 3000);
                }

            } catch (error) {
                popupDebugLog("Error during Niyyah sealing process:", error);
                showMessage(niyyahMessage, "An error occurred while sealing Niyyah.", '#d32f2f');
            }
        } else {
            showMessage(niyyahMessage, "Please state your Niyyah before sealing it.", '#d32f2f');
        }
    });

    // Increment Shukr
    incrementShukrBtn.addEventListener('click', async () => {
        try {
            const settingsResponse = await browser.runtime.sendMessage({ action: "getSettings" });
            if (!settingsResponse || !settingsResponse.settings) return;

            let currentCount = settingsResponse.settings.DynamicState.ShukrCount || 0;
            currentCount++;
            
            // Update the count in storage
            await browser.runtime.sendMessage({ action: "updateShukrCount", newCount: currentCount });
            shukrDisplayElement.textContent = `Shukr Count: ${currentCount}`;
            showMessage(shukrMessage, "Shukr offered. Seeking reflection...");

            // Invoke Gemini for wisdom on this act of gratitude
            const geminiResponse = await browser.runtime.sendMessage({
                action: "invokeGemini",
                actionDescription: `The user has just performed an act of Shukr (gratitude), incrementing their count to ${currentCount}.`
            });

            if (geminiResponse && geminiResponse.data && geminiResponse.data.interpretation) {
                showMessage(shukrMessage, geminiResponse.data.interpretation, '#4a148c', 6000);
            } else {
                 showMessage(shukrMessage, "The mirror remains silent for now.", '#6d4c41', 3000);
            }

        } catch (error) {
            popupDebugLog("Error incrementing Shukr:", error);
            showMessage(shukrMessage, "An error occurred.", '#d32f2f');
        }
    });

    // Get Wisdom
    getWisdomBtn.addEventListener('click', async () => {
        try {
            showMessage(wisdomDisplayDiv, "Receiving wisdom...");
            const response = await browser.runtime.sendMessage({
                action: "invokeGemini",
                actionDescription: "The user has clicked the 'Receive Wisdom' button, seeking a moment of Hikmat."
            });

            if (response && response.data && response.data.interpretation) {
                wisdomDisplayDiv.textContent = response.data.interpretation;
            } else {
                wisdomDisplayDiv.textContent = "Silence is also an answer.";
            }
        } catch (error) {
            popupDebugLog("Error getting wisdom:", error);
            wisdomDisplayDiv.textContent = "The connection is veiled at this moment.";
        }
    });

    // Contemplate Paradox
    if (popupDivineParadoxBtn) {
        popupDivineParadoxBtn.addEventListener('click', () => {
            popupDebugLog("Requesting Divine Paradox...");
            browser.runtime.sendMessage({ action: "displayDivineParadox" })
                .then(response => popupDebugLog("Divine Paradox message sent:", response))
                .catch(error => popupDebugLog("Error sending Divine Paradox message:", error));
            // Optional: Close popup or show a message that a reflection popup will appear
            window.close();
        });
    }

    // Activate Subconscious Verbal Ritual
    if (popupSubconsciousRitualBtn) {
        popupSubconsciousRitualBtn.addEventListener('click', () => {
            popupDebugLog("Requesting Subconscious Verbal Ritual...");
            browser.runtime.sendMessage({ action: "triggerSubconsciousVerbalRitual" })
                .then(response => popupDebugLog("Subconscious Verbal Ritual message sent:", response))
                .catch(error => popupDebugLog("Error sending Subconscious Verbal Ritual message:", error));
            window.close(); // Ritual displays on current tab
        });
    }

    // Reveal Hidden Unity (Placeholder functionality)
    if (popupHiddenManifoldBtn) {
        popupHiddenManifoldBtn.addEventListener('click', () => {
            showMessage(wisdomMessage, "Contemplate the 'Hidden Manifold' that connects seemingly disparate realities. All is One.", '#4a148c', 5000);
            // In a real implementation, this would trigger a more guided reflection or a visual.
        });
    }

    // Kam Bolo (Concise Wisdom) - Placeholder
    if (popupKamBoloBtn) {
        popupKamBoloBtn.addEventListener('click', () => {
            showMessage(wisdomMessage, "Kam Bolo, Theek Bolo. Less talk, more truth. Seek the core Hikmat.", '#4a148c', 5000);
            // This could trigger a specific concise wisdom prompt.
        });
    }

    // Shukr Manifestation - Placeholder
    if (popupShukrManifestationBtn) {
        popupShukrManifestationBtn.addEventListener('click', () => {
            showMessage(shukrMessage, "Your profound Shukr is manifesting! Feel the divine blessings unfold.", '#4a148c', 5000);
            // This would trigger a visual/auditory manifestation.
        });
    }

    // Ratan Discovery - Placeholder
    if (revealRatanBtn) {
        revealRatanBtn.addEventListener('click', async () => {
            showMessage(ratanMessage, "A new Ratan (Gem) of insight reveals itself! Observe the subtle blessings around you.", '#1a237e', 5000);
            // This would update a count in storage and reflect it.
            // Example:
            // let settings = (await browser.storage.local.get('dilKiDastakSettings')).dilKiDastakSettings;
            // if (!settings.DynamicState.RatanCount) settings.DynamicState.RatanCount = 0;
            // settings.DynamicState.RatanCount++;
            // await browser.storage.local.set({ dilKiDastakSettings: settings });
            // ratanDiscoveryDisplay.textContent = `${settings.DynamicState.RatanCount} Gems Found`;
        });
    }


    // --- Muslim Women India Features (Placeholders) ---
    function addMuslimWomenIndiaFeatureBtn(id, text, onClick, styles = {}) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.textContent = text;
            Object.assign(btn.style, styles);
            btn.addEventListener('click', onClick);
        } else {
            popupDebugLog(`Button with ID ${id} not found.`);
        }
    }

    // 1. Dua (Prayer)
    addMuslimWomenIndiaFeatureBtn('offlineDuaBtn', 'Recite Dua', function() {
        showMessage(muslimWomenIndiaFeaturesMessage, "Recite a personal Dua, seeking closeness to the Divine.", '#6d4c41', 5000);
    }, { bg: '#ffee58' });

    // 2. Quran Reflection
    addMuslimWomenIndiaFeatureBtn('offlineQuranBtn', 'Reflect on Quran', function() {
        showMessage(muslimWomenIndiaFeaturesMessage, "Choose an Ayah and reflect on its meaning for your life today.", '#6d4c41', 5000);
    }, { bg: '#81c784' });

    // 3. Gratitude Journal
    addMuslimWomenIndiaFeatureBtn('offlineGratitudeBtn', 'Gratitude Journal', function() {
        showMessage(muslimWomenIndiaFeaturesMessage, "List 3 things you are grateful for right now. Feel the Shukr.", '#6d4c41', 5000);
    }, { bg: '#ffb74d' });

    // 4. Blessing a Sister
    addMuslimWomenIndiaFeatureBtn('offlineBlessSisterBtn', 'Bless a Sister', function() {
        showMessage(muslimWomenIndiaFeaturesMessage, "Send a silent blessing to a sister, mother, daughter, or friend. Pray for her happiness, health, and spiritual growth.", '#6d4c41', 5000);
    }, { bg: '#f06292' });

    // 6. Henna/Mehndi Ritual
    addMuslimWomenIndiaFeatureBtn('offlineHennaBtn', 'Henna/Mehndi Ritual', function() {
        showMessage(muslimWomenIndiaFeaturesMessage, "Draw a simple henna/mehndi design on your hand or paper. Let it be a symbol of beauty, joy, and tradition.", '#6d4c41', 5000);
    }, { bg: '#ffb300' });

    // 7. Sadaqah (Charity) Intention
    addMuslimWomenIndiaFeatureBtn('offlineSadaqahBtn', 'Sadaqah (Charity) Intention', function() {
        showMessage(muslimWomenIndiaFeaturesMessage, "Set aside a coin or small gift for someone in need. Even a smile or kind word is sadaqah.", '#6d4c41', 5000);
    }, { bg: '#43a047' });

    // 8. Salaam Ritual
    addMuslimWomenIndiaFeatureBtn('offlineSalaamBtn', 'Offer Salaam', function() {
        showMessage(muslimWomenIndiaFeaturesMessage, "Say 'Assalamu Alaikum' (Peace be upon you) to someone, or silently in your heart to all beings.", '#6d4c41', 5000);
    }, { bg: '#0288d1' });

    // 9. Family Honor Reflection
    addMuslimWomenIndiaFeatureBtn('offlineFamilyHonorBtn', 'Reflect on Family Honor', function() {
        showMessage(muslimWomenIndiaFeaturesMessage, "Reflect on what honor means to you, beyond tradition or expectation. Affirm your worth and the worth of all women.", '#6d4c41', 5000);
    }, { bg: '#6d4c41' });

    // 10. Celebrate Achievements
    addMuslimWomenIndiaFeatureBtn('offlineCelebrateWomenBtn', 'Celebrate Achievements', function() {
        showMessage(muslimWomenIndiaFeaturesMessage, "Acknowledge and celebrate the achievements of women around you and throughout history. Their success is our collective strength.", '#6d4c41', 5000);
    }, { bg: '#9c27b0' });

    // Call this when the popup loads
    updateRatanDiscoveryDisplay();
    // You might also want to update it if the count changes while the popup is open
    // (e.g., via a message from background.js, or by re-calling updateRatanDiscoveryDisplay)

    // Function to update Ratan Discovery count display
    function updateRatanDiscoveryDisplay() {
        // This function will fetch the actual count from storage in a real implementation
        // For now, it just ensures the element is visible if needed.
        popupDebugLog("Updating Ratan Discovery Display.");
    }


    // Initial call to load and display settings
    loadAndDisplaySettings();

    // Log DOMContentLoaded and window load events
    document.addEventListener('DOMContentLoaded', function() {
      popupDebugLog('DOMContentLoaded event fired.');
    });
    window.addEventListener('load', function() {
      popupDebugLog('Window load event fired.');
    });

    // Log storage access
    try {
      (browser.storage.local).get(null)
        .then(items => {
          popupDebugLog('Storage get success. Keys: ' + Object.keys(items).join(', '));
        })
        .catch(error => {
          popupDebugLog('Storage get error: ' + error.message);
        });
    } catch (e) {
      popupDebugLog('Storage API test failed: ' + e.message);
    }

    // Log key UI actions
    [
      'setNiyyahBtn', 'incrementShukrBtn', 'getWisdomBtn', 'joinSatsangBtn', 'startMushtarakBtn',
      'popupDivineParadoxBtn', 'popupSubconsciousRitualBtn', 'popupHiddenManifoldBtn', 'popupShukrManifestationBtn', 'popupKamBoloBtn',
      'revealRatanBtn', // Add Ratan button
      'offlineDuaBtn', 'offlineQuranBtn', 'offlineGratitudeBtn', 'offlineBlessSisterBtn', 'offlineHennaBtn', 'offlineSadaqahBtn', 'offlineSalaamBtn', 'offlineFamilyHonorBtn', 'offlineCelebrateWomenBtn'
    ].forEach(function(id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', function() {
          popupDebugLog('Clicked: #' + id);
        });
      }
    });

    // Load initial app active state
    async function loadAppActiveState() {
        const settings = await browser.runtime.sendMessage({ action: 'getSettings' }); // Request settings from background script
        if (settings && typeof settings.enableApp !== 'undefined') { // Assuming a new 'enableApp' setting
            appActiveToggle.checked = settings.enableApp;
        } else {
            // Default to true if not set (app is on by default)
            appActiveToggle.checked = true;
        }
    }

    // Save app active state when toggle changes
    appActiveToggle.addEventListener('change', async () => {
        const enableApp = appActiveToggle.checked;
        await browser.runtime.sendMessage({
            action: 'updateSetting',
            setting: 'enableApp', // Name of your new setting
            value: enableApp
        });
        // You might want to display a temporary message like "App state updated"
    });

    loadAppActiveState(); // Call this to set initial toggle state


    // Listen for errors globally
    window.addEventListener('error', function(e) {
      popupDebugLog('Global error: ' + e.message + ' at ' + e.filename + ':' + e.lineno);
    });
    window.addEventListener('unhandledrejection', function(e) {
      popupDebugLog('Unhandled promise rejection: ' + (e.reason && e.reason.message ? e.reason.message : e.reason));
    });
});