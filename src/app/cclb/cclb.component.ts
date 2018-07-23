import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { GetListFn } from '../get-list-fn';
import { StaticData } from '../static-data';

@Component({
  selector: 'app-cclb',
  templateUrl: './cclb.component.html',
  styleUrls: ['./cclb.component.css']
})
export class CclbComponent extends GetListFn {
  public static = new StaticData();
  resetAlert: boolean;
  fullcount: any;
  ccount: any;
  appointPrice: any;
  classType: string;
  appointCnt: any;
  constructor(public data: DataService, public http: HttpService) {
    super(data, http);
    this.resetAlert = this.data.hide;
    this.fullcount = 10000;
    this.url = 'hold/' + this.data.cclbCode;
  }

  sell() {
    this.resetAlert = this.data.show;
  }

  close() {
    this.resetAlert = this.data.hide;
  }

  getList() {
    this.data.clearTimeOut();
    super.getList();
  }

  proFit(data) {
    return this.data.proFit(data);
  }

  /**
 * 选择买入量
 */
  selectCount(text) {
    if (this.fullcount !== '--') {
      this.ccount = text;
      switch (text) {
        case 'full':
          // 选择全仓的时候，判断是否是买入，买入的话，全仓数量按照正常规则。卖出的话，全仓数量为可卖数量
          if (this.classType === 'BUY') {
            this.appointCnt = this.data.roundDown(this.fullcount);
          } else {
            this.appointCnt = this.fullcount;
          }

          break;
        case 'half':
          this.appointCnt = this.data.roundDown(this.fullcount / 2);
          break;
        case '1/3full':
          this.appointCnt = this.data.roundDown(this.fullcount / 3);
          break;
        case '1/4full':
          this.appointCnt = this.data.roundDown(this.fullcount / 4);
          break;
      }
    }

  }

  // /**
  //    * 增加减少买入价
  //    */
  // count(type) {
  //   if (!this.data.isNull(this.appointPrice)) {
  //     if (type === -1 && this.appointPrice > 0 && this.appointPrice > this.stockHQ.lowPrice) {
  //       this.appointPrice = this.appointPrice - 0.01;
  //     } else if (type === 1 && this.appointPrice < this.stockHQ.highPrice) {
  //       this.appointPrice = this.appointPrice + 0.01;
  //     }
  //     this.appointPrice = parseFloat(this.appointPrice.toFixed(2));
  //   }
  // }


  /**
 * 选取价格
 */
  selectPrice(price) {
    if (typeof (price) === 'string') {
      this.appointPrice = parseFloat(parseFloat(price).toFixed(2));
    } else {
      this.appointPrice = price;
    }
  }

}
