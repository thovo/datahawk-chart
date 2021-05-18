import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RankViewerComponent } from './rank-viewer.component';


const routes: Routes = [
    {
        path: '',
        component: RankViewerComponent,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RankViewerRoutingModule { }
