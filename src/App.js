// App.js
import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const numRows = 20;
const numCols = 20;
const initialSnakeSpeed = 190;
const minSnakeSpeed = 70;

const initialSnake = [{ row: 5, col: 5 }];
const initialFood = { row: 10, col: 10 };

const App = () => {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState(initialFood);
  const [direction, setDirection] = useState("RIGHT");
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [snakeSpeed, setSnakeSpeed] = useState(initialSnakeSpeed);

  

  useEffect(() => {
    if (gameOver) return;
    // if (gameOver) return;

    const handleKeyPress = (e) => {
      if (gameOver) return;
    
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowDown":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
        case "ArrowLeft":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowRight":
          if (direction !== "UP") setDirection("DOWN");
          break;
        default:
          break;
      }
    };
    // Add the event listener for key presses
    window.addEventListener("keydown", handleKeyPress);

    const handleCollision = () => {
      for (let i = 1; i < snake.length; i++) {
        if (snake[i].row === snake[0].row && snake[i].col === snake[0].col) {
          setGameOver(true);
          return;
        }
      }
    };

    const handleEatFood = () => {
      if (snake[0].row === food.row && snake[0].col === food.col) {
        setScore(score + 1);
        generateNewFood();
        const newSnake = [...snake];
        // Grow the snake by not popping the tail
        newSnake.unshift({});
        setSnake(newSnake);
        increaseSpeed();
      }
    };

    const moveSnake = () => {
      const newSnake = [...snake];
      let newHead = { ...newSnake[0] };

      switch (direction) {
        case "UP":
          newHead.row -= 1;
          break;
        case "DOWN":
          newHead.row += 1;
          break;
        case "LEFT":
          newHead.col -= 1;
          break;
        case "RIGHT":
          newHead.col += 1;
          break;
        default:
          break;
      }

      newSnake.unshift(newHead);
      // Grow the snake, and remove the tail if not eaten
      if (newSnake.length > score + 1) {
        newSnake.pop();
      }
      setSnake(newSnake);
    };

    const generateNewFood = () => {
      let newFood;
      do {
        newFood = {
          row: Math.floor(Math.random() * numRows),
          col: Math.floor(Math.random() * numCols),
        };
      } while (snake.some((cell) => cell.row === newFood.row && cell.col === newFood.col));
      setFood(newFood);
    };

    const handleBoundary = () => {
      if (
        snake[0].row < 0 ||
        snake[0].row >= numRows ||
        snake[0].col < 0 ||
        snake[0].col >= numCols
      ) {
        setGameOver(true);
        return;
      }
    };

    const handleGameTick = () => {
      handleCollision();
      handleEatFood();
      moveSnake();
      handleBoundary();
    };

    const intervalId = setInterval(handleGameTick, snakeSpeed);

    return () => {
      clearInterval(intervalId);
    };
  }, [snake, direction, food, gameOver, score, snakeSpeed]);

  const handleRestart = () => {
    setSnake(initialSnake);
    setFood(initialFood);
    setDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setSnakeSpeed(initialSnakeSpeed);
  };

  const increaseSpeed = () => {
    if (snakeSpeed > minSnakeSpeed) {
      setSnakeSpeed(snakeSpeed - 10); // Decrease the interval to increase speed
    }
  };

  return (
    <div className="App">
      <div className="Game-Container">
        {Array.from({ length: numRows }).map((_, rowIndex) => (
          <div key={rowIndex} className="Row">
            {Array.from({ length: numCols }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`Cell ${
                  snake.some(
                    (cell) => cell.row === rowIndex && cell.col === colIndex
                  )
                    ? "Snake"
                    : ""
                } ${
                  food.row === rowIndex && food.col === colIndex ? "Food" : ""
                }`}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="Sidebar">
        <h1 className="GameName">Snake Game</h1>
        <div className="Score">Score: {score}</div>
        <button onClick={handleRestart} className="RestartButton">
          Restart
        </button>
        {gameOver && <div className="GameOver">Game Over!</div>}
      </div>
    </div>
  );
};

export default App;
