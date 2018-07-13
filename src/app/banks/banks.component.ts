import { GeoService } from '../services/geo.service';
import { takeUntil } from 'rxjs/operators';
import { ATM, Brand, ATMElement } from '../interfaces/atm';
import { ApiService } from '../services/api.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, BehaviorSubject, combineLatest, Observable } from 'rxjs';



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
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit, OnDestroy {

  usersLocation: { lat: number, lng: number };
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

        this.usersLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.getClosestATM(this.usersLocation);
        // push update to loading status
        this.loadingStatus$.next('Finding Barclays and Natwest ATMs ...');
      }, (err) => {
        this.loadingStatus$.next('Your position could not be determined, please refresh and try again');
      });
  }

  getClosestATM(usersLocation: { lat: number, lng: number }) {
    // Update loading status
    this.loadingStatus$.next('Calculating nearest ATMs ...');
    const _barclaysAtm = this.api.get('barclaysAtm', 'atms');
    const _natwestAtm = this.api.get('natwestAtm', 'atms');

    const combinedAtm = combineLatest(_barclaysAtm, _natwestAtm);


    combinedAtm
      .pipe(
        takeUntil(this.destroys$)
      )
      .subscribe((res: any) => {
        const _barclaysAtms = (<ATM>res[0]).data[0].Brand[0];
        const _natwestAtms = (<ATM>res[1]).data[0].Brand[1];
        const _nearestBarclaysAtms = this.geo.applyHaversine(usersLocation, _barclaysAtms.ATM, _barclaysAtms.BrandName);
        const _nearestNatwestAtms = this.geo.applyHaversine(usersLocation, _natwestAtms.ATM, _natwestAtms.BrandName);

        this.nearestAtms = orderBy(_nearestBarclaysAtms.concat(_nearestNatwestAtms), ['distance'], ['asc']).slice(0, 30);

      });
  }

  ngOnDestroy() {
    this.destroys$.next(false);
    this.destroys$.unsubscribe();

  }

}
