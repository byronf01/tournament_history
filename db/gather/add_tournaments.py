import sys, os, re, json
sys.path.append('../classes')
from get_tournament_data import sheet_data
from Tournament import Tournament
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

PASSWORD = os.getenv('mongo-password')
URI = f"mongodb+srv://byronfong:{PASSWORD}@tournament-history.qp41sza.mongodb.net/?retryWrites=true&w=majority"
ESCAPE = ["\\", "$", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}"]

# Tournaments with known issues (ex: VNDB had two acronyms)
ISSUES = {}
with open("issues.txt", "r") as f:
    t = f.read()
t = t.split('\n')
for line in t:
    if line[0] == '#': continue
    tourn, issues = line.rsplit(":", 1)
    ISSUES[tourn] = [int(issue) for issue in issues.split(",")]

def construct_tourn(tourn: dict) -> Tournament:
    issue_6 = False
    for char in ESCAPE:
        if char in tourn['tourn_name']: 
            if tourn['tourn_name'] not in ISSUES:
                ISSUES[tourn['tourn_name']] = []
            ISSUES[tourn['tourn_name']].append(6)
            break

    if tourn['tourn_name'] in ISSUES:
        print(f"Warning: Tournament {tourn['tourn_name']} has issue(s) {ISSUES[ tourn['tourn_name'] ]}")
        t = Tournament(tourn, ISSUES[tourn['tourn_name']])
    else:
        t = Tournament(tourn, [0])
    return t


if __name__ == "__main__":

    if len(sys.argv) > 1 and sys.argv[1] == 'debug':
        pass
    else:
        # Connect to the local MongoDB server
        client = MongoClient(URI, server_api=ServerApi('1'))

    try:
        if len(sys.argv) > 1 and sys.argv[1] == 'debug':
            pass
        else:
            client.admin.command('ping')
            print("Successfully connected to MongoDB")

            # Select a database and collection
            db = client['tournament_history']
            collection = db['tournament_history']


        data = sheet_data()
        # data = {"54": data[54]} # stub for testing
        
        for _, v in data.items():

            # Error handling for issue 4 - ignore tournament
            if v['tourn_name'] in ISSUES and 4 in ISSUES[v['tourn_name']]:
                print("Tournament " + v['tourn_name'] + " skipped")
                continue

            if len(sys.argv) > 1 and sys.argv[1] == 'debug':
                pass
            else:
                # Add tournament object to database if it is not already in 
                query1 = { v['tourn_name']: {"$exists": True} }
                modified = v['tourn_name']
                for char in ESCAPE:
                    modified = modified.replace(char, "")
                query2 = { modified: {"$exists": True} }

                dup = collection.count_documents(query1) + collection.count_documents(query2)
                if dup > 0:
                    print(f"Tournament {v['tourn_name']} already in database ")
                    continue 
                
            
            # Begin constructing mew tournament object
            try:
                t = construct_tourn(v)
                # DEBUG MODE: do not add tournament to database 
                if len(sys.argv) > 1 and sys.argv[1] == 'debug':
                    print(t.getTournament())
                else:
                    collection.insert_one(t.getTournament())
                    print("New tournament added! ")
            except Exception as e:
                print(e)
                foo = input("Continue? (Y/N) ")
                if foo == 'N':
                    break
    except Exception as e:
        print(e)
    finally:
        if len(sys.argv) > 1 and sys.argv[1] == 'debug': pass
        else: client.close()
        
    

        
    