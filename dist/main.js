const countdownElement = document.getElementById('countdown');
// Setze Ziel-Datum für Launch
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
