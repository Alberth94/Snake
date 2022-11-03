let nrLines;
let nrColumns;
let difficulty;
let board = [];
let points = 0;
let snakeBody = [
    [0, 0],
    [0, 1],
    [0, 2],
];
let headLine = 0;
let headColumn = 3;
let interval;
let speed;
let foodLine;
let foodColumn;
let snakeGrow = false;
let win = false;
let lost = false;

//Arrow keys keyboard index.
const keys = {
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

//Sounds
let appleBiteSound = new Audio('./Sounds/AppleBite.mp3');
let upSound = new Audio('./Sounds/Up.mp3');
let downSound = new Audio('./Sounds/Down.mp3');
let leftSound = new Audio('./Sounds/Left.mp3');
let rightSound = new Audio('./Sounds/Right.mp3');
let wallHit = new Audio('./Sounds/WallHit.mp3');
let winSound = new Audio('./Sounds/winSound.mp3');

function startGame(difficulty) {
    if (difficulty === "easy") {
        nrLines = 10;
        nrColumns = 10;
        speed = 250;
    } else if (difficulty === "medium") {
        nrLines = 18;
        nrColumns = 18;
        speed = 170;
    } else if (difficulty === "hard") {
        nrLines = 18;
        nrColumns = 18;
        speed = 100;
    }
    createBoard(nrLines, nrColumns);
    document.getElementById("difficultyBtns").remove();
}

function createBoard(nrLines, nrColumns) {
    let matBoard = document.getElementById("gameBoard");
    for (let l = 0; l < nrLines; ++l) {
        board[l] = document.createElement('tr');
        matBoard.append(board[l]);
        for (let c = 0; c < nrColumns; ++c) {
            board[l][c] = document.createElement('td');
            board[l][c].innerText = "";
            board[l][c].value = 0;
            board[l][c].style = "background-color: #FCBA12";
            board[l].append(board[l][c]);
        }
    }
    displaySnake();
    placeFood();
    updateScore();
}

function displaySnake() {
    if (endGame()) {
        return;
    } 
    snakeBody.push([headLine, headColumn]);
    for (let i = 0; i < snakeBody.length; ++i) {
        let x = snakeBody[i][0];
        let y = snakeBody[i][1];
        board[x][y].style = "background-color: green"; //Snake color.
        board[headLine][headColumn].style = "background-color: DarkSlateGrey"
    }
    if (checkAppleEaten()) {
        snakeGrow = false;
        return;
    }
    x = snakeBody[0][0];
    y = snakeBody[0][1];
    board[x][y].style = "background-color: #FCBA12"; //Board color.
    snakeBody.shift();
}

window.addEventListener("keydown", function arrowKeys(e) {
    if (endGame() === false) {
        switch (e.keyCode) {
            case keys.left:
                leftSound.play();
                moveLeft();
                break;
            case keys.up:
                upSound.play();
                moveUp();
                break;
            case keys.right:
                rightSound.play();
                moveRight();
                break;
            case keys.down:
                downSound.play();
                moveDown();
                break;
        }
    }
});

function moveLeft() {
    headColumn--;
    clearInterval(interval);
    interval = setInterval(moveLeft, speed);
    displaySnake();
}

function moveUp() {
    headLine--;
    clearInterval(interval);
    interval = setInterval(moveUp, speed);
    displaySnake();
}

function moveRight() {
    headColumn++;
    clearInterval(interval);
    interval = setInterval(moveRight, speed); 
    displaySnake();
}

function moveDown() {
    headLine++;
    clearInterval(interval);
    interval = setInterval(moveDown, speed);
    displaySnake();
}

function placeFood() {
    foodLine = Math.floor(Math.random() * nrLines);
    foodColumn = Math.floor(Math.random() * nrColumns);
    let color =  document.createElement('div');
    color.style = "background-color: #FCBA12";
    if (board[foodLine][foodColumn].style.backgroundColor === color.style.backgroundColor) {//Based on the color of the board, I display the apple so that it is not placed over the snake.
        board[foodLine][foodColumn].innerText = "🍎";
    } else {
        placeFood();
    }
}

function checkAppleEaten() {
    if (headLine === foodLine && headColumn === foodColumn) {
        appleBiteSound.play();
        ++points;
        board[foodLine][foodColumn].innerText = "";
        updateScore();
        if(snakeBody.length < nrLines * nrColumns){
            placeFood();
        }
        snakeGrow = true;
    }
    return snakeGrow;
}

function endGame() {
    let snakeTailColor = document.createElement("div");
    snakeTailColor.style = "background-color: green";
   if (headLine === nrLines || headColumn === nrColumns || headColumn === -1 || headLine === -1 ||
        board[headLine][headColumn].style.backgroundColor === snakeTailColor.style.backgroundColor) {//Based on the color of the snake, I check if it hit itself.
        wallHit.play();
        lost = true;
        winOrLose();
        return lost;
    } else if (snakeBody.length === nrLines * nrColumns) {
        win = true;
        winOrLose();
        return win;
    } 
    return false;   
}

function winOrLose() {
    if (win) {
        winSound.play();
        document.getElementById("endGame").innerText = "You won! You got " + points + " points."
    } else if (lost) {
        document.getElementById("endGame").innerText = "You Los! You got " + points + " points."
    }
    clearInterval(interval);
    updateScore();
}

function updateScore() {
    let score = document.getElementById("score");
    score.innerText = "You have eaten " + points + " 🍎";
}

function play() {
    appleBiteSound.play();
    upSound.play();
    downSound.play();
    leftSound.play();
    rightSound.play();
    wallHit.play();
    winSound.play();
}

function restartGame() {
    window.location.reload();
}
