import { Component } from '@angular/core';
import { HttpService } from '../http.service';
import { DataService } from '../data.service';
import { HistoryList } from '../history-list';

@Component({
  selector: 'app-lslyl',
  templateUrl: './lslyl.component.html',
  styleUrls: ['./lslyl.component.css']
})
export class LslylComponent extends HistoryList {

  constructor(public http: HttpService, public data: DataService) {
    super(data, http);
    this.dateType = 'month';
    this.exportName = '对账单';
    this.historyType = 'statement';
  }
}
