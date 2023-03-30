import os, requests, json
from dotenv import load_dotenv

"""
This file looks through all osu! mps and stores all mps that are tournament matches and in which "hiyah" has played in.
"""

load_dotenv()

osu_id = 16626263 # hiyah's osu ID
oldest_fallback = 79322841
newest_fallback = 107658859
ignore = ["o!mm Private", "ETX"]
MATCH_BASE_URL = "https://osu.ppy.sh/community/matches/"
API_BASE_URL = "https://osu.ppy.sh/api/v2/"
CLIENT_SECRET = os.getenv('client-secret')
# OSU_API_TOKEN = os.getenv('osu-api-token')

# Note parse_mps will not find matches that hiyah was not present in but was part of a team
def parse_mps(start=oldest_fallback):

    data = {
        'client_id': 21309,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials',
        'scope': 'public',
        'Resource Owner': '16626263'
    }

    response = requests.post('https://osu.ppy.sh/oauth/token', data=data)
    token = response.json().get('access_token')

    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {token}',
        'Resource Owner': '16626263'
    }
         
    # Iterate from newest to newest possible mp
    for mp in range(start, newest_fallback):
        
        # API call and check criteria 1) hiyah in lobby 2) lobby is v2 3) lobby name is "ACRONYM: {something}"
        try: 
            score_info = requests.get(f'{API_BASE_URL}/matches/{MATCH_BASE_URL}{str(mp)}', headers=headers)
            info = score_info.json()
        except Exception as e:
            print(e)
        

def update_mps(): 

    # Get all currently known matches
    with open('matches.txt', 'r') as f:
        contents = f.read()
    all_matches = set()
    for mp in contents:
        all_matches.add(int(mp))

    print(all_matches)
    # Find new matches
    newest = max(all_matches)
    new_mps = parse_mps(newest)
    if len(new_mps) == 0: return 

    all_matches.union(new_mps)

    # write new matches to match file
    with open('matches.txt', 'w') as f:
        for mp in all_matches:
            f.write(mp + "\n")

if __name__ == "__main__":
    update_mps()