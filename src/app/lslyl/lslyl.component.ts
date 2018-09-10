import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-lslyl',
  templateUrl: './lslyl.component.html',
  styleUrls: ['./lslyl.component.css']
})
export class LslylComponent implements OnInit {
  historyKeyWord = {
    beginTime: '',
    endTime: '',
    accountCode: ''
  };
  list: any;
  code: any;
  exportName: any;
  settimeoutprice: any;
  exportData: any;
  constructor(public http: HttpService, public data: DataService) {
    this.exportName = '对账单';
    this.initData();
  }

  initData() {
    this.historyKeyWord.beginTime = this.data.getTime('yyyy-MM-dd', new Date());
    this.historyKeyWord.endTime = this.data.getTime('yyyy-MM-dd', new Date());
    console.log(this.historyKeyWord);
  }

  ngOnInit() {
    this.data.clearPrice();
    if (!this.data.isNull(this.historyKeyWord.accountCode)) {
      this.getList();
    }

  }
  disabled(type) {
    if (this.data.isNull(type)) {
      return true;
    } else {
      return false;
    }
  }
  getList() {
    const data = {
      beginTime: this.data.getTime('yyyyMMss', this.historyKeyWord.beginTime),
      endTime: this.data.getTime('yyyyMMss', this.historyKeyWord.endTime),
      accountCode: this.historyKeyWord.accountCode
    };
    this.http.getHistoryList(data, 'statement').subscribe((res) => {
      this.list = res;
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  export() {
    const data = {
      beginTime: this.data.getTime('yyyyMMss', this.historyKeyWord.beginTime),
      endTime: this.data.getTime('yyyyMMss', this.historyKeyWord.endTime),
      accountCode: this.historyKeyWord.accountCode
    };
    this.exportData = `accountCode=${data.accountCode}&beginTime=${data.beginTime}&endTime=${data.endTime}`;
    this.http.exportHistoryList(this.exportData, 'statement').subscribe((res) => {
      this.data.downloadFile(res, this.exportName);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }
}
