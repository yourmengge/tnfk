import { Component, DoCheck } from '@angular/core';
import { DataService } from '../data.service';
import { HttpService } from '../http.service';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-zhxx',
  templateUrl: './zhxx.component.html',
  styleUrls: ['./zhxx.component.css']
})
export class ZhxxComponent implements DoCheck {
  temp: any;
  searchCode: any;
  accountStatus: any;
  isAutoShutdown: any;
  code: string;
  list: any;
  proName: any;
  checkId: any;
  userCode: any;
  alert: boolean;
  textType: string;
  deleteData: any;
  accountDetail: any;
  resetAlert: any;
  selectDetail: any;
  newPass: any;
  roleCode = 2;
  confirm: boolean;
  confirmText: string;
  actionType = 'del';
  proList: any;
  isSort: boolean;
  sortType: boolean;
  sortName: any;
  sortData: any;
  lockScale: any; // 冻结资金
  stockList: string;
  textFile: any;
  witheStockCode: any;
  constructor(public data: DataService, public http: HttpService) {
    this.initAccountDetail();
    this.confirmText = '确定结案投顾？';
    this.confirm = this.data.hide;
    this.checkId = '';
    this.newPass = '';
    this.resetAlert = this.data.hide;
    this.selectDetail = this.accountDetail;
    this.temp = '';
    this.code = '';
    this.isAutoShutdown = 1;
    this.accountStatus = 0;
    this.userCode = this.data.userCode;
    this.alert = this.data.hide;
    this.textType = '新增';
    this.isSort = false;
    this.sortType = false;

  }

  ngDoCheck() {
    if (this.code !== this.data.teamCode && !this.data.isNull(this.data.teamCode)) {
      this.code = this.data.teamCode;
      this.checkId = '';
      this.userCode = this.data.userCode;
      this.temp = '';
      this.search();
    }
  }

  history() {
    this.data.goto('main/tdgl/history');
  }

  search() {
    this.searchCode = this.userCode;
    this.data.userCode = this.searchCode;
    this.getList();
  }

  getList() {
    this.data.clearTimeOut();
    const data = {
      teamCode: this.code,
      accountCode: this.searchCode
    };
    this.http.getTeamMember(data).subscribe((res) => {
      this.list = res;
      if (this.isSort) {
        this.sort(this.sortData, this.sortName);
      }
      this.data.settimeout = setTimeout(() => {
        this.getList();
      }, this.data.timeout);
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  goto(url) {
    this.data.goto('main/tdgl/' + url);
  }

  searchAll() {
    this.searchCode = '';
    this.getList();
  }

  disabled(temp) {
    if (this.data.roleCode === '0') {
      return true;
    } else if (this.data.roleCode === '1' && temp === '') {
      return true;
    } else {
      return false;
    }
  }

  close() {
    if (this.textType === '新增') {
      this.initAccountDetail();
    }
    this.resetAlert = this.data.hide;
    this.alert = this.data.hide;
  }

  initAccountDetail() {
    this.accountDetail = {
      accountCode: '',
      accountCommission: '',
      accountName: '',
      accountPwd: '',
      allottedScale: '',
      cordonLine: '',
      flatLine: '',
      productCode: '',
      cashScale: '',
      accountStatus: '',
      teamCode: this.code,
      mainSingleVote: '',
      growthSingleVote: '',
      accDesc: ''
    };
    this.stockList = '';
  }

  add() {
    this.initAccountDetail();
    this.textType = '新增';
    this.alert = this.data.show;
    this.getProList();
  }

  addStock(witheStockCode) {
    if (!this.stockList.includes(witheStockCode) && !this.data.isNull(witheStockCode)) { // 新增股票时判断是否存在
      // 判断stocklist是否为空，为空等白名单代码，否则加上逗号
      this.stockList = this.stockList === '' ? witheStockCode : `${this.stockList},${witheStockCode}`;
      this.witheStockCode = '';
    }
  }

  delStock() {
    if (this.stockList.includes(this.witheStockCode) && !this.data.isNull(this.witheStockCode)) { // 删除股票时判断是否存在
      if (this.stockList.split(',').length === 1) { // stockList只有一个值
        this.stockList = '';
      } else { // 有多个值时，将股票号码和前面的逗号替换成空
        this.stockList = this.stockList.replace(`,${this.witheStockCode}`, '');
      }
    }
  }

  getProList() {
    this.http.getTeamProList(this.data.teamCode).subscribe((res) => {
      this.proList = res;
      this.accountDetail.productCode = res[0]['productCode'];
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  upload(e) {
    const file = e.target.files[0];
    if (!this.data.isNull(file)) {
      const reader = new FileReader();
      reader.readAsText(file, 'gb231');
      reader.onload = (res) => {
        const resData = res.target['result'];
        const list = resData.split(/\n/);
        list.forEach(element => {
          element = element.replace(/\s+/g, '');
          this.addStock(element);
        });
        this.textFile = '';
      };
    }
  }

  addSubmit() {
    this.accountDetail.accDesc = `stocklist=${this.stockList};`;
    this.accountDetail.teamCode = this.code;
    if (this.textType === '新增') {
      if (this.accountDetail.accountCode === '') {
        this.data.ErrorMsg('投顾账号不能为空');
      } else if (this.accountDetail.accountName === '') {
        this.data.ErrorMsg('投顾姓名不能为空');
      } else if (!this.data.accountValid.test(this.accountDetail.accountCode)) {
        this.data.ErrorMsg('投顾账号不能为中文和特殊字符，只能是数字字母下划线');
      } else if (this.accountDetail.accountPwd === '') {
        this.data.ErrorMsg('投顾密码不能为空');
      } else if (this.data.isNull(this.accountDetail.allottedScale) || this.data.Decimal(this.accountDetail.allottedScale) > 2) {
        this.data.ErrorMsg('期初规模必填且只能为数字，且不能超过两位小数');
      } else if (this.data.isNull(this.accountDetail.cashScale) || this.data.Decimal(this.accountDetail.cashScale) > 2) {
        this.data.ErrorMsg('保证金必填且只能为数字，且不能超过两位小数');
      } else if (this.data.isNull(this.accountDetail.flatLine) || this.accountDetail.flatLine < 0 || this.accountDetail.flatLine > 1) {
        this.data.ErrorMsg('平仓线比例必填且只能为0-1的数字');
        // tslint:disable-next-line:max-line-length
      } else if (this.data.isNull(this.accountDetail.cordonLine) || this.accountDetail.cordonLine < 0 || this.accountDetail.cordonLine > 1) {
        this.data.ErrorMsg('警戒线比例必填且只能为0-1的数字');
        // tslint:disable-next-line:max-line-length
      } else if (this.data.isNull(this.accountDetail.mainSingleVote) || this.accountDetail.mainSingleVote < 0 || this.accountDetail.mainSingleVote > 1) {
        this.data.ErrorMsg('主板单票比例必填且只能为0-1的数字');
        // tslint:disable-next-line:max-line-length
      } else if (this.data.isNull(this.accountDetail.growthSingleVote) || this.accountDetail.growthSingleVote < 0 || this.accountDetail.growthSingleVote > 1) {
        this.data.ErrorMsg('创业板比例必填且只能为0-1的数字');
      } else if (this.accountDetail.flatLine > this.accountDetail.cordonLine) {
        this.data.ErrorMsg('平仓线比例必须小于等于警戒线比例');
      } else if (this.data.isNull(this.accountDetail.accountCommission)) {
        this.data.ErrorMsg('交易佣金必填且只能为数字');
      } else {
        this.accountDetail.accountStatus = 0;
        // accountData.accountPwd = Md5.hashStr(accountData.accountPwd);
        console.log(this.accountDetail);
        this.submit(this.accountDetail, 'ADD', '添加');
      }
    } else {
      if (this.accountDetail.accountName === '') {
        this.data.ErrorMsg('投顾姓名不能为空');
      } else if (this.data.isNull(this.accountDetail.flatLine) || this.accountDetail.flatLine < 0 || this.accountDetail.flatLine > 1) {
        this.data.ErrorMsg('平仓线比例必填且只能为0-1的数字');
        // tslint:disable-next-line:max-line-length
      } else if (this.data.isNull(this.accountDetail.cordonLine) || this.accountDetail.cordonLine < 0 || this.accountDetail.cordonLine > 1) {
        this.data.ErrorMsg('警戒线比例必填且只能为0-1的数字');
      } else if (this.accountDetail.flatLine > this.accountDetail.cordonLine) {
        this.data.ErrorMsg('平仓线比例必须小于等于警戒线比例');
      } else if (this.data.isNull(this.accountDetail.accountCommission)) {
        this.data.ErrorMsg('交易佣金必填且只能为数字');
      } else {
        this.submit(this.accountDetail, 'UPDATE', '修改');
      }
    }
  }

  submit(data, type, text) {
    this.http.addJyy(data, type).subscribe((res) => {
      this.data.ErrorMsg(text + '成功');
      this.getList();
      this.checkId = '';
      this.stockList = '';
      this.temp = '';
      this.close();
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  sortList(data, type) {
    this.sortType = !this.sortType;
    this.sortData = data;
    this.sortName = type;
    this.sort(this.sortData, this.sortName);
  }

  sort(data, type) {
    this.isSort = true;
    this.list.sort((a, b) => {
      if (type === 'num') {
        if (this.sortType) {
          return (b[data] - a[data]);
        } else {
          return (a[data] - b[data]);
        }
      } else {
        if (this.sortType) {
          return a[data].localeCompare(b[data]);
        } else {
          return b[data].localeCompare(a[data]);
        }
      }


    });
  }

  select(data, index) {
    this.checkId = index;
    this.temp = data.accountCode;
    this.userCode = data.accountCode;
    this.lockScale = data.lockScale;
    this.selectDetail = Object.assign({ teamCode: this.code, accountCommission: this.numFormat(data.accountCommission) }, data);
  }

  numFormat(num) {
    return this.data.getFullNum(num);
  }

  update() {
    if (this.temp !== '') {
      this.alert = this.data.show;
      this.textType = '修改';
      this.stockList = this.selectDetail['accDesc'].split(';')[0].split('=')[1];
      this.accountDetail = Object.assign({}, this.selectDetail);
    }
  }

  tdColor(a) {
    const data = a;
    if (data.accountStatus > 1) {
      if (data.accountStatus === 2) {
        return 'red';
      } else if (data.accountStatus === 3) {
        return 'orange';
      }
    } else {
      return '';
    }
    // if (data.profit < 0) {
    //   if (Math.abs(data.profit) >= data.cashScale * data.flatLine) {
    //     return 'red';
    //   }
    //   if (Math.abs(data.profit) >= data.cashScale * data.cordonLine && Math.abs(data.profit) < data.cashScale * data.flatLine) {
    //     return 'orange';
    //   }
    // } else {
    //   return '';
    // }
  }

  cclb() {
    if (this.temp !== '') {
      this.data.setSession('lockScale', this.lockScale);
      this.data.gotoId('main/tdgl/cclb', this.selectDetail.accountCode + '-' + this.selectDetail.accountName);
    }
  }

  proFit(data) {
    return this.data.proFit(data);
  }

  del() {
    this.confirmText = '确定结案投顾？';
    this.deleteData = {
      accountCode: this.selectDetail.accountCode,
      teamCode: this.code
    };
    this.actionType = 'del';
    this.confirm = this.data.show;

  }

  submitDelete(type) {
    if (type) {
      if (this.actionType === 'del') {
        this.http.delJyy(this.deleteData).subscribe((res) => {
          this.data.ErrorMsg('结案成功');
          this.checkId = '';
          this.temp = '';
          this.getList();
          this.closeConfirm();
        }, (err) => {
          this.data.error = err.error;
          this.data.isError();
          this.closeConfirm();
        });
      } else {
        this.resetSubmit();
      }
    } else {
      this.closeConfirm();
    }

  }

  dplb() {
    this.searchCode = this.selectDetail.accountCode;
    this.data.userCode = this.searchCode;
    this.data.goto('main/tdgl/dplb');
  }

  closeConfirm() {
    this.confirm = this.data.hide;
  }

  reset() {
    this.confirm = this.data.show;
    this.actionType = 'reset';
    this.confirmText = '确定重置密码？';
  }

  resetSubmit() {
    const data = {
      accountCode: this.selectDetail.accountCode,
      newPasswd: Md5.hashStr('123456')
    };
    this.http.reset(data).subscribe((res) => {
      this.data.ErrorMsg('重置密码成功,新密码为123456');
      this.getList();
      this.closeConfirm();
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }
}
