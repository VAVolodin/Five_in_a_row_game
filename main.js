//  -- clear all --
// document.write("")
//let opened = window.open("");

        // clear document
// document.body.innerHTML = "";
        // create parent DOM
        document.write(
            '<html><head><link rel="shortcut icon" href="https://media.flaticon.com/dist/min/img/favicon.ico"/><title>Five in a row</title></head><body><header><h1>Five in a row gamE</h1><button>Let\'s start</button></header></body></html>'
        );
                // DOM styling
        const header = document.querySelector("header");
        header.style.display = "flex";
        header.style.flexDirection = "column";
        header.style.justifyContent = "space-around";
        header.style.alignItems = "center";
        header.style.borderBottom = "0.5em solid gray";
        header.style.marginBottom = "2em";
        header.parentNode.style.background = "#fce3ff";
        
        const btn = document.querySelector("button");
        btn.style.width = "20em";
        btn.style.height = "3em";
        btn.style.background = "#d2c2fd";
        btn.style.borderRadius = "0.3em";
        btn.style.borderColor = "#b39afd";
        btn.style.cursor = "pointer";
        btn.style.marginBottom = "2em";
        btn.style.fontWeight = "bold";
        
        const board = document.createElement("div");
        board.style.margin = "0 auto";
        board.style.display = "flex";
        board.style.justifyContent = "space-evenly";
        board.style.flexWrap = "wrap";
        
        btn.addEventListener("click", createDiv);
        btn.addEventListener("click", btnActive);
        board.addEventListener("click",tikTakEl);
        
                // timer for async function
        const timer = (ms) => new Promise((res) => setTimeout(res, ms));

        let easy = 10,
            normal = 15,
            profi = 20
            userMove =1;
        
                //creating a Board by immediately adding non-displayable boxes and smoothly bubbling it after that
        async function createDiv(difficulty = normal) {
            userMove = 1;
            btn.removeEventListener("click", createDiv);
            btn.textContent = "Restart"
            let docWidth = document.documentElement.clientWidth;
            let boardSize = docWidth > 1200 ? "67vh" : "53.4vw";
            board.style.width = board.style.height =  boardSize;
            document.body.appendChild(board);

            for (let i = 1; i <= 225; i++) {
                    addBox(i)
            }
                    //  bubbling
            let boxes = Array.from(document.body.querySelector("div").querySelectorAll("div"))
            for (let j = k = 0; j <= 0.5 ; k++, j += 0.5/(boxes.length-1)) {
                boxes[k].style.opacity = `1`;
                boxes[k].style.transition = "all 0.3s ease 0s";
                board.style.boxShadow = `0 0 0 ${j}em  #babdbe`;
                await timer(0.01);
            }
            btn.addEventListener("click", restart);
        }
        
        function addBox (number){
            newDiv = document.createElement("div");
            newDiv.style.height = "6%";
            newDiv.style.width = "6%";
            newDiv.style.margin = "0.3125%";
            newDiv.style.background = "#fce3ff";
            newDiv.style.boxShadow = "0 0 0.5em #c44ed1 ";
            newDiv.style.opacity = "0";
            newDiv.classList.add(number);
            board.appendChild(newDiv);
        }
        
        function restart() {
            board.innerHTML = "";
            board.remove();
            board.style.boxShadow = "0 0 0 0";
            btn.removeEventListener("click", restart);
            createDiv();
        }
        
        function btnActive(event) {
            event.target.style.backgroundColor = "#0096a5";
            setTimeout(() => {
                event.target.style.backgroundColor = "#d2c2fd";
            }, 10);
        }
        
        function tikTakEl (event){
            if (!event.target.className){alert("You miss pal! Let's try again."); return;}
            const chip = new Image();
            chip.src =  (userMove)? "green_chip.svg" : "red_chip.svg";
            userMove = (userMove)? 0 : 1;
            event.target.appendChild(chip)
            // alert(`target = ${this.tagName} \n number = ${ event.target.className}` );
        
        }