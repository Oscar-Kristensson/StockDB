



export class CustomHeading {
    heading : HTMLHeadingElement;

    constructor(parent: HTMLElement, heading:string, className: string | undefined = undefined, level: number = 1) {
        
        console.log(level);
        switch (level) {
            case 2:
                this.heading = document.createElement("h2");
                break;
                
            case 3:
                this.heading = document.createElement("h3");
                break;

            default:
            case 1:
                this.heading = document.createElement("h1");
                break;


        }
        this.heading.className = "customHeading";

        if (className) {
            this.heading.classList.add(className);
        }

        this.setHeading(heading);

        

        parent.appendChild(this.heading);
    }

    setHeading(heading: string) {
        this.heading.innerText = heading;
    }
}