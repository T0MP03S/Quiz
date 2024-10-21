const questions = [
    { question: "Is de aarde plat?", correct: false },
    { question: "Is water vloeibaar bij kamertemperatuur?", correct: true },
    { question: "Is de zon een ster?", correct: true },
];

let currentQuestionIndex = 0;
let score = 0;
const overlay = document.getElementById('overlay');
const questionElement = document.getElementById('question');
const video = document.getElementById('video');
const volumeButton = document.getElementById('volume-button');
const sliderContainer = document.getElementById('slider-container');
const volumeSlider = document.getElementById('volume-slider');
const pauseButton = document.getElementById('pause-button');

// Initieel volume instellen
video.volume = 0.5; // Standaard volume op 50%

video.onended = function() {
    overlay.style.display = 'block';
    showQuestion();
};

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        questionElement.textContent = questions[currentQuestionIndex].question;
    } else {
        overlay.innerHTML = `<h2>Quiz voltooid! Eindscore: ${score}</h2>`;
        document.getElementById('score').style.display = 'none';
    }
}

function checkAnswer(answer) {
    if (currentQuestionIndex < questions.length) {
        const correct = questions[currentQuestionIndex].correct;
        if (answer === correct) {
            score += 10;
            alert("Correct!");
        } else {
            alert("Fout! De juiste antwoord was " + (correct ? "Ja" : "Nee"));
        }
        currentQuestionIndex++;
        document.getElementById('score').textContent = `Score: ${score}`;
        showQuestion();
    }
}

// Volume toggle functie
volumeButton.onclick = function() {
    sliderContainer.style.display = sliderContainer.style.display === 'block' ? 'none' : 'block';
};

// Volume instellen bij schuiven
volumeSlider.oninput = function() {
    video.volume = this.value; // Stel het volume in op de waarde van de slider
    volumeButton.textContent = video.volume > 0 ? "🔊" : "🔇"; // Update het icoon
};

// Sluit de slider als de muis ergens anders klikt
window.onclick = function(event) {
    if (!event.target.matches('#volume-button') && !event.target.matches('#volume-slider')) {
        sliderContainer.style.display = 'none';
    }
};

// Pauzeer de video
pauseButton.onclick = function() {
    if (video.paused) {
        video.play();
        pauseButton.textContent = "⏸️"; // Update naar pauze-icoon
    } else {
        video.pause();
        pauseButton.textContent = "▶️"; // Update naar speel-icoon
    }
};

// Begin met het afspelen van de video
video.play().catch(error => {
    console.error('Video kon niet worden afgespeeld:', error);
});
