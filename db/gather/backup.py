"""
Code to create a backup of data from MongoDB
"""
import sys, os, re, json
from datetime import datetime
from dotenv import load_dotenv
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

PASSWORD = os.getenv('mongo_password')
URI = f"mongodb+srv://byronfong:{PASSWORD}@tournament-history.qp41sza.mongodb.net/?retryWrites=true&w=majority"

if __name__ == "__main__":
    client = MongoClient(URI, server_api=ServerApi('1'))

    client.admin.command('ping')
    print("Successfully connected to MongoDB")

    # Select a database and collection
    db = client['tournament_history']
    collection = db['tournament_history']

    with open('backup.txt', 'a') as f:
        
        for doc in collection.find():
            doc.pop('_id')
            for k in doc.keys(): # should just be 1
                title = k
            doc[k]['date_f'] = str(doc[k]['date_f'])
            f.write(json.dumps(doc, indent = 4) )