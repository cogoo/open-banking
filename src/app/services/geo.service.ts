import { ATMElement } from '../interfaces/atm';
import { Injectable } from '@angular/core';
import { Observable, Observer, Subject, BehaviorSubject, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeoService {

  geoLocation$: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor() {
    this.getUserLocation();
  }

  getUserLocation(options?) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.geoLocation$.next(position);
      },
      (err) => {
        this.geoLocation$.error(err);
      },
      options
    );
  }

  applyHaversine(usersLocation: { lat: number, lng: number }, locations: ATMElement[], brand?: string) {

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

      if (brand) {
        location.Brand = brand;
        location.IconUrl = brand.indexOf('Barclays') >= 0 ? 'assets/logo/barclays_marker.svg' : 'assets/logo/natwest_marker.png';
      }
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
}
