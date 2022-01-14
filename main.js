const header = document.querySelector("header");
const btn = header.querySelector(".start_btn");
const board = document.querySelector(".board");
const nextMoveImage = header
    .querySelector(".next_move-wrap")
    .querySelector("img");

btn.addEventListener("click", createBoard);
btn.addEventListener("click", btnActive);

let userMove,
    boardSize = null,
    recordMoves = [];

const chipColor = {"1":"Blue","-1":"Red"}
const boxSize = {10:"--ten", 15:"--fifteen", 20:"--twelve"}


//creating the game board
function createBoard() {
    boardSize = +document.querySelector("#boardsize").value;
    userMove = 1;
    btn.removeEventListener("click", createBoard);
    btn.textContent = "Restart";
    document.body.appendChild(board);

    for (let x = 0; x <= boardSize - 1; x++) {
        recordMoves[x] = [];
        for (let y = 0; y <= boardSize - 1; y++) {
            addElem('board', 'div', 'box', 'id', `${x}.${y}`);
            recordMoves[x][y] = 0;
        }
    }
    
    // board.querySelectorAll(".box").setAttribute("height","${boxSize[boardSize]}")
    board.classList.add("board_border");
    btn.addEventListener("click", restart);
    setTimeout(() => {board.addEventListener("click", getChipPos)}, 1000); 
}



function restart() {
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
        board.remove();
        chips.forEach((e) => e.classList.remove("sink"));
        createBoard();
    }, 800);
    // data clearing ?
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
        alert("You miss pal! Let's try again.");
        return;
    }
    let x = +e.id.split(".")[0];
    let y = +e.id.split(".")[1];
    recordMoves[x][y] = userMove;
    chip.src = `${chipColor[userMove]}.svg`;
    e.appendChild(chip);
    nextMoveImage.src = `${chipColor[`${-1*userMove}`]}.svg`;
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
        if (counter > 4) {return (
            board.removeEventListener("click", getChipPos),
            showModal(userMove)
            )
        }
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
    [prnt, tagName, clsName, atrName, value] = props;
    prnt = document.querySelector(`.${prnt}`);
    let newDiv = document.createElement(tagName);
    (atrName && value) && newDiv.setAttribute(atrName, value);
    clsName && newDiv.classList.add(clsName);
    prnt.appendChild(newDiv);
}

function showModal(userMove) {
    addElem("board","div", "modal")
    addElem('modal' , 'div', 'modal_text')
    board.querySelector(".modal_text").textContent = `${chipColor[userMove]} chips Win!`
}



