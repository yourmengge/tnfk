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
    exportData: any;
    exportName: string;
    exportUrl: string;
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
        this.data.clearTimeOut();
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

    export() {
        this.exportData = 'productCode=' + this.code;
        this.http.export('tn/product/' + this.code + this.exportUrl, this.exportData).subscribe((res) => {
            console.log(res);
            this.data.downloadFile(res, this.exportName);
        }, (err) => {
            this.data.error = err.error;
            this.data.isError();
        });
    }
}
