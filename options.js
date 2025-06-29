// options.js

// Helper function to show confirmation messages
function showConfirmation(message, isError = false) {
  const msgDiv = document.getElementById('confirmationMessage');
  msgDiv.textContent = message;
  msgDiv.style.color = isError ? 'red' : 'green';
  setTimeout(() => {
    msgDiv.textContent = '';
  }, 3000); // Message disappears after 3 seconds
}

// --- Default Ruhani Nuskha Content (for reset functionality) ---
const defaultRuhaniNuskha = `[Goals]
Goal1: Cultivate constant Taqwa during Browse.
Sankalpa1: Deepen Ehsaas of Tri Devi presence.
Focus1: Practice Shukr more actively.

[DynamicState]
CurrentDeviFocus: Maa Saraswati (Wisdom & Clarity)
ReminderFrequency: Gentle
WaqfaTheme: NatureSounds
PluginMood: Calm
OverallEhsaasIntensity: 0.5

[UserParams]
DhikrList: Om Aim Hrim Klim Chamundaye Vichche, Jai Mata Di, SubhanAllah
PositiveKeywordsForSankalpaSeed: research, learn, understand, create, complete, reflect
MuraqabaThemePreference: gentlePulse
MuraqabaIntensityPreference: 30
WaqfaChimeFile: sounds/chime1.mp3
DhikrAudioFile: sounds/dhikr_om.mp3
MuraqabaBackgroundImage: images/backgrounds/fractal_blue.png
FirasahPromptFrequency: occasional
MaqamAnalysisEnabled: true
SubconsciousVerbalRituals: In this moment, I am peace.
Divine wisdom guides my choices.

[FeatureToggles]
EnableMuraqaba: true
EnableDhikr: true
EnableShukr: true 
EnableWaqfa: true
EnableDhikrStreamSound: false
EnableShukrAffirmationSound: true
EnableNiyyahVisualizer: true
EnableMaqamAnalysis: true
EnableFirasahPrompts: true
EnableSubconsciousVerbalRituals: true

[ThematicDays]
MondayTheme: Peace & Reflection (FocusDevi: ChandraDeva, Muraqaba: calmBlue, DhikrKeywords: shanti, salam)
FridayTheme: Love & Beauty (FocusDevi: Lakshmi/Venus, Muraqaba: goldenLight, BarakahKeywords: joy, love)
SpecialDate_2024-03-15: Day of Gratitude (PluginMood: Grateful, ShukrFocus: High)
`;

// ...existing code...
// Remove all [cite_start] and [cite: ...] artifacts from the rest of the file
// ...existing code...
        [cite_start]if (trimmedLine.startsWith('[') && trimmedLine.endsWith(']')) { [cite: 4]
            [cite_start]currentSection = trimmedLine; [cite: 4]
        [cite_start]} else if (trimmedLine && !trimmedLine.startsWith('//') && !trimmedLine.includes(':')) { [cite: 4]
            [cite_start]// If it's not a comment and not a section, it should contain a ':' [cite: 4]
            [cite_start]return { isValid: false, message: `Invalid line format outside of a section or missing colon: "${trimmedLine}".` }; [cite: 4]
        }
    }
    return { isValid: true, message: "Ruhani Nuskha format looks good." [cite_start]}; [cite: 4]
}


// options.js
// ... (existing code) ...

function updateRuhaniNuskhaStatus(message, isError = false) {
    const statusDiv = document.getElementById('ruhaniNuskhaStatus');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.style.color = isError ? 'red' : '#555';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // ... (existing code) ...
    const ruhaniNuskhaTextarea = document.getElementById('ruhaniNuskhaContent');
    const saveNuskhaBtn = document.getElementById('saveNuskhaBtn');
    const loadNuskhaBtn = document.getElementById('loadNuskhaBtn');

    if (loadNuskhaBtn) {
        loadNuskhaBtn.addEventListener('click', function() {
            chrome.storage.local.get("ruhaniNuskhaContent", (data) => {
                if (ruhaniNuskhaTextarea) {
                    ruhaniNuskhaTextarea.value = data.ruhaniNuskhaContent || defaultRuhaniNuskha;
                    showConfirmation('Lauh-e-Mahfooz loaded from storage.', false);
                    [cite_start]updateRuhaniNuskhaStatus(`Last loaded: ${new Date().toLocaleTimeString()}`); // NEW [cite: 4]
                }
            });
        });
    }

    if (saveNuskhaBtn) {
        saveNuskhaBtn.addEventListener('click', function() {
            // ... (existing validation and save logic) ...
            if (validationResult.isValid) {
                chrome.storage.local.set({ ruhaniNuskhaContent: content }, function() {
                    [cite_start]showConfirmation('Lauh-e-Mahfooz saved.', false); [cite: 4]
                    [cite_start]updateSnapshotDisplay(); [cite: 4]
                    updateRuhaniNuskhaStatus(`Last saved: ${new Date().toLocaleTimeString()}`); [cite_start]// NEW [cite: 4]
                    [cite_start]chrome.runtime.sendMessage({ action: "ruhaniNuskhaUpdated" }); [cite: 4]
                });
            } else {
                [cite_start]showConfirmation(`Error: ${validationResult.message}`, true); [cite: 4]
                updateRuhaniNuskhaStatus(`Error saving: ${validationResult.message}`, true); [cite_start]// NEW [cite: 4]
            }
        });
    }
});

[cite_start]document.addEventListener('DOMContentLoaded', () => { [cite: 4]
  // ... existing DOMContentLoaded code ...

  [cite_start]const ruhaniNuskhaTextarea = document.getElementById('ruhaniNuskhaContent'); [cite: 4]
  [cite_start]const saveNuskhaBtn = document.getElementById('saveNuskhaBtn'); [cite: 4]
  [cite_start]const loadNuskhaBtn = document.getElementById('loadNuskhaBtn'); [cite: 4]
  [cite_start]const exportNuskhaBtn = document.getElementById('exportNuskhaBtn'); [cite: 4]
  [cite_start]const importNuskhaFile = document.getElementById('importNuskhaFile'); [cite: 4]
  [cite_start]const resetNuskhaBtn = document.getElementById('resetNuskhaBtn'); [cite: 4]

  [cite_start]if (saveNuskhaBtn) { [cite: 4]
    [cite_start]saveNuskhaBtn.addEventListener('click', function() { [cite: 4]
      [cite_start]if (ruhaniNuskhaTextarea) { [cite: 4]
        [cite_start]const content = ruhaniNuskhaTextarea.value; [cite: 4]
        const validationResult = validateRuhaniNuskha(content); [cite_start]// NEW: Validate before saving [cite: 4]

        [cite_start]if (validationResult.isValid) { [cite: 4]
          [cite_start]chrome.storage.local.set({ ruhaniNuskhaContent: content }, function() { [cite: 4]
            [cite_start]showConfirmation('Lauh-e-Mahfooz saved.', false); [cite: 4]
            updateSnapshotDisplay(); [cite_start]// Refresh snapshot after saving [cite: 4]
            [cite_start]// NEW: Potentially notify background script of a change in Ruhani Nuskha [cite: 4]
            [cite_start]chrome.runtime.sendMessage({ action: "ruhaniNuskhaUpdated" }); [cite: 4]
          });
        [cite_start]} else { [cite: 4]
          [cite_start]showConfirmation(`Error: ${validationResult.message}`, true); [cite: 4]
        }
      }
    });
  }

  // ... (rest of your existing options.js code) ...

});

// Helper function to show confirmation messages
function showConfirmation(message, isError = false) {
  const msgDiv = document.getElementById('confirmationMessage');
  msgDiv.textContent = message;
  msgDiv.style.color = isError ? 'red' : 'green';
  setTimeout(() => {
    msgDiv.textContent = '';
  }, 3000); // Message disappears after 3 seconds
}

// --- Default Ruhani Nuskha Content (for reset functionality) ---
const defaultRuhaniNuskha = `[Goals]
Goal1: Cultivate constant Taqwa during Browse.
Sankalpa1: Deepen Ehsaas of Tri Devi presence.
Focus1: Practice Shukr more actively.

[DynamicState]
CurrentDeviFocus: Maa Saraswati (Wisdom & Clarity)
ReminderFrequency: Gentle
WaqfaTheme: NatureSounds
PluginMood: Calm
OverallEhsaasIntensity: 0.5

[UserParams]
DhikrList: Om Aim Hrim Klim Chamundaye Vichche, Jai Mata Di, SubhanAllah
PositiveKeywordsForSankalpaSeed: research, learn, understand, create, complete, reflect
MuraqabaThemePreference: gentlePulse
MuraqabaIntensityPreference: 30
WaqfaChimeFile: sounds/chime1.mp3
DhikrAudioFile: sounds/dhikr_om.mp3
MuraqabaBackgroundImage: images/backgrounds/fractal_blue.png
FirasahPromptFrequency: occasional
MaqamAnalysisEnabled: true
SubconsciousVerbalRituals: In this moment, I am peace.
Divine wisdom guides my choices.

[FeatureToggles]
EnableMuraqaba: true
EnableDhikr: true
EnableShukr: true 
EnableWaqfa: true
EnableDhikrStreamSound: false
EnableShukrAffirmationSound: true
EnableNiyyahVisualizer: true
EnableMaqamAnalysis: true
EnableFirasahPrompts: true
EnableSubconsciousVerbalRituals: true

[ThematicDays]
MondayTheme: Peace & Reflection (FocusDevi: ChandraDeva, Muraqaba: calmBlue, DhikrKeywords: shanti, salam)
FridayTheme: Love & Beauty (FocusDevi: Lakshmi/Venus, Muraqaba: goldenLight, BarakahKeywords: joy, love)
SpecialDate_2024-03-15: Day of Gratitude (PluginMood: Grateful, ShukrFocus: High)
`;

// NEW: Input elements for Ruhaani Rabt
const enableSatsangRoomToggle = document.getElementById('enableSatsangRoomToggle');
const enableKhidmatPortalToggle = document.getElementById('enableKhidmatPortalToggle');
const enableAnamnesisExchangeToggle = document.getElementById('enableAnamnesisExchangeToggle');
const enableMuraqabaMushtarakToggle = document.getElementById('enableMuraqabaMushtarakToggle');
const communityKeywordsInput = document.getElementById('communityKeywordsInput');
const khidmatOfferInput = document.getElementById('khidmatOfferInput');
const khidmatRequestInput = document.getElementById('khidmatRequestInput');
const anamnesisInput = document.getElementById('anamnesisInput');
const submitAnamnesisBtn = document.getElementById('submitAnamnesisBtn');
const anamnesisConfirmationDiv = document.getElementById('anamnesisConfirmation');


// Get references to HTML elements
const refreshSnapshotBtn = document.getElementById('refreshSnapshotBtn');
const ruhaniNuskhaTextarea = document.getElementById('ruhaniNuskhaContent');
const loadNuskhaBtn = document.getElementById('loadNuskhaBtn');
const saveNuskhaBtn = document.getElementById('saveNuskhaBtn');
const exportNuskhaBtn = document.getElementById('exportNuskhaBtn');
const importNuskhaFile = document.getElementById('importNuskhaFile');
const resetNuskhaBtn = document.getElementById('resetNuskhaBtn');

// Feature Toggles
const enableMuraqabaToggle = document.getElementById('enableMuraqaba');
const enableDhikrToggle = document.getElementById('enableDhikr');
const enableDhikrStreamSoundToggle = document.getElementById('enableDhikrStreamSound');
const enableShukrToggle = document.getElementById('enableShukr');
const enableShukrAffirmationSoundToggle = document.getElementById('enableShukrAffirmationSound');
const enableWaqfaToggle = document.getElementById('enableWaqfa');
const enableNiyyahVisualizerToggle = document.getElementById('enableNiyyahVisualizer');
const enableMaqamAnalysisToggle = document.getElementById('enableMaqamAnalysis');
const enableFirasahPromptsToggle = document.getElementById('enableFirasahPrompts');
const enableSubconsciousVerbalRitualsToggle = document.getElementById('enableSubconsciousVerbalRituals');


// User Params
const reminderFrequencySelect = document.getElementById('reminderFrequency');
const waqfaChimeFileSelect = document.getElementById('waqfaChimeFile');
const dhikrAudioFileSelect = document.getElementById('dhikrAudioFile');
const muraqabaThemePreferenceSelect = document.getElementById('muraqabaThemePreference');
const muraqabaBackgroundImageSelect = document.getElementById('muraqabaBackgroundImage');
const muraqabaBackgroundImageWrapper = document.getElementById('muraqabaBackgroundImageWrapper');
const muraqabaIntensityPreferenceRange = document.getElementById('muraqabaIntensityPreference');
const muraqabaIntensityValueSpan = document.getElementById('muraqabaIntensityValue');
const dhikrListInput = document.getElementById('dhikrList');
const dhikrOpacityBaseRange = document.getElementById('dhikrOpacityBase');
const dhikrOpacityBaseValueSpan = document.getElementById('dhikrOpacityBaseValue');
const dhikrFontSizeBaseRange = document.getElementById('dhikrFontSizeBase');
const dhikrFontSizeBaseValueSpan = document.getElementById('dhikrFontSizeBaseValue');
const firasahPromptFrequencySelect = document.getElementById('firasahPromptFrequency');
const subconsciousVerbalRitualsTextarea = document.getElementById('subconsciousVerbalRituals');


// Snapshot Span IDs (ensure these match your HTML)
const snapIntensity = document.getElementById('snapshotIntensity');
const snapPluginMood = document.getElementById('snapshotPluginMood');
const snapDeviFocus = document.getElementById('snapshotDeviFocus');
const snapMuraqabaPref = document.getElementById('snapshotMuraqabaPref');
const snapDhikrEnabled = document.getElementById('snapshotDhikrEnabled');


// Load settings when the options page is opened
document.addEventListener('DOMContentLoaded', function() {

  // NEW: Initialize Ruhaani Rabt feature toggles
  function initializeRuhaaniRabtToggles(settings) {
      if (enableSatsangRoomToggle) enableSatsangRoomToggle.checked = settings?.featureToggles?.EnableSatsangRoom === true;
      if (enableKhidmatPortalToggle) enableKhidmatPortalToggle.checked = settings?.featureToggles?.EnableKhidmatPortal === true;
      if (enableAnamnesisExchangeToggle) enableAnamnesisExchangeToggle.checked = settings?.featureToggles?.EnableAnamnesisExchange === true;
      if (enableMuraqabaMushtarakToggle) enableMuraqabaMushtarakToggle.checked = settings?.featureToggles?.EnableMuraqabaMushtarak === true;
      if (communityKeywordsInput) communityKeywordsInput.value = settings?.userParams?.CommunityKeywords?.join(', ') || '';
      if (khidmatOfferInput) khidmatOfferInput.value = settings?.userParams?.KhidmatOffer?.join(', ') || '';
      if (khidmatRequestInput) khidmatRequestInput.value = settings?.userParams?.KhidmatRequest?.join(', ') || '';
  }

  // NEW: Save Ruhaani Rabt settings when saving Nuskha
  saveNuskhaBtn.addEventListener('click', function() {
    // ... existing save logic ...
    
    // Capture new Ruhaani Rabt settings
    const currentNuskhaContent = ruhaniNuskhaTextarea.value;
    let parsedSettings = parseRuhaniNuskha(currentNuskhaContent);

    // Update feature toggles
    parsedSettings.featureToggles.EnableSatsangRoom = enableSatsangRoomToggle.checked;
    parsedSettings.featureToggles.EnableKhidmatPortal = enableKhidmatPortalToggle.checked;
    parsedSettings.featureToggles.EnableAnamnesisExchange = enableAnamnesisExchangeToggle.checked;
    parsedSettings.featureToggles.EnableMuraqabaMushtarak = enableMuraqabaMushtarakToggle.checked;

    // Update userParams for communal interaction
    parsedSettings.userParams.CommunityKeywords = communityKeywordsInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    parsedSettings.userParams.KhidmatOffer = khidmatOfferInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    parsedSettings.userParams.KhidmatRequest = khidmatRequestInput.value.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const updatedNuskhaContent = formatRuhaniNuskha(parsedSettings);
    chrome.storage.local.set({ ruhaniNuskhaContent: updatedNuskhaContent }, function() {
        showConfirmation('Lauh-e-Mahfooz saved!', false);
        // Also ensure background.js gets updated settings immediately
        chrome.runtime.sendMessage({ action: "settingsUpdated" }, (response) => {
            console.log("Settings update broadcast response:", response);
        });
    });
  });

  // NEW: Submit Anamnesis Insight
  if (submitAnamnesisBtn && anamnesisInput && anamnesisConfirmationDiv) {
      submitAnamnesisBtn.addEventListener('click', () => {
          const insight = anamnesisInput.value.trim();
          if (insight) {
              // SECURITY: Ensure insight is clean, although it's text for now
              // If it were ever HTML, it would need sanitization.
              chrome.runtime.sendMessage({ action: "submitAnamnesis", insight: insight }, (response) => {
                  anamnesisConfirmationDiv.textContent = response.status;
                  anamnesisInput.value = ''; // Clear input
                  setTimeout(() => { anamnesisConfirmationDiv.textContent = ''; }, 3000);
                  // Refresh snapshot or indicate success
              });
          } else {
              showConfirmation('Please enter an insight to submit.', true);
          }
      });
  }

  // --- Nuskha Integrity Check (Conceptual for Security) ---
  function validateRuhaniNuskhaFormat(nuskhaContent) {
      const requiredSections = ['[Goals]', '[DynamicState]', '[UserParams]', '[FeatureToggles]'];
      let isValid = true;
      for (const section of requiredSections) {
          if (!nuskhaContent.includes(section)) {
              isValid = false;
              console.error(`RuhaniNuskha missing critical section: ${section}`);
              break;
          }
      }
      // Add more rigorous parsing checks as needed (e.g., valid key-value pairs)
      return isValid;
  }

  // Modify loadNuskhaBtn to include integrity check
  if (loadNuskhaBtn) {
    loadNuskhaBtn.addEventListener('click', function() {
      chrome.storage.local.get('ruhaniNuskhaContent', function(data) {
        if (data.ruhaniNuskhaContent) {
          if (ruhaniNuskhaTextarea) ruhaniNuskhaTextarea.value = data.ruhaniNuskhaContent;
          if (validateRuhaniNuskhaFormat(data.ruhaniNuskhaContent)) {
              showConfirmation('Lauh-e-Mahfooz loaded from storage.', false);
              // Also parse and apply to toggles and inputs
              const settings = parseRuhaniNuskha(data.ruhaniNuskhaContent);
              initializeFeatureToggles(settings); // Existing function
              initializeRuhaaniRabtToggles(settings); // NEW: initialize new toggles/inputs
              updateSnapshot(settings); // Update snapshot display
          } else {
              showConfirmation('Warning: Lauh-e-Mahfooz format seems invalid. Please review.', true);
          }
        } else {
          showConfirmation('No Lauh-e-Mahfooz found in storage. Using default.', false);
          if (ruhaniNuskhaTextarea) ruhaniNuskhaTextarea.value = defaultRuhaniNuskha;
          // Also parse and apply to toggles and inputs for default
          const settings = parseRuhaniNuskha(defaultRuhaniNuskha);
          initializeFeatureToggles(settings);
          initializeRuhaaniRabtToggles(settings);
          updateSnapshot(settings);
        }
      });
    });
  }

function loadSettings() {
  chrome.storage.local.get(['ruhaniNuskhaContent', 'shukrCount', 'currentNiyyah',
                            'EnableMuraqaba', 'EnableDhikr', 'EnableShukr', 'EnableWaqfa',
                            'EnableDhikrStreamSound', 'EnableShukrAffirmationSound', 'EnableNiyyahVisualizer',
                            'EnableMaqamAnalysis', 'EnableFirasahPrompts', 'EnableSubconsciousVerbalRituals', // New toggles
                            'ReminderFrequency', 'WaqfaChimeFile', 'DhikrAudioFile', // New user params
                            'MuraqabaThemePreference', 'MuraqabaIntensityPreference', 'MuraqabaBackgroundImage',
                            'DhikrList', 'DhikrOpacity_Base', 'DhikrFontSize_Base', 'FirasahPromptFrequency',
                            'SubconsciousVerbalRituals', // New user params
                            'OverallEhsaasIntensity', 'PluginMood', 'CurrentDeviFocus' // Dynamic state from background
                          ], function(items) {
    // Populate RuhaniNuskha textarea
    if (ruhaniNuskhaTextarea) {
      ruhaniNuskhaTextarea.value = items.ruhaniNuskhaContent || defaultRuhaniNuskha;
    }

    // Populate Feature Toggles
    if (enableMuraqabaToggle) enableMuraqabaToggle.checked = items.EnableMuraqaba !== false; // Default true
    if (enableDhikrToggle) enableDhikrToggle.checked = items.EnableDhikr !== false; // Default true
    if (enableShukrToggle) enableShukrToggle.checked = items.EnableShukr !== false; // Default true
    if (enableWaqfaToggle) enableWaqfaToggle.checked = items.EnableWaqfa !== false; // Default true
    if (enableDhikrStreamSoundToggle) enableDhikrStreamSoundToggle.checked = items.EnableDhikrStreamSound === true;
    if (enableShukrAffirmationSoundToggle) enableShukrAffirmationSoundToggle.checked = items.EnableShukrAffirmationSound !== false;
    if (enableNiyyahVisualizerToggle) enableNiyyahVisualizerToggle.checked = items.EnableNiyyahVisualizer !== false;
    if (enableMaqamAnalysisToggle) enableMaqamAnalysisToggle.checked = items.EnableMaqamAnalysis !== false;
    if (enableFirasahPromptsToggle) enableFirasahPromptsToggle.checked = items.EnableFirasahPrompts !== false;
    if (enableSubconsciousVerbalRitualsToggle) enableSubconsciousVerbalRitualsToggle.checked = items.EnableSubconsciousVerbalRituals !== false;


    // Populate User Params
    if (reminderFrequencySelect) reminderFrequencySelect.value = items.ReminderFrequency || "Gentle";
    if (waqfaChimeFileSelect) waqfaChimeFileSelect.value = items.WaqfaChimeFile || "sounds/chime1.mp3";
    if (dhikrAudioFileSelect) dhikrAudioFileSelect.value = items.DhikrAudioFile || "sounds/dhikr_om.mp3";
    if (muraqabaThemePreferenceSelect) muraqabaThemePreferenceSelect.value = items.MuraqabaThemePreference || "gentlePulse";
    if (muraqabaBackgroundImageSelect) muraqabaBackgroundImageSelect.value = items.MuraqabaBackgroundImage || "images/backgrounds/fractal_blue.png";
    if (muraqabaIntensityPreferenceRange) {
        muraqabaIntensityPreferenceRange.value = items.MuraqabaIntensityPreference !== undefined ? items.MuraqabaIntensityPreference : 30;
        muraqabaIntensityValueSpan.textContent = `${muraqabaIntensityPreferenceRange.value}%`;
    }
    if (dhikrListInput) dhikrListInput.value = items.DhikrList || "Om Aim Hrim Klim Chamundaye Vichche, Jai Mata Di, SubhanAllah";
    if (dhikrOpacityBaseRange) {
        dhikrOpacityBaseRange.value = items.DhikrOpacity_Base !== undefined ? items.DhikrOpacity_Base : 5; // Default low opacity
        dhikrOpacityBaseValueSpan.textContent = `${dhikrOpacityBaseRange.value}%`;
    }
    if (dhikrFontSizeBaseRange) {
        dhikrFontSizeBaseRange.value = items.DhikrFontSize_Base !== undefined ? items.DhikrFontSize_Base : 20;
        dhikrFontSizeBaseValueSpan.textContent = `${dhikrFontSizeBaseRange.value}px`;
    }
    if (firasahPromptFrequencySelect) firasahPromptFrequencySelect.value = items.FirasahPromptFrequency || "occasional";
    if (subconsciousVerbalRitualsTextarea) subconsciousVerbalRitualsTextarea.value = items.SubconsciousVerbalRituals || defaultRuhaniNuskha.split('[UserParams]')[1].split('[FeatureToggles]')[0].match(/SubconsciousVerbalRituals: (.*)/s)[1].trim().split('\n').map(line => line.trim()).join('\n'); // Extract from default string


    // Update snapshot display (from dynamic state)
    if (snapIntensity) snapIntensity.textContent = items.OverallEhsaasIntensity !== undefined ? `${(items.OverallEhsaasIntensity * 100).toFixed(0)}%` : 'N/A';
    if (snapPluginMood) snapPluginMood.textContent = items.PluginMood || 'N/A';
    if (snapDeviFocus) snapDeviFocus.textContent = items.CurrentDeviFocus || 'N/A';
    if (snapMuraqabaPref) snapMuraqabaPref.textContent = items.MuraqabaThemePreference || 'N/A';
    if (snapDhikrEnabled) snapDhikrEnabled.textContent = items.EnableDhikr ? 'Yes' : 'No';

    // Toggle visibility of Muraqaba Background Image dropdown
    updateMuraqabaBackgroundImageVisibility();
  });
}

function saveSettings() {
  const settingsToSave = {
    // RuhaniNuskha.txt content
    ruhaniNuskhaContent: ruhaniNuskhaTextarea ? ruhaniNuskhaTextarea.value : defaultRuhaniNuskha,

    // Feature Toggles
    EnableMuraqaba: enableMuraqabaToggle ? enableMuraqabaToggle.checked : true,
    EnableDhikr: enableDhikrToggle ? enableDhikrToggle.checked : true,
    EnableShukr: enableShukrToggle ? enableShukrToggle.checked : true,
    EnableWaqfa: enableWaqfaToggle ? enableWaqfaToggle.checked : true,
    EnableDhikrStreamSound: enableDhikrStreamSoundToggle ? enableDhikrStreamSoundToggle.checked : false,
    EnableShukrAffirmationSound: enableShukrAffirmationSoundToggle ? enableShukrAffirmationSoundToggle.checked : true,
    EnableNiyyahVisualizer: enableNiyyahVisualizerToggle ? enableNiyyahVisualizerToggle.checked : true,
    EnableMaqamAnalysis: enableMaqamAnalysisToggle ? enableMaqamAnalysisToggle.checked : true,
    EnableFirasahPrompts: enableFirasahPromptsToggle ? enableFirasahPromptsToggle.checked : true,
    EnableSubconsciousVerbalRituals: enableSubconsciousVerbalRitualsToggle ? enableSubconsciousVerbalRitualsToggle.checked : true,

    // User Params
    ReminderFrequency: reminderFrequencySelect ? reminderFrequencySelect.value : "Gentle",
    WaqfaChimeFile: waqfaChimeFileSelect ? waqfaChimeFileSelect.value : "sounds/chime1.mp3",
    DhikrAudioFile: dhikrAudioFileSelect ? dhikrAudioFileSelect.value : "sounds/dhikr_om.mp3",
    MuraqabaThemePreference: muraqabaThemePreferenceSelect ? muraqabaThemePreferenceSelect.value : "gentlePulse",
    MuraqabaBackgroundImage: muraqabaBackgroundImageSelect ? muraqabaBackgroundImageSelect.value : "images/backgrounds/fractal_blue.png",
    MuraqabaIntensityPreference: muraqabaIntensityPreferenceRange ? parseInt(muraqabaIntensityPreferenceRange.value) : 30,
    DhikrList: dhikrListInput ? dhikrListInput.value : "Om Aim Hrim Klim Chamundaye Vichche, Jai Mata Di, SubhanAllah",
    DhikrOpacity_Base: dhikrOpacityBaseRange ? parseInt(dhikrOpacityBaseRange.value) : 5,
    DhikrFontSize_Base: dhikrFontSizeBaseRange ? parseInt(dhikrFontSizeBaseRange.value) : 20,
    FirasahPromptFrequency: firasahPromptFrequencySelect ? firasahPromptFrequencySelect.value : "occasional",
    SubconsciousVerbalRituals: subconsciousVerbalRitualsTextarea ? subconsciousVerbalRitualsTextarea.value : ""
  };

  chrome.storage.local.set(settingsToSave, function() {
    if (chrome.runtime.lastError) {
      showConfirmation('Error saving settings: ' + chrome.runtime.lastError.message, true);
    } else {
      showConfirmation('Settings saved! Alhamdulillah.', false);
    }
  });
}

// Event Listeners
if (loadNuskhaBtn) loadNuskhaBtn.addEventListener('click', loadSettings); // Re-load all settings
if (saveNuskhaBtn) saveNuskhaBtn.addEventListener('click', saveSettings);
if (refreshSnapshotBtn) refreshSnapshotBtn.addEventListener('click', loadSettings); // Refresh snapshot

if (exportNuskhaBtn) {
    exportNuskhaBtn.addEventListener('click', function() {
      const content = ruhaniNuskhaTextarea ? ruhaniNuskhaTextarea.value : defaultRuhaniNuskha;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RuhaniNuskha.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showConfirmation('Lauh-e-Mahfooz exported as RuhaniNuskha.txt.', false);
    });
}

if (importNuskhaFile) {
    importNuskhaFile.addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          if (ruhaniNuskhaTextarea) ruhaniNuskhaTextarea.value = e.target.result;
          showConfirmation(`Loaded content from ${file.name}. Remember to 'Save to Storage'.`, false);
        };
        reader.readAsText(file);
      }
    });
}
  
if (resetNuskhaBtn) {
    resetNuskhaBtn.addEventListener('click', function() {
      if (confirm("Are you sure you want to reset Lauh-e-Mahfooz to its default content? This cannot be undone from here.")) {
        if (ruhaniNuskhaTextarea) ruhaniNuskhaTextarea.value = defaultRuhaniNuskha;
        // Also save it to storage immediately
        chrome.storage.local.set({ ruhaniNuskhaContent: defaultRuhaniNuskha }, function() {
            showConfirmation('Lauh-e-Mahfooz reset to defaults and saved.', false);
            loadSettings(); // Reload all settings to reflect default in other fields
        });
      }
    });
}

// Event listeners for new UI elements to trigger save on change
if (enableMuraqabaToggle) enableMuraqabaToggle.addEventListener('change', saveSettings);
if (enableDhikrToggle) enableDhikrToggle.addEventListener('change', saveSettings);
if (enableDhikrStreamSoundToggle) enableDhikrStreamSoundToggle.addEventListener('change', saveSettings);
if (enableShukrToggle) enableShukrToggle.addEventListener('change', saveSettings);
if (enableShukrAffirmationSoundToggle) enableShukrAffirmationSoundToggle.addEventListener('change', saveSettings);
if (enableWaqfaToggle) enableWaqfaToggle.addEventListener('change', saveSettings);
if (enableNiyyahVisualizerToggle) enableNiyyahVisualizerToggle.addEventListener('change', saveSettings);
if (enableMaqamAnalysisToggle) enableMaqamAnalysisToggle.addEventListener('change', saveSettings);
if (enableFirasahPromptsToggle) enableFirasahPromptsToggle.addEventListener('change', saveSettings);
if (enableSubconsciousVerbalRitualsToggle) enableSubconsciousVerbalRitualsToggle.addEventListener('change', saveSettings);


if (reminderFrequencySelect) reminderFrequencySelect.addEventListener('change', saveSettings);
if (waqfaChimeFileSelect) waqfaChimeFileSelect.addEventListener('change', saveSettings);
if (dhikrAudioFileSelect) dhikrAudioFileSelect.addEventListener('change', saveSettings);
if (muraqabaThemePreferenceSelect) {
    muraqabaThemePreferenceSelect.addEventListener('change', () => {
        updateMuraqabaBackgroundImageVisibility();
        saveSettings();
    });
}
if (muraqabaBackgroundImageSelect) muraqabaBackgroundImageSelect.addEventListener('change', saveSettings);
if (muraqabaIntensityPreferenceRange) {
    muraqabaIntensityPreferenceRange.addEventListener('input', () => {
        muraqabaIntensityValueSpan.textContent = `${muraqabaIntensityPreferenceRange.value}%`;
    });
    muraqabaIntensityPreferenceRange.addEventListener('change', saveSettings);
}
if (dhikrListInput) dhikrListInput.addEventListener('change', saveSettings);
if (dhikrOpacityBaseRange) {
    dhikrOpacityBaseRange.addEventListener('input', () => {
        dhikrOpacityBaseValueSpan.textContent = `${dhikrOpacityBaseRange.value}%`;
    });
    dhikrOpacityBaseRange.addEventListener('change', saveSettings);
}
if (dhikrFontSizeBaseRange) {
    dhikrFontSizeBaseRange.addEventListener('input', () => {
        dhikrFontSizeBaseValueSpan.textContent = `${dhikrFontSizeBaseRange.value}px`;
    });
    dhikrFontSizeBaseRange.addEventListener('change', saveSettings);
}
if (firasahPromptFrequencySelect) firasahPromptFrequencySelect.addEventListener('change', saveSettings);
if (subconsciousVerbalRitualsTextarea) subconsciousVerbalRitualsTextarea.addEventListener('change', saveSettings);

function updateMuraqabaBackgroundImageVisibility() {
    if (muraqabaThemePreferenceSelect && muraqabaBackgroundImageWrapper) {
        if (muraqabaThemePreferenceSelect.value === 'backgroundImage') {
            muraqabaBackgroundImageWrapper.style.display = 'block';
        } else {
            muraqabaBackgroundImageWrapper.style.display = 'none';
        }
    }
}

// In options.js, within DOMContentLoaded listener
const geminiApiKeyInput = document.getElementById('geminiApiKey');
const lmStudioEndpointInput = document.getElementById('lmStudioEndpoint');
const saveAiSettingsBtn = document.getElementById('saveAiSettingsBtn');

// Load settings
chrome.storage.local.get(['geminiApiKey', 'lmStudioEndpoint'], (data) => {
  if (geminiApiKeyInput) geminiApiKeyInput.value = data.geminiApiKey || '';
  if (lmStudioEndpointInput) lmStudioEndpointInput.value = data.lmStudioEndpoint || 'http://localhost:1234/v1/chat/completions';
});

// Save settings
if (saveAiSettingsBtn) {
  saveAiSettingsBtn.addEventListener('click', () => {
    chrome.storage.local.set({
      geminiApiKey: geminiApiKeyInput.value,
      lmStudioEndpoint: lmStudioEndpointInput.value
    }, () => {
      showConfirmation('saved?', false);
    });
  });
}

// --- Hidden/Advanced Options for App Integrity & Abuse Prevention ---

// 1. Hidden Debug Mode Toggle (not visible in UI, but can be enabled via console)
let _debugMode = false;
window.enableDebugMode = function() {
  _debugMode = true;
  console.log("Debug mode enabled. Extra logs and diagnostics will be shown.");
};
window.disableDebugMode = function() {
  _debugMode = false;
  console.log("Debug mode disabled.");
};

// 2. Tamper Detection (detects if critical settings are changed too quickly)
let lastSettingsSave = Date.now();
function tamperDetection() {
  const now = Date.now();
  if (now - lastSettingsSave < 1000) {
    alert("Settings are being changed too quickly. Please slow down.");
    // Optionally, revert or lock out
  }
  lastSettingsSave = now;
}
if (typeof saveSettings === "function") {
  const origSaveSettings = saveSettings;
  window.saveSettings = function() {
    tamperDetection();
    origSaveSettings.apply(this, arguments);
  };
}

// 3. Hidden "Safe Mode" (can be triggered via console to disable risky features)
window.enableSafeMode = function() {
  localStorage.setItem('safeMode', 'on');
  alert("Safe Mode enabled. Some features will be disabled for stability.");
  // Optionally, disable certain toggles or features here
};
window.disableSafeMode = function() {
  localStorage.removeItem('safeMode');
  alert("Safe Mode disabled.");
};

// 4. Hidden "Lockdown" (temporarily disables all user input)
window.lockdownApp = function() {
  document.body.innerHTML = "<div style='color:red;font-size:2em;text-align:center;margin-top:40px;'>App is in lockdown mode for security reasons.</div>";
  setTimeout(() => location.reload(), 10000);
};

// 5. Hidden "Reset All" (wipe all settings, only via console)
window.resetAllSettings = function() {
  if (confirm("Are you sure you want to wipe all settings? This cannot be undone.")) {
    chrome.storage.local.clear(() => {
      localStorage.clear();
      alert("All settings wiped. Reloading...");
      location.reload();
    });
  }
};

// 6. Hidden "Block Annoying User" (simulate, for demo)
window.blockAnnoyingUser = function() {
  alert("You have been blocked for suspicious activity. Please contact support.");
  document.body.innerHTML = "<div style='color:red;font-size:2em;text-align:center;margin-top:40px;'>Blocked for suspicious activity.</div>";
};

// 7. Hidden "Stealth Logging" (logs suspicious actions, not visible to user)
function stealthLog(event, detail) {
  let logs = JSON.parse(localStorage.getItem('stealthLogs') || "[]");
  logs.push({ event, detail, time: new Date().toISOString() });
  localStorage.setItem('stealthLogs', JSON.stringify(logs));
}
window._stealthLog = stealthLog;

// 8. Hidden "Rate Limiting" (prevent rapid abuse)
let lastActionTime = 0;
function rateLimitCheck() {
  const now = Date.now();
  if (now - lastActionTime < 500) {
    alert("You're doing that too fast. Please wait a moment.");
    return false;
  }
  lastActionTime = now;
  return true;
}

// Example: wrap a sensitive function
// if (saveSettings) {
//   const origSave = saveSettings;
//   window.saveSettings = function() {
//     if (rateLimitCheck()) origSave.apply(this, arguments);
//   };
// }

// 9. Hidden "Admin Only" Feature (only works if a secret code is set)
window.enableAdminFeatures = function(secret) {
  if (secret === "letmein123") {
    window._isAdmin = true;
    alert("Admin features enabled.");
  } else {
    alert("Wrong secret.");
  }
};

// 10. Hidden "Self-Heal" (restore defaults if corruption detected)
function selfHealIfCorrupt() {
  chrome.storage.local.get('ruhaniNuskhaContent', function(data) {
    if (!data.ruhaniNuskhaContent || data.ruhaniNuskhaContent.length < 50) {
      chrome.storage.local.set({ ruhaniNuskhaContent: defaultRuhaniNuskha }, function() {
        showConfirmation('Corruption detected. Restored to default.', true);
      });
    }
  });
}
setTimeout(selfHealIfCorrupt, 3000);

// --- Debugging Helper ---
function debugLog(msg, ...args) {
  try {
    console.debug('[Dil ki Dastak][Options]', msg, ...args);
    // Optionally, also show in a visible debug area if present
    let dbg = document.getElementById('firefoxDebugLog');
    if (dbg) {
      dbg.innerHTML += `[${new Date().toLocaleTimeString()}] ${msg}<br>`;
      if (dbg.childNodes.length > 100) dbg.innerHTML = dbg.innerHTML.split('<br>').slice(-100).join('<br>');
    }
  } catch (e) {
    // Fallback to console only
    console.debug('[Dil ki Dastak][Options][DebugLogError]', e);
  }
}

// --- Add debug log area if not present ---
(function() {
  if (!document.getElementById('firefoxDebugLog')) {
    const dbg = document.createElement('div');
    dbg.id = 'firefoxDebugLog';
    dbg.style.background = '#fff3cd';
    dbg.style.color = '#856404';
    dbg.style.fontSize = '0.95em';
    dbg.style.padding = '8px 12px';
    dbg.style.margin = '12px 0 18px 0';
    dbg.style.border = '1px solid #ffeeba';
    dbg.style.borderRadius = '6px';
    dbg.style.maxHeight = '120px';
    dbg.style.overflowY = 'auto';
    dbg.innerHTML = '<b>Debug Log:</b><br>';
    document.body && document.body.insertBefore(dbg, document.body.firstChild);
  }
  debugLog('Options page JS loaded. UserAgent: ' + navigator.userAgent);
  if (typeof browser !== 'undefined') {
    debugLog('browser.* API detected (likely Firefox).');
  } else if (typeof chrome !== 'undefined') {
    debugLog('chrome.* API detected (likely Chromium).');
  } else {
    debugLog('No browser/chrome API detected!');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  debugLog('DOMContentLoaded event fired.');
  // ...existing code...
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(null, function(items) {
      if (chrome.runtime && chrome.runtime.lastError) {
        debugLog('Storage get error: ' + chrome.runtime.lastError.message);
      } else {
        debugLog('Storage get success. Keys: ' + Object.keys(items).join(', '));
      }
    });
  }
  // ...existing code...
});

// Add debug logging to key actions
[
  'saveNuskhaBtn', 'loadNuskhaBtn', 'exportNuskhaBtn', 'importNuskhaFile', 'resetNuskhaBtn',
  'saveAiSettingsBtn', 'refreshSnapshotBtn', 'submitAnamnesisBtn'
].forEach(function(id) {
  const el = document.getElementById(id);
  if (el) {
    el.addEventListener('click', function() {
      debugLog('Clicked: #' + id);
    });
  }
});

// Listen for errors globally
window.addEventListener('error', function(e) {
  debugLog('Global error: ' + e.message + ' at ' + e.filename + ':' + e.lineno);
});
window.addEventListener('unhandledrejection', function(e) {
  debugLog('Unhandled promise rejection: ' + (e.reason && e.reason.message ? e.reason.message : e.reason));
});
