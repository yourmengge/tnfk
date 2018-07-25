import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';

@Injectable()
export class HttpService {
  public host = 'http://101.132.65.124:10008/tnproxy/';
  // public host = 'http://218.85.23.217:8082/tnproxy/tn/';
  // public host = 'http://106.15.92.93:10008/tnproxy/tn/';
  public stockHQ: any;
  public tableList: any;
  constructor(public http: HttpClient, public data: DataService) {
  }

  POST(url, data) {
    this.data.getHeader();
    return this.http.post(this.host + url, data, this.data.getHeader());
  }

  export(url, data) {
    this.data.getExportHeader();
    return this.http.post(this.host + url, data, { headers: this.data.getExportHeader(), responseType: 'arraybuffer' });
  }

  getList(url, data) {
    return this.POST(url, data);
  }

  getProductList(code, url) {
    return this.POST('tn/product/' + code + url, {});
  }

  productHold(code) {
    return this.POST('tn/product/' + code + '/balance', {});
  }

  /**
 * 查询历史列表
 */
  getHistoryList(data, type) {
    return this.POST('tn/history/' + type, data);
  }

  /**
   * 获取行情
   */
  getHanQing(data) {
    return this.POST('push/subsMarket/SELL/' + data.stockCode + '?accountCode=' + data.accountCode, {});
  }

  /**
 * 下单 参数 买入：BUY 卖出：SELL
 */
  order(type, data) {
    return this.POST('tn/appoint/SELL?accountCode=' + type, data);
  }

  /**
   * 登录接口
   */
  login(data) {
    return this.http.post(this.host + 'tn/login', data);
  }

  /**
   * 获取团队列表
   */
  getTeamList() {
    return this.POST('tn/team/list', {});
  }

  /**
   * 获取产品列表
   */
  getProList() {
    return this.POST('tn/product/list', {});
  }

  /**
   * 获取团队交易员
   */
  getTeamMember(data) {
    return this.POST('tn/team/account', data);
  }

  /**
   * 获取团队当日盈亏
   */
  getTeamPrice(code) {
    return this.POST('tn/team/' + code + '/profit', {});
  }

  /**
   * 获取分配列表
   */
  getHold(code) {
    return this.POST('tn/team/' + code + '/hold', {});
  }

  /**
   * 分券还券
   */
  coupon(data) {
    return this.POST('tn/coupon', data);
  }

  /**
   * 获取交易员列表
   */
  getJyyList(teamCode) {
    return this.POST('tn/team/account', { teamCode: teamCode });
  }

  /**
 * 获取交易员列表（用于弹窗中的交易员列表）
 */
  getJyyList2(teamCode) {
    return this.POST('tn/team/' + teamCode + '/account', {});
  }

  /**
   * 修改（UPDATE）新增（ADD）交易员
   */
  addJyy(data, type) {
    return this.POST('tn/account/' + type, data);
  }

  /**
   * 删除交易员
   */
  delJyy(data) {
    return this.POST('tn/account/delete', data);
  }

  /**
   * 重置交易员密码
   */
  reset(data) {
    return this.POST('tn/account/pwdReset', data);
  }

  /**
   * 产品发生金额
   */
  productProfit(code) {
    return this.POST('tn/product/' + code + '/profit', {});
  }



  /**
   * 获取产品利润统计
   */
  productProfitDetail(code) {
    return this.POST('tn/product/' + code + '/profitDetail', {});
  }



  /**
   * 平仓
   */
  appointSELL(data, type) {
    return this.POST('tn/appoint/' + type, data);
  }

  /**
   * 撤单
   */
  appointCancel(data) {
    return this.POST('tn/cancel?pkOrder=' + data, {});
  }

  /**
   * 导出团队分配列表
   */
  exportHoldTeam(code) {
    return this.export('tn/team/' + code + '/hold/export', {});
  }


  /**
   * 产品持仓刷新按钮
   */
  refresh(code) {
    return this.POST('tn/product/' + code + '/hold/refresh', {});
  }
}
