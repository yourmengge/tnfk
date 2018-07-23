import { Component } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { GetListFn } from '../get-list-fn';
import { StaticData } from '../static-data';

@Component({
  selector: 'app-dplb',
  templateUrl: './dplb.component.html',
  styleUrls: ['./dplb.component.css']
})
export class DplbComponent extends GetListFn {
  public static = new StaticData();
  constructor(public data: DataService, public http: HttpService) {
    super(data, http);
    this.url = this.static.GET_CLOSE;
  }

  cancle(a) {
    this.confirmText = '确认撤单？';
    this.resData = {
      productCode: a.productCode,
      teamCode: this.code,
      accountCode: a.accountCode,
      stockCode: a.stockCode,
      appointOrderCode: a.appointOrderCode
    };
    this.confirm = this.data.show;
    this.actionType = 'cancle';

  }

  submit(type) {
    if (type) { // confirm返回true表示点击确认
      this.http.appointCancel(this.resData).subscribe((res) => {
        this.getList();
        this.data.ErrorMsg('撤单已提交');
        this.closeConfirm();
      }, (err) => {
        this.data.error = err.error;
        this.data.isError();
        this.closeConfirm();
      });
    } else {
      this.closeConfirm();
    }
  }

  closeConfirm() {
    this.confirm = this.data.hide;
  }

}
