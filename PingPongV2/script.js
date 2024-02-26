// Define the Game class
class Game {
	constructor() {
		this.canvas = document.getElementById('gameBoard');
		this.context = this.canvas.getContext('2d');
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.paddleWidth = 10;
		this.paddleHeight = 100;
		this.ballSize = 10;
		this.paddleSpeed = 9; // Increased paddle speed
		this.ballSpeed = 7; // Reduced ball speed
		this.player1 = {
			x: 10,
			y: this.height / 2 - this.paddleHeight / 2,
			score: 0,
			moveUp: false,
			moveDown: false
		};
		this.player2 = {
			x: this.width - 20,
			y: this.height / 2 - this.paddleHeight / 2,
			score: 0,
			moveUp: false,
			moveDown: false
		};
		// Calculate initial ball direction (random angle)
		const initialAngle = Math.random() * Math.PI * 2; // Random angle in radians
		this.ball = {
			x: this.width / 2,
			y: this.height / 2,
			dx: Math.cos(initialAngle) * this.ballSpeed,
			dy: Math.sin(initialAngle) * this.ballSpeed,
			spin: 0 // Initial spin
		};
		this.frameRate = 60;
		this.scoreElement = document.getElementById('score');
		this.gameRunning = false; // Flag to indicate if the game is running
		this.animationFrameId = null; // ID of the animation frame
	}

	// Initialize the game
	init() {
		this.gameRunning = true;
		this.draw();
		this.update();
		this.setEventListeners();
	}

	// Set event listeners for paddle movement
	setEventListeners() {
		document.addEventListener('keydown', (event) => {
			if (event.key === 'w') {
				this.player1.moveUp = true;
			}
			if (event.key === 's') {
				this.player1.moveDown = true;
			}
			if (event.key === 'i') {
				this.player2.moveUp = true;
			}
			if (event.key === 'k') {
				this.player2.moveDown = true;
			}
		});

		document.addEventListener('keyup', (event) => {
			if (event.key === 'w') {
				this.player1.moveUp = false;
			}
			if (event.key === 's') {
				this.player1.moveDown = false;
			}
			if (event.key === 'i') {
				this.player2.moveUp = false;
			}
			if (event.key === 'k') {
				this.player2.moveDown = false;
			}
		});
	}

	// Draw elements on the canvas
	draw() {
		// Clear the canvas
		this.context.clearRect(0, 0, this.width, this.height);

		// Draw paddles
		this.context.fillStyle = '#ffffff';
		this.context.fillRect(this.player1.x, this.player1.y, this.paddleWidth, this.paddleHeight);
		this.context.fillRect(this.player2.x, this.player2.y, this.paddleWidth, this.paddleHeight);

		// Draw ball
		this.context.beginPath();
		this.context.arc(this.ball.x, this.ball.y, this.ballSize, 0, Math.PI * 2);
		this.context.fillStyle = '#ffffff';
		this.context.fill();

		// Update score display
		this.scoreElement.textContent = `${this.player1.score} : ${this.player2.score}`;
	}

	// Update game state
	update() {
		// Check if the game is running
		if (!this.gameRunning) {
			cancelAnimationFrame(this.animationFrameId);
			return;
		}

		// Move paddles
		if (this.player1.moveUp && this.player1.y > 0) {
			this.player1.y -= this.paddleSpeed;
		}
		if (this.player1.moveDown && this.player1.y < this.height - this.paddleHeight) {
			this.player1.y += this.paddleSpeed;
		}
		if (this.player2.moveUp && this.player2.y > 0) {
			this.player2.y -= this.paddleSpeed;
		}
		if (this.player2.moveDown && this.player2.y < this.height - this.paddleHeight) {
			this.player2.y += this.paddleSpeed;
		}

		// Move ball
		this.ball.x += this.ball.dx;
		this.ball.y += this.ball.dy;

		// Ball collision with top and bottom walls
		if (this.ball.y + this.ball.dy > this.height - this.ballSize || this.ball.y + this.ball.dy < this.ballSize) {
			this.ball.dy = -this.ball.dy;
		}

		// Ball collision with paddles
		if (
			this.ball.x + this.ball.dx > this.player2.x &&
			this.ball.x + this.ball.dx < this.player2.x + this.paddleWidth &&
			this.ball.y + this.ball.dy > this.player2.y &&
			this.ball.y + this.ball.dy < this.player2.y + this.paddleHeight
		) {
			const relativeIntersectY = this.player2.y + this.paddleHeight / 2 - this.ball.y;
			const normalizedRelativeIntersectionY = relativeIntersectY / (this.paddleHeight / 2);
			const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 4); // Maximum bounce angle
			this.ball.dx = -this.ballSpeed * Math.cos(bounceAngle);
			this.ball.dy = this.ballSpeed * Math.sin(bounceAngle);
		}

		if (
			this.ball.x + this.ball.dx < this.player1.x + this.paddleWidth &&
			this.ball.x + this.ball.dx > this.player1.x &&
			this.ball.y + this.ball.dy > this.player1.y &&
			this.ball.y + this.ball.dy < this.player1.y + this.paddleHeight
		) {
			const relativeIntersectY = this.player1.y + this.paddleHeight / 2 - this.ball.y;
			const normalizedRelativeIntersectionY = relativeIntersectY / (this.paddleHeight / 2);
			const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 4); // Maximum bounce angle
			this.ball.dx = this.ballSpeed * Math.cos(bounceAngle);
			this.ball.dy = this.ballSpeed * Math.sin(bounceAngle);
		}

		// Ball out of bounds
		if (this.ball.x + this.ball.dx > this.width || this.ball.x + this.ball.dx < 0) {
			if (this.ball.x + this.ball.dx > this.width) {
				this.player1.score++;
			} else {
				this.player2.score++;
			}
			if (this.player1.score === 11 || this.player2.score === 11) {
				const winner = this.player1.score === 11 ? 'Player 1' : 'Player 2';
				const playAgain = confirm(`${winner} won! Play again?`);
				if (playAgain) {
					this.resetGame();
				} else {
					// Hide game container and display main menu
					document.getElementById('gameContainer').style.display = 'none';
					document.getElementById('mainMenu').style.display = 'block';
					this.gameRunning = false; // Stop the game loop
					return;
				}
			} else {
				this.resetBall();
			}
		}

		// Redraw game elements
		this.draw();

		// Update game at specified frame rate
		this.animationFrameId = requestAnimationFrame(() => this.update());
	}

	// Reset ball position and direction
	resetBall() {
		this.ball.x = this.width / 2;
		this.ball.y = this.height / 2;
		const initialAngle = Math.random() * Math.PI * 2; // Random angle in radians
		this.ball.dx = Math.cos(initialAngle) * this.ballSpeed;
		this.ball.dy = Math.sin(initialAngle) * this.ballSpeed;
	}

	// Reset the game
	resetGame() {
		this.player1.score = 0;
		this.player2.score = 0;
		this.resetBall();
	}
}

// Create a new instance of the Game class
const game = new Game();

// Function to start the game
function startGame() {
	document.getElementById('mainMenu').style.display = 'none';
	document.getElementById('gameContainer').style.display = 'block';
	game.init(); // Start the game
}

// Function to stop the game and return to the main menu
function backToMenu() {
	document.getElementById('gameContainer').style.display = 'none';
	document.getElementById('mainMenu').style.display = 'block';
	game.gameRunning = false; // Stop the game loop
	game.resetGame(); // Reset the game
}

// Event listener for the "Start Game" button
document.getElementById('startButton').addEventListener('click', startGame);

// Event listener for the "Back to Menu" button
document.getElementById('backToMenuButton').addEventListener('click', backToMenu);
