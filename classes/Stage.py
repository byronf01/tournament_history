from Match import Match

class Stage:
    """
    Largely unfinished class, may add support for tournament mappools and the like 
    """

    def __init__(self, round: str, mps: list[str]):
        
        # Name of the round
        self.__round = round

        # Follows schema { "Round": [Match1(), Match2()] }. Match1 and Match2 are both optional.
        self.__matches = [Match(mp) for mp in mps]
        

    def getStage(self):
        
        return {
            self.__round: [m.getMatch() for m in self.__matches]
            } # stub