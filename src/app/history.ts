import { DataService } from './data.service';
import { HttpService } from './http.service';
import { DoCheck } from '@angular/core';

export class History implements DoCheck {
    constructor(public data: DataService, public http: HttpService) {

    }
    ngDoCheck() {
    }
}
