import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { authGuard } from './services/auth.guard';
import { PaginatorComponent } from './components/paginator/paginator.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full'
 },
  {
    path:'',
    component:HomeComponent,
    pathMatch:'full'
},
{
    path:'login',
    component:LoginComponent,
    pathMatch:'full'
},
{
    path:'dashboard',
    component:DashboardComponent,
    pathMatch:'full',
    canActivate: [authGuard]
},
{
  path:'file-upload',
  component:FileUploadComponent,
  pathMatch:'full',
  canActivate: [authGuard]
},
{
  path:'pagination',
  component:PaginatorComponent,
  pathMatch:'full',
  canActivate: [authGuard]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
