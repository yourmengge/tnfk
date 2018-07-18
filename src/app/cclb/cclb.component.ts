import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-cclb',
  templateUrl: './cclb.component.html',
  styleUrls: ['./cclb.component.css']
})
export class CclbComponent implements OnInit {
  resetAlert: boolean;
  fullcount: any;
  ccount: any;
  appointPrice: any;
  classType: string;
  appointCnt: any;
  constructor(public data: DataService, public http: HttpService) {
    this.resetAlert = this.data.show;
    this.fullcount = 10000;
  }

  sell() {
    this.resetAlert = this.data.show;
  }

  close() {
    this.resetAlert = this.data.hide;
  }

  ngOnInit() {
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
