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

    return {resetBoard, logBoard, decideGameState, placeItem};

})();


const createPlayer = ((name) => {
    let score = 0;
    
    const scoreIncrement = () => score += 1;

    const scoreReset = () => score = 0;

    return {scoreIncrement, scoreReset, name};

})();


const domHandler = (() => {

    // create dialog template
    const dialog = document.createElement("dialog");

    const para = document.createElement("div");
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
    })


    const btn2Event1 = () => {
        link2YT.click();
        btn2.setAttribute("title", "Did you finish the tutorial?");
        btn2.disabled = true;
    };

    const btn1Event1 = () => {
        domHandler.modeSelectorDOM();
    };

    const btn2Event2 = () => {
        
    }

    const nameForm = document.createElement("form");
    nameForm.setAttribute("method", "dialog");
    const group1 = document.createElement("div");
    const group2 = document.createElement("div");
    
    const label1 = document.createElement("label");
    const input1 = document.createElement("input");

    const label2 = document.createElement("label");
    const input2 = document.createElement("input");

    const btn1Event2 = () => {

    }

    
    const domInit = () => {
        // create headerText and main
        const header = document.createElement("h1");
        header.textContent = "TIC TAC TOE";
        header.className = "gameHeader";

        const mainPanel = document.createElement("div");
        mainPanel.className = "mainPanel";

        // init the dialog
        para.textContent = "Welcome to the Tic Tac Toe Game! Have you played it before?";

        // btn2 
        // redirects to yt tutorial
        btn2.textContent = "No, show me a tutorial";
        const link2YT = document.createElement("a");

        link2YT.setAttribute("href", "https://youtu.be/3qzcAMShotQ?si=c4J5aVYoWZtCH1mq");
        link2YT.setAttribute("target", "_blank");
        link2YT.setAttribute("rel", "noopener");

        btn2.addEventListener("click", btn2Event1);

        btn2.appendChild(link2YT);


        // btn1
        btn1.textContent = "Yes!";

        btn1.addEventListener("click", btn1Event1)


        document.body.append(header, mainPanel, dialog);

        dialog.showModal();

    }

    // const boardUpdate = () => {

    // }

    const modeSelectorDOM= () => {
        // update dialog info
        para = "Who do you wanna play with?";

        // remove link
        const link = btn2.querySelector("a");
        link.remove();

        // reset hint
        btn1.textContent = "My friend";
        btn2.textContent = "Silly (bot)";

        // remove events
        btn2.removeEventListener("click", btn2Event1);
        btn1.removeEventListener("click", btn1Event1);

        // add new events

        btn2.addEventListener("click", btn2Event2);
        btn1.addEventListener("click", btn1Event2);

    }


    return {domInit};


})();

const gameManager = (() => {
    let whosTurn = 0;


})();

domHandler.domInit();
