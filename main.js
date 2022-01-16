const dqs = (tag) => document.querySelector(tag);
const header = dqs("header");
const description = dqs(".description");
const board = dqs(".board");
const btn = header.querySelector(".start_btn");
const nextMoveImage = header.querySelector(".nextMove_chip");
const chipColor = {"1":"Blue","-1":"Red"};
let userMove,
    boardSize = null,
    recordMoves = [];

btn.addEventListener("click", restart);

//creating the game board
function createBoard() {
    boardSize = +dqs("#boardsize").value;
    userMove = 1;
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
    
    // board.querySelectorAll(".box").setAttribute("height","${boxSize[boardSize]}")
    board.classList.add("board_border");
    btn.addEventListener("click", restart);
    setTimeout(() => {board.addEventListener("click", getChipPos)}, 1000); 
}



function restart() {
    description.classList.add("sink");
    // clearing the board
    btn.removeEventListener("click", restart);
    board.removeEventListener("click", getChipPos);
    const chips = Array.from(board.querySelectorAll("img"));
    chips.forEach((e) => e.classList.add("sink"));
    board.classList.add("shakeAnim");
    setTimeout(() => {
        board.innerHTML = "";
        board.classList.remove("board_border");
        board.classList.remove("shakeAnim");
        board.classList.remove(`size_${boardSize}`);
        chips.forEach((e) => e.classList.remove("sink"));
        createBoard();
        description.remove();
    }, 800);
    
    // data clearing ?
    recordMoves = [];
}

function btnActive(event) {
    event.target.style.backgroundColor = "#0096a5";
    setTimeout(() => {
        event.target.style.backgroundColor = "#d2c2fd";
    }, 10);
}



function getChipPos(e) {
    e = e.target;
    const chip = new Image();
    if (!e.className || e.classList.contains("board")) {
        return;
    }
    let x = +e.id.split(".")[0];
    let y = +e.id.split(".")[1];
    recordMoves[x][y] = userMove;
    chip.src = `${chipColor[userMove]}.svg`;
    e.appendChild(chip);
    nextMoveImage.style.color = `var(--${chipColor[userMove*-1].toLowerCase()})`;
    if ( !recordMoves.filter((e,i) => e.some(el => el == 0)).length ) // is the board full ?
        {return showModal(0)};
    checkWin(x, y)
    // alert(`target = ${e.tagName} \n class = ${e.classList.contains("board")} \n x= ${x} y=${y}` );
    userMove = -1 * userMove;
}

function checkWin(x, y) {
    return isWinPos(x,y)
}

// cheking winning position
function isWinPos(x,y){
    let chipRows = ['h','v','lt_rb', 'rt_lb'];
    let counter;

    for (row of chipRows) {
        let i = 1;
        let j = 1;
        counter = 1;
        while (checkUserPos(row+1, i, j,x,y)) { i++; counter++; console.log(`${row+1}`, i, counter);}
        while (checkUserPos(row+2, i, j,x,y)) { j++; counter++; console.log(`${row+2}`, j, counter);} 
        if (counter > 4) {return showModal(userMove) }
        }
    return false;
}

// checking chip's place on game board
function checkUserPos(...props){
    let [key, i, j, x, y] = props;

    switch (key) {
        case 'h1':
            return isOnBoard(x, y + i) && hasNeighbors(x, y + i); // horizontal right
        case 'h2':
            return isOnBoard (x, y - j) && hasNeighbors(x, y - j); // horizontal left
        case 'v1':
            return isOnBoard(x + i, y) && hasNeighbors(x + i, y); //  vertical bottom
        case 'v2':
            return isOnBoard(x - j, y) && hasNeighbors(x - j, y); //  vertical top
        case 'lt_rb1':
            return isOnBoard(x + i, y + i) && hasNeighbors(x + i, y + i); //  right-bottom
        case 'lt_rb2':
            return isOnBoard(x - j, y - j) && hasNeighbors(x - j, y - j); // left-top
        case 'rt_lb1':
            return isOnBoard(x - i, y + i) && hasNeighbors(x - i, y + i) ; // right-top 
        case 'rt_lb2':
           return isOnBoard(x + j, y - j) && hasNeighbors(x + j, y - j); // left-bottom
        default:
            console.log(" wrong key: ", key)
            break;
    }
    return false
}

// checking chip's neighbors
function hasNeighbors(x, y) {
    if (recordMoves[x][y] === userMove) return true;
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

function showModal(userMove) {
    board.removeEventListener("click", getChipPos);
    let message = userMove ? `${chipColor[userMove]} chips Win!` : "It's a draw! \n Game oveR";
    addElem("board","div", "modal")
    addElem('modal' , 'div', 'modal_text')
    board.querySelector(".modal_text").textContent = message;
}



