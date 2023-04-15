import datetime, os, requests
from pathlib import Path
from dotenv import load_dotenv
from Stage import Stage

load_dotenv()

MONTHS = {"January": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6, "July": 7, "August": 8,
          "September": 9, "October": 10, "November": 11, "December": 12}
PLAYER_NAME = "hiyah"
API_BASE_URL = "https://osu.ppy.sh/api/v2/"
CLIENT_SECRET = os.getenv('client-secret')

def str_to_date(s: str):
    
    mth, day, yr = s.split(" ")
    mth = str(MONTHS[mth])
    day = day.replace(",", "")
    return f"{yr}-{mth}-{day}"

class Tournament:

    def __init__(self, data, issues):

        # known tournament issues (refer to issues.txt)
        self.ISSUES = issues

        # Tourney start date 
        self.__date = str_to_date(data['date']) 

        # Tournament name
        self.__tournName = data['tourn_name']

        # forum post
        self.__forum = data['forum']

        # Tournament sheet
        self.__tournSheet = data['tourn_sheet']

        # Link to a Challonge Bracket
        self.__bracket = data['bracket'] 

        # Tourney acronym
        guess = self.__guess_tourn_acronym(data['tourn_name']) # TO-DO: ADD LINK TO FORUM HERE
        if self.__forum: print(self.__forum) 
        elif self.__tournSheet: print(self.__tournSheet)
        elif self.__bracket: print(self.__bracket)
        else: print("No supporting tournament data")
        correct = input(f"Default Acronym -> [{guess}] / Enter correct if wrong: ")
        self.__acronym = guess if correct == "" else correct 

        # Player's team name for the tournament
        self.__teamName = data['team_name'] if data['team_name'] != "" else PLAYER_NAME

        # Rank range
        self.__rankRange = data['rank_range']

        # Seed of the player
        self.__seed = data['seed']

        # Format of the tournament
        self.__format = data['format']
        
        # Team size of the tournament
        self.__teamSize = data['team_size']

        # Player's placing
        self.__placement = data['placement']

        # additional notes about tournament 
        self.__notes = data['misc']

        # player's comments about tournament 
        self.__comments = data['notes']

        # TO-DO: FM rules or mod multiplier rules for the tournament
        self.__multipliers = {} 

        # player's teammates for the tournament
        ct = 1
        tmp = []
        while ct <= 16:
            if data[f'p{ct}'] != '':
                tmp.append(data[f'p{ct}'])
            else:
                break
            ct += 1
        
        self.__teammates = tmp

        # stores ascending list of all mps for the tournament
        self.__mps = [] 

        # handle issue 1 where a tournament can use multiple acronyms
        if 1 in issues:
            next_acr = "placeholder"
            all_acronyms = [self.__acronym] 
            while next_acr != "":
                next_acr = input("Enter additional acronym: ")
                if next_acr != "": all_acronyms.append(next_acr)
            self.__mps = self.__get_mps(all_acronyms)
        else: self.__mps = self.__get_mps([self.__acronym])

        # collection of Stage objects with keys representing the round ex. QF, SF, RO16, etc.
        # TO-DO: figure out this part
        self.__stages = [] 
        ct = 1
        qualifiersHappened = False
        while len(self.__mps) != 0:
            next_mp = self.__mps[0]
            self.__mps.pop(0)

            # Check if mp is a qualifier lobby
            s = Stage(f'Match {str(ct)}', [next_mp], self.__teamName, self.__multipliers, qualifiersHappened)
            if s.qualifiers == True:
                self.__stages.append({'Qualifiers': s})
                qualifiersHappened = True
            else: 
                self.__stages.append({f'Match {ct}': s})
                ct += 1
    
    def __guess_tourn_acronym(self, tourn_title: str) -> str:
        """
        Attemps to guess the tournament acronym based on the tournament title.
        """
        try:
            words = tourn_title.split(" ")
            tourn_title = ""
            for w in words:
                tourn_title += w[0] if w != "" else ""
            return tourn_title
        except:
            return ""
        
    def __get_mps(self, acronyms: list[str]) -> list[int]:
        """
        Looks through all known tournament matches and finds matches with the corresponding acronym.
        Returns list in ascending order.
        """
        matches_file = Path('../match_parser/matches.txt')
        with open(matches_file, 'r') as f:
            contents = f.read()
        all_mps = contents.split("\n")

        data = {
            'client_id': 21309,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'client_credentials',
            'scope': 'public',
        }
        response = requests.post('https://osu.ppy.sh/oauth/token', data=data)
        token = response.json().get('access_token')
        headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': f'Bearer {token}',
        }

        # Search from both start and end
        old = 0
        new = len(all_mps) - 1
        
        while old <= new:
            resp = requests.get(f'{API_BASE_URL}matches/{all_mps[old]}', headers=headers)
            # print("Parsing match " + all_mps[old])
            match_info = resp.json()
            try:
                match_name = match_info['match']['name'] 
                mp_acr = match_name.split(" ")[0].replace(":", "")
                if mp_acr in acronyms: # surely no acronyms have spaces in them
                    self.__mps.append(all_mps[old])

                    # Keep checking mps after this until 15 mps have passed that are not from this tournament, then terminate early.
                    # Assumption that the player does not play 15 other tournament matches between this and the next match.
                    condition = 0
                    old += 1
                    while condition < 15 and old <= new:
                        condition += 1
                        resp = requests.get(f'{API_BASE_URL}matches/{all_mps[old]}', headers=headers)
                        # print("Parsing match " + all_mps[old])
                        match_info = resp.json()
                        try:
                            match_name = match_info['match']['name'] 
                            acr = match_name.split(" ")[0].replace(":", "")
                            if acr in acronyms: 
                                condition = 0
                                self.__mps.append(all_mps[old])
                        except Exception as e:
                            print("Unknown issue with " + all_mps[old] + ". Consider removing from matches.txt ")
                        old += 1

                    # All mps have been found without extra searches
                    break 

            except Exception as e:
                print("Unknown issue with " + all_mps[old] + ". Consider removing from matches.txt ")
        
            resp = requests.get(f'{API_BASE_URL}matches/{all_mps[new]}', headers=headers)
            # print("Parsing match " + all_mps[new])
            match_info = resp.json()
            try:
                match_name = match_info['match']['name'] 
                mp_acr = match_name.split(" ")[0].replace(":", "")
                if mp_acr in acronyms: 
                    self.__mps.insert(0, all_mps[new]) # insert at front of list since goign backwards

                    condition = 0
                    new -= 1
                    while condition < 15 and new >= old:
                        condition += 1
                        resp = requests.get(f'{API_BASE_URL}matches/{all_mps[new]}', headers=headers)
                        # print("Parsing match " + all_mps[new])
                        match_info = resp.json()
                        try:
                            match_name = match_info['match']['name'] 
                            acr = match_name.split(" ")[0].replace(":", "")
                            if acr in acronyms: 
                                condition = 0
                                self.__mps.insert(0, all_mps[new])
                        except Exception as e:
                            print("Unknown issue with " + all_mps[new] + ". Consider removing from matches.txt ")
                        new -= 1

                    break

            except Exception as e:
                print("Unknown issue with " + all_mps[new] + ". Consider removing from matches.txt ")

            old += 1
            new -= 1

        print("mps found: ")
        print(self.__mps)

        # Handling for issue 3 - same acronym used by multiple tournaments
        if 3 in self.ISSUES: 
            
            # Determine range of mps to process for this tournament
            # Hopefully there are no tournaments using the same acronym that run at the same time.
            first_mp = input("First mp to start from (empty if from start): ")
            last_mp = input("Enter last mp to cut off from mps (empty if last): ")
            remaining_mps = []
            add = True if first_mp == "" else False
            for mp in self.__mps:
                if str(mp) == last_mp:
                    break # Done iterating
                elif str(mp) == first_mp:
                    add = True
                if add: 
                    remaining_mps.append(mp)
            
            # Replace list of mps
            self.__mps = remaining_mps 

        return self.__mps


    def getTournament(self):
        stages_txt = []
        for stage in self.__stages:
            for round, stage_data in stage.items():
                stages_txt.append({round: stage_data.getStage()})

        return {self.__tournName: {
            "date": self.__date,
            "acronym": self.__acronym,
            "forum": self.__forum,
            "bracket": self.__bracket,
            "team_name": self.__teamName,
            "tourn_sheet": self.__tournSheet,
            "rank_range": self.__rankRange,
            "seed": self.__seed,
            "format": self.__format,
            "team_size": self.__teamSize,
            "placement": self.__placement,
            "notes": self.__notes,
            "comments": self.__comments,
            "teammates": self.__teammates,
            "stages": stages_txt
        }} # stub