import { CustomElementInterface } from "./base.ts";


export class CustomTab {
    container: HTMLDivElement;
    textLabel: HTMLDivElement;
    tabSystem: CustomTabs | undefined;
    linkedContainer: HTMLElement | undefined;

    constructor(name: string, linkedContainer:HTMLElement | undefined = undefined) {
        this.container = document.createElement("div");
        this.container.className = "customTab";
        
        
        this.textLabel = document.createElement("div");
        this.textLabel.className = "text";
        this.textLabel.innerText = name;
        this.container.appendChild(this.textLabel);
        
        
        this.tabSystem = undefined;

        this.container.addEventListener("click", () => { this.exe(); });

        this.linkedContainer = linkedContainer;
        if (this.linkedContainer) {
            this.linkedContainer.classList.add("linkedToCustomTab");
        }
    }

    setTabSystem(tabSystem: CustomTabs) {
        this.tabSystem = tabSystem;
    }
    
    exe() {
        console.log("Clicked tab", this.textLabel.innerText);
        if (this.tabSystem) {
            this.tabSystem.switchTab(this);
        }
    }

    open() {
        this.container.classList.add("selected");

        if (this.linkedContainer) {
            this.linkedContainer.classList.add("open");
        }

    }

    close() {
        this.container.classList.remove("selected");

        if (this.linkedContainer) {
            this.linkedContainer.classList.remove("open");
        }

    }
}


export class CustomTabs implements CustomElementInterface {
    container: HTMLDivElement;
    tabs: Array<CustomTab>;
    activeTab: CustomTab | undefined;

    constructor(parent: HTMLElement, className: string = "") {
        this.container = document.createElement("div");
        this.container.className = "customTabs";

        if (className !== "")
            this.container.classList.add(className);

        this.tabs = [];

        parent.appendChild(this.container);


    }

    switchTab(toTab: CustomTab) {
        if (this.activeTab === toTab) {
            return;
        }

        if (this.activeTab) {
            this.activeTab.close();
        }
           
        this.activeTab = toTab;
        this.activeTab.open();
        console.log("Switched tab to", this.activeTab);

    }

    addTab(tab: CustomTab) {
        this.container.appendChild(tab.container);
        tab.setTabSystem(this);
        this.tabs.push(tab);

        if (this.tabs.length === 1) {
            this.switchTab(tab);
        }
    }

    appendChild(node: CustomElementInterface | HTMLElement): void {
        console.warn("This object can not have any children like", node);
    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.container;
    }


}