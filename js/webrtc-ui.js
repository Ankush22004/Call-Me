// ========== RINGTONE SETUP ==========
const ringtoneAudio = new Audio('sounds/ringtone.mp3');Add commentMore actions
ringtoneAudio.loop = true;
let localStream, peer, currentCall, callStartTime, callTimer;

function playRingtone() {
  ringtoneAudio.play().catch(e => {
    console.warn("🔇 Ringtone play failed:", e);
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const myIdSpan = document.getElementById('myId');
const peerIdInput = document.getElementById('peerIdInput');
const statusDiv = document.getElementById('status');
const incomingDiv = document.getElementById('incoming');
const callerIdSpan = document.getElementById('callerId');
const acceptBtn = document.getElementById("accept-btn");
const rejectBtn = document.getElementById("reject-btn");

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;

    peer = new Peer({
      host: "0.peerjs.com",
      port: 443,
      secure: true
    });

    peer.on('open', id => {
      myIdSpan.textContent = id;
    });

    peer.on('call', call => {
      playRingtone();
      updateStatus(`📞 Incoming call from ${call.peer}`, 'yellow');
      showIncomingPopup(call.peer,
        () => {
          stopRingtone();
          call.answer(localStream);
          currentCall = call;
          handleCall(call);
        },
        () => {
          stopRingtone();
          call.close();
          updateStatus('❌ Call Rejected', 'red');
        });
    });
  })
  .catch(err => {
    alert('⚠️ Error accessing camera/microphone.');
    console.error(err);
  });

function handleCall(call) {
  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
    incomingDiv.style.display = 'none';
    updateStatus('In Call', 'green');
    startCallTimer();
    logCall(call.peer, 'Received');
  });

  call.on('close', () => {
    endCall();
  });
}

function stopRingtone() {
  ringtoneAudio.pause();
  ringtoneAudio.currentTime = 0;
function makeCall() {
  const peerId = peerIdInput.value.trim();
  if (!peerId) return alert('Enter peer ID.');

  const call = peer.call(peerId, localStream);
  currentCall = call;
  updateStatus(`Calling ${peerId}...`, 'yellow');

  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
    updateStatus('In Call', 'green');
    startCallTimer();
    logCall(peerId, 'Outgoing');
  });

  call.on('close', () => {
    endCall();
  });
}

// ========== POPUP UI SETUP ==========

// Create popup container
const popup = document.createElement('div');
popup.id = 'incomingPopup';
popup.style.display = 'none';
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

// Add popup CSS
const style = document.createElement('style');
style.textContent = `
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
function endCall() {
  if (currentCall) {
    currentCall.close();
    currentCall = null;
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
`;
document.head.appendChild(style);

// ========== FUNCTION TO SHOW POPUP ==========
function showIncomingPopup(callerId, acceptCallback, rejectCallback) {
  document.getElementById('popupCallerId').textContent = `Caller ID: ${callerId}`;
  popup.style.display = 'flex';

  // Accept Button
  document.getElementById('acceptBtn').onclick = () => {
    popup.style.display = 'none';
    stopRingtone();
    acceptCallback(); // Execute accept logic
  };

  // Reject Button
  document.getElementById('rejectBtn').onclick = () => {
    popup.style.display = 'none';
    stopRingtone();
    rejectCallback(); // Execute reject logic
  };
  remoteVideo.srcObject = null;
  updateStatus('Call Ended', 'red');
  stopCallTimer();
}

function copyMyId() {
  const id = myIdSpan.textContent;
  navigator.clipboard.writeText(id).then(() => {
    alert("ID copied to clipboard!");
  });
}

function updateStatus(text, color) {
  statusDiv.textContent = `Status: ${text}`;
  statusDiv.style.color = color;
}

function startCallTimer() {
  callStartTime = Date.now();
  callTimer = setInterval(() => {
    const seconds = Math.floor((Date.now() - callStartTime) / 1000);
    statusDiv.textContent = `Status: In Call (${seconds}s)`;
  }, 1000);
}
function stopCallTimer() {
  clearInterval(callTimer);
}

function logCall(peerId, type) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${type} Call] with ${peerId} at ${timestamp}`);
