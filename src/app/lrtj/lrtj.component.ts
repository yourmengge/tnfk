import { Component, DoCheck } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { GetListFn } from '../get-list-fn';
import { StaticData } from '../static-data';

@Component({
  selector: 'app-lrtj',
  templateUrl: './lrtj.component.html',
  styleUrls: ['./lrtj.component.css']
})
export class LrtjComponent extends GetListFn {
  public static = new StaticData();
  constructor(public http: HttpService, public data: DataService) {
    super(data, http);
    this.url = this.static.GET_TEAM_PROFIT;
    this.exportName = '利润列表';
    this.exportUrl = this.static.TEAM_PROFIT;
  }
  fontColor(text) {
    return text === '买入' ? 'red' : text === '卖出' ? 'green' : '';
  }
}
