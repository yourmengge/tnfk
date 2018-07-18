import { Component, DoCheck } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { StaticData } from '../static-data';
import { Productlist } from '../productlist';

@Component({
  selector: 'app-cpcjlb',
  templateUrl: './cpcjlb.component.html',
  styleUrls: ['./cpcjlb.component.css']
})
export class CpcjlbComponent extends Productlist {
  public static = new StaticData();
  constructor(public data: DataService, public http: HttpService) {
    super(data, http);
    this.url = this.static.PRODUCT_TRADE;
    this.exportName = '产品成交列表';
  }
  /**
 * 获取委托列表
 */
  getList() {
    this.data.clearTimeOut();
    super.getList();
  }

  export() {
    super.export('product/' + this.code + '/trade/export');
  }

}
