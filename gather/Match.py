import os, requests, json, re, time
from dotenv import load_dotenv

load_dotenv()

API_BASE_URL = "https://osu.ppy.sh/api/v2/"
CLIENT_SECRET = os.getenv('client-secret')

class Match:

    def __init__(self, id: int):
        
        # API data
        self.__apiData = {
            'client_id': 21309,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'client_credentials',
            'scope': 'public',
        }

        # Match ID
        self.__id = id

        # Name of the match
        self.__name = "" 

        # Stores a list of events that happened during the match
        self.__events = {}

        # outcome of the match
        self.__result = (0, 0)

        # stores collection of match costs per player
        self.__matchcosts = {} 


        self.__events = self.__getEvents()

        

    def __getEvents(self):
        """
        Returns a dictionary of maps that were played in the match and details of each map. Also updates the name 
        of the Match object without making another API call.
        """
        try:
            response = requests.post('https://osu.ppy.sh/oauth/token', data=data)
            token = response.json().get('access_token')

            headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': f'Bearer {token}',
            }

            score_info = requests.get(f'{API_BASE_URL}matches/{str(self.__id)}', headers=headers)
            info = score_info.json()
        except:
            print("API failure")
            raise ValueError()

        self.__name = info['match']['name'] 

        for event in info['events']:
            if event['detail']['type'] == 'other':


    def getMatch():
        return None # what should be the key for match? match title?
