// options.js

// Ensure window.browser is polyfilled if it's not native
if (typeof browser === 'undefined' && typeof chrome !== 'undefined') {
  window.browser = chrome;
  console.log("Polyfilling browser API with chrome in options.");
} else if (typeof browser !== 'undefined') {
  console.log("Using native browser API (Firefox) in options.");
}

function logDebug(message, ...args) {
  // console.log(`[Options Page] ${message}`, ...args);
}

// Helper function to show confirmation messages
function showConfirmation(message, isError = false) {
  const msgDiv = document.getElementById('confirmationMessage');
  if (msgDiv) { // Ensure the element exists
    msgDiv.textContent = message;
    msgDiv.style.color = isError ? 'red' : 'green';
    setTimeout(() => {
      msgDiv.textContent = '';
    }, 3000); // Message disappears after 3 seconds
  }
}

// --- Default Ruhani Nuskha Content (for reset functionality) ---
const defaultRuhaniNuskha = `[ThematicDays]
MondayTheme: 🌙 Peace & Reflection (FocusDevi: ChandraDeva, Muraqaba: calmBlue, DhikrKeywords: shanti, salam)
FridayTheme: 💖 Love & Beauty (FocusDevi: Lakshmi/Venus, Muraqaba: goldenLight, BarakahKeywords: joy, love)
SpecialDate_2024-03-15: 🙏 Day of Gratitude (PluginMood: Grateful, ShukrFocus: High)
OverallEhsaasIntensity: 0.5

[Goals]
Goal1: 🌱 Cultivate constant Taqwa during Browse.
Sankalpa1: 🕊️ Deepen Ehsaas of Tri Devi presence.
Focus1: 💐 Practice Shukr more actively.
CommunityNiyyah: 🤝 Foster genuine Ruhaani Rabt.
SatsangParticipation: 🪔 Active

[DynamicState]
CurrentDeviFocus: 📚 Maa Saraswati (Wisdom & Clarity)
ReminderFrequency: 🌸 Gentle
WaqfaTheme: 🌳 NatureSounds
PluginMood: 🌤️ Calm
CurrentSatsangStatus: 📴 Offline
LastSharedInsightId: 🧩 001_SufiMetaphor

[UserParams]
DhikrList: 🕉️ Om Aim Hrim Klim Chamundaye Vichche, Jai Mata Di, SubhanAllah
PositiveKeywordsForSankalpaSeed: research, learn, understand, create, complete, reflect
MuraqabaThemePreference: 🎨 gentlePulse
MuraqabaIntensityPreference: 30
CommunityKeywords: service, contemplation, knowledge, inner-peace
SubconsciousVerbalRituals:
  - "In this moment, I am stillness."
  - "Divine wisdom guides my every click."
  - "My heart beats with Shukr."
  - "Through every sight, I perceive the One."
  - "I am a channel of peace and clarity."
LanguageTerms:
  Tazkiyah: Spiritual purification and growth.
  Ghair-Lafzi Ishaara: Subtle, non-verbal signals or intuitions.
  Hikmat: Divine wisdom or profound insight.
  Maqam: Spiritual station or context.
  Ehsaas: Deep spiritual feeling or intuition.
  Firasah: Spiritual discernment or intuition.
  Sankalpa: Heartfelt intention or resolve.
  Tafakkur: Deep contemplation or reflection.
  Leela: Divine play; creative exploration.
  Junoon: Controlled, passionate devotion; disciplined adherence.
  Wu Wei: Effortless alignment with divine flow.
  Shukr: Profound gratitude.
  Maya Devi Veil: Illusory covering or misunderstanding.
  Kam Bolo, Theek Bolo: Speak less, speak correctly; concise wisdom.
[Paradoxes]
To gain everything, surrender all.
The quieter you become, the more you can hear.
The greatest strength is found in vulnerability.
True freedom is discovered within the confines of discipline.
To find your path, first lose your way.
[DivineMetaphors]
Your consciousness is a river flowing into the ocean of Divine Will.
Every moment is a petal unfolding in the lotus of cosmic design.
Truth is a diamond, reflecting light from countless facets.
The path of devotion is a silken thread, weaving through the fabric of reality.
Silence is the canvas upon which the Divine speaks.
[SpiritualFractalsConcepts]
Self-similarity of divine patterns in nature and thought.
Recursive growth of spiritual understanding.
Interconnectedness revealing divine order.
The microcosm reflecting the macrocosm.
[WuWeiBalancingParams]
leelaWeight: 0.5
junoonWeight: 0.5
ehsaasSensitivity: 0.3
[MaqamDefinitions]
Beginner: {mood: "Encouraging", reminders: "Frequent", complexity: "Low"}
Seeker: {mood: "Calm", reminders: "Gentle", complexity: "Medium"}
Devotee: {mood: "Inspiring", reminders: "Occasional", complexity: "High"}
`;


// --- Ruhani Nuskha Editor Functionality ---
function loadRuhaniNuskhaToEditor() {
  logDebug('Loading Ruhani Nuskha to editor...');
  browser.storage.local.get('dilKiDastakSettings', function(items) {
    if (items.dilKiDastakSettings) {
      // Convert settings object back to RuhaniNuskha.txt format for editing
      const settings = items.dilKiDastakSettings;
      let textContent = '';
      for (const section in settings) {
        textContent += `\n[${section}]\n`;
        for (const key in settings[section]) {
          let value = settings[section][key];
          if (Array.isArray(value)) {
            value = value.join(', ');
          } else if (typeof value === 'object' && value !== null) {
            // For nested objects like MaqamDefinitions, stringify
            value = JSON.stringify(value);
          }
          textContent += `${key}: ${value}\n`;
        }
      }
      document.getElementById('ruhaniNuskhaEditor').value = textContent.trim();
      showConfirmation('Ruhani Nuskha loaded from storage.');
      logDebug('Ruhani Nuskha loaded to editor successfully.');
    } else {
      document.getElementById('ruhaniNuskhaEditor').value = defaultRuhaniNuskha;
      showConfirmation('No saved Ruhani Nuskha found, loaded default.', true);
      logDebug('No saved Ruhani Nuskha, loaded default.');
    }
  });
}

function saveRuhaniNuskhaFromEditor() {
  logDebug('Saving Ruhani Nuskha from editor...');
  const editorContent = document.getElementById('ruhaniNuskhaEditor').value;
  try {
    const parsedNuskha = parseRuhaniNuskha(editorContent); // Use the parse function from background
    // Merge with current settings to preserve DynamicState, etc.
    browser.storage.local.get('dilKiDastakSettings', function(items) {
        let currentSettings = items.dilKiDastakSettings || {};
        const newSettings = { ...currentSettings };
        for (const section in parsedNuskha) {
            if (newSettings[section]) {
                Object.assign(newSettings[section], parsedNuskha[section]);
            } else {
                newSettings[section] = parsedNuskha[section];
            }
        }
        browser.storage.local.set({ dilKiDastakSettings: newSettings }, function() {
            if (browser.runtime.lastError) {
                showConfirmation('Error saving Ruhani Nuskha: ' + browser.runtime.lastError.message, true);
                logDebug('Error saving Ruhani Nuskha:', browser.runtime.lastError);
            } else {
                showConfirmation('Ruhani Nuskha saved successfully!');
                logDebug('Ruhani Nuskha saved successfully.');
                // Notify background script that settings are updated
                browser.runtime.sendMessage({ action: "settingsUpdated", settings: newSettings })
                    .then(response => logDebug("Settings update notification sent to background:", response))
                    .catch(error => logDebug("Error notifying background of settings update:", error));
            }
        });
    });
  } catch (e) {
    showConfirmation('Error parsing Ruhani Nuskha: ' + e.message, true);
    logDebug('Error parsing Ruhani Nuskha:', e);
  }
}

function exportRuhaniNuskha() {
  logDebug('Exporting Ruhani Nuskha...');
  browser.storage.local.get('dilKiDastakSettings', function(items) {
    if (items.dilKiDastakSettings) {
      const settings = items.dilKiDastakSettings;
      let textContent = '';
      for (const section in settings) {
        textContent += `\n[${section}]\n`;
        for (const key in settings[section]) {
          let value = settings[section][key];
          if (Array.isArray(value)) {
            value = value.join(', ');
          } else if (typeof value === 'object' && value !== null) {
            value = JSON.stringify(value);
          }
          textContent += `${key}: ${value}\n`;
        }
      }
      const blob = new Blob([textContent.trim()], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RuhaniNuskha_Export.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showConfirmation('Ruhani Nuskha exported.');
      logDebug('Ruhani Nuskha exported successfully.');
    } else {
      showConfirmation('No Ruhani Nuskha to export.', true);
      logDebug('No Ruhani Nuskha to export.');
    }
  });
}

function importRuhaniNuskha(event) {
  logDebug('Importing Ruhani Nuskha...');
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const content = e.target.result;
      try {
        const parsedNuskha = parseRuhaniNuskha(content);
        // Merge with current settings, prioritizing imported content
        browser.storage.local.get('dilKiDastakSettings', function(items) {
            let currentSettings = items.dilKiDastakSettings || {};
            const newSettings = { ...currentSettings };
            for (const section in parsedNuskha) {
                if (newSettings[section]) {
                    Object.assign(newSettings[section], parsedNuskha[section]);
                } else {
                    newSettings[section] = parsedNuskha[section];
                }
            }
            browser.storage.local.set({ dilKiDastakSettings: newSettings }, function() {
                if (browser.runtime.lastError) {
                    showConfirmation('Error importing Ruhani Nuskha: ' + browser.runtime.lastError.message, true);
                    logDebug('Error importing Ruhani Nuskha:', browser.runtime.lastError);
                } else {
                    document.getElementById('ruhaniNuskhaEditor').value = content; // Update editor
                    showConfirmation('Ruhani Nuskha imported successfully!');
                    logDebug('Ruhani Nuskha imported successfully.');
                    browser.runtime.sendMessage({ action: "settingsUpdated", settings: newSettings })
                        .then(response => logDebug("Settings update notification sent to background after import:", response))
                        .catch(error => logDebug("Error notifying background of settings update after import:", error));
                }
            });
        });
      } catch (e) {
        showConfirmation('Error parsing imported file: ' + e.message, true);
        logDebug('Error parsing imported file:', e);
      }
    };
    reader.readAsText(file);
  } else {
    showConfirmation('No file selected.', true);
    logDebug('No file selected for import.');
  }
}

function resetRuhaniNuskha() {
  logDebug('Resetting Ruhani Nuskha...');
  if (confirm('Are you sure you want to reset to default Ruhani Nuskha? This cannot be undone.')) {
    browser.storage.local.set({ dilKiDastakSettings: DEFAULT_SETTINGS }, function() {
      if (browser.runtime.lastError) {
        showConfirmation('Error resetting Ruhani Nuskha: ' + browser.runtime.lastError.message, true);
        logDebug('Error resetting Ruhani Nuskha:', browser.runtime.lastError);
      } else {
        document.getElementById('ruhaniNuskhaEditor').value = defaultRuhaniNuskha;
        showConfirmation('Ruhani Nuskha reset to default!');
        logDebug('Ruhani Nuskha reset to default.');
        browser.runtime.sendMessage({ action: "settingsUpdated", settings: DEFAULT_SETTINGS })
            .then(response => logDebug("Settings update notification sent to background after reset:", response))
            .catch(error => logDebug("Error notifying background of settings update after reset:", error));
      }
    });
  }
}

// Function to parse the Ruhani Nuskha text (copied from background.js for consistency)
function parseRuhaniNuskha(text) {
    const sections = {};
    let currentSection = null;
    text.split('\n').forEach(line => {
      line = line.trim();
      if (line.startsWith('//') || line === '' || line.startsWith('