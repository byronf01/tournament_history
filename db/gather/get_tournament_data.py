import sys, os, json, requests, re, dateparser
from dotenv import load_dotenv
import google.auth
from google.oauth2 import service_account
from googleapiclient.discovery import build
from pathlib import Path
from string import digits

"""
SHEET_DATA METHOD DEPRECATED SINCE 5/13/2023
(i dont have my cloud subscription anymore)
"""

load_dotenv()
API_BASE_URL = "https://osu.ppy.sh/api/v2/"
CLIENT_SECRET = os.getenv('client_secret')
DEFAULT_SPREADSHEET = "1rENiQjT6gFYL4a_t35ZtkDDLR5uaHMqn9b8oe9DC6SU"
DEFAULT_PAGE = "tourneys"

def sheet_data(sheet=DEFAULT_SPREADSHEET, page=DEFAULT_PAGE):
    """
    Returns a dictionary of tournament objects obtained from a google spreadsheet formatted with tournament data
    """
    creds = None
    data = {}
    try:  
        creds_file = Path('../../google_application_credentials.json')
        if creds_file and os.path.exists(creds_file):
            creds = service_account.Credentials.from_service_account_file(creds_file)
    except Exception as e:
        print(e)
        exit()

    try:
        service = build('sheets', 'v4', credentials=creds)
        result = service.spreadsheets().values().get(spreadsheetId=sheet, range=page).execute()
        values = result.get('values', [])
        try:
            it = iter(values)
            next(it) # omit first row
            for top_row in it: 
                # releveant data is from 30:53
                bottom_row = next(it)
                c1 = [""] * 24
                c2 = [""] * 24

                for i in range(0, 23):
                    if i >= len(top_row) - 30:
                        break
                    c1[i] = top_row[30 + i]
                for j in range(0, 23):
                    if j >= len(bottom_row) - 30:
                        break
                    c2[j] = bottom_row[30 + j]
              
                key = int(c1[0][1:])

                data[key] = {"date": c2[0], "tourn_name": c1[1], "team_name": c2[1], "forum": c1[2], "tourn_sheet": c2[2], "bracket": c1[6], 
                             "rank_range": c1[3], "seed": c2[3], "format": c1[4], "team_size": c2[4], "placement": c1[5], "misc": c2[5], 
                             "notes": c1[7], "p1": c1[16], "p2": c1[17], "p3": c1[18], "p4": c1[19], "p5": c2[16], "p6": c2[17], "p7": c2[18], 
                             "p8": c2[19], "p9": c1[20], "p10": c2[20], "p11": c1[21], "p12": c2[21], "p13": c1[22], "p14": c2[22], 
                             "p15": c1[23], "p16": c2[23]}
                
                # convert team size to int
                if data[key]["team_size"] == "Solo":
                    data[key]["team_size"] = 1
                else:
                    data[key]["team_size"] = int(data[key]["team_size"].replace("Teams of ",""))

                # change player hyperlinks under "p1", "p2" etc to int values
                try:
                    for p in ["p1","p2","p3","p4","p5","p6","p7","p8","p9","p10","p11","p12","p13","p14","p15","p16"]:
                        if data[key][p] != "":
                            tmp = data[key][p].replace("https://osu.ppy.sh/users/", "")
                            data[key][p] = int(tmp)
                        else: break
                except:
                    print(p)
                    print(data[key])
                    raise IndexError()
                  
        except Exception as e:
            print(e)
            raise StopIteration()

    except Exception as e:
        print(e) 
        exit()

    return data

def manual_data():
    """
    Enter in all necessary information for tournament creation.
    """
    # Get forum post if applicable
    
    forum = input('Enter link to forum post (none if no forum): ')
    data_master = {}
    if forum: 
        data = extract(forum)
        for k, v in data.items():
            if v == '':
                # TODO: fill in date_f if date 
                if k == 'date_f': continue # formatted date should not be entered by user
                
                data[k] = input(f'{k} not found, enter correct value: ')
    else:
        data = {'date': '', 'bracket': '', 'tourn_sheet': '', 'format': '', 'team_size': '', 
                'banner': '', 'title': ''} 
        for k in data.keys():
            data[k] = input(f'Enter {k}:')
    
    data['date_f'] = dateparser.parse(data['date']) if data['date_f'] == '' else data['date_f']
    data['forum'] = forum
    data['acronym'] = input('Tournament Acronym: ')
    data['team_name'] = 'hiyah' if data['format'] == '1v1' else input('Team Name: ')
    data['rank_range'] = input('Rank range: ')
    data['seed'] = input('Seed (as fraction): ')
    data['placement'] = input('Placement: ')
    data['comments'] = input('Personal comments: ')
    data['notes'] = input('Additional notes: ')
    data['teammates'] = []
    while True:
        teammate = input('Enter teammate by id: ')
        if teammate == '': break
        data['teammates'].append(teammate)

    while True:
        flag = False
        failsafe = input('Did you enter anything wrong (none if all correct) ')
        if failsafe != '':
            print('Revising data. Type "exit" at any time to terminate')
            for k, v in data.items():
                correct = input(f'{k}: (None if correct, "delete" if field to be removed)')
                if correct == '': continue
                elif correct == 'delete': data[k] = ''
                elif correct == 'exit':
                    flag = True
                    break
                else: data[k] = correct
        else: break
        if flag: break
    
    return data
    
def extract(forum):
    """
    Attempts to get date, tournament name, tournament sheet, bracket, format and team size, banner from forum post
    """
    apidata = {
        'client_id': 21309,
        'client_secret': CLIENT_SECRET,
        'grant_type': 'client_credentials',
        'scope': 'public',
    }
    response = requests.post('https://osu.ppy.sh/oauth/token', apidata)
    token = response.json().get('access_token')

    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': f'Bearer {token}',
    }

    forum_id = forum.split("/")[-1].rstrip('?n=').rstrip(digits)
    forum_info = requests.get(f'{API_BASE_URL}forums/topics/{forum_id}', headers=headers)
    info = forum_info.json()

    # Look I realize i could write this in way less lines but i am NOT going to remember it in a year and this part 
    # is important so readability is king here
    main = info['posts'][0]['body']['raw']
    filtered = re.sub(r'\[[^\]]*?\]', '', main)
    forum_title = info['topic']['title']
    # possible matches
    spreadsheet = re.search(r'(https://docs.google.com/spreadsheets[A-Za-z0-9\/\-\?=]+)', main) 
    bracket = re.search(r'(https://challonge.com/[A-Za-z0-9\/\-\?=]+)', main)
    banner = re.search(r'\[img\](.*?)\[\/img\]', main)
    date = re.search(r'Qualifiers:\s*([^-]+)', filtered)
    tourn_name = parse_title(forum_title)
    format = (re.search(r'([1-9])v\1', main), re.search(r'([1-9])v\1', forum_title)) # should look in forum title and body
    # team_size = (re.search(r'[Tt]eams\s+of\s+\[.*?\](\d+)', main), re.search(r'[Tt]eams\s+of\s+\[.*?\](\d+)', forum_title)) # should look in forum title and body
    team_size = (re.search(r'[Tt]eam[s]*(?:\s*of| size)\s*(\d+)', filtered), re.search(r'[Tt]eams\s+of\s+\[.*?\](\d+)', forum_title))

    all_data = {'date': '', 'bracket': '', 'tourn_sheet': '', 'format': '', 'team_size': '', 
                'banner': '', 'title': '', 'date_f': ''} 
    
    if spreadsheet != None: 
        all_data['tourn_sheet'] = spreadsheet.groups()[0]
    if bracket != None: 
        all_data['bracket'] = bracket.groups()[0]
    if banner != None: 
        all_data['banner'] = banner.groups()[0]
    if date != None: 
        try:
            unformatted = date.groups()[0]
            all_data['date'] = dateparser.parse(unformatted).strftime('%Y-%m-%d')
            all_data['date_f'] = dateparser.parse(unformatted)
        except Exception as e:
            print(f'Error while parsing dates: {e}')
    if tourn_name != None:
        all_data['title'] = tourn_name
    if format[0] or format[1]:
        if format[0] != None and format[1] != None: all_data['format'] = format[1].group(0) # prioritize forum title
        elif format[0] != None and format[1] == None:
            all_data['format'] = format[0].group(0) # this is not tested
        else:
            all_data['format'] = format[1].group(0) 
    if team_size[0] or team_size[1]:
        if team_size[0] != None and team_size[1] != None: all_data['team_size'] = team_size[1].group(0) # prioritize forum title
        elif team_size[0] != None and team_size[1] == None:
            all_data['team_size'] = team_size[0].group(1)
        else:
            all_data['team_size'] = team_size[1].group(0) 
        

    # Edge case with team size, if team size = 1 then format is 1v1
    if all_data['team_size'] == '1':
        all_data['format'] = '1v1'

    print(all_data)
    return all_data      

def parse_title(title: str):
    """
    Parses the forum post title and returns the name of the tournament.
    The regex patterns were not working.
    """
    IGNORE_SET = [('(',')'), ('[',']'), ('{','}'), ('|','|')] # ignore everything enclosed in these pairs
    target = '' # contains the first match at the end
    offender = -1 # keeps track of what cursor is currently in, ex: offenders = 2 if currently { ... with no closing '}'
    total_offenders = 0 # helps to know where to end after first match
    for c in title:
        
        if offender != -1 and c != IGNORE_SET[offender][1]: # if currently in an open brace ignore everything
            continue 
        elif offender != -1 and c == IGNORE_SET[offender][1]: # if the brace is closed start accepting chars again
            offender = -1
        else:
            break_flag = False
            for i in range(0, len(IGNORE_SET)):
                if c == IGNORE_SET[i][0]:
                    offender = i
                    total_offenders += 1
                    if total_offenders > 1:
                        break_flag = True
                        break
                    continue
            if break_flag: break
            if offender == -1: target += c
    
    return target.strip(' ').rstrip(' ')

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "sheet":
        # python add_tournament.py sheet 
        # use spreadsheet to enter data
        if len(sys.argv) > 3:  
            sheet = sys.argv[2]
            page = sys.argv[3]
            data = sheet_data(sheet, page)
        else:
            data = sheet_data()
    else:
        data = manual_data()
    
    if "write" in sys.argv:
        with open("spreadsheet_data_json.json", "w", encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)