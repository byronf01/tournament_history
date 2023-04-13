

class Score:

    def __init__(self, score_info: dict):

        self.__acc = score_info['accuracy']
        self.__combo = score_info['combo']
        self.__mods = score_info['mods']
        self.__value = score_info['score']
        a = score_info['statistics']
        self.__stats = {'count_100': a['count_100'], 'count_300': a['count_300'], 
                        'count_50': a['count_50'], 'count_miss': a['count_miss']}
        self.__team = score_info['match']['team']