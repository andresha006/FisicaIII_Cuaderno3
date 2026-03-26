document.addEventListener('DOMContentLoaded', () => {

    const toggleBtn = document.getElementById('chatbot-toggle');
    const panel = document.getElementById('chatbot-panel');
    const closeBtn = document.getElementById('chatbot-close');
    const inputField = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messagesContainer = document.getElementById('chat-messages');

    // Claves y Configuración API
    const API_KEY = "AIzaSyC2uOo0JrbhEhv9ZRx1r4KMh4TMc0v6RY0";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    // Prompt del sistema para darle personalidad e instrucciones
    const systemInstruction = `Eres un asistente virtual llamado "Guía IA" especializado en un Cuaderno Interactivo de Física III sobre Ondas.
Tu objetivo es ayudar al estudiante a entender los temas principales: Ondas Estacionarias y el fenómeno de Interferencia.
Mantén un tono amigable, didáctico y alentador. Si te preguntan sobre el cuaderno, diles que pueden hacer clic en el libro para abrir sus apuntes completos y que pronto habrán animaciones disponibles en la sección correspondiente. Responde de manera concisa.`;

    // Historial de la conversacion (formato Gemini)
    let chatHistory = [];

    // --- UI LOGIC ---

    // Toggle Chat Panel
    toggleBtn.addEventListener('click', () => {
        panel.classList.toggle('hidden');
        if(!panel.classList.contains('hidden')) {
            inputField.focus();
        }
    });

    closeBtn.addEventListener('click', () => {
        panel.classList.add('hidden');
    });

    // Send Message
    const sendMessage = async () => {
        const text = inputField.value.trim();
        if (!text) return;

        // Añadir mensaje de usuario a la UI
        appendMessage('user', text);
        inputField.value = '';
        
        // Bloquear input mientras responde
        inputField.disabled = true;
        sendBtn.disabled = true;

        // Añadir indicador de "escribiendo..."
        const loadingId = appendMessage('bot', 'Pensando...');

        try {
            // Llamar a la API
            const responseText = await callGeminiAPI(text);
            
            // Actualizar el mensaje de "escribiendo..." con la respuesta
            updateMessage(loadingId, responseText);
        } catch (error) {
            console.error(error);
            updateMessage(loadingId, 'Lo siento, hubo un error al conectar con mis sensores de ondas. Intenta de nuevo.');
        } finally {
            inputField.disabled = false;
            sendBtn.disabled = false;
            inputField.focus();
        }
    };

    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // --- HELPER FUNCTIONS ---

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-msg`;
        
        // Asignar ID unico si queremos actualizarlo luego (ej. loading)
        const id = 'msg-' + Date.now();
        msgDiv.id = id;
        
        // Parsear markdown básico de la respuesta
        msgDiv.innerHTML = sender === 'bot' ? marked.parse(text) : escapeHTML(text);
        
        messagesContainer.appendChild(msgDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return id;
    }

    function updateMessage(id, newText) {
        const msgDiv = document.getElementById(id);
        if(msgDiv) {
            msgDiv.innerHTML = marked.parse(newText);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }

    // --- API LOGIC ---

    async function callGeminiAPI(userText) {
        // Añadir el input del usuario al historial
        chatHistory.push({
            role: "user",
            parts: [{ text: userText }]
        });

        const requestBody = {
            system_instruction: {
                parts: [{ text: systemInstruction }]
            },
            contents: chatHistory,
            generationConfig: {
                temperature: 0.7,
            }
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Extraer texto
        let botText = "No entendí.";
        if (data.candidates && data.candidates.length > 0) {
            botText = data.candidates[0].content.parts[0].text;
        }

        // Guardar la respuesta en el historial
        chatHistory.push({
            role: "model",
            parts: [{ text: botText }]
        });

        return botText;
    }
});
