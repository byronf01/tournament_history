from Match import Match

class Stage:
    """
    Largely unfinished class, may add support for tournament mappools and the like 
    """

    def __init__(self, round: str, mps: list[str], tn: str, mult: dict, qualifiersHappened: bool, issues: list):
        
        # Name of the round
        self.__round = round

        # Follows schema { "Round": [Match1(), Match2()] }. Match1 and Match2 are both optional.
        self.__matches = [Match(mp, tn, mult, issues) for mp in mps]

        # boolean representing if qualifiers happened for this stage
        self.qualifiers = False

        # Check if any match inside matches was a qualifier lobby
        # if qualifiers happened already, no need to check
        if qualifiersHappened == False and len(self.__matches) > 0:
            if self.__matches[0].qualifiers: self.qualifiers = True

    def getStage(self):
        
        return [m.getMatch() for m in self.__matches] # stub
             