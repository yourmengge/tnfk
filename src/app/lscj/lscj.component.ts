import { Component, DoCheck, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';
import { HistoryList } from '../history-list';

@Component({
  selector: 'app-lscj',
  templateUrl: './lscj.component.html',
  styleUrls: ['./lscj.component.css']
})
export class LscjComponent extends HistoryList {

  constructor(public http: HttpService, public data: DataService) {
    super(data, http);
    this.dateType = 'day';
    this.historyType = 'trade';
    this.exportName = '历史成交';
  }

}
