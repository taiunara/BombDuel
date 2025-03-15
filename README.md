# BombDuel

This is a simple game developed in JavaScript using the p5.js library. The game features two characters, a player and a rival, who compete to hit a target with bombs. The goal is to score 10 points before the rival does.

## How to Play

- **Player**: Use the `Spacebar` to throw a bomb.
- **Rival**: The rival automatically throws bombs at regular intervals.
- **Scoring**: Hitting the target when it is in `TARGET_STATE_2` awards a point. If the target is in any other state, the player or rival will be put on a 3-second cooldown.

## Code Structure

The code is organized into several classes that represent the different elements of the game:

- **Character**: Represents the player and rival, controlling their states and actions.
- **Bomb**: Manages the behavior of bombs, including throwing and collision detection.
- **Target**: Handles the target's states and scoring logic.
- **GameManager**: Controls the game logic, including resetting the game and playing music.

## Prerequisites

To run this game, you will need:

- [p5.js](https://p5js.org/): A JavaScript library for creating graphics and animations.
- A local server to load the assets (images and audio) correctly.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/bomber-game.git

   Navigate to the project directory:
   
cd bomber-game
Open the index.html file in your browser.

## Assets
Images: All images used in the game are located in the assets folder.

Font: The font used for the score is Retro Gaming.ttf.

Audio: The background music is loaded from the song.mp3 file.

## Contributing
Contributions are welcome! Feel free to open issues or pull requests to improve the game.
