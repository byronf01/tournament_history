"""
This module contains all the functions needed to update various items in
the database. Some functions only needed to run once and have been commented out.
"""

import sys, os, re, json, requests, time, random, string
sys.path.append('../classes')
from datetime import datetime
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from Tournament import Tournament
from add_tournaments import add_tournament

load_dotenv()

PASSWORD = os.getenv('mongo_password')
URI = f"mongodb+srv://byronfong:{PASSWORD}@tournament-history.qp41sza.mongodb.net/?retryWrites=true&w=majority"
API_BASE_URL = "https://osu.ppy.sh/api/v2/"
CLIENT_SECRET = os.getenv('client_secret')
DEFAULT_BANNER = 'https://assets.ppy.sh/contests/74/header@2x.jpg?20190116'

ISSUES = {}
with open("issues.txt", "r") as f:
    t = f.read()
t = t.split('\n')
for line in t:
    if line[0] == '#': continue
    tourn, issues = line.rsplit(":", 1)
    ISSUES[tourn] = [int(issue) for issue in issues.split(",")]

def add_dates(): 
    """
    Code for adding date objects to documents

    if "date_f" not in r[first_k].keys():
        prevDate = r[first_k]["date"]
        y, m, d = prevDate.split("-")
        date_f = datetime(int(y), int(m), int(d))
        new_field = {'$set': {f'{first_k}.date_f': date_f}}
        collection.update_one(query, new_field)
        print(f'{first_k} updated')
   """
    
def getBanner(forum: str) -> str:
    
    try:
        apidata = {
            'client_id': 21309,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'client_credentials',
            'scope': 'public',
        }
        response = requests.post('https://osu.ppy.sh/oauth/token', apidata)
        token = response.json().get('access_token')

        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f'Bearer {token}',
        }

        forum_id = forum.split("/")[-1]
        forum_info = requests.get(f'{API_BASE_URL}forums/topics/{forum_id}', headers=headers)
        info = forum_info.json()

        main = info['posts'][0]['body']['raw']

        # Look for the first img tag
        case = r'\[img\](.*?)\[\/img\]'
        match = re.search(case, main)
        if match:
            return match.groups()[0]
        else:
            print(f"Banner not found at {forum}")
            return DEFAULT_BANNER
        
    except:
        print("API failure")
        raise ValueError()

def add_banner(collection):
    """
    Code for adding banners to documents
    """

    for doc in collection.find():
        try:
            first_k = ""
            for k in doc.keys():
                if k != "_id":
                    first_k = k
            query = { first_k: {"$exists": True} }
            resp = collection.find(query)
            for r in resp:
                if "banner" not in r[first_k].keys():
                    if r[first_k]['forum'] == "":
                        banner = DEFAULT_BANNER
                    else:
                        banner = getBanner(r[first_k]['forum'])
                    new_field = {'$set': {f'{first_k}.banner': banner}}
                    collection.update_one(query, new_field)
                    print(f"Banner {banner} added to {first_k}")

        except Exception as e:
            print(e)
            cont = input("Continue? ")
            if cont != "":
                pass
            else: exit()

def get_all_data():
    client = MongoClient(URI, server_api=ServerApi('1'))

    client.admin.command('ping')
    print("Successfully connected to MongoDB")

    # Select a database and collection
    db = client['tournament_history']
    collection = db['tournament_history']

    data_master = {}
    for doc in collection.find():
        for k in doc.keys():
            if k != "_id":
                data_master[k] = doc[k]

    client.close()

    return data_master

def convert(data: dict):
    """
    Restructures data in database as of 5/13/2023
    """
    client = MongoClient(URI, server_api=ServerApi('1'))

    client.admin.command('ping')
    print("Successfully connected to MongoDB")

    # Insert to new collection
    db = client['tournament_history']
    collection = db['tournament_historyV1.1']

    for k, v in data.items():
        # New schema
        doc = v
        doc["title"] = k

        collection.insert_one(doc)
        print(f'Tournament {doc["title"]} added to DB')

    client.close()

def gen_id():
    """
    5/31/23 - Add id to each tournament object to replace problem of URLs not being unique
    (ex: /tournaments/GSHT can be either GSHT1 or GSHT3)
    """
    
    client = MongoClient(URI, server_api=ServerApi('1'))
    client.admin.command('ping')
    print("Successfully connected to MongoDB")
    db = client['tournament_history']
    collection = db['tournament_historyV1.1']
    for doc in collection.find():
        new_id = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(6))
        title = doc['title']
        collection.update_one( { 'title': title } , { '$set': { 'url_id': new_id }})

def update_tournaments_main():
    """
    Main function for updating tournaments. Adds newer matches to corresponding tournaments by
    comparing master list of matches and every match in the database.
    """
    # Parse master list of matches
    additional, table = parse_ebot()

    # compare to all matches in database
    existing = set()
    client = MongoClient(URI, server_api=ServerApi('1'))
    client.admin.command('ping')
    print("Successfully connected to MongoDB")
    db = client['tournament_history']
    collection = db['tournament_historyV1.1']
    for doc in collection.find():
        for stage in doc['stages']:
            for _, matches in stage.items():
                for match in matches:
                    mp = [k for k in match.keys()][0]
                    existing.add(mp)

    # for each match not in database, keep track of what tournaments need to be updated based on acronym
    fix = set()
    for mp in additional:
        if str(mp) not in existing:
            try:
                # get tournament acronym of mp
                fix.add(table[str(mp)])
            except KeyError as e:
                continue

    print(f'Problems: {fix}')
    select = input('Enter tournaments to fix, separated by space: (Other options: none/all): ')
    if fix == 'none':
        fix = []
    elif fix == 'all':
        pass
    else:
        fix = select.split(" ")
    # fix tournaments
    for acr in fix:
        res = collection.find({ 'acronym': acr })
        # if mp is from an invalid tournament i.e not in db, should skip over it

        for doc in res:
            data = {}
            for k, v in doc.items():
                data[k] = v
            
            issues = ISSUES[doc['title']] if doc['title'] in ISSUES else [0]
            print(f"Updating {data['title']}")
            updated_tournament = Tournament(data, issues)
            print(updated_tournament.getTournament())
            input('Commit to DB? (Ctrl+C to quit): ')
            collection.replace_one({'title': data['title']}, updated_tournament.getTournament())
            print(f"{data['title']} updated in DB ")

    client.close()

def parse_ebot():
    """
    Parses matches in the master list from elitebot and adds any new ones to matches.txt
    """
    target = set()
    foo = {}

    with open("../match_parser/multi-matches-16626263.txt", "r") as f:
        contents = f.read()
    contents = contents.split('\n')
    for line in contents:
        exp = r'[0-9]{2}-[0-9]{4} - ([0-9a-zA-Z!\. ]+): \(.*\) ----- https://osu.ppy.sh/community/matches/([0-9]+)'
        match = re.search(exp, line) 
        if match:
            if match.group(1) not in ["o!mm Private", "ETX", "o!mm Ranked", "o!mm Team Private"]:
                target.add(int(match.group(2)))
                foo[match.group(2)] = match.group(1)

    existing_mps = set()
    with open("../match_parser/matches.txt", 'r') as f:
        for mp in f:
            existing_mps.add(int(mp.rstrip('\n')))

    full_set = target.union(existing_mps)
    export_full_set = sorted(full_set)

    with open('../match_parser/matches.txt', 'w') as f:
        for mp in export_full_set:
            f.write(str(mp) + "\n")

    return (full_set, foo)

def update_misc():
    """
    Updates fields such as bracket, seed, notes, comments, placement. 
    """
    client = MongoClient(URI, server_api=ServerApi('1'))
    client.admin.command('ping')
    print("Successfully connected to MongoDB")
    db = client['tournament_history']
    collection = db['tournament_historyV1.1']
    while True:
        title = input('Enter name of tournament to be updated (None to exit): ')
        if title == '': break
        res = collection.find({ 'title': title })
        for doc in res:
            field = 'foo'
            while field != '':
                field = input('Enter field to update (None to exit): ')
                if field == '': continue
                elif field not in doc.keys():
                    print('Field not found ')
                    continue
                update = input(f'{field} currently {doc[field]}, new value: ') 
                collection.update_one({ 'title': title }, { '$set' : { field: update }})

if __name__ == "__main__":

    if "add" in sys.argv: 
        add_tournament()
    update_tournaments_main()
    if "misc" in sys.argv:
        update_misc()
    


    
    