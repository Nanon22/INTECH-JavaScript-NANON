const caseValue = ['.', '1', '2', '3', 'B']

let minute = 0
let second = 0

let intervalId = 0;

let firstClick = true;

function Init()  {

  let gameContainer = document.querySelector('#game-container');
  let message = document.querySelector('#message');
  let counter = document.querySelector('#counter');

  gameContainer.innerText = '';
  message.innerText = '';
  counter.innerText = '0:00';
  Stop();

  minute = 0
  second = 0
  
  let dimension = (gameContainer.clientWidth / 6) - 2;
  
  gameContainer.innerHTML = '';
  for(let i = 0; i < 6; i++) {
    for(let j = 0; j < 6; j++) {
      let newDiv = document.createElement('div');

      let value = caseValue[getRandomInt(0,5)];

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
}

function Count() {
  if(second === 59) {
    minute += 1;
    second = 0
  } else {
    second += 1;
  }
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
      intervalId = setInterval(() => {
        Count();
        let counter = document.querySelector('#counter');
  
        counter.innerText = minute + ':' + (second > 9 ? second : '0' + second);
        firstClick = false;
      }, 1000);
    }
  }
  
  
  if (value === 'F') {
    
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
  } else {
    event.target.style.backgroundColor = 'white'
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
      } else if (value === '1' || value === '2' || value === '3') {
        el.innerText = value;
        el.style.backgroundColor = 'white';
      }
    }
  })
  
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

Init();