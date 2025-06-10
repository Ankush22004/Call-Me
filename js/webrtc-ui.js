// Create popup elements
const incomingPopup = document.createElement('div');
incomingPopup.id = 'incomingPopup';
incomingPopup.innerHTML = `
  <div class="popup-card">
    <h3>📥 Incoming Call</h3>
    <p>From: <span id="popupCallerId"></span></p>
    <div class="popup-buttons">
      <button id="acceptCall">✅ Accept</button>
      <button id="rejectCall">❌ Reject</button>
    </div>
  </div>
`;
document.body.appendChild(incomingPopup);

// Style the popup via JS (or move this to CSS later)
const popupStyle = document.createElement('style');
popupStyle.textContent = `
  #incomingPopup {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border: 2px solid #4CAF50;
    padding: 20px;
    z-index: 1000;
    display: none;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    border-radius: 10px;
  }
  .popup-card h3 {
    margin: 0 0 10px;
  }
  .popup-buttons {
    margin-top: 15px;
    text-align: center;
  }
  .popup-buttons button {
    margin: 0 10px;
    padding: 10px 20px;
    font-size: 1em;
  }
`;
document.head.appendChild(popupStyle);

// Show popup
function showIncomingPopup(peerId, onAccept, onReject) {
  document.getElementById('popupCallerId').textContent = peerId;
  incomingPopup.style.display = 'block';

  const acceptBtn = document.getElementById('acceptCall');
  const rejectBtn = document.getElementById('rejectCall');

  acceptBtn.onclick = () => {
    incomingPopup.style.display = 'none';
    onAccept();
  };

  rejectBtn.onclick = () => {
    incomingPopup.style.display = 'none';
    onReject();
  };
}
