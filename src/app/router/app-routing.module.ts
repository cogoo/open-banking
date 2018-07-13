import { BanksComponent } from '../banks/banks.component';
import { HomeComponent } from '../home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'banks',
    component: BanksComponent
  },
  { path: 'map', loadChildren: './lazy-routing.module#LazyRoutingModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
