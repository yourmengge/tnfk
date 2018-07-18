import { DataService } from './data.service';
import { HttpService } from './http.service';
import { DoCheck } from '@angular/core';
export class Productlist implements DoCheck {
    code = '';
    list: any;
    proName: any;
    userCode: any;
    searchCode: any;
    url: string;
    checkList = [];
    exportData: any;
    exportName: string;
    constructor(public data: DataService, public http: HttpService) {
    }
    check() {
        if (this.code !== this.data.productCode) {
            this.code = this.data.productCode;
            if (!this.data.isNull(this.code)) {
                this.getList();
            }
        }
    }

    search() {
        this.searchCode = this.userCode;
        this.data.userCode = this.searchCode;
        this.getList();
    }

    ngDoCheck() {
        this.check();
    }

    getList() {
        this.http.getProductList(this.code, this.url).subscribe((res) => {
            this.list = res;
            this.data.settimeout = setTimeout(() => {
                this.getList();
            }, this.data.timeout);
        }, (err) => {
            this.data.error = err.error;
            this.data.isError();
        });
    }

    export(url) {
        this.exportData = 'teamCode=' + this.code + '&accountCode=' + this.searchCode;
        this.http.export(url, this.exportData).subscribe((res) => {
            console.log(res);
            this.data.downloadFile(res, this.exportName);
        }, (err) => {
            this.data.error = err.error;
            this.data.isError();
        });
    }
}
