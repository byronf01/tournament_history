from elitebot_process import ebot_process

"""
Processes new data from updated elitebot matches and updates main matches text file 
with strictly new matches
"""

if __name__ == '__main__':
    
    all = ebot_process()

    with open("matches.txt", "r") as f:
        for mp in f:
            all.add(int(mp))

    all = sorted(all)
    with open('matches.txt', 'w') as f:
        for mp in all:
            f.write(str(mp) + "\n")

    print('Finished adding new matches')