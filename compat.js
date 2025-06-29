// compat.js

// Cross-browser compatibility layer for browser.* API with Promises
if (typeof window.browser === 'undefined') {
  window.browser = (function() {
    // Use native browser API if available (Firefox)
    if (
      typeof window.navigator !== 'undefined' &&
      window.navigator.userAgent &&
      window.navigator.userAgent.includes('Firefox') &&
      typeof window.browser !== 'undefined'
    ) {
      console.log("Using native browser API (Firefox).");
      return window.browser;
    }
    // On Chromium, browser may be undefined, so fallback to chrome
    if (typeof window.chrome === 'undefined' || window.chrome === null) {
      console.warn("No chrome or browser API found.");
      return {};
    }

    const CHROME_APIS = [
      'storage', 'runtime', 'tabs', 'action', 'extension', 'windows', 'scripting', 'declarativeNetRequest'
      // ...add more as needed...
    ];

    const promisify = (api) => {
      if (!api) return api;
      return new Proxy(api, {
        get(target, prop) {
          if (!target) return undefined;
          const original = target[prop];
          if (typeof original === 'function') {
            // Special handling for chrome.scripting.executeScript
            if (window.chrome.scripting && target === window.chrome.scripting && prop === 'executeScript') {
              return function(details) {
                return new Promise((resolve, reject) => {
                  try {
                    original(details, (result) => {
                      if (window.chrome.runtime.lastError) {
                        return reject(window.chrome.runtime.lastError);
                      }
                      resolve(result);
                    });
                  } catch (e) {
                    reject(e);
                  }
                });
              };
            }
            // Generic promisification for methods expecting a callback
            return function(...args) {
              return new Promise((resolve, reject) => {
                try {
                  original(...args, (result) => {
                    if (window.chrome.runtime.lastError) {
                      if (window.chrome.runtime.lastError.message !== "The message port closed before a response was received.") {
                        return reject(window.chrome.runtime.lastError);
                      }
                    }
                    resolve(result);
                  });
                } catch (e) {
                  reject(e);
                }
              });
            };
          } else if (typeof original === 'object' && original !== null) {
            return promisify(original);
          }
          return original;
        }
      });
    };

    const browserAlias = {};
    for (const api of CHROME_APIS) {
      if (window.chrome[api]) {
        if (['storage', 'tabs', 'runtime', 'action', 'scripting'].includes(api)) {
          browserAlias[api] = promisify(window.chrome[api]);
        } else {
          browserAlias[api] = window.chrome[api];
        }
      }
    }

    // Defensive: check existence before assignment
    if (window.chrome.runtime && typeof window.chrome.runtime.sendMessage === 'function') {
      browserAlias.runtime.sendMessage = function(...args) {
        return new Promise((resolve, reject) => {
          try {
            window.chrome.runtime.sendMessage(...args, (response) => {
              if (window.chrome.runtime.lastError) {
                if (window.chrome.runtime.lastError.message !== "The message port closed before a response was received.") {
                  return reject(window.chrome.runtime.lastError);
                }
              }
              resolve(response);
            });
          } catch (e) {
            reject(e);
          }
        });
      };
    }

    if (window.chrome.tabs && typeof window.chrome.tabs.sendMessage === 'function') {
      browserAlias.tabs.sendMessage = function(...args) {
        return new Promise((resolve, reject) => {
          try {
            window.chrome.tabs.sendMessage(...args, (response) => {
              if (window.chrome.runtime.lastError) {
                if (window.chrome.runtime.lastError.message !== "The message port closed before a response was received.") {
                  return reject(window.chrome.runtime.lastError);
                }
              }
              resolve(response);
            });
          } catch (e) {
            reject(e);
          }
        });
      };
    }

    // Handle getURL, which is chrome.runtime.getURL in MV3 in both browsers
    if (window.chrome.runtime && typeof window.chrome.runtime.getURL === 'function') {
      browserAlias.runtime.getURL = window.chrome.runtime.getURL;
    } else if (window.chrome.extension && typeof window.chrome.extension.getURL === 'function') {
      browserAlias.runtime.getURL = window.chrome.extension.getURL;
    }

    // If chrome.action exists (MV3), use it. Otherwise, fallback to chrome.browserAction (MV2)
    if (typeof window.chrome.action !== 'undefined') {
      browserAlias.action = promisify(window.chrome.action);
    } else if (typeof window.chrome.browserAction !== 'undefined') {
      browserAlias.action = promisify(window.chrome.browserAction);
    }

    console.log("Using Chrome-based API with Promises shim.");
    return browserAlias;
  })();
}

// Define a global log function if not already present
if (typeof window.log === 'undefined') {
  window.log = function log(scriptName, message, ...args) {
    const now = new Date();
    const time = now.toLocaleTimeString();
    console.log(`[${scriptName}] [${time}] ${message}`, ...args);
  };
}

// Defensive helper for safe property access (deep optional chaining fallback)
function safeGet(obj, path, fallback = undefined) {
  try {
    return path.split('.').reduce((o, k) => (o && o[k] !== undefined ? o[k] : undefined), obj) ?? fallback;
  } catch {
    return fallback;
  }
}

// --- International Spiritual & Cultural Compatibility Helpers ---

function getSpiritualGreeting(lang = 'en') {
  const greetings = {
    en: "Peace and blessings upon you.",
    ur: "السلام علیکم (Peace be upon you)",
    ar: "السلام عليكم (Peace be upon you)",
    hi: "नमस्ते (Namaste - I bow to you)",
    sw: "Amani iwe juu yako (Peace be upon you)",
    zh: "平安与你同在 (Peace be with you)",
    es: "La paz sea contigo.",
    fr: "Que la paix soit sur vous.",
    he: "שלום עליכם (Shalom Aleichem)",
    fa: "سلامتی بر شما باد",
    ru: "Мир вам.",
    th: "สันติสุขจงมีแด่คุณ",
    id: "Salam sejahtera untukmu",
    tr: "Selam ve esenlik üzerinize olsun.",
    ja: "あなたに平安がありますように",
  };
  return greetings[lang] || greetings['en'];
}

function getSpiritualSymbol(culture = 'universal') {
  const symbols = {
    universal: "☀️",
    islam: "🕌",
    christian: "✝️",
    jewish: "✡️",
    hindu: "🕉️",
    buddhist: "☸️",
    sikh: "🪯",
    sufi: "🌙",
    indigenous: "🪶",
    african: "🌍",
    eastasian: "🧧",
    baha'i: "🌈",
    zoroastrian: "🔥",
    tao: "☯️",
    shinto: "⛩️",
  };
  return symbols[culture] || symbols['universal'];
}

function getCulturalWisdom(tradition = 'universal') {
  const wisdoms = {
    universal: "May your path be filled with light.",
    islam: "Actions are judged by intentions. (Hadith)",
    christian: "Love your neighbor as yourself.",
    jewish: "Justice, justice you shall pursue.",
    hindu: "Truth alone triumphs. (Satyam eva jayate)",
    buddhist: "The mind is everything. What you think, you become.",
    sikh: "Truth is high, but higher still is truthful living.",
    sufi: "Let the beauty you love be what you do. (Rumi)",
    indigenous: "We are all related. (Mitakuye Oyasin)",
    african: "Ubuntu: I am because we are.",
    eastasian: "Let your heart be at peace. (Tao Te Ching)",
    baha'i: "So powerful is the light of unity that it can illuminate the whole earth.",
    zoroastrian: "Good thoughts, good words, good deeds.",
  };
  return wisdoms[tradition] || wisdoms['universal'];
}

function getSupportedSpiritualLanguages() {
  return [
    { code: 'en', name: 'English' },
    { code: 'ur', name: 'اردو (Urdu)' },
    { code: 'ar', name: 'العربية (Arabic)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'he', name: 'עברית (Hebrew)' },
    { code: 'fa', name: 'فارسی (Persian)' },
    { code: 'ru', name: 'Русский' },
    { code: 'th', name: 'ไทย (Thai)' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ja', name: '日本語 (Japanese)' }
  ];
}
    { code: 'en', name: 'English' },
    { code: 'ur', name: 'اردو (Urdu)' },
    { code: 'ar', name: 'العربية (Arabic)' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'sw', name: 'Kiswahili' },
    { code: 'zh', name: '中文 (Chinese)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'he', name: 'עברית (Hebrew)' },
    { code: 'fa', name: 'فارسی (Persian)' },
    { code: 'ru', name: 'Русский' },
    { code: 'th', name: 'ไทย (Thai)' },
    { code: 'id', name: 'Bahasa Indonesia' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ja', name: '日本語 (Japanese)' }
    // Add more as needed
  ];
}

// Example usage for UI or notifications:
// const greeting = getSpiritualGreeting(userLang);
// const symbol = getSpiritualSymbol(userCulture);
// const wisdom = getCulturalWisdom(userTradition);
