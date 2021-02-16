import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginDetailsService } from '../services/login-details.service';

@Component({
  selector: 'app-login-details',
  templateUrl: './login-details.component.html',
  styleUrls: ['./login-details.component.css']
})
export class LoginDetailsComponent implements OnInit {
  tableData: any;
  eMail: any;
  mNumber: any;
  name: any;
  editFieldsData: any;
  addDetails: boolean;
  updateDetails: boolean;
  empForm: FormGroup;
  empFormUpdate: FormGroup
  submitted = false;
  tableDataNew: any;
  pageOfItems: any;
  pager: any;
  resData: Object;
  showMassage: any;
  showErrPnum: string;
  showErrEmail: string;
  statusMessage: string;


  constructor(private loginDetailsSeervice: LoginDetailsService, private fb: FormBuilder,
    private route: ActivatedRoute,private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.addDetails = true;
    this.updateDetails = false;

    this.route.queryParams.subscribe(x => this.getTableData(x.page || 1));

    this.empForm = this.fb.group({
      'Name': ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20), Validators.pattern('^[_A-z ]*((-|\s)*[_A-z] )*$')]],
      'MobNumber': ['', Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), Validators.minLength(6)])],
      'email': ['', Validators.compose([Validators.required, Validators.email])],

    })

    this.empFormUpdate = this.fb.group({
      'Name': ['', [Validators.required, Validators.minLength(2), Validators.pattern('^[_A-z ]*((-|\s)*[_A-z] )*$')]],
      'MobNumber': ['', Validators.compose([Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      'email': ['', Validators.compose([Validators.required, Validators.email])],

    })
  }
  get f() { return this.empForm.controls; }
  get g() { 
    return this.empFormUpdate.controls; }


  onSubmit() {
    this.submitted = true;
    if (!this.empForm.valid) {
      return false;
    } else {
      this.addAll(this.empForm.value)
    }
   
  }
  onSubmitData() {
    this.submitted = true;
    if (!this.empFormUpdate.valid) {
      return false;
    } else {
      this.updateEmpDetails(this.empFormUpdate.value)

    }
  }

  addAll(obj) {
    this.loginDetailsSeervice.loginApi(obj).subscribe(result => {
      this.showMassage = result
      if (this.showMassage == "Phone number and Email already exists") {
        this.showErrPnum = "Phone number  already exists"
        this.showErrEmail = "Email already exists"
      }
      else if (this.showMassage == "Phone number already exists") {
        this.showErrPnum = "Phone number  already exists"
      }
      else if (this.showMassage == "Phone number already exists") {
        this.showErrEmail = "Email already exists"
      }
      else {
        this.statusMessage = "Saved Successfully"
        this.route.queryParams.subscribe(x => this.getTableData(x.page || 1));
        this.showErrPnum = ""
        this.showErrEmail = ""
        this.alertMsg()
        
      }

    })
  }
  alertMsg(){
    setTimeout(()=>{
      this.statusMessage = "";

    },3000)
  }

  getTableData(num) {
    this.loginDetailsSeervice.getTableData(num).subscribe(result => {
      this.tableDataNew = result;
      this.pageOfItems = this.tableDataNew.pageOfItems;
      this.pager = this.tableDataNew.pager;
    })
  }
  editfileds(data) {
    this.eMail = data.Email;
    this.mNumber = data.Mobile_Number
    this.name = data.Name;
    this.editFieldsData = data;
    this.addDetails = false;
    this.updateDetails = true;
    this.showErrPnum = ""
    this.showErrEmail = "" 
  }

  updateEmpDetails(j) {
    let obj = {
      "id": this.editFieldsData._id,
      "editFormData": this.empFormUpdate.value
    }
    this.loginDetailsSeervice.updateEmpDetails(obj).subscribe(result => {
      this.showMassage = result
      if (this.showMassage == "Phone number and Email already exists") {
        this.showErrPnum = "Phone number  already exists"
        this.showErrEmail = " Email already exists"
      }
      else if (this.showMassage == "Phone number already exists") {
        this.showErrPnum = "Phone number  already exists"
      }
      else if (this.showMassage == "Phone number already exists") {
        this.showErrEmail = "Email already exists"
      }
      else {
        this.statusMessage = "Updated Successfully"
        this.updateDetails = false;
        this.addDetails = true;
        this.route.queryParams.subscribe(x => this.getTableData(x.page || 1));
        this.showErrPnum = "";
        this.showErrEmail = "";
        this.alertMsg()
      }

    })
  }
  numMessage(){
    this.showErrPnum = "";
  }
  emailMassge(){
    this.showErrEmail = "";
  }

  deleteEmpDetails(data) {
    this.loginDetailsSeervice.deleteEmpDetails(data._id).subscribe(result => {
      this.route.queryParams.subscribe(x => this.getTableData(x.page || 1));

    })
  }
  sortName() {
    this.pageOfItems.sort((a, b) => a.Name.localeCompare(b.Name));
  }
  sortPhoneNum() {
    this.pageOfItems.sort((a, b) => {
      return a.Mobile_Number - b.Mobile_Number;
    });
  }
  sortEmail() {
    this.pageOfItems.sort((a, b) => a.Email.localeCompare(b.Email));
  }
  ngAfterViewInit() {
    this.showErrPnum = ''
    this.showErrEmail = ''
    this.cdr.detectChanges();
  }


  filterByEmpDetails(opt,data){
    if(data == (undefined || null || "")){
      data = "all";
    }

    this.loginDetailsSeervice.filterByEmpDetails(opt,data).subscribe(res =>{
      this.pageOfItems = res

    })
  }
}
