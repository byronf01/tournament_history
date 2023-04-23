from Match import Match
from copy import deepcopy

class Stage:
    """
    Largely unfinished class, may add support for tournament mappools and the like 
    """

    def __init__(self, round: str, mps: list[str], tn: str, mult: dict, qualifiersHappened: bool, issues: list, acc_mps: list):

        # Name of the round
        self.__round = round

        # Issues
        self.ISSUES = deepcopy(issues)

        # Follows schema { "Round": [Match1(), Match2()] }. Match1 and Match2 are both optional.
        self.__matches = []
        for mp in mps:
            if 7 in self.ISSUES and mp not in acc_mps:
                self.ISSUES.remove(7)
                m = Match(mp, tn, mult, self.ISSUES)
            else:
                m = Match(mp, tn, mult, self.ISSUES) 
            self.__matches.append(m)

        # boolean representing if qualifiers happened for this stage
        self.qualifiers = False

        # Check if any match inside matches was a qualifier lobby
        # if qualifiers happened already, no need to check
        if qualifiersHappened == False and len(self.__matches) > 0:
            if self.__matches[0].qualifiers: self.qualifiers = True

    def getStage(self):
        
        return [m.getMatch() for m in self.__matches] # stub
             