// Make ws connection
var webSocket = io.connect('http://localhost:3000/')

// Query DOM
var message = document.getElementById('message'), 
    user = document.getElementById('user'),
    button = document.getElementById('send'),
    output = document.getElementById('output'),
    feedback = document.getElementById('feedback'),
    psi = document.getElementById('psi');

// Emit events
button.addEventListener('click', () => {
    webSocket.emit('chat', {
        message: message.value,
        user: user.value
    });
    message.value = '';
});

// Emit typing message events
message.addEventListener('keypress', () => {
    webSocket.emit('typing', user.value);
});

// Listen for events from server
webSocket.on('chat', (data) => {
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.user + ':</strong> '
        + data.message + '</p>';
});
webSocket.on('typing', (data) => {
    feedback.innerHTML = '<p><em>' + data + 'is typing a message...</em></p>';
});
webSocket.on('psi', (data) => {
    psi.innerHTML = '<p><strong>Bitcoin Price (USD/BTC):</strong> '
        + data.bpi.USD.rate_float
        // + data.items[0].readings.psi_twenty_four_hourly.national 
        + ' (Last Updated DateTime: ' + new Date().toLocaleString()
        + ')</p>';
})