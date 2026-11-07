document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const landingHero = document.getElementById('landing-hero');
    const chatMessagesContainer = document.getElementById('chat-messages-container');
    const activeInputWrapper = document.getElementById('active-input-wrapper');

    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');

    const chatFormActive = document.getElementById('chat-form-active');
    const userInputActive = document.getElementById('user-input-active');

    const newChatBtn = document.getElementById('new-chat-btn');
    const recentsList = document.getElementById('recents-list');
    const greetingEl = document.getElementById('greeting-el');
    const personaSelect = document.getElementById('persona-select');
    const currentPersonaBadge = document.getElementById('current-persona-badge');

    // Mistral API Config (Standalone)
    const API_KEY = "mstrl_uZBlqvCdUQQ2M7O9T4bVBYZhLr44Otli_3dTOLK";
    const API_URL = "https://api.mistral.ai/v1/chat/completions";
    const MODEL = "ministral-3b-2512";

    // Persona System Prompts mapped to user choices
    const personaPrompts = {
        funny: "you are a funny ai agent",
        angry: "You are an angry ai agent. you should respond aggresively and impatiently",
        sad: "you are a sad ai agent. you should respond sadly and depressingly"
    };

    const personaLabels = {
        funny: "😄 Funny Agent",
        angry: "😡 Angry Agent",
        sad: "😢 Sad Agent"
    };

    let currentPersona = personaSelect ? personaSelect.value : 'funny';

    // Conversation state
    let conversationMessages = [
        { role: "system", content: personaPrompts[currentPersona] }
    ];
    let chatHistory = JSON.parse(localStorage.getItem('mistral_chat_history_v3') || '[]');

    // Persona change listener
    if (personaSelect) {
        personaSelect.addEventListener('change', (e) => {
            currentPersona = e.target.value;
            if (currentPersonaBadge) {
                currentPersonaBadge.textContent = personaLabels[currentPersona];
            }
            if (conversationMessages.length > 0 && conversationMessages[0].role === 'system') {
                conversationMessages[0].content = personaPrompts[currentPersona];
            } else {
                conversationMessages.unshift({ role: 'system', content: personaPrompts[currentPersona] });
            }
        });
    }

    // Set greeting name dynamically
    const hours = new Date().getHours();
    let timeGreet = "Back at it";
    if (hours < 12) timeGreet = "Good morning";
    else if (hours < 18) timeGreet = "Good afternoon";
    else timeGreet = "Good evening";
    if (greetingEl) {
        greetingEl.textContent = `${timeGreet}, Pratham`;
    }

    // Render Recents Sidebar
    function renderRecents() {
        if (!recentsList) return;
        recentsList.innerHTML = '';
        if (chatHistory.length === 0) {
            recentsList.innerHTML = '<div style="padding: 0.5rem 0.75rem; font-size: 0.8rem; color: var(--text-muted);">No recent chats</div>';
            return;
        }
        chatHistory.forEach((chat, index) => {
            const item = document.createElement('div');
            item.className = 'recent-chat-item';
            item.textContent = chat.title || 'Chat session';
            item.title = chat.title;
            item.addEventListener('click', () => loadChatSession(index));
            recentsList.appendChild(item);
        });
    }

    function saveToHistory(title) {
        chatHistory.unshift({
            title: title.length > 30 ? title.substring(0, 27) + '...' : title,
            messages: [...conversationMessages]
        });
        if (chatHistory.length > 15) chatHistory.pop();
        localStorage.setItem('mistral_chat_history_v3', JSON.stringify(chatHistory));
        renderRecents();
    }

    function loadChatSession(index) {
        const session = chatHistory[index];
        if (!session) return;
        conversationMessages = [...session.messages];

        if (landingHero) landingHero.style.display = 'none';
        if (chatMessagesContainer) chatMessagesContainer.style.display = 'flex';
        if (activeInputWrapper) activeInputWrapper.style.display = 'flex';

        if (chatMessagesContainer) {
            chatMessagesContainer.innerHTML = '';
            for (let i = 1; i < conversationMessages.length; i++) {
                const msg = conversationMessages[i];
                appendMessageUI(msg.role === 'user' ? 'user' : 'ai', msg.content);
            }
        }
    }

    function appendMessageUI(role, text) {
        if (!chatMessagesContainer) return;
        const isUser = role === 'user';
        const row = document.createElement('div');
        row.className = `message-row ${isUser ? 'user' : 'ai'}`;

        const avatarBox = document.createElement('div');
        avatarBox.className = 'msg-avatar-box';
        avatarBox.innerHTML = isUser ? 'P' : '<i data-lucide="sparkles" size="14"></i>';

        const bubble = document.createElement('div');
        bubble.className = 'msg-text-bubble';
        bubble.textContent = text;

        row.appendChild(avatarBox);
        row.appendChild(bubble);

        chatMessagesContainer.appendChild(row);
        lucide.createIcons();
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function showTypingUI() {
        if (!chatMessagesContainer) return;
        const row = document.createElement('div');
        row.className = 'message-row ai';
        row.id = 'typing-indicator-row';
        row.innerHTML = `
            <div class="msg-avatar-box"><i data-lucide="sparkles" size="14"></i></div>
            <div class="msg-text-bubble">
                <div style="display: flex; gap: 4px; align-items: center; padding: 4px 0;">
                    <div style="width:6px;height:6px;background:var(--primary);border-radius:50%;animation:bounce 1.4s infinite ease-in-out both;"></div>
                    <div style="width:6px;height:6px;background:var(--primary);border-radius:50%;animation:bounce 1.4s infinite ease-in-out both;animation-delay:0.2s;"></div>
                    <div style="width:6px;height:6px;background:var(--primary);border-radius:50%;animation:bounce 1.4s infinite ease-in-out both;animation-delay:0.4s;"></div>
                </div>
            </div>
        `;
        chatMessagesContainer.appendChild(row);
        lucide.createIcons();
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    function removeTypingUI() {
        const ind = document.getElementById('typing-indicator-row');
        if (ind) ind.remove();
    }

    async function handleSendMessage(text) {
        const trimmed = text.trim();
        if (!trimmed) return;

        if (landingHero && landingHero.style.display !== 'none') {
            landingHero.style.display = 'none';
            if (chatMessagesContainer) chatMessagesContainer.style.display = 'flex';
            if (activeInputWrapper) activeInputWrapper.style.display = 'flex';
        }

        // Clear both inputs
        if (userInput) userInput.value = '';
        if (userInputActive) userInputActive.value = '';

        appendMessageUI('user', trimmed);
        conversationMessages.push({ role: 'user', content: trimmed });

        showTypingUI();

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: conversationMessages,
                    temperature: 0.5
                })
            });

            removeTypingUI();

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error?.message || `Error ${response.status}`);
            }

            const data = await response.json();
            const aiReply = data.choices && data.choices[0] && data.choices[0].message
                ? data.choices[0].message.content
                : "I couldn't fetch a response.";

            appendMessageUI('ai', aiReply);
            conversationMessages.push({ role: 'assistant', content: aiReply });

            if (conversationMessages.length === 3) {
                saveToHistory(trimmed);
            }

        } catch (error) {
            removeTypingUI();
            appendMessageUI('ai', `⚠️ Error: ${error.message}`);
            conversationMessages.pop();
        }
    }

    // Attach listeners to Landing form
    if (chatForm && userInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSendMessage(userInput.value);
        });

        userInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(userInput.value);
            }
        });
    }

    // Attach listeners to Active Chat form
    if (chatFormActive && userInputActive) {
        chatFormActive.addEventListener('submit', (e) => {
            e.preventDefault();
            handleSendMessage(userInputActive.value);
        });

        userInputActive.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(userInputActive.value);
            }
        });
    }

    function startNewChat() {
        conversationMessages = [
            { role: "system", content: personaPrompts[currentPersona] }
        ];
        if (chatMessagesContainer) {
            chatMessagesContainer.innerHTML = '';
            chatMessagesContainer.style.display = 'none';
        }
        if (activeInputWrapper) activeInputWrapper.style.display = 'none';
        if (landingHero) landingHero.style.display = 'flex';
        if (userInput) userInput.value = '';
        if (userInputActive) userInputActive.value = '';
    }

    if (newChatBtn) {
        newChatBtn.addEventListener('click', startNewChat);
    }

    renderRecents();
});
