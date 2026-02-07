
const loadedCSSFiles: Array<string> = [];


export function loadCSS(href: string) {
    if (href in loadedCSSFiles) {
        return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
    loadedCSSFiles.push(href);
}