import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';
import { HistoryList } from '../history-list';

@Component({
  selector: 'app-lswtlb',
  templateUrl: './lswtlb.component.html',
  styleUrls: ['./lswtlb.component.css']
})
export class LswtlbComponent extends HistoryList {

  constructor(public http: HttpService, public data: DataService) {
    super(data, http);
    this.dateType = 'day';
    this.historyType = 'appoint';
    this.exportName = '历史委托';
  }

}
