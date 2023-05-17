import sys, os, re, json, requests, time
from datetime import datetime
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

PASSWORD = os.getenv('mongo_password')
URI = f"mongodb+srv://byronfong:{PASSWORD}@tournament-history.qp41sza.mongodb.net/?retryWrites=true&w=majority"
API_BASE_URL = "https://osu.ppy.sh/api/v2/"
CLIENT_SECRET = os.getenv('client_secret')
DEFAULT_BANNER = 'https://assets.ppy.sh/contests/74/header@2x.jpg?20190116'

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

def add_banner():
    """
    Code for adding banners to documents

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
    """

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

def fixGBD():
    """
    the tournament under the acronym GBD for some reason doesnt have the correct schema 
    """
    client = MongoClient(URI, server_api=ServerApi('1'))

    client.admin.command('ping')
    print("Successfully connected to MongoDB")

    # Insert to new collection
    db = client['tournament_history']
    collection = db['tournament_historyV1.1']

    for doc in collection.find( {'acronym': "GBD" } ):
        # stages is supposed to be an array not a dict
        stages = doc['stages']
        arr = []
        foo = [{k: stages[k]} for k in sorted(stages)]
        for i in foo:
            arr.append(foo)
        collection.update_one( {'acronym': "GBD" }, { "$set": { 'stages': foo } })
        
        print(f'Tournament {doc["title"]} modified')

    client.close()

def fixBFB():
    """
    bfb wrong placement
    """
    client = MongoClient(URI, server_api=ServerApi('1'))

    client.admin.command('ping')
    print("Successfully connected to MongoDB")

    # Insert to new collection
    db = client['tournament_history']
    collection = db['tournament_historyV1.1']

    collection.update_one( {'acronym': "BFB" }, { "$set": { 'placement': 'Quarterfinals' } })

    client.close()

if __name__ == "__main__":
    fixBFB()
    

    # 5/7 RESTRUCTURING DB
            


    
    