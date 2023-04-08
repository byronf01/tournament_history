import datetime

MONTHS = {"Janurary": 1, "Feburary": 2, "March": 3, "April": 4, "May": 5, "June": 6, "July": 7, "August": 8,
          "September": 9, "October": 10, "November": 11, "December": 12}
def str_to_date(s: str):
    
    mth, day, yr = s.split(" ")
    yr = int(yr)
    mth = MONTHS[mth]
    day = int(day.replace(",", ""))
    return datetime.date(yr, mth, day)

class Tournament:

    def __init__(self, data):

        self.__date = str_to_date(data['date']) # Tourney start date 
        guess = self.__guess_tourn_acronym(data['tourn_name'])
        correct = input(f"Default Acronym -> [{guess}] / Enter correct if wrong: ")
        self.__acronym = guess if correct == "" else correct # Tourney acronym
        self.__bracket = data['bracket'] # Link to a Challonge Bracket
        self.__stages = {} # collection of Stage objects with keys representing the round ex. QF, SF, RO16, etc.
    
    def __guess_tourn_acronym(self, tourn_title: str) -> str:
        try:
            words = tourn_title.split(" ")
            tourn_title = ""
            for w in words:
                tourn_title += words[0]
            return tourn_title
        except:
            return ""

    def getTournament():
        return {""} # stub