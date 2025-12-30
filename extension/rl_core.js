class QLearningAgent {
    constructor(actions, options = {}) {
        this.actions = actions;
        this.learningRate = options.learningRate || 0.1;
        this.discountFactor = options.discountFactor || 0.9;
        this.epsilon = options.epsilon || 0.1; // Exploration rate
        this.qTable = {}; // e.g., { "state_key": { "action1": 0, "action2": 5 } }
    }

    _stateToKey(state) {
        return JSON.stringify(state, Object.keys(state).sort());
    }

    async load(storageKey) {
        const data = await browser.storage.local.get(storageKey);
        if (data && data[storageKey]) {
            this.qTable = data[storageKey];
            console.log(`Agent loaded data from '${storageKey}'`);
        } else {
            console.log(`No agent data found at '${storageKey}'. Starting new.`);
        }
    }

    async save(storageKey) {
        await browser.storage.local.set({ [storageKey]: this.qTable });
    }

    chooseAction(state) {
        const stateKey = this._stateToKey(state);
        this.qTable[stateKey] = this.qTable[stateKey] || this.actions.reduce((acc, action) => ({...acc, [action]: 0.0}), {});

        if (Math.random() < this.epsilon) {
            // Explore
            return this.actions[Math.floor(Math.random() * this.actions.length)];
        } else {
            // Exploit
            const qValues = this.qTable[stateKey];
            let maxQ = -Infinity;
            let bestActions = [];
            for (const action in qValues) {
                if (qValues[action] > maxQ) {
                    maxQ = qValues[action];
                    bestActions = [action];
                } else if (qValues[action] === maxQ) {
                    bestActions.push(action);
                }
            }
            return bestActions[Math.floor(Math.random() * bestActions.length)];
        }
    }

    learn(state, action, reward, nextState) {
        const stateKey = this._stateToKey(state);
        const nextStateKey = this._stateToKey(nextState);

        this.qTable[stateKey] = this.qTable[stateKey] || this.actions.reduce((acc, act) => ({...acc, [act]: 0.0}), {});
        this.qTable[nextStateKey] = this.qTable[nextStateKey] || this.actions.reduce((acc, act) => ({...acc, [act]: 0.0}), {});

        const oldQValue = this.qTable[stateKey][action];
        const nextMaxQ = Math.max(...Object.values(this.qTable[nextStateKey]));

        const newQValue = oldQValue + this.learningRate * (reward + this.discountFactor * nextMaxQ - oldQValue);
        this.qTable[stateKey][action] = newQValue;
    }
}
