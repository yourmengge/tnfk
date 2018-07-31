import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';
import { HistoryList } from '../history-list';
@Component({
  selector: 'app-lsyk',
  templateUrl: './lsyk.component.html',
  styleUrls: ['./lsyk.component.css']
})
export class LsykComponent extends HistoryList {

  constructor(public http: HttpService, public data: DataService) {
    super(data, http);
    this.historyType = 'profit';
    this.dateType = 'month';
    this.exportName = '历史盈亏';
  }
}
