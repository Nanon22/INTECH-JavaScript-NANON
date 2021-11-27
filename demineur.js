const easy = ['.', '.', '.', '.', '.', 'B']
const medium = ['.', '.', '.', '.', '.', 'B', 'B']
const hard = ['.', '.', '.', '.', '.', 'B', 'B', 'B']

let easySize = 4
let mediumSize = 8
let hardSize = 12

let minute = 0
let second = 0

let intervalId = 0;

let firstClick = true;

function Init()  {
  let gameContainer = document.querySelector('#game-container');
  let gameLevel = document.querySelector('#level');
  let message = document.querySelector('#message');
  let counter = document.querySelector('#counter');

  let level = null
  let size = null

  if (gameLevel.value === "1") {
    level = easy
    size = easySize
  } else if (gameLevel.value === "2") {
    level = medium
    size = mediumSize
  } else {
    level = hard
    size = hardSize
  }
  gameContainer.innerText = '';
  message.innerText = '';
  counter.innerText = '0:00';
  Stop();

  minute = 0
  second = 0
  
  let dimension = (gameContainer.clientWidth / size) - 2;
  
  for(let i = 0; i < size; i++) {
    for(let j = 0; j < size; j++) {
      let newDiv = document.createElement('div');

      let value = level[getRandomInt(0,level.length)];

      newDiv.setAttribute('data-value', value);
      newDiv.setAttribute('data-pos', i + ' ' + j);
      
      newDiv.style.minHeight = dimension + 'px';
      newDiv.style.minWidth = dimension + 'px';
      newDiv.style.border = '1px yellow solid';
      newDiv.style.backgroundColor = 'lightgray';

      newDiv.addEventListener("click", discoverOnClick);
      newDiv.addEventListener('contextmenu', addFlag);
      
      gameContainer.insertAdjacentElement('beforeend', newDiv)
    }
  }

  gameContainer.childNodes.forEach(element => {
    bombsAround(element);
  })
}

function bombsAround(element) {
  if(element.dataset.value === 'B') return
  let pos = element.dataset.pos.split(' ');
  let X = parseInt(pos[0]);
  let Y = parseInt(pos[1]);

  let bombs = 0;

  let adjacents = [
    document.querySelector("[data-pos='" + (X - 1) + " " + (Y - 1) + "']"),
    document.querySelector("[data-pos='" + (X - 1) + " " + (Y) + "']"),
    document.querySelector("[data-pos='" + (X - 1) + " " + (Y + 1) + "']"),
    document.querySelector("[data-pos='" + (X) + " " + (Y - 1) + "']"),
    document.querySelector("[data-pos='" + (X) + " " + (Y + 1) + "']"),
    document.querySelector("[data-pos='" + (X + 1) + " " + (Y - 1) + "']"),
    document.querySelector("[data-pos='" + (X + 1) + " " + (Y) + "']"),
    document.querySelector("[data-pos='" + (X + 1) + " " + (Y + 1) + "']"),
  ];

  adjacents.forEach(el => {
    if(el != null) {
      let value = el.dataset.value

      if(value === 'B') {
        bombs++;
      } 
    }
  });

  element.setAttribute('data-value', bombs === 0 ? '.' : '' + bombs) ;
}

function Count() {
  if(second === 59) {
    minute += 1;
    second = 0
  } else {
    second += 1;
  }
}

function Start() {
  Count();
  let counter = document.querySelector('#counter');

  counter.innerText = minute + ':' + (second > 9 ? second : '0' + second);
  firstClick = false;
}

function Stop() {
  firstClick = true;
  clearInterval(intervalId);
}

function addFlag(event) {
  event.target.setAttribute('data-value', 'F')
  event.target.innerText = 'F'
  event.target.style.color = 'red';
  event.preventDefault();
}

function discoverOnClick(event) {
  let value = event.target.dataset.value
  event.target.innerText = value

  if(firstClick) {
    if(value != 'B') {
      Start();
      intervalId = setInterval(() => {
        Start()
      }, 1000);
    } 
  }
  
  
  if (value === 'F') {
    victotyAction();
  } else if(value === 'B') {
    
    Stop()

    let gameContainer = document.querySelector('#game-container');

    gameContainer.childNodes.forEach(element => {
      let elementValue = element.dataset.value;
      element.innerText = elementValue;
      if (elementValue === 'F') {
        element.style.color = 'red';
        element.style.backgroundColor = 'white'
      } else if (elementValue === 'B') {
        element.style.backgroundColor = 'red'
        clearInterval()
      } else {
        element.style.backgroundColor = 'white'
      }
    })
    let message = document.querySelector('#message');

    message.innerText = 'Perdu ☹️';
  } else if (value === '.') {
    discoverAdjacentCase(event.target);
    victotyAction();
  } else {
    event.target.style.backgroundColor = 'white'
    victotyAction();
  }

  
}

function victotyAction() {
  if(Won()) {
    let message = document.querySelector('#message');

    message.innerText = 'Bravo, vous avez gagné ! 🎉';
  }
}

function discoverAdjacentCase(element, passed=[]) {
  passed.push(element);

  element.style.backgroundColor = 'white';
  element.innerText = element.dataset.value;

  let pos = element.dataset.pos.split(' ');
  let X = parseInt(pos[0]);
  let Y = parseInt(pos[1]);

  let adjacents = [
    document.querySelector("[data-pos='" + (X - 1) + " " + (Y - 1) + "']"),
    document.querySelector("[data-pos='" + (X - 1) + " " + (Y) + "']"),
    document.querySelector("[data-pos='" + (X - 1) + " " + (Y + 1) + "']"),
    document.querySelector("[data-pos='" + (X) + " " + (Y - 1) + "']"),
    document.querySelector("[data-pos='" + (X) + " " + (Y + 1) + "']"),
    document.querySelector("[data-pos='" + (X + 1) + " " + (Y - 1) + "']"),
    document.querySelector("[data-pos='" + (X + 1) + " " + (Y) + "']"),
    document.querySelector("[data-pos='" + (X + 1) + " " + (Y + 1) + "']"),
  ];

  adjacents.forEach(el => {
    if(el != null && !passed.includes(el)) {
      let value = el.dataset.value

      if(value === '.') {
        discoverAdjacentCase(el, passed);
      } else if (value !== 'B' && value !== 'F') {
        el.innerText = value;
        el.style.backgroundColor = 'white';
      }
    }
  })
}

function Won() {
  let gameContainer = document.querySelector('#game-container');
  for(let i = 0; i < gameContainer.childNodes.length; i++) {
    if(gameContainer.childNodes[i].dataset.value !== 'B' && gameContainer.childNodes[i].dataset.value !== 'F' && gameContainer.childNodes[i].innerText === '') {
      return false
    }
  }
  return true
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

Init();