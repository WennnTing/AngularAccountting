import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable, Subscription } from 'rxjs'

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent implements OnInit {

  addTrue: boolean = false;
  selectValue: string = '';
  inputValue: string = '';
  numberValue: number | undefined;
  member: string = '';
  membercount: number | undefined;

  accountId: string = ''; // 儲存路由參數ID
  accountData: any; // 儲存從Firebase中的數據
  accountList: any[] = []; // 儲存子節點列表

  accounts$!: Observable<any[]>;
  private routeSub: Subscription | undefined;

  constructor(private db: AngularFireDatabase, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.accountId = params['id'];
      this.getAccountData(this.accountId);
    });
  }

  getAccountData(id: string): void {
    this.db.object(`account/${id}`).valueChanges().subscribe((data: any) => {
      // 提取 date 和 title 属性
      this.accountData = {
        date: data.date,
        title: data.title,
        settle: data.settle,
        participantName: data.participantName
      };

      // 抓子節點，保留 $key 屬性
      const subNodes = Object.keys(data).filter(key => key !== 'date' && key !== 'title');
      this.accountList = subNodes.map(key => ({ $key: key, ...data[key] }));
      console.log(this.accountData);
      console.log(this.accountList);
    });
  }

  toggleDialog() {
    this.addTrue = !this.addTrue;
  }


  addRecord() {
    if (this.numberValue !== undefined) {
      const numberValue = this.numberValue;
      const selectValue = this.selectValue;
      const inputValue = this.inputValue;

      if (this.member === '全部') {
        // 選全部，可以幫所有人創建一條記帳紀錄
        const availableHelpers: string[] = this.getAvailableHelpers();
        availableHelpers.forEach(helper => {
          if (helper !== selectValue) { // 檢查出錢的人 = 金主
            const newData = {
              who: selectValue,
              buy: inputValue,
              count: numberValue, // 總額
              member: helper,
              membercount: Math.floor(numberValue / (availableHelpers.length)), // 總額平均分配
            };
            if (helper !== '全部') { // 如果不是 "全部"，就添加紀錄
              this.pushRecordToDatabase(newData);
              this.addTrue = false
            }
          }
        });
      } else {
        // 創建一條紀錄，當this.member 不是 '全部'且 selectValue不為空才創建
        if (this.member !== '全部' && selectValue) {
          const newData = {
            who: selectValue,
            buy: inputValue,
            count: numberValue,
            member: this.member,
            membercount: this.membercount,
          };
          this.pushRecordToDatabase(newData);
          this.addTrue = false
        }
      }
    }
  }

  pushRecordToDatabase(newData: any) {
    const accountRef = this.db.list(`account/${this.accountId}`);
    accountRef.push(newData).then((ref) => {
      const recordId = ref.key; // 获取新记录的唯一标识符
      console.log('New record added with ID:', recordId);
    }).catch(error => {
      console.error('Error adding new record: ', error);
    });
    // 清空输入框的值
    this.clearInputValues();
    this.toggleDialog();
  }


  clearInputValues() {
    this.selectValue = '';
    this.inputValue = '';
    this.numberValue = undefined;
    this.member = '';
    this.membercount = undefined;
  }



  calculateTotalAmount(member: string) {
    let totalAmount = 0;
    for (const record of this.accountList) {
      if (record.member === member) {
        totalAmount += record.membercount
      }
    }
    return totalAmount;
  }

  getAvailableHelpers(): string[] {
    // 抓到金主
    const selectedMaster: string = this.selectValue;
    // 抓到金主後，抓到剩下的人的名稱
    const availableHelpers: string[] = this.accountData.participantName.filter((name: string) => name !== selectedMaster);
    // 兩個都選
    availableHelpers.unshift('全部');
    return availableHelpers;
  }


  deleteRecord(record: any): void {
    const recordId = record.$key;
    if (!recordId) return;
    console.log(recordId);
    const confirmDelete = confirm('確定要刪除這筆嗎?');
    if (confirmDelete) {
      this.db.object(`account/${this.accountId}/${recordId}`).remove()
        .then(() => {
          console.log(`account/${this.accountId}/${recordId}`);
          console.log('Record deleted successfully');
        })
        .catch(error => {
          console.error('Error deleting record:', error);
        });
    }
  }



};
