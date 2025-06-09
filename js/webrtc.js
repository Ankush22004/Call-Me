let localStream;
let peer;
let currentCall;
let callStartTime;
let callTimer;

// Get UI Elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const myIdSpan = document.getElementById('myId');
const peerIdInput = document.getElementById('peerIdInput');
const statusDiv = document.getElementById('status');
const incomingDiv = document.getElementById('incoming');
const callerIdSpan = document.getElementById('callerId');

// Get Media Stream
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;

    peer = new Peer();

    peer.on('open', id => {
      myIdSpan.textContent = id;
    });

    peer.on('call', call => {
      callerIdSpan.textContent = call.peer;
      incomingDiv.style.display = 'block';
      updateStatus(`Incoming call from ${call.peer}`, 'yellow');

      // Accept/Reject prompt
      const accept = confirm(`Incoming call from ${call.peer}. Accept?`);
      if (accept) {
        call.answer(localStream);
        currentCall = call;
        handleCall(call);
      } else {
        call.close();
        updateStatus('Call Rejected', 'red');
      }
    });
  })
  .catch(err => {
    alert('Error accessing camera/mic.');
    console.error(err);
  });

// Handle Call Stream
function handleCall(call) {
  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
    incomingDiv.style.display = 'none';
    updateStatus('In Call', 'green');
    startCallTimer();
    logCall(call.peer, 'Received');
  });

  call.on('close', () => {
    remoteVideo.srcObject = null;
    updateStatus('Call Ended', 'red');
    stopCallTimer();
  });
}

// Make a call
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
    remoteVideo.srcObject = null;
    updateStatus('Call Ended', 'red');
    stopCallTimer();
  });
}

// End current call
function endCall() {
  if (currentCall) {
    currentCall.close();
    remoteVideo.srcObject = null;
    updateStatus('Call Ended', 'red');
    stopCallTimer();
  }
}

// Copy My ID
function copyMyId() {
  const id = myIdSpan.textContent;
  navigator.clipboard.writeText(id).then(() => {
    alert("ID copied to clipboard!");
  });
}

// Update call status with color
function updateStatus(text, color) {
  statusDiv.textContent = `Status: ${text}`;
  statusDiv.style.color = color;
}

// Start/Stop Timer
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

// Log calls (in console for now)
function logCall(peerId, type) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${type} Call] with ${peerId} at ${timestamp}`);
}
<script src="js/webrtc-advanced.js"></script>
