const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.result');
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let invadersId;
let moveShooterW;
let goingRight = true;
let aliensRemoved = [];
let results = 0;
let madeShoots = 0;



for(let i = 0; i < 225; i++) {
    const square = document.createElement('div');  //заполняем весь grid блоками
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'));

const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  15,16,17,18,19,20,21,22,23,24,
  30,31,32,33,34,35,36,37,38,39
];

// function randomInteger(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

function draw() {
    for(let i = 0; i < alienInvaders.length; i++){
        if(!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader');  //add aliens
        }
    }
}

draw();

function remove() {
    for(let i = 0; i < alienInvaders.length; i++){
        squares[alienInvaders[i]].classList.remove('invader');  //remove aliens
    }
}

squares[currentShooterIndex].classList.add('shooter');

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter');
    switch (e.key) {
        case 'ArrowLeft':
            if(currentShooterIndex % width !== 0) currentShooterIndex -= 1 // пока остаток от деления не равен 0
            break
        case 'ArrowRight':
            if(currentShooterIndex % width < width -1) currentShooterIndex += 1  //пока остаток от деления меньше 0
            break
    }
    squares[currentShooterIndex].classList.add('shooter');
}

document.addEventListener('keydown', moveShooter);

function moveShooterWinner(){
    if(currentShooterIndex % width !== 0){
        squares[currentShooterIndex].classList.remove('shooter');
        currentShooterIndex -= width;
        squares[currentShooterIndex].classList.add('shooter');
    }
}

function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length -1] % width === width -1;
    remove();

    if(rightEdge && goingRight) {

        for(let i = 0; i < alienInvaders.length; i++){
            alienInvaders[i] += width +1;
            direction = -1;
            goingRight = false;
        }
    }

    if(leftEdge && !goingRight) {
        for(let i = 0; i < alienInvaders.length; i++){
            alienInvaders[i] += width -1;
            direction = 1;
            goingRight = true;
        }
    }

    for(let i = 0; i < alienInvaders.length; i++){
       alienInvaders[i] += direction;
    }

    draw();

    if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        console.log('crash')
        resultsDisplay.innerHTML = `GAME OVER! SCORE IS ${results}. TOTAL ${madeShoots} SHOTS MADE`;
        squares[currentShooterIndex].classList.remove('shooter');
        clearInterval(invadersId)
    }

    for(let i = 0; i < alienInvaders.length; i++){
        if(alienInvaders[i] > (squares.length)) {
            resultsDisplay.innerHTML = `GAME OVER! SCORE IS ${results}. TOTAL ${madeShoots} SHOTS MADE`;
            squares[currentShooterIndex].classList.remove('shooter');
            clearInterval(invadersId)
        }
    }

    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = `YOU WIN! SCORE IS ${results}`;
        clearInterval(invadersId);
        moveShooterW = setInterval(moveShooterWinner, 100)
    }
}

invadersId = setInterval( moveInvaders, 500);




function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex;

    function moveLaser() {
        if(squares[currentLaserIndex].classList.contains('laser')) squares[currentLaserIndex].classList.remove('laser');
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add('laser');

        if(squares[currentLaserIndex].classList.contains('invader')) {    //hit an alien
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');

            setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserId);

            const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultsDisplay.innerHTML = `SCORE: ${results}`
        }
    }
    switch (e.code) {
        case 'Space':
            laserId = setInterval(moveLaser, 100)
            madeShoots++;
    }
}

document.addEventListener('keydown', shoot);