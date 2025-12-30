// --- Configuration ---
const WORSHIP_WINDOWS = [{ start: 9, end: 10 }, { start: 19, end: 20 }]; // 9am-10am, 7pm-8pm
const DISTRACTING_SITES = ["youtube.com", "twitter.com", "facebook.com", "instagram.com", "reddit.com"];
const GUARDIAN_ACTIONS = ["NoAction", "SoftBlock"];
const GUARDIAN_AGENT_STORAGE_KEY = "guardian_agent_qtable";

// --- RL Agent Initialization ---
const guardianAgent = new QLearningAgent(GUARDIAN_ACTIONS);
let lastActionState = {}; // Store the state that led to the last action

// --- Core Logic ---
async function initialize() {
    await guardianAgent.load(GUARDIAN_AGENT_STORAGE_KEY);
    console.log("Sacred Silence Guardian initialized.");
    
    // Listen for tab URL changes
    browser.tabs.onUpdated.addListener(handleTabUpdate, { properties: ["status", "url"] });

    // Listen for feedback from the content script
    browser.runtime.onMessage.addListener(handleFeedback);
}

function handleTabUpdate(tabId, changeInfo, tab) {
    // Fire only when the tab has finished loading and has a URL
    if (changeInfo.status !== 'complete' || !tab.url) {
        return;
    }
    
    const url = new URL(tab.url);
    const isDistracting = DISTRACTING_SITES.some(site => url.hostname.includes(site));
    const isWorshipWindow = WORSHIP_WINDOWS.some(win => {
        const hour = new Date().getHours();
        return hour >= win.start && hour < win.end;
    });

    if (isDistracting && isWorshipWindow) {
        const state = { isWorshipWindow, onDistractingSite: true };
        const action = guardianAgent.chooseAction(state);

        console.log(`Guardian State: ${JSON.stringify(state)}, Action: ${action}`);

        if (action === "SoftBlock") {
            // Store the state and action for when we get feedback
            lastActionState = { state, action, tabId };
            // Inject the content script to apply the blur
            browser.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });
        }
    }
}

async function handleFeedback(message) {
    if (message.feedback === 'user_proceeded' && lastActionState.state) {
        console.log("User proceeded. Learning from this feedback.");
        // The user overrode the block, so this was not a good intervention.
        const reward = -10; // Negative reward
        const nextState = { isWorshipWindow: true, onDistractingSite: false }; // Assume they will focus now
        
        guardianAgent.learn(lastActionState.state, lastActionState.action, reward, nextState);
        await guardianAgent.save(GUARDIAN_AGENT_STORAGE_KEY);

        // Clear the last state
        lastActionState = {};
    }
}

initialize();
