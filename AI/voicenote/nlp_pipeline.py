import re

def extract_soap(transcript: str) -> dict:
    subjective = objective = assessment = plan = ""
    t = transcript.lower()

    # SUBJECTIVE
    match_subj = re.search(r'(complaining of|presenting with|with)\s(.+?)(\.|,)', t)
    if match_subj:
        subjective = match_subj.group(2).strip()

    # OBJECTIVE
    bp_match = re.search(r'(bp|blood pressure) (is )?(\d+[\s/]+[\d]+)', t)
    if bp_match:
        objective += f"BP {bp_match.group(3)}, "

    oxygen_match = re.search(r'oxygen (level|saturation)? (is )?(\d+)%?', t)
    if oxygen_match:
        objective += f"Oxygen {oxygen_match.group(3)}%, "

    pulse_match = re.search(r'pulse (rate )?(is )?(\d+)', t)
    if pulse_match:
        objective += f"Pulse {pulse_match.group(3)}"

    objective = objective.strip(", ")

    # ASSESSMENT
    match_assess = re.search(r'(suspected|likely|possible|i suspect)\s+([a-zA-Z\s]+?)(\.|,)', t)
    if match_assess:
        assessment = f"{match_assess.group(1).capitalize()} {match_assess.group(2).strip()}"

    # PLAN
    match_plan = re.search(r'(start|recommend|we will start|suggest)\s(.+?)(\.|$)', t)
    if match_plan:
        plan = f"{match_plan.group(1).capitalize()} {match_plan.group(2).strip()}"

    return {
        "subjective": subjective,
        "objective": objective,
        "assessment": assessment,
        "plan": plan
    }
