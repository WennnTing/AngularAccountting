import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'calculateSummary'
})
export class CalculateSummaryPipe implements PipeTransform {
  transform(accountList: any[]): any[] {
    if (!accountList || accountList.length < 2) {
      return [];
    }

    const result: any[] = [];

    for (const summary of accountList) {
      // 略過子節點participantName
      if (summary.participantName) {
        continue;
      }

      const borrower = summary.member; // 借錢者
      const helper = summary.helper; // 出錢者
      const totalAmount = summary.totalAmount; // 借錢者的總貢獻

      // 如果 borrower、helper 和 difference 均不是 undefined，就添加到結果裡
      if (borrower !== undefined && helper !== undefined && totalAmount !== undefined) {
        // 如果出錢的人存在且借錢者的總貢獻大於出錢者的總貢獻，計算差額
        if (helper && totalAmount) {
          const borrowerTotalAmount = (accountList.find(item => item.member === borrower && item.helper === helper)?.totalAmount || 0);

          // 只有當借錢者的總貢獻大於出錢者的總貢獻時，才計算差額。
          if (borrowerTotalAmount && totalAmount > borrowerTotalAmount) {
            const difference = totalAmount - borrowerTotalAmount;
            result.push({ borrower: helper, helper: borrower, difference });
          }
        }

        // 如果出錢的人沒有跟其他人借錢
        if (helper && !accountList.some(item => item.member === helper && item.helper === borrower)) {
          result.push({ borrower: helper, helper: borrower, difference: totalAmount });
        }

        // 如果出錢的人向借錢的人借錢
        if (helper && accountList.some(item => item.member === helper && item.helper === borrower)) {
          const borrowerTotalAmount = (accountList.find(item => item.member === helper && item.helper === borrower)?.totalAmount || 0);
          if (borrowerTotalAmount && totalAmount > borrowerTotalAmount) {
            const difference = totalAmount - borrowerTotalAmount;
            result.push({ borrower: helper, helper: borrower, difference });
          }
        }
      }
    }
    return result;
  }
}
















@Pipe({
  name: 'mapMembersAndCalculateSummary'
})
export class MapMembersAndCalculateSummaryPipe implements PipeTransform {
  transform(accountList: any[]): any[] {
    if (!accountList) {
      return [];
    }

    const result = [];
    const members = accountList.map(record => record.who).filter((value, index, self) => self.indexOf(value) === index);

    for (const member of members) {
      let totalAmount = 0;
      let helper = '';
      for (const record of accountList) {
        if (record.who === member) {
          totalAmount += record.membercount;
          helper = record.member;
        }
      }
      result.push({ member: member, helper: helper, totalAmount: totalAmount });
    }

    return result;
  }
}




