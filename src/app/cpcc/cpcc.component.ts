import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { StaticData } from '../static-data';
import { Productlist } from '../productlist';

@Component({
  selector: 'app-cpcc',
  templateUrl: './cpcc.component.html',
  styleUrls: ['./cpcc.component.css']
})
export class CpccComponent extends Productlist {
  public static = new StaticData();
  constructor(public data: DataService, public http: HttpService) {
    super(data, http);
    this.url = '/hold';
    this.exportName = '委托列表';
  }

  refresh() {
    this.http.refresh(this.code).subscribe((res) => {
      this.data.ErrorMsg('刷新列表成功');
      this.getList();
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  history() {
    this.data.goto('main/cpgl/history');
  }

  trackBy(a) {
    return a.ableCnt;
  }

}
