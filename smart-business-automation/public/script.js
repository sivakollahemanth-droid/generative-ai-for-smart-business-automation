const taskType = document.getElementById('taskType');
const inputText = document.getElementById('inputText');
const generateBtn = document.getElementById('generateBtn');
const statusMsg = document.getElementById('statusMsg');
const resultSection = document.getElementById('resultSection');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');

function setStatus(message, type) {
  statusMsg.textContent = message;
  statusMsg.className = `status ${type || ''}`;
}

generateBtn.addEventListener('click', async () => {
  const details = inputText.value.trim();

  if (!details) {
    setStatus('Please enter some task details first.', 'error');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';
  setStatus('Contacting the AI model, please wait...', '');
  resultSection.classList.add('hidden');

  try {
    const response = await fetch('/api/automate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskType: taskType.value,
        input: details,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed.');
    }

    resultText.textContent = data.result;
    resultSection.classList.remove('hidden');
    setStatus('Done!', 'success');
  } catch (err) {
    setStatus(err.message || 'Something went wrong.', 'error');
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate';
  }
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(resultText.textContent);
    setStatus('Copied to clipboard!', 'success');
  } catch (err) {
    setStatus('Could not copy automatically — please select and copy manually.', 'error');
  }
});
