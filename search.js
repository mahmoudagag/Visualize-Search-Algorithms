state = []
var makingmaze = true;
var vis = true;
var startingpoint =false;
var endingpoint = false;
document.addEventListener("DOMContentLoaded", ()=> {
    
    let blocks = true;
    let erase = false;
    let mousedown = false;
    let color = false;
    let type = false;
    let algo = false;

    const container = document.getElementById('conatiner')

    const start_color = document.getElementById('start_color')
    const start = document.getElementById('start')

    const end_color = document.getElementById('end_color')
    const end = document.getElementById('end')

    const colored = document.getElementById('blocks')
    const eraser = document.getElementById('erase')

    const black_color = document.getElementById('black_color')
    const white_color = document.getElementById('white_color')

    colored.onclick = () =>{
        blocks = true
        erase = false
        black_color.className = 'colorbutton colorblack'
        white_color.className = 'colorbutton colorwhite newstart'
    }
    eraser.onclick = () =>{
        blocks = false
        erase = true
        black_color.className = 'colorbutton colorblack newstart'
        white_color.className = 'colorbutton colorwhite'
        console.log(state)
    }

    for(var i = 0;i<20;i++){
        substate = []
        for(var j = 0;j<60;j++){    
            const box = document.createElement('div');
            box.classList.add('box');
            container.appendChild(box);
            box.id = `(${i},${j})`

            // mouse over
            box.addEventListener('mouseover',()=>{
                if(mousedown && box.id !=startingpoint && box.id!=endingpoint){
                    if(blocks){
                        box.className = 'colorbutton colorblack';
                        cords = parseTuple(box.id)[0]
                        state[cords[0]][cords[1]] = "#"
                    }else{
                        box.className = 'colorbutton colorwhite';
                        cords = parseTuple(box.id)[0]
                        state[cords[0]][cords[1]] = 0
                    }
                }
            })

            // dragging the start and ending
            box.addEventListener('dragover',(e)=>{
                e.preventDefault();
            }) 
            box.addEventListener('dragenter',(e)=>{
                if(makingmaze && vis){
                    e.preventDefault()
                    if(color){
                        box.className = `box color${color}`
                    }else if (blocks){
                        mousedown = false
                        box.className = 'colorbutton colorblack'
                        cords = parseTuple(box.id)[0]
                        state[cords[0]][cords[1]] = "#"
                    }else if(erase){
                        mousedown = false
                        box.className = 'colorbutton colorwhite'
                        cords = parseTuple(box.id)[0]
                        state[cords[0]][cords[1]] = 0
                    }
                }
            })
            box.addEventListener('dragleave',()=>{
                if(makingmaze && vis){
                    cords = parseTuple(box.id)[0]
                    if (state[cords[0]][cords[1]] === "#"){
                        box.className = 'colorbutton colorblack'
                    }else{
                        box.className = 'box'
                    }
                }
            }) 
            box.addEventListener('drop',()=>{
                if(makingmaze && vis){
                    if(color){
                        cords = parseTuple(box.id)[0]
                        box.className= 'pointer'+` color${color}`+' colorbutton';
                        if(color === "yellow"){
                            if(box.id != endingpoint){
                                if(box.lastChild){
                                    box.removeChild(box.lastChild)
                                }
                                box.append(start_color)
                                startingpoint = box.id
                                state[cords[0]][cords[1]] = 1
                                isvisualize(endingpoint,startingpoint,algo)
                            }else{
                                if(startingpoint){
                                    cords = parseTuple(startingpoint)[0]
                                    state[cords[0]][cords[1]] = 1
                                }
                            }
                        }
                        else{
                            if(box.id != startingpoint){
                                if(box.lastChild){
                                    box.removeChild(box.lastChild)
                                }
                                box.append(end_color)
                                endingpoint = box.id
                                state[cords[0]][cords[1]] = -1
                                isvisualize(endingpoint,startingpoint,algo)
                            }else{
                                if(endingpoint){
                                    cords = parseTuple(endingpoint)[0]
                                    state[cords[0]][cords[1]] = -1
                                }
                            }
                        }
                        // start end button 
                        if (type.children.length === 0){
                            const newstart = document.createElement('div')
                            newstart.className =  `color${color}`+' newstart'+' colorbutton'
                            type.appendChild(newstart)
                        }
                        mousedown = false
                    }
                }
            })
            substate.push(0)
        }
        state.push(substate)
    }
    // setting the starting and ending points
    start_color.addEventListener('dragstart',()=>{
        setTimeout(() =>(start_color.className = 'invisible'),0);
        color= "yellow"
        type = start
        ClearNodes()
        if (startingpoint){
            document.getElementById(startingpoint).className = 'box'
            cords = parseTuple(startingpoint)[0]
            state[cords[0]][cords[1]] = 0
        }
    })
    start_color.addEventListener('dragend',()=>{
        start_color.className = 'colorbutton'+' pointer'+' coloryellow';
        color = false
    })
    end_color.addEventListener('dragstart',()=>{
        setTimeout(() =>(end_color.className = 'invisible'),0);
        color = "red"
        type = end
        ClearNodes()
        if (endingpoint){
            document.getElementById(endingpoint).className = 'box'
            cords = parseTuple(endingpoint)[0]
            state[cords[0]][cords[1]] = 0
        }
    })
    end_color.addEventListener('dragend',()=>{
        end_color.className = 'colorbutton'+' pointer'+' colorred';
        color = false
    })

    //when clicking on black 
    container.addEventListener('mousedown',()=>{
        if(makingmaze && vis){
            ClearNodes()
            mousedown = true
        }
    })
    container.addEventListener('mouseup',()=>{
        mousedown = false
    })
    container.addEventListener('mouseleave',()=>{
        mousedown = false
    })
    //picking algo
    document.getElementById('BFS').addEventListener('click',()=>{
        algo = "BFS"
        document.getElementById('searchingbutton').innerHTML = "Breadth First Search (BFS)"
        isvisualize(endingpoint,startingpoint,algo)
    })
    document.getElementById('DFS').addEventListener('click',()=>{
        algo = "DFS"
        document.getElementById('searchingbutton').innerHTML = "Depth First Search (DFS)"
        isvisualize(endingpoint,startingpoint,algo)
    })
    document.getElementById('A').addEventListener('click',()=>{
        algo = "A"
        document.getElementById('searchingbutton').innerHTML = " A*"
        isvisualize(endingpoint,startingpoint,algo)
    })
    document.getElementById('GBFS').addEventListener('click',()=>{
        algo = "GBFS"
        document.getElementById('searchingbutton').innerHTML = "Greedy Best-First Search"
        isvisualize(endingpoint,startingpoint,algo)
    })
    document.getElementById('BS').addEventListener('click',()=>{
        algo = "BS"
        document.getElementById('searchingbutton').innerHTML = "Bidirectional Swarm"
        isvisualize(endingpoint,startingpoint,algo)
    })
    //Picking Mazes
    document.getElementById('Maze1').addEventListener('click',()=>{
        if(makingmaze && vis){ 
            Clear()
            makingmaze=false   
            makemaze(Maze3) 
        }
    })
    document.getElementById('Maze2').addEventListener('click',()=>{
        if(makingmaze && vis){
            Clear()
            makingmaze=false
            makemaze(Maze2)
        }
    })
    document.getElementById('Maze3').addEventListener('click',()=>{
        if(makingmaze && vis){
            Clear()
            makingmaze=false
            makemaze(Maze1)
        }
    })

    let buttonvisual = document.getElementById('visualize')
    buttonvisual.addEventListener('click',()=>{
        if(vis && makingmaze){
            //s = parseTuple(startingpoint)[0]
            //e = parseTuple(endingpoint)[0]
            //console.log(document.getElementById(`(${e[0]},${e[1]})`).lastChild)
            //document.getElementById(`(${s[0]},${s[1]})`).lastChild.draggable = false
            /*document.getElementById(`(${s[0]},${s[1]})`).lastChild.dragable=false
            document.getElementById(`(${e[0]},${e[1]})`).lastChild.dragable =false*/
            ClearNodes()
            vis= false
            if(algo==="BFS"){Bredth_First_Search(state,parseTuple(startingpoint)[0],parseTuple(endingpoint)[0])}
            if(algo==="DFS"){DFS(state,parseTuple(startingpoint)[0],parseTuple(endingpoint)[0])}
            if(algo==="A"){A(state,parseTuple(startingpoint)[0],parseTuple(endingpoint)[0])}
            if(algo==="GBFS"){GBFS(state,parseTuple(startingpoint)[0],parseTuple(endingpoint)[0])}
            if(algo==="BS"){Bidirection_swarm(state,parseTuple(startingpoint)[0],parseTuple(endingpoint)[0])}
        }
    })
})


async function makemaze(Maze){
    var x = Math.floor((Math.random() * 3)+1)
    if(x=== 1){
        for(var i = 0;i<Maze.length/2;i++){
            for(var j=0;j<Maze[i].length/2;j++){
                await pause(1)
                if (Maze[i][j] === "#"){
                    //await pause(1)
                    state[i][j] = "#"
                    document.getElementById(`(${i},${j})`).className = 'colorbutton colorblack'
                }
                if (Maze[Maze.length-i-1][j] === "#"){
                    //await pause(1)
                    state[Maze.length-i-1][j] = "#"
                    document.getElementById(`(${Maze.length-i-1},${j})`).className = 'colorbutton colorblack'
                }
                if (Maze[Maze.length-i-1][Maze[i].length-j-1] === "#"){
                    //await pause(1)
                    state[Maze.length-i-1][Maze[i].length-j-1] = "#"
                    document.getElementById(`(${Maze.length-i-1},${Maze[i].length-j-1})`).className = 'colorbutton colorblack'
                }
                if (Maze[i][Maze[i].length-j-1] === "#"){
                    //await pause(1)
                    state[i][Maze[i].length-j-1] = "#" //fix
                    document.getElementById(`(${i},${Maze[i].length-j-1})`).className = 'colorbutton colorblack'
                }
            }
        }
    }
    if(x === 2){
        for(var i = 0;i<Maze.length;i++){ //or divide by two
            for(var j=0;j<Maze[i].length/2;j++){
                await pause(1)
                if (Maze[i][j] === "#"){
                    //await pause(1)
                    state[i][j] = "#"
                    document.getElementById(`(${i},${j})`).className = 'colorbutton colorblack'
                }
                if (Maze[Maze.length-i-1][Maze[i].length-j-1] === "#"){
                    //await pause(1)
                    state[Maze.length-i-1][Maze[i].length-j-1] = "#"
                    document.getElementById(`(${Maze.length-1-i},${Maze[i].length-1-j})`).className = 'colorbutton colorblack'
                }
            }
        }
    }
    if(x === 3){
        for(var i = 0;i<Maze.length/2;i++){ //or divide by two
            for(var j=0;j<Maze[i].length;j++){
                await pause(1)
                if (Maze[i][j] === "#"){
                    //await pause(1)
                    state[i][j] = "#"
                    document.getElementById(`(${i},${j})`).className = 'colorbutton colorblack'
                }
                if (Maze[Maze.length-i-1][Maze[i].length-j-1] === "#"){
                    //await pause(1)
                    state[Maze.length-i-1][Maze[i].length-j-1] = "#"
                    document.getElementById(`(${Maze.length-1-i},${Maze[i].length-1-j})`).className = 'colorbutton colorblack'
                }
            }
        }
    }
    makingmaze = true
}

function isvisualize(endingpoint,startingpoint,algo){
    if (endingpoint && startingpoint && algo){
        document.getElementById('visualize').disabled = false;
    }
}

function parseTuple(t) {
    var items = t.replace(/^\(|\)$/g, "").split("),(");
    items.forEach(function(val, index, array) {
       array[index] = val.split(",").map(Number);
    });
    return items;
}

function Clear(){
    //window.location.reload(false);
    if(makingmaze && vis){
        document.getElementById('visualize').disabled = true;
        for(var i = 0;i<20;i++){
            for(var j = 0;j<60;j++){ 
                let div = document.getElementById(`(${i},${j})`)
                if(div.lastChild){
                    if(state[i][j] === 1){
                        let x = document.getElementById(`(${i},${j})`).lastChild
                        document.getElementById(`(${i},${j})`).removeChild(x) 
                        start.removeChild(start.lastChild)
                        start.append(x)
                    }else if(state[i][j] === -1){
                        let x = document.getElementById(`(${i},${j})`).lastChild
                        document.getElementById(`(${i},${j})`).removeChild(x)
                        end.removeChild(end.lastChild)
                        end.append(x)
                    }else if(div.hasChildNodes()){
                        div.removeChild(div.lastChild)
                    }
                }
                div.className = 'box'
                state[i][j] = 0
            }
        }
    }
    startingpoint = false
    endingpoint = false
}
function ClearNodes(){
    for(var i = 0;i<20;i++){
        for(var j = 0;j<60;j++){
            let div = document.getElementById(`(${i},${j})`)
            if(div.lastChild){
                if(div.lastChild.id === "vistedNode" || div.lastChild.id === "finalpath"){
                    div.removeChild(div.lastChild)
                }
            }
        }
    }
}

function Node(curr,prev,val) {
    this.curr = curr;
    this.prev = prev;
    this.val = val;
}

async function Bredth_First_Search(state,startingpoint,endingpoint){
    let path = []
    const curs = new Node(startingpoint,null,null);
    let startexplored = [`${curs.curr}`]
    let startfrontier = [curs]
    let run = true
    while(run){
        var x  = startfrontier.length
        for(var i=0; i<x;i++){
            possible_actions = findneighbor(state,startfrontier[0].curr)
            for(var j=0; j<possible_actions.length;j++){
                let node = new Node(possible_actions[j],startfrontier[0],null)
                if(node.curr[0] === endingpoint[0] && node.curr[1] === endingpoint[1]){
                    while(node.prev){
                        path.push(node.curr)
                        node = node.prev
                    }
                    await pause(25)
                    highlightsolution(path.reverse())
                    run = false
                    break
                }
                if(!startexplored.includes(`${node.curr}`)){
                    await pause(1)
                    startexplored.push(`${node.curr}`)
                    startfrontier.push(node)
                    //animate
                    visitedbox = document.getElementById(`(${node.curr[0]},${node.curr[1]})`)
                    animate = document.createElement('div')
                    animate.id = 'vistedNode'
                    visitedbox.append(animate)
                }
            }
            startfrontier.shift()
            if(!run){break}
        }
        if(!startfrontier.length){
            run =false
            vis = true
        } 
    }
}
async function DFS(state,startingpoint,endingpoint){
    let path = []
    let node = new Node(startingpoint,null,null);
    let explored = [`${node.curr}`]
    let frontier = [node]
    let run = true
    var q;
    while(run){
        if(!frontier.length){
            run =false
            vis = true
            break
        } 
        possible_actions = findneighbor(state,frontier[frontier.length-1].curr)
        for(var i=0;i<possible_actions.length;i++){
            if(!explored.includes(`${possible_actions[i]}`)){
                break
            }
            if(i === possible_actions.length-1){
                frontier.splice(frontier.length-1,1)
            }
        }
        q = 0
        for(var i=0;i<possible_actions.length;i++){
            node = new Node(possible_actions[i],frontier[frontier.length-1-q],null)
            if(node.curr[0] === endingpoint[0] && node.curr[1] === endingpoint[1]){
                while(node.prev){
                    path.push(node.curr)
                    node = node.prev
                }
                await pause(25)
                highlightsolution(path.reverse())
                run = false
                break
            }
            if(!explored.includes(`${node.curr}`)){
                q++;
                await pause(15)
                explored.push(`${node.curr}`)
                frontier.push(node)
                //animate
                visitedbox = document.getElementById(`(${node.curr[0]},${node.curr[1]})`)
                animate = document.createElement('div')
                animate.id = 'vistedNode'
                visitedbox.append(animate)
            }
        }
    }
}

async function A(state,startingpoint,endingpoint){
    let path = []
    let node = new Node(startingpoint,null,0);
    let explored = [`${node.curr}`]
    let frontier = [node]
    let run = true
    let x;
    let look;
    let index;
    while(run){
        if(!frontier.length){
            run =false
            vis = true
            break
        } 
        x = frontier[0].val +finddistance(frontier[0].curr,endingpoint)
        look = frontier[0]
        index = 0
        for(var i=0;i<frontier.length;i++){
            if( x>frontier[i].val +finddistance(frontier[i].curr,endingpoint)){
                x = frontier[i].val +finddistance(frontier[i].curr,endingpoint)
                look = frontier[i]
                index = i
            }
        }
        possible_actions = findneighbor(state,look.curr)
        for(var i=0; i<possible_actions.length;i++){
            let node = new Node(possible_actions[i],look,look.val+1)
            if(node.curr[0] === endingpoint[0] && node.curr[1] === endingpoint[1]){
                while(node.prev){
                    path.push(node.curr)
                    node = node.prev
                }
                await pause(25)
                highlightsolution(path.reverse())
                run = false
                break
            }
            if(!explored.includes(`${node.curr}`)){
                await pause(15)
                explored.push(`${node.curr}`)
                frontier.push(node)
                //animate
                visitedbox = document.getElementById(`(${node.curr[0]},${node.curr[1]})`)
                animate = document.createElement('div')
                animate.id = 'vistedNode'
                visitedbox.append(animate)
            }
        }
        frontier.splice(index,1);
    }
}
async function GBFS(state,startingpoint,endingpoint){
    let path = []
    let node = new Node(startingpoint,null,finddistance(startingpoint,endingpoint));
    let explored = [`${node.curr}`]
    let frontier = [node]
    let run = true
    let x;
    let look;
    let index;
    while(run){
        if(!frontier.length){
            run =false
            vis = true
            break
        } 
        x = frontier[0].val
        look = frontier[0]
        index = 0
        for(var i=0;i<frontier.length;i++){
            if(x>frontier[i].val){
                x = frontier[i].val
                look = frontier[i]
                index = i
            }
        }
        possible_actions = findneighbor(state,look.curr)
        for(var i=0; i<possible_actions.length;i++){
            node = new Node(possible_actions[i],look,finddistance(possible_actions[i],endingpoint))
            if(node.curr[0] === endingpoint[0] && node.curr[1] === endingpoint[1]){
                while(node.prev){
                    path.push(node.curr)
                    node = node.prev
                }
                await pause(25)
                highlightsolution(path.reverse())
                run = false
                break
            }
            if(!explored.includes(`${node.curr}`)){
                await pause(15)
                explored.push(`${node.curr}`)
                frontier.push(node)
                //animate
                visitedbox = document.getElementById(`(${node.curr[0]},${node.curr[1]})`)
                animate = document.createElement('div')
                animate.id = 'vistedNode'
                visitedbox.append(animate)
            }
        }
        frontier.splice(index,1);
    }
}

async function Bidirection_swarm(state,startingpoint,endingpoint){
    let spath = []
    let epath = []
    const curs = new Node(startingpoint,null,null);
    const cure = new Node(endingpoint,null,null);
    let startexplored = [`${curs.curr}`]
    let endexplored = [`${cure.curr}`]
    let startfrontier = [curs]
    let endfrontier = [cure]
    let run = true
    let counterx = 0
    let countery = 0
    while(run){
        var x  = startfrontier.length
        let xx = counterx
        for(var i=xx; i<x;i++){
            let possible_actions = findneighbor(state,startfrontier[i].curr)
            for(var j=0; j<possible_actions.length;j++){
                let node = new Node(possible_actions[j],startfrontier[i],null)
                if(endexplored.includes(`${node.curr}`)){
                        while(node.prev){
                            spath.push(node.curr)
                            node = node.prev
                        }
                        spath.reverse()
                        run = false
                        break
                    }
                if(!startexplored.includes(`${node.curr}`)){
                    await pause(2)
                    startexplored.push(`${node.curr}`)
                    startfrontier.push(node)
                    //animate
                    visitedbox = document.getElementById(`(${node.curr[0]},${node.curr[1]})`)
                    animate = document.createElement('div')
                    animate.id = 'vistedNode'
                    visitedbox.append(animate)
                }
            }
            counterx++
            if(!run){break}
        }
        if(counterx === startfrontier.length){
            run =false
            vis =true
            break
        }
        var y  = endfrontier.length
        let yy =countery
        for(var i = yy; i<y;i++){
            if(!run){break}
            let possible_actions = findneighbor(state,endfrontier[i].curr)
            for(var j=0; j<possible_actions.length;j++){
                let node = new Node(possible_actions[j],endfrontier[i],null)
                if(startexplored.includes(`${node.curr}`)){
                    while(node.prev){
                        epath.push(node.curr)
                        node = node.prev
                    }
                    epath.push(node.curr)
                    run = false
                    break
                }
                if(!endexplored.includes(`${node.curr}`)){
                    await pause(2)
                    endexplored.push(`${node.curr}`)
                    endfrontier.push(node)
                    //animate
                    visitedbox = document.getElementById(`(${node.curr[0]},${node.curr[1]})`)
                    animate = document.createElement('div')
                    animate.id = 'vistedNode'
                    visitedbox.append(animate)
                }
            }
            countery++
            if(!run){break}
        }
        if(endfrontier.length === countery){
            run =false
            vis = true
            break
        }
    }
    if(!vis){
        if(spath.length){
            let check = spath[spath.length-1]
            for(var i= 0;i<endfrontier.length;i++){
                if (endfrontier[i].curr[0] === check[0] && endfrontier[i].curr[1] === check[1]){
                    var node = endfrontier[i];
                    break;
                }
            }
            while(node.prev){
                epath.push(node.curr)
                node = node.prev
            }
            epath.push(node.curr)
        }else{
            for(var i= 0;i<startfrontier.length;i++){
                if (startfrontier[i].curr[0] === epath[0][0] && startfrontier[i].curr[1] === epath[0][1]){
                    var node = startfrontier[i];
                    break;
                }
            }
            while(node.prev){
                spath.push(node.curr)
                node = node.prev
            } 
            spath.reverse()
        }
        epath.shift()
        path = spath.concat(epath)
        await pause(25)
        highlightsolution(path)
        run = false
    }
}

function finddistance(point,endingpoint){
    return Math.abs(endingpoint[0]-point[0]) + Math.abs(endingpoint[1]-point[1])
}

function findneighbor(state,point){
    actions = []
    if (point[1] <59){
        if(state[point[0]][point[1]+1] !== "#"){
            actions.push([point[0],point[1]+1])
        }
    } 
    if (point[1] >0){
        if(state[point[0]][point[1]-1] !== "#"){
            actions.push([point[0],point[1]-1])
        }
    } 
    if (point[0] <19){
        if(state[point[0]+1][point[1]] !== "#"){
            actions.push([point[0]+1,point[1]])
        }
    }   
    if (point[0] >0){
        if(state[point[0]-1][point[1]] !== "#"){
            actions.push([point[0]-1,point[1]])
        }
    } 
    return actions;
}

function pause(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function highlightsolution(path){
    for(var i = 0;i<path.length-1;i++){
        await pause(25)
        visitedbox = document.getElementById(`(${path[i][0]},${path[i][1]})`)
        visitedbox.removeChild(visitedbox.lastChild);
        animate = document.createElement('div')
        animate.id = 'finalpath'
        visitedbox.append(animate)
    }
    vis = true
}

const Maze1 = [["#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#"],
["#", 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#"],
["#", 0,"#",0,"#", "#","#",0,"#",0,"#",0,"#","#","#","#","#",0,"#","#","#","#","#","#","#","#","#",0,"#","#","#","#","#","#","#",0,"#", 0,"#",0,"#", 0,"#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#",0,"#"],
["#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#"],
["#", 0,"#",0,"#",0, "#", 0,"#", 0,"#",0,"#", "#","#", 0,"#",0,"#", 0,"#","#","#","#","#",0,"#",0,"#",0,"#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#", "#","#","#","#","#","#","#","#", 0,"#"],
["#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#"],
["#",0,"#",0,"#",0,"#",0,"#",0,"#",0,0,0,"#",0,"#",0,"#",0,"#",0,"#",0,"#",0,"#",0,"#",0,"#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#",0,"#","#","#","#","#","#","#","#","#","#","#",0,"#"],
["#",0,"#",0,"#",0,"#",0,"#",0,"#","#","#",0,"#",0,"#",0,"#",0,"#",0,"#",0,"#",0,"#",0,"#",0,0,0,0,0,0,0,0,0,0,"#","#","#","#","#","#","#",0,"#","#","#","#","#","#","#","#","#","#","#",0,"#"],
["#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#"],
["#",0,"#",0,"#",0,"#",0,"#","#","#",0,"#",0,"#",0,"#",0,"#",0,"#","#","#",0,"#",0,"#",0,"#",0,"#","#","#","#","#","#","#","#","#","#",0,"#",0,"#",0,"#",0,"#","#","#","#","#","#","#",0,"#","#","#","#","#"],
["#", 0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#"],
["#",0,"#","#","#",0,"#","#","#",0,"#",0,"#",0,"#",0,"#",0,"#","#","#","#","#","#","#",0,"#",0,"#","#","#","#","#",0,"#","#","#","#",0,"#",0,"#",0,"#",0,"#",0,"#","#","#","#","#",0,"#",0,"#", 0,"#",0,"#"],
["#", 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#"],
["#","#","#","#", "#","#","#", 0,"#", 0,"#", 0, "#",0,"#",0, "#",0,"#", 0,"#","#","#",0,"#",0,"#",0,"#",0,"#",0,"#",0,"#", 0,"#","#", 0,"#",0, "#",0, "#", 0, "#",0, "#","#","#","#","#","#","#", 0,"#",0, "#", 0,"#"],
["#", 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#"],
["#",0,"#","#","#", 0,"#", 0,"#",0,"#",0,"#",0,"#",0,"#", 0,"#",0,"#", 0,"#",0,"#",0,"#",0,"#",0,"#", 0,"#","#","#", 0,"#","#", 0,"#",0,"#",0,"#",0,"#", 0, "#","#","#","#", "#","#","#","#","#","#","#", 0, "#"],
["#", 0, "#", 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#"],
["#",0,"#","#","#","#","#",0,"#","#","#",0,"#", 0,"#",0,"#", 0,"#", 0,"#","#","#","#","#",0,"#", 0,"#", 0,"#","#","#","#","#","#","#","#","#","#",0, "#", 0,"#",0,"#","#","#","#","#","#","#","#","#", "#","#","#","#","#","#"],
["#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#"],
["#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#"]
]

const Maze2 = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,"#","#","#","#","#","#","#","#","#","#", "#","#","#","#","#","#", "#","#","#","#","#","#","#","#", "#","#","#", "#", "#","#","#","#","#","#", "#","#","#","#","#","#"],
[0, "#", "#", "#", "#", "#", "#", "#", 0, "#", "#", "#", "#", 0, "#", "#", "#", "#", "#", 0, "#", 0, "#", 0, 0, 0, 0, "#", 0, 0, 0, 0, "#", 0, "#", 0, 0, 0, 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#"],
[0, "#", 0, 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", "#", 0, "#", "#", 0, "#", "#", "#", 0, "#", "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", "#", 0, "#", "#", "#", "#", "#", "#", "#", 0, "#"],
[0, "#", 0, "#", "#", "#", "#", "#", 0, "#", "#", "#", "#", 0, "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", "#", "#", "#", "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, "#"],
[0, "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, "#", 0, "#", 0, "#", "#", "#", 0, "#", 0, "#", "#", "#", "#", 0, "#", "#", "#", "#", "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#"],
[0, "#", 0, "#", 0, "#", "#", "#", 0, "#", "#", "#", "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", "#", "#", "#", "#", 0, "#", 0, "#", "#", "#", "#", "#", "#", "#", 0, "#", 0, "#"],
[0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, 0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, "#", "#", "#", "#", 0, "#", "#", 0, "#", "#", "#", "#", 0, "#", "#", "#", "#", "#", 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, "#", 0, "#"],
[0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", "#", "#", "#", "#", 0, "#", 0, "#", 0, "#", "#", "#", 0, "#", 0, "#", 0, "#"],
[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", "#", "#", "#", 0, "#", "#", "#", "#", "#", "#", "#", 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, "#"],
["#", 0, "#", "#", "#", "#", "#", "#", "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, "#", "#", 0, "#", "#", "#", "#", "#", 0, 0, 0, "#", 0, "#", 0, 0, 0, "#", 0, 0, 0, "#"],
["#", 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, "#", "#", "#", 0, "#", 0, 0, "#", 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", "#", 0, "#", 0, "#"],
["#",0,"#","#","#","#","#","#",0,"#","#",0,"#",0,"#",0,"#",0,"#",0,0,0,"#",0,"#","#","#","#","#","#","#",0,"#", 0, "#",0,"#","#",0,"#",0,"#", "#","#","#","#",0, "#", 0, 0, 0,"#", 0,"#",0,0,0,"#",0,"#"],
["#", 0, "#", 0, 0, 0, 0, 0, 0, "#", 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", "#", "#", 0, "#", "#", "#", "#", "#", 0, "#"],
["#",0,"#","#","#","#", 0,"#","#","#","#", 0,"#",0, "#", 0,"#",0, "#",0,"#",0,"#",0,"#","#","#","#","#","#","#", 0, "#",0, "#", 0, "#",0, "#", "#",0, "#","#","#","#",0, "#","#",0, 0, 0, "#", 0,"#", 0,0,0,0, 0, "#"],
["#", 0, "#", 0, 0, 0, 0, "#", 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", "#", "#", 0, "#", "#", "#", "#", "#", 0, "#"],
["#",0,"#", "#",0,"#","#","#","#", 0,"#",0,"#", 0,"#",0,"#",0,"#","#", "#", 0,"#", 0,"#","#","#", "#","#",0,"#", 0, "#", 0, 0,0,"#","#",0,"#",0,"#","#","#","#","#",0, "#", 0,"#",0,"#",0, 0, 0,0, 0,0,0,"#"],
["#", 0, 0, 0, 0, "#", 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", "#", "#", "#", "#", "#", "#", 0, "#"],
["#",0,"#","#","#","#","#",0,"#", 0,"#","#","#", 0,"#", 0,"#","#","#","#","#","#","#","#","#","#", "#", 0,"#", 0,"#",0,"#",0,"#",0, "#","#","#","#",0, "#","#","#","#",0,"#","#",0,"#",0,"#",0,"#", 0,"#",0,"#",0,"#"],
["#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#"],
["#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#","#"]
]

const Maze3= [["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
["#", 0, 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, "#", 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#"],
["#", "#", "#", "#", "#", "#", "#", 0, "#", "#", "#", 0, "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", "#", "#", "#", "#", 0, "#"],
["#", 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", "#", "#", "#", "#", "#", "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", "#", "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#"],
["#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", "#", "#", "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, "#", "#", "#", "#", 0, "#", "#", "#", "#", "#"],
["#", "#", "#", "#", "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, "#", "#", "#", "#", "#", "#", 0, "#", "#", 0, "#", 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", 0, "#", 0, "#", 0, 0, 0, 0, "#", 0, 0, 0, "#"],
["#", 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", 0, "#", 0, "#", 0, 0, 0, 0, "#", 0, 0, "#", 0, "#", "#", "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, "#", 0, "#", "#", 0, "#", 0, "#", 0, "#"],
["#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", 0, "#", "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, 0, "#", 0, "#", 0, "#"],
["#", "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", "#", "#", "#", 0, "#", "#", "#", "#", 0, "#", 0, "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, "#", "#", "#", "#", 0, "#", 0, "#", 0, "#"],
["#", 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, "#", 0, "#", "#", "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, "#", "#", "#", "#", "#", "#", "#", "#", "#", 0, "#", 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#"],
["#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", "#", 0, "#", 0, 0, 0, "#", 0, "#", 0, 0, 0, 0, 0, "#", "#", 0, "#", "#", "#", "#", "#", "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#"],
["#", "#", "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", "#", "#", "#", 0, "#", "#", "#", "#", "#", "#", "#", "#", "#", 0, "#", "#", "#", "#", "#", "#", "#", "#", "#"],
["#", 0, 0, 0, 0, 0, 0, 0, "#", "#", "#", "#", "#", 0, "#", "#", "#", "#", "#", "#", 0, "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", "#", "#", "#", 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", 0, "#", 0, 0, "#", 0, 0, 0, 0, 0, 0, "#"],
["#", 0, "#", "#", "#", "#", "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, "#", 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, "#", "#", 0, "#", "#", "#", "#", 0, "#"],
["#", 0, 0, 0, 0, 0, "#", 0, "#", "#", "#", "#", "#", 0, "#", 0, "#", 0, "#", "#", 0, "#", 0, "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, "#", 0, "#", 0, "#", "#", "#", "#", "#", 0, 0, "#", 0, "#", 0, 0, "#", 0, "#"],
["#", "#", "#", "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", 0, 0, 0, "#", 0, 0, "#", 0, 0, 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", 0, "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, "#", "#", 0, "#", 0, "#", "#", 0, "#"],
["#", 0, "#", 0, 0, 0, "#", 0, "#", 0, 0, 0, 0, 0, "#", 0, "#", 0, 0, 0, 0, "#", 0, "#", 0, "#", "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", 0, 0, 0, 0, "#", 0, 0, 0, "#", "#", "#", "#", "#", 0, 0, "#", 0, "#", 0, 0, "#", 0, "#"],
["#", 0, "#", 0, "#", "#", "#", 0, "#", "#", "#", "#", "#", "#", "#", 0, "#", "#", "#", "#", "#", "#", 0, "#", 0, "#", 0, 0, "#", 0, "#", 0, "#", 0, "#", 0, "#", "#", "#", "#", 0, "#", "#", "#", "#", "#", 0, "#", 0, "#", 0, "#", "#", 0, "#", 0, "#", "#", 0, "#"],
["#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, "#", "#", 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#", 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, "#"],
["#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#", "#"]
]

