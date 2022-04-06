const url = 'http://127.0.0.1:5000/';
let character, level;
const level_categories = ['Beginning', 'Cycles', 'Statements', 'Size']
const command_names = ['Move', 'Turn left', 'Turn right', 'Jump', 'If free', 'Else', 'Else end']
let screen_width = 900;
let screen_height = 600;
let level_a_counter = 0;
let level_b_counter = 0;
let step_counter = 0;
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xadd8e6 )
const camera = new THREE.PerspectiveCamera( 75, screen_width / screen_height, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( screen_width, screen_height );

const screen = document.getElementsByClassName('game_field')[0];
screen.appendChild(renderer.domElement);
const canv = screen.children[0]
canv.className = 'level_screen'

const loader = new THREE.TextureLoader()
loader.setCrossOrigin('anonymous')

const character_loader = new THREE.GLTFLoader();
character_loader.setCrossOrigin('anonymous')

let cell_size
const p_texture = new THREE.MeshBasicMaterial( {map: loader.load('https://raw.githubusercontent.com/Horncn/Scra/main/textures/grass.jpg')} );
const e_texture = new THREE.MeshBasicMaterial( {map: loader.load('https://raw.githubusercontent.com/Horncn/Scra/main/textures/cement.jpg') } );
const f_texture = new THREE.MeshBasicMaterial( {map: loader.load('https://raw.githubusercontent.com/Horncn/Scra/main/textures/finish.jpg') } );
const l_texture = new THREE.MeshBasicMaterial( {map: loader.load('https://raw.githubusercontent.com/Horncn/Scra/main/textures/finland.jpg')} );
const l_check_texture = new THREE.MeshBasicMaterial( {map: loader.load('https://raw.githubusercontent.com/Horncn/Scra/main/textures/bigger.jpg')} );
const s_texture = new THREE.MeshBasicMaterial( {map: loader.load('https://raw.githubusercontent.com/Horncn/Scra/main/textures/austria.jpg')} );
const s_check_texture = new THREE.MeshBasicMaterial( {map: loader.load('https://raw.githubusercontent.com/Horncn/Scra/main/textures/smaller.jpg')} );
const fox_texture = new THREE.MeshStandardMaterial({map: loader.load('https://raw.githubusercontent.com/Horncn/Scra/main/fox/textures/fox_material_baseColor.png')});


function main(){
    create_main_menu()
    draw_level()
}

function make_platform(){
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }
    let m_size = level.map_size
    if (m_size[0] > m_size[1]){
        m_size = m_size[0]
    }
    else {
        m_size = m_size[1]
    }
    m_size -= 2;
    cell_size = (0.0063 * Math.pow(m_size, 2)) - (0.1251 * m_size) + 0.825; // cell adjustment formula, just don't touch it
    const geometry = new THREE.BoxGeometry(cell_size, cell_size, cell_size);


    for (y in level.field){
        line = level.field[y]
        for (x in line){
            let cell = line[x];
            let chosen_texture

            if (cell == 'e' | !(isNaN(parseInt(cell)))){
                chosen_texture = e_texture
            }
            else if (cell == 'p'){
                chosen_texture = p_texture
            }
            else if (cell == 'f'){
                chosen_texture = f_texture
            }
            else if (cell == 'l'){
                chosen_texture = l_texture
            }
            else if (cell == 's'){
                chosen_texture = s_texture
            }
            else if (cell == '+'){
                chosen_texture = l_check_texture
            }
            else if (cell == '-'){
                chosen_texture = s_check_texture
            }

            let obj = new THREE.Mesh(geometry, chosen_texture)
            obj.position.x = x * cell_size;
            obj.position.y = -y * cell_size;
            scene.add(obj)
        }
    }

}


function place_character(){
    character_loader.load('https://raw.githubusercontent.com/Horncn/Scra/main/fox/scene.gltf', function(gltf){
        character_model = gltf.scene.children[0]
        character_model.scale.set(cell_size / 128, cell_size / 128, cell_size / 128)
        character_model.position.x = character.coords[0] * cell_size + (3/4 * cell_size)
        character_model.position.y = -character.coords[1] * cell_size - (cell_size / 2) 
        character_model.position.z = 1 * cell_size
        character_model.rotation.y = Math.PI
        character_model.rotation.x = Math.PI
        character_model.rotation.z = -character.rotation / 2 * Math.PI
        
        character_model.material = fox_texture
        scene.add(gltf.scene)
    })
}
function draw_level(){
    
    camera.rotation.x = 0.7;
    camera.rotation.y = 0.7;
    camera.rotation.z = 0.6;
    
    camera.position.x = 3;
    camera.position.y = -2.5;
    camera.position.z = 2;
    
    var light = new THREE.DirectionalLight("#ffffff", 0.2);
    var pointLight = new THREE.PointLight("#ffffff", 0.2);
    var pointLightBack = new THREE.PointLight("#ffffff", 0.2);
    var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    light.position.set( 0, -70, 100 ).normalize();
    pointLight.position.set(0,-40,300);
    pointLightBack.position.set(0,-40,-100);

    scene.add(light);
    scene.add(pointLight);
    scene.add(pointLightBack);
    scene.add(ambientLight);


    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }

    animate();
}

/*
json structure:
height : int
field : list
type : str (for hiding some commands)
start_size : int 
creator : str
tbd

type description:
start - only move and turn comands
cond - conditions added
cycle - cycle added
custom() - custom levels


*/

class Level_Character {
    constructor(x, y, turn, size=1){
        this.x = parseInt(x);
        this.y = parseInt(y);
        this.turn = parseInt(turn);
        this.size = parseInt(size); // 0 for small, 1 for normal, 2 for big
    }

    moving(){
        if (this.turn == 0){
            this.y--
        }
        else if(this.turn == 1){
            this.x++
        }
        else if(this.turn == 2){
            this.y++
        }
        else if(this.turn == 3){
            this.x--
        }
    }
    
    turning_right(){
        this.turn += 1
        if (this.turn > 3){
            this.turn = 0
        }
    }

    turning_left(){
        this.turn -= 1
        if (this.turn < 0){
            this.turn = 3
        } 
    }
    jumping(){
        if (this.turn == 0){
            this.y -= 2
        }
        else if(this.turn == 1){
            this.x += 2
        }
        else if(this.turn == 2){
            this.y += 2
        }
        else if(this.turn == 3){
            this.x -= 2
        }
    }

    getting_bigger(){
        if (this.size < 2){
            this.size += 1
        }
    }
    getting_smaller(){
        if (this.size > 0){
            this.size -= 1
        }
    }

    get coords(){
        return [this.x, this.y]
    }

    get rotation(){
        return this.turn
    }
}

class Level_Map{
/*
field description:
e = empty
0 = start, looking up
1 = start, looking right
2 = start, looking down
3 = start, looking left
f = finish (target)
p = prohibited tiles (you step = you lose)
s = tiles, makes character smaller
l = tiles, makes character larger
- = checks if character is small (size=0)
+ = checks if character is big (size=2)
*/
    constructor(height, field){
        let len = field.length
        if (len % height != 0){
            return
        }
        let width = parseInt(len / height)
        let prohibited_line = []
        for (let i=0; i < width + 2; i++){
            prohibited_line.push('p')
        }
        this.field = []
        this.field.push(prohibited_line)
        for (let i=0; i < height; i++){
            let arr = ['p']
            for (let z=0; z < width; z++){
                arr.push(field[i * width + z])
            }
            arr.push('p');
            this.field.push(arr);
        }
        this.field.push(prohibited_line);   
    }

    get map_size(){
        return [this.field.length, this.field[0].length]
    }

    element(y, x){
        if (y > this.field.length){
            return null
        }
        if (x > this.field[0].length){
            return null
        }
        return this.field[y][x]
    }

    get find_character(){
        for (let i=0; i < this.field.length; i++){
            for(let z=0; z < this.field[0].length; z++){
                if (!(isNaN(parseInt(this.field[i][z])))){
                    return [i, z]
                }
            }
        }
    }
}


function check_character(level, character){
    step_counter ++
    let cell = level.element(character.y, character.x);
    if (cell == null){
        return 'Lose'
    }
    if (cell == 'f'){
        return 'Win'
    }
    else if (cell == 'p'){
        return 'Lose'
    }
    else if (cell == '-'){
        if (character.size > 0){
            return 'Lose'
        }
    }
    else if (cell == '+'){
        if (character.size < 2){
            return 'Lose'
        }
    }
    else if (cell == 's'){
        character.getting_smaller();
    }
    else if (cell == 'l'){
        character.getting_bigger();
    }
    else{
        return 'Ok'
    }
}

function check_in_front_character(level, character){
    let element
    let x  = character.x
    let y = character.y
    if (character.turn == 0){
        y--
    }
    else if(character.turn == 1){
        x++
    }
    else if(character.turn == 2){
        y++
    }
    else{
        x--
    }
    element = level.element(y, x);
    if (element == 'p'){
        return false;
    }
    else{
        return true;
    }
}


function transform_commands(stack){
    if (typeof stack == 'string'){
        stack = stack.split('');
    }
    
    let formated_stack = [];
    let is_cycle = false;
    let cycle_count, cycle_stack
    for (el in stack){
        el = stack[el]
        if (is_cycle == true){
            if (el == '>'){
                is_cycle = false;
                for (let i=0; i < cycle_count; i++){
                    for (cycle_el in cycle_stack){
                        cycle_el = cycle_stack[cycle_el]
                        formated_stack.push(cycle_el)
                    }
                }
            }
            else{
                cycle_stack.push(el)
            }
            continue
        }
        if (!(isNaN(parseInt(el)))){
            cycle_stack = []
            cycle_count = parseInt(el)
            is_cycle = true
        }
        else{
            formated_stack.push(el);
        }
    }
    return formated_stack
}

function process_commands(level, character, stack){
    /*
    commands description:
    m = moving()
    l = turning_left()
    r = turning_right()
    f = check_front_true_result
    e = check_front_false_result
    j = jumping()
    number(from 1 to 9) - cycle start
    > = cycle end
    ) = end of if else block

    example of command stack:
    'm3r>mfmel)m'
    move
    then turn right 3 times 
    check in front:
    if true: move 
    else: turn left
    move
    */
    stack = transform_commands(stack);
    let skip_true_result = false // for skipping if commands
    let skip_false_result = false // for skipping else commands
    let prepare_to_skip_false_result = false
    for (el in stack){
        el = stack[el]
        if (skip_true_result == true){
            if (el == 'e'){
                skip_true_result = false
            }
            continue
        }
        else if (skip_false_result == true){
            if (el == ')'){
                skip_false_result = false
            }
            continue
        }
        else if (prepare_to_skip_false_result == true){
            if (el == 'e'){
                prepare_to_skip_false_result = false
                skip_false_result = true
            }
        }

        if (el == 'm'){
            character.moving();
        }
        else if (el == 'j'){
            character.jumping();
        }
        else if (el == 'l'){
            character.turning_left();
        }
        else if (el == 'r'){
            character.turning_right();
        }
        else if (el == 'f'){
            if (check_in_front_character(level, character)){
                prepare_to_skip_false_result = true;
            }
            else{
                skip_true_result = true;
            }
        }

        if (check_character(level, character) == 'Lose'){
            return false
        }
    }
    if (check_character(level, character) == 'Win'){
        return true
    }
    else{
        return false
    }
}



// ----------------------main menu ----------------- //

function clear_menu(){
    let menu = document.getElementsByClassName('menu')[0]
    while(menu.childNodes.length != 0){
        menu.removeChild(menu.childNodes[0])
    }
}

function delete_menu(){
    let menu = document.getElementsByClassName('menu')[0]
    if (menu != undefined){
        menu.parentNode.removeChild(menu)
    }
    draw_return()
}

function draw_return(){
    delete_return()
    let button_container = document.createElement('div')
    button_container.className = 'return'
    let game
    if (document.getElementsByClassName('menu')[0] != undefined){
        game = document.getElementsByClassName('menu')[0]
    }
    else{
        game = document.getElementsByClassName('game')[0]
    }
    
    let return_button = document.createElement('button')
    return_button.onclick = create_main_menu
    button_container.appendChild(return_button)
    game.appendChild(button_container)
}

function delete_return(){
    while (document.getElementsByClassName('return').length != 0){
        document.getElementsByClassName('return')[0].parentNode.removeChild(document.getElementsByClassName('return')[0])
    }
}

function drop_level_selection(){
    clear_menu()
    draw_return()
    let menu = document.getElementsByClassName('menu')[0]
    let level_title = document.createElement('div')
    level_title.className = 'menu_title'
    level_title.innerHTML = 'Select level'

    let level_menu = document.createElement('div')
    level_menu.className ='level_menu' 
    let stages = document.createElement('div')
    stages.className = 'stages'
    level_menu.appendChild(level_title)
    for (let i=1; i<5; i++){
        let stage = document.createElement('div')
        stage.className ='stage'
        let stage_name = document.createElement('div')
        stage_name.innerHTML = level_categories[i-1]
        stage_name.className = 'level_cat'
        stage.appendChild(stage_name)
        for (let l=1; l<5; l++){
            let one_level = document.createElement('div')
            let level_button = document.createElement('button')
            level_button.innerHTML = `${i}-${l}`
            level_button.className = 'menu_button level'
            level_button.onclick = draw_level_from_server
            one_level.appendChild(level_button)
            stage.appendChild(one_level)
        }
        stages.appendChild(stage)
    }
    level_menu.appendChild(stages)
    menu.appendChild(level_menu)
    
}

function drop_credits(){
    clear_menu()
    draw_return()
    let info_screen = document.createElement('div')
    info_screen.className = 'info'
    info_screen.innerHTML = "Something should be there..."
    let thumbleweed = document.createElement('img')
    thumbleweed.width = 50
    thumbleweed.height = 50
    thumbleweed.className = 'thumbleweed'
    thumbleweed.src = 'https://raw.githubusercontent.com/Horncn/Scra/main/libraries/thumbleweed.png'
    let menu = document.getElementsByClassName('menu')[0]
    info_screen.appendChild(thumbleweed)
    menu.appendChild(info_screen)

}

function create_main_menu(){
    delete_return()
    delete_function_buttons()
    let menu, menu_created
    if (document.getElementsByClassName('menu')[0] == undefined){
        menu_created = false
        menu = document.createElement('div')
        menu.className = 'menu'
    }else{
        clear_menu()
        menu = document.getElementsByClassName('menu')[0]
        menu_created = true
    }

    let menu_title = document.createElement('div')
    menu_title.className = 'menu_title'
    menu_title.innerHTML = 'Main menu'

    let menu_buttons = document.createElement('div')
    menu_buttons.className = 'main_buttons'

    let select_level = document.createElement('button')
    select_level.onclick = drop_level_selection
    select_level.innerHTML = 'Select Level'
    select_level.className = 'menu_button'

    let credits = document.createElement('button')
    credits.onclick = drop_credits
    credits.innerHTML = 'Info'
    credits.className = 'menu_button'

    menu_buttons.appendChild(select_level)
    menu_buttons.appendChild(credits)

    menu.appendChild(menu_title)
    menu.appendChild(menu_buttons)
    if (!menu_created){
        document.getElementsByClassName('game')[0].appendChild(menu)
    }    
}

// --------------------- interface  ----------------- //

function create_function_buttons(limiter){
    let button_pool = document.createElement('div')
    button_pool.className = 'button_pool'
    button_pool.innerHTML = `LEvel ${level_a_counter}-${level_b_counter}<br>Commands to use:`
    if (limiter == 1){
        limiter = 3
    }
    else if (limiter == 2){
        limiter = 4
    }
    else{
        limiter = command_names.length
    }
    for (let i=0; i<limiter; i++){
        let command_button = document.createElement('div')
        let text = document.createElement('p')
        text.innerHTML = command_names[i]
        command_button.appendChild(text)
        command_button.className = 'command'
        command_button.onclick = add_command
        button_pool.appendChild(command_button) 
    }

    let process_button = document.createElement('div')
    process_button.innerHTML = 'Process commands'
    process_button.className = 'command Process'
    process_button.href = ''
    process_button.onclick = transform_and_process
    
    let delete_button = document.createElement('div')
    delete_button.innerHTML = 'Delete last command'
    delete_button.className = 'command delete'
    delete_button.href = ''
    delete_button.onclick = delete_command
    
    button_pool.appendChild(process_button)
    button_pool.appendChild(delete_button)
    document.getElementsByClassName('game_field')[0].appendChild(button_pool)

    if (level_a_counter > 1){
        if (level_a_counter < 4){
            add_cycle(true)
        }
        else{
            add_cycle(false)
        }
        
    }

    let stack
    stack = document.createElement('div')
    stack.id = 'commands'
    stack.className = 'stack'
    document.getElementsByClassName('game_field')[0].appendChild(stack)
}

function delete_function_buttons(){
    while (document.getElementsByClassName('button_pool').length != 0){
        document.getElementsByClassName('button_pool')[0].parentNode.removeChild(document.getElementsByClassName('button_pool')[0])
    }
    while (document.getElementById('commands') != null){
        document.getElementById('commands').parentNode.removeChild(document.getElementById('commands'))
    }
    while (document.getElementsByClassName('cycle').length != 0){
        document.getElementsByClassName('cycle')[0].parentNode.removeChild(document.getElementsByClassName('cycle')[0])
    }
}

function add_cycle(locked){
    let cycle = document.createElement('div')
    cycle.className = 'cycle'
    let cycle_text_left = document.createElement('a')
    cycle_text_left.innerHTML = 'Repeat '
    let cycle_input = document.createElement('input')
    cycle_input.className = 'cycle_input'
    cycle_input.max = 10
    cycle_input.min = 2
    cycle_input.type = 'number'
    cycle_input.defaultValue = 2
    let cycle_text_right = document.createElement('a')
    cycle_text_right.innerHTML = ' times'
    let cycle_check = document.createElement('input')
    cycle_check.type = 'checkbox'
    if (locked){
        cycle_check.checked = true
        cycle_check.disabled = 'disabled'
    }
    
    cycle_check.id = 'checked'
    cycle_check.className = 'checked'

    cycle.appendChild(cycle_text_left)
    cycle.appendChild(cycle_input)
    cycle.appendChild(cycle_text_right)
    cycle.appendChild(cycle_check)
    document.getElementsByClassName('game_field')[0].appendChild(cycle)

}

function add_command(){
    let stack = document.getElementById('commands')
    elem = document.createElement('div')
    elem.innerHTML = (this.innerHTML.slice(3, this.innerHTML.length - 4)) + ' '
    elem.className = 'to_process'
    elem.id = this.innerHTML.slice(3, this.innerHTML.length - 4)
    while (elem.innerHTML.length < 10){
        elem.innerHTML += '-'
    }
    elem.innerHTML += '->'
    stack.appendChild(elem)
}

function delete_command(){
    if (document.getElementsByClassName('to_process').length != 0){
        let all = document.getElementsByClassName('to_process')
        all[0].parentNode.removeChild(all[all.length - 1])
    }
}

function turn_off_commands(){
    for (let i=0; i<document.getElementsByClassName('command').length; i++){
        document.getElementsByClassName('command')[i].onclick = null
    }
}

function transform_and_process(){
    let stack = document.getElementsByClassName('to_process')
    let letter_stack = ''
    for (let i=0; i<stack.length; i++){
        el = stack[i].id
        if (el == 'Move'){
            letter_stack += 'm'
        }
        else if (el == 'Turn left'){
            letter_stack += 'l'
        }
        else if (el == 'Turn right'){
            letter_stack += 'r'
        }
        else if (el == 'Jump'){
            letter_stack += 'j'
        }
        else if (el == 'If free'){
            letter_stack += 'f'
        }
        else if (el == 'Else'){
            letter_stack += 'e'
        }
        else if (el == 'Else end'){
            letter_stack += ')'
        }
    }
    let cycle_check = document.getElementById('checked')
    if (cycle_check != null){
        if (cycle_check.checked){
            letter_stack = document.getElementsByClassName('cycle_input')[0].value + letter_stack + '>'
        }
    }

    turn_off_commands()
    if (process_commands(level, character, letter_stack)){
        let response = document.createElement('div')
        process_to_next_level()
    }
    else{
        let response = document.createElement('div')
        response.style.color = 'rgb(255,0,0)'
        response.innerHTML = 'LOsE'
        document.getElementById('commands').appendChild(response)
        process_failure()
    }
}

// -------------------server connection ------------- //
function draw_level_from_server(){
    if (this.innerHTML){
        level_a_counter = this.innerHTML[0]
        level_b_counter = this.innerHTML[2]
    }
    step_counter = 0;
    let first_name = level_a_counter
    let last_name = level_b_counter
    let full_url = url + '?f=' + first_name + '&s=' + last_name
    
    fetch(full_url).then(function(response){
        return response.json()
      })
    .then(function(form){
        if (form.height == undefined){
            console.log("Level doesn't exist")
            return false
        }
        level = new Level_Map(form.height, form.field);
        let start = level.find_character;
        let start_y = start[0];
        let start_x = start[1];
        character = new Level_Character(start_x, start_y, level.element(start_y, start_x), form.start_size)
        make_platform(level)
        place_character()
        create_function_buttons(parseInt(first_name))
        delete_menu()
        return true
        }
    )
}

function drop_winning(){
    create_main_menu()
    clear_menu()
    draw_return()
    let win_screen = document.createElement('div')
    win_screen.className = 'win'
    win_screen.innerHTML = "CONGRATULATIONS! <br> YOU'VE COMPLETED THE GAME!"
    let menu = document.getElementsByClassName('menu')[0]
    menu.appendChild(win_screen)
}


function process_to_next_level(){
    level_b_counter ++
    if (level_b_counter > 4){
        level_b_counter = 1
        level_a_counter ++
        if (level_a_counter > 4){
            drop_winning()
            return
        }
    }
    delete_function_buttons()
    if (!(draw_level_from_server())){
        create_main_menu()
    }
}

function process_to_same_level(){
    delete_function_buttons()
    draw_level_from_server()
}


function process_failure(){
    let field = document.getElementById('commands')
    let answer = document.createElement('div')
    answer.style.color = 'red'
    answer.style.width = '200px'
    answer.innerHTML = `Failed after ${step_counter-1} step`
    let restart = document.createElement('button')
    restart.innerHTML = 'restart'
    restart.style.marginLeft = '60px'
    restart.onclick = process_to_same_level
    scene.remove(scene.children[scene.children.length - 1])
    place_character()
    field.appendChild(answer)
    field.appendChild(restart)
}

window.onload = main;

// TODO: place check ✅
// TODO: command system ✅
// TODO: command stack understanding ✅
// TODO: basic level visual ✅
// TODO: basic character visual ✅
// TODO: basic commands visualization ✅
// TODO: basic main menu interface ✅
// TODO: proper server response and form ✅
// TODO: if else commands (front-check) ✅
// TODO: remake cycle system ✅
// TODO: switch level system ✅
// TODO: sequence validation ✅
