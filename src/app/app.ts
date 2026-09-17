import { Component, signal } from '@angular/core';
import { MortgageCalculatorComponent } from './mortgage-calculator/mortgage-calculator.component';

@Component({
  selector: 'app-root',
  imports: [MortgageCalculatorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('my-app');
}

