// js/webrtc.js

let localStream;
let peer;
let currentCall;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

// Step 1: Get User Media
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;

    // Step 2: Create Peer
    peer = new Peer(); // Random ID

    peer.on('open', id => {
      alert(`🆔 Your ID: ${id}\nSend this ID to your friend to receive the call.`);
    });

    // Step 3: Answer Incoming Calls
    peer.on('call', call => {
      call.answer(localStream);
      currentCall = call;

      call.on('stream', remoteStream => {
        remoteVideo.srcObject = remoteStream;
      });
    });
  })
  .catch(error => {
    console.error('Media Error:', error);
    alert('Failed to access camera/microphone.');
  });

// Start Call (manual prompt)
function startCall() {
  const remoteId = prompt("Enter the ID of the person you want to call:");
  if (!remoteId || !peer || !localStream) return;

  const call = peer.call(remoteId, localStream);
  currentCall = call;

  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
  });
}

// End Call
function endCall() {
  if (currentCall) {
    currentCall.close();
    currentCall = null;
    remoteVideo.srcObject = null;
    alert('Call ended');
  }
}
