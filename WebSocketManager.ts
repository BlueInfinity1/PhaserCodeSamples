// A class for managing websocket traffic

export default class WebSocketManager extends Phaser.Events.EventEmitter {
    public static instance: WebSocketManager; // Singleton
    private websocket: WebSocket | null;
    private readonly url: string = "wss://uk9atrpwu4.execute-api.us-east-1.amazonaws.com/dev";

    constructor() {
        super();
        this.websocket = null;
        WebSocketManager.instance = this;
    }

    public static getWebSocketManagerInstance(): WebSocketManager {
        if (!WebSocketManager.instance) {
            WebSocketManager.instance = new WebSocketManager();
        }
        return WebSocketManager.instance;
    }

    public startConnection(): void {
        this.websocket = new WebSocket(this.url);

        this.websocket.onopen = (event) => {
            console.log('WebSocket connection is open:', event);
            this.emit('connection-opened');
        };

        this.websocket.onmessage = (event) => {
            console.log('WebSocket message received:', event);
            this.handleMessageResponse(event);
        };

        this.websocket.onerror = (event) => {
            console.error('WebSocket error:', event);
        };

        this.websocket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
        };
    }

    public handleMessageResponse(event: any): void {
        let data;
        try {
            data = JSON.parse(event.data);
            if (data.status !== "OK") {
                console.error('Error:', data.status);
                return;
            }

            console.log(data);

            const message = data.message;

            console.log(message);
            switch (data.op) {
                case 100:
                    console.log('Op 100:', message.targetValue, message.startTimeOffset);
                    this.emit('message-received', data);
                    break;
                case 101:
                    console.log('Op 101:', message.message);
                    this.emit('message-received', data);
                    break;
                default:
                    console.warn('Unhandled op:', data.op);
            }
        } catch (error) {
            console.error('Parsing error:', error);
        }
    }

    private sendMessage(message: string): void {
        if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
            this.websocket.send(message);
        } else {
            console.error('WebSocket is not connected.');
        }
    }

    public sendStartRequest() {
        const message = "{\"action\": \"message\", \"op\": 100}";
        this.sendMessage(message);
    }

    public sendScoringRequest(clickTime: number) {
        const message = `{"action": "message", "op": 101, "clickTime": ${clickTime}}`;
        this.sendMessage(message);
    }

    public closeConnection(): void {
        if (this.websocket) {
            this.websocket.close();
        }
    }
}
