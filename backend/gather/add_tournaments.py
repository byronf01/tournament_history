import sys, pymongo
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

# Connect to the local MongoDB server
client = pymongo.MongoClient('mongodb://localhost:27017/')

# Select a database and collection
db = client['tournament_history']
collection = db['tournament_history']

if __name__ == "__main__":
    data = sheet_data()
    data = {"55": data[55]} # stub for testing
    for _, v in data.items():

        # Add tournament object to database if it is not already in 
        query = v['tourn_name']
        if collection.find( {query: {'$exists': True}} ) == True:
            continue 
        
        # Begin constructing mew tournament object
        t = construct_tourn(v)
        # print(t.getTournament())
        collection.insert_one(t)

        
    