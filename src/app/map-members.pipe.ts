import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapMembers'
})
export class MapMembersPipe implements PipeTransform {
  transform(accountList: any[]): any[] {
    const result = [];

    // 創建一個map來存儲每個成員墊錢的金額
    const helpersMap = new Map<string, number>();

    // 迭代每個交易紀錄，並將墊錢的金額加到map中
    for (const record of accountList) {
      const helper = record.who;
      const amount = record.membercount;

      // 如果 helper 存在於map中，則將金額相加；否則，將其設置為新的金額
      if (helpersMap.has(helper)) {
        helpersMap.set(helper, helpersMap.get(helper) + amount);
      } else {
        helpersMap.set(helper, amount);
      }
    }

    // 迭代map並將每條紀錄添加到結果中
    for (const [helper, totalAmount] of helpersMap.entries()) {
      const transactions = accountList.filter(record => record.who === helper);
      const memberCount = transactions.length;

      // 如果出錢者幫助了多個成員，將每個成員的幫助額度顯示在資料中
      if (memberCount > 1) {
        // 使用物件來存每個成員的總金額
        const memberTotalAmounts: any = {};

        for (const transaction of transactions) {
          const member = transaction.member;
          const amount = transaction.membercount;

          // 如果成員已存在於 memberTotalAmounts 中，則將金額相加；否則，設置為新的金額
          if (memberTotalAmounts[member]) {
            memberTotalAmounts[member] += amount;
          } else {
            memberTotalAmounts[member] = amount;
          }
        }

        // 將 memberTotalAmounts 中的數據轉換為結果陣列
        for (const [member, totalAmount] of Object.entries(memberTotalAmounts)) {
          result.push({ member: helper, helper: member, totalAmount: totalAmount });
        }
      } else {
        // 如果出錢者只幫助了一個成員，將幫助總額顯示在資料中
        result.push({ member: helper, helper: transactions[0].member, totalAmount: totalAmount });
      }
    }
    // console.log(result)
    return result;
  }
}




