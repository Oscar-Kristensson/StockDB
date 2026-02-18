import { CustomInputElement, InputValidationError, InputValidationStates } from "../../components/input.ts";
import { CustomFormElement } from "../../components/form.ts";

function validateTicker(ticker: string) {
    if (ticker === "")
        return InputValidationStates.empty;

    if (ticker.length > 12) {
        return new InputValidationError(
            InputValidationStates.error,
            "The ticker was to long",
        );
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
        


        this.name = new CustomInputElement(undefined, "Name", "", "text", true);
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
    }
}
