import { CustomElementInterface } from "./base.ts";


export class CustomTab {
    container: HTMLDivElement;
    tabSystem: CustomTabs | undefined;

    constructor(name: string) {
        this.container = document.createElement("div");
        this.container.innerText = name;
        this.container.className = "customTab";
        this.tabSystem = undefined;

        this.container.addEventListener("click", () => { this.exe(); });
    }

    setTabSystem(tabSystem: CustomTabs) {
        this.tabSystem = tabSystem;
    }
    
    exe() {
        if (this.tabSystem) {
            this.tabSystem.switchTab(this);
        }
    }

    open() {
        this.container.classList.add("selected");
    }

    close() {
        this.container.classList.remove("selected");
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
        if (this.activeTab) {
            this.activeTab.close();
        }
           
        this.activeTab = toTab;
        this.activeTab.open();

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