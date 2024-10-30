import { showForm } from './formhandler.js'; 

window.questions = {
    nl: [
        { 
            question: "Kunnen elektromagnetische velden invloed hebben op medische hulpmiddelen?", 
            explanation: "Elektromagnetische velden kunnen invloed hebben op verschillende medische hulpmiddelen, denk aan pacemakers, hoortoestellen, insulinepompen en metalen protheses. Als je gebruik maakt van een van deze, of andere, medische hulpmiddelen, meld het bij je begeleider.", 
            video: "./Media/Question_parts/part_1.mp4", 
            correct: true
        },
        { 
            question: "Is het raadzaam vooraf aan je begeleider te melden als je een medisch hulpmiddel gebruikt?", 
            explanation: "Het is verstandig om aan je begeleider te melden als je een medisch hulpmiddel gebruikt. Op die manier kunnen wij jouw werk zo veilig mogelijk maken wanneer je op het antennepark bent.", 
            video: "./Media/Question_parts/part_1.mp4", 
            correct: true
        },
        { 
            question: "Mag je zonder begeleiding het antenneveld in?", 
            explanation: "Zonder begeleiding mag je niet het antenneveld in. Onze begeleiders zijn opgeleid om jou veilig te houden tijdens je werkzaamheden.", 
            video: "./Media/Question_parts/part_3.mp4", 
            correct: false
        },
        { 
            question: "Kan de apparatuur waarmee je werkt verstoord raken?", 
            explanation: "Elektromagnetische velden kunnen invloed hebben op apparatuur waarmee je werkt, bijvoorbeeld op hoogwerkers, hijskranen, elektrische gereedschap en meetapparatuur. Om te voorkomen dat je apparatuur tijdens je werkzaamheden verstoord raakt, is het raadzaam om dit te melden bij je begeleider, zodat er rekening mee gehouden kan worden.", 
            video: "./Media/Question_parts/part_4.mp4", 
            correct: true
        },
        { 
            question: "Mag je een aanwijzing van je begeleider negeren?", 
            explanation: "Onze begeleiders zijn ervoor om jou en je collega’s zo veilig mogelijk te laten werken. Wanneer zij een aanwijzing geven, is het verplicht die op te volgen.", 
            video: "./Media/Question_parts/part_5.mp4", 
            correct: false
        }
    ],
    en: [
        { 
            question: "Can electromagnetic fields affect medical devices?", 
            explanation: "Electromagnetic fields can affect a number of medical devices, such as pacemakers, hearing aids, insulin pumps and metal prosthetics. If you use one of these or other medical devices, notify your supervisor.", 
            video: "./Media/Question_parts_EN/part_1_EN.mp4", 
            correct: true
        },
        { 
            question: "Is it a good idea to notify your supervisor beforehand that you are using a medical device?", 
            explanation: "It is a good idea to tell your supervisor that you are using a medical device. That way they can make your working conditions as safe as possible while you are in the antenna park.", 
            video: "./Media/Question_parts_EN/part_1_EN.mp4", 
            correct: true
        },
        { 
            question: "Are you allowed in the antenna park unsupervised?", 
            explanation: "You are not allowed in the antenna park unsupervised. Our supervisors are trained to keep you safe during your time working there.", 
            video: "./Media/Question_parts_EN/part_3_EN.mp4", 
            correct: false
        },
        { 
            question: "Can the electromagnetic fields cause your tools to malfunction?", 
            explanation: "Electromagnetic fields can affect the tools you are working with: for example, work platforms, cranes, electric tools and measuring devices. To prevent your gear from malfunctioning during your work, tell your supervisor about your tools so they can be kept in mind.", 
            video: "./Media/Question_parts_EN/part_4_EN.mp4", 
            correct: true
        },
        { 
            question: "Are you allowed to ignore instructions from a supervisor?", 
            explanation: "Our supervisors are here to make sure you and your colleagues’ working conditions are as safe as possible. When they give you instructions, you have to follow them.", 
            video: "./Media/Question_parts_EN/part_5_EN.mp4", 
            correct: false
        }
    ]
};

window.checkAnswer = checkAnswer;


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
        
        showForm();
    }

    
    const buttons = document.querySelectorAll('.answer');
    buttons.forEach(button => {
        button.disabled = false;
        button.style.display = 'inline-block';
    });

    
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
        nextButton.remove();
    }
}


export function checkAnswer(answer) {
    const questions = window.questions[window.currentLanguage] || [];
    let currentQuestionIndex = window.currentQuestionIndex || 0;
    const correct = questions[currentQuestionIndex]?.correct;

    const messageElement = document.getElementById('message');
    const overlay = document.getElementById('overlay');
    const questionElement = document.getElementById('question');
    const buttons = document.querySelectorAll('.answer'); 

    
    buttons.forEach(button => {
        button.disabled = true;
    });

    
    if (questionElement) {
        questionElement.textContent = "";
    }
    buttons.forEach(button => {
        button.style.display = 'none';
    });

    if (answer === correct) {
        window.score = (window.score || 0) + 10;
        if (messageElement) { 
            messageElement.innerHTML = `<strong style="color: green;">Correct!</strong><br><br>
                <span style="color: white;">${questions[currentQuestionIndex].explanation}</span>`;
        }        

        
        const nextButton = document.createElement('button');
        nextButton.textContent = currentQuestionIndex === questions.length - 1 ? (window.currentLanguage === 'en' ? 'End' : 'Einde') : (window.currentLanguage === 'en' ? 'Next Question' : 'Volgende vraag');
        nextButton.id = 'next-button';
        nextButton.className = 'next-question-button';
        nextButton.addEventListener('click', () => {
            currentQuestionIndex++;
            window.currentQuestionIndex = currentQuestionIndex; 
            if (messageElement) {
                messageElement.textContent = ""; 
            }
            if (overlay) {
                overlay.style.display = 'none';
            }
            showQuestion();
        });

        overlay.appendChild(nextButton);
    } else {
        handleIncorrectAnswer(currentQuestionIndex);
    }
}


export function handleIncorrectAnswer(questionNumber) {
    const messageElement = document.getElementById('message');
    const overlay = document.getElementById('overlay');

    if (messageElement) {
        messageElement.innerHTML = `<strong style="color: red;">${window.currentLanguage === 'en' ? 'Wrong! You need to rewatch a segment of the video.' : 'Fout! Je moet een stuk van de video opnieuw bekijken.'}</strong>`;
    }

    setTimeout(() => {
        if (overlay) {
            overlay.style.display = 'none';
        }
        showRetryContainer(questionNumber); 
    }, 3000);
}


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

    
    retryContainer.style.display = 'flex';

    const retryButton = document.createElement('button');
    retryButton.textContent = window.currentLanguage === 'en' ? 'Retry Segment' : 'Herhaal stukje';
    retryButton.id = 'retry-button';
    retryButton.className = 'start-quiz-button'; 
    retryButton.addEventListener('click', () => {
        console.log("Retry-knop aangeklikt.");
        retryContainer.style.display = 'none';
        replayVideoSegment(questionNumber);
    });

    retryContainer.innerHTML = '';
    retryContainer.appendChild(retryButton);
    console.log("Retry-knop toegevoegd aan herhaal-quiz-container.");
}


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
        messageElement.innerHTML = `<span style="color: red;">${window.currentLanguage === 'en' ? 'Answer the question again.' : 'Beantwoord de vraag opnieuw.'}</span>`;
    }

    
    buttons.forEach(button => {
        button.disabled = false;
    });
}


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
