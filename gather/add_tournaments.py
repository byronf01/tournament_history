import sys
sys.path.append('../classes')
from get_tournament_data import sheet_data
from Tournament import Tournament

# Tournaments with known issues (ex: VNDB had two acronyms)
ISSUES = {}
with open("issues.txt", "r") as f:
    t = f.read()
t = t.split('\n')
for line in t:
    if line[0] == '#': continue
    tourn, issues = line.split(":")
    ISSUES[tourn] = [int(issue) for issue in issues.split(",")]

def construct_tourn(tourn: dict) -> Tournament:
    if tourn['tourn_name'] in ISSUES:
        print(f"Warning: Tournament {tourn['tourn_name']} has issue(s) {ISSUES[ tourn['tourn_name'] ]}")
        t = Tournament(tourn, ISSUES[tourn['tourn_name']])
    else:
        t = Tournament(tourn, [0])
    return t

# note that if there are any fields that cant be filled they should be filled manually

# get the pools of tournament (if sheet exists else None)

# classify mps by stage ? how to do this 
    # 1) store the pools of the tournament elsewhere and match >3 maps in mp to pool
    # 2) manually

# after matching mps to stage, give match a title ( (good question) vs (la planta) )
    # add list of scores to match obj
        # get scores by checking each event in mp (what to do with warm up?)
            # get map, mods, player(s) and other info


# add match result to match (alternatively use challonge api?) (may have to check manually)
# calculate match costs after knowing # warm up maps

# return tournament obj 

if __name__ == "__main__":
    data = sheet_data()
    data = {"9": data[9]} # for testing
    for _, v in data.items():
        
        # Begin constructing tournament object
        t = construct_tourn(v)
        print(t.getTournament())
        # Add tournament object to database

    
    # classify tournaments by acronym??