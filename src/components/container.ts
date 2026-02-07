


export class CustomContainer {
    mainContainer: HTMLDivElement;
    contentContainer: HTMLDivElement;
    heading : HTMLHeadingElement;

    constructor(parent: HTMLElement, heading:string, className: string) {
        this.mainContainer = document.createElement("div");
        this.mainContainer.className = "customContainer";
        this.mainContainer.classList.add(className);

        this.heading = document.createElement("div");
        this.heading.className = "containerHeading";
        this.mainContainer.appendChild(this.heading);
        this.setHeading(heading);

        this.contentContainer = document.createElement("div");
        this.contentContainer.className = "content";
        this.mainContainer.appendChild(this.contentContainer);
        

        parent.appendChild(this.mainContainer);
    }

    setHeading(heading: string) {
        this.heading.innerText = heading;
    }
}