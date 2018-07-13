import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { environment } from './../../environments/environment.prod';
import { AgmCoreModule } from '@agm/core';
import { CoreModule } from './../core-components/core-module.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksComponent } from './banks.component';

describe('BanksComponent', () => {
  let component: BanksComponent;
  let fixture: ComponentFixture<BanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreModule,
        HttpClientModule,
        RouterTestingModule,
        AgmCoreModule.forRoot({
          apiKey: environment.googleMapsKey
        })
      ],
      declarations: [BanksComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
