# script to create levels.db

import sqlite3

c = sqlite3.connect('levels.db')
cur = c.cursor()
cur.execute('DROP TABLE levels')
cur.execute('CREATE TABLE IF NOT EXISTS levels (f text, s text, level text, height int, start_size int default 2)')
c.commit()

cur.execute('INSERT INTO levels VALUES ("1", "1", "fe0", 3, 1)')  # 1-1
cur.execute('INSERT INTO levels VALUES ("1", "2", "efep0p", 3, 1)')  # 1-2
cur.execute('INSERT INTO levels VALUES ("1", "3", "pfee0p", 3, 1)')  # 1-3
cur.execute('INSERT INTO levels VALUES ("1", "4", "3pepef", 3, 1)')  # 1-4
cur.execute('INSERT INTO levels VALUES ("2", "1", "eeeepe0pf", 3, 1)')  # 2-2
cur.execute('INSERT INTO levels VALUES ("2", "2", "fpep0", 5, 1)')  # 2-2
cur.execute('INSERT INTO levels VALUES ("2", "3", "epfppp0pp", 3, 1)')  # 2-3
cur.execute('INSERT INTO levels VALUES ("2", "4", "peeepeepee0pppf", 3, 1)')
cur.execute('INSERT INTO levels VALUES ("3", "1", "fpeee0", 6, 1)')
cur.execute('INSERT INTO levels VALUES ("3", "2", "efepepe3", 4, 1)')
cur.execute('INSERT INTO levels VALUES ("3", "3", "f2", 2, 1)')
cur.execute('INSERT INTO levels VALUES ("3", "4", "fpee2", 5, 1)')
cur.execute('INSERT INTO levels VALUES ("4", "1", "pfpe+espleeep0p", 5, 1)')
cur.execute('INSERT INTO levels VALUES ("4", "2", "+f+psplp0p", 5, 1)')
cur.execute('INSERT INTO levels VALUES ("4", "3", "e-l+efpspfpp0pp", 3, 1)')
cur.execute('INSERT INTO levels VALUES ("4", "4", "f--e++fppppppppplesppppp0pee", 4, 1)')
c.commit()
