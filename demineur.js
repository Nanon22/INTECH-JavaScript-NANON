const caseValue = ['.', '1', '2', '3', 'B']

function Init()  {
  let gameContainer = document.querySelector('#game-container');

  gameContainer.innerText = '';
  
  let dimension = (gameContainer.clientWidth / 15) - 2;
  
  gameContainer.innerHTML = '';
  for(let i = 0; i < 15; i++) {
    for(let j = 0; j < 15; j++) {
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

function addFlag(event) {
  event.target.setAttribute('data-value', 'F')
  event.target.innerText = 'F'
  event.target.style.color = 'red';
  event.preventDefault();
}

function discoverOnClick(event) {
  let value = event.target.dataset.value
  event.target.innerText = value
  
  
  if (value === 'F') {
    
  } else if(value === 'B') {

    let gameContainer = document.querySelector('#game-container');

    gameContainer.childNodes.forEach(element => {
      let elementValue = element.dataset.value;
      element.innerText = elementValue;
      if (elementValue === 'F') {
        element.style.color = 'red';
        element.style.backgroundColor = 'white'
      } else if (elementValue === 'B') {
        element.style.backgroundColor = 'red'
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

function discoverAdjacentCase(element) {
  let pos = element.dataset.pos.split(' ');
  let X = parseInt(pos[0]);
  let Y = parseInt(pos[1]);

  let adjacents = [
    document.querySelector("[data-pos='" + (X - 1) + " " + (Y - 1) + "']"),
    document.querySelector("[data-pos='" + (X - 1) + " " + (Y) + "']"),
    document.querySelector("[data-pos='" + (X - 1) + " " + (Y + 1) + "']"),
    document.querySelector("[data-pos='" + (X) + " " + (Y - 1) + "']"),
    document.querySelector("[data-pos='" + (X) + " " + (Y) + "']"),
    document.querySelector("[data-pos='" + (X) + " " + (Y + 1) + "']"),
    document.querySelector("[data-pos='" + (X + 1) + " " + (Y - 1) + "']"),
    document.querySelector("[data-pos='" + (X + 1) + " " + (Y) + "']"),
    document.querySelector("[data-pos='" + (X + 1) + " " + (Y + 1) + "']"),
  ];

  console.log(X + " " + Y );
  console.dir(adjacents);

  for(let i = 0; i < adjacents.length; i++) {
    let el = adjacents[i];
    if(el != null) {
      let value = el.dataset.value

      if(value === '.') {
        el.style.backgroundColor = 'white';
        el.innerText = value;
        discoverAdjacentCase(el);
      } else if (value === '1' || value === '2' || value === '3') {
        el.innerText = value;
        el.style.backgroundColor = 'white';
      }
    }
  }
  
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

Init();