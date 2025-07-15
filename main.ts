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

const API_URL = 'http://<DEINE_SERVER_IP>:3001'; // IP anpassen

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

// Fortschritt aus Backend laden
async function loadProgress() {
  try {
    const resp = await fetch(`${API_URL}/progress`);
    const data = await resp.json();
    updateProgress(data.progress);
  } catch {
    updateProgress(0);
  }
}

loadProgress();

let progress = 0;
function updateProgress(value: number) {
  progress = Math.min(100, Math.max(0, value));
  progressBar.style.width = progress + '%';
  progressText.textContent = `Fortschritt: ${progress}%`;
}

// Admin Login
loginBtn.addEventListener('click', () => {
  // Passwort wird nur fürs Backend gebraucht, daher nur UI wechseln
  if (adminPassword.value.length > 0) {
    loginSection.style.display = 'none';
    adminSection.style.display = 'block';
    loginMessage.textContent = '';
  } else {
    loginMessage.textContent = 'Bitte Passwort eingeben!';
  }
});

// Fortschritt speichern
async function saveProgress(value: number, password: string) {
  try {
    const resp = await fetch(`${API_URL}/progress`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ progress: value, password })
    });
    const data = await resp.json();
    if (data.success) {
      updateProgress(value);
      alert('Fortschritt gespeichert!');
    } else {
      alert('Fehler: ' + (data.error || 'Unbekannt'));
    }
  } catch {
    alert('Server nicht erreichbar');
  }
}

updateProgressBtn.addEventListener('click', () => {
  const newValue = Number(progressInput.value);
  if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
    saveProgress(newValue, adminPassword.value);
  } else {
    alert('Bitte eine Zahl zwischen 0 und 100 eingeben.');
  }
});

// Early Access Code prüfen
checkCodeBtn.addEventListener('click', async () => {
  const code = earlyAccessCodeInput.value.trim();
  if (code.length === 0) {
    codeMessage.textContent = "Bitte Code eingeben.";
    return;
  }
  try {
    const resp = await fetch(`${API_URL}/check-code`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ code })
    });
    const data = await resp.json();
    if (data.valid) {
      codeMessage.textContent = "Code gültig! Du hast Early Access.";
      // Hier kannst du noch spezielle Inhalte freischalten
    } else {
      codeMessage.textContent = "Ungültiger Code.";
    }
  } catch {
    codeMessage.textContent = "Server nicht erreichbar.";
  }
});
