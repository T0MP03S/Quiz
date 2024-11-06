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

    doc.setFillColor('#e17000'); 
    doc.rect(0, 0, 148.5, 420, 'F'); 

    const img = new Image();
    img.src = './Media/images/logo.png';

    img.onload = function() {
        const declarationText = window.currentLanguage === 'en' ? 'The VGM IT Infra team hereby declares that:' : 'Het team VGM IT Infra verklaart hierbij dat:';
        const quizText = window.currentLanguage === 'en' ? 'has successfully completed the Electromagnetic Fields questionnaire.' : 'De vragenlijst Elektromagnetische Velden correct heeft ingevuld.';
        const certificateTitle = window.currentLanguage === 'en' ? 'Certificate' : 'Certificaat';
        const imgWidth = 90; 
        const imgHeight = (img.height / img.width) * imgWidth;  
        const imgX = (297 - imgWidth) / 2 + 31.5; 
        const imgY = 0; 

        doc.addImage(img, 'PNG', imgX, imgY, imgWidth, imgHeight);

        doc.setFontSize(60);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#FFFFFF');
        doc.text(certificateTitle, 20, 150);

        let textX = 160;
        let textY = 140;

        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor('#000000');
        doc.splitTextToSize(declarationText, 110).forEach(line => {
            doc.text(line, textX, textY);
            textY += 10;
        });

        textY += 20;
        doc.setFontSize(26);
        doc.setFont('helvetica', 'bold');
        doc.text(`${firstName} ${lastName}`, textX, textY);

        textY += 30;
        doc.setFontSize(18);
        doc.setFont('helvetica', 'normal');
        doc.splitTextToSize(quizText, 110).forEach(line => {
            doc.text(line, textX, textY);
            textY += 10;
        });

        textY += 30;
        const currentDate = new Date();
        const currentDateString = currentDate.toLocaleDateString();
        const currentTime = currentDate.toLocaleTimeString();
        const validityDate = new Date(currentDate.setMonth(currentDate.getMonth() + 3)).toLocaleDateString();
        doc.setFontSize(14);
        doc.text(`${currentDateString}, ${currentTime}`, textX, textY);

        textY += 10;
        const validityText = window.currentLanguage === 'en' ? `Valid until: ${validityDate}` : `Geldig tot: ${validityDate}`;
        doc.text(validityText, textX, textY);

        doc.save('certificaat.pdf');
    };
}

export function showForm() {
    const overlay = document.getElementById('overlay');
    const formTitle = window.currentLanguage === 'en' ? 'Questionnaire completed!' : 'Vragenlijst voltooid!';
    const scoreText = window.currentLanguage === 'en' ? 'Your score:' : 'Je score:';
    const firstNameLabel = window.currentLanguage === 'en' ? 'First name:' : 'Voornaam:';
    const firstNamePlaceholder = window.currentLanguage === 'en' ? 'Enter your first name' : 'Vul je voornaam in';
    const lastNameLabel = window.currentLanguage === 'en' ? 'Last name:' : 'Achternaam:';
    const lastNamePlaceholder = window.currentLanguage === 'en' ? 'Enter your last name' : 'Vul je achternaam in';
    const generatePDFButton = window.currentLanguage === 'en' ? 'Generate PDF' : 'Genereer PDF';

    overlay.innerHTML = `
        <h2>${formTitle}</h2>
        <label for="firstName">${firstNameLabel}</label>
        <input type="text" id="firstName" placeholder="${firstNamePlaceholder}">
        <label for="lastName">${lastNameLabel}</label>
        <input type="text" id="lastName" placeholder="${lastNamePlaceholder}">
        <button id="submit-button">${generatePDFButton}</button>
    `;
    document.getElementById('submit-button').onclick = handleSubmit;
    overlay.style.display = 'flex';
}
