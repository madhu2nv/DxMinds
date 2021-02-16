import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginDetailsComponent } from './login-details/login-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginDetailsService } from './services/login-details.service';import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    LoginDetailsComponent
  ],
  imports: [
    BrowserModule,CommonModule,
    AppRoutingModule,FormsModule,HttpClientModule,ReactiveFormsModule
  ],
  providers: [LoginDetailsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
