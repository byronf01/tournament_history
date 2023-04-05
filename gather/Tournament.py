import datetime

class Tournament:

    def __init__(self):

        self.__date = datetime.date(1,1,1) # Tourney start date 
        self.__acronym = "" # Tourney acronym
        self.__bracket = "" # Link to a Challonge Bracket
        self.__stages = {} # collection of Stage objects with keys representing the round ex. QF, SF, RO16, etc.

    def getTournament():
        return None # stub