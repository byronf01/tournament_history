import sys, os, json
import google.auth
from google.oauth2 import service_account
from googleapiclient.discovery import build
from pathlib import Path



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
        # enter manually
        # UNFINISHED 
        pass
    
    if "write" in sys.argv:
        with open("spreadsheet_data_json.json", "w", encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=4)