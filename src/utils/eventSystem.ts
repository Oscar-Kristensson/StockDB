type Listener = () => { handled: boolean } | void;

export class EventSystem {
    
    constructor(public listeners: { [key: string]: Array<Listener>} = {}) {
    
    }

    post(type: string) {
        if (!(type in this.listeners)) {
            return;
        }

        for (let i = 0; i < this.listeners[type].length; i++) {
            this.listeners[type][i]()

        }
        
    }

    listen(type: string, callback: Listener) {
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }

        this.listeners[type].push(callback);
    }
}
