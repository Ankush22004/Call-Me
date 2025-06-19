let localStream;
let peer;
let currentCall;
let callStartTime;
let callTimer;

// Get UI Elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const myIdSpan = document.getElementById('myId');
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    peer.on('call', call => {
      callerIdSpan.textContent = call.peer;
      incomingDiv.style.display = 'block';
      statusDiv.textContent = `Status: Incoming call from ${call.peer}`;
      updateStatus(`Incoming call from ${call.peer}`, 'yellow');

      call.answer(localStream);
      currentCall = call;

      call.on('stream', remoteStream => {
        remoteVideo.srcObject = remoteStream;
        incomingDiv.style.display = 'none';
        statusDiv.textContent = 'Status: In Call';
      });

      call.on('close', () => {
        statusDiv.textContent = 'Status: Call Ended';
        remoteVideo.srcObject = null;
      });
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
  statusDiv.textContent = `Status: Calling ${peerId}...`;
  updateStatus(`Calling ${peerId}...`, 'yellow');

  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
    statusDiv.textContent = 'Status: In Call';
    updateStatus('In Call', 'green');
    startCallTimer();
    logCall(peerId, 'Outgoing');
  });

  call.on('close', () => {
    statusDiv.textContent = 'Status: Call Ended';
    remoteVideo.srcObject = null;
    updateStatus('Call Ended', 'red');
    stopCallTimer();
  });
}

     function endCall() {
  if (currentCall) {
    currentCall.close();
    remoteVideo.srcObject = null;
    statusDiv.textContent = 'Status: Call Ended';
    updateStatus('Call Ended', 'red');
    stopCallTimer();
  }
}

   function copyMyId() {
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
