import { startQuiz, showQuestion, handleIncorrectAnswer, replayVideoSegment, resetQuiz, updatePauseButtonIcon, checkAnswer } from './Scripts/quizhandler.js';
import { handleSubmit } from './Scripts/formhandler.js';

document.addEventListener("DOMContentLoaded", function() {
    
    const startQuizButton = document.getElementById('start-quiz-button');
    const pauseButton = document.getElementById('pause-button');
    const volumeButton = document.getElementById('volume-button');
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const video = document.getElementById('video');
    const languageButtons = document.querySelectorAll('.language-button');

    
    video.src = './Media/Video.mp4'; 
    video.volume = 1;

    
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const language = this.dataset.language;
            setLanguage(language);
        });
    });

    
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

    
    if (video) {
        video.addEventListener('ended', () => {
            if (window.currentQuestionIndex === undefined || window.currentQuestionIndex === 0) {
                
                showQuestion();
            } else {
                
                showQuestion();
            }
        });
    }

    
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        if (video) {
            video.removeAttribute('controls'); 

            
            video.setAttribute('playsinline', 'true');
            video.setAttribute('webkit-playsinline', 'true');

            
            video.addEventListener('seeking', (e) => {
                e.preventDefault();
                video.currentTime = video.startTime;
            });
        }
    }

    
    if (video) {
        video.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }

    
    if (video) {
        video.addEventListener('dblclick', (e) => {
            e.preventDefault();
        });
    }
});

window.setLanguage = function(language) {
    window.currentLanguage = language; 
    window.currentQuestionIndex = 0;
    window.score = 0;

    
    const videoElement = document.getElementById('video');
    const startQuizButton = document.getElementById('start-quiz-button');
    if (language === 'nl') {
        videoElement.src = './Media/Video.mp4';
        if (startQuizButton) {
            startQuizButton.textContent = 'Begin video';
        }
    } else if (language === 'en') {
        videoElement.src = './Media/Video_EN.mp4';
        videoElement.onerror = function() {
            console.warn("Engelse video niet gevonden of kan niet worden afgespeeld. Gebruik de Nederlandse versie als fallback.");
            videoElement.src = './Media/Video.mp4';
        };
        if (startQuizButton) {
            startQuizButton.textContent = 'Start video';
        }
    }

    
    videoElement.pause();

    
    const startQuizContainer = document.getElementById('start-quiz-container');
    if (startQuizContainer && startQuizButton) {
        startQuizContainer.style.display = 'flex';
        startQuizButton.style.display = 'block';
    }

    
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
        videoElement.src = currentQuestion.video; 
        questionElement.textContent = currentQuestion.question; 
    }
}
