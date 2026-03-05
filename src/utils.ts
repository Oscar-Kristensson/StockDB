
const loadedCSSFiles: Array<string> = [];

const utilsTypeChecking = true;

// NOTE: Everything in this file should be in the utils namespace
export function createElement<K extends keyof HTMLElementTagNameMap>(
    tagName: K,
    parent?: HTMLElement,
    classNames: string[] = [],
): HTMLElementTagNameMap[K] {

    const element = document.createElement(tagName);

    classNames.forEach(className => {
        element.classList.add(className);
    });

    parent?.appendChild(element);

    return element;
}


export function pascalToWords(value: string): string {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
}




/**
 * Class that continas a value with an event system and type checking
 */
export class SmartVar<T> {
    _value: T;
    events: EventSystem;
    typeCheck: ((value: T) => boolean) | undefined;
    constructor(value: T, typeCheck: ((value: T) => boolean) | undefined = undefined) {
        this._value = value;
        this.events = new EventSystem();
        this.typeCheck = typeCheck;

    }

    /**
     * Set the vlaue of the smart var.
     * Posts the updated event
     */
    public set value(value: T) {
        this.setValue(value, false);
    }

    public get value() : T {
        return this._value;
    }

    /**
     * Like "this.value = " but with more functionality
     * @param value - the new value of the SmartVar
     * @param silent - if false, the updated event will be posted
     * @param typeCheck - if true, typechecking is used
     */
    setValue(value: T, silent = true, typeCheck = true) {
        this._value = value;
        
        if (typeCheck) this._typeCheck();

        if (!silent) this.events.post("updated");

    }

    private _performTypeCheck() {
        switch (typeof this.typeCheck) {
            case "function":
                return this.typeCheck(this._value);
            
            case "string":
                return typeof this._value === this.typeCheck;

            case "undefined":
                return true;
            
            default:
                console.warn("Unkown typecheck!");
                return false;
                
        }    
    }

    private _typeCheck() {
        if (!utilsTypeChecking) return;

        const valid = this._performTypeCheck();

        if (!valid) {
            throw new Error("Unvalid value assigned to SmartVar");
        }
    }


}


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


export function assert(condition: boolean, errorMsg: string) {
    if (!condition)
        throw new Error(errorMsg);
}



export function printError(error: unknown, fn: Function) {
    console.error(`The function db.${fn.name} returned the following error: ${error}`);
 
}


export function averageO<T>(objects: Array<T>, func: ((object: T) => number)) {
    let total = 0;

    objects.forEach(object => {
        total += func(object);
    })

    return total/objects.length;
}


export function average(numbers: Array<number>) {
    let total = 0;
    numbers.forEach(number => {
        total += number;
    });

    return total / numbers.length;
}

export function calcTotalPeriod(year: number, quarter: number) {
    return year * 4 + quarter;
}

/**
 * A value at a point in time
 */
export class DtPoint<T> {
    constructor(
        public time: number,
        public data: T,
    ) {}

}

/**
 * @param fromTime 
 * @param toTime 
 * @param data 
 * @returns 
 */
export function getAverageS(fromTime: number | undefined, toTime: number | undefined, data: Array<DtPoint<number | null>>) : undefined | number {
    let previousTime = fromTime;

    let total = 0;
    let count = 0;



    for (const dataPoint of data) {
        previousTime = dataPoint.time;

        if (fromTime && dataPoint.time < fromTime) continue;
        if (toTime && dataPoint.time > toTime) continue;

        if (dataPoint.data !== null) {
            total += dataPoint.data;
            count++;
        }
    }

    return total/count;


}