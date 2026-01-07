/**
 * Scooby-Doo: Escape from the Haunted Mansion
 * Updated with new column names: Code, Location, Text, Action
 */

const SHEETS_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSjCozO38RG54KVsVeO8coCz-a1Z3T44jLJcB_rZFN7R8YzDhCr_D0qWlcm80UVr8hHE4VpzWlcwCeG/pub?gid=0&single=true&output=csv";

let gameData = [];
let counter = localStorage.getItem("mansion_cookies")
  ? parseInt(localStorage.getItem("mansion_cookies"))
  : 20;
let currentItem = null;

document.addEventListener("DOMContentLoaded", () => {
  updateCounterDisplay();
  initData();

  const input = document.getElementById("code-input");
  input.addEventListener("input", (e) => handleLiveInput(e.target.value));
});

async function initData() {
  try {
    const response = await fetch(SHEETS_URL);
    const csvText = await response.text();
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        gameData = results.data;
        console.log("Data loaded. Columns recognized:", results.meta.fields);
      },
    });
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

function handleLiveInput(val) {
  hideAllScreens();

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
  // Using new column names: Code and Location
  currentItem = gameData.find((item) => String(item["Code"]).trim() === code);

  if (currentItem) {
    document.getElementById("confirm-location").innerText =
      currentItem["Location"];
    showScreen("screen-confirm");
  } else {
    showScreen("screen-error");
  }
}

function showResult() {
  // Using new column names: Text and Action
  document.getElementById("result-text").innerText = currentItem["Text"];
  const actionEl = document.querySelector("#result-action strong");
  actionEl.innerText = currentItem["Action"] || "";

  showScreen("screen-result");
}

function applyTheme(firstDigit) {
  document.body.className = `theme-${firstDigit}`;
  const portrait = document.getElementById("portrait-box");

  const heroes = {
    1: "velma.png",
    2: "shaggy.png",
    3: "daphne.png",
    4: "scooby.png",
    5: "fred.png",
    6: "fred.png",
  };

  if (heroes[firstDigit]) {
    portrait.style.backgroundImage = `url('images/${heroes[firstDigit]}')`;
    portrait.classList.remove("hidden");
  } else {
    portrait.classList.add("hidden");
  }
}

function eatCookie() {
  if (counter > 0) {
    counter--;
    localStorage.setItem("mansion_cookies", counter);
    updateCounterDisplay();
    // Visual feedback instead of intrusive alert if you prefer
    console.log("Snack consumed. Remaining:", counter);
  } else {
    alert("Закуски закончились! Нажми 🔄 чтобы сбросить.");
  }
}

function confirmReset() {
  if (confirm("Начать заново? Счетчик вернется к 20.")) {
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
