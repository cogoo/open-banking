import { takeUntil } from 'rxjs/operators';
import { inject } from '@angular/core/testing';
import { ATM, Brand, ATMElement } from './../interfaces/atm';
import { ApiService } from './../services/api.service';
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
  mapStyles: any[] = [
    {
      elementType: 'labels.text',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'landscape.natural',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#f5f5f2'
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'administrative',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'transit',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.attraction',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'geometry.fill',
      stylers: [
        {
          color: '#ffffff'
        },
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'poi.business',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.medical',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.place_of_worship',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.school',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi.sports_complex',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [
        {
          color: '#ffffff'
        },
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      stylers: [
        {
          visibility: 'simplified'
        },
        {
          color: '#ffffff'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        {
          color: '#ffffff'
        },
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      stylers: [
        {
          color: '#ffffff'
        }
      ]
    },
    {
      featureType: 'road.local',
      stylers: [
        {
          visibility: 'off',
          color: '#ffffff'
        }
      ]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'poi',
      elementType: 'labels.icon',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'water',
      stylers: [
        {
          color: '#71c8d4'
        }
      ]
    },
    {
      featureType: 'landscape',
      stylers: [
        {
          color: '#e5e8e7'
        }
      ]
    },
    {
      featureType: 'poi.park',
      stylers: [
        {
          color: '#8ba129'
        }
      ]
    },
    {
      featureType: 'road',
      stylers: [
        {
          color: '#ffffff'
        }
      ]
    },
    {
      featureType: 'poi.sports_complex',
      elementType: 'geometry',
      stylers: [
        {
          color: '#c7c7c7'
        },
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'water',
      stylers: [
        {
          color: '#a0d3d3'
        }
      ]
    },
    {
      featureType: 'poi.park',
      stylers: [
        {
          color: '#91b65d'
        }
      ]
    },
    {
      featureType: 'poi.park',
      stylers: [
        {
          gamma: 1.51
        }
      ]
    },
    {
      featureType: 'road.local',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road.local',
      elementType: 'geometry',
      stylers: [
        {
          visibility: 'on'
        }
      ]
    },
    {
      featureType: 'poi.government',
      elementType: 'geometry',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'landscape',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road',
      elementType: 'labels',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road.arterial',
      elementType: 'geometry',
      stylers: [
        {
          visibility: 'simplified'
        }
      ]
    },
    {
      featureType: 'road.local',
      stylers: [
        {
          visibility: 'off'
        }
      ]
    },
    {
      featureType: 'road'
    },
    {
      featureType: 'road'
    },
    {},
    {
      featureType: 'road.highway'
    }
  ];


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

      this.usersLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
      this.getClosestATM(this.usersLocation);
      // push update to loading status
      this.loadingStatus$.next('Finding nearest Barclays and Natwest ATMs ...');
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
        const _nearestBarclaysAtms = this.applyHaversine(usersLocation, _barclaysAtms.BrandName, _barclaysAtms.ATM);
        const _nearestNatwestAtms = this.applyHaversine(usersLocation, _natwestAtms.BrandName, _natwestAtms.ATM);

        this.nearestAtms = orderBy(_nearestBarclaysAtms.concat(_nearestNatwestAtms), ['distance'], ['asc']).slice(0, 30);

      });
  }

  applyHaversine(usersLocation: { lat: number, lng: number }, brand: string, locations: ATMElement[]) {

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

      location.Latitude = parseFloat(placeLocation.lat);
      location.Longitude = parseFloat(placeLocation.lng);
      location.Brand = brand;
      location.IconUrl = brand.indexOf('Barclays') >= 0 ? 'assets/logo/barclays_marker.svg' : 'assets/logo/natwest_marker.png';


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
