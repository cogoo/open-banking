import { environment } from './../../environments/environment';
import { AgmCoreModule } from '@agm/core';
import { MapComponent } from './../map/map.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'atm/:lat/:lng', component: MapComponent }
];

@NgModule({
  imports: [
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleMapsKey
    }),
    RouterModule.forChild(routes)
  ],
  declarations: [
    MapComponent
  ]
})
export class LazyRoutingModule { }
