import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { Productlist } from '../productlist';
import { StaticData } from '../static-data';
@Component({
  selector: 'app-cpwtlb',
  templateUrl: './cpwtlb.component.html',
  styleUrls: ['./cpwtlb.component.css']
})
export class CpwtlbComponent extends Productlist {
  public static = new StaticData();
  constructor(public http: HttpService, public data: DataService) {
    super(data, http);
    this.url = this.static.PRODUCT_APPOINT;
    this.exportName = '产品委托列表';
    this.exportUrl = '/appoint/export';
  }
}
