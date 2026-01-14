/**
 * Scooby-Doo: Escape from the Haunted Mansion
 * Companion Web App Logic with Offline Support and i18n
 */

const MAX_SNACKS = 20;

const SHEETS_URLS = {
  ru: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSjCozO38RG54KVsVeO8coCz-a1Z3T44jLJcB_rZFN7R8YzDhCr_D0qWlcm80UVr8hHE4VpzWlcwCeG/pub?gid=0&single=true&output=csv",
  uk: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSjCozO38RG54KVsVeO8coCz-a1Z3T44jLJcB_rZFN7R8YzDhCr_D0qWlcm80UVr8hHE4VpzWlcwCeG/pub?gid=1657108925&single=true&output=csv",
  en: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSjCozO38RG54KVsVeO8coCz-a1Z3T44jLJcB_rZFN7R8YzDhCr_D0qWlcm80UVr8hHE4VpzWlcwCeG/pub?gid=1657108925&single=true&output=csv",
};

let gameData = [];
let counter = localStorage.getItem("mansion_cookies")
  ? parseInt(localStorage.getItem("mansion_cookies"))
  : MAX_SNACKS; // Initialize with constant
let currentItem = null;

document.addEventListener("DOMContentLoaded", () => {
  applyLocalization();
  updateCounterDisplay();
  initData(currentLang);

  const input = document.getElementById("code-input");
  input.addEventListener("input", (e) => handleLiveInput(e.target.value));
});

/**
 * Fetches data from network and caches it, or falls back to localStorage
 * @param {string} lang
 */
async function initData(lang) {
  const cacheKey = `mansion_data_${lang}`;
  try {
    const url = SHEETS_URLS[lang] || SHEETS_URLS.ru;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network request failed");

    const csvText = await response.text();
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        gameData = results.data;
        localStorage.setItem(cacheKey, JSON.stringify(gameData));
        refreshCurrentView();
      },
    });
  } catch (err) {
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      gameData = JSON.parse(cachedData);
      refreshCurrentView();
    }
  }
}

/**
 * Switches the language and re-initializes data
 * @param {string} lang
 */
function changeLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("game_lang", lang);
  UI = translations[currentLang]; //

  applyLocalization();
  updateActiveLangBtn();
  initData(lang);
}

function updateActiveLangBtn() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.innerText.toLowerCase() === currentLang);
  });
}

function applyLocalization() {
  document.title = UI.appTitle;
  document.getElementById("label-snacks").innerText = UI.snacksLabel;
  document.getElementById("code-input").placeholder = UI.inputPlaceholder;
  document.getElementById("btn-yes").innerText = UI.yesBtn;
  document.getElementById("btn-no").innerText = UI.noBtn;
  document.getElementById("error-title").innerText = UI.errorTitle;
  document.getElementById("error-hint").innerText = UI.errorHint;

  const abilityLabelText = document.getElementById("label-ability-text");
  if (abilityLabelText) abilityLabelText.innerText = UI.abilityLabel;

  updateActiveLangBtn();
}

function handleLiveInput(val) {
  const langSwitcher = document.getElementById("lang-switcher");
  hideAllScreens();
  document.getElementById("location-display").classList.add("hidden");

  if (val.length === 0) {
    langSwitcher.classList.remove("hidden");
    document.body.className = "";
    document.getElementById("portrait-box").classList.add("hidden");
    document.getElementById("char-info").classList.add("hidden");
    return;
  } else {
    langSwitcher.classList.add("hidden");
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

function applyTheme(firstDigit) {
  document.body.className = `theme-${firstDigit}`;
  const portrait = document.getElementById("portrait-box");
  const charInfo = document.getElementById("char-info");
  const nameEl = document.getElementById("char-name");
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
    portrait.style.backgroundImage = `url('images/${heroes[firstDigit]}')`;
    portrait.classList.remove("hidden");

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
    counter = MAX_SNACKS;
    localStorage.setItem("mansion_cookies", counter);
    updateCounterDisplay();
    clearInput();
  }
}

function clearInput() {
  document.getElementById("code-input").value = "";
  handleLiveInput("");
}

/**
 * Updates UI and manages reset button visibility
 */
function updateCounterDisplay() {
  const resetBtn = document.querySelector(".btn-reset");
  const counterValEl = document.getElementById("counter-val");

  counterValEl.innerText = counter;

  // Show reset button only if current counter is less than max
  if (counter < MAX_SNACKS) {
    resetBtn.classList.remove("hidden");
  } else {
    resetBtn.classList.add("hidden");
  }
}

function refreshCurrentView() {
  const currentCode = document.getElementById("code-input").value;
  if (currentCode.length === 4) {
    processCode(currentCode);
    if (
      !document.getElementById("screen-result").classList.contains("hidden")
    ) {
      showResult();
    }
  }
}

function showScreen(id) {
  document.getElementById(id).classList.remove("hidden");
}

function hideAllScreens() {
  const screens = ["screen-confirm", "screen-result", "screen-error"];
  screens.forEach((s) => document.getElementById(s).classList.add("hidden"));
}

/**
 * Auto-refresh logic when Service Worker updates
 */
let refreshing = false;
navigator.serviceWorker.addEventListener("controllerchange", () => {
  if (!refreshing) {
    window.location.reload();
    refreshing = true;
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .catch((err) => console.log("SW error:", err));
  });
}
