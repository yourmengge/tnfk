import { Component, DoCheck } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-cpzj',
  templateUrl: './cpzj.component.html',
  styleUrls: ['./cpzj.component.css']
})
export class CpzjComponent implements DoCheck {
  userCode: any;
  code: string;
  list: any;
  jyyList: any;
  listData: any;
  jyyCode: string;
  alert: any;
  checkedAll: boolean;
  checkList = [];
  constructor(public data: DataService, public http: HttpService) {
  }

  ngDoCheck() {
    if (this.code !== this.data.productCode) {
      this.code = this.data.productCode;
      this.list = [];
      this.checkList = [];
      if (!this.data.isNull(this.code)) {
        this.getList();
      }

    }
  }

  refresh() {
    this.http.refresh(this.code).subscribe((res) => {
      this.getList();
      this.data.ErrorMsg('刷新列表成功');
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  getList() {
    this.data.clearTimeOut();
    this.http.productHold(this.code).subscribe((res) => {
      this.list = res;
      this.list.ableCnt = this.list.ableScale;
      this.data.settimeout = setTimeout(() => {
        this.getList();
      }, this.data.timeout);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  fptd() {
    let i = 0;
    if (this.list.ableCnt > this.list.ableScale) {
      this.data.ErrorMsg('分配数量不能大于股票数量');
      return i = 1;
    } else if (this.list.ableCnt <= 0) {
      this.data.ErrorMsg('分配数量必须大于0');
      return i = 1;
    }
    if (i === 0) {
      this.alert = this.data.show;
      this.getJyyList();
    }
  }

  /**
 * 获取团队列表
 */
  getJyyList() {
    this.data.Loading(this.data.show);
    this.http.getTeamList().subscribe((res) => {
      this.jyyList = res;
      this.data.Loading(this.data.hide);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  /**
 * 选择交易员
 */
  selectJYY(a) {
    this.jyyCode = a.teamCode;
  }

  /**
 * 确认选择
 */
  submitJYY() {
    const data = {
      teamCode: this.jyyCode,
      productCode: this.list.productCode,
      ableScale: this.list.ableCnt,
      execType: 1
    };
    this.submit(data);
  }

  close() {
    this.alert = this.data.hide;
    this.jyyCode = '';
  }

  /**
 * 确认分配给交易员
 */
  submit(data) {
    this.data.Loading(this.data.show);
    this.http.coupon({ list: [data] }).subscribe((res) => {
      console.log(res);
      this.data.ErrorMsg('提交成功');
      this.close();
      this.list = [];
      this.getList();
      this.checkList = [];
      this.data.Loading(this.data.hide);
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

