import { initializeApp } from 'firebase/app';
// import { AngularFireModule } from '@angular/fire';
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './views/header/header.component';
import { AddButtonComponent } from './views/add-button/add-button.component';
import { AccountsComponent } from './views/accounts/accounts.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from '../environments/environment';

import { FormsModule } from '@angular/forms';


import { ReversePipe } from './reverse.pipe';
import { MapMembersPipe } from './map-members.pipe';
import { CalculateSummaryPipe } from './calculateSummary.pipe';
import { MapMembersAndCalculateSummaryPipe } from './calculateSummary.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AddButtonComponent,
    AccountsComponent,
    ReversePipe,
    MapMembersPipe,
    CalculateSummaryPipe,
    MapMembersAndCalculateSummaryPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
