import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { GetListFn } from '../get-list-fn';
import { StaticData } from '../static-data';
import { ActivatedRoute } from '@angular/router';

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
  accountCode: any;
  stockHQ: any;
  stockName: string;
  constructor(public data: DataService, public http: HttpService, public activeRoute: ActivatedRoute) {
    super(data, http);
    this.resetAlert = this.data.hide;
    this.fullcount = 10000;
    this.stockHQ = this.data.stockHQ;
    this.accountCode = this.activeRoute.snapshot.params['id'];
    this.url = 'tn/hold/' + this.accountCode;
  }

  sell(a) {
    this.appointCnt = '';
    const data = {
      stockCode: a.stockCode,
      accountCode: this.accountCode
    };
    this.stockName = a.stockName;
    this.resetAlert = this.data.show;
    this.getHanQing(data);
  }

  /**
  * 获取行情
  */
  getHanQing(data) {

    this.http.getHanQing(data).subscribe((res) => {
      if (!this.data.isNull(res['resultInfo']['quotation'])) {
        this.stockHQ = res['resultInfo']['quotation'];
        if (this.stockName.includes('ST')) {
          this.stockHQ.lowPrice = Math.round(this.stockHQ.preClosePrice * 95) / 100;
          this.stockHQ.highPrice = Math.round(this.stockHQ.preClosePrice * 105) / 100;
        } else {
          this.stockHQ.lowPrice = Math.round(this.stockHQ.preClosePrice * 90) / 100;
          this.stockHQ.highPrice = Math.round(this.stockHQ.preClosePrice * 110) / 100;
        }
        this.fullcount = res['resultInfo']['maxAppointCnt'];
        this.appointPrice = Math.round(parseFloat(this.stockHQ.lastPrice) * 100) / 100;
      } else {
        this.stockHQ = this.data.stockHQ;
      }
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  /**
    * 买入
    */
  buy() {
    if (this.data.Decimal(this.appointPrice) > 2) {
      this.data.ErrorMsg('委托价格不能超过两位小数');
    } else if (this.data.isNull(this.appointPrice)) {
      this.data.ErrorMsg('委托价格不能为空');
    } else if (this.appointPrice < parseFloat(this.stockHQ.lowPrice).toFixed(2)) {
      this.data.ErrorMsg('委托价格不能低于跌停价');
    } else if (this.appointPrice > parseFloat(this.stockHQ.highPrice).toFixed(2)) {
      this.data.ErrorMsg('委托价格不能高于涨停价');
    } else if (this.appointCnt % 100 !== 0) {
      if (this.appointCnt !== this.fullcount) {
        this.data.ErrorMsg('平仓数量必须是100的整数倍');
      }
    } else if (this.appointCnt > this.fullcount) {
      this.data.ErrorMsg('平仓数量必须小于可卖股数');
    } else if (this.appointCnt <= 0) {
      this.data.ErrorMsg('平仓数量必须大于0');
    } else {
      this.submintBuy();
    }
  }

  /**
   * 买入确认
   */
  submintBuy() {
    this.data.Loading(this.data.show);
    const content = {
      'stockCode': this.stockHQ.stockCode,
      'appointCnt': this.appointCnt,
      'appointPrice': this.appointPrice
    };
    this.http.order(this.accountCode, content).subscribe((res: Response) => {
      if (res['success']) {
        this.data.ErrorMsg('委托已提交');
        this.data.Loading(this.data.hide);
        this.getList();
        this.close();
      }
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  /**
 * 返回行情加个颜色
 */
  HQColor(price) {
    if (price !== '--') {
      if (price > this.stockHQ.preClosePrice) {
        return 'red';
      } else if (price < this.stockHQ.preClosePrice) {
        return 'green';
      } else {
        return '';
      }
    }

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

  /**
     * 增加减少买入价
     */
  count(type) {
    if (!this.data.isNull(this.appointPrice)) {
      if (type === -1 && this.appointPrice > 0 && this.appointPrice > this.stockHQ.lowPrice) {
        this.appointPrice = this.appointPrice - 0.01;
      } else if (type === 1 && this.appointPrice < this.stockHQ.highPrice) {
        this.appointPrice = this.appointPrice + 0.01;
      }
      this.appointPrice = parseFloat(this.appointPrice.toFixed(2));
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
