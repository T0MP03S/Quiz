const questions = [
    { question: "Gelden de risico’s voor alle antenneparken?", correct: false, startTime: 0, endTime: 5 },
    { question: "Hebben de EMV ook impact op insuline apparaat?", correct: true, startTime: 5, endTime: 10 },
    { question: "Mag je vrijlopen in het antenneveld?", correct: false, startTime: 10, endTime: 15 },
    { question: "Heb ik beschermende maatregelen nodig?", correct: true, startTime: 15, endTime: 20 },
    { question: "Hebben de EMV ook impact op digitale gereedschap?", correct: true, startTime: 20, endTime: 25 },
    { question: "Mag je in het zenderveld achter hekken (veiligheidscirkel) bevinden?", correct: false, startTime: 25, endTime: 30 },
    { question: "Mag je alleen het antenneveld in?", correct: false, startTime: 30, endTime: 35 },
    { question: "Als je honger hebt, mag je dan eten in het antenneveld?", correct: false, startTime: 35, endTime: 40 },
    { question: "Hoef je de aanwijzingen van technisch personeel in het antenneveld niet op te volgen?", correct: false, startTime: 40, endTime: 45 }
];

// Elementen ophalen
const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const startQuizContainer = document.getElementById('start-quiz-container');
const questionElement = document.getElementById('question');
const messageElement = document.getElementById('message');
const buttons = document.querySelectorAll('.answer');
const scoreElement = document.getElementById('score');
let currentQuestionIndex = 0; 
let score = 0; 
let attempts = 0; // Aantal pogingen per vraag

// Functie om de quiz te starten
const startQuiz = () => {
    startQuizContainer.style.display = 'none'; 
    video.play().catch(error => console.error('Video kon niet worden afgespeeld:', error));
};

document.getElementById('start-quiz-button').onclick = () => {
    startQuiz();
    document.getElementById('pause-button').innerHTML = '<i class="fas fa-pause"></i>';
};

// Event Listener voor wanneer de video eindigt
video.onended = () => {
    overlay.style.display = 'flex'; 
    showQuestion(); 
};

// Functie om de vraag te tonen
const showQuestion = () => {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        video.pause(); 
        attempts = 0; // Reset pogingen voor de nieuwe vraag
        messageElement.textContent = ""; // Reset het bericht
        buttons.forEach(button => button.disabled = false); // Schakel knoppen in
    } else {
        showScore(); 
    }
};

// Functie om de score te tonen en het formulier weer te geven
const showScore = () => {
    overlay.innerHTML = `
        <h2>Quiz voltooid!</h2>
        <p>Je score: ${score}</p>
        <label for="name">Naam:</label>
        <input type="text" id="name" placeholder="Vul je naam in">
        <label for="lastname">Achternaam:</label>
        <input type="text" id="lastname" placeholder="Vul je achternaam in">
        <button id="submit-button">Verstuur</button>
        <button id="download-button" style="display:none;">Download PDF</button>
    `;
    overlay.style.display = 'flex'; 

    document.getElementById('submit-button').onclick = handleSubmit;
};

// Functie om een PDF te genereren
const generatePDF = (name, lastname) => {
    const { jsPDF } = window.jspdf; // Zorg ervoor dat jsPDF correct is geladen
    const doc = new jsPDF();
    doc.text(`Naam: ${name}`, 10, 10);
    doc.text(`Achternaam: ${lastname}`, 10, 20);
    doc.save('quiz_resultaat.pdf'); // Sla de PDF op
};

// Functie om het formulier in te dienen
const handleSubmit = () => {
    const name = document.getElementById('name').value;
    const lastname = document.getElementById('lastname').value;
    generatePDF(name, lastname);
    document.getElementById('download-button').style.display = 'block'; // Laat de downloadknop zien
};

// Functie om het antwoord te controleren
const checkAnswer = (answer) => {
    const correct = questions[currentQuestionIndex].correct;
    buttons.forEach(button => button.disabled = true);

    if (answer === correct) {
        score += 10; 
        messageElement.textContent = "Correct!";
        messageElement.style.color = "green";
        scoreElement.textContent = `Score: ${score}`;

        setTimeout(() => {
            messageElement.textContent = ""; 
            currentQuestionIndex++;
            showQuestion(); 
        }, 2000);
    } else {
        handleIncorrectAnswer();
    }
};

// Functie om een fout antwoord te behandelen
const handleIncorrectAnswer = () => {
    attempts++;

    if (attempts === 1) {
        // Bij de eerste fout
        messageElement.textContent = "Fout! Je moet een stuk van de video opnieuw bekijken.";
        messageElement.style.color = "red";

        setTimeout(() => {
            overlay.style.display = 'none';
            replayVideoSegment();
        }, 3000);
    } else if (attempts === 2) {
        // Bij de tweede fout
        messageElement.textContent = "Je hebt deze vraag twee keer fout beantwoord. Kijk de gehele video opnieuw.";
        buttons.forEach(button => button.disabled = true);

        setTimeout(resetQuiz, 3000);
    } else {
        // Bij meer dan twee fouten
        messageElement.textContent = "Beantwoord de vraag opnieuw.";
        buttons.forEach(button => button.disabled = false);
    }
};

// Functie om een video segment opnieuw af te spelen
const replayVideoSegment = () => {
    const { startTime, endTime } = questions[currentQuestionIndex];
    video.currentTime = startTime; 
    video.play();

    const interval = setInterval(() => {
        if (video.currentTime >= endTime) {
            video.pause(); 
            clearInterval(interval);
            overlay.style.display = 'flex'; 
            messageElement.textContent = "Beantwoord de vraag opnieuw.";
            buttons.forEach(button => button.disabled = false);
        }
    }, 100);
};

// Functie om de quiz te resetten
const resetQuiz = () => {
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    video.currentTime = 0;
    video.play();
    overlay.style.display = 'none';
    buttons.forEach(button => button.disabled = false);
};

// Pauzeer of speel de video af
const toggleVideoPlay = () => {
    if (video.paused) {
        video.play();
        document.getElementById('pause-button').innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        video.pause();
        document.getElementById('pause-button').innerHTML = '<i class="fas fa-play"></i>';
    }
};

document.getElementById('pause-button').onclick = toggleVideoPlay;

document.getElementById('volume-slider').oninput = function() {
    video.volume = this.value; 
    document.getElementById('volume-button').innerHTML = video.volume > 0 ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
};

// Volume knoppen
const toggleVolumeSlider = (event) => {
    event.stopPropagation(); // Voorkom dat de klik op het icoontje het sluiten van de slider veroorzaakt
    const sliderContainer = document.getElementById('slider-container');
    if (sliderContainer.style.display === 'block') {
        sliderContainer.style.display = 'none';
    } else {
        sliderContainer.style.display = 'block';
    }
};

document.getElementById('volume-button').onclick = toggleVolumeSlider;

// Sluit volume slider bij klikken buiten het element
window.onclick = (event) => {
    if (!event.target.closest('#volume-button') && !event.target.closest('#slider-container')) {
        document.getElementById('slider-container').style.display = 'none';
    }
};

// Koppel knoppen aan de checkAnswer functie
buttons.forEach((button, index) => {
    button.onclick = () => checkAnswer(index === 0);
});
