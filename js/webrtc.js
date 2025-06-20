let localStream;
let peer;
let currentCall;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const myIdSpan = document.getElementById('myId');
const callStatus = document.getElementById('callStatus');
const callLogs = document.getElementById('callLogs');

// Load previous logs
loadLogs();

// Step 1: Get User Media
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    localStream = stream;
    localVideo.srcObject = stream;

    // Step 2: Create Peer
    peer = new Peer();

    peer.on('open', id => {
      myIdSpan.textContent = id;
    });

    // Step 3: Answer Incoming Calls
    peer.on('call', call => {
      const accept = confirm(`📞 Incoming call from: ${call.peer}. Accept?`);
      if (accept) {
        callStatus.textContent = `Status: In call with ${call.peer}`;
        call.answer(localStream);
        currentCall = call;

        logCall("📥 Incoming", call.peer);

        call.on('stream', remoteStream => {
          remoteVideo.srcObject = remoteStream;
        });

        call.on('close', () => {
          callStatus.textContent = `Status: Call ended`;
        });
      } else {
        logCall("❌ Rejected", call.peer);
      }
    });
  })
  .catch(error => {
    console.error('Media Error:', error);
    alert('Failed to access camera/mic');
  });

// 📞 Manual Call
function makeCall() {
  const remoteId = document.getElementById('peerId').value.trim();
  if (!remoteId || !peer || !localStream) return;

  callStatus.textContent = `Status: Calling ${remoteId}...`;

  const call = peer.call(remoteId, localStream);
  currentCall = call;

  logCall("📤 Outgoing", remoteId);

  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream;
    callStatus.textContent = `Status: In call with ${remoteId}`;
  });

  call.on('close', () => {
    callStatus.textContent = `Status: Call ended`;
  });
}

// ❌ End Call
function endCall() {
  if (currentCall) {
    currentCall.close();
    currentCall = null;
    remoteVideo.srcObject = null;
    callStatus.textContent = `Status: Call ended`;
  }
}

// 📋 Copy My ID
function copyMyId() {
  const id = myIdSpan.textContent;
  navigator.clipboard.writeText(id)
    .then(() => alert("🆔 ID Copied!"))
    .catch(() => alert("❌ Failed to copy"));
}

// 📃 Call Logs
function logCall(type, peerId) {
  const log = `${type} call with ${peerId} at ${new Date().toLocaleTimeString()}`;
  const li = document.createElement('li');
  li.textContent = log;
  callLogs.prepend(li);

  // Save to localStorage
  let logs = JSON.parse(localStorage.getItem('callLogs') || '[]');
  logs.unshift(log);
  localStorage.setItem('callLogs', JSON.stringify(logs));
}

function loadLogs() {
  let logs = JSON.parse(localStorage.getItem('callLogs') || '[]');
  logs.forEach(log => {
    const li = document.createElement('li');
    li.textContent = log;
    callLogs.appendChild(li);
  });
}
