/**
 * UI Translations Dictionary with Characters and Abilities
 */
const translations = {
  ru: {
    appTitle: "Scooby-Doo: Escape from the Haunted Mansion",
    mansionLabel: "Scooby-Doo Mansion",
    snacksLabel: "🍪 Закуски",
    inputPlaceholder: "Введите код",
    yesBtn: "Да",
    noBtn: "Нет",
    errorTitle: "Локация не найдена",
    errorHint: "Нажми на счетчик закусок выше",
    resetConfirm:
      "Вы уверены, что хотите начать заново? Счетчик закусок вернется к 20.",
    noSnacksAlert: "Закуски закончились! Нажми ⟳ чтобы сбросить.",
    abilityLabel: "Способность",
    // Characters
    char1: { name: "Велма", ability: "Исследование" },
    char2: { name: "Шегги", ability: "Съесть" },
    char3: { name: "Дафна", ability: "Использовать" },
    char4: { name: "Скуби-Ду", ability: "Нюх" },
    char5: { name: "Фред", ability: "Расследование" },
    char6: { name: "Фред", ability: "Расследование" },
  },
  uk: {
    appTitle: "Scooby-Doo: Escape from the Haunted Mansion",
    mansionLabel: "Scooby-Doo Mansion",
    snacksLabel: "🍪 Закуски",
    inputPlaceholder: "Введіть код",
    yesBtn: "Так",
    noBtn: "Ні",
    errorTitle: "Локацію не знайдено",
    errorHint: "Натисни на лічильник закусок вище",
    resetConfirm:
      "Ви впевнені, що хочете почати заново? Лічильник закусок повернеться до 20.",
    noSnacksAlert: "Закуски закінчилися! Натисни ⟳ щоб скинути.",
    abilityLabel: "Здібність",
    // Characters
    char1: { name: "Велма", ability: "Дослідження" },
    char2: { name: "Шеггі", ability: "З'їсти" },
    char3: { name: "Дафна", ability: "Використати" },
    char4: { name: "Скубі-Ду", ability: "Нюх" },
    char5: { name: "Фред", ability: "Розслідування" },
    char6: { name: "Фред", ability: "Розслідування" },
  },
  en: {
    appTitle: "Scooby-Doo: Escape from the Haunted Mansion",
    mansionLabel: "Scooby-Doo Mansion",
    snacksLabel: "🍪 Snacks",
    inputPlaceholder: "Enter code",
    yesBtn: "Yes",
    noBtn: "No",
    errorTitle: "Location not found",
    errorHint: "Click on the snack counter above if needed",
    resetConfirm:
      "Are you sure you want to restart? Snack counter will return to 20.",
    noSnacksAlert: "No more snacks! Press ⟳ to reset.",
    abilityLabel: "Ability",
    // Characters
    char1: { name: "Velma", ability: "Research" },
    char2: { name: "Shaggy", ability: "Eat" },
    char3: { name: "Daphne", ability: "Use" },
    char4: { name: "Scooby-Doo", ability: "Smell" },
    char5: { name: "Fred", ability: "Investigate" },
    char6: { name: "Fred", ability: "Investigate" },
  },
};

let currentLang = localStorage.getItem("game_lang") || "ru"; // Try to load saved language or use Russian
let UI = translations[currentLang];
