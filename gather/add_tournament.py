# note that if there are any fields that cant be filled they should be filled manually

# First enter tournament's name

# Enter forum post (what if no forum?)
    # get tournament start-end date?
    # get spreadsheet from forum
    # get bracket from forum or spreadsheet

# Enter the tournament acronym(s) ? vndb moment
    # tournament acronym then used to find all mps with matching acronym

# get the pools of tournament (if sheet exists else None)

# classify mps by stage ? how to do this 
    # 1) store the pools of the tournament elsewhere and match >3 maps in mp to pool
    # 2) manually

# after matching mps to stage, give match a title ( (good question) vs (la planta) )
    # add list of scores to match obj
        # get scores by checking each event in mp (what to do with warm up?)
            # get map, mods, player(s) and other info


# add match result to match (alternatively use challonge api?) (may have to check manually)
# calculate match costs after knowing # warm up maps

# return tournament obj 

if __name__ == "__main__":