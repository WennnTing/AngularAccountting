import { NgModule } from '@angular/core';
import { RouterModule, Routes, } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AccountsComponent } from './views/accounts/accounts.component';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'account/:id',
    component: AccountsComponent
  }
];

@NgModule({
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
