import os, requests, json, re, time
from dotenv import load_dotenv

"""
This file looks through all osu! mps and stores all mps that are tournament matches and in which "hiyah" has played in.
"""

load_dotenv()

my_osu_id = 16626263 # hiyah's osu ID
oldest_fallback = 79322841
newest_fallback = 107658859
ignore = ["o!mm Private", "ETX"]
MATCH_BASE_URL = "osu.ppy.sh/community/matches/"
API_BASE_URL = "https://osu.ppy.sh/api/v2/"
CLIENT_SECRET = os.getenv('client-secret')
# OSU_API_TOKEN = os.getenv('osu-api-token')

# Note parse_mps will not find matches that hiyah was not present in but was part of a team
def parse_mps(start=oldest_fallback):

    new_mps = set()

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

    start_time = time.time()

    start = 107542800
    # target: find 107542811

    # Iterate from newest to newest possible mp
    newest_fallback = 107542830 # test for now
    for mp in range(start, newest_fallback, 1):
        
        # API call and check criteria 1) hiyah in lobby 2) lobby is v2 3) lobby name is "ACRONYM: {something}"
        try: 
            time.sleep(0.2) 
            score_info = requests.get(f'{API_BASE_URL}matches/{str(mp)}', headers=headers)
            info = score_info.json()
            print("Parsing match " + str(mp))
        except Exception as e:
            print("API call falled")
            print(f'URL: {MATCH_BASE_URL}{str(mp)}')
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

            new_mps.add(mp)      
            

        except Exception as e:
            print("Error with mp")
            print(info)
            continue

    end_time = time.time() 
    print(f'{str(newest_fallback - start)} mps in {str(end_time - start_time)} seconds')

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
    
    new_mps = parse_mps(newest)
    
    if len(new_mps) == 0: return 
    
    updated = all_matches.union(new_mps)

    # write new matches to match file
    with open('matches.txt', 'w') as f:
        for mp in updated:
            f.write(str(mp) + '\n')

if __name__ == "__main__":
    update_mps()