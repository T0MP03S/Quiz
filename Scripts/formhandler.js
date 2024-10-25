// formHandlers.js

export function handleSubmit() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    if (!firstName || !lastName) {
        const alertMessage = window.currentLanguage === 'en' ? 'Please fill in both your first and last name.' : 'Vul zowel je voornaam als achternaam in.';
        alert(alertMessage);
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
    img.src = '../Media/logo.png'; // Stel dat index.html in een submap staat, bijvoorbeeld in 'public'

    img.onload = function() {
        const ministryText = window.currentLanguage === 'en' ? 'Ministry of Defence' : 'Ministerie van Defensie';
        const declarationText = window.currentLanguage === 'en' ? 'The examination board declares that:' : 'De examencommissie verklaart dat:';
        const imgWidth = 90; 
        const imgHeight = (img.height / img.width) * imgWidth; 
        const imgX = (297 - imgWidth) / 2 + 31.5; 
        const imgY = 0; 

        doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);

        doc.setFontSize(60); 
        doc.setFont('helvetica', 'bold'); 
        doc.setTextColor('#FFFFFF');
        const certificateTitle = window.currentLanguage === 'en' ? 'Certificate' : 'Certificaat';
        doc.text(certificateTitle, 20, 170); 

        doc.setFontSize(18);
        doc.setFont('helvetica', 'normal'); 
        doc.setTextColor('#000000');
        doc.text(ministryText, 160, 150); 
        doc.text(declarationText, 160, 165); 

        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold'); 
        doc.text(`${firstName} ${lastName}`, 160, 180); 
        doc.setFontSize(16);
        doc.setFont('helvetica', 'normal'); 

        const participationText = window.currentLanguage === 'en' ? 'has participated in the quiz and' : 'heeft deelgenomen aan de quiz en is';
        const passedText = window.currentLanguage === 'en' ? 'Passed with a score of:' : 'geslaagd met een score van:';
        doc.text(participationText, 160, 200); 
        doc.text(passedText, 160, 210); 

        doc.text(`Score: 100%`, 160, 230);

        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        doc.setFontSize(14);
        doc.text(`${currentDate}, ${currentTime}`, 160, 260);

        doc.save('certificaat.pdf');
    };
}

export function showForm() {
    const overlay = document.getElementById('overlay');
    const formTitle = window.currentLanguage === 'en' ? 'Quiz completed!' : 'Quiz voltooid!';
    const scoreText = window.currentLanguage === 'en' ? 'Your score:' : 'Je score:';
    const firstNameLabel = window.currentLanguage === 'en' ? 'First name:' : 'Voornaam:';
    const firstNamePlaceholder = window.currentLanguage === 'en' ? 'Enter your first name' : 'Vul je voornaam in';
    const lastNameLabel = window.currentLanguage === 'en' ? 'Last name:' : 'Achternaam:';
    const lastNamePlaceholder = window.currentLanguage === 'en' ? 'Enter your last name' : 'Vul je achternaam in';
    const generatePDFButton = window.currentLanguage === 'en' ? 'Generate PDF' : 'Genereer PDF';

    overlay.innerHTML = `
        <h2>${formTitle}</h2>
        <p>${scoreText} ${window.score || 0}</p>
        <label for="firstName">${firstNameLabel}</label>
        <input type="text" id="firstName" placeholder="${firstNamePlaceholder}">
        <label for="lastName">${lastNameLabel}</label>
        <input type="text" id="lastName" placeholder="${lastNamePlaceholder}">
        <button id="submit-button">${generatePDFButton}</button>
    `;
    document.getElementById('submit-button').onclick = handleSubmit;
    overlay.style.display = 'flex';
}
