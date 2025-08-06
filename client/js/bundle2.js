const output = document.getElementById('output');
const source = new EventSource('http://localhost:3000/events');
source.onmessage = event => {
    const line = document.createElement('div');
    line.textContent = `📥 ${event.data}`;
    document.body.prepend(line);
};
source.addEventListener('end', () => {
    const done = document.createElement('div');
    done.textContent = '✅ Stream beendet';
    document.body.prepend(done);
    source.close();
});
//# sourceMappingURL=bundle2.js.map