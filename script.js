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

const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const startQuizContainer = document.getElementById('start-quiz-container');
const questionElement = document.getElementById('question');
const messageElement = document.getElementById('message');
const buttons = document.querySelectorAll('.answer');
let currentQuestionIndex = 0; 
let score = 0; 
let attempts = 0; // Aantal pogingen per vraag

// Functie om de quiz te starten
document.getElementById('start-quiz-button').onclick = function() {
    startQuizContainer.style.display = 'none'; 
    video.play().catch(error => console.error('Video kon niet worden afgespeeld:', error));
};

// Event Listener voor wanneer de video eindigt
video.onended = function() {
    overlay.style.display = 'flex'; 
    showQuestion(); 
};

// Functie om de vraag te tonen
function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        questionElement.textContent = questions[currentQuestionIndex].question;
        video.pause(); 
        attempts = 0; // Reset pogingen voor de nieuwe vraag
        messageElement.textContent = ""; // Reset het bericht
        buttons.forEach(button => button.disabled = false); // Schakel knoppen in
    } else {
        showScore(); 
    }
}

// Functie om de score te tonen en het formulier weer te geven
function showScore() {
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

    // Event listener voor de verstuurknop
    document.getElementById('submit-button').onclick = function() {
        const name = document.getElementById('name').value;
        const lastname = document.getElementById('lastname').value;
        generatePDF(name, lastname);
        document.getElementById('download-button').style.display = 'block'; // Laat de downloadknop zien
    };
}

// Functie om een PDF te genereren
function generatePDF(name, lastname) {
    const { jsPDF } = window.jspdf; // Zorg ervoor dat jsPDF correct is geladen
    const doc = new jsPDF();
    doc.text(`Naam: ${name}`, 10, 10);
    doc.text(`Achternaam: ${lastname}`, 10, 20);
    doc.save('quiz_resultaat.pdf'); // Sla de PDF op
}

// Functie om het antwoord te controleren
function checkAnswer(answer) {
    const correct = questions[currentQuestionIndex].correct;
    buttons.forEach(button => button.disabled = true);

    if (answer === correct) {
        score += 10; 
        messageElement.textContent = "Correct!";
        messageElement.style.color = "green";
        document.getElementById('score').textContent = `Score: ${score}`;
        
        setTimeout(() => {
            messageElement.textContent = ""; 
            currentQuestionIndex++;
            showQuestion(); 
        }, 2000);
    } else {
        attempts++; // Verhoog het aantal pogingen

        if (attempts === 1) {
            // Bij de eerste fout
            messageElement.textContent = "Fout! Je moet een stuk van de video opnieuw bekijken.";
            messageElement.style.color = "red";
            
            setTimeout(() => {
                overlay.style.display = 'none';
                const startTime = questions[currentQuestionIndex].startTime;
                const endTime = questions[currentQuestionIndex].endTime;
                video.currentTime = startTime; 
                video.play();

                const interval = setInterval(() => {
                    if (video.currentTime >= endTime) {
                        video.pause(); 
                        clearInterval(interval);
                        overlay.style.display = 'flex'; 
                        messageElement.textContent = "Beantwoord de vraag opnieuw.";
                        buttons.forEach(button => button.disabled = false); // Schakel knoppen in
                    }
                }, 100);
            }, 3000); 
        } else if (attempts === 2) {
            // Bij de tweede fout
            messageElement.textContent = "Je hebt deze vraag twee keer fout beantwoord. Kijk de gehele video opnieuw.";
            buttons.forEach(button => button.disabled = true); 

            setTimeout(() => {
                // Reset de quiz
                currentQuestionIndex = 0; // Zet de huidige vraag terug naar 0
                score = 0; // Reset de score
                document.getElementById('score').textContent = `Score: ${score}`; // Update de score weergave
                video.currentTime = 0; // Zet de video tijd terug naar het begin
                video.play(); // Speel de video opnieuw af
                overlay.style.display = 'none'; // Verberg de overlay
                buttons.forEach(button => button.disabled = false); // Schakel knoppen in voor de nieuwe quiz
            }, 3000); 
        } else {
            // Bij meer dan twee fouten
            messageElement.textContent = "Beantwoord de vraag opnieuw.";
            buttons.forEach(button => button.disabled = false); // Schakel knoppen in
        }
    }
}

// Pauzeer of speel de video af
document.getElementById('pause-button').onclick = function() {
    if (video.paused) {
        video.play();
        this.textContent = "⏸️"; 
    } else {
        video.pause();
        this.textContent = "▶️"; 
    }
};

// Volume knoppen
document.getElementById('volume-button').onclick = function() {
    const sliderContainer = document.getElementById('slider-container');
    sliderContainer.style.display = sliderContainer.style.display === 'block' ? 'none' : 'block';
};

document.getElementById('volume-slider').oninput = function() {
    video.volume = this.value; 
    document.getElementById('volume-button').textContent = video.volume > 0 ? "🔊" : "🔇"; 
};

// Sluit volume slider bij klikken buiten het element
window.onclick = function(event) {
    if (!event.target.matches('#volume-button') && !event.target.matches('#volume-slider')) {
        document.getElementById('slider-container').style.display = 'none';
    }
};
