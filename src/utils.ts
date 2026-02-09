
const loadedCSSFiles: Array<string> = [];


export function loadCSS(href: string) {
    if (href in loadedCSSFiles) {
        return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
    loadedCSSFiles.push(href);
}


type Listener = () => { handled: boolean } | void;

export class EventSystem {
    
    constructor(public listeners: { [key: string]: Array<Listener>} = {}) {
    
    }

    post(type: string) {
        console.log("Event posted", type, this.listeners[type].length);
        if (!(type in this.listeners)) {
            return;
        }

        for (let i = 0; i < this.listeners[type].length; i++) {
            this.listeners[type][i]()

        }
    }

    listen(type: string, callback: Listener) {
        console.log("Listning to", type)
        if (!(type in this.listeners)) {
            this.listeners[type] = [];
        }

        this.listeners[type].push(callback);
    }
}


export function assert(condition: boolean, errorMsg: string) {
    if (!condition)
        throw new Error(errorMsg);
}