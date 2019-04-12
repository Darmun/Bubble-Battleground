function start() {
  // preparing game board
  const body = document.querySelector("body");
  const menuContainer = document.querySelector(".outer-menu-container");
  menuContainer.setAttribute("style", "display:none");

  const canvas = document.createElement("canvas");
  body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  // main bubble parameters
  const mainBubble = {
    minSize: 10,
    maxSize: 300,
    speedIncrement: 0.5
  };
  // idle bubble parameterss
  const idle = {
    size: 30,
    color: "rgba(30,98,206,0.3)",
    speed: 5
  };

  let bubbles = [];
  let idleBubbles = [];

  const gameStatus = {
    score: 0,
    lives: 3,
    table: document.querySelector("#game-status"),
    initGameStatus() {
      this.table.innerHTML = ` <li id='lives'>Lives: ${this.lives}</li>
  <li id='score'>Score: ${this.score}</li> `;
    },
    hideGameStatus() {
      this.table.innerHTML = ``;
    },
    resetData() {
      this.score = 0;
      this.lives = 3;
    },

    updateScore() {
      this.score++;
      document.querySelector("#score").innerHTML = `Score: ${this.score} `;
    },

    updateLives() {
      this.lives--;
      document.querySelector("#lives").innerHTML = `Lives: ${this.lives} `;
    }
  };

  class IdleBubble {
    constructor(x, y, velX, velY, color, size) {
      this.xCoordinate = x;
      this.yCoordinate = y;
      this.velX = velX;
      this.velY = velY;
      this.color = color;
      this.size = size;
    }

    draw() {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.xCoordinate, this.yCoordinate, this.size, 0, 2 * Math.PI);
      ctx.fill();
    }

    update() {
      //right side
      if (this.xCoordinate + this.size >= width) {
        this.velX = -this.velX;
      }
      //left side
      if (this.xCoordinate - this.size <= 0) {
        this.velX = -this.velX;
      }
      // bottom side
      if (this.yCoordinate + this.size >= height) {
        this.velY = -this.velY;
      }
      // top side
      if (this.yCoordinate - this.size <= 0) {
        this.velY = -this.velY;
      }

      this.xCoordinate += this.velX;
      this.yCoordinate += this.velY;
    }

    getBubbleCoords() {
      return [this.xCoordinate, this.yCoordinate];
    }
  }

  class Bubble extends IdleBubble {
    constructor(x, y, velX, velY, color, size) {
      super(x, y, velX, velY, color, size);
    }

    collisionDetect() {
      for (let j = 0; j < idleBubbles.length; j++) {
        var dx = this.xCoordinate - idleBubbles[j].xCoordinate;
        var dy = this.yCoordinate - idleBubbles[j].yCoordinate;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (
          distance < idleBubbles[j].size + this.size &&
          idleBubbles[j].size > this.size
        ) {
          bubbles.pop();
          gameStatus.updateLives();
        }
      }
    }

    reduceBubble() {
      const finalSize = this.size - 2 * mainBubble.minSize;

      let reductor = setInterval(() => {
        if (this.size <= finalSize) {
          clearInterval(reductor);
        } else {
          let reduction = (2 * mainBubble.minSize) / 5;
          this.size -= reduction;
        }
      }, 20);
    }
  }

  // RNGs
  function random(min, max) {
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
  }

  function chooseFromTwo(first, second) {
    if (Math.random() > 0.5) {
      return first;
    } else {
      return second;
    }
  }

  function loop() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);

    while (bubbles.length < 1) {
      let size = random(mainBubble.minSize, mainBubble.maxSize);
      const ball = new Bubble(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        "rgb(" +
          random(0, 255) +
          "," +
          random(0, 255) +
          "," +
          random(0, 255) +
          ")",
        50
      );
      bubbles.push(ball);
    }

    //spawn idle bubble every 2 points
    let idleBubblesCount = (gameStatus.score - 1) / 2;

    while (idleBubbles.length < idleBubblesCount) {
      const idleBubble = new IdleBubble(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + idle.size, width - idle.size),
        random(0 + idle.size, height - idle.size),
        chooseFromTwo(idle.speed * -1, idle.speed),
        chooseFromTwo(idle.speed * -1, idle.speed),
        idle.color,
        idle.size
      );
      idleBubbles.push(idleBubble);
    }
    for (let i = 0; i < idleBubbles.length; i++) {
      idleBubbles[i].draw();
      idleBubbles[i].update();
    }

    for (let i = 0; i < bubbles.length; i++) {
      bubbles[i].draw();
      bubbles[i].update();
      bubbles[i].collisionDetect();
    }

    if (gameStatus.lives > 0) {
      requestAnimationFrame(loop);
    } else {
      document.onclick = undefined;
      stopGame();
    }
  }

  window.onkeydown = function quitGame(e) {
    if (e.keyCode === 27) {
      bubbles = [];
      idleBubbles = [];
      canvas.parentNode.removeChild(canvas);
      menuContainer.setAttribute("style", "display:visible");
      gameStatus.hideGameStatus();
      handleReturn();
      window.onkeydown = undefined;
    }
  };

  document.onclick = handleClick;
  function handleClick(event) {
    let bubbleCoords = bubbles[0].getBubbleCoords();
    let cursorX = event.clientX;
    let cursorY = event.clientY;

    let dx = cursorX - bubbleCoords[0];
    let dy = cursorY - bubbleCoords[1];
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= bubbles[0].size) {
      bubbles[0].color = this.color =
        "rgb(" +
        random(0, 255) +
        "," +
        random(0, 255) +
        "," +
        random(0, 255) +
        ")";

      if (Math.random() > 0.5) {
        bubbles[0].velX *= mainBubble.speedIncrement;
      } else {
        bubbles[0].velY *= mainBubble.speedIncrement;
      }

      if (bubbles[0].size - 2 * mainBubble.minSize < mainBubble.minSize) {
        bubbles.pop();
        gameStatus.updateScore();
      } else {
        bubbles[0].reduceBubble();
      }
    }
  }

  gameStatus.initGameStatus();
  loop();

  function stopGame() {
    bubbles = [];
    idleBubbles = [];
    canvas.parentNode.removeChild(canvas);
    displayResume();
    memorizeScore(gameStatus.score);
  }

  function displayResume() {
    menuContainer.setAttribute("style", "display:visible");
    const menuContent = document.querySelector(".inner-menu-container");
    const template = document.querySelector("#template");
    gameStatus.hideGameStatus();
    menuContent.setAttribute("style", "display:none");
    template.setAttribute("style", "display:visible");
    template.innerHTML = `<div id="result"><h3>Your score:</h3>
    <p>${gameStatus.score}</p></div>
    <button id="try-again">Try again</button>
    <button id="back-to-menu">Main menu</button>`;

    const mainMenuBtn = document.querySelector("#back-to-menu");
    mainMenuBtn.addEventListener("click", handleReturn);
    const tryAgainBtn = document.querySelector("#try-again");
    tryAgainBtn.addEventListener("click", start);
  }

  function memorizeScore(score) {
    let storedScore;
    if (localStorage.highscore === undefined) {
      storedScore = [];
    } 
    else {
      storedScore = JSON.parse(localStorage.highscore);
    }
    if (storedScore.length < 3) {
      storedScore.push(score);
    }
    const lowestScoreIndex = storedScore.length - 1;
    if (storedScore[lowestScoreIndex] < score) {
      storedScore[lowestScoreIndex] = score;
    }
    storedScore.sort((a, b) => {
      return b - a;
    });
    localStorage.highscore = JSON.stringify(storedScore);
  }
}
