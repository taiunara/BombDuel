// CHARACTER VARIABLES
const IDLE = 0;
const THROWING_BOMB_1 = 1;
const THROWING_BOMB_2 = 2;
const THROWING_BOMB_3 = 3;

let timer = 0;
let imgIdle, imgThrowingBomb1, imgThrowingBomb2, imgThrowingBomb3;

// ----------------------------------------------------------

// TARGET VARIABLES
const TARGET_STATE_1 = 4;
const TARGET_STATE_2 = 5;
const TARGET_STATE_3 = 6;
const TARGET_STATE_4 = 7;

let targetTimer = 0;
let imgTarget1, imgTarget2, imgTarget3, imgTarget4;

// -------------------------------------------------------------

// RIVAL VARIABLES
const RIVAL_STATE_1 = 8;
const RIVAL_STATE_2 = 9;
const RIVAL_STATE_3 = 10;
const RIVAL_STATE_4 = 11;

let rivalTimer = 0;
let imgRival1, imgRival2, imgRival3, imgRival4;

// -------------------------------------------------------------

// SCORE VARIABLES
let playerScore = 0;
let rivalScore = 0;

// -------------------------------------------------------------

// OTHER VARIABLES
let font;
let imgBomb;
let imgBackground;
let audio;

class Character {
  constructor(posX, posY, size1, size2, state) {
    this.posX = posX;
    this.posY = posY;
    this.size1 = size1;
    this.size2 = size2;
    this.state = state;
    this.cooldown = 0;
  }

  showCharacter() {
    if (this.state === IDLE) {
      image(imgIdle, this.posX, this.posY, this.size1, this.size2);
    } else if (this.state === THROWING_BOMB_1) {
      image(
        imgThrowingBomb1,
        this.posX - 5,
        this.posY - 5,
        this.size1 + 5,
        this.size2 + 15
      );
    } else if (this.state === THROWING_BOMB_2) {
      image(
        imgThrowingBomb2,
        this.posX - 5,
        this.posY - 5,
        this.size1 + 5,
        this.size2 + 15
      );
    } else if (this.state === THROWING_BOMB_3) {
      image(
        imgThrowingBomb3,
        this.posX - 5,
        this.posY - 5,
        this.size1 + 5,
        this.size2 + 15
      );
    }
  }

  attack() {
    if (keyIsPressed && key === " " && this.canAttack()) {
      this.state = THROWING_BOMB_1;
      bomb.active = true;
    }

    if (this.state === THROWING_BOMB_1) {
      timer++;
      if (timer >= 10) {
        timer = 0;
        this.state = THROWING_BOMB_2;
      }
    }

    if (this.state === THROWING_BOMB_2) {
      timer++;
      if (timer >= 10) {
        timer = 0;
        this.state = THROWING_BOMB_3;
      }
    }

    if (this.state === THROWING_BOMB_3) {
      timer++;

      if (timer >= 90) {
        timer = 0;
        this.state = IDLE;
      }

      bomb.throwBomb();
    }

    this.updateCooldown();
  }

  canAttack() {
    return this.cooldown <= 0;
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }
}

class Rival extends Character {
  constructor(posX, posY, size1, size2, state) {
    super(posX, posY, size1, size2, state);
    this.rivalBomb = new Bomb(35, 0, -10, true);
    this.attackInterval = 240; // 4s
    this.attackTimer = 0;
  }

  showRival() {
    if (this.state === RIVAL_STATE_1) {
      image(imgRival1, this.posX, this.posY, this.size1, this.size2);
    } else if (this.state === RIVAL_STATE_2) {
      image(imgRival2, this.posX, this.posY, this.size1, this.size2);
    } else if (this.state === RIVAL_STATE_3) {
      image(imgRival3, this.posX, this.posY, this.size1, this.size2);
    } else if (this.state === RIVAL_STATE_4) {
      image(imgRival4, this.posX, this.posY, this.size1, this.size2);
    }
  }

  attackRival() {
    this.attackTimer++;

    if (
      this.attackTimer >= this.attackInterval &&
      this.state === RIVAL_STATE_1 &&
      this.canAttack()
    ) {
      this.state = RIVAL_STATE_2;
      this.rivalBomb.active = true;
      this.attackTimer = 0;
    }

    if (this.state === RIVAL_STATE_2) {
      rivalTimer++;
      if (rivalTimer >= 10) {
        rivalTimer = 0;
        this.state = RIVAL_STATE_3;
      }
    }

    if (this.state === RIVAL_STATE_3) {
      rivalTimer++;
      if (rivalTimer >= 0.5) {
        rivalTimer = 0;
        this.state = RIVAL_STATE_4;
      }
    }

    if (this.state === RIVAL_STATE_4) {
      rivalTimer++;

      if (rivalTimer >= 90) {
        rivalTimer = 0;
        this.state = RIVAL_STATE_1;
      }

      this.rivalBomb.throwBomb();
    }

    this.updateCooldown();
  }

  canAttack() {
    return this.cooldown <= 0;
  }

  updateCooldown() {
    if (this.cooldown > 0) {
      this.cooldown--;
    }
  }
}

class Bomb {
  constructor(currentSpeed, currentTime, currentAcceleration, isRival) {
    this.currentSpeed = currentSpeed;
    this.currentTime = currentTime;
    this.currentAcceleration = currentAcceleration;
    this.isRival = isRival;

    this.currentDisplacement = 0;
    this.timeFactor = 0.2;

    this.posX = isRival ? 650 : 100;
    this.posY = isRival ? 150 : 100;
    this.active = false;
  }

  MRUV(v, a, t) {
    return v * t + (a * t * t) / 2.0;
  }

  MRU(v, t) {
    return v * t;
  }

  throwBomb() {
    if (this.active) {
      let adjustedTime = this.currentTime * this.timeFactor;

      if (this.isRival) {
        this.posX = 650 - this.MRU(this.currentSpeed, adjustedTime);
      } else {
        this.posX = 100 + this.MRU(this.currentSpeed, adjustedTime);
      }

      this.currentDisplacement = this.MRUV(this.currentSpeed, this.currentAcceleration, adjustedTime);

      image(imgBomb, this.posX, this.posY - this.currentDisplacement, 80, 80);

      this.currentTime++;
    }
  }

  checkCollision(target) {
    if (
      this.active &&
      this.posX >= target.posX &&
      this.posX <= target.posX + target.size1 &&
      this.posY - this.currentDisplacement >= target.posY &&
      this.posY - this.currentDisplacement <= target.posY + target.size2
    ) {
      this.active = false;
      this.reset();

      if (target.state === TARGET_STATE_2) {
        if (this.isRival) {
          gameManager.rivalScore++;
        } else {
          gameManager.playerScore++;
        }

        if (
          gameManager.playerScore >= 10 ||
          gameManager.rivalScore >= 10
        ) {
          gameManager.restartGame(character, rival, bomb, target);
        }
      } else {
        if (this.isRival) {
          rival.cooldown = 180;
        } else {
          character.cooldown = 180;
        }
      }

      return true;
    }
    return false;
  }

  reset() {
    this.posX = this.isRival ? 650 : 100;
    this.currentTime = 0;
    this.currentDisplacement = 0;
  }
}

class Target extends Character {
  constructor(posX, posY, size1, size2, state) {
    super(posX, posY, size1, size2, state);
  }

  showTarget() {
    if (this.state === TARGET_STATE_1) {
      image(
        imgTarget1,
        this.posX - 10,
        this.posY - 10,
        this.size1 + 15,
        this.size2 + 15
      );
    } else if (this.state === TARGET_STATE_2) {
      image(
        imgTarget2,
        this.posX - 10,
        this.posY - 10,
        this.size1 + 15,
        this.size2 + 15
      );
    } else if (this.state === TARGET_STATE_3) {
      image(
        imgTarget3,
        this.posX - 10,
        this.posY - 10,
        this.size1 + 15,
        this.size2 + 15
      );
    } else if (this.state === TARGET_STATE_4) {
      image(
        imgTarget4,
        this.posX - 10,
        this.posY - 10,
        this.size1 + 15,
        this.size2 + 15
      );
    }
  }

  targetAction() {
    targetTimer++;

    if (this.state === TARGET_STATE_1 && targetTimer >= 60) {
      let randomState = int(random(2)) + 5;
      this.state = randomState;
      targetTimer = 0;
    }

    if (this.state === TARGET_STATE_3 && targetTimer >= 60) {
      let randomState = random(1) > 0.5 ? TARGET_STATE_1 : TARGET_STATE_2;
      this.state = randomState;
      targetTimer = 0;
    }

    if (this.state === TARGET_STATE_2) {
      if (bomb.checkCollision(this) || rival.rivalBomb.checkCollision(this)) {
        this.state = TARGET_STATE_4;
        targetTimer = 0;
      } else if (targetTimer >= 90) {
        this.state = TARGET_STATE_3;
        targetTimer = 0;
      }
    }

    if (this.state === TARGET_STATE_4 && targetTimer >= 60) {
      this.state = TARGET_STATE_1;
      targetTimer = 0;
    }
  }

  restartGame() {
    if (playerScore >= 10) {
      alert("You win!");
    } else if (rivalScore >= 10) {
      alert("MetalBomber wins!");
    }

    playerScore = 0;
    rivalScore = 0;

    character = new Character(50, 150, 110, 175, IDLE);
    rival = new Rival(650, 150, 115, 180, RIVAL_STATE_1);
    bomb = new Bomb(30, 0, -10);
    this.state = TARGET_STATE_1;
  }
}

class GameManager {
  constructor() {
    this.playerScore = 0;
    this.rivalScore = 0;
  }

  restartGame(character, rival, bomb, target) {
    if (this.playerScore >= 10) {
      alert("You win!");
    } else if (this.rivalScore >= 10) {
      alert("MetalBomber wins!");
    }

    this.playerScore = 0;
    this.rivalScore = 0;

    character = new Character(50, 150, 110, 175, IDLE);
    rival = new Rival(650, 150, 115, 180, RIVAL_STATE_1);
    bomb = new Bomb(30, 0, -10);
    target.state = TARGET_STATE_1;
  }

  playMusic() {
    if (audio) {
      audio.play();
    }
  }
}

function preload() {
  imgIdle = loadImage("assets/padrao.png");
  imgThrowingBomb1 = loadImage("assets/ataque1.png");
  imgThrowingBomb2 = loadImage("assets/atq2.png");
  imgThrowingBomb3 = loadImage("assets/ataque3.png");

  imgBomb = loadImage("assets/bomba.png");

  imgBackground = loadImage("assets/fundo.png");

  font = loadFont("assets/Retro Gaming.ttf");

  audio = loadSound("assets/song.mp3");

  imgTarget1 = loadImage("assets/alvo1.png");
  imgTarget2 = loadImage("assets/alvo3.png");
  imgTarget3 = loadImage("assets/alvo2.png");
  imgTarget4 = loadImage("assets/alvo4.png");

  imgRival1 = loadImage("assets/rival1.png");
  imgRival2 = loadImage("assets/rival2.png");
  imgRival3 = loadImage("assets/rival3.png");
  imgRival4 = loadImage("assets/rival4.png");
}

function setup() {
  createCanvas(800, 500);

  character = new Character(50, 150, 110, 175, IDLE);

  target = new Target(350, 200, 100, 100, TARGET_STATE_1);

  rival = new Rival(650, 150, 115, 180, RIVAL_STATE_1);

  bomb = new Bomb(30, 0, -10, false);

  gameManager = new GameManager();

  gameManager.playMusic();

  textFont(font);
  textSize(22);
}

function draw() {
  image(imgBackground, 5, 5);

  fill(255);
  text(`0${gameManager.playerScore}`, 152, 35);
  text(`0${gameManager.rivalScore}`, width - 176, 35);

  character.showCharacter();
  character.attack();

  rival.showRival();
  rival.attackRival();

  target.showTarget();
  target.targetAction();

  bomb.checkCollision(target);
  rival.rivalBomb.checkCollision(target);
}
