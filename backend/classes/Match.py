import os, requests, json, re, time
from dotenv import load_dotenv

load_dotenv()

API_BASE_URL = "https://osu.ppy.sh/api/v2/"
CLIENT_SECRET = os.getenv('client-secret')

class Match:

    def __init__(self, id: str, teamName: str, multipliers: dict):
        
        # API data
        self.__apiData = {
            'client_id': 21309,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'client_credentials',
            'scope': 'public',
        }

        # Match ID
        self.__id = id

        # the user's team name
        self.__teamName = teamName

        # Name of the match
        self.__name = "" 

        # Stores collection of match multipliers, should be supplied by tournament obj
        # Ex: {"EZ": 1.80, "HD": 0.96}
        self.__multipliers = multipliers

        # outcome of the match, blue - red
        self.__result = [0, 0]

        # team type of the match
        self.__teamType = ""

        # Stores a list of events that happened during the match
        self.__events = {}

        # Stores players on each team. If teamType is head-to-head, default {team_blue: your_user, team_red: opponent}
        self.__teams = {}

        # stores collection of match costs per player
        self.__matchcosts = {} 
        
        """
        print("Review mp manually (None if no irregularities) ")
        a = input("# warmups:  ")
        b = input("# extraneous maps at end: ")
        c = input("map number of aborts separated by commas:")
        self.__warmups = 2 if a == "" else int(a)
        self.__end = 0 if b == "" else int(b)
        self.__aborts = [] if c == "" else [int(foo) for foo in c.split(",")]
        
        self.__events = self.__process()
        """

    """
    def __process(self):
        
        Main function that proccesses the mp. Returns a dictionary of maps that were played in the match and details of each map. 
        
        try:
            response = requests.post('https://osu.ppy.sh/oauth/token', data=self.__apiData)
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
        
        # print(info)

        self.__name = info['match']['name'] # finds and enters match name 

        # keeps track of which matches to ignore with ignore, and the team type of the match
        team_type_counts = {"head-to-head": 0, "team-vs": 0}
        total = 0
        for event in info['events']:
            if event['detail']['type'] == 'other':
                total += 1
                team_type_counts[ event['game']['team_type'] ] += 1
        ignore = []
        for i in range(1, self.__warmups + 1):
            ignore.append(i)
        ignore.extend(self.__aborts)
        for i in range(total, total - self.__end, -1):
            ignore.extend(i)
        self.__teamType = 'team-vs' if team_type_counts['team-vs'] >= team_type_counts['head-to-head'] else 'head-to-head'
        
        maps_played = 0
        index = 0
        team_check = {} # form {player: {blue: x, red: y}}
        for event in info['events']:
            if event['detail']['type'] == 'other':
                maps_played += 1
                if maps_played in ignore:
                    continue
                index += 1

                map_link = "https://osu.ppy.sh/b/" + str(event['game']['beatmap']['id'])
                map_background = event['game']['beatmap']['beatmapset']['covers']['cover']
                artist = event['game']['beatmap']['beatmapset']['artist']
                title = event['game']['beatmap']['beatmapset']['title']
                difficulty = event['game']['beatmap']['version']
                map_title = f'{artist} - {title} [{difficulty}]'

                scores = event['game']['scores']
                # Process list of scores
                if self.__teamType == 'team-vs':

                    blue_score = 0
                    red_score = 0
                    blue_team = set()
                    red_team = set()
                    for s in scores:

                        # Determine team that the score belongs to
                        pass
                        # Determine team of the player and add to set

                    
                    # Compare red - blue scores, add 1 to match result for winning team
                        

                elif self.__teamType == 'head-to-head':
                    pass
    """
                      
    def getMatch(self):
        return {self.__id: {
                "match_name": self.__name,
                "team-type": self.__teamType,
                "multipliers": self.__multipliers,
                "result": self.__result,
                "matchcosts": [{}, {}], # TO-DO
                "events": {}
            }
        } # what should be the key for match? match title? match id? should there even be a key?

if __name__ == "__main__":
    multipliers = {"EZ": 1.8}
    m = Match(107542811, "hiyah", multipliers)
    print(m.getMatch())