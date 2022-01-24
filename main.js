const dqs = (tag) => document.querySelector(tag);
const header = dqs("header");
const description = dqs(".description");
const board = dqs(".board");
const btn = header.querySelector(".start_btn");
const nextMoveImage = header.querySelector(".nextMove_chip");
const chipColor = {"1":"Blue","-1":"Red"};
let userMove = 1,
    boardSize = null,
    recordMoves = [],
    a = [],
    aa = 1;

btn.addEventListener("click", restart);

// Front

//creating the game board
function createBoard() {
    boardSize = +dqs("#boardsize").value;
    btn.removeEventListener("click", restart);
    btn.textContent = "Restart";
    document.body.appendChild(board);
    board.style.height = board.style.width = `var(--sz${boardSize})`;

    for (let x = 0; x <= boardSize - 1; x++) {
        recordMoves[x] = [];
        a[x] = [];
        for (let y = 0; y <= boardSize - 1; y++) {
            addElem('board', 'div', 'box', 'id', `${x}.${y}`, boardSize);
            recordMoves[x][y] = 0;
            a[x][y] = 0;
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
    let newDiv = document.createElement(tagName);
    (atrName && value) && newDiv.setAttribute(atrName, value);
    clsName && newDiv.classList.add(clsName);
    if (clsName === 'box') newDiv.style.height = newDiv.style.width = `var(--bxsz${boardSize})`;
    newDiv.setAttribute("tabindex", "0")
    prnt.appendChild(newDiv);
}

function showModal(usrMv=userMove) {
    board.removeEventListener("click", getChipPos);
    let message = usrMv ? `${chipColor[usrMv]} chips Win!` : "It's a draw! \n Game oveR";
    addElem("board","div", "modal")
    addElem('modal' , 'div', 'modal_text')
    board.querySelector(".modal_text").textContent = message;
}

function restart() {
    userMove = 1;
    let delay = 0;
    description.classList.add("sink");
    // clearing the board
    btn.removeEventListener("click", restart);
    board.removeEventListener("click", getChipPos);
    nextMoveImage.style.color = `var(--blue)`;
    const chips = Array.from(board.querySelectorAll("img"));
    chips.forEach((e) => e.classList.add("sink"));
    if (recordMoves.filter((e) => e.some(el => el !== 0)).length ) { board.classList.add("shakeAnim"); delay=800;}
    setTimeout(() => {
        board.innerHTML = "";
        board.classList.remove("board_border");
        board.classList.remove("shakeAnim");
        board.classList.remove(`size_${boardSize}`);
        chips.forEach((e) => e.classList.remove("sink"));
        createBoard();
        description.remove();
    }, delay);
    
    // data clearing ?
    recordMoves = [];
    a = [];
}

// === Back ====

function getChipPos(e) {
    e = e.target;
    if (!e.className || e.classList.contains("board")) {
        return;
    }
    let x = +e.id.split(".")[0];
    let y = +e.id.split(".")[1];
    recordMoves[x][y] = userMove;
    a[x][y] = hasNeighbors(x,y); 
    newMove(e,x,y);
}

function newMove (e,x,y) {
    const chip = new Image();

    chip.src = `${chipColor[userMove]}.svg`;
    e.appendChild(chip);
    nextMoveImage.style.color = `var(--${chipColor[userMove*-1].toLowerCase()})`;
    if ( !recordMoves.filter((e) => e.some(el => el == 0)).length ) // is the board full ?
        {return showModal(0)};
    checkWin(x, y)
    // alert(`target = ${e.tagName} \n class = ${e.classList.contains("board")} \n x= ${x} y=${y}` );
    userMove = -1 * userMove;
    //if (userMove<0) {compukterMove(); console.log('compukterMove1')};
}

function checkWin(x, y) {
    return isWinPos(x,y) ? showModal() : false;
}

// cheking winning position after what?
function isWinPos(x,y,usrMv = userMove){
    return hasNeighbors(x,y,usrMv)[2]>4 ? true : false;
}

    //will return array with userMove(1 or -1), ind -> direction row (where  0 ='h', 1 = 'v', 2= 'lt_rb', 3 = 'rt_lb'), cMax = maximum neighbors count, count neighbors by side1 & side2
function hasNeighbors (x,y,usrMv=userMove){
    let chipRows = ['h','v','lt_rb', 'rt_lb'],
    counter = [],
    sideCount = [],
    k = 0;

    for (row of chipRows) {
        let i = 1,
        j = 1,
        cnt = 1,
        side1 = 0,
        side2 = 0;
        
        while (checkPosition(row+1, i, j,x,y, usrMv)) { i++; cnt++;side1++; console.log(`${row+1}`,"\nside1 "+ side1, i, cnt);}
        while (checkPosition(row+2, i, j,x,y, usrMv)) { j++; cnt++; side2++; console.log(`${row+2}`,"\nside2 "+ side2, j, cnt);} 
        counter[k] = cnt;
        sideCount[k] = [side1, side2];
        k++;
        
        }
        let cMax = Math.max.apply(null, counter);
        let ind = counter.indexOf(cMax);
        console.log("\ncounter",counter, ind, cMax + "\n", sideCount[ind][0],sideCount[ind][1]);
        
        return  [usrMv,ind,cMax,sideCount[ind][0],sideCount[ind][1]];
}

// checking chip's place on game board
function checkPosition(...props){
    let [key, i, j, x, y, usrMv] = props;

    switch (key) {
        case 'h1':
            return isOnBoard(x, y + i) && checkNeighbor(x, y + i, usrMv); // horizontal right
        case 'h2':
            return isOnBoard (x, y - j) && checkNeighbor(x, y - j, usrMv); // horizontal left
        case 'v1':
            return isOnBoard(x + i, y) && checkNeighbor(x + i, y, usrMv); //  vertical bottom
        case 'v2':
            return isOnBoard(x - j, y) && checkNeighbor(x - j, y, usrMv); //  vertical top
        case 'lt_rb1':
            return isOnBoard(x + i, y + i) && checkNeighbor(x + i, y + i, usrMv); //  right-bottom
        case 'lt_rb2':
            return isOnBoard(x - j, y - j) && checkNeighbor(x - j, y - j, usrMv); // left-top
        case 'rt_lb1':
            return isOnBoard(x - i, y + i) && checkNeighbor(x - i, y + i, usrMv) ; // right-top 
        case 'rt_lb2':
           return isOnBoard(x + j, y - j) && checkNeighbor(x + j, y - j, usrMv); // left-bottom
        default:
            console.log(" wrong key: ", key)
            break;
    }
    return false
}

// checking chip's neighbors
function checkNeighbor(x, y, usrMv = userMove) {
    if (recordMoves[x][y] === usrMv) return true;
    return false;
}

    // is the chip hits the game board checking 
function isOnBoard(x,y){
    try {
        return !!recordMoves[x][y];
    } catch (error) {
        return false;
    }
}



// must writing the code CPU move description 
//    (count free boxes from last user move to nearest user's chip for each line) it's gonna be awersome =))
function compukterMove (){
    console.log('compukterMove2')
    let el = (x,y) => document.getElementById(`${x}.${y}`).click();
    let r = () =>  Math.random() > 0.5 ? 1 : -1;
    // 1 - should create array that were has emty boxes' information
    // 2 - check for winner position each one of it (from empties)
    // 3 - check all rows' directions from received last user move's around 5 nearest boxes
    let cpuMove = moveChecker(-1);
    let usrMv = moveChecker(1);
            i = i + Math.round(Math.random())*r();
            j = j + Math.round(Math.random())*r();
            return el(i,j);

                // else {
                    // maxX = i + 5 > boardSize ? boardSize : i+5,
                    // minX = i - 5 < 0 ? 0 : i-5;
                    // maxY = j + 5 > boardSize ? boardSize : j+5;
                    // minY = j - 5 < 0 ? 0 : j-5;
                    // let k = i,
                    //     m = j;
                    // while(k<=maxX && hasNeighbors(k,j,1)){k++; counter++};
                    // while(m>=minY && hasNeighbors(i,m,1)){m--; counter++};
                    
                    // k=i;
                    // m=j;
                    // while(k>=minX && hasNeighbors(x,y,1)){x--; counter++};
                    // while(m<=maxY && hasNeighbors(x,y,1)){y++; counter++};
                // }
            // let en = emptyBoxes.map((e,i)=> e.map((el,ind)=>isWinPos(i,ind,1))) // cann't find winner move index
}

    // will return newMove(x,y) if it finds a winning position, otherwise an array with the data of open fours and open threes
function moveChecker (usrMv) {
    let emptyBoxes = [];  /// 0 if it hasn't value && has a neighbor, 1 - if it has a value or hasn't any neighbor;
    let res = [];
    for (let i = 0, max = 3; i<boardSize; i++){
        emptyBoxes[i] = [];
        for (let j=0; j<boardSize; j++){
            emptyBoxes[i][j] = 0;
            let hNcount = hasNeighbors(i,j,usrMv)[2];
            if (recordMoves[i][j]) {emptyBoxes[i][j] = 1; continue};
            if (hNcount<2) {emptyBoxes[i][j] = 1; continue};
            if (isWinPos(i,j,usrMv)){return el(i,j)}
            else {
                if (hNcount>=max){
                    max = hNcount;
                    res.push([max,i,j]);
                }
            }
        }
    }
    return res;
}

