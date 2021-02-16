import { PlatformLocation } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  apiData:string;
  url:string;

  constructor( platformLocation: PlatformLocation) {
      this.url=(platformLocation as any).location.hostname;
      this.apiData="http://" + this.url + ":3000";
  }
}
