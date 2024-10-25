import { startQuiz, showQuestion, handleIncorrectAnswer, replayVideoSegment, resetQuiz, updatePauseButtonIcon, checkAnswer } from './Scripts/quizhandler.js';
import { handleSubmit } from './Scripts/formhandler.js';

document.addEventListener("DOMContentLoaded", function() {
    // DOM-elementen ophalen
    const startQuizButton = document.getElementById('start-quiz-button');
    const pauseButton = document.getElementById('pause-button');
    const volumeButton = document.getElementById('volume-button');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const video = document.getElementById('video');
    const languageButtons = document.querySelectorAll('.language-button');

    // Initiële instellingen
    video.src = './Media/intro.mp4'; // Standaard in het Nederlands
    video.volume = 1;

    // Event listener voor taalkeuze
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const language = this.dataset.language;
            setLanguage(language);
        });
    });

    // Event listeners instellen
    if (startQuizButton) {
        startQuizButton.addEventListener('click', function(e) {
            e.preventDefault();
            startQuiz();
            video.play().catch(error => {
                console.warn("Autoplay werd geblokkeerd: ", error);
            });
            updatePauseButtonIcon(true);
            startQuizButton.style.display = 'none';
        });
    }

    if (pauseButton) {
        pauseButton.addEventListener('click', function() {
            if (video.paused) {
                video.play();
                updatePauseButtonIcon(true);
                const startQuizContainer = document.getElementById('start-quiz-container');
                if (startQuizContainer) {
                    startQuizContainer.style.display = 'none';
                }
            } else {
                video.pause();
                updatePauseButtonIcon(false);
            }
        });
    }

    if (volumeButton) {
        volumeButton.addEventListener('click', function(event) {
            event.stopPropagation();
            video.muted = !video.muted;
            volumeButton.innerHTML = video.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        });
    }

    if (yesButton) {
        yesButton.addEventListener('click', () => checkAnswer(true));
    }
    if (noButton) {
        noButton.addEventListener('click', () => checkAnswer(false));
    }

    // Video event listener om vragen te tonen na afloop van segmenten
    if (video) {
        video.addEventListener('ended', () => {
            if (window.currentQuestionIndex === undefined || window.currentQuestionIndex === 0) {
                // Begin met de quizvragen als de introductievideo voorbij is
                showQuestion();
            } else {
                // Ga verder met de vragen als een segment afgelopen is
                showQuestion();
            }
        });
    }

    // Beperkingen voor mobiele gebruikers
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        if (video) {
            video.removeAttribute('controls'); // Verwijder standaard videobediening

            // Voorkom fullscreen activering op mobiele apparaten
            video.setAttribute('playsinline', 'true');
            video.setAttribute('webkit-playsinline', 'true');

            // Voorkom dat gebruikers de video kunnen overslaan of terugspoelen
            video.addEventListener('seeking', (e) => {
                e.preventDefault();
                video.currentTime = video.startTime;
            });
        }
    }

    // Verwijder contextmenu (rechtermuisknop) op de video
    if (video) {
        video.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    // Verwijder dubbelklikken om fullscreen te openen op mobiele apparaten
    if (video) {
        video.addEventListener('dblclick', (e) => {
            e.preventDefault();
        });
    }
});

window.setLanguage = function(language) {
    window.currentLanguage = language; // Sla de huidige taal op
    window.currentQuestionIndex = 0;
    window.score = 0;

    // Stel de juiste introductievideo in op basis van de taal
    const videoElement = document.getElementById('video');
    const startQuizButton = document.getElementById('start-quiz-button');
    if (language === 'nl') {
        videoElement.src = './Media/intro.mp4';
        if (startQuizButton) {
            startQuizButton.textContent = 'Begin video';
        }
    } else if (language === 'en') {
        videoElement.src = './Media/intro_EN.mp4';
        videoElement.onerror = function() {
            console.warn("Engelse video niet gevonden of kan niet worden afgespeeld. Gebruik de Nederlandse versie als fallback.");
            videoElement.src = './Media/intro.mp4';
        };
        if (startQuizButton) {
            startQuizButton.textContent = 'Start video';
        }
    }

    // Pauzeer de video en stel de startknop in
    videoElement.pause();

    // Toon de startknop opnieuw bij taalwijziging tijdens de video
    const startQuizContainer = document.getElementById('start-quiz-container');
    if (startQuizContainer && startQuizButton) {
        startQuizContainer.style.display = 'flex';
        startQuizButton.style.display = 'block';
    }

    // Log de gekozen taal voor debugging
    console.log(`Taal ingesteld op: ${language}`);
}

window.updateVideoAndQuestion = function() {
    const questions = window.questions && window.questions[window.currentLanguage] ? window.questions[window.currentLanguage] : [];
    if (!questions || questions.length === 0) {
        console.warn('Geen vragen gevonden voor de huidige taal. Controleer of de vragen correct zijn geladen.');
    }
    const videoElement = document.getElementById('video');
    const questionElement = document.getElementById('question');

    if (questions && questions.length > 0) {
        const currentQuestion = questions[window.currentQuestionIndex];
        videoElement.src = currentQuestion.video; // Update de video met de juiste taalversie
        questionElement.textContent = currentQuestion.question; // Update de vraagtekst
    }
}
