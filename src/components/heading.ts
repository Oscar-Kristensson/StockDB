



export class CustomHeading {
    heading : HTMLHeadingElement;

    constructor(parent: HTMLElement, heading:string, className: string) {
        this.heading = document.createElement("h1");
        this.heading.className = "customHeading";
        this.heading.classList.add(className);

        this.setHeading(heading);

        

        parent.appendChild(this.heading);
    }

    setHeading(heading: string) {
        this.heading.innerText = heading;
    }
}