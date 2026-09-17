import { TestBed } from '@angular/core/testing';
import { MortgageCalculatorService } from './mortgage-calculator.service';

describe('MortgageCalculatorService', () => {
  let service: MortgageCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MortgageCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calculate mortgage monthly payment and amortization schedule correctly', () => {
    // Parameters: 200,000 €, 3.5% interest rate, 20 years
    const capital = 200000;
    const rate = 3.5;
    const years = 20;

    const result = service.calculateMortgage(capital, rate, years);

    // Let's verify the monthly payment. 
    // The exact monthly payment for €200,000, 3.5%, 20 years (240 months):
    // Formula: P = L * [c(1 + c)^n] / [(1 + c)^n - 1]
    // where L = 200000, c = 0.035 / 12 = 0.0029166667, n = 240
    // (1 + c)^n = 1.0029166667^240 = 2.0125439
    // P = 200000 * (0.0029166667 * 2.0125439) / (2.0125439 - 1)
    // P = 200000 * 0.0058699 / 1.0125439 = 1159.919... which rounds to 1159.92
    
    expect(result.monthlyPayment).toBeCloseTo(1159.92, 2);
    expect(result.schedule.length).toBe(240);
    expect(result.annualSchedule.length).toBe(20);
    
    // Check final remaining debt is 0
    expect(result.schedule[239].remainingDebt).toBe(0);
  });

  it('should handle zero capital or duration gracefully', () => {
    const result = service.calculateMortgage(0, 3.5, 20);
    expect(result.monthlyPayment).toBe(0);
    expect(result.schedule.length).toBe(0);

    const result2 = service.calculateMortgage(200000, 3.5, 0);
    expect(result2.monthlyPayment).toBe(0);
    expect(result2.schedule.length).toBe(0);
  });

  it('should handle zero interest rate correctly', () => {
    const capital = 200000;
    const rate = 0;
    const years = 20;

    const result = service.calculateMortgage(capital, rate, years);
    expect(result.monthlyPayment).toBeCloseTo(200000 / 240, 2);
    expect(result.schedule.length).toBe(240);
    expect(result.schedule[239].remainingDebt).toBe(0);
  });
});
