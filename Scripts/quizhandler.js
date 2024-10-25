import { showForm } from './formhandler.js'; // Voeg deze import toe bovenaan je bestand

window.questions = {
    nl: [
        { question: "Mag je vrijlopen in het antenneveld?", correct: false, video: "./Media/Question_parts/part_1.mp4" },
        { question: "Gelden de risico’s voor alle antenneparken?", correct: false, video: "./Media/Question_parts/part_2.mp4" },
    ],
    en: [
        { question: "Can you walk freely in the antenna field?", correct: false, video: "./Media/Question_parts_EN/part_1_EN.mp4" },
        { question: "Do the risks apply to all antenna parks?", correct: false, video: "./Media/Question_parts_EN/part_2_EN.mp4" },
    ]
};

window.checkAnswer = checkAnswer;

// Deze functie start de quiz
export function startQuiz() {
    const startQuizContainer = document.getElementById('start-quiz-container');
    const video = document.getElementById('video');

    if (startQuizContainer) {
        startQuizContainer.style.display = 'none';
    } else {
        console.warn("Het start-quiz-container-element is niet gevonden in de DOM.");
    }

    if (video) {
        video.play().catch(error => {
            console.warn("Autoplay werd geblokkeerd: ", error);
        });
        updatePauseButtonIcon(true);
    } else {
        console.error("Het video-element is niet gevonden in de DOM.");
    }
}

// Functie om het icoon van de pauze-/afspeelknop bij te werken
export function updatePauseButtonIcon(isPlaying) {
    const pauseButton = document.getElementById('pause-button');
    if (pauseButton) {
        if (isPlaying) {
            pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            pauseButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    } else {
        console.warn("Het pauze-/afspeelknop-element is niet gevonden in de DOM.");
    }
}

// Functie om de volgende vraag te tonen
export function showQuestion() {
    if (!window.currentLanguage) {
        console.warn("De huidige taal (window.currentLanguage) is niet ingesteld. Standaard taal wordt ingesteld op 'nl'.");
        window.currentLanguage = 'nl';
    }
    const questions = window.questions[window.currentLanguage] || [];
    const currentQuestionIndex = window.currentQuestionIndex || 0;
    const video = document.getElementById('video');
    const overlay = document.getElementById('overlay');
    const questionElement = document.getElementById('question');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');

    // Verander de tekst van de ja/nee knoppen op basis van de huidige taal
    if (yesButton && noButton) {
        if (window.currentLanguage === 'nl') {
            yesButton.textContent = 'Ja';
            noButton.textContent = 'Nee';
        } else if (window.currentLanguage === 'en') {
            yesButton.textContent = 'Yes';
            noButton.textContent = 'No';
        }
    }

    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        if (questionElement) {
            questionElement.textContent = currentQuestion.question;
        } else {
            console.warn("Het vraag-element is niet gevonden in de DOM.");
        }
        if (overlay) {
            overlay.style.display = 'flex';
        } else {
            console.warn("Het overlay-element is niet gevonden in de DOM.");
        }
        if (video) {
            video.src = currentQuestion.video;
            video.pause();
        } else {
            console.error("Het video-element is niet gevonden in de DOM.");
        }
    } else {
        // Toon formulier wanneer de quiz voltooid is
        showForm();
    }

    // Schakel de knoppen weer in na het tonen van de vraag
    const buttons = document.querySelectorAll('.answer');
    buttons.forEach(button => {
        button.disabled = false;
    });
}

// Functie om antwoorden te controleren
export function checkAnswer(answer) {
    const questions = window.questions[window.currentLanguage] || [];
    let currentQuestionIndex = window.currentQuestionIndex || 0;
    const correct = questions[currentQuestionIndex]?.correct;

    const messageElement = document.getElementById('message');
    const overlay = document.getElementById('overlay');
    const buttons = document.querySelectorAll('.answer'); // Alle antwoordknoppen

    // Schakel de knoppen uit tijdens de feedback
    buttons.forEach(button => {
        button.disabled = true;
    });

    if (answer === correct) {
        window.score = (window.score || 0) + 10;
        if (messageElement) {
            messageElement.textContent = "Correct!";
            messageElement.style.color = "green";
        }

        // Ga verder naar de volgende vraag na een korte vertraging
        setTimeout(() => {
            currentQuestionIndex++;
            window.currentQuestionIndex = currentQuestionIndex; // Bijwerken in de globale scope
            if (messageElement) {
                messageElement.textContent = ""; // Reset het bericht
            }
            if (overlay) {
                overlay.style.display = 'none';
            }
            showQuestion();
        }, 2000);
    } else {
        handleIncorrectAnswer(currentQuestionIndex);
    }
}

// Functie om een fout antwoord af te handelen
export function handleIncorrectAnswer(questionNumber) {
    const messageElement = document.getElementById('message');
    const overlay = document.getElementById('overlay');

    if (messageElement) {
        messageElement.textContent = window.currentLanguage === 'en' ? 'Wrong! You need to rewatch a segment of the video.' : 'Fout! Je moet een stuk van de video opnieuw bekijken.';
        messageElement.style.color = "red";
    }

    setTimeout(() => {
        if (overlay) {
            overlay.style.display = 'none';
        }
        showRetryContainer(questionNumber); // Speel het specifieke segment af
    }, 3000);
}

// Functie om een videosegment af te spelen
export function replayVideoSegment(questionNumber) {
    const questions = window.questions[window.currentLanguage] || [];
    const video = document.getElementById('video');

    if (video) {
        video.src = questions[questionNumber]?.video;
        video.play().catch(error => {
            console.warn("Autoplay werd geblokkeerd: ", error);
        });

        const segmentEndListener = () => {
            console.log("Het segment is afgelopen, de vraag wordt opnieuw gesteld.");
            video.pause();
            video.removeEventListener('ended', segmentEndListener);
            updateOverlayAndButtons();
        };

        video.addEventListener('ended', segmentEndListener);
    } else {
        console.error("Het video-element is niet gevonden in de DOM.");
    }
}

export function showRetryContainer(questionNumber) {
    console.log("showRetryContainer aangeroepen voor questionNumber: ", questionNumber);
    const retryContainer = document.getElementById('herhaal-quiz-container');
    if (!retryContainer) {
        console.error("Het herhaal-quiz-container-element is niet gevonden in de DOM.");
        return;
    }

    // Maak de herhaal-quiz-container zichtbaar
    retryContainer.style.display = 'flex';

    const retryButton = document.createElement('button');
    retryButton.textContent = window.currentLanguage === 'en' ? 'Retry Segment' : 'Herhaal stukje';
    retryButton.id = 'retry-button';
    retryButton.className = 'start-quiz-button'; // Gebruik dezelfde CSS-styling als de start-knop
    retryButton.addEventListener('click', () => {
        console.log("Retry-knop aangeklikt.");
        retryContainer.style.display = 'none';
        replayVideoSegment(questionNumber);
    });

    retryContainer.innerHTML = '';
    retryContainer.appendChild(retryButton);
    console.log("Retry-knop toegevoegd aan herhaal-quiz-container.");
}

// Functie om de overlay en knoppen bij te werken na het afspelen van een segment
export function updateOverlayAndButtons() {
    const overlay = document.getElementById('overlay');
    const messageElement = document.getElementById('message');
    const buttons = document.querySelectorAll('.answer');

    if (overlay) {
        overlay.style.display = 'flex';
    } else {
        console.warn("Het overlay-element is niet gevonden in de DOM.");
    }

    if (messageElement) {
        messageElement.textContent = window.currentLanguage === 'en' ? 'Answer the question again.' : 'Beantwoord de vraag opnieuw.';
        messageElement.style.color = "red";
    }

    // Schakel de knoppen weer in na het afspelen van een segment
    buttons.forEach(button => {
        button.disabled = false;
    });
}

// Functie om de quiz te resetten
export function resetQuiz() {
    window.currentQuestionIndex = 0;
    window.score = 0;
    const scoreElement = document.getElementById('score');
    const video = document.getElementById('video');
    const overlay = document.getElementById('overlay');

    if (scoreElement) {
        scoreElement.textContent = `Score: ${window.score}`;
    }

    if (video) {
        video.currentTime = 0;
        video.play().catch(error => {
            console.warn("Autoplay werd geblokkeerd: ", error);
        });
    } else {
        console.error("Het video-element is niet gevonden in de DOM.");
    }

    if (overlay) {
        overlay.style.display = 'none';
    }
}
