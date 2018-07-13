import { GeoService } from '../services/geo.service';
import { takeUntil, take } from 'rxjs/operators';
import { inject } from '@angular/core/testing';
import { ATM, Brand, ATMElement } from '../interfaces/atm';
import { ApiService } from '../services/api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { filter, orderBy } from 'lodash';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
  stagger
} from '@angular/animations';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query('.list-item', style({ opacity: 0, transform: 'scale(0.7)' })),
        query('.list-item',
          stagger('100ms', [
            animate('300ms', style({ opacity: 1, transform: 'scale(1)' }))
          ]))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {

  destroys$: Subject<boolean> = new Subject<boolean>();
  barclaysAtm: Brand;
  nearestAtms: ATMElement[];
  loadingStatus$: BehaviorSubject<string> = new BehaviorSubject<string>('Getting your current position ...');
  loadingStatus: string;

  constructor(
    private api: ApiService,
    private geo: GeoService
  ) { }

  ngOnInit() {

    // get users location
    this.getUserLocation();

    // subscribe to loading status observable
    this.loadingStatus$
      .pipe(
        takeUntil(this.destroys$)
      )
      .subscribe((status) => {
        this.loadingStatus = status;
      });
  }

  getUserLocation() {

    // this.geo.getUserLocation({
    //   enableHighAccuracy: false,
    //   timeout: 10000
    // })
    this.geo.geoLocation$
      .pipe(
        takeUntil(this.destroys$)
      )
      .subscribe((position) => {
        console.log('position: ', position);
        this.getClosestATM({ lat: position.coords.latitude, lng: position.coords.longitude });
        // push update to loading status
        this.loadingStatus$.next('Finding Barclays ATMs ...');
      }, (err) => {
        this.loadingStatus$.next('Your position could not be determined, please refresh and try again');
      });


  }

  getClosestATM(usersLocation: { lat: number, lng: number }) {
    // Update loading status
    this.loadingStatus$.next('Calculating nearest ATMs ...');
    this.api.get('barclaysAtm', 'atms')
      .pipe(
        takeUntil(this.destroys$)
      )
      .subscribe((res: any) => {
        const _barclaysAtm = (<ATM>res).data[0].Brand[0];
        const _nearestAtms = this.geo.applyHaversine(usersLocation, _barclaysAtm.ATM);
        this.nearestAtms = orderBy(_nearestAtms, ['distance'], ['asc']).slice(0, 10);
      });
  }

  ngOnDestroy() {
    this.destroys$.next(false);
    this.destroys$.unsubscribe();
  }

}
