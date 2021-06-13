export default class ClientSocket {
    constructor(url) {
        this.url = url;
        this.listeners = [];
        this.socket = new WebSocket(url);
        this.socket.addEventListener('open', () => {
            console.log('Connected to server');
        })
        this.socket.addEventListener('message', ({ data }) => {
            let { eventType, eventData } = JSON.parse(data);
            this.listeners.filter((l) => l.type === eventType).forEach((l) => l.callback(eventData));
        });
    }

    sendData(eventType, eventData) {
        if (this.socket.readyState === WebSocket.CONNECTING) {
            this.socket.addEventListener('open', () => {
                this.socket.send(JSON.stringify({ eventType, eventData }));
            });
        } else {
            this.socket.send(JSON.stringify({ eventType, eventData }));
        }

    }

    addEventListener(eventType, callback) {
        this.listeners.push({ type: eventType, callback });
    }


}