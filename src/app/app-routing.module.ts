import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginDetailsComponent } from './login-details/login-details.component';

const routes: Routes = [
  {path:'login', component:LoginDetailsComponent},
  { path: '',   redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
