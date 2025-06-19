// ========== RINGTONE SETUP ==========
const ringtoneAudio = new Audio('sounds/ringtone.mp3');
ringtoneAudio.loop = true;

function playRingtone() {
  ringtoneAudio.play().catch(e => {
    console.warn("🔇 Ringtone play failed:", e);
  });
}

function stopRingtone() {
  ringtoneAudio.pause();
  ringtoneAudio.currentTime = 0;
}

// ========== POPUP UI SETUP ==========
const popup = document.createElement('div');
popup.id = 'incomingPopup';
popup.style.display = 'none';
popup.innerHTML = \`
  <div class="popup-content">
    <h3>📥 Incoming Call</h3>
    <p id="popupCallerId">Caller ID: </p>
    <div class="popup-buttons">
      <button id="acceptBtn">✅ Accept</button>
      <button id="rejectBtn">❌ Reject</button>
    </div>
  </div>
\`;
document.body.appendChild(popup);

const style = document.createElement('style');
style.textContent = \`
  #incomingPopup {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
  }
  .popup-content {
    background: #fff;
    padding: 25px 30px;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 0 18px rgba(0, 0, 0, 0.4);
    max-width: 300px;
    width: 90%;
  }
  .popup-content h3 {
    margin-bottom: 10px;
    font-size: 20px;
  }
  .popup-buttons {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-top: 15px;
  }
  .popup-buttons button {
    padding: 10px 20px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  #acceptBtn {
    background-color: #4CAF50;
    color: white;
  }
  #rejectBtn {
    background-color: #F44336;
    color: white;
  }
  #acceptBtn:hover {
    background-color: #45A049;
  }
  #rejectBtn:hover {
    background-color: #E53935;
  }
\`;
document.head.appendChild(style);

// ========== FUNCTION TO SHOW POPUP ==========
function showIncomingPopup(callerId, acceptCallback, rejectCallback) {
  document.getElementById('popupCallerId').textContent = \`Caller ID: \${callerId}\`;
  popup.style.display = 'flex';

  document.getElementById('acceptBtn').onclick = () => {
    popup.style.display = 'none';
    stopRingtone();
    acceptCallback();
  };

  document.getElementById('rejectBtn').onclick = () => {
    popup.style.display = 'none';
    stopRingtone();
    rejectCallback();
  };
}
