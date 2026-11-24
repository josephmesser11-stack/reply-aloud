const toggle = document.querySelector('#auto');
const status = document.querySelector('#status');

async function initialize() {
  const { autoRead } = await chrome.storage.local.get({ autoRead: false });
  toggle.checked = autoRead;
  toggle.disabled = false;
}

toggle.addEventListener('change', async () => {
  toggle.disabled = true;
  const autoRead = toggle.checked;
  try {
    await chrome.storage.local.set({ autoRead });
    status.textContent = '';
  } catch (error) {
    toggle.checked = !autoRead;
    status.textContent = error.message;
  } finally {
    toggle.disabled = false;
  }
});

initialize().catch(error => { status.textContent = error.message; });
