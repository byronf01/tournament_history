import os, requests, json, re, time
from dotenv import load_dotenv
from Score import Score

load_dotenv()

API_BASE_URL = "https://osu.ppy.sh/api/v2/"
CLIENT_SECRET = os.getenv('client-secret')
DEFAULT_USER = 16626263

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

        # outcome of the match, blue - red. If head-to-head, your user is always first.
        self.__result = [0, 0]

        # team type of the match
        self.__teamType = ""

        # Stores a list of events that happened during the match
        self.__events = []

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
        
        self.__process()

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
                # If scores is empty, map was aborted early and does not show up in mp. 
                if event['game']['scores'] == []:
                    continue 

                event_ct += 1
                team_type_counts[ event['game']['team_type'] ] += 1

                # If the same map as the previous event is being played at this event, means first instance was 
                # an abort and should be ignored
                if event['game']['beatmap']['beatmapset_id'] == prev_id:
                    aborts.append(event_ct - 1)
                prev_id = event['game']['beatmap']['beatmapset_id']

        ignore = []
        for i in range(1, self.__warmups + 1):
            ignore.append(i)
        ignore.extend(aborts)
        for i in range(event_ct, event_ct - self.__end, -1):
            ignore.extend(i)
        self.__teamType = 'team-vs' if team_type_counts['team-vs'] >= team_type_counts['head-to-head'] else 'head-to-head'
        return ignore
    
    def __calculateTeams(self, team_check: dict):
        """
        Figures out who is on which team from the team_check dict generated in __process. If the match type is 
        head-to-head, always defaults your user to blue team. 
        """
        self.__teams['team_blue'] = []
        self.__teams['team_red'] = []
        for user, teams in team_check.items():
            if teams['red'] >= teams['blue']:
                self.__teams['team_red'].append(user)
            elif teams['blue'] > teams['red']:
                self.__teams['team_blue'].append(user)

    
    def __process(self):
        """
        Main function that proccesses the mp. Parses maps that were played in the match and details of each map. 
        Adds to self.__events in the order that the maps were played.
        """
        info = self.__apiCall()

        # finds and enters match name 
        self.__name = info['match']['name'] 

        # keeps track of which matches to ignore with ignore, and the team type of the match
        ignore = self.__preprocess(info)
        
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

                    blue_total = 0
                    red_total = 0
                    blue_scores = {}
                    red_scores = {}
                    
                    for s in scores:
                        
                        new_score = Score(s)

                        # Process score with multipliers, use default multipliers if none specified
                        for mod in new_score.mods:
                            if mod in multipliers:
                                new_score.value *= multipliers[mod]

                        # Add player to team_check dict if this is their first map
                        if new_score.player not in team_check:
                            team_check[new_score.player] = {'blue': 0, 'red': 0}

                        # Determine team that the score belongs to
                        team = new_score.team
                        if team == 'red':
                            red_total += new_score.value
                            formatted_score = new_score.getScore()
                            red_scores[formatted_score[0]] = formatted_score[1]
                        elif team == 'blue':
                            blue_total += new_score.value
                            formatted_score = new_score.getScore()
                            blue_scores[formatted_score[0]] = formatted_score[1]
                        
                        # determine team of the player and add to team_check
                        team_check[new_score.player][team] += 1
                        
                    # Compare red - blue scores, add 1 to match result for winning team
                    if blue_total > red_total:
                        self.__result[0] += 1
                    elif red_total > blue_total:
                        self.__result[1] += 1

                # Add entire event to self.events
                new_event = {
                    "map-background": map_background,
                    "map-title": map_title,
                    "map-link": map_link,
                    "red_scores": red_scores,
                    "blue_scores": blue_scores,
                    "red_total": red_total,
                    "blue_total": blue_total
                }

                self.__events.append(new_event)

            elif self.__teamType == 'head-to-head':

                # Filter out events that are not head-to-head
                if event['game']['team_type'] != 'team-vs': continue
                
                user_score = 0
                opponent_score = 0
                blue_scores = {}
                red_scores = {}
                for s in scores:

                    new_score = Score(s)

                    # Process score with multipliers, use default multipliers if none specified
                    for mod in new_score.mods:
                        if mod in multipliers:
                            new_score.value *= multipliers[mod]
                    
                    if new_score.player == DEFAULT_USER:
                        user_score += new_score.value
                        formatted_score = new_score.getScore()
                        blue_scores[formatted_score[0]] = formatted_score[1]
                        team_check[new_score.player] = {'blue': 1, 'red': 0}
                    else:
                        opponent_score += new_score.value
                        formatted_score = new_score.getScore()
                        red_scores[formatted_score[0]] = formatted_score[1]
                        team_check[new_score.player] = {'blue': 0, 'red': 1}

                if user_score > opponent_score:
                    self.__result[0] += 1
                else:
                    self.__result[1] += 1

                new_event = {
                    "map-background": map_background,
                    "map-title": map_title,
                    "map-link": map_link,
                    "red_scores": red_scores,
                    "blue_scores": user_score,
                    "red_total": opponent_score,
                    "blue_total": user_score
                }

                self.__events.append(new_event)

        self.__calculateTeams(team_check)

                      
    def getMatch(self):
        return {self.__id: {
                "match_name": self.__name,
                "team-type": self.__teamType,
                "multipliers": self.__multipliers,
                "result": self.__result,
                "teams": self.__teams,
                "matchcosts": [{}, {}], # TO-DO
                "events": self.__events
            }
        } # what should be the key for match? match title? match id? should there even be a key?

if __name__ == "__main__":
    multipliers = {"EZ": 1.8}
    m = Match('103526237', "hiyah", multipliers)
    print(m.getMatch())