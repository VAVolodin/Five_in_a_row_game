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
    boardSize = document.querySelector("#boardsize").value;
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
    board.addEventListener("click", tikTakEl);
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
    board.removeEventListener("click", tikTakEl);
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

function tikTakEl(e) {
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
    userMove = -1 * userMove;
    e.appendChild(chip);
    nextMoveImage.src = `chip${userMove}.svg`;
    // hasNeighbors(x, y);
    isWinPos(x, y);
    // alert(`target = ${e.tagName} \n class = ${e.classList.contains("board")} \n x= ${x} y=${y}` );
}

// checking neighbors at:
function hasNeighbors(x, y) {
    if (y > 0 && recordMoves[x][y - 1] != 0) return true; // Left:
    if (y + 1 < boardSize && recordMoves[x][y + 1] != 0)
        return true; // Right

    if (x > 0) {
        if (recordMoves[x - 1][y] != 0) return true; // Top
        if (y > 0 && recordMoves[x - 1][y - 1] != 0) return true; // Left - Top
        if (y + 1 < boardSize && recordMoves[x - 1][y + 1] != 0)
            return true; // Right - Top
    }

    if (x + 1 < boardSize) {
        if (recordMoves[x + 1][y] != 0) return true; // Bottom
        if (y > 0 && recordMoves[x + 1][y - 1] != 0) return true; // Left - Bottom
        if (y + 1 < boardSize && recordMoves[x + 1][y + 1] != 0)
            return true; // Right - Bottom
    }
    return false;
}

// should checking winning position after every hasNeighbors calls
// it's worth trying to combine neighbors in one collection for each direction row and  then compare it with each other, I think so
// userMove = 1 or -1 => x or y maybe incrementing or decrementing by every user move
function isWinPos(x, y) {
    console.log(x, y);
    let i = 1,
        j = 1,
        counter = 1;

    // horizontal
       // right position
    console.log("h1 ========"); 
    while (y + i < boardSize && hasNeighbors(x, y + i)) { i++; counter++; console.log("i-h1", i);}
        // left position
    console.log("h2 ========");
    while (y - j >= 0 && hasNeighbors(x, y - j)) { j++; counter++; console.log("j-h2", j);} 
    if (counter > 4) return console.log("yes " + counter);

    // vertical
        // up
    console.log("v1 ========");
    while (x + i < boardSize && hasNeighbors(x + 1, y)) { i++; counter++; console.log("i-v1", i);}
        // down
    console.log("v2 ========");
    while (x - j >= 0 && hasNeighbors(x - j, y)) { j++; counter++; console.log("j-v2", j);}
    if (counter > 4) return console.log("yes " + counter);

        // from left-top to right-bottom
    console.log("dl-r1 ========");
    while (x + i < boardSize && hasNeighbors(x + 1, y)) { i++; counter++; console.log("i-dl-r1", i);}
    console.log("dl-r2 ========");
    while (x - j >= 0 && hasNeighbors(x - j, y)) { j++; counter++; console.log("j-dl-r2", j);}
    if (counter > 4) return console.log("yes " + counter);

        // from right-top to left-bottom
    console.log("dr-l1 ========");
    while (x + i < boardSize && y + i < boardSize && hasNeighbors(x + i, y + i)) { i++; counter++; console.log("i", i);} 
    console.log("dr-l2 ========");
    while (x - j >= 0 && y - j >= 0 && hasNeighbors(x - j, y - j)) {j++; counter++; console.log("j", j);}
    if (counter > 4) return console.log("you win " + counter);

    return console.log("No! " + counter);
}