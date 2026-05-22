const homeScreen       = document.getElementById("home-screen");
const rulesScreen      = document.getElementById("rules-screen");
const gameScreen       = document.getElementById("game-screen");
const letterContainer  = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("user-input-section");
const newGameContainer = document.getElementById("new-game-container");
const newGameButton    = document.getElementById("new-game-button");
const canvas           = document.getElementById("canvas");
const resultText       = document.getElementById("result-text");

let options = {
    fruits: [
        "Apple",
        "Banana",
        "Mango",
        "Pineapple",
        "Grapes",
        "Watermelon"
    ],
    animals: [
        "Hedgehog",
        "Squid",
        "Squirrel",
        "Panther",
        "Walrus",
        "Zebra"
    ],
    countries: [
        "India",
        "Hungary",
        "Romania",
        "Switzerland",
        "West Indies",
        "Australia"
    ]
};

let winCount = 0;
let count = 0;
let chosenWord = "";

function navigate(name, replace = false) {
    if (replace) {
        history.replaceState({ screen: name }, "", "#" + name);
    } else {
        history.pushState({ screen: name }, "", "#" + name);
    }
    renderScreen(name);
}

function renderScreen(name) {
    homeScreen.classList.add("hide");
    rulesScreen.classList.add("hide");
    gameScreen.classList.add("hide");

    switch (name) {
        case "rules":
            rulesScreen.classList.remove("hide");
            break;
        case "game":
            gameScreen.classList.remove("hide");
            initializer();
            break;
        default:
            homeScreen.classList.remove("hide");
            break;
    }
}

window.addEventListener("popstate", (e) => {
    renderScreen(e.state ? e.state.screen : "home");
});

document.getElementById("play-btn").addEventListener("click", () => navigate("game"));
document.getElementById("rules-btn").addEventListener("click", () => navigate("rules"));
document.getElementById("back-btn").addEventListener("click", () => history.back());

const displayOptions = () => {
    optionsContainer.innerHTML = `<h3>Please Select An Option</h3>`;

    let buttonCon = document.createElement("div");

    for (let value in options) {
        buttonCon.innerHTML += `
            <button class="options" onclick="generateWord('${value}')">
                ${value}
            </button>
        `;
    }

    optionsContainer.appendChild(buttonCon);
};

const blocker = () => {
    let optionsButtons = document.querySelectorAll(".options");
    let letterButtons = document.querySelectorAll(".letters");

    optionsButtons.forEach((button) => { button.disabled = true; });
    letterButtons.forEach((button) => { button.disabled = true; });

    newGameContainer.classList.remove("hide");
};

const generateWord = (optionValue) => {
    let optionsButtons = document.querySelectorAll(".options");

    optionsButtons.forEach((button) => {
        if (button.innerText.toLowerCase() === optionValue) {
            button.classList.add("active");
        }
        button.disabled = true;
    });

    letterContainer.classList.remove("hide");

    userInputSection.innerText = "";

    let optionArray = options[optionValue];

    chosenWord = optionArray[Math.floor(Math.random() * optionArray.length)];
    chosenWord = chosenWord.toUpperCase();

    let displayItem = chosenWord
        .replace(/ /g, '&nbsp;')
        .replace(/[A-Z]/g, '<span class="dashes">_</span>');

    userInputSection.innerHTML = displayItem;
};

const initializer = () => {
    winCount = 0;
    count = 0;

    userInputSection.innerHTML = "";
    optionsContainer.innerHTML = "";

    letterContainer.classList.add("hide");
    newGameContainer.classList.add("hide");

    letterContainer.innerHTML = "";

    const rows = [
        { from: 65, to: 75 },
        { from: 76, to: 86 },
        { from: 87, to: 90 },
    ];

    rows.forEach(({ from, to }) => {
        const row = document.createElement("div");
        row.classList.add("letter-row");

        for (let i = from; i <= to; i++) {
            let button = document.createElement("button");
            button.classList.add("letters");
            button.innerText = String.fromCharCode(i);

            button.addEventListener("click", () => {
                let charArray = chosenWord.split("");
                let dashes = document.getElementsByClassName("dashes");

                if (charArray.includes(button.innerText)) {
                    charArray.forEach((char, index) => {
                        if (char === button.innerText) {
                            dashes[index].innerText = char;
                            winCount += 1;

                            if (winCount === charArray.filter(c => c !== " ").length) {
                                resultText.innerHTML = `
                                    <h2 class="win-msg">You Win!!</h2>
                                    <p>The word was <span>${chosenWord}</span></p>
                                `;
                                blocker();
                            }
                        }
                    });
                } else {
                    count += 1;
                    drawMan(count);

                    if (count === 6) {
                        resultText.innerHTML = `
                            <h2 class="lose-msg">You Lose!!</h2>
                            <p>The word was <span>${chosenWord}</span></p>
                        `;
                        blocker();
                    }
                }

                button.disabled = true;
            });

            row.append(button);
        }

        letterContainer.append(row);
    });

    displayOptions();

    let { initialDrawing } = canvasCreator();
    initialDrawing();
};

const canvasCreator = () => {
    let context = canvas.getContext("2d");

    context.strokeStyle = "#000";
    context.lineWidth = 2;

    const drawLine = (fromX, fromY, toX, toY) => {
        context.beginPath();
        context.moveTo(fromX, fromY);
        context.lineTo(toX, toY);
        context.stroke();
    };

    const PX = 30;
    const PY_TOP = 10;
    const BASE_Y = 130;
    const BEAM_X = 90;

    const head = () => {
        context.beginPath();
        context.arc(BEAM_X, PY_TOP + 22, 10, 0, Math.PI * 2, true);
        context.stroke();
    };

    const body     = () => { drawLine(BEAM_X, PY_TOP + 32, BEAM_X, PY_TOP + 72); };
    const leftArm  = () => { drawLine(BEAM_X, PY_TOP + 45, BEAM_X - 18, PY_TOP + 62); };
    const rightArm = () => { drawLine(BEAM_X, PY_TOP + 45, BEAM_X + 18, PY_TOP + 62); };
    const leftLeg  = () => { drawLine(BEAM_X, PY_TOP + 72, BEAM_X - 18, PY_TOP + 98); };
    const rightLeg = () => { drawLine(BEAM_X, PY_TOP + 72, BEAM_X + 18, PY_TOP + 98); };

    const initialDrawing = () => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        drawLine(PX, BASE_Y, PX + 100, BASE_Y);
        drawLine(PX, PY_TOP, PX, BASE_Y);
        drawLine(PX, PY_TOP, BEAM_X, PY_TOP);
        drawLine(BEAM_X, PY_TOP, BEAM_X, PY_TOP + 12);
    };

    return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

const drawMan = (count) => {
    let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();

    switch (count) {
        case 1: head();     break;
        case 2: body();     break;
        case 3: leftArm();  break;
        case 4: rightArm(); break;
        case 5: leftLeg();  break;
        case 6: rightLeg(); break;
    }
};

newGameButton.addEventListener("click", initializer);

window.onload = () => {
    const hash = window.location.hash.replace("#", "") || "home";
    navigate(hash, true);
};