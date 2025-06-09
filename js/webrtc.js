let localStream;
let peer;
let currentCall;

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
      statusDiv.textContent = `Status: Incoming call from ${call.peer}`;

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
    });
  })
  .catch(err => {
    alert('Error accessing camera/mic.');
    console.error(err);
  });

// Make a call
function makeCall() {
  const peerId = peerIdInput.value.trim();
  if (!peerId) return alert('Enter peer ID.');

  const call = peer.call(peerId, localStream);
  currentCall = call;
  statusDiv.textContent = `Status: Calling ${peerId}...`;

  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
    statusDiv.textContent = 'Status: In Call';
  });

  call.on('close', () => {
    statusDiv.textContent = 'Status: Call Ended';
    remoteVideo.srcObject = null;
  });
}

// End current call
function endCall() {
  if (currentCall) {
    currentCall.close();
    remoteVideo.srcObject = null;
    statusDiv.textContent = 'Status: Call Ended';
  }
}

// Copy My ID
function copyMyId() {
  const id = myIdSpan.textContent;
  navigator.clipboard.writeText(id).then(() => {
    alert("ID copied to clipboard!");
  });
}
        
