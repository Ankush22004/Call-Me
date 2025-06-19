let localStream = null;
let currentCall = null;

const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const statusDiv = document.getElementById("status");
const peerIdInput = document.getElementById("peerIdInput");
const callerIdSpan = document.getElementById("caller-id");
const incomingPopup = document.getElementById("incoming-popup");
const acceptBtn = document.getElementById("accept-btn");
const rejectBtn = document.getElementById("reject-btn");

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;
  })
  .catch(error => {
    console.error("Media Error:", error);
    alert("Camera/Microphone permission is required.");
  });

function makeCall() {
  const peerId = peerIdInput.value.trim();
  if (!peerId || !localStream) return;
  const call = peer.call(peerId, localStream);
  setupCallEvents(call);
  statusDiv.textContent = "Calling...";
}

peer.on('call', call => {
  callerIdSpan.textContent = call.peer;
  incomingPopup.style.display = "block";
  window.pendingCall = call;
});

acceptBtn.onclick = () => {
  incomingPopup.style.display = "none";
  const call = window.pendingCall;
  call.answer(localStream);
  setupCallEvents(call);
};

rejectBtn.onclick = () => {
  if (window.pendingCall) window.pendingCall.close();
  incomingPopup.style.display = "none";
};

function setupCallEvents(call) {
  currentCall = call;
  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
    statusDiv.textContent = "Connected";
  });
  call.on('close', () => {
    statusDiv.textContent = "Call Ended";
    remoteVideo.srcObject = null;
  });
}

function endCall() {
  if (currentCall) {
    currentCall.close();
    currentCall = null;
  }
  statusDiv.textContent = "Call Ended";
  remoteVideo.srcObject = null;
}
