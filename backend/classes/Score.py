

class Score:

    def __init__(self, score_info: dict):

        self.acc = score_info['accuracy']
        self.combo = score_info['max_combo']
        self.mods = score_info['mods']
        self.value = score_info['score']
        a = score_info['statistics']
        self.stats = {'count_100': a['count_100'], 'count_300': a['count_300'], 
                        'count_50': a['count_50'], 'count_miss': a['count_miss']}
        self.player = score_info['user_id']
        self.team = score_info['match']['team']

    def getScore(self):
        """
        Returns 2-tuple of the player who set the score and the score details
        """
        return (self.player, {
                "acc": self.acc,
                "combo": self.combo,
                "mods": self.mods,
                "value": self.value,
                "stats": self.stats, 
                "team": self.team
            } )
                
        