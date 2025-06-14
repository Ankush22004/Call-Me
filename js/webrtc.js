let localStream, peer, currentCall, callStartTime, callTimer;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const myIdSpan = document.getElementById('myId');
const peerIdInput = document.getElementById('peerIdInput');
const statusDiv = document.getElementById('status');
const incomingDiv = document.getElementById('incoming');
const callerIdSpan = document.getElementById('callerId');
const acceptBtn = document.getElementById("accept-btn");
const rejectBtn = document.getElementById("reject-btn")

// Access media devices
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;

    peer = new Peer();

    peer.on('open', id => {
      myIdSpan.textContent = id;
    });

    // Incoming call handler (modern UI)
    peer.on('call', call => {
    playRingtone(); // ⏰ Start ringtone
    updateStatus(`📞 Incoming call from ${call.peer}`, 'yellow');

    showIncomingPopup(call.peer,
        () => {
            stopRingtone(); // ✅ Stop ringtone on accept
            call.answer(localStream); // localStream must be initialized
            currentCall = call;
            handleCall(call); // existing function to manage stream
        },
        () => {
            stopRingtone(); // ❌ Stop ringtone on reject
            call.close();
            updateStatus('❌ Call Rejected', 'red');
        }
    );
});
  .catch(err => {
    alert('⚠️ Error accessing camera/microphone.');
    console.error(err);
  });


// Handle the stream during the call
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
    endCall();
  });
}

// End the call
function endCall() {
  if (currentCall) {
    currentCall.close();
    currentCall = null;
  }
  remoteVideo.srcObject = null;
  updateStatus('Call Ended', 'red');
  stopCallTimer();
}

// Copy my ID
function copyMyId() {
  const id = myIdSpan.textContent;
  navigator.clipboard.writeText(id).then(() => {
    alert("ID copied to clipboard!");
  });
}

// Status helpers
function updateStatus(text, color) {
  statusDiv.textContent = `Status: ${text}`;
  statusDiv.style.color = color;
}

// Timer helpers
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

// Call log
function logCall(peerId, type) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${type} Call] with ${peerId} at ${timestamp}`);
}
