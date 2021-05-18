import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const DEFAULT_MODULE = 'rank-viewer';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: DEFAULT_MODULE
  },
  {
    path: 'rank-viewer',
    loadChildren: () => import(`./modules/rank-viewer/rank-viewer.module`).then((mod) => mod.RankViewerModule)
  },
  {
    path: '**',
    redirectTo: DEFAULT_MODULE
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
