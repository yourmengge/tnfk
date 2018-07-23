import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { GetListFn } from '../get-list-fn';
import { StaticData } from '../static-data';

@Component({
  selector: 'app-wtlb',
  templateUrl: './wtlb.component.html',
  styleUrls: ['./wtlb.component.css']
})
export class WtlbComponent extends GetListFn {
  public static = new StaticData();
  constructor(public http: HttpService, public data: DataService) {
    super(data, http);
    this.url = this.static.GET_WT_LIST;
    this.exportName = '委托列表';
    this.exportUrl = this.static.TEAM_APPOINT;
  }
}
