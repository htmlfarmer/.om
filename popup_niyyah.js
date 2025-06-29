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
            popupDebugLog("Sending Niyyah to background script:", niyyah);
            try {
                const response = await browser.runtime.sendMessage({ action: "setNiyyah", niyyah: niyyah });
                if (response && response.status === "Niyyah set") {
                    popupDebugLog("Niyyah successfully set.");
                    // Optionally provide visual feedback
                }
            } catch (error) {
                popupDebugLog("Error setting Niyyah:", error);
            }
        } else {
            alert("Please enter your Niyyah.");
        }
    });

    // Increment Shukr
    incrementShukrBtn.addEventListener('click', async () => {
        popupDebugLog("Incrementing Shukr...");
        try {
            const currentSettingsResponse = await browser.runtime.sendMessage({ action: "getSettings" });
            if (currentSettingsResponse && currentSettingsResponse.settings) {
                let currentCount = currentSettingsResponse.settings.DynamicState.ShukrCount || 0;
                currentCount++;
                const response = await browser.runtime.sendMessage({ action: "updateShukrCount", newCount: currentCount });
                if (response && response.status === "Shukr count updated") {
                    shukrDisplayElement.textContent = `Shukr Count: ${currentCount}`;
                    popupDebugLog("Shukr count updated to:", currentCount);
                }
            }
        } catch (error) {
            popupDebugLog("Error incrementing Shukr:", error);
        }
    });

    // Get Wisdom
    getWisdomBtn.addEventListener('click', async () => {
        popupDebugLog("Requesting wisdom...");
        try {
            const response = await browser.runtime.sendMessage({ action: "getWisdom" });
            if (response && response.wisdom) {
                wisdomDisplayDiv.textContent = response.wisdom;
                popupDebugLog("Received wisdom:", response.wisdom);
            }
        } catch (error) {
            popupDebugLog("Error getting wisdom:", error);
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
            alert("Contemplate the 'Hidden Manifold' that connects seemingly disparate realities. All is One.");
            // In a real implementation, this would trigger a more guided reflection or a visual.
        });
    }

    // Kam Bolo (Concise Wisdom) - Placeholder
    if (popupKamBoloBtn) {
        popupKamBoloBtn.addEventListener('click', () => {
            alert("Kam Bolo, Theek Bolo. Less talk, more truth. Seek the core Hikmat.");
            // This could trigger a specific concise wisdom prompt.
        });
    }

    // Shukr Manifestation - Placeholder
    if (popupShukrManifestationBtn) {
        popupShukrManifestationBtn.addEventListener('click', () => {
            alert("Your profound Shukr is manifesting! Feel the divine blessings unfold.");
            // This would trigger a visual/auditory manifestation.
        });
    }

    // Ratan Discovery - Placeholder
    if (revealRatanBtn) {
        revealRatanBtn.addEventListener('click', async () => {
            alert("A new Ratan (Gem) of insight reveals itself! Observe the subtle blessings around you.");
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
        alert("Recite a personal Dua, seeking closeness to the Divine.");
    }, { bg: '#ffee58' });

    // 2. Quran Reflection
    addMuslimWomenIndiaFeatureBtn('offlineQuranBtn', 'Reflect on Quran', function() {
        alert("Choose an Ayah and reflect on its meaning for your life today.");
    }, { bg: '#81c784' });

    // 3. Gratitude Journal
    addMuslimWomenIndiaFeatureBtn('offlineGratitudeBtn', 'Gratitude Journal', function() {
        alert("List 3 things you are grateful for right now. Feel the Shukr.");
    }, { bg: '#ffb74d' });

    // 4. Blessing a Sister
    addMuslimWomenIndiaFeatureBtn('offlineBlessSisterBtn', 'Bless a Sister', function() {
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
    addMuslimWomenIndiaFeatureBtn('offlineCelebrateWomenBtn', 'Celebrate Achievements', function() {
        alert("Acknowledge and celebrate the achievements of women around you and throughout history. Their success is our collective strength.");
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

    // Listen for errors globally
    window.addEventListener('error', function(e) {
      popupDebugLog('Global error: ' + e.message + ' at ' + e.filename + ':' + e.lineno);
    });
    window.addEventListener('unhandledrejection', function(e) {
      popupDebugLog('Unhandled promise rejection: ' + (e.reason && e.reason.message ? e.reason.message : e.reason));
    });
});