import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { GetListFn } from '../get-list-fn';
import { StaticData } from '../static-data';

@Component({
  selector: 'app-cjlb',
  templateUrl: './cjlb.component.html',
  styleUrls: ['./cjlb.component.css']
})
export class CjlbComponent extends GetListFn {
  public static = new StaticData();
  constructor(public data: DataService, public http: HttpService) {
    super(data, http);
    this.url = this.static.GET_TRADE;
    this.exportName = '成交列表';
    this.exportUrl = this.static.TEAM_TRADE;
  }

  stockId(index) {
    return index;
  }
}
