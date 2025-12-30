import datetime
import os
from rl_core.agent import QLearningAgent

# Define the possible actions for the guardian
GUARDIAN_ACTIONS = ["NoAction", "SoftBlock", "DelayWithIntentionPrompt"]
# Define path relative to the project root
AGENT_DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'guardian_agent.json')

class TimeWindowGuardian:
    def __init__(self, user_worship_windows, max_interventions_per_day=3):
        self.user_worship_windows = user_worship_windows # List of (start_hour, end_hour) tuples
        self.agent = QLearningAgent(actions=GUARDIAN_ACTIONS)
        self.agent.load(AGENT_DATA_PATH)
        self.last_intervention_time = None
        self.daily_intervention_count = 0
        self.max_interventions_per_day = max_interventions_per_day
        self._reset_daily_count() # Initialize for the current day

    def _reset_daily_count(self):
        today = datetime.date.today()
        if not hasattr(self, '_last_reset_day') or self._last_reset_day != today:
            self.daily_intervention_count = 0
            self._last_reset_day = today

    def _get_current_state(self, is_distracting_site_active, prev_outcome=None):
        self._reset_daily_count()
        now = datetime.datetime.now()
        current_hour = now.hour
        is_within_worship_window = any(start <= current_hour < end for start, end in self.user_worship_windows)
        time_since_last_intervention = (now - self.last_intervention_time).total_seconds() if self.last_intervention_time else float('inf')

        return {
            "IsWithinWorshipWindow": is_within_worship_window,
            "IsDistractingSiteActive": is_distracting_site_active,
            "TimeSinceLastIntervention_Bucket": self._bucket_time(time_since_last_intervention),
        }

    def _bucket_time(self, seconds):
        if seconds < 60: return "LT_1_Min"
        if seconds < 300: return "LT_5_Min"
        return "GT_5_Min"

    def check_for_intervention(self, is_distracting_site_active):
        current_state = self._get_current_state(is_distracting_site_active)
        chosen_action = self.agent.choose_action(current_state)

        if self.daily_intervention_count >= self.max_interventions_per_day and chosen_action != "NoAction":
            return "NoAction", current_state

        if chosen_action != "NoAction":
            self.last_intervention_time = datetime.datetime.now()
            self.daily_intervention_count += 1

        return chosen_action, current_state

    def provide_feedback(self, state, action, outcome):
        reward = self._calculate_reward(action, outcome)
        next_state = self._get_current_state(is_distracting_site_active=False, prev_outcome=outcome)
        self.agent.learn(state, action, reward, next_state)
        self.agent.save(AGENT_DATA_PATH)

    def _calculate_reward(self, action, outcome):
        if outcome == "accepted_stopped_distraction": return 10
        if outcome == "dismissed_ignored": return -5
        if outcome == "feature_disabled": return -100
        return 0

def simulate_guardian():
    """Runs a demonstration of the TimeWindowGuardian."""
    my_worship_windows = [(9, 10), (19, 20)]
    guardian = TimeWindowGuardian(my_worship_windows)

    print("Guardian Simulation: A distracting site is detected within a worship window.")
    is_distracting = True
    
    action, state = guardian.check_for_intervention(is_distracting)
    print(f"Agent chose action: {action}")

    # Simulate user accepting the intervention
    user_response = "accepted_stopped_distraction"
    print(f"Simulating user response: '{user_response}'")
    guardian.provide_feedback(state, action, user_response)
    print("Agent has learned from the interaction and saved its state.")
