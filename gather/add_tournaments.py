from get_tournament_data import sheet_data
import Tournament

# Tournaments with known issues (ex: VNDB had two acronyms)
ISSUES = {"Visual Novel Duo Brackets": 1}

def construct_tourn(tourn: dict) -> Tournament:
    if tourn['tourn_name'] in ISSUES:
        print(f"Warning: Tournament {tourn['tourn_name']} has issue {ISSUES[ tourn['tourn_name'] ]}")
        t = Tournament(tourn, ISSUES[tourn['tourn_name']])
    else:
        t = Tournament(tourn, 0)
    return t

# note that if there are any fields that cant be filled they should be filled manually

# Enter forum post (what if no forum?)
    # get tournament's name (probably have to do manually)
    # get tournament start-end date?
    # get spreadsheet from forum
    # get bracket from forum or spreadsheet

# Enter the tournament acronym(s) ? vndb moment
    # tournament acronym then used to find all mps with matching acronym

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
    for _, v in data.items():
        
        # Begin constructing tournament object
        t = construct_tourn(v)

        # Add tournament object to database

    
    # classify tournaments by acronym??