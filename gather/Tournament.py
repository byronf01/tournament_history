import datetime

MONTHS = {"Janurary": 1, "February": 2, "March": 3, "April": 4, "May": 5, "June": 6, "July": 7, "August": 8,
          "September": 9, "October": 10, "November": 11, "December": 12}
def str_to_date(s: str):
    
    mth, day, yr = s.split(" ")
    yr = int(yr)
    mth = MONTHS[mth]
    day = int(day.replace(",", ""))
    return datetime.date(yr, mth, day)

class Tournament:

    def __init__(self, data, issue):

        self.__date = str_to_date(data['date']) # Tourney start date 
        guess = self.__guess_tourn_acronym(data['tourn_name'])
        correct = input(f"Default Acronym -> [{guess}] / Enter correct if wrong: ")
        self.__acronym = guess if correct == "" else correct # Tourney acronym
        self.__bracket = data['bracket'] # Link to a Challonge Bracket
        self.__mps = [] # stores ascending list of all mps for the tournament
        self.__stages = {} # collection of Stage objects with keys representing the round ex. QF, SF, RO16, etc.

        if issue == 1:
            next = "placeholder"
            all_acronyms = [self.__acronym] 
            while next != "":
                next_acr = input("Enter additional acronym: ")
                all_acronyms.append(next_acr)
            self.__mps = self.__get_mps(all_acronyms)
        else: self.__mps = self.__get_mps([self.__acronym])

    
    def __guess_tourn_acronym(self, tourn_title: str) -> str:
        """
        Attemps to guess the tournament acronym based on the tournament title.
        """
        try:
            words = tourn_title.split(" ")
            tourn_title = ""
            for w in words:
                tourn_title += w[0]
            return tourn_title
        except:
            return ""
        
    def __get_mps(self) -> list[int]:
        """
        Looks through all known tournamentm matches and finds matches with the corresponding acronym.
        Returns list in ascending order.
        """


    def getTournament(self):
        return {self.__acronym: {
            "date": self.__date,
            "bracket": self.__bracket,
            "stages": self.__stages # not sure about this one
        }} # stub