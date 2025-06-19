const callBtn = document.getElementById('call-btn');
const peerIdInput = document.getElementById('peer-id');
const localVideo = document.getElementById('local-video');
const remoteVideo = document.getElementById('remote-video');
const endCallBtn = document.getElementById('end-call-btn');

let localStream, currentCall;

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localVideo.srcObject = stream;
    localStream = stream;
  });

callBtn.onclick = () => {
  const call = peer.call(peerIdInput.value, localStream);
  setupCall(call);
};

peer.on('call', call => {
  call.answer(localStream);
  document.getElementById("incoming-call").style.display = "block";
  document.getElementById("caller-id").textContent = call.peer;
  window.pendingCall = call;
});

document.getElementById('accept-btn').onclick = () => {
  document.getElementById("incoming-call").style.display = "none";
  setupCall(window.pendingCall);
};
document.getElementById('reject-btn').onclick = () => {
  window.pendingCall.close();
  document.getElementById("incoming-call").style.display = "none";
};

function setupCall(call) {
  currentCall = call;
  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
    document.getElementById("video-section").style.display = "block";
  });
  call.on('close', () => {
    document.getElementById("call-status").textContent = "Call Ended";
    document.getElementById("video-section").style.display = "none";
  });
}

endCallBtn.onclick = () => {
  if (currentCall) currentCall.close();
};

