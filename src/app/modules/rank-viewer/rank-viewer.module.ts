import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RankViewerRoutingModule } from './rank-viewer-routing.module';
import { RankViewerChartComponent } from './components/rank-viewer-chart/rank-viewer-chart.component';
import { RankViewerFiltersComponent } from './components/rank-viewer-filters/rank-viewer-filters.component';
import { RankViewerComponent } from './rank-viewer.component';
import { ChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { TableComponent } from './components/table/table.component';

@NgModule({
    declarations: [
        RankViewerComponent,
        RankViewerFiltersComponent,
        RankViewerChartComponent,
        TableComponent,
    ],
    imports: [
        CommonModule,
        ChartsModule,
        FormsModule,
        RankViewerRoutingModule
    ],
    providers: []
})
export class RankViewerModule { }
