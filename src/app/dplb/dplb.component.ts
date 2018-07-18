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

  search() {
    this.searchCode = this.userCode;
    this.data.userCode = this.searchCode;
    this.getList();
  }

  getList() {
    this.data.clearTimeOut();
    super.getList();
  }

  searchAll() {
    this.searchCode = '';
    this.getList();
  }

  sell(a) {
    this.confirmText = '确认平仓？';
    this.sellType = 'SELL';
    this.resData = {
      productCode: a.productCode,
      teamCode: this.code,
      accountCode: a.accountCode,
      stockCode: a.stockCode,
      appointPrice: a.appointPrice,
      appointCnt: a.uncloseCnt
    };
    if (a.appointType === 2) {
      this.sellType = 'BUY';
    }
    this.actionType = 'sell';
    this.confirm = this.data.show;
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
      if (this.actionType === 'sell') {
        this.http.appointSELL(this.resData, this.sellType).subscribe((res) => {
          this.getList();
          this.data.ErrorMsg('平仓已提交');
          this.closeConfirm();
        }, (err) => {
          this.data.error = err.error;
          this.data.isError();
          this.closeConfirm();
        });
      } else {
        this.http.appointCancel(this.resData).subscribe((res) => {
          this.getList();
          this.data.ErrorMsg('撤单已提交');
          this.closeConfirm();
        }, (err) => {
          this.data.error = err.error;
          this.data.isError();
          this.closeConfirm();
        });
      }
    } else {
      this.closeConfirm();
    }
  }

  closeConfirm() {
    this.confirm = this.data.hide;
  }

}
