
const peer = new Peer();
const myIdSpan = document.getElementById('my-id');
peer.on('open', id => {
  myIdSpan.textContent = id;
});
