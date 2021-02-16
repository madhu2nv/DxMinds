import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ApiService } from './api.service';
import { Observable } from 'rxjs'
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class LoginDetailsService {

  constructor(private api: ApiService, private https: HttpClient) { }

  loginApi(obj) {
    console.log(obj)
    return this.https.post(this.api.apiData + '/loginDetails', obj)

  }
  handleError() {

  }
  getTableData(num) {
    return this.https.get(this.api.apiData + '/tableData' + num)

  }
  updateEmpDetails(obj) {
    console.log(obj)
    return this.https.put(this.api.apiData + '/updateEmpDetails', obj)

  }
  deleteEmpDetails(id) {
    return this.https.delete(this.api.apiData + '/deleteEmpDetails' + id)
  }


  filterByEmpDetails(opt,data){
    return this.https.get(this.api.apiData + '/filterByEmpDetails' + '/' + opt + '/' + data )

  }
}
