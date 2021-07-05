import { ChartOptions } from 'chart.js';

export const CHART_OPTIONS: ChartOptions = {
	defaultColor: 'green',
	responsive: true,
	maintainAspectRatio: true,
	spanGaps: true,
	scales: {
		xAxes: [
			{
				stacked: false,
				type: 'time',
				time: {
					unit: 'day',
				},
				ticks: {
					maxTicksLimit: 10,
				},
				gridLines: {
					display: true,
				},
				scaleLabel: {
					display: true,
					labelString: 'Day',
				},
			},
		],
		yAxes: [
			{
				ticks: {
					reverse: true,
					min: 1,
				},
				gridLines: {
					display: true,
				},
				scaleLabel: {
					display: true,
					labelString: 'Rank',
				},
			},
		],
	},
	elements: {
		line: {
			tension: 0.5,
		},
	},
	layout: {
		padding: 20,
	},
	plugins: {
		legend: {
			labels: {
				font: {
					size: 12,
					family: 'monospace',
				},
			},
		},
	},
};
