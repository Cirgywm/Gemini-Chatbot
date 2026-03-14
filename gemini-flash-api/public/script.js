const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

let isThinking = false;
let thinkingMessageEl = null;

// Update the last "thinking" message (if present), otherwise append a new bot message.
function setBotMessage(text) {
  if (thinkingMessageEl) {
    thinkingMessageEl.textContent = text;
  } else {
    thinkingMessageEl = appendMessage('bot', text);
  }
}

// Append a message to the chat box and return the created element.
function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

// Enable/disable the form while awaiting response.
function setFormEnabled(enabled) {
  input.disabled = !enabled;
  form.querySelector('button[type="submit"]').disabled = !enabled;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isThinking) return;

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  isThinking = true;
  setFormEnabled(false);
  thinkingMessageEl = appendMessage('bot', 'Thinking...');

  try {
    const resp = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation: [{ role: 'user', text: userMessage }],
      }),
    });

    if (!resp.ok) {
      throw new Error(`Server returned ${resp.status}`);
    }

    const data = await resp.json();

    if (!data || typeof data.generatedText !== 'string' || data.generatedText.trim() === '') {
      setBotMessage('Sorry, no response received.');
    } else {
      setBotMessage(data.generatedText.trim());
    }
  } catch (err) {
    console.error('Chat request failed:', err);
    setBotMessage('Failed to get response from server.');
  } finally {
    isThinking = false;
    setFormEnabled(true);
    thinkingMessageEl = null;
  }
});