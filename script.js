document.addEventListener('DOMContentLoaded', function() {
    const boxes = document.querySelectorAll(".box");
    const resetButton = document.querySelector(".reset_button .reset");
    const newGameButton = document.querySelector(".new_game");
    const msgContainer = document.querySelector(".msg_container");
    const msg = document.getElementById("msg");
    const playerSelectionForm = document.getElementById("player-selection");
    let turnX = true; // playerX, playerY
    const winningPattern = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    playerSelectionForm.addEventListener('change', (event) => {
        resetgame();
    });

    boxes.forEach((box) => {
        box.addEventListener("click", () => {
            if (playerSelectionForm.querySelector('input[name="second-player"]:checked').value === 'user') {
                userMove(box);
            } else if (playerSelectionForm.querySelector('input[name="second-player"]:checked').value === 'AI') {
                userMove(box);
                setTimeout(aiMove, 1000); // AI moves after user move
            }
        });
    });

    const resetgame = () => {
        turnX = true; // player X starts
        enableboxes();
        msgContainer.classList.add("hide");
    };

    const enableboxes = () => {
        boxes.forEach(box => {
            box.disabled = false;
            box.innerText = "";
        });
    };

    const disabledboxes = () => {
        boxes.forEach(box => {
            box.disabled = true;
        });
    };

    const showWinner = (winner) => {
        msg.innerText = `WINNER IS ${winner}`;
        msgContainer.classList.remove("hide");
        disabledboxes();
    };

    const showDraw = () => {
        msg.innerText = "DRAW!";
        msgContainer.classList.remove("hide");
        disabledboxes();
    };

    const checkWinner = () => {
        for (let pattern of winningPattern) {
            let pos1 = boxes[pattern[0]].innerText;
            let pos2 = boxes[pattern[1]].innerText;
            let pos3 = boxes[pattern[2]].innerText;

            if (pos1 && pos2 && pos3) {
                if (pos1 === pos2 && pos2 === pos3) {
                    showWinner(pos1);
                    return;
                }
            }
        }

        // If no winner found, check if all boxes are filled to declare a draw
        if (Array.from(boxes).every(box => box.innerText !== "")) {
            showDraw();
        }
    };

    const userMove = (box) => {
        if (box.innerText === "") {
            box.innerText = turnX ? 'X' : '0'; // Set 'X' for playerX and '0' for playerY
            box.disabled = true;
            checkWinner();
            turnX = !turnX; // Switch turn
        }
    };

    const aiMove = () => {
        let emptyBoxes = Array.from(boxes).filter(box => box.innerText === "");

        // AI logic to play
        let move = findBestMove(emptyBoxes);
        if (move !== null) {
            move.innerText = '0';
            turnY = true;
            move.disabled = true;
            checkWinner();
        }
    };

    const findBestMove = (emptyBoxes) => {
        for (let pattern of winningPattern) {
            let pos1 = boxes[pattern[0]];
            let pos2 = boxes[pattern[1]];
            let pos3 = boxes[pattern[2]];

            // Check if AI can win
            if (pos1.innerText === 'X' && pos2.innerText === 'X' && pos3.innerText === "") {
                return pos3;
            } else if (pos1.innerText === 'X' && pos3.innerText === 'X' && pos2.innerText === "") {
                return pos2;
            } else if (pos2.innerText === 'X' && pos3.innerText === 'X' && pos1.innerText === "") {
                return pos1;
            }

            // Check if AI needs to block the player from winning
            if (pos1.innerText === '0' && pos2.innerText === '0' && pos3.innerText === "") {
                return pos3;
            } else if (pos1.innerText === '0' && pos3.innerText === '0' && pos2.innerText === "") {
                return pos2;
            } else if (pos2.innerText === '0' && pos3.innerText === '0' && pos1.innerText === "") {
                return pos1;
            }
        }

        // Fallback to a random move if no winning or blocking move is found
        return emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    };

    newGameButton.addEventListener("click", resetgame);
    resetButton.addEventListener("click", resetgame);
});
