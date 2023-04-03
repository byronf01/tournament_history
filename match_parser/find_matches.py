import os, requests, json, re, time
from dotenv import load_dotenv

"""
This file looks through all osu! mps and stores all mps that are tournament matches and in which "hiyah" has played in.
"""

load_dotenv()

my_osu_id = 16626263 # hiyah's osu ID
oldest_fallback = 107658859
newest_fallback = 110000000 
ignore = ["o!mm Private", "ETX", "o!mm Ranked", "o!mm Team Private"]
MATCH_BASE_URL = "osu.ppy.sh/community/matches/"
API_BASE_URL = "https://osu.ppy.sh/api/v2/"
CLIENT_SECRET = os.getenv('client-secret')

def ignore(mp: int):
    """
    Adds a match to ignore to ignore_matches file if not already in.
    """
    with open("ignore_matches.txt", "r") as f:
        contents = f.read()
    contents = contents.split('\n')
    for mp_check in contents:
        if int(mp_check) == mp:
            return None 
        
    with open("ignore_matches.txt", "a") as f:
        f.write("\n" + str(mp)) 
        print(str(mp) + " added to ignore")  



def parse_mps(old, start=oldest_fallback):
    """
    Finds all tournament matches that specified user has played in.
    Note parse_mps will not find matches that hiyah was not present in but was part of a team.
    """

    new_mps = set()
    consecutive_errors = 0

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

    try: 

        start_time = time.time()

        with open('matches.txt', 'a') as f:

            # Iterate from newest to newest possible mp
            for mp in range(start, newest_fallback, 1):
                
                # API call and check criteria 1) hiyah in lobby 2) lobby is v2 3) lobby name is "ACRONYM: {something}"
                try: 
                    score_info = requests.get(f'{API_BASE_URL}matches/{str(mp)}', headers=headers)
                    info = score_info.json()
                    print("Parsing match " + str(mp))
                    if 'error' in info.keys(): # mp has been deprecated 
                        continue 
                    consecutive_errors = 0
                except Exception as e:
                    print("API call falled")
                    print(f'URL: {MATCH_BASE_URL}{str(mp)}')
                    consecutive_errors += 1
                    if consecutive_errors >= 10:
                        # breaking issue with API
                        exit()
                    continue

                try: 
                    # check 1
                    # matches can be formated "ACRONYM: (a) vs (b)" or "ACRONYM (a) vs (b)" or "ACRONYM: something"
                    match_name = info['match']['name'] 
                    case1 = r'([a-zA-Z0-9!\.]+): \(.*\) vs\.? \(.*\)' 
                    case2 = r'([a-zA-Z0-9!\.]+) \(.*\) vs\.? \(.*\)'
                    case3 = r'([a-zA-Z0-9!\.]+): .*'

                    match1 = re.search(case1, match_name)
                    match2 = re.search(case2, match_name)
                    match3 = re.search(case3, match_name)

                    if match1:
                        if match1.group(1) in ignore:
                            continue
                    elif match2:
                        if match2.group(1) in ignore:
                            continue 
                    elif match3: 
                        if match3.group(1) in ignore: 
                            continue
                    else:
                        continue
                    
                    # check 2 (user played in match) and 3 (match is v2)
                    playedMap = False
                    v2_threshold = 3
                    # check if user played at least one map
                    for event in info['events']:
                        if event['detail']['type'] == 'other':
                            
                            if event['game']['scoring_type'] != 'scorev2':
                                v2_threshold -= 1
                                # Fail if 3 or more maps not played in score v2
                                if v2_threshold <= 0:
                                    playedMap = False
                                    break
                            else:
                                scores = event['game']['scores']
                                for s in scores:
                                    # user plays at least one map
                                    if s["user_id"] == my_osu_id:
                                        playedMap = True
                    
                    if playedMap == False:
                        continue 
                    
                    # do not add duplicate mps
                    if mp not in old:
                        f.write('\n' + str(mp))
                        print(str(mp) + " added! ")  
                    
                except Exception as e:
                    print("Error with mp")
                    print(info)
                    continue

            end_time = time.time() 
            print(f'{str(newest_fallback - start)} mps in {str(end_time - start_time)} seconds')
    except:
        print("Unknown Error occured")
        end_time = time.time() 
        print(f'{str(mp - start)} mps in {str(end_time - start_time)} seconds')

    return new_mps

def update_mps(): 

    # Get all currently known matches
    with open('matches.txt', 'r') as f:
        contents = f.read()
    all_matches = set()
    contents = contents.split('\n')
    for mp in contents:
        if mp == "":
            continue
        else:
            all_matches.add(int(mp))

    # Find new matches
    if len(all_matches) == 0:
        newest = newest_fallback
    else:
        newest = max(all_matches)
    
    parse_mps(all_matches) 

if __name__ == "__main__":
    update_mps()