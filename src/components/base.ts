


export function createContainer(parent: HTMLElement, className: string) : HTMLDivElement {
    const container = document.createElement("div");
    container.className = className;

    parent.appendChild(container);

    return container;
}