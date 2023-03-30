"""
This file looks through all osu! mps and stores all mps that are tournament matches and in which "hiyah" has played in.
"""

osu_id = 16626263 # hiyah's osu ID
oldest_fallback = 79322841
newest_fallback = 107658859
ignore = ["o!mm Private", "ETX"]
BASE_URL = "https://osu.ppy.sh/community/matches/"

# Note parse_mps will not find matches that hiyah was not present in but was part of a team
def parse_mps(start=oldest_fallback):

    # Iterate from newest to newest possible mp
    for mp in range(start, newest_fallback):

        # API call and check criteria 1) hiyah in lobby 2) lobby is v2 3) lobby name is "ACRONYM: {something}"
        pass


def update_mps(): 

    # Get all currently known matches
    with open('matches.txt', 'r') as f:
        contents = f.read()
    all_matches = set()
    for mp in contents:
        all_matches.add(int(mp))

    
    # Find new matches
    newest = max(all_matches)
    new_mps = parse_mps(newest)
    if len(new_mps) == 0: return 

    all_matches.union(new_mps)

    # write new matches to match file
    with open('matches.txt', 'w') as f:
        for mp in all_matches:
            f.write(mp + "\n")