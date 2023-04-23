import re

"""
Takes a txt file generated by Elitebotix and classifies all mps in file as useful or not useful
"""

if __name__ == "__main__":

    target = set()
    ignore = set()

    with open("multi-matches-16626263.txt", "r") as f:
        contents = f.read()
    contents = contents.split('\n')
    for line in contents:
        exp = r'[0-9]{2}-[0-9]{4} - ([0-9a-zA-Z!\. ]+): \(.*\) ----- https://osu.ppy.sh/community/matches/([0-9]+)'
        match = re.search(exp, line) 
        if match:
            if match.group(1) in ["o!mm Private", "ETX", "o!mm Ranked", "o!mm Team Private"]:
                ignore.add(int(match.group(2)))
            else: 
                target.add(int(match.group(2)))

    target = sorted(target)
    ignore = sorted(ignore)

    with open("target_matches", "w") as f:
        for mp in target:
            f.write(str(mp) + "\n")

    with open("ignore_matches", "w") as f:
        for mp in ignore:
            f.write(str(mp) + "\n")
        