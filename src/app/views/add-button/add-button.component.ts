import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { DataService } from '../../data.service';


@Component({
  selector: 'app-add-button',
  templateUrl: './add-button.component.html',
  styleUrl: './add-button.component.scss',
})
export class AddButtonComponent implements OnInit {
  addTrue: boolean = false;
  editTrue: boolean = false;
  dateValue: string = '';
  titleValue: string = '';
  settleValue: string = '';

  newAccountId: string = '';
  showButtons: boolean = false;

  showNameInput: boolean = false;

  mainPage: boolean = true; // 新增一筆的主內容左右
  numberOfPeople: number = 0; // 人數
  participantName: string[] = [];

  newAccountData: { [key: string]: any } = {};
  minDate!: Date;

  editAccountId: string | null = null;

  isDelete: boolean = false; // 刪除的動畫

  ngOnInit(): void {
    this.loadnewAccountData(this.newAccountId);
    this.minDate = new Date();
  }

  constructor(private router: Router, private dataService: DataService,
    private db: AngularFireDatabase, private cdr: ChangeDetectorRef) { }

  toNewAccount(): void {
    const newAccountData = {
      date: this.dateValue,
      title: this.titleValue,
      settle: this.settleValue = "1",
      isDelete: this.isDelete,
      participantName: this.participantName
    };
    const newAccountId = this.db.createPushId();
    this.db.object(`account/${newAccountId}`).set(newAccountData)
      .then(() => {
        this.toggleDialog();
        this.dateValue = '';
        this.titleValue = '';
        this.numberOfPeople = 0;
        this.participantName = [];
        this.showNameInput = false;
        this.mainPage = true;
        // console.log(newAccountData)
      })
      .catch(error => {
        console.error('Error writing new account data:', error);
      });
  }

  toggleDialog() {
    this.addTrue = !this.addTrue;
    this.dateValue = '';
    this.titleValue = '';
    this.settleValue = '';
  }

  toggleEdit() {
    this.editTrue = false;
  }

  // 下一步
  goNextPage() {
    this.showNameInput = true;
    this.mainPage = false;
  }

  countPeople(length: number) {
    return new Array(length);
  }

  viewAccountDetails(accountId: string): void {
    this.router.navigate(['/account', accountId]);
  }



  loadnewAccountData(newAccountId: string): void {
    // 使用 newAccountId 從 Firebase 中抓記帳數據
    this.db.object(`account/${newAccountId}`).valueChanges().subscribe(
      (data: any) => {
        if (data) {
          this.newAccountData = data;
          this.showButtons = true;
        } else {
          this.showButtons = false;
        }
      },
      (error) => {
        console.error('Error fetching account data:', error);
      }
    );
  }


  // 編輯
  editAccount(accountId: string): void {
    if (!accountId) return;
    this.editTrue = true;
    this.editAccountId = accountId;
    this.dateValue = this.newAccountData[accountId].date;
    this.titleValue = this.newAccountData[accountId].title;
    this.settleValue = this.newAccountData[accountId].settle;
  }

  // 儲存編輯
  saveEdit(): void {
    if (!this.editAccountId) return; // 確保有正在編輯的帳戶

    const updatedAccountData = {
      date: this.dateValue,
      title: this.titleValue,
      settle: this.settleValue
    };

    this.db.object(`account/${this.editAccountId}`).update(updatedAccountData)
      .then(() => {
        this.editAccountId = null; // 清空正在編輯的帳戶
        this.toggleEdit()
      })
      .catch(error => {
        console.error('Error updating account data:', error);
      });
  }

  // 刪除
  deleteAccount(accountId: string | null): void {
    if (!accountId) return;

    const confirmDelete = confirm('確定要刪除這筆嗎?');
    if (confirmDelete) {
      this.newAccountData[accountId].isDelete = true;
      this.editTrue = false;
      setTimeout(() => {
        this.db.object(`account/${accountId}`).remove()
          .then(() => {
            // 動畫完成再刪除
            delete this.newAccountData[accountId];
            this.dateValue = '';
            this.titleValue = '';
          })
          .catch(error => {
            console.error('Error deleting account:', error);
          })
          .finally(() => {
          });
      }, 600);
    }
  }







}
