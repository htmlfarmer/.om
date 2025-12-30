import datetime
import os
from rl_core.agent import QLearningAgent

# Define the possible actions for the detector
DETECTOR_ACTIONS = ["NoSuggestion", "SuggestSilence"]
AGENT_DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'fatigue_agent.json')

class AttentionFatigueDetector:
    def __init__(self, max_suggestions_per_day=1):
        self.agent = QLearningAgent(actions=DETECTOR_ACTIONS)
        self.agent.load(AGENT_DATA_PATH)
        self.last_suggestion_time = None
        self.daily_suggestion_count = 0
        self.max_suggestions_per_day = max_suggestions_per_day
        self._reset_daily_count()

    def _reset_daily_count(self):
        today = datetime.date.today()
        if not hasattr(self, '_last_reset_day') or self._last_reset_day != today:
            self.daily_suggestion_count = 0
            self._last_reset_day = today

    def _get_current_state(self, user_activity_level, prev_outcome=None):
        self._reset_daily_count()
        now = datetime.datetime.now()
        time_since_last_suggestion = (now - self.last_suggestion_time).total_seconds() if self.last_suggestion_time else float('inf')

        return {
            "UserActivityLevel": user_activity_level, # "High", "Medium", "Low"
            "TimeSinceLastSuggestion_Bucket": self._bucket_time(time_since_last_suggestion),
            "LastSuggestionOutcome": prev_outcome
        }

    def _bucket_time(self, seconds):
        if seconds < 3600: return "LT_1_Hour"
        return "GT_1_Hour"

    def check_for_suggestion(self, user_activity_level):
        current_state = self._get_current_state(user_activity_level)
        chosen_action = self.agent.choose_action(current_state)

        if self.daily_suggestion_count >= self.max_suggestions_per_day and chosen_action != "NoSuggestion":
            return "NoSuggestion", current_state

        if chosen_action != "NoSuggestion":
            self.last_suggestion_time = datetime.datetime.now()
            self.daily_suggestion_count += 1

        return chosen_action, current_state

    def provide_feedback(self, state, action, outcome):
        reward = self._calculate_reward(action, outcome)
        next_state = self._get_current_state(user_activity_level="Low", prev_outcome=outcome)
        self.agent.learn(state, action, reward, next_state)
        self.agent.save(AGENT_DATA_PATH)

    def _calculate_reward(self, action, outcome):
        if outcome == "accepted": return 10
        if outcome == "annoyed" or outcome == "dismissed": return -5
        if outcome == "feature_disabled": return -100
        return 0

def simulate_detector():
    """Runs a demonstration of the AttentionFatigueDetector."""
    detector = AttentionFatigueDetector()
    activity_level = "High"
    
    print(f"Detector Simulation: User activity level is '{activity_level}'.")
    action, state = detector.check_for_suggestion(activity_level)
    print(f"Agent chose action: {action}")
    
    # Simulate user being annoyed by the suggestion
    user_response = "annoyed"
    print(f"Simulating user response: '{user_response}'")
    detector.provide_feedback(state, action, user_response)
    print("Agent has learned from the interaction and saved its state.")
    print("On the next run, it will be less likely to suggest silence in this state.")
