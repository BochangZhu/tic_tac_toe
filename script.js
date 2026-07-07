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


})
