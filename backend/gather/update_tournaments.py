import sys, os, re, json
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

PASSWORD = os.getenv('mongo-password')
URI = f"mongodb+srv://byronfong:{PASSWORD}@tournament-history.qp41sza.mongodb.net/?retryWrites=true&w=majority"

if __name__ == "__main__":
    client = MongoClient(URI, server_api=ServerApi('1'))

    client.admin.command('ping')
    print("Successfully connected to MongoDB")

    # Select a database and collection
    db = client['tournament_history']
    collection = db['tournament_history']


    for doc in collection.find():
        try:
            first_k = ""
            for k in doc.keys():
                if k != "_id":
                    first_k = k
            query = { first_k: {"$exists": True} }
            new_field = {'$set': {f'{first_k}.alt_name': ''}}
            collection.update_one(query, new_field)
        except Exception as e:
            print(e)
            cont =  input("Continue? ")
            if cont != "":
                pass
            else: exit()
            
    client.close()