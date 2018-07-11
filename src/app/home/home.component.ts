import { takeUntil } from 'rxjs/operators';
import { inject } from '@angular/core/testing';
import { ATM, Brand, ATMElement } from './../interfaces/atm';
import { ApiService } from './../services/api.service';
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
    private api: ApiService
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
    navigator.geolocation.getCurrentPosition((position) => {
      this.getClosestATM({ lat: position.coords.latitude, lng: position.coords.longitude });
      // push update to loading status
      this.loadingStatus$.next('Finding Barclays ATMs ...');
    }, () => {
      // if timeout, do fallback? using IP address?
      this.loadingStatus$.next('Your position could not be determined, please refresh and try again');
    }, {
        enableHighAccuracy: false,
        timeout: 10000
      }
    );
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
        const _nearestAtms = this.applyHaversine(usersLocation, _barclaysAtm.ATM);
        this.nearestAtms = orderBy(_nearestAtms, ['distance'], ['asc']).slice(0, 10);
      });
  }

  applyHaversine(usersLocation: { lat: number, lng: number }, locations: ATMElement[]) {

    locations.map((location) => {

      const placeLocation = {
        lat: location.Location.PostalAddress.GeoLocation.GeographicCoordinates.Latitude,
        lng: location.Location.PostalAddress.GeoLocation.GeographicCoordinates.Longitude
      };

      location.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'miles'
      ).toFixed(2);
    });

    return locations;
  }

  getDistanceBetweenPoints(start, end, units) {

    const earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    const R = earthRadius[units || 'miles'];
    const lat1 = start.lat;
    const lon1 = start.lng;
    const lat2 = end.lat;
    const lon2 = end.lng;

    const dLat = this.toRad((lat2 - lat1));
    const dLon = this.toRad((lon2 - lon1));
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d;

  }

  toRad(x) {
    return x * Math.PI / 180;
  }

  ngOnDestroy() {
    this.destroys$.next(false);
    this.destroys$.unsubscribe();

  }

}
