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

const COLOR_HUES: Array<number> = [120, 0, 55, 225];


class CustomChartSeries {
    constructor(
        private data: Array<number | null>,
        private type: "line" | "bar",
        public visible: boolean,

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
                ])
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





export class CustomChart {
    mainContainer: HTMLDivElement;
    contentContainer: HTMLDivElement;
    chart!: echarts.ECharts;
    series: Map<string, CustomChartSeries>;
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

        // Defer initialization until the DOM has calculated layout dimensions
        requestAnimationFrame(() => {
            this.initChart();
        });

        // Automatically handle window resizes
        window.addEventListener('resize', () => {
        this.chart?.resize();
        });

        this.series = new Map<string, CustomChartSeries>();
        this.title = title;
        this.dataLabels = ["Mon", "Tue"];
    }

    private createOption() {
        const seriesData: ChartSeriesOption[] = [];
        let i = 0;
        this.series.forEach(( value, key ) => {
            i++;
            if (!value.visible) return;
            seriesData.push(value.getChartData(key, i - 1));
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
            true    // Visible by default
        );

        this.series.set(name, series);
    }

    removeSeries(name: "string") {
        this.series.delete(name);
    }
    removeAllSeries() {
        this.series.forEach(( _value, key) => this.series.delete(key));
    }


    renderChart() {
        this.chart.setOption(
            this.createOption()
        )
    }

    getTopMostHTMLContainer(): HTMLElement {
        return this.mainContainer;
    }
}