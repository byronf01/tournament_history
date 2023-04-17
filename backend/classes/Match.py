import os, requests, json, re, time
from dotenv import load_dotenv
from Score import Score

load_dotenv()

API_BASE_URL = "https://osu.ppy.sh/api/v2/"
CLIENT_SECRET = os.getenv('client-secret')
DEFAULT_USER = 16626263

class Match:

    def __init__(self, id: str, teamName: str, multipliers: dict, issues: list):
        
        self.ISSUES = issues 

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

        # stores collection of match costs per player, split by team. Winning team is first.
        self.__matchcosts = [{}, {}]

        # Boolean value, True if mp was a qualifier lobby
        self.qualifiers = False
        
        # Handling for issue 5 - treat every match has a qualifier lobby
        if 5 in self.ISSUES: self.qualifiers = True
        
        print("Review mp manually (blank if no irregularities) ")
        print(f'https://osu.ppy.sh/community/matches/{self.__id}')
        a = input("# warmups:  ")
        b = input("# extraneous maps at end: ")
        self.__warmups = 2 if a == "" else int(a)
        self.__end = 0 if b == "" else int(b)
        
        self.__process()

    def __apiCall(self):
        """
        function makes multiple API calls to the osu API for details of a match, including match name. Filters out aby \
        events in a match that are not maps that are being played. Returns a list of events of matches being played 
        in chronological order. 
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

            # finds and enters match name from first call 
            self.__name = info['match']['name'] 

            # determine if qualifier lobby from match name
            case = r'[( ]Qual'
            match = re.search(case, self.__name)
            if match: self.qualifiers = True

        except:
            print("API failure")
            raise ValueError()
        
        all_events = []
        
        # grr no do while loop grr
        while True: 
            for event in range(len(info['events']) - 1, -1, -1):
                if info['events'][event]['detail']['type'] == 'other':
                    all_events.insert(0, info['events'][event])

            if info['events'][0]['detail']['type'] == "match-created":
                # If there are no more events left to process, end
                break 
            else:
                try:
                    last_event_id = info['events'][0]['id']
                    score_info = requests.get(f'{API_BASE_URL}matches/{str(self.__id)}?before={str(last_event_id)}', headers=headers)
                    info = score_info.json()
                except Exception as e:
                    print(e)
                    raise ValueError()

        return all_events
    
    def __preprocess(self, events: list) -> list[int]:
        """
        Determines the team type of the match by taking the team type that was used throughout the majority of the match.
        Also returns a list of events to be ignored, in ascending order and with each number representing the # event to
        be ignored.
        """
        team_type_counts = {"head-to-head": 0, "team-vs": 0}
        event_ct = 0
        aborts = []
        prev_id = 0
        for event in events:

            event_ct += 1
            team_type_counts[ event['game']['team_type'] ] += 1

            # If the same map as the previous event is being played at this event, means first instance was 
            # an abort and should be ignored
            try:
                if event['game']['beatmap']['beatmapset_id'] == prev_id:
                    aborts.append(event_ct - 1)
                prev_id = event['game']['beatmap']['beatmapset_id']
            except KeyError:
                # beatmap deleted, use beatmap id as last resort in case of replay of abort of a deleted map
                if event['game']['beatmap_id'] == prev_id:
                    aborts.append(event_ct - 1)
                prev_id = event['game']['beatmap_id']

        ignore = []
        for i in range(1, self.__warmups + 1):
            ignore.append(i)
        for a in aborts:
            # Handle case where warm ups can be aborted
            while a in ignore:
                a += 1
            ignore.append(a)
        for i in range(event_ct, event_ct - self.__end, -1):
            ignore.append(i)
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

    def __calculateMatchcosts(self, average_map_score, player_scores):
        """
        Calculates the matchcosts of each player, then splits up the information by team.
        """
        # Special case for qualifiers: all players in red team
        if self.qualifiers:
            self.__matchcosts[0]['red_team'] = {}
            self.__matchcosts[1]['blue_team'] = {}

             # Calculate each player's individual matchcost, then assign player/matchcost pair to the appropriate 
            # matchcost collection
            for player, scores in player_scores.items():
                mc_sum = 0
                for map, score in scores.items():
                    mc_sum += (score / average_map_score[map])
                cost = (2 / (len(scores) + 2) ) * mc_sum

                self.__matchcosts[0]['red_team'][str(player)] = cost

        else:
            blue, red = (None, None)
            if self.__result[0] > self.__result[1]:
                self.__matchcosts[0]['blue_team'] = {}
                self.__matchcosts[1]['red_team'] = {}
                blue, red = (0, 1)
            elif self.__result[1] > self.__result[0]:
                self.__matchcosts[0]['red_team'] = {}
                self.__matchcosts[1]['blue_team'] = {}
                blue, red = (1, 0)
            else:
                raise ValueError("match was a tie")
            
            # Calculate each player's individual matchcost, then assign player/matchcost pair to the appropriate 
            # matchcost collection
            for player, scores in player_scores.items():
                mc_sum = 0
                for map, score in scores.items():
                    mc_sum += (score / average_map_score[map])
                cost = (2 / (len(scores) + 2) ) * mc_sum

                if player in self.__teams['team_blue']:
                    self.__matchcosts[blue]['blue_team'][str(player)] = cost
                elif player in self.__teams['team_red']:
                    self.__matchcosts[red]['red_team'][str(player)] = cost
    
    def __process(self):
        """
        Main function that proccesses the mp. Parses maps that were played in the match and details of each map. 
        Adds to self.__events in the order that the maps were played.
        """
        events = self.__apiCall()
        # print(events)

        # keeps track of which matches to ignore with ignore, and the team type of the match
        ignore = self.__preprocess(events)

        maps_played = 0
        index = 0
        team_check = {} # form {player: {blue: x, red: y}}
        average_map_score = {} # {map #: average score across lobby}
        player_scores = {} # {player: {map # played: score, 2nd map # played: score, ...}}
        for event in events:
            
            maps_played += 1
            if maps_played in ignore:
                continue
            index += 1

            try:
                map_link = "https://osu.ppy.sh/b/" + str(event['game']['beatmap']['id'])
                map_background = event['game']['beatmap']['beatmapset']['covers']['cover']
                artist = event['game']['beatmap']['beatmapset']['artist']
                title = event['game']['beatmap']['beatmapset']['title']
                difficulty = event['game']['beatmap']['version']
                map_title = json.dumps(f'{artist} - {title} [{difficulty}]')
            except:
                # Deleted beatmap
                map_link = "https://osu.ppy.sh/b/" + str(event['game']['beatmap_id'])
                map_background = ""
                map_title = "deleted beatmap"

           
            # Start processing list of scores
            scores = event['game']['scores']
            if self.qualifiers: # Special case for qualifiers
                if scores == []: continue 

                lobby_total = 0
                lobby_scores = {}
                for s in scores:
                    
                    new_score = Score(s)

                    # Process score with multipliers, use default multipliers if none specified
                    for mod in new_score.mods:
                        if mod in self.__multipliers:
                            new_score.value *= self.__multipliers[mod]

                    # add any new players to the red team
                    if new_score.player not in team_check:
                        team_check[new_score.player] = {'blue': 0, 'red': 1}

                    # add player's score to player_scores dict
                    if new_score.player not in player_scores:
                        player_scores[new_score.player] = {}
                    player_scores[new_score.player][index] = new_score.value

                    # add player's score to the lobby's total score
                    lobby_total += new_score.value 

                    # add score to lobby_scores, team doesn't matter for qualifiers
                    formatted_score = new_score.getScore()
                    lobby_scores[formatted_score[0]] = formatted_score[1]

                # Calculate average_scores
                average_score = lobby_total / len(scores)
                average_map_score[index] = average_score

                # Add entire event to self.events
                new_event = {
                    "map-background": map_background,
                    "map-title": map_title,
                    "map-link": map_link,
                    "red_scores": lobby_scores,
                    "blue_scores": {},
                    "red_total": 0,
                    "blue_total": 0
                }

                self.__events.append(new_event)

            elif self.__teamType == 'team-vs':

                # Filter out events that are not team-vs
                if event['game']['team_type'] != 'team-vs': continue

                # handle special case where map was aborted before any player started
                if scores == []: continue 

                # Team calculations
                blue_total = 0
                red_total = 0
                blue_scores = {}
                red_scores = {}

                for s in scores:
                    
                    new_score = Score(s)

                    # Process score with multipliers, use default multipliers if none specified
                    for mod in new_score.mods:
                        if mod in self.__multipliers:
                            new_score.value *= self.__multipliers[mod]

                    # add player's score to player_scores dict
                    if new_score.player not in player_scores:
                        player_scores[new_score.player] = {}
                    player_scores[new_score.player][index] = new_score.value

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

                # Calculate average_scores
                average_score = (blue_total + red_total) / len(scores)
                average_map_score[index] = average_score

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
                if event['game']['team_type'] != 'head-to-head': continue

                # handle special case where map was aborted before any player started
                if scores == []: continue 
                
                user_score = 0
                opponent_score = 0
                blue_scores = {}
                red_scores = {}

                for s in scores:

                    new_score = Score(s)

                    # Process score with multipliers, use default multipliers if none specified
                    for mod in new_score.mods:
                        if mod in self.__multipliers:
                            new_score.value *= self.__multipliers[mod]

                    # add player's score to player_scores dict
                    if new_score.player not in player_scores:
                        player_scores[new_score.player] = {}
                    player_scores[new_score.player][index] = new_score.value
                    
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

                # Calculate average_scores
                average_score = (user_score + opponent_score) / len(scores)
                average_map_score[index] = average_score

                if user_score > opponent_score:
                    self.__result[0] += 1
                else:
                    self.__result[1] += 1

                new_event = {
                    "map-background": map_background,
                    "map-title": map_title,
                    "map-link": map_link,
                    "red_scores": red_scores,
                    "blue_scores": blue_scores,
                    "red_total": opponent_score,
                    "blue_total": user_score
                }

                self.__events.append(new_event)

        self.__calculateTeams(team_check)
        self.__calculateMatchcosts(average_map_score, player_scores)
                      
    def getMatch(self):
        return {self.__id: {
                "match_name": self.__name,
                "team-type": self.__teamType,
                "multipliers": self.__multipliers,
                "result": self.__result,
                "teams": self.__teams,
                "matchcosts": self.__matchcosts,
                "events": self.__events,
                "qualifiers": self.qualifiers
            }
        }

if __name__ == "__main__":
    multipliers = {"EZ": 1.8}
    m = Match('101244342', "hiyah", multipliers, []) 
    print(m.getMatch())