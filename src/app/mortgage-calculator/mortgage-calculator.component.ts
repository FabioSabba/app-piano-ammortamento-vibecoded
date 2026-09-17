import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MortgageCalculatorService, Installment, AnnualSummary } from '../mortgage-calculator.service';

@Component({
  selector: 'app-mortgage-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mortgage-calculator.component.html',
  styleUrl: './mortgage-calculator.component.css'
})
export class MortgageCalculatorComponent {
  private calculatorService = inject(MortgageCalculatorService);

  // Input signals
  capital = signal<number>(200000);
  annualRate = signal<number>(3.5);
  durationYears = signal<number>(20);
  
  // UI signals
  selectedView = signal<'annual' | 'monthly'>('annual');
  hoveredIndex = signal<number | null>(null);

  // Computed results
  mortgagePlan = computed(() => {
    return this.calculatorService.calculateMortgage(
      this.capital(),
      this.annualRate(),
      this.durationYears()
    );
  });

  // Derived computed metrics for quick binding
  monthlyPayment = computed(() => this.mortgagePlan().monthlyPayment);
  totalInterest = computed(() => this.mortgagePlan().totalInterest);
  totalCost = computed(() => this.mortgagePlan().totalCost);
  schedule = computed(() => this.mortgagePlan().schedule);
  annualSchedule = computed(() => this.mortgagePlan().annualSchedule);

  // Computed properties for the SVG chart
  chartPoints = computed(() => {
    const data = this.annualSchedule();
    if (data.length === 0) return '';
    
    const width = 800;
    const height = 250;
    const maxVal = this.capital();
    
    // Create points for the remaining debt line
    return data.map((d, index) => {
      const x = (index / (data.length - 1)) * (width - 40) + 20;
      const y = height - (d.remainingDebt / maxVal) * (height - 40) - 20;
      return `${x},${y}`;
    }).join(' ');
  });

  chartAreaPoints = computed(() => {
    const data = this.annualSchedule();
    if (data.length === 0) return '';
    
    const width = 800;
    const height = 250;
    const maxVal = this.capital();
    
    const points = data.map((d, index) => {
      const x = (index / (data.length - 1)) * (width - 40) + 20;
      const y = height - (d.remainingDebt / maxVal) * (height - 40) - 20;
      return `${x},${y}`;
    });

    const startX = 20;
    const startY = height - 20;
    const endX = (width - 40) + 20;
    const endY = height - 20;

    return `${startX},${startY} ${points.join(' ')} ${endX},${endY}`;
  });

  chartGridLines = computed(() => {
    const height = 250;
    const lines = [];
    for (let i = 1; i <= 4; i++) {
      const y = 20 + (i * (height - 40) / 4);
      lines.push(y);
    }
    return lines;
  });

  // Handle manual input updates with sanitation
  updateCapital(event: Event) {
    const val = (event.target as HTMLInputElement).valueAsNumber;
    this.capital.set(isNaN(val) ? 0 : val);
  }

  updateRate(event: Event) {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.annualRate.set(isNaN(val) ? 0 : val);
  }

  updateDuration(event: Event) {
    const val = (event.target as HTMLInputElement).valueAsNumber;
    this.durationYears.set(isNaN(val) ? 0 : val);
  }
}
