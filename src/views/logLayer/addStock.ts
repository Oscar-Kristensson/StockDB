import { CustomInputElement, InputValidationError, InputValidationStates } from "../../components/input.ts";
import { CustomFormElement } from "../../components/form.ts";
import { StockInfo, StockSectors } from "../../stocks.ts";
import { db } from "../../db.ts";

function validateTicker(ticker: string) {
    ticker = ticker.toUpperCase();
    if (ticker === "")
        return InputValidationStates.empty;

    if (ticker.length > 12) {
        return new InputValidationError(
            InputValidationStates.error,
            "The ticker was to long",
        );
    }

    if (!/^[-A-Z]+$/.test(ticker)) {
        return new InputValidationError(
            InputValidationStates.error,
            `${ticker} is invalid. The ticker may only contain letters and "-".`
        );
        
    }

    
    return InputValidationStates.ok;
}

function validateName(name: string) {
    if (name === "")
        return InputValidationStates.empty;

    if (!/^[a-zA-Z ]+$/.test(name)) {
        return new InputValidationError(
            InputValidationStates.error,
            `${name} is invalid. The name may only contain letters and spaces.`
        )
    }

    return InputValidationStates.ok;

}



export class AddStockForm extends CustomFormElement {
    ticker: CustomInputElement;
    name: CustomInputElement;
    exchange: CustomInputElement;
    sector: CustomInputElement;
    industry: CustomInputElement;


    constructor(parent: HTMLElement) {
        super(parent);

        this.ticker = new CustomInputElement(undefined, "Ticker", "", "text", true, validateTicker);
        this.ticker.placeholder = "ex INVE-B";
        this.addInput(this.ticker);
        
        this.ticker.eventSystem?.listen("input", () => {
            this.ticker.value = this.ticker.value.toUpperCase();
        })
        


        this.name = new CustomInputElement(undefined, "Name", "", "text", true, validateName);
        this.name.placeholder = "Investor-B";
        this.addInput(this.name);

        this.exchange = new CustomInputElement(undefined, "Exchange", "", "text", true);
        this.exchange.placeholder = "Nasdaq Stockholm";
        this.addInput(this.exchange);

        // NOTE: This should be a drop down element
        this.sector = new CustomInputElement(undefined, "Sector", "", "text", true);
        this.sector.placeholder = "Financials";
        this.addInput(this.sector);

        this.industry = new CustomInputElement(undefined, "Industry", "", "text", true);
        this.industry.placeholder = "Investment Companies";
        this.addInput(this.industry);

        this.industry.input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.send();
            }
        })
    }

    override send() {
        console.log("Send add stock!");

        const stock = new StockInfo(0, this.ticker.value, this.name.value, 
            this.exchange.value, StockSectors.CommunicationServices, this.industry.value, "SEK"
        )

        db.addStock(stock);
        

    }



    validate(): boolean {
        if (!this.name.valid)
            return false;

        if (!validateName(this.name.value)) {
            return false;
        }

        return true;
    }
}
