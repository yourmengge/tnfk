import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DataService } from './data.service';
import { HttpService } from './http.service';
import { MainComponent } from './main/main.component';
import { HeadComponent } from './head/head.component';
import { LeftMenuComponent } from './left-menu/left-menu.component';
import { RightContentComponent } from './right-content/right-content.component';
import { CpglComponent } from './cpgl/cpgl.component';
import { TdglComponent } from './tdgl/tdgl.component';
import { AlertComponent } from './alert/alert.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './loading/loading.component';
import { ZhxxComponent } from './zhxx/zhxx.component';
import { FplbComponent } from './fplb/fplb.component';
import { TdglFooterComponent } from './tdgl-footer/tdgl-footer.component';
import { CpglFooterComponent } from './cpgl-footer/cpgl-footer.component';
import { CpccComponent } from './cpcc/cpcc.component';
import { WtlbComponent } from './wtlb/wtlb.component';
import { LswtlbComponent } from './lswtlb/lswtlb.component';
import { GhlbComponent } from './ghlb/ghlb.component';
import { CjlbComponent } from './cjlb/cjlb.component';
import { DplbComponent } from './dplb/dplb.component';
import { CpwtlbComponent } from './cpwtlb/cpwtlb.component';
import { CpcjlbComponent } from './cpcjlb/cpcjlb.component';
import { TimePipe } from './time.pipe';
import { LrtjComponent } from './lrtj/lrtj.component';
import { HistoryComponent } from './history/history.component';
import { HistoryFooterComponent } from './history-footer/history-footer.component';
import { LscjComponent } from './lscj/lscj.component';
import { LsykComponent } from './lsyk/lsyk.component';
import { DatePipe } from './date.pipe';
import { RoundPipe } from './round.pipe';
import { LslylComponent } from './lslyl/lslyl.component';
import { NumberInputDirective } from './number-input.directive';
import { ConfirmComponent } from './confirm/confirm.component';
import { CpzjComponent } from './cpzj/cpzj.component';
import { CclbComponent } from './cclb/cclb.component';
import { ToFixedPipe } from './to-fixed.pipe';
import { NumIntPipe } from './num-int.pipe';
import { OrderByPipe } from './order-by.pipe';
import { NumFormatPipe } from './num-format.pipe';

const historyChild: Routes = [
  { path: 'lslyl', component: LslylComponent },
  { path: 'lsyk', component: LsykComponent },
  { path: 'lscj', component: LscjComponent },
  { path: 'lswtlb', component: LswtlbComponent },
  { path: '', redirectTo: 'lswtlb', pathMatch: 'full' }
];

const cpglChild: Routes = [
  { path: 'history', component: HistoryComponent, children: historyChild },
  { path: 'cpzj', component: CpzjComponent },
  { path: 'cpcjlb', component: CpcjlbComponent },
  { path: 'cpwtlb', component: CpwtlbComponent },
  { path: 'cpcc', component: CpccComponent },
  { path: '', redirectTo: 'cpcc', pathMatch: 'full' }
];

const tdglChild: Routes = [
  { path: 'history', component: HistoryComponent, children: historyChild },
  { path: 'lrtj', component: LrtjComponent },
  { path: 'dplb', component: DplbComponent },
  { path: 'cjlb', component: CjlbComponent },
  { path: 'ghlb', component: GhlbComponent },
  { path: 'wtlb', component: WtlbComponent },
  { path: 'fplb', component: FplbComponent },
  { path: 'zhxx', component: ZhxxComponent },
  { path: 'cclb/:id', component: CclbComponent },
  { path: '', redirectTo: 'zhxx', pathMatch: 'full' }
];

const appChildRoutes: Routes = [
  { path: 'tdgl', component: TdglComponent, children: tdglChild },
  { path: 'cpgl', component: CpglComponent, children: cpglChild },
  { path: '', redirectTo: 'tdgl', pathMatch: 'full' }
];

const appRoutes: Routes = [
  { path: 'main', component: MainComponent, children: appChildRoutes },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    HeadComponent,
    LeftMenuComponent,
    RightContentComponent,
    CpccComponent,
    CpglComponent,
    TdglComponent,
    AlertComponent,
    LoadingComponent,
    ZhxxComponent,
    FplbComponent,
    TdglFooterComponent,
    CpglFooterComponent,
    WtlbComponent,
    LswtlbComponent,
    GhlbComponent,
    CjlbComponent,
    DplbComponent,
    CpwtlbComponent,
    CpcjlbComponent,
    TimePipe,
    LrtjComponent,
    HistoryComponent,
    HistoryFooterComponent,
    LscjComponent,
    LsykComponent,
    DatePipe,
    RoundPipe,
    LslylComponent,
    NumberInputDirective,
    ConfirmComponent,
    CpzjComponent,
    CclbComponent,
    ToFixedPipe,
    NumIntPipe,
    OrderByPipe,
    NumFormatPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes, { enableTracing: true, useHash: true }),
    FormsModule
  ],
  providers: [DataService, HttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
