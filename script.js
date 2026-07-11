const gameBoard = (() => {
    // 2d storage arr
    let boardMatrix = Array.from({length : 3}, ()=>Array.from({length : 3}, () => -1));

    // reset board with empty slots
    function resetBoard(){
        boardMatrix = Array.from({length : 3}, ()=>Array.from({length : 3}, () => -1));
    }

    // debugging
    function logBoard(){
        for (const row of boardMatrix) {
            console.log(row);
        }
    }
    
    const retBoard = () => boardMatrix;

    // p1 => 0, p2 => 1, draw => 3, unfinished => 4
    function decideGameState(){
        // row check
        for (const row of boardMatrix){
            if (row[0] == row[1] && row[1] == row[2] && row[0] >= 0){
                if (row[0] == 0) return 0;
                else return 1;
            }
        }

        // col check
        for (let i = 0; i < 3; i++) {
            if (boardMatrix[0][i] == boardMatrix[1][i] && boardMatrix[0][i] == boardMatrix[2][i] && boardMatrix[0][i] >= 0){
                if (boardMatrix[0][i] == 0) return 0;
                else return 1;
            }
        }

        // diagonal check

        if (boardMatrix[0][0] == boardMatrix[1][1] && boardMatrix[0][0] == boardMatrix[2][2] && boardMatrix[0][0] >= 0){
            if (boardMatrix[0][0] == 0) return 0;
            else return 1; 
        }

        if (boardMatrix[0][2] == boardMatrix[1][1] && boardMatrix[0][2] == boardMatrix[2][0] && boardMatrix[0][2] >= 0){
            if (boardMatrix[0][2] == 0) return 0;
            else return 1; 
        }

        // draw check
        for (const row of boardMatrix){
            for (const code of row){
                if (code == -1) return 4;
            }
        }

        return 3;
    }

    // put literal to arr position
    function placeItem(itemCode, pos){
        const [row, col] = pos;
        boardMatrix[row][col] = itemCode;
    }

    return {resetBoard, logBoard, decideGameState, placeItem, retBoard};

})();


const createPlayer = (name) => {
    let score = 0;
    let pName = name;

    const scoreIncrement = () => score += 1;

    const scoreReset = () => score = 0;

    const scoreRet = () => score;

    const changeName = (newName) => pName = newName;
    
    const retName = () => pName;

    return {scoreIncrement, scoreReset, scoreRet, changeName, retName};

};


const domHandler = (() => {
    // special items

    const link2YT = document.createElement("a");

    const mainPanel = document.createElement("div");

    const boardDIV = document.createElement("div");


    link2YT.setAttribute("href", "https://youtu.be/3qzcAMShotQ?si=c4J5aVYoWZtCH1mq");
    link2YT.setAttribute("target", "_blank");
    link2YT.setAttribute("rel", "noopener");

    // create dialog template
    const dialog = document.createElement("dialog");

    let para = document.createElement("div");
    para.className = "para";

    const btns = document.createElement("div");
    btns.className = "btns";

    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");

    btns.append(btn1, btn2);

    dialog.append(para, btns);

    // mandatory
    dialog.addEventListener("cancel", (e)=>{
        e.preventDefault();
    });


    const btn2Event1 = () => {
        link2YT.click();
        btn2.setAttribute("title", "Did you finish the tutorial?");
        btn2.disabled = true;
    };

    const btn1Event1 = () => {
        domHandler.modeSelectorDOM();
    };


    const nameForm = document.createElement("form");
    nameForm.setAttribute("method", "dialog");
    const group1 = document.createElement("div");
    const group2 = document.createElement("div");

    const label1 = document.createElement("label");
    label1.textContent = "Enter P1's Name: "
    label1.setAttribute("for", "p1");
    const input1 = document.createElement("input");
    input1.type = "text";
    input1.id = "p1";
    input1.required = true;
    input1.name = "p1";
    input1.pattern = ".{0,10}";
    input1.setAttribute("name", "p1");

    const label2 = document.createElement("label");
    label2.textContent = "Enter P2's Name: ";
    label2.setAttribute("for", "p2");
    const input2 = document.createElement("input");
    input2.type = "text";
    input2.id = "p2";
    input2.required = true;
    input2.name = "p2";
    input2.pattern = ".{0,10}";
    input2.setAttribute("name", "p2");

    group1.append(label1, input1);
    group2.append(label2, input2);

    const submit = document.createElement("button");
    submit.textContent = "We're ready!";

    nameForm.append(group1, group2, submit);

    nameForm.style.display = "none";

    const startGameEvent = (event) => {
        // gather return val from btn val
        const modeStr = dialog.returnValue;
        if (modeStr == "bot") gameManager.toggleMode();
        const data = new FormData(nameForm);
        gameManager.assignPlayer(1, createPlayer(data.get("p1")));
        gameManager.assignPlayer(2, createPlayer(data.get("p2")));
        // render board
        domHandler.boardReset();
    };

    const btn1Event2 = () => {
        // 
        submit.value = "friend";
        // show name entry form
        nameForm.style.display = "";
        // allow input 2 for p2 name
        input2.readOnly = false;
        input2.value = "";

        dialog.addEventListener("close", startGameEvent);
    }

    const btn2Event2 = () => {
        submit.value = "bot";
        nameForm.style.display = "";
        input2.readOnly = true;
        input2.value = "Silly(bot)";

        dialog.addEventListener("close", startGameEvent);
        
    }


    const domInit = () => {
        // create headerText and main
        const header = document.createElement("h1");
        header.textContent = "TIC TAC TOE";
        header.className = "gameHeader";

        mainPanel.className = "mainPanel";

        // init the dialog
        para.textContent = "Welcome to the Tic Tac Toe Game! Have you played it before?";

        // btn2 
        // redirects to yt tutorial
        btn2.textContent = "No, show me a tutorial";

        btn2.addEventListener("click", btn2Event1);

        btn2.appendChild(link2YT);


        // btn1
        btn1.textContent = "Yes!";

        btn1.addEventListener("click", btn1Event1)

        const icon = document.createElement("img");
        icon.src = "./asset/tic-icon.png";
        icon.alt = "icon";
        icon.className = "icon";
        document.body.append(header, mainPanel, dialog, icon);

        dialog.showModal();

    }

    // global node for board
    const p2Score = document.createElement("span");

    const p1Score = document.createElement("span");

    const p2Name = document.createElement("span");

    const p1Name = document.createElement("span");

    const hisBoard = document.createElement("div");

    const scoreBoard = document.createElement("div");

    const boardReset = () => {
        // 1st time init board
        if (!mainPanel.querySelector('.boardDIV')) {
            // insert scoreBoard
            boardDIV.className = "boardDIV";

            let index = 0;

            for (const row of gameBoard.retBoard()){
                for (const code of row){
                    const tempCell = document.createElement("div");
                    tempCell.id = index;
                    tempCell.className = "cell";
                    boardDIV.appendChild(tempCell);
                    index += 1;
                }
            }
            mainPanel.appendChild(boardDIV);

            // insert scoreBoard
            scoreBoard.className = "scoreBoard";

            const title = document.createElement("div");
            title.textContent = "Live Score";
            title.className = "scoreTitle";

            const names = gameManager.retNameLst();
            p1Name.textContent = names[0];
            p2Name.textContent = names[1];
            p1Score.textContent = "0";
            p2Score.textContent = "0";

            scoreBoard.append(title, p1Name, p1Score, p2Name, p2Score);

            mainPanel.appendChild(scoreBoard);

            // insert historyBoard

            hisBoard.className = "hisBoard";
            const hisTitle = document.createElement("div");
            hisTitle.className = "hisTitle";
            hisTitle.textContent = "History";
            hisBoard.appendChild(hisTitle);
            mainPanel.appendChild(hisBoard);
        }

        // reset
        else {
            const boardDIV = mainPanel.querySelector(".boardDIV");
            Array.from(boardDIV.children).forEach(cell => {
                cell.className = "cell";
                const cellSVG = cell.querySelector(".svg");
                if (cellSVG) cellSVG.remove();
            });
        }
    }

    const cellDisplayUpdate = (pos) => {
        const turn = gameManager.getTurn();
        const target = boardDIV.children[pos];

        if (turn == "1"){
            const svgO = document.createElement("img");
            svgO.className = "svg O";
            svgO.src = "./asset/circleIcon.svg";
            target.appendChild(svgO);
        }
        else {
            const svgX = document.createElement("img");
            svgX.className = "svg X";
            svgX.src = "./asset/crossIcon.svg";
            target.appendChild(svgX);
        }

        target.classList.add("placed");

    };

    const modeSelectorDOM = () => {

        dialog.appendChild(nameForm);

        // update dialog info
        para.textContent = "Who do you wanna play with?";

        // remove link
        const link = btn2.querySelector("a");
        link.remove();

        // reset hint
        btn1.textContent = "My friend";
        btn2.textContent = "Silly (bot)";

        // remove events
        btn2.removeEventListener("click", btn2Event1);
        btn1.removeEventListener("click", btn1Event1);

        // restore from leftover state
        btn2.disabled = false;

        // add new events
        btn2.addEventListener("click", btn2Event2);
        btn1.addEventListener("click", btn1Event2);

    }

    const notifyTurn = () => {
        const target;
        const symbol;

        if (gameManager.getTurn() == 1){
            target = gameManager.retNameLst[0];
            symbol = "O";
        }
        else {
            target = gameManager.retNameLst[1];
            symbol = "X";
        }
        
        const turnDIV = document.createElement("div");
        turnDIV.setAttribute("active","");
        turnDIV.className = "turn";
        turnDIV.textContent = "It's " + target + "'s turn, place your " + symbol + "!";
        
        hisBoard.appendChild(turnDIV);
    }

    const updateScoreDisplay = () => {
        const [p1, p2] = gameManager.retScoreLst();
        p1Score.textContent = p1;
        p2Score.textContent = p2;
    }
    return {domInit, modeSelectorDOM, boardReset, cellDisplayUpdate};


})();

const gameManager = (() => {

    let whosTurn = 1; // 1 -> p1; -1 -> p2
    let gameMode = 1; // 1 -> pvp; -1 -> bot mode

    let player1;
    let player2;

    const toggleTurn = () => whosTurn *= -1;

    const toggleMode = () => gameMode *= -1;

    const getTurn = () => whosTurn;

    const getMode = () => gameMode;

    const assignPlayer = (which, obj) => {
        if (which == 1) {
            player1 = obj;
        }
        else player2 = obj;
    };

    const retNameLst = () => [player1.retName(), player2.retName()];

    const retScoreLst = () => [player1.scoreRet(), player2.scoreRet()];

    return {toggleTurn, toggleMode, getTurn, getMode, assignPlayer, retNameLst, retScoreLst};

})();

domHandler.domInit();
