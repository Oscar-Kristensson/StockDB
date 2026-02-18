import { AppLayer } from "../appLayer.ts";
import { StockDB } from "../app.ts";
import { CustomTabs, CustomTab } from "../components/tabs.ts";
import { loadCSS } from "../utils.ts";
import { CustomInputElement, InputValidationError, InputValidationStates } from "../components/input.ts";
import { CustomFormElement } from "../components/form.ts";
import { CustomHeading } from "../components/heading.ts";


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



class AddStockForm extends CustomFormElement {
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








class LogLayer extends AppLayer {
    app: StockDB | undefined;
    container: HTMLDivElement | undefined;
    tabs: CustomTabs | undefined;
    addStockContainer: HTMLDivElement | undefined;
    addRecordContainer: HTMLDivElement | undefined;
    recordForm: AddStockForm | undefined;

    constructor() {
        super("Log", "icons/StockIcon.svg");
    }


    createUI() {
        loadCSS("src/styles/log.css");
        if (!this.layerContainer) {
            console.error("Could not create UI since the layerContainer is undefined");
            return;
        }
        this.container = document.createElement("div");
        this.container.className = "logLayer";


        this.addStockContainer = document.createElement("div");
        this.addStockContainer.className = "tabContainer";
        this.addStockContainer.classList.add("stock");
        
        new CustomHeading(this.addStockContainer, "Information", "info", 2);
        
        this.addRecordContainer = document.createElement("div");
        this.addRecordContainer.className = "tabContainer";
        this.addRecordContainer.innerText = "record";
        this.addStockContainer.classList.add("stock");


        // NOTE: This is temporary testing code for the CustomInputElement

        this.recordForm = new AddStockForm(this.addStockContainer);


        

        


        this.tabs = new CustomTabs(this.container);
        this.tabs.addTab(new CustomTab("Add stock", this.addStockContainer, "icons/addStockIcon.svg"));
        this.tabs.addTab(new CustomTab("Add record", this.addRecordContainer, "icons/recordIcon.svg"));

        this.container.appendChild(this.addStockContainer)
        this.container.appendChild(this.addRecordContainer);

        

    }

    /**
     * Called only once
     */
    receivedApp() {
        if (this.layerSwitcher instanceof StockDB) {
           this.app = this.layerSwitcher; 
        } else {
            this.app = undefined;
        }
    }

    /**
     * Is called when the app layer is switched
     * @returns 
     */
    override onLoad(): HTMLElement | undefined {
        if (!this.app)
            this.receivedApp();

        this.createUI();

        return this.container;
    }
}





export const logLayer = new LogLayer();