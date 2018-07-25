import { DataService } from './data.service';
import { HttpService } from './http.service';
import { DoCheck } from '@angular/core';

export class GetListFn implements DoCheck {
    list: any;
    searchCode: any;
    proName: any;
    deleteData: any;
    code = '';
    accountDetail = {
        accountCode: '',
        accountCommission: '',
        accountName: '',
        accountPwd: '',
        accountStatus: 0,
        bpLine: '',
        closingDownLine: '',
        isAutoShutdown: 1,
        isEveningUp: 1,
        teamCode: this.code
    };
    roleCode = 2;
    confirmText = '确定删除交易员？';
    confirm = this.data.hide;
    checkId = '';
    newPass = '';
    resetAlert = this.data.hide;
    selectDetail = this.accountDetail;
    temp = '';
    isAutoShutdown = 1;
    accountStatus = 0;
    userCode = this.data.userCode;
    alert = this.data.hide;
    textType = '新增';

    checkList = [];
    checkedAll = false;
    autofocusId = '';
    array = [];


    url = '';
    exportUrl = '';
    listData: any;
    exportData: any;
    exportName: string;
    resData: any;
    actionType: any;
    sellType: any;
    constructor(public data: DataService, public http: HttpService) {

    }
    getList() {
        this.data.clearTimeOut();
        this.listData = {
            teamCode: this.code,
            accountCode: this.searchCode
        };
        this.http.getList(this.url, this.listData).subscribe((res) => {
            this.list = res;
            this.data.settimeout = setTimeout(() => {
                this.getList();
            }, this.data.timeout);
        }, (err) => {
            this.data.error = err.error;
            this.data.isError();
        });
    }

    export() {
        this.exportData = 'teamCode=' + this.code + '&accountCode=' + this.searchCode;
        this.http.export(this.exportUrl, this.exportData).subscribe((res) => {
            console.log(res);
            this.data.downloadFile(res, this.exportName);
        }, (err) => {
            this.data.error = err.error;
            this.data.isError();
        });
    }

    check() {
        if (this.code !== this.data.teamCode) {
            this.code = this.data.teamCode;
            this.list = [];
            this.userCode = this.data.userCode;
            this.checkList = [];
            this.search();
        }
    }

    search() {
        this.searchCode = this.userCode;
        this.data.userCode = this.searchCode;
        this.getList();
    }

    ngDoCheck() {
        this.checkId = '';
        this.check();
    }

    getListGHLB() {
        this.listData = {
            teamCode: this.code,
            accountCode: this.searchCode
        };
        this.http.getList(this.url, this.listData).subscribe((res) => {
            for (const i in res) {
                if (this.data.isNullArray(this.list)) { // 判断是否为第一次获取到数据
                    res[i].bcgh = res[i].ableCnt;
                } else if (this.checkList.includes(i)) {
                    res[i].bcgh = this.list[i].bcgh;
                } else {
                    res[i].bcgh = res[i].ableCnt;
                }
            }
            this.list = res;
            if (this.checkList.length === 0) {
                // tslint:disable-next-line:forin
                for (const i in this.list) {
                    this.list[i].isChecked = false;
                }
            } else {
                this.checkList.forEach((element) => {
                    this.list[element].isChecked = true;
                });
            }
            this.data.settimeout = setTimeout(() => {
                this.getList();
            }, this.data.timeout);
        }, (err) => {
            this.data.error = err.error;
            this.data.isError();
        });
    }

    searchAll() {
        this.searchCode = '';
        this.getList();
    }


}
