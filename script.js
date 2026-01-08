const SHEETS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSjCozO38RG54KVsVeO8coCz-a1Z3T44jLJcB_rZFN7R8YzDhCr_D0qWlcm80UVr8hHE4VpzWlcwCeG/pub?gid=0&single=true&output=csv";

let gameData = [];
let counter = localStorage.getItem("mansion_cookies")
  ? parseInt(localStorage.getItem("mansion_cookies"))
  : 20;
let currentItem = null;

document.addEventListener("DOMContentLoaded", () => {
  applyLocalization();
  updateCounterDisplay();
  initData();
  const input = document.getElementById("code-input");
  input.addEventListener("input", (e) => handleLiveInput(e.target.value));
});

function applyLocalization() {
  document.title = UI.appTitle;
  document.getElementById("label-snacks").innerText = UI.snacksLabel;
  document.getElementById("code-input").placeholder = UI.inputPlaceholder;
  document.getElementById("btn-yes").innerText = UI.yesBtn;
  document.getElementById("btn-no").innerText = UI.noBtn;
  document.getElementById("error-title").innerText = UI.errorTitle;
  document.getElementById("error-hint").innerText = UI.errorHint;
}

async function initData() {
  try {
    const response = await fetch(SHEETS_URL);
    const csvText = await response.text();
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        gameData = results.data;
      },
    });
  } catch (err) {
    console.error(err);
  }
}

function handleLiveInput(val) {
  hideAllScreens();
  document.getElementById("location-display").classList.add("hidden");
  if (val.length === 0) {
    document.body.className = "";
    document.getElementById("portrait-box").classList.add("hidden");
    return;
  }
  applyTheme(val[0]);
  if (val.length === 4) {
    processCode(val);
  } else if (val.length > 4) {
    document.getElementById("code-input").value = val.slice(0, 4);
  }
}

function processCode(code) {
  currentItem = gameData.find((item) => String(item["Code"]).trim() === code);
  if (currentItem) {
    const locDisplay = document.getElementById("location-display");
    locDisplay.innerText = currentItem["Location"];
    locDisplay.classList.remove("hidden");
    showScreen("screen-confirm");
  } else {
    showScreen("screen-error");
  }
}

function showResult() {
  document.getElementById("screen-confirm").classList.add("hidden");
  document.getElementById("result-text").innerText = currentItem["Text"];
  const actionEl = document.querySelector("#result-action strong");
  actionEl.innerText = currentItem["Action"] || "";
  showScreen("screen-result");
}

// Add these lines to your applyTheme(firstDigit) function in script.js

function applyTheme(firstDigit) {
  document.body.className = `theme-${firstDigit}`;
  const portrait = document.getElementById("portrait-box");
  const charInfo = document.getElementById("char-info");
  const nameEl = document.getElementById("char-name");
  const abilityLabelEl = document.getElementById("label-snacks-text"); // Label placeholder
  const abilityValueEl = document.getElementById("char-ability-value");
  const abilityTextEl = document.getElementById("label-ability-text");

  const heroes = {
    1: "velma.png",
    2: "shaggy.png",
    3: "daphne.png",
    4: "scooby.png",
    5: "fred.png",
    6: "fred.png",
  };

  if (heroes[firstDigit]) {
    // Set Portrait
    portrait.style.backgroundImage = `url('images/${heroes[firstDigit]}')`;
    portrait.classList.remove("hidden");

    // Set Character Data from Translations
    const charData = UI[`char${firstDigit}`];
    if (charData) {
      nameEl.innerText = charData.name;
      abilityTextEl.innerText = UI.abilityLabel;
      abilityValueEl.innerText = charData.ability;
      charInfo.classList.remove("hidden");
    }
  } else {
    portrait.classList.add("hidden");
    charInfo.classList.add("hidden");
  }
}

function eatCookie() {
  if (counter > 0) {
    counter--;
    localStorage.setItem("mansion_cookies", counter);
    updateCounterDisplay();
  } else {
    alert(UI.noSnacksAlert);
  }
}

function confirmReset() {
  if (confirm(UI.resetConfirm)) {
    counter = 20;
    localStorage.setItem("mansion_cookies", counter);
    updateCounterDisplay();
    clearInput();
  }
}

function clearInput() {
  document.getElementById("code-input").value = "";
  handleLiveInput("");
}

function updateCounterDisplay() {
  document.getElementById("counter-val").innerText = counter;
}

function showScreen(id) {
  document.getElementById(id).classList.remove("hidden");
}
function hideAllScreens() {
  const screens = ["screen-confirm", "screen-result", "screen-error"];
  screens.forEach((s) => document.getElementById(s).classList.add("hidden"));
}

// Service Worker Registration
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .then((reg) => console.log("SW registered!", reg))
      .catch((err) => console.log("SW error:", err));
  });
}
