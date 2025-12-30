import random
from collections import defaultdict
import json
import os

class RLAgent:
    """
    Base class for a Reinforcement Learning Agent.
    """
    def __init__(self, actions):
        self.actions = actions

    def choose_action(self, state, explore=True):
        raise NotImplementedError

    def learn(self, state, action, reward, next_state):
        raise NotImplementedError

    def _state_to_key(self, state):
        """
        Converts a state dict to a hashable key for tabular methods.
        Override for complex state representations.
        """
        return json.dumps(state, sort_keys=True)

class QLearningAgent(RLAgent):
    """
    A simple Q-Learning agent for discrete states and actions.
    """
    def __init__(self, actions, learning_rate=0.1, discount_factor=0.9, epsilon=0.1):
        super().__init__(actions)
        self.q_table = defaultdict(lambda: {action: 0.0 for action in actions})
        self.learning_rate = learning_rate
        self.discount_factor = discount_factor
        self.epsilon = epsilon # Exploration-exploitation trade-off

    def choose_action(self, state, explore=True):
        state_key = self._state_to_key(state)
        if explore and random.uniform(0, 1) < self.epsilon:
            return random.choice(self.actions) # Explore
        else:
            # Exploit (choose action with max Q-value)
            q_values = self.q_table[state_key]
            max_q = max(q_values.values())
            # Handle multiple actions with the same max Q-value
            best_actions = [action for action, q in q_values.items() if q == max_q]
            return random.choice(best_actions)

    def learn(self, state, action, reward, next_state):
        state_key = self._state_to_key(state)
        next_state_key = self._state_to_key(next_state)

        old_q_value = self.q_table[state_key][action]
        next_max_q = max(self.q_table[next_state_key].values()) if self.q_table[next_state_key] else 0.0

        new_q_value = old_q_value + self.learning_rate * (
            reward + self.discount_factor * next_max_q - old_q_value
        )
        self.q_table[state_key][action] = new_q_value

    def save(self, filepath):
        # Ensure the directory exists before saving
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, 'w') as f:
            # Convert defaultdict to dict for JSON serialization
            serializable_q_table = {k: dict(v) for k, v in self.q_table.items()}
            json.dump({
                'q_table': serializable_q_table,
                'actions': self.actions,
                'learning_rate': self.learning_rate,
                'discount_factor': self.discount_factor,
                'epsilon': self.epsilon
            }, f)

    def load(self, filepath):
        if not os.path.exists(filepath):
            print(f"No existing agent data found at {filepath}. Starting new.")
            return

        with open(filepath, 'r') as f:
            data = json.load(f)
            self.actions = data['actions']
            self.learning_rate = data['learning_rate']
            self.discount_factor = data['discount_factor']
            self.epsilon = data['epsilon']
            # Reconstruct defaultdict from loaded data
            self.q_table = defaultdict(lambda: {action: 0.0 for action in self.actions})
            for state_key, q_values_dict in data['q_table'].items():
                self.q_table[state_key] = {k: float(v) for k, v in q_values_dict.items()}

# Example of a more complex state representation for function approximation (conceptual)
class DQN_Agent(RLAgent):
    # This would typically involve a neural network,
    # and is more complex than simple Q-learning.
    # Placeholder for illustration.
    def choose_action(self, state, explore=True):
        # ... logic for neural network inference ...
        pass
    def learn(self, state, action, reward, next_state):
        # ... logic for training neural network ...
        pass
