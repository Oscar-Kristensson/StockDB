import {EventSystem} from "./eventSystem"

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
        const valid = this._performTypeCheck();

        if (!valid) {
            throw new Error("Unvalid value assigned to SmartVar");
        }
    }


}
