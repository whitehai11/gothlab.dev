const countdownElement = document.getElementById('countdown') as HTMLParagraphElement;
const progressBar = document.getElementById('progress-bar') as HTMLDivElement;
const progressText = document.getElementById('progress-text') as HTMLParagraphElement;

const loginSection = document.getElementById('login-section') as HTMLDivElement;
const adminSection = document.getElementById('admin-section') as HTMLDivElement;
const loginBtn = document.getElementById('login-btn') as HTMLButtonElement;
const loginMessage = document.getElementById('login-message') as HTMLParagraphElement;
const adminPassword = document.getElementById('admin-password') as HTMLInputElement;
const progressInput = document.getElementById('progress-input') as HTMLInputElement;
const updateProgressBtn = document.getElementById('update-progress-btn') as HTMLButtonElement;

const earlyAccessCodeInput = document.getElementById('early-access-code') as HTMLInputElement;
const checkCodeBtn = document.getElementById('check-code-btn') as HTMLButtonElement;
const codeMessage = document.getElementById('code-message') as HTMLParagraphElement;

// Admin-Passwort (später besser sichern!)
const ADMIN_PASSWORD = "deinSicheresPasswort";

// Beispiel Early-Access Codes (später vom Backend)
const validCodes = ["ABC123", "VIP2025", "GOTHACCESS"];

// Countdown Setup
const launchDate = new Date('2025-08-01T00:00:00').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = launchDate - now;

  if (distance < 0) {
    countdownElement.textContent = 'Wir sind live! 🎉';
    clearInterval(timer);
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdownElement.textContent =
    `Noch ${days} Tage, ${hours} Stunden, ${minutes} Minuten und ${seconds} Sekunden`;
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown();

// Fortschritt initialisieren
let progress = 0;
function updateProgress(value: number) {
  progress = Math.min(100, Math.max(0, value));
  progressBar.style.width = progress + '%';
  progressText.textContent = `Fortschritt: ${progress}%`;
}
updateProgress(progress);

// Admin Login
loginBtn.addEventListener('click', () => {
  if (adminPassword.value === ADMIN_PASSWORD) {
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
    loginMessage.textContent = '';
  } else {
    loginMessage.textContent = 'Falsches Passwort!';
  }
});

// Fortschritt updaten
updateProgressBtn.addEventListener('click', () => {
  const newValue = Number(progressInput.value);
  if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
    updateProgress(newValue);
    // TODO: Später Backend-API aufrufen, um Wert zu speichern
  } else {
    alert('Bitte eine Zahl zwischen 0 und 100 eingeben.');
  }
});

// Early Access Code prüfen
checkCodeBtn.addEventListener('click', () => {
  const code = earlyAccessCodeInput.value.trim();
  if (validCodes.includes(code)) {
    codeMessage.textContent = "Code gültig! Du hast Early Access.";
    // Optional: Hier besondere Inhalte freischalten
  } else {
    codeMessage.textContent = "Ungültiger Code.";
  }
});
