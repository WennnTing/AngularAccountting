import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private db: AngularFireDatabase) { }

  loadnewAccountData(newAccountId: string): Observable<any> {
    return this.db.object(`account/${newAccountId}`).valueChanges();
  }
}
