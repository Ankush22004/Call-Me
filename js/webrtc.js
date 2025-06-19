let localStream, peer, currentCall, callStartTime, callTimer;Add commentMore actions
et localStream, peer, currentCall, callStartTime, callTimer;

const localVideo = document.getElementById('localVideo');Add commentMore actions
const remoteVideo = document.getElementById('remoteVideo');
@@ -8,46 +8,45 @@ const statusDiv = document.getElementById('status');
const incomingDiv = document.getElementById('incoming');
const callerIdSpan = document.getElementById('callerId');
const acceptBtn = document.getElementById("accept-btn");
const rejectBtn = document.getElementById("reject-btn")
const rejectBtn = document.getElementById("reject-btn");

// Access media devices
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;

    peer = new Peer();
    peer = new Peer({
      host: "0.peerjs.com",
      port: 443,
      secure: true
    });

    peer.on('open', id => {
      myIdSpan.textContent = id;
    });

    // Incoming call handler (modern UI)
    peer.on('call', call => {
    playRingtone(); // ⏰ Start ringtone
    updateStatus(`📞 Incoming call from ${call.peer}`, 'yellow');

    showIncomingPopup(call.peer,
      playRingtone();
      updateStatus(`📞 Incoming call from ${call.peer}`, 'yellow');
      showIncomingPopup(call.peer,
        () => {
            stopRingtone(); // ✅ Stop ringtone on accept
            call.answer(localStream); // localStream must be initialized
            currentCall = call;
            handleCall(call); // existing function to manage stream
          stopRingtone();
          call.answer(localStream);
          currentCall = call;
          handleCall(call);
        },
        () => {
            stopRingtone(); // ❌ Stop ringtone on reject
            call.close();
            updateStatus('❌ Call Rejected', 'red');
        }
    );
});
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


// Handle the stream during the call
function handleCall(call) {
  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
@@ -62,7 +61,6 @@ function handleCall(call) {
  });
}

// Make a call
function makeCall() {
  const peerId = peerIdInput.value.trim();
  if (!peerId) return alert('Enter peer ID.');
@@ -83,7 +81,6 @@ function makeCall() {
  });
}

// End the call
function endCall() {
  if (currentCall) {
    currentCall.close();
@@ -94,21 +91,18 @@ function endCall() {
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
@@ -120,7 +114,6 @@ function stopCallTimer() {
  clearInterval(callTimer);
}

// Call log
function logCall(peerId, type) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${type} Call] with ${peerId} at ${timestamp}`);
