const   
    dqs = (tag) => document.querySelector(tag),
    header = dqs("header"),
    description = dqs(".description"),
    board = dqs(".board"),
    muteBtn = dqs(".unmute"),
    btn = header.querySelector(".start_btn"),
    nextMoveImage = header.querySelector(".nextMove_chip"),
    chipColor = {"1":"Blue","-1":"Red"};

const audio = {
    Blue : new Audio('assets/sounds/setBlueChip.mp3'),
    Red : new Audio('assets/sounds/setRedChip.mp3'),
    shuffle : new Audio('assets/sounds/chips_movement.mp3'),
    reload : new Audio('assets/sounds/startBoard.mp3'),
    modal: new Audio('assets/sounds/winSound.mp3'),

    mute () {for (var i in audio) {
        audio[i].muted = !audio[i].muted;
    }},

    play (file) { audio[file].play()},
};
    
let userMove = 1,
    boardSize = null,
    recordMoves = [],
    gameOver;

muteBtn.addEventListener("click", muteBoard);
btn.addEventListener("click", restart);

// Front

//creating the game board
function createBoard() {
    gameOver = 0;
    boardSize = +dqs("#boardsize").value;
    btn.removeEventListener("click", restart);
    btn.textContent = "Restart";
    document.body.appendChild(board);
    board.style.height = board.style.width = `var(--sz${boardSize})`;

    for (let x = 0; x <= boardSize - 1; x++) {
        recordMoves[x] = [];
        for (let y = 0; y <= boardSize - 1; y++) {
            addElem('board', 'div', 'box', 'id', `${x}.${y}`, boardSize);
            recordMoves[x][y] = 0;
            }
    }
    
    board.classList.add("board_border");
    btn.addEventListener("click", restart);
    setTimeout(() => {board.addEventListener("click", getChipPos)}, 1000); 
}

// creating element needed
function addElem(...props) {
    [prnt, tagName, clsName, atrName, value, boardSize] = props;
    prnt = dqs(`.${prnt}`);
    const newDiv = document.createElement(tagName);
    (atrName && value) && newDiv.setAttribute(atrName, value);
    clsName && newDiv.classList.add(clsName);
    if (clsName === 'box') newDiv.style.height = newDiv.style.width = `var(--bxsz${boardSize})`;
    newDiv.setAttribute("tabindex", "0")
    prnt.appendChild(newDiv);
}

function showModal(usrMv=userMove) {
    audio.play(modal);
    gameOver = 1;
    board.removeEventListener("click", getChipPos);
    const message = usrMv ? `${chipColor[usrMv]} chips Win!` : "It's a draw! \n Game oveR";
    addElem("board","div", "modal")
    addElem('modal' , 'div', 'modal_text')
    board.querySelector(".modal_text").textContent = message;
}

function restart() {
    userMove = 1;
    
    let delay = 0;
    description.classList.add("sink");
    btn.removeEventListener("click", restart);
    board.removeEventListener("click", getChipPos);
    nextMoveImage.style.color = `var(--blue)`;
    const chips = Array.from(board.querySelectorAll("img"));
    chips.forEach((e) => e.classList.add("sink"));
    if (recordMoves.filter((e) => e.some(el => el !== 0)).length ) 
        { audio.play('shuffle'); board.classList.add("shakeAnim"); delay=800;}
        else {audio.play('reload')}
    setTimeout(() => {
        board.innerHTML = "";
        board.classList.remove("board_border");
        board.classList.remove("shakeAnim");
        board.classList.remove(`size_${boardSize}`);
        chips.forEach((e) => e.classList.remove("sink"));
        createBoard();
        description.remove();
    }, delay);
    
    recordMoves = [];
}

// === Audio ===
function muteBoard() {
    muteBtn.classList.toggle("unmute");
    muteBtn.classList.toggle("mute");
    audio.mute()
}

// === Back ====

function getChipPos(e) {
    audio.play(`${chipColor[userMove]}`);
    e = e.target;
    if (!e.className || e.classList.contains("board")) { return; }
    let x = +e.id.split(".")[0];
    let y = +e.id.split(".")[1];
    recordMoves[x][y] = userMove;
    newMove(e,x,y);
    
}

function newMove (e,x,y) {
    const chip = new Image();
    chip.src = `/assets/img/${chipColor[userMove]}.svg`;
    e.appendChild(chip);
    nextMoveImage.style.color = `var(--${chipColor[userMove*-1].toLowerCase()})`;
    if ( !recordMoves.filter((e) => e.some(el => el == 0)).length ) // if the board full return "draw"
        {return showModal(0)};
    checkWin(x, y)
    userMove = -1 * userMove;
    if (userMove<0 && !gameOver) {cpuMove(x,y)};
}

function checkWin(x, y) {
    return isWinPos(x,y) ? showModal() : false;
}

// cheking winning position after what?
function isWinPos(x,y,usrMv = userMove){
    return hasNeighbors(x,y,usrMv)[1][0]>4 ? true : false;
}


// checks 5 nearby boxes for neighbors
// return array with: ind - direction row (where  0 ='h', 1 = 'v', 2= 'lt_rb', 3 = 'rt_lb'), 
//                            sideCount[ind][0] - neighbors count of first while loop,
//                            sideCount[ind][1] - neighbors count of second while loop,
//                            totalNeighbors = total neighbors' count (by side1 & side2)
function hasNeighbors (x,y,usrMv=userMove){
    const
        chipRows = ['0','1','2', '3'],
        counter = [],
        sideCount = [];
    let k = 0;

    for (row of chipRows) {
        let i = j = cnt = side1 = side2 = 1;
        
        while (checkPosition(row+1, i, j,x,y, usrMv)) { i++; cnt++;side1++;};
        while (checkPosition(row+2, i, j,x,y, usrMv)) { j++; cnt++; side2++; };
        counter[k] = cnt;
        sideCount[k] = [side1, side2];
        k++;
        
    }
    const totalNeighbors = Math.max.apply(null, counter);
    const ind = counter.indexOf(totalNeighbors);
    
    return  [[ind, sideCount[ind][0], sideCount[ind][1]], [totalNeighbors]];
}

// checking chip's place on the game board for all rows' directions (true / false)
function checkPosition(...props){
    const [key, i, j, x, y, usrMv] = props;

    switch (key) {
        case '01':
            return isOnBoard(x, y + i) && checkNeighbor(x, y + i, usrMv); // horizontal right
        case '02':
            return isOnBoard (x, y - j) && checkNeighbor(x, y - j, usrMv); // horizontal left
        case '11':
            return isOnBoard(x + i, y) && checkNeighbor(x + i, y, usrMv); //  vertical bottom
        case '12':
            return isOnBoard(x - j, y) && checkNeighbor(x - j, y, usrMv); //  vertical top
        case '21':
            return isOnBoard(x + i, y + i) && checkNeighbor(x + i, y + i, usrMv); //  right-bottom
        case '22':
            return isOnBoard(x - j, y - j) && checkNeighbor(x - j, y - j, usrMv); // left-top
        case '31':
            return isOnBoard(x - i, y + i) && checkNeighbor(x - i, y + i, usrMv) ; // right-top 
        case '32':
           return isOnBoard(x + j, y - j) && checkNeighbor(x + j, y - j, usrMv); // left-bottom
        default:
            console.log(" wrong key: ", key)
            break;
    }
    return false
}

// checking chip's neighbors
function checkNeighbor(x, y, usrMv = userMove) {
    try {
        return recordMoves[x][y] === usrMv ?  true : false;
    }
    catch {
        return false;
    }
}

    // is the chip hits the game board checking 
function isOnBoard(x,y){
    try {
    return recordMoves[x][y] != undefined ? true : false;
    }
    catch {
        return false
    }
}

 // CPU move description 
function cpuMove (x,y){
    board.removeEventListener("click", getChipPos);
    const   
        makeMove = (arr) => setTimeout(() => {
            board.addEventListener("click", getChipPos); document.getElementById(`${arr[0]}.${arr[1]}`).click()
        }, 1000),
        r = () =>  Math.random() > 0.5 ? 1 : -1;
    let c = getPotentialMove(-1),
        u = getPotentialMove(1);
    const   pmCpu = c.length ? c : [[0,-1]],
            pmUser =u.length ? u : [[0,-1]],
            oeCpu = getOpenEdge(pmCpu),
            oeUser = getOpenEdge(pmUser);

    const getRandomMove = () => {
        let i = x + r(),
            j = y + r();
        return isOnBoard(i,j) ? makeMove([i,j]) : getRandomMove();
    }
    
    if (!~pmCpu[0][1] && !~pmUser[0][1]){ return getRandomMove() }
    return makeMove((pmCpu[0][1] >= pmUser[0][1]) ? getBestMove(pmCpu,oeCpu) : getBestMove(pmUser,oeUser));
    
         // takes finded potential moves & opened edges then return move's coordinates after that
    function getBestMove (arr, arr2) {
        const random = (ex) => Math.floor(Math.random()*ex.length);
            // finds both sides opened edges only
        const openMoves = arr.map((e,i) => {
            return !arr2[i].includes(false) ? [e[0][3],e[0][4]] : 0 }).filter(el => Array.isArray(el));
        if (openMoves.length==1){ return openMoves[0]};
        if (openMoves.length) {return openMoves[random(openMoves)]}
            
        const closedMoves = arr.map(e => [e[0][3],e[0][4]]);
        if (closedMoves.length==1){ return closedMoves[0]};
        if (closedMoves.length) {return closedMoves[random(closedMoves)]}
        else return getRandomMove();
    }


        // checks for empty boxes on both sides of the founded potential moves
        // it'll return arrays' array (for ex [[true , false],[true,true],[false,true]])
    function getOpenEdge (arr) {
        const pog = []
        if (!!~arr[0][1]){
            arr.map(e => {
                const ar = [];
                let m = 1;
                while(m<3){
                    let n = e[0][0];
                    e[0][0] = e[0][0]+`${m}`
                    ar.push(checkPosition(...e[0]));
                    m++;
                    e[0][0] = n;
                }
                pog.push(ar)
            })
        } else {pog[0] = [0]};
        return pog;
    }

        //  search for empty boxes with neighbors, check it for winning position & neighbors if it's not
        // will return newMove(x,y) if it finds a winning position, otherwise arrays' array with the data of open threes or fours:
        //   [[row dir, side1 count, side2 count,i,j,0], totalNeighbors];
    function getPotentialMove (usrMv) {
        let result = [];
        for (let i = 0, prev = 3, max = 3; i<boardSize; i++){
            for (let j=0; j<boardSize; j++){
                const hN = hasNeighbors(i,j,usrMv);
                if (recordMoves[i][j] || hN[1][0]<2) {continue}; // => filter for empty boxes with neighbors
                if (isWinPos(i,j,usrMv)){return [[[...hN[0],i,j,0],...hN[1]]]}
                else {
                    if (hN[1][0]>=max){
                        max = hN[1][0];
                        if (prev < max) {result.pop(); prev = max;}
                        result.push([[...hN[0],i,j,0],...hN[1]]);
                    }
                }
            }
        }
    return result; 
    }

}
