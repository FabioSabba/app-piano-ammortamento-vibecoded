import { Injectable } from '@angular/core';

export interface Installment {
  period: number; // Month number (1 to n)
  year: number; // Year number (1 to N)
  monthOfYear: number; // Month of the year (1 to 12)
  payment: number;
  principalQuota: number;
  interestQuota: number;
  remainingDebt: number;
}

export interface AnnualSummary {
  year: number;
  payment: number;
  principalQuota: number;
  interestQuota: number;
  remainingDebt: number;
}

export interface MortgagePlan {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  schedule: Installment[];
  annualSchedule: AnnualSummary[];
}

@Injectable({
  providedIn: 'root'
})
export class MortgageCalculatorService {

  calculateMortgage(capital: number, annualRate: number, durationYears: number): MortgagePlan {
    if (capital <= 0 || durationYears <= 0) {
      return {
        monthlyPayment: 0,
        totalInterest: 0,
        totalCost: 0,
        schedule: [],
        annualSchedule: []
      };
    }

    const totalMonths = durationYears * 12;
    const monthlyRate = (annualRate / 100) / 12;

    let monthlyPayment = 0;
    if (monthlyRate === 0) {
      monthlyPayment = capital / totalMonths;
    } else {
      monthlyPayment = capital * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const schedule: Installment[] = [];
    let remainingDebt = capital;
    let totalInterest = 0;

    for (let period = 1; period <= totalMonths; period++) {
      const interestQuota = remainingDebt * monthlyRate;
      let principalQuota = monthlyPayment - interestQuota;

      // In the last month, adjust principal to match exact remaining debt to avoid precision issues
      if (period === totalMonths) {
        principalQuota = remainingDebt;
      }

      remainingDebt = Math.max(0, remainingDebt - principalQuota);
      totalInterest += interestQuota;

      const year = Math.ceil(period / 12);
      const monthOfYear = period % 12 === 0 ? 12 : period % 12;

      schedule.push({
        period,
        year,
        monthOfYear,
        payment: monthlyPayment,
        principalQuota,
        interestQuota,
        remainingDebt
      });
    }

    // Generate annual summary
    const annualSchedule: AnnualSummary[] = [];
    for (let year = 1; year <= durationYears; year++) {
      const yearInstallments = schedule.filter(i => i.year === year);
      const yearPayment = yearInstallments.reduce((sum, i) => sum + i.payment, 0);
      const yearPrincipal = yearInstallments.reduce((sum, i) => sum + i.principalQuota, 0);
      const yearInterest = yearInstallments.reduce((sum, i) => sum + i.interestQuota, 0);
      const yearRemainingDebt = yearInstallments[yearInstallments.length - 1].remainingDebt;

      annualSchedule.push({
        year,
        payment: yearPayment,
        principalQuota: yearPrincipal,
        interestQuota: yearInterest,
        remainingDebt: yearRemainingDebt
      });
    }

    return {
      monthlyPayment,
      totalInterest,
      totalCost: capital + totalInterest,
      schedule,
      annualSchedule
    };
  }
}
