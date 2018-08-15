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
        this.sort();
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
      teamCode: this.code
    };
  }

  add() {
    this.initAccountDetail();
    this.textType = '新增';
    this.alert = this.data.show;
    this.getProList();
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

  addSubmit() {
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
      } else if (this.data.isNull(this.accountDetail.allottedScale)) {
        this.data.ErrorMsg('期初规模必填且只能为数字');
      } else if (this.data.isNull(this.accountDetail.cashScale)) {
        this.data.ErrorMsg('保证金必填且只能为数字');
      } else if (this.data.isNull(this.accountDetail.flatLine) || this.accountDetail.flatLine < 0 || this.accountDetail.flatLine > 1) {
        this.data.ErrorMsg('平仓线比例必填且只能为0-1的数字');
        // tslint:disable-next-line:max-line-length
      } else if (this.data.isNull(this.accountDetail.cordonLine) || this.accountDetail.cordonLine < 0 || this.accountDetail.cordonLine > 1) {
        this.data.ErrorMsg('警戒线比例必填且只能为0-1的数字');
      } else if (this.accountDetail.flatLine < this.accountDetail.cordonLine) {
        this.data.ErrorMsg('平仓线比例必须大于等于警戒线比例');
      } else if (this.data.isNull(this.accountDetail.accountCommission)) {
        this.data.ErrorMsg('交易佣金必填且只能为数字');
      } else {
        this.accountDetail.accountStatus = 0;
        const accountData = this.accountDetail;
        accountData.accountPwd = Md5.hashStr(accountData.accountPwd);
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
      } else if (this.accountDetail.flatLine < this.accountDetail.cordonLine) {
        this.data.ErrorMsg('平仓线比例必须大于等于警戒线比例');
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
      this.close();
    }, (err) => {
      this.data.error = err.error;
      this.data.isError();
    });
  }

  sortList() {
    this.sortType = !this.sortType;
    this.sort();
  }

  sort() {
    this.isSort = true;
    this.list.sort((a, b) => {
      if (this.sortType) {
        return (b.profit - a.profit);
      } else {
        return (a.profit - b.profit);
      }

    });
  }

  select(data, index) {
    this.checkId = index;
    this.temp = data.accountCode;
    this.userCode = data.accountCode;
    this.selectDetail = {
      accountCode: data.accountCode,
      accountCommission: this.numFormat(data.accountCommission),
      accountName: data.accountName,
      accountPwd: data.accountPwd,
      flatLine: data.flatLine,
      cordonLine: data.cordonLine,
      cashScale: data.cashScale,
      allottedScale: data.allottedScale,
      productCode: data.productCode,
      productName: data.productName,
      accountStatus: data.accountStatus,
      teamCode: this.code
    };
  }

  numFormat(num) {
    return this.data.getFullNum(num);
  }

  update() {
    if (this.temp !== '') {
      this.alert = this.data.show;
      this.textType = '修改';
      console.log(this.selectDetail);
      this.accountDetail = this.selectDetail;
    }
  }

  tdColor(a) {
    const data = a;
    if (data.profit < 0) {
      if (Math.abs(data.profit) >= data.cashScale * data.flatLine) {
        return 'red';
      }
      if (Math.abs(data.profit) >= data.cashScale * data.cordonLine && Math.abs(data.profit) < data.cashScale * data.flatLine) {
        return 'orange';
      }
    } else {
      return '';
    }
  }

  cclb() {
    if (this.temp !== '') {
      this.data.gotoId('main/tdgl/cclb', this.selectDetail.accountCode);
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
