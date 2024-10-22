document.addEventListener("DOMContentLoaded", function() {
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    
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
    const questionElement = document.getElementById('question');
    const messageElement = document.getElementById('message');
    const scoreElement = document.getElementById('score');
    const buttons = document.querySelectorAll('.answer');
    const startQuizContainer = document.getElementById('start-quiz-container');
    const startQuizButton = document.getElementById('start-quiz-button');
    const pauseButton = document.getElementById('pause-button');
    const volumeButton = document.getElementById('volume-button');
    const volumeSliderContainer = document.getElementById('slider-container');
    const volumeSlider = document.getElementById('volume-slider');

    let currentQuestionIndex = 0; 
    let score = 0;
    
    
    video.volume = 0.5; 
    volumeSlider.value = video.volume * 100; 

    
    if (isMobile) {
        
        video.removeAttribute('controls');

        
        video.addEventListener('seeking', (e) => {
            e.preventDefault();
            video.currentTime = e.target.currentTime; 
        });

        
        video.addEventListener('click', (e) => {
            e.preventDefault();
        });
    }

    
    function startQuiz() {
        startQuizContainer.style.display = 'none'; 
        video.play(); 
        updatePauseButtonIcon(true); 
    }

    
    startQuizButton.addEventListener('click', startQuiz);

    
    function updatePauseButtonIcon(isPlaying) {
        if (isPlaying) {
            pauseButton.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            pauseButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    
    pauseButton.onclick = function() {
        if (video.paused) {
            video.play();
            updatePauseButtonIcon(true);
        } else {
            video.pause();
            updatePauseButtonIcon(false);
        }
        
        
        if (startQuizContainer.style.display !== 'none') {
            startQuizContainer.style.display = 'none';
        }
    };

    
    volumeButton.onclick = function(event) {
        event.stopPropagation(); 
        if (volumeSliderContainer.style.display === 'block') {
            volumeSliderContainer.style.display = 'none';
        } else {
            volumeSliderContainer.style.display = 'block';
        }
    };

    
    window.onclick = function(event) {
        if (!event.target.matches('#volume-button') && !event.target.matches('#volume-slider')) {
            volumeSliderContainer.style.display = 'none';
        }
    };

    
    volumeSlider.oninput = function() {
        video.volume = this.value / 2;
        volumeButton.innerHTML = video.volume > 0 ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>'; 
    };

    
    buttons.forEach((button, index) => {
        button.onclick = () => {
            checkAnswer(index === 0); 
        };
    });

    
    function checkAnswer(answer) {
        const correct = questions[currentQuestionIndex].correct;

        if (answer === correct) {
            score += 10;
            messageElement.textContent = "Correct!";
            messageElement.style.color = "green";
            
            
            setTimeout(() => {
                currentQuestionIndex++;
                overlay.style.display = 'none'; 
                showQuestion(); 
            }, 2000);
        } else {
            handleIncorrectAnswer();
        }
    }

    
    const handleIncorrectAnswer = () => {
        messageElement.textContent = "Fout! Je moet een stuk van de video opnieuw bekijken.";
        messageElement.style.color = "red";
        setTimeout(() => {
            overlay.style.display = 'none';
            replayVideoSegment();
        }, 3000);
    };

    
    const replayVideoSegment = () => {
        const { startTime, endTime } = questions[currentQuestionIndex];
        video.currentTime = startTime; 
        video.play();

        const segmentEndListener = () => {
            if (video.currentTime >= endTime) {
                video.pause(); 
                video.removeEventListener('timeupdate', segmentEndListener);
                overlay.style.display = 'flex'; 
                messageElement.textContent = "Beantwoord de vraag opnieuw.";
                buttons.forEach(button => button.disabled = false);
            }
        };
        video.addEventListener('timeupdate', segmentEndListener);
    };

    
    const resetQuiz = () => {
        currentQuestionIndex = 0;
        score = 0;
        scoreElement.textContent = `Score: ${score}`;
        video.currentTime = 0;
        video.play();
        overlay.style.display = 'none';
        buttons.forEach(button => button.disabled = false);
    };

    
    function showQuestion() {
        if (currentQuestionIndex < questions.length) {
            const currentQuestion = questions[currentQuestionIndex];
            questionElement.textContent = currentQuestion.question;
            overlay.style.display = 'flex'; 
            video.pause(); 
            buttons.forEach(button => button.disabled = false); 
            messageElement.textContent = ""; 
        } else {
            showForm(); 
        }
    }

    
    function showForm() {
        overlay.innerHTML = `
            <h2>Quiz voltooid!</h2>
            <p>Je score: ${score}</p>
            <label for="firstName">Voornaam:</label>
            <input type="text" id="firstName" placeholder="Vul je voornaam in">
            <label for="lastName">Achternaam:</label>
            <input type="text" id="lastName" placeholder="Vul je achternaam in">
            <button id="submit-button">Genereer PDF</button>
            <button id="download-button" style="display:none;">Download PDF</button>
        `;
        document.getElementById('submit-button').onclick = handleSubmit;
        overlay.style.display = 'flex'; 
    }

    
    function handleSubmit() {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;

        if (!firstName || !lastName) {
            alert("Vul zowel je voornaam als achternaam in.");
            return;
        }

        generatePDF(firstName, lastName); 
    }

    
    function generatePDF(firstName, lastName) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'portrait', 
            unit: 'mm',
            format: 'a3' 
        });
    
        
        doc.setFillColor(143, 202, 231); 
        doc.rect(0, 0, 148.5, 420, 'F'); 
    
        
        const img = new Image();
        img.src = 'logo.png'; 
    
        img.onload = function() {
            
            const imgWidth = 90; 
            const imgHeight = (img.height / img.width) * imgWidth; 
            const imgX = (297 - imgWidth) / 2 + 31.5; 
            const imgY = 0; 
    
            doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);
    
            
            doc.setFontSize(60); 
            doc.setFont('helvetica', 'bold'); 
            doc.setTextColor('#FFFFFF'); 
            doc.text('Certificaat', 20, 170); 
    
            
            doc.setFontSize(20);
            doc.setFont('helvetica', 'normal'); 
            doc.setTextColor('#000000');
            doc.text('Ministerie van Defensie', 160, 150); 
            doc.text('De examencommissie verklaart dat:', 160, 170); 
    
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold'); 
            doc.text(`${firstName} ${lastName}`, 160, 185); 
            doc.setFontSize(18);
            doc.setFont('helvetica', 'normal'); 
    
            
            doc.text('heeft deelgenomen aan de quiz en is', 160, 205); 
            doc.text('geslaagd met een score van:', 160, 214); 
    
            
            doc.text(`Score: ${score}`, 160, 240);
    
            
            const currentDate = new Date().toLocaleDateString();
            const currentTime = new Date().toLocaleTimeString();
            doc.setFontSize(14);
            doc.text(`${currentDate}, ${currentTime}`, 160, 260);
    
            
            doc.save('certificaat.pdf');
        };
    }

    
    video.addEventListener('ended', () => {
        showQuestion(); 
    });
});
