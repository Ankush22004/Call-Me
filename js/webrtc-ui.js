// Create Popup Elements
const popup = document.createElement('div');
popup.id = 'incomingPopup';
popup.innerHTML = `
  <div class="popup-content">
    <h3>📥 Incoming Call</h3>
    <p id="popupCallerId">Caller ID: </p>
    <div class="popup-buttons">
      <button id="acceptBtn">✅ Accept</button>
      <button id="rejectBtn">❌ Reject</button>
    </div>
  </div>
`;
document.body.appendChild(popup);

// Style the Popup (can move to CSS file later)
const style = document.createElement('style');
style.textContent = `
#incomingPopup {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.popup-content {
  background: #fff;
  padding: 20px 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 0 15px rgba(0,0,0,0.3);
}
.popup-buttons button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
`;
document.head.appendChild(style);

// UI Handling Functions
function showIncomingPopup(callerId, acceptCallback, rejectCallback) {
  document.getElementById('popupCallerId').textContent = `Caller ID: ${callerId}`;
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
