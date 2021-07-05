import { Component, Input, OnInit } from '@angular/core';
import { TableData } from '../rank-viewer-chart/rank-viewer-chart.component';

@Component({
	selector: 'dh-table',
	templateUrl: './table.component.html',
	styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
	@Input() tableData: TableData | null = {
		headers: [],
		rows: [],
	};
	constructor() {}

	ngOnInit(): void {}

	calculateChangeBetweenRank(currentValue: null | number, previousValue: null | number): number {
		let result = 0;
		if (currentValue && previousValue) {
			result = previousValue - currentValue;
		}
		return result;
	}
}
