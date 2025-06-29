// popup_reflection.js
 
document.addEventListener('DOMContentLoaded', function() {
  // Inject advanced styles for consistency
  if (!document.getElementById('advancedPopupStyles')) {
    const style = document.createElement('style');
    style.id = 'advancedPopupStyles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
      body {
        background: linear-gradient(135deg, #fffde7 0%, #ede7f6 100%);
        font-family: 'Segoe UI', 'Noto Sans', 'Helvetica Neue', Arial, sans-serif;
        color: #311b92;
        margin: 0;
        padding: 18px 10px 10px 10px;
        min-width: 340px;
        min-height: 420px;
        border-radius: 18px;
        box-shadow: 0 8px 32px 0 rgba(49,27,146,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.08);
      }
      .reflection-section {
        background: rgba(255,255,255,0.92);
        border-radius: 12px;
        margin-bottom: 18px;
        padding: 16px 14px 14px 14px;
        box-shadow: 0 2px 8px rgba(49,27,146,0.06);
      }
      .reflection-title {
        color: #4527a0;
        font-size: 1.2em;
        font-weight: 700;
        margin-bottom: 10px;
        letter-spacing: 0.5px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .reflection-prompt {
        font-size: 1.08em;
        color: #4a148c;
        background: #f3e5f5;
        border-radius: 8px;
        padding: 10px 14px;
        margin: 10px 0 18px 0;
        box-shadow: 0 1px 4px rgba(49,27,146,0.06);
        font-style: italic;
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }
      .reflection-btn {
        background: linear-gradient(90deg, #ffd54f 0%, #7e57c2 100%);
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
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .reflection-btn:hover {
        background: linear-gradient(90deg, #7e57c2 0%, #ffd54f 100%);
        color: #fff;
        transform: scale(1.04);
      }
      .material-symbols-outlined {
        font-family: 'Material Symbols Outlined', sans-serif;
        font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        font-size: 1.2em;
        vertical-align: middle;
      }
      .emoji {
        font-size: 1.3em;
        vertical-align: middle;
        margin-right: 2px;
      }
      .info-icon {
        font-size: 1.1em;
        margin-right: 4px;
        color: #7e57c2;
        vertical-align: middle;
      }
      #popupTaskbar {
        font-family: inherit;
      }
      .taskbar-btn-icon {
        font-size: 1.3em;
        margin-right: 4px;
        vertical-align: middle;
      }
    `;
    document.head.appendChild(style);
  }

  // Main container
  const section = document.createElement('div');
  section.className = 'reflection-section';

  // Title with emoji and icon
  const title = document.createElement('div');
  title.className = 'reflection-title';
  title.innerHTML = `<span class="emoji">🌙</span>Deep Reflection Prompt
    <span class="material-symbols-outlined" title="Reflect">psychology_alt</span>`;

  // Prompt area with emoji
  const promptDiv = document.createElement('div');
  promptDiv.className = 'reflection-prompt';
  promptDiv.id = 'reflectionPromptDiv';

  // Button with icon
  const btn = document.createElement('button');
  btn.className = 'reflection-btn';
  btn.innerHTML = `<span class="material-symbols-outlined">refresh</span>Show Another Reflection`;

  // Prompts (import or define here)
  // Updated: Focus on offline passion, helpfulness, and real-world kindness
  const reflectionPrompts = [
    "🌱 What is one small act of kindness you can do for someone offline today?",
    "🤲 How can you help a neighbor or family member without expecting anything in return?",
    "📵 When was the last time you spent an hour offline doing something you love? What was it?",
    "📝 Write a note of gratitude by hand and give it to someone who inspires you.",
    "🌳 Take a walk outside and notice something beautiful you’ve never seen before.",
    "🍲 Can you prepare a meal or snack for someone who might appreciate it?",
    "📚 Share a favorite book, poem, or story with a friend or child in person.",
    "🎨 Create something with your hands (art, craft, repair) and gift it to someone.",
    "🧹 Offer to help with a simple chore or task for someone who could use a break.",
    "💬 Have a meaningful, device-free conversation with someone today.",
    "🎶 Sing or play music for someone, or just listen deeply to their favorite song.",
    "🌸 Plant a flower or tree, or care for a living thing in your environment.",
    "🕯️ Light a candle or lamp and say a silent prayer for someone in need.",
    "🚶‍♂️ Go for a mindful walk and reflect on how you can be more helpful in your community.",
    "🧘‍♀️ Take a few minutes to breathe deeply and send positive thoughts to someone struggling.",
    "🛠️ Fix or mend something for someone, even if it’s a small repair.",
    "📦 Donate an item you no longer need to someone who could use it.",
    "🧡 Recall a time someone helped you offline. How did it feel? How can you pass it on?",
    "🕊️ Practice patience with someone who tests your limits today.",
    "🌞 Smile at a stranger and notice how it changes your mood and theirs."
  ];

  function showRandomPrompt() {
    const idx = Math.floor(Math.random() * reflectionPrompts.length);
    const prompt = reflectionPrompts[idx];
    const langSelector = document.getElementById('langSelector');
    const langCode = langSelector ? langSelector.value : 'en';
    // Show a loading spinner while translating
    promptDiv.innerHTML = `<span class="emoji">🌐</span> <span class="material-symbols-outlined" style="font-size:1.1em;vertical-align:middle;">hourglass_top</span> Translating...`;
    translatePrompt(prompt, langCode).then(translated => {
      promptDiv.innerHTML = `<span class="emoji">💡</span> ${translated}`;
    });
  }

  btn.onclick = showRandomPrompt;

  // Initial prompt
  showRandomPrompt();

  // Assemble
  section.appendChild(title);
  section.appendChild(promptDiv);
  section.appendChild(btn);
  document.body.appendChild(section);
});

// --- Helper: Info about LM Studio and Llama for users ---
function showModelInfo() {
  const infoDiv = document.createElement('div');
  infoDiv.style.background = '#ede7f6';
  infoDiv.style.color = '#4527a0';
  infoDiv.style.borderRadius = '8px';
  infoDiv.style.padding = '10px 14px';
  infoDiv.style.margin = '14px 0 8px 0';
  infoDiv.style.fontSize = '0.98em';
  infoDiv.style.boxShadow = '0 1px 4px rgba(49,27,146,0.06)';
  infoDiv.innerHTML = `
    <span class="material-symbols-outlined info-icon">info</span>
    <b>🤖 LM Studio vs. Llama:</b><br>
    <ul style="margin:6px 0 0 18px;padding:0;">
      <li><span class="material-symbols-outlined info-icon">desktop_windows</span><b>LM Studio</b> is a desktop app that lets you run many open-source models (including Llama) locally, with a simple API endpoint for chat/completions. It's easy for non-experts.</li>
      <li><span class="material-symbols-outlined info-icon">hub</span><b>Llama</b> is a family of models (by Meta) that can be run via LM Studio, Ollama, or other tools. Llama itself is just the model, not an app.</li>
      <li><span class="material-symbols-outlined info-icon">settings_ethernet</span>For this extension, you can use <b>either</b> by pointing the extension's settings to the LM Studio API endpoint (e.g. <code>http://localhost:1234/v1/chat/completions</code>) and selecting a Llama model in LM Studio.</li>
      <li><span class="material-symbols-outlined info-icon">thumb_up</span>LM Studio is easier for most users. Llama is more flexible for advanced users.</li>
    </ul>
    <b>How to use:</b>
    <ol style="margin:6px 0 0 18px;padding:0;">
      <li><span class="material-symbols-outlined info-icon">download</span>Install <a href="https://lmstudio.ai/" target="_blank">LM Studio</a> and download a Llama model (or any supported model).</li>
      <li><span class="material-symbols-outlined info-icon">play_circle</span>Start LM Studio's API server (usually a button in the app).</li>
      <li><span class="material-symbols-outlined info-icon">settings</span>In the extension's options, set the endpoint to <code>http://localhost:1234/v1/chat/completions</code> and pick your model name.</li>
      <li><span class="material-symbols-outlined info-icon">done</span>Now, the extension can send prompts to your local model!</li>
    </ol>
  `;
  document.body.appendChild(infoDiv);
}

// Show info at the bottom of the popup
document.addEventListener('DOMContentLoaded', function() {
  showModelInfo();
});

// --- Add Taskbar Quick Popups (Reflection, Ritual, Wisdom) ---
document.addEventListener('DOMContentLoaded', function() {
  // Create a floating taskbar at the bottom
  if (!document.getElementById('popupTaskbar')) {
    const taskbar = document.createElement('div');
    taskbar.id = 'popupTaskbar';
    taskbar.style.position = 'fixed';
    taskbar.style.left = '0';
    taskbar.style.right = '0';
    taskbar.style.bottom = '0';
    taskbar.style.height = '48px';
    taskbar.style.background = 'linear-gradient(90deg, #ede7f6 0%, #ffd54f 100%)';
    taskbar.style.display = 'flex';
    taskbar.style.justifyContent = 'center';
    taskbar.style.alignItems = 'center';
    taskbar.style.gap = '18px';
    taskbar.style.boxShadow = '0 -2px 12px rgba(49,27,146,0.10)';
    taskbar.style.zIndex = '9999';
    taskbar.style.borderRadius = '0 0 18px 18px';

    // Helper to open a popup window for each feature
    function openPopupWindow(type) {
      let url = '';
      let title = '';
      let icon = '';
      switch (type) {
        case 'reflection':
          url = chrome.runtime.getURL('popup_reflection.html');
          title = 'Reflection';
          icon = '🌙';
          break;
        case 'ritual':
          url = chrome.runtime.getURL('popup_ritual.html');
          title = 'Ritual';
          icon = '🕉️';
          break;
        case 'wisdom':
          url = chrome.runtime.getURL('popup_wisdom.html');
          title = 'Wisdom';
          icon = '💡';
          break;
        default:
          url = chrome.runtime.getURL('popup_niyyah.html');
          title = 'Dil ki Dastak';
          icon = '🔮';
      }
      window.open(url, title, 'width=420,height=600,noopener,noreferrer');
    }

    // Add buttons for each popup
    const btns = [
      { id: 'taskbarReflectionBtn', label: 'Reflection', type: 'reflection', icon: '🌙' },
      { id: 'taskbarRitualBtn', label: 'Ritual', type: 'ritual', icon: '🕉️' },
      { id: 'taskbarWisdomBtn', label: 'Wisdom', type: 'wisdom', icon: '💡' }
    ];
    btns.forEach(({ id, label, type, icon }) => {
      const btn = document.createElement('button');
      btn.id = id;
      btn.innerHTML = `<span class="taskbar-btn-icon">${icon}</span>${label}`;
      btn.style.background = 'transparent';
      btn.style.border = 'none';
      btn.style.fontSize = '1.15em';
      btn.style.fontWeight = 'bold';
      btn.style.cursor = 'pointer';
      btn.style.color = '#4527a0';
      btn.style.padding = '6px 16px';
      btn.style.borderRadius = '8px';
      btn.style.transition = 'background 0.2s, color 0.2s';
      btn.onmouseover = () => { btn.style.background = '#f3e5f5'; btn.style.color = '#7e57c2'; };
      btn.onmouseout = () => { btn.style.background = 'transparent'; btn.style.color = '#4527a0'; };
      btn.onclick = () => openPopupWindow(type);
      taskbar.appendChild(btn);
    });

    document.body.appendChild(taskbar);
    // Add bottom padding so content is not hidden behind the taskbar
    document.body.style.paddingBottom = '56px';
  }
});

// --- Secret/Custom Language & Universal Language Support ---

// Helper: Generate a "secret" or playful custom language mapping for the user
function getCustomLanguageMap() {
  // Example: map some English words to playful symbols or invented words
  return {
    "reflection": "🔮 Reflektia",
    "wisdom": "🦉 Wizdoma",
    "ritual": "🕉️ Rituál",
    "truth": "✨ Veritas",
    "gratitude": "💖 Shukrino",
    "devotion": "🔥 Devotari",
    "pause": "⏸️ Pauska",
    "breath": "🌬️ Brisa",
    "submission": "🕊️ Istislamo",
    "play": "🎲 Leelix",
    "language": "🗣️ Lango",
    "question": "❓ Questrix",
    "answer": "✅ Responsa",
    "love": "💗 Ishqiya",
    "friend": "🤗 Amiko",
    "blessing": "🌸 Benedix",
    "joy": "😄 Joyka",
    "challenge": "🧩 Challengo",
    "unity": "🔗 Unitas",
    "divine": "🌟 Divinix"
    // ...add more as desired
  };
}

// Helper: Translate a prompt into the custom language
function translatePromptToCustomLang(prompt) {
  const map = getCustomLanguageMap();
  let result = prompt;
  Object.keys(map).forEach(word => {
    // Replace whole words only, case-insensitive
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    result = result.replace(regex, map[word]);
  });
  return result;
}

// Helper: Add a language selector and auto-translate prompts
function addLanguageSelector(reflectionPrompts, showPromptCallback) {
  if (document.getElementById('langSelector')) return;
  const langDiv = document.createElement('div');
  langDiv.style.margin = '8px 0 0 0';
  langDiv.style.display = 'flex';
  langDiv.style.alignItems = 'center';
  langDiv.style.gap = '8px';

  const label = document.createElement('label');
  label.textContent = "🌐 Language:";
  label.style.fontWeight = 'bold';

  const select = document.createElement('select');
  select.id = 'langSelector';
  select.style.borderRadius = '6px';
  select.style.padding = '2px 8px';
  select.style.fontSize = '1em';

  // Add some fun and unusual languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'custom', name: 'Secret Lang' },
    { code: 'es', name: 'Español' },
    { code: 'ar', name: 'العربية' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh', name: '中文' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'el', name: 'Ελληνικά' },
    { code: 'he', name: 'עברית' },
    { code: 'th', name: 'ไทย' },
    { code: 'tlh', name: 'Klingon 🖖' },
    { code: 'eo', name: 'Esperanto' },
    { code: 'emoji', name: 'Emoji Only' }
  ];
  languages.forEach(lang => {
    const opt = document.createElement('option');
    opt.value = lang.code;
    opt.textContent = lang.name;
    select.appendChild(opt);
  });

  langDiv.appendChild(label);
  langDiv.appendChild(select);
  document.body.insertBefore(langDiv, document.body.firstChild);

  // Translation logic for prompts
  select.onchange = function () {
    showPromptCallback();
  };
  return select;
}

// Helper: Translate prompt to selected language (using browser/i18n or fallback)
async function translatePrompt(prompt, langCode) {
  if (langCode === 'en') return prompt;
  if (langCode === 'custom') return translatePromptToCustomLang(prompt);
  if (langCode === 'emoji') {
    // Replace words with emojis for fun
    return prompt.replace(/[a-zA-Z]+/g, w => '🔤');
  }
  // Try using the browser's built-in translation API if available
  if (window.chrome && chrome.i18n && chrome.i18n.getMessage) {
    // Not practical for arbitrary text, so fallback to a simple demo
    return `[${langCode}] ${prompt}`;
  }
  // Fallback: Use a free translation API (demo only, not for production)
  try {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(prompt)}&langpair=en|${langCode}`);
    const data = await res.json();
    if (data && data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }
  } catch (e) {}
  // If all else fails, just show the original with a tag
  return `[${langCode}] ${prompt}`;
}

// --- Subconscious Study & Deep Dive Features ---

// Helper: Add a "Study in Detail" button and modal for any prompt
function addStudyDetailFeature(promptDiv, reflectionPrompts) {
  if (document.getElementById('studyDetailBtn')) return;

  const btn = document.createElement('button');
  btn.id = 'studyDetailBtn';
  btn.className = 'reflection-btn';
  btn.innerHTML = `<span class="material-symbols-outlined">search</span>Study in Detail`;

  // Modal for deep study
  const modal = document.createElement('div');
  modal.id = 'studyDetailModal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(49,27,146,0.10)';
  modal.style.zIndex = '10001';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';

  const modalContent = document.createElement('div');
  modalContent.style.background = '#fffde7';
  modalContent.style.borderRadius = '16px';
  modalContent.style.padding = '28px 22px 18px 22px';
  modalContent.style.boxShadow = '0 4px 24px rgba(49,27,146,0.18)';
  modalContent.style.maxWidth = '420px';
  modalContent.style.margin = 'auto';
  modalContent.style.textAlign = 'left';
  modalContent.style.position = 'relative';

  const closeBtn = document.createElement('span');
  closeBtn.className = 'material-symbols-outlined';
  closeBtn.textContent = 'close';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '14px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.color = '#7e57c2';
  closeBtn.style.fontSize = '1.5em';

  closeBtn.onclick = () => { modal.style.display = 'none'; };

  // --- Debug Details (Urdu & Arabic) ---
  function debugDetails(promptText) {
    // Example debug info, can be expanded as needed
    const debugInfo = {
      "Prompt": promptText,
      "Timestamp": new Date().toLocaleString(),
      "Language": document.getElementById('langSelector')?.value || 'en',
      "Browser": navigator.userAgent,
      "Random": Math.random().toString(36).slice(2, 8)
    };
    // Urdu and Arabic translations (static for demo, can be improved)
    const urduLabels = {
      "Prompt": "پرومپٹ",
      "Timestamp": "وقت",
      "Language": "زبان",
      "Browser": "براؤزر",
      "Random": "رینڈم"
    };
    const arabicLabels = {
      "Prompt": "الموجه",
      "Timestamp": "الوقت",
      "Language": "اللغة",
      "Browser": "المتصفح",
      "Random": "عشوائي"
    };

    let html = `<div style="margin-top:18px;"><b>Debug Details (English | اردو | العربية)</b><br><table style="font-size:0.98em;margin-top:6px;">`;
    Object.keys(debugInfo).forEach(key => {
      html += `<tr>
        <td style="padding:2px 8px 2px 0;"><b>${key}</b></td>
        <td style="padding:2px 8px 2px 0;direction:rtl;">${urduLabels[key]}</td>
        <td style="padding:2px 8px 2px 0;direction:rtl;">${arabicLabels[key]}</td>
        <td style="padding:2px 8px 2px 0;">${debugInfo[key]}</td>
      </tr>`;
    });
    html += `</table></div>`;
    return html;
  }

  // Fill modal with subconscious, simple, fun study tools and debug info
  function fillModal(promptText) {
    modalContent.innerHTML = '';
    modalContent.appendChild(closeBtn);

    // Show the prompt being studied
    const promptTitle = document.createElement('div');
    promptTitle.style.fontWeight = 'bold';
    promptTitle.style.marginBottom = '10px';
    promptTitle.innerHTML = `<span class="emoji">🔍</span> Study This Reflection`;
    modalContent.appendChild(promptTitle);

    const promptBlock = document.createElement('div');
    promptBlock.style.background = '#f3e5f5';
    promptBlock.style.borderRadius = '8px';
    promptBlock.style.padding = '10px 12px';
    promptBlock.style.marginBottom = '12px';
    promptBlock.style.fontStyle = 'italic';
    promptBlock.style.color = '#4a148c';
    promptBlock.innerHTML = promptText;
    modalContent.appendChild(promptBlock);

    // Subconscious study tools
    const tools = [
      { icon: 'lightbulb', label: 'One-Word Summary', action: () => oneWordSummary(promptText) },
      { icon: 'psychology', label: 'Subconscious Association', action: () => subconsciousAssociation(promptText) },
      { icon: 'auto_awesome', label: 'Fun Analogy', action: () => funAnalogy(promptText) },
      { icon: 'translate', label: 'See in Random Language', action: () => randomLang(promptText) }
    ];
    tools.forEach(({ icon, label, action }) => {
      const toolBtn = document.createElement('button');
      toolBtn.className = 'reflection-btn';
      toolBtn.style.margin = '6px 6px 6px 0';
      toolBtn.innerHTML = `<span class="material-symbols-outlined">${icon}</span>${label}`;
      toolBtn.onclick = () => {
        const result = action();
        resultDiv.innerHTML = `<span class="emoji">✨</span> ${result}`;
      };
      modalContent.appendChild(toolBtn);
    });

    // Result area
    const resultDiv = document.createElement('div');
    resultDiv.style.marginTop = '16px';
    resultDiv.style.fontSize = '1.08em';
    resultDiv.style.color = '#4527a0';
    modalContent.appendChild(resultDiv);

    // Add debug details (Urdu & Arabic)
    const debugDiv = document.createElement('div');
    debugDiv.innerHTML = debugDetails(promptText);
    modalContent.appendChild(debugDiv);
  }

  // Subconscious/simple/fun study tool implementations
  function oneWordSummary(text) {
    // Pick a key word or emoji from the prompt
    const words = text.replace(/[^\w\s]/g, '').split(/\s+/);
    const funWords = words.filter(w => w.length > 4);
    return funWords.length ? funWords[Math.floor(Math.random() * funWords.length)] : words[0];
  }
  function subconsciousAssociation(text) {
    // Return a random association or feeling
    const feelings = ["Calm", "Curiosity", "Joy", "Mystery", "Trust", "Wonder", "Play", "Surrender", "Focus", "Gratitude"];
    return `This prompt feels like: <b>${feelings[Math.floor(Math.random() * feelings.length)]}</b>`;
  }
  function funAnalogy(text) {
    // Return a playful analogy
    const analogies = [
      "Like a Rubik's cube, every twist reveals a new side.",
      "Like a river, let your thoughts flow and find their own path.",
      "Like a secret handshake, only your heart knows the meaning.",
      "Like a treasure map, every word is a clue.",
      "Like a dance, sometimes you lead, sometimes you follow."
    ];
    return analogies[Math.floor(Math.random() * analogies.length)];
  }
  function randomLang(text) {
    // Pick a random language from the selector and translate
    const langs = ['es', 'ar', 'ru', 'zh', 'hi', 'ja', 'ko', 'tr', 'el', 'he', 'th', 'eo'];
    const lang = langs[Math.floor(Math.random() * langs.length)];
    return `In another language: <i>${lang}</i> ... <span style="color:#aaa;">(try the language selector above!)</span>`;
  }

  btn.onclick = function() {
    const currentPrompt = promptDiv.textContent || '';
    fillModal(currentPrompt);
    modal.style.display = 'flex';
  };

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  // Insert the button after the main reflection button
  btn.parentNode.insertBefore(btn, btn.nextSibling);
}

// --- Offline Wellness & Spiritual Wisdom Features ---

// 1. Breathing Exercise (offline, simple animation)
function addBreathingExerciseFeature() {
  if (document.getElementById('breathingExerciseBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'breathingExerciseBtn';
  btn.className = 'reflection-btn';
  btn.innerHTML = `<span class="material-symbols-outlined">air</span>Breathing Exercise`;
  btn.style.marginTop = '8px';

  const modal = document.createElement('div');
  modal.id = 'breathingExerciseModal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(49,27,146,0.10)';
  modal.style.zIndex = '10001';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';

  const modalContent = document.createElement('div');
  modalContent.style.background = '#fffde7';
  modalContent.style.borderRadius = '16px';
  modalContent.style.padding = '32px 28px 24px 28px';
  modalContent.style.boxShadow = '0 4px 24px rgba(49,27,146,0.18)';
  modalContent.style.maxWidth = '340px';
  modalContent.style.margin = 'auto';
  modalContent.style.textAlign = 'center';
  modalContent.style.position = 'relative';

  const closeBtn = document.createElement('span');
  closeBtn.className = 'material-symbols-outlined';
  closeBtn.textContent = 'close';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '14px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.color = '#7e57c2';
  closeBtn.style.fontSize = '1.5em';
  closeBtn.onclick = () => { modal.style.display = 'none'; };

  const title = document.createElement('div');
  title.innerHTML = `<span class="emoji">🌬️</span> <b>Offline Breathing Exercise</b>`;
  title.style.marginBottom = '10px';

  const circle = document.createElement('div');
  circle.style.width = '80px';
  circle.style.height = '80px';
  circle.style.margin = '18px auto 10px auto';
  circle.style.borderRadius = '50%';
  circle.style.background = 'linear-gradient(135deg, #b39ddb 0%, #fffde7 100%)';
  circle.style.transition = 'transform 4s cubic-bezier(.4,0,.2,1)';
  circle.style.display = 'flex';
  circle.style.alignItems = 'center';
  circle.style.justifyContent = 'center';
  circle.style.fontSize = '2em';
  circle.innerHTML = '🫁';

  const instruction = document.createElement('div');
  instruction.style.margin = '10px 0 0 0';
  instruction.style.fontWeight = 'bold';
  instruction.style.color = '#4527a0';

  let phase = 0;
  let interval = null;
  function startBreathing() {
    phase = 0;
    instruction.textContent = 'Breathe In...';
    circle.style.transform = 'scale(1.25)';
    interval = setInterval(() => {
      phase = (phase + 1) % 4;
      if (phase === 0) {
        instruction.textContent = 'Breathe In...';
        circle.style.transform = 'scale(1.25)';
      } else if (phase === 1) {
        instruction.textContent = 'Hold...';
        circle.style.transform = 'scale(1.25)';
      } else if (phase === 2) {
        instruction.textContent = 'Breathe Out...';
        circle.style.transform = 'scale(0.85)';
      } else if (phase === 3) {
        instruction.textContent = 'Hold...';
        circle.style.transform = 'scale(0.85)';
      }
    }, 4000);
  }
  function stopBreathing() {
    clearInterval(interval);
    instruction.textContent = '';
    circle.style.transform = 'scale(1)';
  }

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(circle);
  modalContent.appendChild(instruction);

  btn.onclick = function() {
    modal.style.display = 'flex';
    startBreathing();
  };
  closeBtn.onclick = function() {
    modal.style.display = 'none';
    stopBreathing();
  };

  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  // Insert after main reflection button
  document.querySelector('.reflection-btn').parentNode.insertBefore(btn, document.querySelector('.reflection-btn').nextSibling);
}

// 2. Offline Hydration Reminder (local, simple)
function addHydrationReminderFeature() {
  if (document.getElementById('hydrationReminderBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'hydrationReminderBtn';
  btn.className = 'reflection-btn';
  btn.innerHTML = `<span class="material-symbols-outlined">water_drop</span>Hydration Reminder`;
  btn.style.marginTop = '8px';

  let lastDrink = localStorage.getItem('lastDrinkTime') || null;

  btn.onclick = function() {
    lastDrink = Date.now();
    localStorage.setItem('lastDrinkTime', lastDrink);
    btn.innerHTML = `<span class="material-symbols-outlined">check_circle</span>Drank Water!`;
    setTimeout(() => {
      btn.innerHTML = `<span class="material-symbols-outlined">water_drop</span>Hydration Reminder`;
    }, 2000);
  };

  // Show a subtle reminder if > 1 hour since last drink
  setInterval(() => {
    const now = Date.now();
    lastDrink = localStorage.getItem('lastDrinkTime') || null;
    if (lastDrink && now - lastDrink > 60 * 60 * 1000) {
      btn.style.background = 'linear-gradient(90deg, #ffd54f 0%, #e57373 100%)';
      btn.innerHTML = `<span class="material-symbols-outlined">warning</span>Time to Drink Water!`;
    } else {
      btn.style.background = '';
      btn.innerHTML = `<span class="material-symbols-outlined">water_drop</span>Hydration Reminder`;
    }
  }, 60000);

  document.querySelector('.reflection-btn').parentNode.insertBefore(btn, document.querySelector('.reflection-btn').nextSibling.nextSibling);
}

// 3. Offline Mindful Posture Check (local, simple)
function addPostureCheckFeature() {
  if (document.getElementById('postureCheckBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'postureCheckBtn';
  btn.className = 'reflection-btn';
  btn.innerHTML = `<span class="material-symbols-outlined">accessibility_new</span>Posture Check`;
  btn.style.marginTop = '8px';

  btn.onclick = function() {
    btn.innerHTML = `<span class="material-symbols-outlined">check_circle</span>Posture Good!`;
    setTimeout(() => {
      btn.innerHTML = `<span class="material-symbols-outlined">accessibility_new</span>Posture Check`;
    }, 2000);
  };

  // Subtle reminder every 30 minutes
  setInterval(() => {
    btn.style.background = 'linear-gradient(90deg, #ffd54f 0%, #81c784 100%)';
    btn.innerHTML = `<span class="material-symbols-outlined">event_repeat</span>Check Your Posture!`;
    setTimeout(() => {
      btn.style.background = '';
      btn.innerHTML = `<span class="material-symbols-outlined">accessibility_new</span>Posture Check`;
    }, 6000);
  }, 30 * 60 * 1000);

  document.querySelector('.reflection-btn').parentNode.insertBefore(btn, document.querySelector('.reflection-btn').nextSibling.nextSibling.nextSibling);
}

// --- Low Intensity Natural Offline Mode ---

function addLowIntensityModeFeature() {
  if (document.getElementById('lowIntensityBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'lowIntensityBtn';
  btn.className = 'reflection-btn';
  btn.innerHTML = `<span class="material-symbols-outlined">spa</span>Low Intensity Mode`;
  btn.style.marginTop = '8px';

  let lowIntensityActive = false;
  let lowIntensityInterval = null;

  btn.onclick = function() {
    lowIntensityActive = !lowIntensityActive;
    if (lowIntensityActive) {
      btn.innerHTML = `<span class="material-symbols-outlined">spa</span>Low Intensity: ON`;
      btn.style.background = 'linear-gradient(90deg, #b2dfdb 0%, #fffde7 100%)';
      document.body.style.filter = 'brightness(0.97) grayscale(0.07)';
      document.body.style.transition = 'filter 0.7s';
      // Subtle, periodic offline reminders for natural wellness
      if (!lowIntensityInterval) {
        lowIntensityInterval = setInterval(() => {
          showLowIntensityToast();
        }, 12 * 60 * 1000); // every 12 minutes
      }
    } else {
      btn.innerHTML = `<span class="material-symbols-outlined">spa</span>Low Intensity Mode`;
      btn.style.background = '';
      document.body.style.filter = '';
      clearInterval(lowIntensityInterval);
      lowIntensityInterval = null;
    }
  };

  // Subtle toast notification for low intensity mode
  function showLowIntensityToast() {
    if (document.getElementById('lowIntensityToast')) return;
    const toast = document.createElement('div');
    toast.id = 'lowIntensityToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '70px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'rgba(178,223,219,0.97)';
    toast.style.color = '#00695c';
    toast.style.padding = '12px 28px';
    toast.style.borderRadius = '18px';
    toast.style.fontSize = '1.08em';
    toast.style.boxShadow = '0 2px 12px rgba(49,27,146,0.10)';
    toast.style.zIndex = '10020';
    toast.style.fontWeight = 'bold';
    toast.innerHTML = `<span class="material-symbols-outlined" style="vertical-align:middle;">self_improvement</span>
      Low Intensity: Take a slow breath, relax your gaze, and let your mind wander naturally.`;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 7000);
  }

  // Insert after main reflection button
  document.querySelector('.reflection-btn').parentNode.insertBefore(btn, document.querySelector('.reflection-btn').nextSibling);
}

// --- In-App Command/Code Update Feature ---

// Helper: Show a floating command input for user code/feature requests
function addInAppCommandFeature() {
  if (document.getElementById('inAppCommandBtn')) return;

  // Floating button to open command input
  const cmdBtn = document.createElement('button');
  cmdBtn.id = 'inAppCommandBtn';
  cmdBtn.className = 'reflection-btn';
  cmdBtn.style.position = 'fixed';
  cmdBtn.style.bottom = '62px';
  cmdBtn.style.right = '18px';
  cmdBtn.style.zIndex = '10010';
  cmdBtn.style.background = 'linear-gradient(90deg, #ffd54f 0%, #7e57c2 100%)';
  cmdBtn.style.boxShadow = '0 2px 8px rgba(49,27,146,0.12)';
  cmdBtn.innerHTML = `<span class="material-symbols-outlined">terminal</span>Command`;

  // Command modal
  const modal = document.createElement('div');
  modal.id = 'inAppCommandModal';
  modal.style.display = 'none';
  modal.style.position = 'fixed';
  modal.style.left = '0';
  modal.style.top = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(49,27,146,0.10)';
  modal.style.zIndex = '10011';
  modal.style.justifyContent = 'center';
  modal.style.alignItems = 'center';

  const modalContent = document.createElement('div');
  modalContent.style.background = '#fffde7';
  modalContent.style.borderRadius = '16px';
  modalContent.style.padding = '28px 22px 18px 22px';
  modalContent.style.boxShadow = '0 4px 24px rgba(49,27,146,0.18)';
  modalContent.style.maxWidth = '420px';
  modalContent.style.margin = 'auto';
  modalContent.style.textAlign = 'left';
  modalContent.style.position = 'relative';

  const closeBtn = document.createElement('span');
  closeBtn.className = 'material-symbols-outlined';
  closeBtn.textContent = 'close';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '14px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.color = '#7e57c2';
  closeBtn.style.fontSize = '1.5em';
  closeBtn.onclick = () => { modal.style.display = 'none'; };

  const title = document.createElement('div');
  title.innerHTML = `<span class="material-symbols-outlined">terminal</span> <b>Request a Feature or Code Update</b>`;
  title.style.marginBottom = '10px';

  const input = document.createElement('textarea');
  input.placeholder = "Describe your feature, bugfix, or code update (e.g. 'Add a dark mode', 'Fix hydration reminder bug', 'Add a new meditation timer')...";
  input.style.width = '100%';
  input.style.height = '60px';
  input.style.borderRadius = '8px';
  input.style.border = '1px solid #b39ddb';
  input.style.marginBottom = '10px';
  input.style.padding = '8px';
  input.style.fontFamily = 'inherit';
  input.style.fontSize = '1em';

  const submitBtn = document.createElement('button');
  submitBtn.className = 'reflection-btn';
  submitBtn.innerHTML = `<span class="material-symbols-outlined">send</span>Submit Request`;

  const statusDiv = document.createElement('div');
  statusDiv.style.marginTop = '10px';
  statusDiv.style.fontSize = '0.98em';
  statusDiv.style.color = '#4527a0';

  // Simulate sending the command to an AI/code update backend
  submitBtn.onclick = async function() {
    const cmd = input.value.trim();
    if (!cmd) {
      statusDiv.textContent = "Please enter a command or feature request.";
      statusDiv.style.color = "#e53935";
      return;
    }
    statusDiv.textContent = "Processing your request...";
    statusDiv.style.color = "#4527a0";
    // Here you would send the command to your backend or AI agent for code update
    // For demo, just show a simulated response
    setTimeout(() => {
      statusDiv.innerHTML = `<span class="material-symbols-outlined" style="color:#43a047;">check_circle</span> Your request has been received!<br>Our AI will review and update the code if possible.`;
      input.value = '';
    }, 1800);
  };

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(input);
  modalContent.appendChild(submitBtn);
  modalContent.appendChild(statusDiv);
  modal.appendChild(modalContent);

  // Show modal on button click
  cmdBtn.onclick = () => { modal.style.display = 'flex'; };

  document.body.appendChild(cmdBtn);
  document.body.appendChild(modal);

  // Listen for any user input/click to suggest code update
  document.body.addEventListener('click', function(e) {
    if (e.target !== cmdBtn && e.target !== modal && e.target !== modalContent && e.target !== closeBtn) {
      // Optionally, you could show a subtle hint or open the command modal
      // For now, just log for debug
      // console.log('User interacted, ready for code update command.');
    }
  }, true);

  // Listen for any input in the app to suggest code update
  document.body.addEventListener('input', function(e) {
    // Optionally, you could show a subtle hint or open the command modal
    // For now, just log for debug
    // console.log('User input detected, ready for code update command.');
  }, true);
}

// --- Global Culture & Intercultural Harmony Features ---

function addGlobalCultureFeatures() {
  if (document.getElementById('globalCultureBtn')) return;

  // 1. Global Greeting Button (rotates greetings from many cultures, more focus on Pakistani & East African)
  const greetBtn = document.createElement('button');
  greetBtn.id = 'globalCultureBtn';
  greetBtn.className = 'reflection-btn';
  greetBtn.innerHTML = `<span class="material-symbols-outlined">public</span>Global Greeting`;
  greetBtn.style.marginTop = '8px';

  const greetings = [
    // Pakistani greetings
    { text: "السلام علیکم", lang: "Urdu", meaning: "Peace be upon you" },
    { text: "خوش آمدید", lang: "Urdu", meaning: "Welcome" },
    { text: "کیا حال ہے؟", lang: "Urdu", meaning: "How are you?" },
    { text: "Adaab", lang: "Urdu", meaning: "Respectful greeting" },
    { text: "Bismillah", lang: "Urdu/Islamic", meaning: "In the name of God" },
    // East African greetings
    { text: "Jambo", lang: "Swahili", meaning: "Hello" },
    { text: "Habari", lang: "Swahili", meaning: "How are you?" },
    { text: "Shikamoo", lang: "Swahili", meaning: "Respectful greeting to elders" },
    { text: "Karibu", lang: "Swahili", meaning: "Welcome" },
    { text: "Asante", lang: "Swahili", meaning: "Thank you" },
    { text: "Pole pole", lang: "Swahili", meaning: "Take it easy" },
    // Other global
    { text: "السلام عليكم", lang: "Arabic", meaning: "Peace be upon you" },
    { text: "नमस्ते", lang: "Hindi", meaning: "I bow to you" },
    { text: "Bonjour", lang: "French", meaning: "Good day" },
    { text: "Hola", lang: "Spanish", meaning: "Hello" },
    { text: "Ciao", lang: "Italian", meaning: "Hello/Bye" },
    { text: "Sawubona", lang: "Zulu", meaning: "I see you" },
    { text: "Sawasdee", lang: "Thai", meaning: "Hello" },
    { text: "Xin chào", lang: "Vietnamese", meaning: "Hello" },
    { text: "Hallo", lang: "German", meaning: "Hello" },
    { text: "Merhaba", lang: "Turkish", meaning: "Hello" }
    // ...existing code...
  ];
  let greetIdx = 0;
  greetBtn.onclick = function() {
    greetIdx = (greetIdx + 1) % greetings.length;
    const g = greetings[greetIdx];
    greetBtn.innerHTML = `<span class="material-symbols-outlined">public</span>${g.text} <span style="font-size:0.9em;color:#7e57c2;">(${g.lang}: ${g.meaning})</span>`;
  };

  // 2. Interfaith/Interspiritual Wisdom Button (more Sufi, Islamic, African proverbs)
  const wisdomBtn = document.createElement('button');
  wisdomBtn.id = 'interfaithWisdomBtn';
  wisdomBtn.className = 'reflection-btn';
  wisdomBtn.innerHTML = `<span class="material-symbols-outlined">diversity_3</span>Interfaith Wisdom`;
  wisdomBtn.style.marginTop = '8px';

  const wisdoms = [
    // Pakistani/Sufi/Islamic
    { text: "خدا کی رضا میں راضی رہو۔", source: "Sufi (Be content in God's will)" },
    { text: "Seek knowledge even if you have to go to China.", source: "Prophet Muhammad ﷺ" },
    { text: "Patience is the key to relief.", source: "Islamic" },
    { text: "The wound is the place where the Light enters you.", source: "Rumi (Sufi)" },
    { text: "Unity is strength.", source: "Pakistani proverb" },
    { text: "Serve humanity to serve God.", source: "Islam" },
    { text: "Truth is one, sages call it by many names.", source: "Hinduism" },
    // East African
    { text: "Haraka haraka haina baraka.", source: "Swahili (Haste has no blessing)" },
    { text: "Unity is strength, division is weakness.", source: "Swahili proverb" },
    { text: "Pole pole ndiyo mwendo.", source: "Swahili (Slowly is the way)" },
    { text: "Wisdom does not come overnight.", source: "Somali proverb" },
    { text: "A child who is not embraced by the village will burn it down to feel its warmth.", source: "African proverb" },
    // Other global
    { text: "Love your neighbor as yourself.", source: "Christianity" },
    { text: "Compassion is the root of all Dharma.", source: "Buddhism" },
    { text: "Justice, justice you shall pursue.", source: "Judaism" },
    { text: "Let your heart be at peace.", source: "Taoism" },
    { text: "Kindness is the highest wisdom.", source: "Sikhism" }
    // ...existing code...
  ];
  let wisdomIdx = 0;
  wisdomBtn.onclick = function() {
    wisdomIdx = (wisdomIdx + 1) % wisdoms.length;
    const w = wisdoms[wisdomIdx];
    wisdomBtn.innerHTML = `<span class="material-symbols-outlined">diversity_3</span>${w.text} <span style="font-size:0.9em;color:#7e57c2;">(${w.source})</span>`;
  };

  // 3. Cultural Curiosity Button (more Pakistani/East African practices)
  const cultureBtn = document.createElement('button');
  cultureBtn.id = 'cultureCuriosityBtn';
  cultureBtn.className = 'reflection-btn';
  cultureBtn.innerHTML = `<span class="material-symbols-outlined">travel_explore</span>Cultural Curiosity`;
  cultureBtn.style.marginTop = '8px';

  const practices = [
    // Pakistani
    "Try making chai (Pakistani tea) and share with a neighbor.",
    "Practice a Sufi zikr (remembrance) quietly for 3 minutes.",
    "Try writing your name in Urdu calligraphy.",
    "Listen to a qawwali (Sufi devotional music).",
    "Try a Pakistani hospitality gesture: offer tea or sweets to a guest.",
    "Try reciting a couplet from Allama Iqbal.",
    "Try a simple handwoven Sindhi ajrak scarf.",
    // East African
    "Try making Ugali or Chapati (East African staple food).",
    "Learn a Swahili proverb and share it.",
    "Try a Kenyan coffee or Tanzanian tea ritual.",
    "Listen to taarab or bongo flava music.",
    "Try a Maasai greeting (jumping or handshake).",
    "Try a simple kanga wrap (East African cloth).",
    "Try a moment of Ubuntu: greet someone as 'I am because we are.'",
    // Other global
    "Try a Japanese tea ceremony (Chanoyu) at home.",
    "Practice Turkish coffee reading with friends.",
    "Light a Diya (lamp) for Diwali or any new beginning.",
    "Try mindful walking as in Zen tradition.",
    "Write a gratitude note in a language you don't know.",
    "Try a Scandinavian fika (coffee break with friends).",
    "Cook a meal from a different continent.",
    "Try a Native American smudging ritual (with sage or incense).",
    "Practice silence for 10 minutes as in Quaker meetings.",
    "Try a simple African drumming rhythm.",
    "Read a poem from Persian, Urdu, or Chinese tradition.",
    "Try a Maori hongi greeting (touching noses) with a friend (or just learn about it).",
    "Try a Buddhist loving-kindness meditation (Metta).",
    "Try a Jewish Shabbat candle lighting.",
    "Try a Brazilian samba dance step.",
    "Try a French cheese tasting (or any local cheese)."
    // ...existing code...
  ];
  let practiceIdx = 0;
  cultureBtn.onclick = function() {
    practiceIdx = (practiceIdx + 1) % practices.length;
    cultureBtn.innerHTML = `<span class="material-symbols-outlined">travel_explore</span>${practices[practiceIdx]}`;
  };

  // Insert after main reflection button
  const refBtn = document.querySelector('.reflection-btn');
  refBtn.parentNode.insertBefore(greetBtn, refBtn.nextSibling);
  refBtn.parentNode.insertBefore(wisdomBtn, greetBtn.nextSibling);
  refBtn.parentNode.insertBefore(cultureBtn, wisdomBtn.nextSibling);
}

// --- Exciting Spirituality & Religion-Oriented Features ---

function addSpiritualExcitementFeatures() {
  if (document.getElementById('spiritualExciteBtn')) return;

  // 1. Daily Quranic/Hadith/Ayah/Verse Widget
  const verseBtn = document.createElement('button');
  verseBtn.id = 'spiritualExciteBtn';
  verseBtn.className = 'reflection-btn';
  verseBtn.innerHTML = `<span class="material-symbols-outlined">menu_book</span>Daily Sacred Verse`;
  verseBtn.style.marginTop = '8px';
  const verses = [
    { text: "Indeed, prayer prohibits immorality and wrongdoing. (Quran 29:45)", source: "Quran" },
    { text: "Love your neighbor as yourself. (Mark 12:31)", source: "Bible" },
    { text: "The mind is everything. What you think you become. (Buddha)", source: "Buddhism" },
    { text: "God is the Light of the heavens and the earth. (Quran 24:35)", source: "Quran" },
    { text: "Let there be peace on earth and let it begin with me.", source: "Christian Hymn" },
    { text: "Satyam eva jayate (Truth alone triumphs).", source: "Hinduism" },
    { text: "Blessed are the peacemakers. (Matthew 5:9)", source: "Bible" },
    { text: "He who has no one, has God. (Sufi proverb)", source: "Sufism" },
    { text: "The best among you are those who have the best manners and character. (Hadith)", source: "Islam" },
    { text: "Let your heart be at peace. (Tao Te Ching)", source: "Taoism" }
  ];
  let verseIdx = 0;
  verseBtn.onclick = function() {
    verseIdx = (verseIdx + 1) % verses.length;
    const v = verses[verseIdx];
    verseBtn.innerHTML = `<span class="material-symbols-outlined">menu_book</span>${v.text} <span style="font-size:0.9em;color:#7e57c2;">(${v.source})</span>`;
  };

  // 2. Sufi Whirling Timer (spiritual movement)
  const sufiBtn = document.createElement('button');
  sufiBtn.id = 'sufiWhirlBtn';
  sufiBtn.className = 'reflection-btn';
  sufiBtn.innerHTML = `<span class="material-symbols-outlined">motion_photos_on</span>Sufi Whirling Timer`;
  sufiBtn.style.marginTop = '8px';
  sufiBtn.onclick = function() {
    alert("Stand up, spin slowly with arms open for 30 seconds, and focus on your heart. (Sufi whirling meditation)");
  };

  // 3. Guided Dhikr/Mantra/Chant (audio/text)
  const dhikrBtn = document.createElement('button');
  dhikrBtn.id = 'dhikrBtn';
  dhikrBtn.className = 'reflection-btn';
  dhikrBtn.innerHTML = `<span class="material-symbols-outlined">graphic_eq</span>Guided Dhikr/Chant`;
  dhikrBtn.style.marginTop = '8px';
  dhikrBtn.onclick = function() {
    alert("Repeat: 'SubhanAllah, Alhamdulillah, Allahu Akbar' or your favorite mantra 33 times. Feel the vibration in your heart.");
  };

  // 4. Candle Lighting Ritual (virtual)
  const candleBtn = document.createElement('button');
  candleBtn.id = 'candleBtn';
  candleBtn.className = 'reflection-btn';
  candleBtn.innerHTML = `<span class="material-symbols-outlined">emoji_objects</span>Light a Virtual Candle`;
  candleBtn.style.marginTop = '8px';
  candleBtn.onclick = function() {
    const candle = document.createElement('div');
    candle.style.position = 'fixed';
    candle.style.left = '50%';
    candle.style.top = '50%';
    candle.style.transform = 'translate(-50%,-50%)';
    candle.style.zIndex = '10030';
    candle.style.fontSize = '3em';
    candle.innerHTML = "🕯️";
    document.body.appendChild(candle);
    setTimeout(() => { if (candle.parentNode) candle.parentNode.removeChild(candle); }, 4000);
  };

  // 5. Prayer Times Quick View (offline, demo only)
  const prayerBtn = document.createElement('button');
  prayerBtn.id = 'prayerBtn';
  prayerBtn.className = 'reflection-btn';
  prayerBtn.innerHTML = `<span class="material-symbols-outlined">schedule</span>Prayer Times`;
  prayerBtn.style.marginTop = '8px';
  prayerBtn.onclick = function() {
    alert("Fajr: 5:00am\nDhuhr: 1:15pm\nAsr: 4:45pm\nMaghrib: 7:10pm\nIsha: 8:30pm\n(For your city, check a local app for accuracy)");
  };

  // 6. Random Blessing Generator (all faiths)
  const blessingBtn = document.createElement('button');
  blessingBtn.id = 'blessingBtn';
  blessingBtn.className = 'reflection-btn';
  blessingBtn.innerHTML = `<span class="material-symbols-outlined">volunteer_activism</span>Random Blessing`;
  blessingBtn.style.marginTop = '8px';
  const blessings = [
    "May you be surrounded by light and peace.",
    "May your heart be filled with gratitude.",
    "May you walk in beauty and kindness.",
    "May you find wisdom in every moment.",
    "May your prayers be answered.",
    "May you be a source of hope for others.",
    "May you be protected from harm.",
    "May you find joy in service.",
    "May you be guided by compassion.",
    "May you be blessed with understanding."
  ];
  blessingBtn.onclick = function() {
    const idx = Math.floor(Math.random() * blessings.length);
    blessingBtn.innerHTML = `<span class="material-symbols-outlined">volunteer_activism</span>${blessings[idx]}`;
  };

  // 7. Interfaith Calendar (demo: shows major holidays)
  const calendarBtn = document.createElement('button');
  calendarBtn.id = 'calendarBtn';
  calendarBtn.className = 'reflection-btn';
  calendarBtn.innerHTML = `<span class="material-symbols-outlined">event</span>Interfaith Calendar`;
  calendarBtn.style.marginTop = '8px';
  calendarBtn.onclick = function() {
    alert("Upcoming: Ramadan, Easter, Holi, Passover, Vesak, Eid, Diwali, Hanukkah, Christmas, Mawlid, Nowruz, etc.");
  };

  // 8. Spiritual Name Generator
  const nameBtn = document.createElement('button');
  nameBtn.id = 'spiritualNameBtn';
  nameBtn.className = 'reflection-btn';
  nameBtn.innerHTML = `<span class="material-symbols-outlined">person_search</span>Spiritual Name`;
  nameBtn.style.marginTop = '8px';
  const names = [
    "Noor (Light)", "Shanti (Peace)", "Rahma (Mercy)", "Prem (Love)", "Baraka (Blessing)",
    "Amani (Peace)", "Sage", "Zuhair (Bright)", "Ananda (Bliss)", "Salim (Safe)"
  ];
  nameBtn.onclick = function() {
    const idx = Math.floor(Math.random() * names.length);
    nameBtn.innerHTML = `<span class="material-symbols-outlined">person_search</span>${names[idx]}`;
  };

  // 9. Virtual Tasbih/Prayer Beads Counter
  const tasbihBtn = document.createElement('button');
  tasbihBtn.id = 'tasbihBtn';
  tasbihBtn.className = 'reflection-btn';
  tasbihBtn.innerHTML = `<span class="material-symbols-outlined">counter_1</span>Tasbih/Beads Counter`;
  tasbihBtn.style.marginTop = '8px';
  let tasbihCount = 0;
  tasbihBtn.onclick = function() {
    tasbihCount++;
    tasbihBtn.innerHTML = `<span class="material-symbols-outlined">counter_1</span>Tasbih: ${tasbihCount}`;
  };

  // 10. Spiritual Reflection Journal (simple, offline)
  const journalBtn = document.createElement('button');
  journalBtn.id = 'journalBtn';
  journalBtn.className = 'reflection-btn';
  journalBtn.innerHTML = `<span class="material-symbols-outlined">edit_note</span>Reflection Journal`;
  journalBtn.style.marginTop = '8px';
  journalBtn.onclick = function() {
    const entry = prompt("Write your spiritual reflection for today:");
    if (entry) {
      let journal = localStorage.getItem('spiritualJournal') || '';
      journal += `\n[${new Date().toLocaleDateString()}] ${entry}`;
      localStorage.setItem('spiritualJournal', journal);
      alert("Saved! You can view your journal in the browser console (localStorage['spiritualJournal']).");
    }
  };

  // Insert after main reflection button
  const refBtn = document.querySelector('.reflection-btn');
  refBtn.parentNode.insertBefore(verseBtn, refBtn.nextSibling);
  refBtn.parentNode.insertBefore(sufiBtn, verseBtn.nextSibling);
  refBtn.parentNode.insertBefore(dhikrBtn, sufiBtn.nextSibling);
  refBtn.parentNode.insertBefore(candleBtn, dhikrBtn.nextSibling);
  refBtn.parentNode.insertBefore(prayerBtn, candleBtn.nextSibling);
  refBtn.parentNode.insertBefore(blessingBtn, prayerBtn.nextSibling);
  refBtn.parentNode.insertBefore(calendarBtn, blessingBtn.nextSibling);
  refBtn.parentNode.insertBefore(nameBtn, calendarBtn.nextSibling);
  refBtn.parentNode.insertBefore(tasbihBtn, nameBtn.nextSibling);
  refBtn.parentNode.insertBefore(journalBtn, tasbihBtn.nextSibling);
}

// --- Fun & Hilariously Playful Security Features (Kid-Approved, Expert-Questionable) ---

function addFunSecurityFeatures() {
  if (document.getElementById('funSecurityBtn')) return;

  // 1. Emoji Password Unlock
  const emojiPwdBtn = document.createElement('button');
  emojiPwdBtn.id = 'funSecurityBtn';
  emojiPwdBtn.className = 'reflection-btn';
  emojiPwdBtn.innerHTML = `<span class="material-symbols-outlined">lock</span>Emoji Password`;
  emojiPwdBtn.style.marginTop = '8px';
  emojiPwdBtn.onclick = function() {
    const pwd = prompt("Enter your secret emoji password (e.g. 🦄🐱🍕):");
    if (pwd === "🦄🐱🍕") alert("Access granted! 🥳");
    else alert("Wrong emoji! Try again.");
  };

  // 2. Knock-Knock Joke Captcha
  const jokeCaptchaBtn = document.createElement('button');
  jokeCaptchaBtn.id = 'jokeCaptchaBtn';
  jokeCaptchaBtn.className = 'reflection-btn';
  jokeCaptchaBtn.innerHTML = `<span class="material-symbols-outlined">emoji_emotions</span>Joke Captcha`;
  jokeCaptchaBtn.style.marginTop = '8px';
  jokeCaptchaBtn.onclick = function() {
    const answer = prompt("Knock knock!\nWho's there?");
    if (answer && answer.length > 0) alert("You're human! (Probably)");
    else alert("Try again, robot!");
  };

  // 3. Dance Move Authentication
  const danceBtn = document.createElement('button');
  danceBtn.id = 'danceBtn';
  danceBtn.className = 'reflection-btn';
  danceBtn.innerHTML = `<span class="material-symbols-outlined">directions_run</span>Dance Auth`;
  danceBtn.style.marginTop = '8px';
  danceBtn.onclick = function() {
    alert("To unlock, do your favorite dance move in front of your screen! (We trust you!)");
  };

  // 4. Secret Handshake Mode
  const handshakeBtn = document.createElement('button');
  handshakeBtn.id = 'handshakeBtn';
  handshakeBtn.className = 'reflection-btn';
  handshakeBtn.innerHTML = `<span class="material-symbols-outlined">pan_tool_alt</span>Secret Handshake`;
  handshakeBtn.style.marginTop = '8px';
  handshakeBtn.onclick = function() {
    alert("Pretend to do a secret handshake with your mouse. Access granted!");
  };

  // 5. Pet Name Security Question
  const petBtn = document.createElement('button');
  petBtn.id = 'petBtn';
  petBtn.className = 'reflection-btn';
  petBtn.innerHTML = `<span class="material-symbols-outlined">pets</span>Pet Name Question`;
  petBtn.style.marginTop = '8px';
  petBtn.onclick = function() {
    const pet = prompt("What is your imaginary pet's name?");
    alert(`Welcome, ${pet ? pet : "Mysterious Stranger"}!`);
  };

  // 6. Favorite Ice Cream Flavor Auth
  const iceBtn = document.createElement('button');
  iceBtn.id = 'iceBtn';
  iceBtn.className = 'reflection-btn';
  iceBtn.innerHTML = `<span class="material-symbols-outlined">icecream</span>Ice Cream Auth`;
  iceBtn.style.marginTop = '8px';
  iceBtn.onclick = function() {
    const flavor = prompt("What's your favorite ice cream flavor?");
    alert(`Yum! ${flavor} is now your security flavor.`);
  };

  // 7. Color Picker Lock
  const colorBtn = document.createElement('button');
  colorBtn.id = 'colorBtn';
  colorBtn.className = 'reflection-btn';
  colorBtn.innerHTML = `<span class="material-symbols-outlined">palette</span>Color Lock`;
  colorBtn.style.marginTop = '8px';
  colorBtn.onclick = function() {
    const color = prompt("Pick a color (e.g. blue, red, rainbow):");
    alert(`Color "${color}" accepted!`);
  };

  // 8. Riddle Unlock
  const riddleBtn = document.createElement('button');
  riddleBtn.id = 'riddleBtn';
  riddleBtn.className = 'reflection-btn';
  riddleBtn.innerHTML = `<span class="material-symbols-outlined">psychology_alt</span>Riddle Unlock`;
  riddleBtn.style.marginTop = '8px';
  riddleBtn.onclick = function() {
    const ans = prompt("What has keys but can't open locks?");
    if (ans && /piano/i.test(ans)) alert("Correct! Welcome!");
    else alert("Nope! It's a piano. Try again next time!");
  };

  // 9. Random Animal Auth
  const animalBtn = document.createElement('button');
  animalBtn.id = 'animalBtn';
  animalBtn.className = 'reflection-btn';
  animalBtn.innerHTML = `<span class="material-symbols-outlined">pets</span>Animal Auth`;
  animalBtn.style.marginTop = '8px';
  animalBtn.onclick = function() {
    const animals = ["🦄", "🐱", "🐶", "🐸", "🐼", "🦊", "🐧"];
    alert("Your security animal is: " + animals[Math.floor(Math.random() * animals.length)]);
  };

  // 10. Silly Face Recognition (manual)
  const faceBtn = document.createElement('button');
  faceBtn.id = 'faceBtn';
  faceBtn.className = 'reflection-btn';
  faceBtn.innerHTML = `<span class="material-symbols-outlined">face</span>Silly Face Check`;
  faceBtn.style.marginTop = '8px';
  faceBtn.onclick = function() {
    alert("Make a silly face at your screen. If you smiled, you're in!");
  };

  // 11. Joke of the Day Lock
  const jokeBtn = document.createElement('button');
  jokeBtn.id = 'jokeBtn';
  jokeBtn.className = 'reflection-btn';
  jokeBtn.innerHTML = `<span class="material-symbols-outlined">sentiment_very_satisfied</span>Joke Lock`;
  jokeBtn.style.marginTop = '8px';
  jokeBtn.onclick = function() {
    const jokes = [
      "Why did the computer go to the doctor? Because it had a virus!",
      "Why was the math book sad? It had too many problems.",
      "Why did the scarecrow win an award? He was outstanding in his field!"
    ];
    alert(jokes[Math.floor(Math.random() * jokes.length)]);
  };

  // 12. Reverse Password Entry
  const reverseBtn = document.createElement('button');
  reverseBtn.id = 'reverseBtn';
  reverseBtn.className = 'reflection-btn';
  reverseBtn.innerHTML = `<span class="material-symbols-outlined">swap_horiz</span>Reverse Password`;
  reverseBtn.style.marginTop = '8px';
  reverseBtn.onclick = function() {
    const pwd = prompt("Type your password backwards:");
    alert("That's... creative! (But not secure!)");
  };

  // 13. Secret Song Unlock
  const songBtn = document.createElement('button');
  songBtn.id = 'songBtn';
  songBtn.className = 'reflection-btn';
  songBtn.innerHTML = `<span class="material-symbols-outlined">music_note</span>Song Unlock`;
  songBtn.style.marginTop = '8px';
  songBtn.onclick = function() {
    alert("Sing your favorite song out loud. If you did, you're in!");
  };

  // 14. Favorite Number Auth
  const numBtn = document.createElement('button');
  numBtn.id = 'numBtn';
  numBtn.className = 'reflection-btn';
  numBtn.innerHTML = `<span class="material-symbols-outlined">looks_one</span>Number Auth`;
  numBtn.style.marginTop = '8px';
  numBtn.onclick = function() {
    const num = prompt("What's your favorite number?");
    alert(`Number ${num} is now your security number!`);
  };

  // 15. Magic Word Entry
  const magicBtn = document.createElement('button');
  magicBtn.id = 'magicBtn';
  magicBtn.className = 'reflection-btn';
  magicBtn.innerHTML = `<span class="material-symbols-outlined">auto_fix_high</span>Magic Word`;
  magicBtn.style.marginTop = '8px';
  magicBtn.onclick = function() {
    const word = prompt("What's the magic word?");
    if (word && /please|abracadabra|alakazam/i.test(word)) alert("Magic accepted!");
    else alert("No magic detected!");
  };

  // 16. Random Dance Challenge
  const dance2Btn = document.createElement('button');
  dance2Btn.id = 'dance2Btn';
  dance2Btn.className = 'reflection-btn';
  dance2Btn.innerHTML = `<span class="material-symbols-outlined">celebration</span>Dance Challenge`;
  dance2Btn.style.marginTop = '8px';
  dance2Btn.onclick = function() {
    alert("Do a dance move! If you did, you're in. (We can't see you, but we trust you!)");
  };

  // 17. Cartoon Character Auth
  const cartoonBtn = document.createElement('button');
  cartoonBtn.id = 'cartoonBtn';
  cartoonBtn.className = 'reflection-btn';
  cartoonBtn.innerHTML = `<span class="material-symbols-outlined">animation</span>Cartoon Auth`;
  cartoonBtn.style.marginTop = '8px';
  cartoonBtn.onclick = function() {
    const char = prompt("Who is your favorite cartoon character?");
    alert(`Welcome, ${char ? char : "Cartoon Fan"}!`);
  };

  // 18. Favorite Food Lock
  const foodBtn = document.createElement('button');
  foodBtn.id = 'foodBtn';
  foodBtn.className = 'reflection-btn';
  foodBtn.innerHTML = `<span class="material-symbols-outlined">fastfood</span>Food Lock`;
  foodBtn.style.marginTop = '8px';
  foodBtn.onclick = function() {
    const food = prompt("What's your favorite food?");
    alert(`Yum! ${food} is now your security food.`);
  };

  // 19. Animal Sound Auth
  const soundBtn = document.createElement('button');
  soundBtn.id = 'soundBtn';
  soundBtn.className = 'reflection-btn';
  soundBtn.innerHTML = `<span class="material-symbols-outlined">volume_up</span>Animal Sound`;
  soundBtn.style.marginTop = '8px';
  soundBtn.onclick = function() {
    alert("Make your favorite animal sound. If you did, you're in!");
  };

  // 20. Opposite Day Password
  const oppBtn = document.createElement('button');
  oppBtn.id = 'oppBtn';
  oppBtn.className = 'reflection-btn';
  oppBtn.innerHTML = `<span class="material-symbols-outlined">flip</span>Opposite Day`;
  oppBtn.style.marginTop = '8px';
  oppBtn.onclick = function() {
    alert("Type the opposite of your real password. (No one will ever guess!)");
  };

  // 21. Pirate Speak Auth
  const pirateBtn = document.createElement('button');
  pirateBtn.id = 'pirateBtn';
  pirateBtn.className = 'reflection-btn';
  pirateBtn.innerHTML = `<span class="material-symbols-outlined">sailing</span>Pirate Auth`;
  pirateBtn.style.marginTop = '8px';
  pirateBtn.onclick = function() {
    alert("Say 'Arrr matey!' to unlock. (Bonus points for an eye patch!)");
  };

  // 22. Secret Knock (tap your desk)
  const knockBtn = document.createElement('button');
  knockBtn.id = 'knockBtn';
  knockBtn.className = 'reflection-btn';
  knockBtn.innerHTML = `<span class="material-symbols-outlined">door_front</span>Secret Knock`;
  knockBtn.style.marginTop = '8px';
  knockBtn.onclick = function() {
    alert("Tap your desk 3 times. If you did, you're in!");
  };

  // 23. Weather Password
  const weatherBtn = document.createElement('button');
  weatherBtn.id = 'weatherBtn';
  weatherBtn.className = 'reflection-btn';
  weatherBtn.innerHTML = `<span class="material-symbols-outlined">cloud</span>Weather Password`;
  weatherBtn.style.marginTop = '8px';
  weatherBtn.onclick = function() {
    const weather = prompt("What's the weather like right now?");
    alert(`Weather "${weather}" accepted!`);
  };

  // 24. Mood Ring Auth
  const moodBtn = document.createElement('button');
  moodBtn.id = 'moodBtn';
  moodBtn.className = 'reflection-btn';
  moodBtn.innerHTML = `<span class="material-symbols-outlined">mood</span>Mood Ring`;
  moodBtn.style.marginTop = '8px';
  moodBtn.onclick = function() {
    const mood = prompt("How are you feeling?");
    alert(`Mood "${mood}" is now your security mood!`);
  };

  // 25. Random Joke Auth
  const joke2Btn = document.createElement('button');
  joke2Btn.id = 'joke2Btn';
  joke2Btn.className = 'reflection-btn';
  joke2Btn.innerHTML = `<span class="material-symbols-outlined">sentiment_satisfied</span>Joke Auth`;
  joke2Btn.style.marginTop = '8px';
  joke2Btn.onclick = function() {
    const jokes = [
      "What do you call a fake noodle? An Impasta!",
      "Why did the bicycle fall over? It was two-tired!",
      "What do you call cheese that isn't yours? Nacho cheese!"
    ];
    alert(jokes[Math.floor(Math.random() * jokes.length)]);
  };

  // 26. Favorite Sport Auth
  const sportBtn = document.createElement('button');
  sportBtn.id = 'sportBtn';
  sportBtn.className = 'reflection-btn';
  sportBtn.innerHTML = `<span class="material-symbols-outlined">sports_soccer</span>Sport Auth`;
  sportBtn.style.marginTop = '8px';
  sportBtn.onclick = function() {
    const sport = prompt("What's your favorite sport?");
    alert(`Sport "${sport}" is now your security sport!`);
  };

  // 27. Favorite Superhero Auth
  const heroBtn = document.createElement('button');
  heroBtn.id = 'heroBtn';
  heroBtn.className = 'reflection-btn';
  heroBtn.innerHTML = `<span class="material-symbols-outlined">supervisor_account</span>Superhero Auth`;
  heroBtn.style.marginTop = '8px';
  heroBtn.onclick = function() {
    const hero = prompt("Who's your favorite superhero?");
    alert(`Welcome, ${hero ? hero : "Hero"}!`);
  };

  // 28. Random Dance Move Auth
  const dance3Btn = document.createElement('button');
  dance3Btn.id = 'dance3Btn';
  dance3Btn.className = 'reflection-btn';
  dance3Btn.innerHTML = `<span class="material-symbols-outlined">directions_run</span>Random Dance Move`;
  dance3Btn.style.marginTop = '8px';
  dance3Btn.onclick = function() {
    alert("Do a random dance move! If you did, you're in!");
  };

  // 29. Favorite Meme Auth
  const memeBtn = document.createElement('button');
  memeBtn.id = 'memeBtn';
  memeBtn.className = 'reflection-btn';
  memeBtn.innerHTML = `<span class="material-symbols-outlined">insert_emoticon</span>Meme Auth`;
  memeBtn.style.marginTop = '8px';
  memeBtn.onclick = function() {
    const meme = prompt("What's your favorite meme?");
    alert(`Meme "${meme}" is now your security meme!`);
  };

  // 30. Random Fruit Auth
  const fruitBtn = document.createElement('button');
  fruitBtn.id = 'fruitBtn';
  fruitBtn.className = 'reflection-btn';
  fruitBtn.innerHTML = `<span class="material-symbols-outlined">nutrition</span>Fruit Auth`;
  fruitBtn.style.marginTop = '8px';
  fruitBtn.onclick = function() {
    const fruits = ["🍎", "🍌", "🍉", "🍇", "🍓", "🍍", "🥝"];
    alert("Your security fruit is: " + fruits[Math.floor(Math.random() * fruits.length)]);
  };

  // Insert after main reflection button
  const refBtn = document.querySelector('.reflection-btn');
  refBtn.parentNode.insertBefore(emojiPwdBtn, refBtn.nextSibling);
  refBtn.parentNode.insertBefore(jokeCaptchaBtn, emojiPwdBtn.nextSibling);
  refBtn.parentNode.insertBefore(danceBtn, jokeCaptchaBtn.nextSibling);
  refBtn.parentNode.insertBefore(handshakeBtn, danceBtn.nextSibling);
  refBtn.parentNode.insertBefore(petBtn, handshakeBtn.nextSibling);
  refBtn.parentNode.insertBefore(iceBtn, petBtn.nextSibling);
  refBtn.parentNode.insertBefore(colorBtn, iceBtn.nextSibling);
  refBtn.parentNode.insertBefore(riddleBtn, colorBtn.nextSibling);
  refBtn.parentNode.insertBefore(animalBtn, riddleBtn.nextSibling);
  refBtn.parentNode.insertBefore(faceBtn, animalBtn.nextSibling);
  refBtn.parentNode.insertBefore(jokeBtn, faceBtn.nextSibling);
  refBtn.parentNode.insertBefore(reverseBtn, jokeBtn.nextSibling);
  refBtn.parentNode.insertBefore(songBtn, reverseBtn.nextSibling);
  refBtn.parentNode.insertBefore(numBtn, songBtn.nextSibling);
  refBtn.parentNode.insertBefore(magicBtn, numBtn.nextSibling);
  refBtn.parentNode.insertBefore(dance2Btn, magicBtn.nextSibling);
  refBtn.parentNode.insertBefore(cartoonBtn, dance2Btn.nextSibling);
  refBtn.parentNode.insertBefore(foodBtn, cartoonBtn.nextSibling);
  refBtn.parentNode.insertBefore(soundBtn, foodBtn.nextSibling);
  refBtn.parentNode.insertBefore(oppBtn, soundBtn.nextSibling);
  refBtn.parentNode.insertBefore(pirateBtn, oppBtn.nextSibling);
  refBtn.parentNode.insertBefore(knockBtn, pirateBtn.nextSibling);
  refBtn.parentNode.insertBefore(weatherBtn, knockBtn.nextSibling);
  refBtn.parentNode.insertBefore(moodBtn, weatherBtn.nextSibling);
  refBtn.parentNode.insertBefore(joke2Btn, moodBtn.nextSibling);
  refBtn.parentNode.insertBefore(sportBtn, joke2Btn.nextSibling);
  refBtn.parentNode.insertBefore(heroBtn, sportBtn.nextSibling);
  refBtn.parentNode.insertBefore(dance3Btn, heroBtn.nextSibling);
  refBtn.parentNode.insertBefore(memeBtn, dance3Btn.nextSibling);
}

// After assembling the main section, add the language selector and study detail feature
addLanguageSelector(reflectionPrompts, showRandomPrompt);
addStudyDetailFeature(promptDiv, reflectionPrompts);

// Add offline wellness features
addBreathingExerciseFeature();
addHydrationReminderFeature();
addPostureCheckFeature();
addLowIntensityModeFeature();

// Add global culture/intercultural features
addGlobalCultureFeatures();

// Add spiritual excitement features
addSpiritualExcitementFeatures();

// Add advanced NLP/AI understanding features
addAdvancedNLPFeatures();

// Add fun, playful security features
addFunSecurityFeatures();

// Add in-app command/code update feature
addInAppCommandFeature();

// --- AI Model Compatibility & Extensibility ---

// Helper: List of supported AI endpoints and models (for future extensibility)
const supportedAIProviders = [
  {
    name: "OpenAI",
    endpoint: "https://api.openai.com/v1/chat/completions",
    models: ["gpt-3.5-turbo", "gpt-4", "gpt-4o"]
  },
  {
    name: "LM Studio",
    endpoint: "http://localhost:1234/v1/chat/completions",
    models: ["Llama", "Mistral", "Phi", "Gemma", "Any GGUF"]
  },
  {
    name: "Ollama",
    endpoint: "http://localhost:11434/api/chat",
    models: ["llama2", "mistral", "phi", "codellama", "wizardlm"]
  },
  {
    name: "Google Gemini",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    models: ["gemini-pro"]
  },
  {
    name: "Groq",
    endpoint: "https://api.groq.com/openai/v1/chat/completions",
    models: ["llama3-8b-8192", "llama3-70b-8192", "mixtral-8x7b-32768", "gemma-7b-it"]
  }
  // Add more as needed
];

// Helper: Show AI compatibility info in the UI
function showAICompatibilityInfo() {
  if (document.getElementById('aiCompatInfo')) return;
  const aiDiv = document.createElement('div');
  aiDiv.id = 'aiCompatInfo';
  aiDiv.style.background = '#ede7f6';
  aiDiv.style.color = '#4527a0';
  aiDiv.style.borderRadius = '8px';
  aiDiv.style.padding = '10px 14px';
  aiDiv.style.margin = '14px 0 8px 0';
  aiDiv.style.fontSize = '0.98em';
  aiDiv.style.boxShadow = '0 1px 4px rgba(49,27,146,0.06)';
  aiDiv.innerHTML = `
    <span class="material-symbols-outlined info-icon">hub</span>
    <b>AI Model Compatibility:</b>
    <ul style="margin:6px 0 0 18px;padding:0;">
      ${supportedAIProviders.map(p =>
        `<li><b>${p.name}</b> <span style="color:#888;">(${p.endpoint.replace(/^https?:\/\//, '').split('/')[0]})</span>
          <br><span style="font-size:0.97em;">Models: ${p.models.join(', ')}</span></li>`
      ).join('')}
    </ul>
    <div style="margin-top:6px;">
      <span class="material-symbols-outlined info-icon">edit</span>
      <b>Future-Proof:</b> You can add new AI endpoints and models in <code>supportedAIProviders</code>.<br>
      <span class="material-symbols-outlined info-icon">api</span>
      <b>How to use:</b> Set your endpoint/model in the extension options. The UI and code are designed to be easily extensible for any future AI.
    </div>
  `;
  document.body.appendChild(aiDiv);
}

// Show AI compatibility info at the bottom of the popup
document.addEventListener('DOMContentLoaded', function() {
  showAICompatibilityInfo();
});

// --- Extensible AI Query Helper (future use) ---
async function queryAI({ provider, prompt, model, apiKey, endpoint, extraParams }) {
  // This is a generic function for future extensibility
  // You can add provider-specific logic here as needed
  let url = endpoint || provider.endpoint;
  let headers = { 'Content-Type': 'application/json' };
  if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
  let body = {};

  if (provider.name === "OpenAI" || provider.name === "Groq" || provider.name === "LM Studio") {
    body = {
      model: model,
      messages: [{ role: "user", content: prompt }],
      ...extraParams
    };
  } else if (provider.name === "Ollama") {
    body = {
      model: model,
      messages: [{ role: "user", content: prompt }],
      stream: false,
      ...extraParams
    };
  } else if (provider.name === "Google Gemini") {
    body = {
      contents: [{ parts: [{ text: prompt }] }],
      ...extraParams
    };
  } else {
    // Fallback for unknown providers
    body = { prompt, ...extraParams };
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    const data = await res.json();
    // You can add provider-specific response parsing here
    return data;
  } catch (e) {
    return { error: e.message };
  }
}
