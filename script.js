const questions = [
    { question: "Gelden de risico’s voor alle antenneparken?", correct: false, startTime: 5, endTime: 12 },
    { question: "Hebben de EMV ook impact op insuline apparaat?", correct: true, startTime: 13, endTime: 20 },
    { question: "Mag je vrijlopen in het antenneveld?", correct: false, startTime: 21, endTime: 28 },
    { question: "Heb ik beschermende maatregelen nodig?", correct: true, startTime: 29, endTime: 36 },
    { question: "Hebben de EMV ook impact op digitale gereedschap?", correct: true, startTime: 37, endTime: 44 },
    { question: "Mag je in het zenderveld achter hekken (veiligheidscirkel) bevinden?", correct: false, startTime: 45, endTime: 52 },
    { question: "Mag je alleen het antenneveld in?", correct: false, startTime: 53, endTime: 60 },
    { question: "Als je honger hebt, mag je dan eten in het antenneveld?", correct: false, startTime: 61, endTime: 68 },
    { question: "Hoef je de aanwijzingen van technisch personeel in het antenneveld niet op te volgen?", correct: false, startTime: 69, endTime: 76 }
];

let currentQuestionIndex = 0;
let score = 0;
const overlay = document.getElementById('overlay');
const questionElement = document.getElementById('question');
const video = document.getElementById('video');
const startQuizButton = document.getElementById('start-quiz-button');
const startQuizContainer = document.getElementById('start-quiz-container');

startQuizButton.onclick = function() {
    startQuizContainer.style.display = 'none'; // Verberg de startknop
    video.play().catch(error => {
        console.error('Video kon niet worden afgespeeld:', error);
    });
};

function showQuestion() {
    if (currentQuestionIndex < questions.length) {
        questionElement.textContent = questions[currentQuestionIndex].question;
        messageElement.textContent = ""; // Wis het bericht voor de nieuwe vraag
    } else {
        showScore(); // Toon de score aan het einde
    }
}

function showScore() {
    overlay.innerHTML = `<h2>Quiz voltooid!</h2><h1>Jouw score: ${score}</h1>`; // Score in het midden tonen
    overlay.style.display = 'flex'; // Zorg ervoor dat de overlay zichtbaar is
}

function checkAnswer(answer) {
    const correct = questions[currentQuestionIndex].correct;

    // Schakel de knoppen uit
    buttons.forEach(button => {
        button.disabled = true; // Voorkom meerdere klikken
    });

    if (answer === correct) {
        score += 10;
        messageElement.textContent = "Correct!";
        messageElement.style.color = "green"; // Groen voor correcte antwoorden
    } else {
        messageElement.textContent = "Fout! Je moet een stuk van de video opnieuw bekijken.";
        messageElement.style.color = "red"; // Rood voor foute antwoorden
        
        // Wacht 3 seconden voordat je de overlay verbergt en het video-segment afspeelt
        setTimeout(() => {
            overlay.style.display = 'none'; // Verberg de overlay

            // Speel het video-segment af
            const startTime = questions[currentQuestionIndex].startTime;
            const endTime = questions[currentQuestionIndex].endTime;
            video.currentTime = startTime; // Spring naar de aangegeven starttijd
            video.play();

            // Stop de video na het eindtijd
            const interval = setInterval(() => {
                if (video.currentTime >= endTime) {
                    video.pause(); // Pauzeer de video
                    clearInterval(interval); // Stop de interval

                    // Toon de overlay weer voor herbeantwoording
                    overlay.style.display = 'flex'; 
                    messageElement.textContent = "Beantwoord de vraag opnieuw.";
                    
                    // Zet de knoppen weer aan
                    buttons.forEach(button => {
                        button.disabled = false; // Zet de knoppen weer aan
                    });
                }
            }, 100); // Controleer elke 100 ms
        }, 3000); // Wacht 3 seconden voor het verbergen van de overlay en afspelen van de video

        return; // Stop de functie hier om de score niet te verhogen
    }

    // Werk de score bij in de UI
    document.getElementById('score').textContent = `Score: ${score}`;

    // Ga na 2 seconden verder naar de volgende vraag
    setTimeout(() => {
        // Wis het bericht
        messageElement.textContent = ""; 
        // Zet de knoppen weer aan
        buttons.forEach(button => {
            button.disabled = false;
        });

        currentQuestionIndex++; // Verhoog de index naar de volgende vraag
        showQuestion(); // Toon de volgende vraag
    }, 2000); // Wacht 2 seconden voordat je de volgende vraag toont
}

// Pauzeer de video
document.getElementById('pause-button').onclick = function() {
    if (video.paused) {
        video.play();
        this.textContent = "⏸️"; // Pauze-icoon
    } else {
        video.pause();
        this.textContent = "▶️"; // Speel-icoon
    }
};

// Volume toggle functie
document.getElementById('volume-button').onclick = function() {
    const sliderContainer = document.getElementById('slider-container');
    sliderContainer.style.display = sliderContainer.style.display === 'block' ? 'none' : 'block';
};

// Volume instellen bij schuiven
document.getElementById('volume-slider').oninput = function() {
    video.volume = this.value; // Stel het volume in op de waarde van de slider
    document.getElementById('volume-button').textContent = video.volume > 0 ? "🔊" : "🔇"; // Update het icoon
};

// Sluit de slider als de muis ergens anders klikt
window.onclick = function(event) {
    if (!event.target.matches('#volume-button') && !event.target.matches('#volume-slider')) {
        document.getElementById('slider-container').style.display = 'none';
    }
};

// Begin met het afspelen van de video
video.play().catch(error => {
    console.error('Video kon niet worden afgespeeld:', error);
});
