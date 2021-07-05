import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ProductRank } from '../../../../models/product-rank.type';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as moment from 'moment';
import { Product } from '../../../../models/product.interface';
import { Chart } from 'chart.js';
import { Subject } from 'rxjs';
import { CHART_OPTIONS } from 'src/app/models/chart-options';

type Filter = {
	name: string;
	startIndex: number;
};

export type TableData = {
	headers: string[];
	rows: any[][];
};

@Component({
	selector: 'dh-rank-viewer-chart',
	templateUrl: './rank-viewer-chart.component.html',
	styleUrls: ['./rank-viewer-chart.component.scss'],
})
export class RankViewerChartComponent implements AfterViewInit, OnChanges {
	@Input() selectedDataset: ProductRank[] | null = [];
	rectangleSet: boolean = false;
	chartOptions: ChartOptions = CHART_OPTIONS;

	// @ts-ignore
	@ViewChild('chart') private chartCanvas: ElementRef;
	// @ts-ignore
	chart: any;
	colors: string[] = ['#6ab04c', '#eb4d4b', '#f0932b', '#f9ca24', '#4834d4'];

	currentTableData: TableData = {
		headers: [],
		rows: [],
	};

	tableData$: Subject<TableData> = new Subject<TableData>();

	chartData: ChartDataSets[] = [];
	filteredChartData: ChartDataSets[] = [];
	chartLabels: Label[] = [];
	filters: Filter[] = [];
	selectedFilter: Filter = {
		name: '',
		startIndex: 0,
	};
	constructor() {}

	ngOnInit(): void {}

	ngOnChanges(changes: SimpleChanges): void {
		if (!!changes.selectedDataset.currentValue) {
			this.updateChartOptions();
		}
	}

	ngAfterViewInit() {
		this.updateChartOptions();
		this.initChart();
	}

	initChart(): void {
		this.chart = new Chart(this.chartCanvas.nativeElement, {
			type: 'line',
			data: {
				labels: this.chartLabels,
				datasets: [...this.filteredChartData],
			},
			options: this.chartOptions,
		});
	}

	generateFilter(data: ChartDataSets[]): Filter[] {
		// Generate a list of filter, display 5 lines each time
		const result: Filter[] = [];
		const dataLength = data.length;
		for (let i = 0; i < dataLength; i += 5) {
			const name = `Rank from ${i + 1} to ${i + 4}`;
			const startIndex = i;
			result.push({
				name,
				startIndex,
			});
		}
		return result;
	}

	onFilterChange(startIndex: string) {
		const index = parseInt(startIndex, 10);
		this.selectedFilter.startIndex = index;
		this.updateFilterData(index);
		this.updateTableData(index);
	}

	updateFilterData(index: number) {
		if (this.chartData.length) {
			this.filteredChartData = [];
			for (let i = 0; i < 5; i++) {
				this.filteredChartData.push(this.chartData[index + i]);
			}
			this.filteredChartData.forEach((data, index) => {
				data.borderColor = this.colors[index];
			});
			this.updateChart();
		}
	}

	updateTableData(index: number): void {
		if (this.currentTableData.rows.length) {
			const newTableData: TableData = {
				headers: this.currentTableData.headers,
				rows: [],
			};
			for (let i = 0; i < 5; i++) {
				newTableData.rows.push(this.currentTableData.rows[index + i]);
			}
			this.tableData$.next(newTableData);
		}
	}

	updateChart() {
		if (this.chart) {
			this.chart.data.datasets = this.filteredChartData;
			this.chart.update();
		}
	}

	private updateChartOptions() {
		this.chartLabels = this.getLabels();
		this.chartData = this.getData();
		this.updateChart();
	}

	private getLabels(): string[] {
		this.currentTableData.headers = [];
		const dates: string[] = Array.from(new Set(this.selectedDataset?.map((r: ProductRank) => r.date)));
		const result = dates
			.map((d) => moment(d, 'MM/DD/YYYY').utc(true))
			.sort((a, b) => (a > b ? 1 : -1))
			.map((d) => d.toISOString());
		this.currentTableData.headers = ['Name', ...result];
		return result;
	}

	private getData(): ChartDataSets[] {
		const productASINs = Array.from(new Set(this.selectedDataset?.map((r: ProductRank) => r.ASIN)) ?? []);
		const data: ChartDataSets[] = [];
		this.currentTableData.rows = [];

		for (const ASIN of productASINs) {
			const product: Product | null = this.getProduct(ASIN);

			if (!product) {
				continue;
			}

			const productData = this.getProductData(product);
			this.currentTableData.rows.push([product.name, ...productData]);
			data.push({
				data: productData,
				label: product.name,
				fill: false,
				borderWidth: 1,
			});
		}
		console.log('data', data);
		this.filters = this.generateFilter(data);
		this.updateFilterData(0);
		this.updateTableData(0);
		return data;
	}

	private getProduct(ASIN: string): ProductRank | null {
		return this.selectedDataset?.find((p) => p.ASIN === ASIN) ?? null;
	}

	private getProductData(product: Product): Array<number | null> {
		const productData: Array<number | null> = [];

		for (const day of this.chartLabels) {
			const dayData = this.getProductRankByDay(product, day as string);

			productData.push(dayData?.rank ?? null);
		}

		return productData;
	}

	private getProductRankByDay(product: Product, date: string): ProductRank | null {
		const formattedDate: string = moment(date).utc(true).format('MM/DD/YYYY');

		return this.selectedDataset?.find((p) => p.ASIN === product.ASIN && p.date === formattedDate) ?? null;
	}
}
