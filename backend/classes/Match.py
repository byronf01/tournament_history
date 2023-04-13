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
        
        
        print("Review mp manually (blank if no irregularities) ")
        print(f'https://osu.ppy.sh/community/matches/{self.__id}')
        a = input("# warmups:  ")
        b = input("# extraneous maps at end: ")
        self.__warmups = 2 if a == "" else int(a)
        self.__end = 0 if b == "" else int(b)
        
        self.__events = self.__process()

    def __apiCall(self):
        """
        function makes an API call to the osu API for details of a match
        """
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
        return info
    
    def __preprocess(self, info: dict) -> list[int]:
        """
        Determines the team type of the match by taking the team type that was used throughout the majority of the match.
        Also returns a list of events to be ignored, in ascending order and with each number representing the # event to
        be ignored.
        """
        team_type_counts = {"head-to-head": 0, "team-vs": 0}
        event_ct = 0
        aborts = []
        prev_id = 0
        for event in info['events']:
            if event['detail']['type'] == 'other':
                event_ct += 1
                team_type_counts[ event['game']['team_type'] ] += 1

                # If the same map as the previous event is being played at this event, means first instance was 
                # an abort and should be ignored
                if event['game']['beatmap']['beatmapset_id'] == prev_id:
                    aborts.append(event_ct - 1)
                event_ct += 1
                prev_id = event['game']['beatmap']['beatmapset_id']

        ignore = []
        for i in range(1, self.__warmups + 1):
            ignore.append(i)
        ignore.extend(aborts)
        for i in range(event_ct, event_ct - self.__end, -1):
            ignore.extend(i)
        self.__teamType = 'team-vs' if team_type_counts['team-vs'] >= team_type_counts['head-to-head'] else 'head-to-head'
        return ignore
    
    def __process(self):
        """
        Main function that proccesses the mp. Returns a dictionary of maps that were played in the match and details of each map. 
        """
        info = self.__apiCall()
        
        # print(info)

        # finds and enters match name 
        self.__name = info['match']['name'] 

        # keeps track of which matches to ignore with ignore, and the team type of the match
        ignore = self.__preprocess(info)
        print(ignore)
        
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

                    # Filter out events that are not team-vs
                    if event['game']['team_type'] != 'team-vs': continue

                    blue_score = 0
                    red_score = 0
                    blue_team = set()
                    red_team = set()
                    for s in scores:
                        
                        # Process score with multipliers, use default multipliers if none specified
                        
                        # Determine team that the score belongs to
                        pass
                        
                        
                        # Determine team of the player and add to set

                    
                    # Compare red - blue scores, add 1 to match result for winning team

                    # add players to team check
                        

                elif self.__teamType == 'head-to-head':

                    # Filter out events that are not head-to-head
                    if event['game']['team_type'] != 'team-vs': continue
                    pass
                      
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
    m = Match('103526237', "hiyah", multipliers)
    print(m.getMatch())