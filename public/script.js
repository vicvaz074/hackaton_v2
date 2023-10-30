const BASE_URL = window.location.hostname === "localhost" ? "http://localhost:3000" : "https://hackaton-v2.vercel.app";

const chatArea = document.getElementById('chatArea');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const scheduleBtn = document.querySelector('.schedule-btn');
const scheduleForm = document.querySelector('.form-container');
const modal = document.getElementById("imageModal");
const closeModal = document.getElementById("closeModal");
const uploadImageBtn = document.getElementById("uploadImageBtn");

var selectedCar = null;

document.addEventListener('DOMContentLoaded', (event) => {
    displayBotMessage("¡Hola! Soy el asistente virtual de Liverpool. ¿En qué puedo ayudarte? ¿Quieres agendar una cita, obtener ayuda con un manual o algo más?");
});

function displayUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user-message';
    messageDiv.innerText = message;
    chatArea.appendChild(messageDiv);
}

function hideTypingAnimation() {
    const typingAnimations = document.querySelectorAll('.typing-animation');
    typingAnimations.forEach(animation => {
        animation.style.display = 'none';
    });
}

function displayBotMessage(message) {
    hideTypingAnimation();
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot-message';
    messageDiv.innerText = message;
    chatArea.appendChild(messageDiv);
}

car1.addEventListener("click", async function() {
    selectedCar = "Car1"; 
    updateHeaderAndButtonsVisibility(selectedCar);
});
  
car2.addEventListener("click", async function() {
    selectedCar = "Car2"; 
    updateHeaderAndButtonsVisibility(selectedCar);
});

car3.addEventListener("click", async function() {
    selectedCar = "Car3"; 
    updateHeaderAndButtonsVisibility(selectedCar);
});

returnButton.addEventListener("click", function() {
    handleReturnButtonClick();
    selectedCar = null;
});

function updateHeaderAndButtonsVisibility(carName) {
    document.getElementById("header").innerText = carName;
    document.getElementById("car1").style.display = "none";
    document.getElementById("car2").style.display = "none";
    document.getElementById("car3").style.display = "none";
    document.getElementById("return").style.display = "inline";
}

function handleReturnButtonClick() {
    document.getElementById("header").innerText = "";
    document.getElementById("car1").style.display = "inline";
    document.getElementById("car2").style.display = "inline";
    document.getElementById("car3").style.display = "inline";
    document.getElementById("return").style.display = "none";
}

sendBtn.addEventListener('click', async function() {
    const message = userInput.value.trim();

    if (message) {
        displayUserMessage(message);

        if (message.toLowerCase().includes('agendar') || message.toLowerCase().includes('cita')) {
            displayBotMessage("¡Genial! Por favor, llena el formulario que aparecerá abajo para agendar tu cita.");
            showForm();
            userInput.value = '';
            return;
        }

        const typingAnimation = document.createElement('div');
        typingAnimation.className = 'typing-animation';
        chatArea.appendChild(typingAnimation);
        
        try {
            const response = await fetch(`${BASE_URL}/api/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: message, selectedCar: selectedCar })
            });

            const data = await response.json();
            displayBotMessage(data.response);
        } catch (error) {
            hideTypingAnimation();
            console.error("Error fetching response:", error);
            displayBotMessage("Lo siento, hubo un error procesando tu pregunta. Por favor, inténtalo de nuevo más tarde.");
        }
    }
    
    userInput.value = '';
});

function showForm() {
    if (scheduleForm.classList.contains('hidden')) {
        scheduleForm.classList.remove('hidden');
        scheduleForm.style.maxHeight = scheduleForm.scrollHeight + "px";
    } else {
        scheduleForm.style.maxHeight = '0';
        setTimeout(() => {
            scheduleForm.classList.add('hidden');
        }, 500);
    }
}

// Inicializar EmailJS
emailjs.init("QGSc5jsPsYfsiYScA");

document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const template_params = {
        "to_name": "Administrador",
        "from_name": "AutoBotMX",
        "message": `Nombre: ${document.getElementById('nombre').value}, Email: ${document.getElementById('email').value}, Celular: ${document.getElementById('cel').value}, Fecha deseada: ${document.getElementById('fecha').value}`
    }

    template_params.to_email = 'vicentito987@gmail.com'; 

    emailjs.send("service_w6lwqo2", "template_1thethc", template_params)
        .then(function (response) {
            console.log('Correo enviado exitosamente!', response.status, response.text);
        }, function (error) {
            console.log('Error al enviar correo:', error);
        });

    document.getElementById('contact-form').reset();
});

scheduleBtn.addEventListener('click', showForm);

userInput.addEventListener('keydown', function(event) {
    if (event.keyCode === 13 && userInput.value.trim() !== '') {
        event.preventDefault();
        sendBtn.click();
    }
});

document.getElementById("imageBtn").addEventListener('click', () => {
    modal.style.display = "block";
});

closeModal.addEventListener('click', () => {
    modal.style.display = "none";
});

window.addEventListener('click', (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
});

uploadImageBtn.addEventListener('click', async () => {
    const fileInput = document.getElementById("modalImageInput");
    const description = document.getElementById("imageDescription").value;
    const file = fileInput.files[0];

    if (file && description) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'chat-message user-message';
            
            const imgTag = document.createElement('img');
            imgTag.src = e.target.result;
            imgTag.alt = 'Imagen subida por el usuario';
            imgTag.style.width = '50%';
            imageDiv.appendChild(imgTag);

            const descTag = document.createElement('p');
            descTag.innerText = description;
            imageDiv.appendChild(descTag);

            chatArea.appendChild(imageDiv);
        }
        reader.readAsDataURL(file);

        const typingAnimation = document.createElement('div');
        typingAnimation.className = 'typing-animation';
        chatArea.appendChild(typingAnimation);
        
        try {
            const response = await fetch(`${BASE_URL}/api/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: description, selectedCar: selectedCar })
            });

            const data = await response.json();
            displayBotMessage(data.response);
        } catch (error) {
            hideTypingAnimation();
            console.error("Error fetching response:", error);
            displayBotMessage("Lo siento, hubo un error procesando tu descripción. Por favor, inténtalo de nuevo más tarde.");
        }
    }
    
    modal.style.display = "none";
});
