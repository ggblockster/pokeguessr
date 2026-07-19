// define constants
const fps = 60;
const dt = 1/fps;
const game = document.getElementById("game");
const body = document.getElementById("body");
const favicon = document.getElementById("favicon");
const fullscreenButton = document.getElementById("fullscreen");
const pauseBtn = document.getElementById("pause");
const guessWindow = document.getElementById("guessr");
let mode = "";
let start = false;
let difficulty = localStorage.getItem("difficulty") || 'easy';

// colours
const colBLACK = '#000';
const colBG = '#42B5A5';
const imgSPLASH = '/assets/splash.png';

// music
const musTITLE = new Audio("/assets/mus/3altTitle.mp3");
const musMENU = new Audio("/assets/mus/2menu.mp3");
const musGAME1 = new Audio("/assets/mus/4game1.mp3");
const musGAME2 = new Audio("/assets/mus/5game2.mp3");
musTITLE.loop = true;
musMENU.loop = true;
musGAME1.loop = true;
musGAME2.loop = true;

// sfx
const sfxOpenMenu = new Audio("/assets/sfx/openMenu.wav");
const sfxSelect = new Audio("/assets/sfx/select.wav");
const sfxCorrectAns = new Audio("/assets/sfx/correctAnswer.wav");
const sfxWrongAnswer = new Audio("/assets/sfx/wrongAnswer.wav");

setBackground(colBLACK);

function resizeGame() {
    const scale = Math.min(
        window.innerWidth / 640,
        window.innerHeight / 360
    );

    game.style.transform = `scale(${scale})`;
}

guessWindow.classList.add("hidden");
window.addEventListener("resize", resizeGame);

async function setBackground(col) {
    game.style.backgroundColor = col;
}

const mainMenu = document.getElementById("menu");
mainMenu.classList.add("hidden");
pauseBtn.classList.add("hidden");

function showTitle() {
    pauseBtn.classList.add("hidden");
    musTITLE.currentTime = 0;
    setBackground(colBG);
    document.getElementById("title").classList.remove("hidden");
    mainMenu.classList.add("hidden");
    musTITLE.currentTime = 0;
    musMENU.pause();
    musMENU.currentTime = 0;
    musTITLE.play();
}

function removePlaceholder() {
    game.classList.add("splashBg");
    document.getElementById("clicktoplay").classList.add("hidden");
    showTitle();
}

document.getElementById("clicktoplayBtn").addEventListener("click", async () => {
    if (!document.fullscreenElement) {        
        await document.body.requestFullscreen();
    }
    start = true;
    removePlaceholder();
    sfxOpenMenu.play();
    resizeGame();
});

async function fadeIn(audio, duration = 1000, targetVolume = 1) {
    audio.volume = 0;

    // Start playback if needed
    if (audio.paused) {
        await audio.play();
    }

    const interval = 16; // ~60 FPS
    const steps = duration / interval;
    const volumeStep = targetVolume / steps;

    const fade = setInterval(() => {
        audio.volume = Math.min(audio.volume + volumeStep, targetVolume);

        if (audio.volume >= targetVolume) {
            audio.volume = targetVolume;
            clearInterval(fade);
        }
    }, interval);
}

// title
const title = document.getElementById("title");
const titleStart = document.getElementById("titleStart");
const titleSettings = document.getElementById("titleSettings");
const titleCredits = document.getElementById("titleCredits");

const overlay = document.getElementById("overlay");
const overlayWindow = document.getElementById("overlayWindow");
const overlayBack = document.getElementById("overlayBack");

const menuHeader = document.getElementById("menuHeader");
const contentSettings = document.getElementById("contentSettings");
const contentCredits = document.getElementById("contentCredits");
const contentPause = document.getElementById("contentPause");

titleStart.addEventListener("click", showMainMenu);

titleSettings.addEventListener("click", showSettings);
overlayBack.addEventListener("click", () => {
    hideOverlay(true);
});

titleCredits.addEventListener("click", showCredits);
overlayBack.addEventListener("click", () => {
    hideOverlay(true);
});

async function showMainMenu() {
    mode = ""
    document.getElementById("diffshow2").textContent = diffLabel[localStorage.getItem("difficulty") || "easy"];
    musGAME1.pause();
    musGAME2.pause();
    musGAME1.currentTime = 0;
    musGAME2.currentTime = 0;
    guessWindow.classList.add("hidden");
    pauseBtn.classList.add("hidden");
    sfxOpenMenu.play();
    setBackground(colBG);
    title.classList.add("hidden");
    mainMenu.classList.remove("hidden");
    sfxSelect.play();
    musTITLE.currentTime = 0;
    musTITLE.pause();
    musMENU.play();
}

const diffMsgs = {
    "easy": "You will only have to guess Pokémon from Kanto.",
    "medium": "You will have to guess Pokémon from Generations I-V",
    "hard": "The hardest difficulty; you will guess from all 1025 Pokémon in this mode."
}

const diffLabel = {
    "easy": "Easy",
    "medium": "Medium",
    "hard": "Hard"
}

function showDiffMsg() {
    document.getElementById("diffmsg").textContent = diffMsgs[localStorage.getItem("difficulty") || "easy"];
    document.getElementById("diffshow1").textContent = diffLabel[localStorage.getItem("difficulty") || "easy"];
}

const diffButtons = document.querySelectorAll(".diffselec");
function clearSelection() {
    diffButtons.forEach(btn => {
        btn.removeAttribute("selected", "selected");
    });
}
diffButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        sfxSelect.play();
        clearSelection();
        btn.setAttribute("selected", "selected");
        localStorage.setItem("difficulty", btn.dataset.diff);
        showDiffMsg();
    })
});

async function showSettings() {
    sfxSelect.play();
    showOverlay(contentSettings, "Settings");
    showDiffMsg();
}

async function showCredits() {
    sfxSelect.play();
    showOverlay(contentCredits, "Credits");
}

async function showOverlay(also, header="header text") {
    overlay.classList.remove("hidden");
    overlayWindow.classList.remove("hidden");
    also.classList.remove("hidden");
    menuHeader.textContent = header;
}
async function hideOverlay(sfx=false) {
    overlay.classList.add("hidden");
    overlayWindow.classList.add("hidden");
    contentCredits.classList.add("hidden");
    contentSettings.classList.add("hidden");
    contentPause.classList.add("hidden");
    if (sfx) {
        sfxSelect.play();
    }
}

fullscreenButton.addEventListener("click", async () => {
    if (document.fullscreenElement) {
        await document.exitFullscreen();
    } else {
        await document.body.requestFullscreen();
    }
    updateFSState();
});

const menuBack = document.getElementById("menuBack");
menuBack.addEventListener("click", () => {
    sfxSelect.play();
    showTitle();
});

async function updateFSState() {
    if (document.fullscreenElement) {
        fullscreenButton.innerHTML = "fullscreen_exit";
    } else {
        fullscreenButton.innerHTML = "fullscreen";
    }
}

async function startGame(mus) {
    guessWindow.classList.remove("hidden");
    mainMenu.classList.add("hidden");
    pauseBtn.classList.remove("hidden");
    musMENU.currentTime = 0;
    musMENU.pause();
    mus.currentTime = 0;
    mus.play();
    pkmnIMG.classList.remove("hidden");
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const normalBtn = document.getElementById("normalMode");
const timedBtn = document.getElementById("timedMode");
const pkmnIMG = document.getElementById("mon");
let monIDX = 0;
const guessInput = document.getElementById("guessInput");
let guess = "";
let correctAnswer = "";
pkmnIMG.classList.add("hidden");

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getPokemon(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return await response.json();
}

function normalize(str) {
    return str
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

function isCloseEnough(guess, answer) {
    guess = normalize(guess);
    answer = normalize(answer);

    if (guess === answer) {
        return true;
    }

    const distance = levenshtein(guess, answer);

    // Require the name to be reasonably close in length
    const lengthDifference = Math.abs(guess.length - answer.length);

    if (lengthDifference > 2) {
        return false;
    }

    // Very short names should be strict
    if (answer.length <= 5) {
        return distance <= 1;
    }

    // Longer names can tolerate a couple mistakes
    return distance <= Math.max(1, Math.floor(answer.length * 0.15));
}

async function showMon(dexNum) {
    const pokemon = await getPokemon(dexNum);

    const bw = pokemon.sprites.versions?.["generation-v"]?.["black-white"];

    const newSrc =
        bw?.animated?.front_default ??
        bw?.front_default ??
        pokemon.sprites.front_default;

    pkmnIMG.onload = () => {
        pkmnIMG.classList.add("ghosted");
    };

    pkmnIMG.src = newSrc;
}

normalBtn.addEventListener("click", () => {
    sfxSelect.play();
    startGame(musGAME1);
    guessInput.focus();
    refreshMon();
});

async function refreshMon() {
    guessInput.value = "";
    guessInput.setAttribute("placeholder", "");

    if (difficulty == "easy") {
        monIDX = getRandom(1, 151);
    } else if (difficulty == "medium") {
        monIDX = getRandom(1, 649);
    } else if (difficulty == "hard") {
        monIDX = getRandom(1, 1025);
    }

    const pkmn = await getPokemon(monIDX);

    correctAnswer = pkmn.name;

    await showMon(monIDX);
}

guessInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    pkmnIMG.classList.remove("ghosted");
    guess = guessInput.value.trim();

    if (isCloseEnough(guess, correctAnswer)) {
        guessInput.value = correctAnswer.replaceAll("-", " ");
        sfxCorrectAns.play();
    } else {
        guessInput.setAttribute("placeholder", correctAnswer);
        sfxWrongAnswer.play();
    }

    await delay(800);
    await refreshMon();
});

pauseBtn.addEventListener("click", () => {
    showOverlay(contentPause, "Paused");
});

document.getElementById("resume").addEventListener("click", () => {
    hideOverlay(true);
});
document.getElementById("exitGame").addEventListener("click", () => {
    hideOverlay(true);
    showMainMenu();
});

hideOverlay();
updateFSState();
resizeGame();