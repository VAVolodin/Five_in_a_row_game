const header = document.querySelector("header");
const btn = header.querySelector(".start_btn");
const board = document.querySelector(".board");
const nextMoveImage = header
    .querySelector(".next_move-wrap")
    .querySelector("img");

btn.addEventListener("click", createDiv);
btn.addEventListener("click", btnActive);

let userMove,
    boardSize = null,
    recordMoves = [];

//creating the game board
function createDiv() {
    boardSize = +document.querySelector("#boardsize").value;
    userMove = 1;
    btn.removeEventListener("click", createDiv);
    btn.textContent = "Restart";
    let docWidth = document.documentElement.clientWidth;
    let fieldSize = docWidth > 1200 ? 4.5 * boardSize + "vh" : "90vw";
    board.style.width = board.style.height = fieldSize;
    document.body.appendChild(board);

    for (let x = 0; x <= boardSize - 1; x++) {
        recordMoves[x] = [];
        for (let y = 0; y <= boardSize - 1; y++) {
            addBox(x, y);
            recordMoves[x][y] = 0;
        }
    }

    board.classList.add("board_border");
    btn.addEventListener("click", restart);
    board.addEventListener("click", getChipPos);
}

function addBox(x, y) {
    newDiv = document.createElement("div");
    newDiv.setAttribute("id", `${x}.${y}`);
    newDiv.classList.add("box");
    board.appendChild(newDiv);
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
        createDiv();
    }, 800);
    // data clearing
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
    chip.src = `chip${userMove}.svg`;
   
    // hasNeighbors(x, y);
    isWinPos(x, y);
    // alert(`target = ${e.tagName} \n class = ${e.classList.contains("board")} \n x= ${x} y=${y}` );

    userMove = -1 * userMove;
    e.appendChild(chip);
    nextMoveImage.src = `chip${userMove}.svg`;
}

// checking neighbors at:
function hasNeighbors(x, y) {
    
    if (recordMoves[x][y] === userMove) return true;
    // if (y > 0 && recordMoves[x][y] === userMove) return true; // Left:
    // if (y + 1 < boardSize && recordMoves[x][y + 1] === userMove) return true; // Right

    // if (x > 0) {
    //     if (recordMoves[x][y] === userMove) return true; // Top
    //     if (y > 0 && recordMoves[x - 1][y - 1] === userMove) return true; // Left - Top
    //     if (y + 1 < boardSize && recordMoves[x - 1][y + 1] === userMove) return true; // Right - Top
    // }

    // if (x + 1 < boardSize) {
    //     if (recordMoves[x + 1][y] === userMove) return true; // Bottom
    //     if (y > 0 && recordMoves[x + 1][y - 1] === userMove) return true; // Left - Bottom
    //     if (y + 1 < boardSize && recordMoves[x + 1][y + 1] === userMove) return true; // Right - Bottom
    // }
    return false;
}

// should checking winning position after every hasNeighbors calls
// it's worth trying to combine neighbors in one collection for each direction row and  then compare it with each other, I think so
// userMove = 1 or -1 => x or y maybe incrementing or decrementing by every user move
function isWinPos(x, y) {
    console.log(x, y);
    let counter;

    function isOnBoard(x,y){
        console.log(x,y)
        try {
            return recordMoves[x][y];
        } catch (error) {
            return false;
        }
    }
        
    function checkUserPos(key,i,j){
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
        }
    let chipRows = ['h','v','lt_rb', 'rt_lb']

    chipRows.map( (el)=> {
        let i = 1;
        let j = 1;
        counter = 1;
        while (checkUserPos(el+1, i, j)) { i++; counter++; console.log(`${el+1}`, i);}
        while (checkUserPos(el+2, i, j)) { j++; counter++; console.log(`${el+2}`, j);} 
        if (counter > 4) return console.log("yes " + counter);
            else return console.log("No! " + counter);
        }
    )
    // i = 1,
    // j = 1,
    // counter = 1;
    // while (checkUserPos(v_b)) { i++; counter++; console.log("v_b", i, "\n", hasNeighbors(x + 1, y));}
    // while (checkUserPos(v_t)) { j++; counter++; console.log("v_t", j);}
    // if (counter > 4) return console.log("yes " + counter);

    // i = 1,
    // j = 1,
    // counter = 1;
    // while (checkUserPos(d_lt)) { i++; counter++; console.log("d_lt", i);}
    // while (checkUserPos(d_rb)) { j++; counter++; console.log("d-rb", j);}
    // if (counter > 4) return console.log("yes " + counter);

    // i = 1,
    // j = 1,
    // counter = 1;
    // while (checkUserPos(d_rt)) { i++; counter++; console.log("d-rt", i);} 
    // while (checkUserPos(d_lb)) {j++; counter++; console.log("d-lb", j);}
    // if (counter > 4) return console.log("you win " + counter);

}


