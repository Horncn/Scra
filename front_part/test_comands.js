m = new Level_Map(2, ['e','e','f','0']);
let start = m.find_character;
let start_y = start[0];
let start_x = start[1];
cha = new Level_Character(start_x, start_y, m.element(start_y, start_x));
make_platform(m)
/*
cha.turning_left();
cha.moving();
check_character(m, cha);

*/

process_commands(m, cha, 'mfmel)mlm');

process_commands(m, cha, '6fmel)>');

