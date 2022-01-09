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
    hasNeighbors(x, y);
    // alert(`target = ${e.tagName} \n class = ${e.classList.contains("board")} \n x= ${x} y=${y}` );
}

// checking neighbors at:
function hasNeighbors(x, y) {
    if (y > 0 && recordMoves[x][y - 1] != 0) return console.log(true); // Left:
    if (y + 1 < boardSize && recordMoves[x][y + 1] != 0)
        return console.log(true); // Right

    if (x > 0) {
        if (recordMoves[x - 1][y] != 0) return console.log(true); // Top
        if (y > 0 && recordMoves[x - 1][y - 1] != 0) return console.log(true); // Left - Top
        if (y + 1 < boardSize && recordMoves[x - 1][y + 1] != 0)
            return console.log(true); // Right - Top
    }

    if (x + 1 < boardSize) {
        if (recordMoves[x + 1][y] != 0) return console.log(true); // Bottom
        if (y > 0 && recordMoves[x + 1][y - 1] != 0) return console.log(true); // Left - Bottom
        if (y + 1 < boardSize && recordMoves[x + 1][y + 1] != 0)
            return console.log(true); // Right - Bottom
    }
    return console.log(false);
}
