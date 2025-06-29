// popup_reflection.js

// Ensure window.browser is polyfilled if it's not native
if (typeof browser === 'undefined' && typeof chrome !== 'undefined') {
  window.browser = chrome;
  console.log("Polyfilling browser API with chrome in popup_reflection.");
} else if (typeof browser !== 'undefined') {
  console.log("Using native browser API (Firefox) in popup_reflection.");
}

function popupReflectionDebugLog(message, ...args) {
    // console.log(`[Reflection Popup] ${message}`, ...args);
}


document.addEventListener('DOMContentLoaded', function() {
  popupReflectionDebugLog('DOMContentLoaded event fired.');
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
        min-width: 360px;
        min-height: 440px;
        border-radius: 18px;
        box-shadow: 0 8px 32px 0 rgba(49,27,146,0.18), 0 1.5px 6px 0 rgba(0,0,0,0.08);
      }
      .reflection-section {
        background: rgba(255,255,255,0.96);
        border-radius: 14px;
        margin-bottom: 22px;
        padding: 20px 18px;
        box-shadow: 0 4px 16px rgba(49,27,146,0.08);
        border: 1px solid #e0e0e0;
      }
      #reflectionPrompt {
        font-size: 1.1em;
        line-height: 1.6;
        color: #4a148c;
        margin-bottom: 20px;
        font-weight: 500;
        text-align: center;
      }
      .controls {
        text-align: center;
        margin-top: 20px;
      }
      button {
        padding: 10px 20px;
        background: linear-gradient(90deg, #673ab7 0%, #9575cd 100%);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1em;
        font-weight: bold;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(103,58,183,0.2);
      }
      button:hover {
        background: linear-gradient(90deg, #5e35b1 0%, #7e57c2 100%);
        box-shadow: 0 6px 16px rgba(103,58,183,0.3);
        transform: translateY(-2px);
      }
      button:active {
        transform: translateY(0);
        box-shadow: 0 2px 8px rgba(103,58,183,0.2);
      }
      .ai-info {
        font-size: 0.8em;
        color: #757575;
        text-align: center;
        margin-top: 30px;
        padding-top: 15px;
        border-top: 1px dashed #e0e0e0;
      }
      textarea#reflectionInput {
        width: 90%;
        min-height: 100px;
        padding: 10px;
        margin-top: 15px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-family: 'Segoe UI', sans-serif;
        font-size: 0.95em;
        resize: vertical;
      }
      button#submitReflectionBtn {
        margin-top: 15px;
        background: linear-gradient(90deg, #4CAF50 0%, #81C784 100%);
      }
      button#submitReflectionBtn:hover {
        background: linear-gradient(90deg, #43A047 0%, #66BB6A 100%);
      }
    `;
    document.head.appendChild(style);
  }

  const reflectionPromptElement = document.getElementById('reflectionPrompt');
  const getNewReflectionBtn = document.getElementById('getNewReflection');
  const reflectionInput = document.getElementById('reflectionInput'); // Assuming this exists now
  const submitReflectionBtn = document.getElementById('submitReflectionBtn'); // Assuming this exists now

  // Function to load and display a new reflection prompt (e.g., paradox or divine metaphor)
  async function loadNewReflection() {
    popupReflectionDebugLog('Loading new reflection...');
    try {
      const response = await browser.runtime.sendMessage({ action: "getReflectionPrompt" }); // New action for dynamic prompts
      if (response && response.prompt) {
        reflectionPromptElement.textContent = response.prompt;
        popupReflectionDebugLog('New reflection loaded:', response.prompt);
      } else {
        reflectionPromptElement.textContent = "Reflect on the boundless nature of Divine Love."; // Fallback
        popupReflectionDebugLog('No specific reflection prompt received, using fallback.');
      }
    } catch (error) {
      popupReflectionDebugLog('Error loading new reflection:', error);
      reflectionPromptElement.textContent = "Reflect on the silence between thoughts, for there lies clarity."; // Fallback
    }
  }

  // Initial load
  loadNewReflection();

  // Button listener
  getNewReflectionBtn.addEventListener('click', loadNewReflection);

  // Submit reflection listener (if reflectionInput and submitReflectionBtn exist)
  if (submitReflectionBtn) {
      submitReflectionBtn.addEventListener('click', async () => {
          const reflectionText = reflectionInput.value.trim();
          if (reflectionText) {
              popupReflectionDebugLog('Submitting reflection:', reflectionText);
              try {
                  // Send reflection back to background script for processing (e.g., Maqam analysis, logging)
                  await browser.runtime.sendMessage({ action: "submitReflection", reflection: reflectionText });
                  alert("Your reflection has been received, beloved soul.");
                  reflectionInput.value = ''; // Clear input
                  window.close(); // Optionally close the popup
              } catch (error) {
                  popupReflectionDebugLog('Error submitting reflection:', error);
                  alert("Failed to submit reflection. Please try again.");
              }
          } else {
              alert("Please write your reflection before submitting.");
          }
      });
  }


  // Helper for displaying AI compatibility info at the bottom of the popup
  function showAICompatibilityInfo() {
    const aiDiv = document.createElement('div');
    aiDiv.className = 'ai-info';
    aiDiv.innerHTML = `
      <p>AI Integration Status: <span id="aiStatus">Connecting...</span></p>
      <p>Provider: <span id="aiProvider">N/A</span></p>
    `;
    document.body.appendChild(aiDiv);

    // This part would typically fetch actual AI status from background.js
    // For now, it's static.
    setTimeout(() => {
      document.getElementById('aiStatus').textContent = 'Active (Local)';
      document.getElementById('aiProvider').textContent = 'Dil ki Dastak (Internal)';
    }, 1000);
  }

  // Show AI compatibility info at the bottom of the popup
  showAICompatibilityInfo();
});

// --- Extensible AI Query Helper (future use) ---
// Note: This function would typically be in background.js for security and access to API keys.
// Leaving it here as a placeholder for architectural clarity.
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
    return data;
  } catch (error) {
    console.error("AI query failed:", error);
    throw error;
  }
}