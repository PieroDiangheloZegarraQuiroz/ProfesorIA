document.getElementById("promptForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevenir envío tradicional

    const promptInput = document.getElementById("prompt");
    const userMessage = promptInput.value;
    const spinner = document.getElementById("spinner");
    const loadingText = document.getElementById("loadingText");
    const messages = document.getElementById("messages");

    // Agregar mensaje del usuario al chat
    addMessage(userMessage, 'user');
    promptInput.value = ""; // Limpiar el input

    // Mostrar el spinner y el texto de carga
    spinner.style.display = "block";
    loadingText.style.display = "block";

    fetch("https://635b-35-199-163-143.ngrok-free.app/predict/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: userMessage }) // Enviar el prompt al backend
    })
    .then(response => response.json())
    .then(data => {
        spinner.style.display = "none";
        loadingText.style.display = "none";
        
        // Agregar respuesta del bot al chat
        addMessage(data.response, 'bot');
    })
    .catch(error => {
        console.error("Error:", error);
        spinner.style.display = "none";
        loadingText.style.display = "none";

        // Mostrar mensaje de error en el chat
        addMessage("Ocurrió un error al generar el texto.", 'bot');
    });
});

// Función para agregar mensajes al chat
function addMessage(text, sender) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender}`;
    messageElement.textContent = text;
    document.getElementById("messages").prepend(messageElement); // Agregar al inicio del chat
}
