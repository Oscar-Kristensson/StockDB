import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { graphic } from 'echarts/core';
import { LineSeriesOption, BarSeriesOption } from 'echarts/charts';
import * as utils from "../utils"
// Define a type for your series data objects
type ChartSeriesOption = LineSeriesOption | BarSeriesOption;

echarts.use([
  BarChart,
  LineChart,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  CanvasRenderer,
]);

const COLOR_HUES: Array<number> = [120, 0, 55, 225, 180, 280, 305];


class CustomChartSeries {
    constructor(
        private data: Array<number | null>,
        private type: "line" | "bar",

    ) {}

    getChartData(name: string, style_index: number = 0) {
        if (!utils.isInRange(style_index, 0, COLOR_HUES.length - 1)) {
            console.error(`style_index must be a positive integer and in the range from 0 to ${COLOR_HUES.length - 1} `)
        };

        const hue = COLOR_HUES[style_index];


        return  {
            name: name,
            type: this.type,
            data: this.data,
            connectNulls: true,
            lineStyle: {
                color: `hsl(${hue}, 75%, 59%)`, // Line color
                width: 3          // Line thickness
            },
            itemStyle: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: `hsl(${hue}, 90%, 65%)` }, // Top color
                    { offset: 1, color: `hsl(${hue}, 90%, 35%)` }  // Bottom color
                ]),
            },
            areaStyle: {
                color: new graphic.LinearGradient(
                0, 0, 0, 1, // (x1, y1, x2, y2) -> Top to Bottom gradient
                [
                    {
                    offset: 0,
                    color: `hsla(${hue}, 75%, 59%, 0.50)` // Top color (50% opacity)
                    }, 
                    {
                    offset: 1,
                    color: `hsla(${hue}, 75%, 59%, 0.00)`// Bottom color (Fades to transparent)
                    }
                ]
                )
            }
        }
    }
}




class CustomChartCheckbox {
    container: HTMLDivElement;
    colorDot: HTMLDivElement;
    labelContainer: HTMLDivElement;
    constructor(
        private readonly chart: CustomChart,
        public visible: boolean,
        public color: string | undefined,
        parent: HTMLDivElement,
        label: string,
    ) {
        this.container = utils.createElement("div", parent, ["visiblitySelectorContainer"]);
        this.colorDot = utils.createElement("div", this.container, ["dot"]);
        this.labelContainer = utils.createElement("div", this.container, ["label"]);
        this.labelContainer.innerText = label;
        this.setVisibility(visible);

        this.container.addEventListener("click", () => { this.toggleVisiblity(); this.chart.renderChart() });
    }

    setVisibility(isVisible: boolean) {
        this.visible = isVisible;
        
        if (this.visible) {
            this.container.classList.add("visible");
        } else {
            this.container.classList.remove("visible"); 
        }

        this.updateColor();
    }

    toggleVisiblity() {
        this.setVisibility(!this.visible);
    }

    updateColor() {
        if (!this.color) return;
        this.colorDot.style.backgroundColor = this.color;
    }


    setColor(color: string | undefined) {
        this.color = color;

        this.updateColor();



    }

    delete() {
        this.container.remove();
    }
}

interface ChartEntry {
  series: CustomChartSeries;
  checkbox: CustomChartCheckbox;
}

export class CustomChart {
    mainContainer: HTMLDivElement;
    contentContainer: HTMLDivElement;
    checkboxesContainer: HTMLDivElement;
    chart!: echarts.ECharts;
    series: Map<string, ChartEntry>;
    title: string; 
    public dataLabels: Array<string>;

    constructor(parent: HTMLElement | undefined, title: string, className?: string) {
        this.mainContainer = document.createElement("div");
        this.mainContainer.className = "customChart";
        if (className) {
        this.mainContainer.classList.add(className);
        }

        this.contentContainer = document.createElement("div");
        this.contentContainer.className = "chart-container";
        
        this.contentContainer.style.width = "100%";
        this.contentContainer.style.height = "400px";

        this.mainContainer.appendChild(this.contentContainer);
        parent?.appendChild(this.mainContainer);

        this.checkboxesContainer = utils.createElement("div", this.mainContainer, ["checkboxesContainer"]);

        // Defer initialization until the DOM has calculated layout dimensions
        requestAnimationFrame(() => {
            this.initChart();
        });

        // Automatically handle window resizes
        window.addEventListener('resize', () => {
        this.chart?.resize();
        });

        this.series = new Map<string, ChartEntry>();
        this.title = title;
        this.dataLabels = ["Mon", "Tue"];
    }

    private createOption() {
        const seriesData: ChartSeriesOption[] = [];
        let i = 0;
        this.series.forEach(( s, key ) => {
            const color_index = i;
            i++;
            if (!s.checkbox.visible) return;
            seriesData.push(s.series.getChartData(key, color_index));
            s.checkbox.setColor(`hsl(${COLOR_HUES[color_index]}, 100%, 65%)`)
        })


        return {
            title: {
                text: this.title,
                textStyle: { color: '#999999' }
                
            },
            tooltip: {
                trigger: 'axis',
                valueFormatter: (value: any) => {
                // Round to 2 decimal places (or use Math.round(value) for whole numbers)
                return typeof value === 'number' ? value.toFixed(2) : value;
                }
            },
            xAxis: {
                type: 'category',
                data: this.dataLabels
            },
            yAxis: {
                type: 'value'
            },
            series: seriesData
        };

    }

    private initChart(): void {
        // Make sure we don't re-initialize if the container isn't ready
        if (!this.contentContainer.clientWidth) return;

        this.chart = echarts.init(this.contentContainer);

        const option = this.createOption();

        this.chart.setOption(option);
    }

    addSeries(name: string, type: "line" | "bar", data: Array<number | null>) {
        const series = new CustomChartSeries(
            data, 
            type,
        );

        const checkbox = new CustomChartCheckbox(
            this,
            true,    // Visible by default
            undefined,
            this.checkboxesContainer,
            name
        )

        this.series.set(name, { series, checkbox });
    }

    removeSeries(name: string) {
        let entry = this.series.get(name);
        if (entry) entry.checkbox.delete();

        this.series.delete(name);
    }
    removeAllSeries() {
        this.series.forEach(( _value, key) => { this.removeSeries(key); });
    }


    renderChart() {
        this.chart.setOption(
            this.createOption(),
            true
        )
    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.mainContainer;
    }
}