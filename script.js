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

    // ret: p1 => 0, p2 => 1, draw => 3, unfinished => 4; highlighted cell pos list
    function decideGameState(){
        // row check
        for (let row = 0; row < 3; row++){
            const temp = boardMatrix[row];
            if (temp[0] == temp[1] && temp[1] == temp[2] && temp[0] >= 0){
                return [temp[0], [row*3, row*3 + 1, row*3 + 2]];
            }
        }

        // col check
        for (let i = 0; i < 3; i++) {
            if (boardMatrix[0][i] == boardMatrix[1][i] && boardMatrix[0][i] == boardMatrix[2][i] && boardMatrix[0][i] >= 0){
                return [boardMatrix[0][i], [i, 3 + i, 6 + i]];
            }
        }

        // diagonal check

        if (boardMatrix[0][0] == boardMatrix[1][1] && boardMatrix[0][0] == boardMatrix[2][2] && boardMatrix[0][0] >= 0){
            return [boardMatrix[0][0], [0, 4, 8]];
        }

        if (boardMatrix[0][2] == boardMatrix[1][1] && boardMatrix[0][2] == boardMatrix[2][0] && boardMatrix[0][2] >= 0){
            return [boardMatrix[0][2], [2, 4, 6]];
        }

        // draw check
        for (const row of boardMatrix){
            for (const code of row){
                if (code == -1) return [4, []];
            }
        }

        return [3, []];
    }

    // put literal to arr position
    function placeItem(itemCode, row, col){
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

    let round = 1;

    const clearActiveHistory = () =>{
        const active = hisBoard.querySelector("[active]");
        if (active){
            active.removeAttribute("active");
        }
        const notiLst = hisBoard.children;
        if (notiLst.length == 5){
            notiLst[1].remove();
        }
    }

    const boardReset = () => {
        // 1st time init board
        if (!mainPanel.querySelector('.boardDIV')) {
            // insert gameBoard
            boardDIV.className = "boardDIV";

            let index = 0;

            // insert cell based on Board size
            for (const row of gameBoard.retBoard()){
                for (const code of row){
                    const tempCell = document.createElement("div");
                    tempCell.id = index;
                    tempCell.className = "cell";

                    tempCell.addEventListener("click", (event)=>{
                        const mode = gameManager.getMode();
                        // "frontend" update
                        const id = event.target.id;
                        domHandler.cellDisplayUpdate(id);

                        // noti move
                        const [row, col] = [Math.floor(id / 3), id % 3];
                        let turn = gameManager.getTurn();
                        domHandler.notifyDecision(row, col, turn);

                        // backend
                        const code = (turn == 1) ? 0 : 1;
                        gameBoard.placeItem(code, row, col);
                        const gameState = gameBoard.decideGameState()[0];

                        // switch turn
                        gameManager.toggleTurn();
                        // if one wins or draw, noti win -> update  score -> reset board mat -> clear boardDIV display
                        if (gameState != 4) {
                            const highlight = gameBoard.decideGameState()[1];
                            // highlight winning cells if any
                            for (const pos of highlight){
                                boardDIV.children[pos].classList.add("highlight");
                            }
                            boardDIV.classList.add("locked");
                            setTimeout(() =>{
                                domHandler.boardReset();
                                domHandler.notifyTurn();
                                boardDIV.classList.remove("locked");
                                // bot mode handling
                                turn = gameManager.getTurn();
                                // fake click simulation
                                if (turn == -1 && mode == -1) {
                                    boardDIV.classList.add("locked");
                                    domHandler.botNoti();
                                    
                                    async function botSimulation(){
                                        const rand = (Math.random() * 2.5 + 2) * 1000;
                                        await new Promise(resolve => setTimeout(() => resolve(), rand));
                                        const availPos = [];
                                        const board = gameBoard.retBoard();
                                        for (let i = 0; i < 3; i++){
                                            for (let j = 0; j < 3; j++){
                                                if (board[i][j] == -1){
                                                    availPos.push(i*3 + j);
                                                }
                                            }
                                        }
                                        // pick a pos from
                                        const choice = Math.random
                                        boardDIV.classList.remove("locked");

                                    };
                                    thinkSimulation();
                                }
                            }, 3000);
                            domHandler.notifyWin(gameState);
                            // scoreBoard update
                            domHandler.updateScoreDisplay();
                            // backend reset
                            gameBoard.resetBoard();
                            // exchange first hand
                            turn = gameManager.getTurn();
                            if (round % 2 == 0) {
                                if (turn == -1) gameManager.toggleTurn();
                            }
                            else {
                                if (turn == 1) gameManager.toggleTurn();
                            }
                            round += 1;
                        }
                    });

                    boardDIV.appendChild(tempCell);
                    index += 1;
                }
            }

            mainPanel.appendChild(boardDIV);

            // insert scoreBoard
            scoreBoard.className = "scoreBoard";

            const title = document.createElement("div");
            title.textContent = "Score";
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

            // insert resetScore icon
            const resetIcon = document.createElement("img");
            resetIcon.className = "reset";
            resetIcon.alt = "reset score";
            resetIcon.src = "./asset/resetIcon.svg";
            resetIcon.addEventListener("click", () =>{
                dialog.removeEventListener("close", startGameEvent);
                para.textContent = "Reset scores for both players?";
                btn1.textContent = "Confirm";
                btn2.textContent = "Cancel";
                btn1.removeEventListener("click", btn1Event2);
                btn2.removeEventListener("click", btn2Event2);
                nameForm.remove();
                submit.remove();
                btn1.addEventListener("click", ()=>{
                    dialog.close();
                    gameManager.resetScore();
                    domHandler.updateScoreDisplay();
                });
                btn2.addEventListener("click", ()=>{
                    dialog.close();
                })
                dialog.showModal();
            });
            scoreBoard.appendChild(resetIcon);

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

        if (turn == 1){
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

    const botNoti = () => {
        clearActiveHistory();

        const botNoti = document.createElement("div");
        botNoti.className = "botNoti";
        botNoti.textContent = "Silly(bot) is thinking...";

        hisBoard.appendChild(botNoti);
    }

    const notifyTurn = () => {
        clearActiveHistory();
        let target;
        let symbol;

        if (gameManager.getTurn() == 1){
            target = gameManager.retNameLst()[0];
            symbol = "O";
        }
        else {
            target = gameManager.retNameLst()[1];
            symbol = "X";
        }
        
        const turnDIV = document.createElement("div");
        turnDIV.setAttribute("active","");
        turnDIV.className = "turn";
        turnDIV.textContent = "It's " + target + "'s turn, place your " + symbol + "!";
        
        hisBoard.appendChild(turnDIV);
    };

    const notifyDecision = (row, col, turn) => {
        clearActiveHistory();
        const decDIV = document.createElement("div");
        decDIV.setAttribute("active","");
        decDIV.className = "decision";
        let symbol;
        if (turn == 1) symbol = "O";
        else symbol = "X";
        decDIV.textContent = `${symbol} is placed at row ${row+1} and column ${col+1}.`;
        hisBoard.appendChild(decDIV);
    };

    const notifyWin = (gameState) => {
        clearActiveHistory();
        const stateDIV = document.createElement("div");
        stateDIV.setAttribute("active","");
        stateDIV.className = "state";
        let wording;
        let score;
        switch (gameState){
            case 0:
                wording = gameManager.retNameLst()[0];
                gameManager.incrementScore(0);
                score = gameManager.retScoreLst()[0];
                stateDIV.textContent = `${wording} wins! Score is ${score} now!`;
                stateDIV.classList.add("win");
                break;

            case 1:
                wording = gameManager.retNameLst()[1];
                gameManager.incrementScore(1);
                score = gameManager.retScoreLst()[1];
                stateDIV.textContent = `${wording} wins! Score is ${score} now!`;
                stateDIV.classList.add("win");
                break;

            case 3:
                stateDIV.textContent = `Draw!`;
                stateDIV.classList.add("draw");
                break;
        }
        hisBoard.appendChild(stateDIV);
    };

    const updateScoreDisplay = () => {
        const [p1, p2] = gameManager.retScoreLst();
        p1Score.textContent = p1;
        p2Score.textContent = p2;
    }
    return {domInit, modeSelectorDOM, boardReset, cellDisplayUpdate, notifyWin, updateScoreDisplay, notifyDecision, notifyTurn, botNoti};


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

    const incrementScore = (who) => {
        if (who) player2.scoreIncrement();
        else player1.scoreIncrement();
    };

    const resetScore = () => {
        player1.scoreReset();
        player2.scoreReset();
    };

    return {toggleTurn, toggleMode, getTurn, getMode, assignPlayer, retNameLst, retScoreLst, incrementScore, resetScore};

})();

domHandler.domInit();
