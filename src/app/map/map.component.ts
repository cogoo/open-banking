import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  private _routeParams: any;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this._routeParams = this.activatedRoute.snapshot.params;
  }

  get lat() {
    return parseFloat(this._routeParams.lat);
  }

  get lng() {
    return parseFloat(this._routeParams.lng);
  }

}
