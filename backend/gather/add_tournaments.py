import sys, os
sys.path.append('../classes')
from get_tournament_data import sheet_data
from Tournament import Tournament
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

PASSWORD = os.getenv('mongo-password')
URI = f"mongodb+srv://byronfong:{PASSWORD}@tournament-history.qp41sza.mongodb.net/?retryWrites=true&w=majority"

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


if __name__ == "__main__":

    # Connect to the local MongoDB server
    client = MongoClient(URI, server_api=ServerApi('1'))

    try:
        client.admin.command('ping')
        print("Successfully connected to MongoDB")

        # Select a database and collection
        db = client['tournament_history']
        collection = db['tournament_history']
    except Exception as e:
        print(e)
        exit()

    data = sheet_data()
    data = {"55": data[55]} # stub for testing
    
    for _, v in data.items():

        # Add tournament object to database if it is not already in 
        query = v['tourn_name']
        print(query)
        if collection.find( {query: {'$exists': True}} ) == True:
            print("Tournament already in database ")
            continue 
        
        # Begin constructing mew tournament object
        try:
            t = construct_tourn(v)
            # print(t.getTournament())
            collection.insert_one(t.getTournament())
            print("New tournament added! ")
        except Exception as e:
            print(e)
            foo = input("Continue? (Y/N) ")
            if foo == 'N':
                exit()
        
        

        
    