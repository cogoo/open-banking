import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { Location, PopStateEvent } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private _lastPoppedUrl: string;
  private _yScrollStack = [];

  constructor(
    private router: Router,
    private location: Location
  ) {

  }

  ngOnInit() {
    this.location
      .subscribe((ev: PopStateEvent) => {
        this._lastPoppedUrl = ev.url;
      });
    this.router.events
      .subscribe((ev: any) => {
        if (ev instanceof NavigationStart) {
          if (ev.url !== this._lastPoppedUrl) {
            this._yScrollStack.push(window.scrollY);
          }
        } else if (ev instanceof NavigationEnd) {
          if (ev.url === this._lastPoppedUrl) {
            this._lastPoppedUrl = undefined;
            window.scrollTo(0, this._yScrollStack.pop());
          } else {
            window.scrollTo(0, 0);
          }
        }
      });
  }
}
