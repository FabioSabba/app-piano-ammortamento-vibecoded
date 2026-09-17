import { test, expect } from '@playwright/test';

test.describe('Calcolatore Mutuo - E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app root page
    await page.goto('/');
  });

  test('should display default mortgage values and update them on user interaction', async ({ page }) => {
    // Locate parameters inputs using accessibility-based labels
    const capitalInput = page.getByLabel('Capitale Erogato (€)');
    const rateInput = page.getByLabel('Tasso Annuo Nominale (TAN %)');
    const durationInput = page.getByLabel('Durata (Anni)');

    // Verify default values
    await expect(capitalInput).toHaveValue('200000');
    await expect(rateInput).toHaveValue('3.5');
    await expect(durationInput).toHaveValue('20');

    // Default payment should be €1,159.92 (verify localized components)
    const monthlyPaymentText = page.locator('.kpi-card:has-text("Rata Mensile") .kpi-value');
    await expect(monthlyPaymentText).toContainText('1');
    await expect(monthlyPaymentText).toContainText('159');
    await expect(monthlyPaymentText).toContainText('92');

    // Fill new parameters: 150,000 €, 4.0%, 30 years
    await capitalInput.fill('150000');
    await rateInput.fill('4.0');
    await durationInput.fill('30');

    // Assert calculated monthly payment updates to €716.12
    await expect(monthlyPaymentText).toContainText('716');
    await expect(monthlyPaymentText).toContainText('12');

    // Verify the total interest KPI card
    const totalInterestText = page.locator('.kpi-card:has-text("Totale Interessi") .kpi-value');
    await expect(totalInterestText).toContainText('107');
  });

  test('should toggle between annual and monthly schedule views', async ({ page }) => {
    // Verify default view is Annual (table has "Anno" header and rows start with "Anno")
    const tableHeader = page.locator('.data-table th').first();
    await expect(tableHeader).toHaveText('Anno');
    
    const firstRowLabel = page.locator('.data-table tbody tr td').first();
    await expect(firstRowLabel).toContainText('Anno 1');

    // Toggle to Monthly view
    const monthlyButton = page.getByRole('button', { name: 'Mensile' });
    await monthlyButton.click();

    // Verify view toggled to Monthly (table has "Mese" header and rows start with "Mese")
    await expect(tableHeader).toHaveText('Mese');
    await expect(firstRowLabel).toContainText('Mese 1');

    // Toggle back to Annual view
    const annualButton = page.getByRole('button', { name: 'Annuale' });
    await annualButton.click();

    // Verify view toggled back to Annual
    await expect(tableHeader).toHaveText('Anno');
    await expect(firstRowLabel).toContainText('Anno 1');
  });

  test('should display tooltip details when hovering over chart interactive elements', async ({ page }) => {
    // Hover over the first dot in the SVG chart
    const firstChartDot = page.locator('circle.chart-dot').first();
    
    // Ensure tooltip hint is displayed before hover
    const tooltipPanel = page.locator('.chart-tooltip-panel');
    await expect(tooltipPanel).toContainText('Passa il mouse sopra i punti del grafico');

    // Perform hover action
    await firstChartDot.hover();

    // Verify that the tooltip now displays detailed data for "Anno 1" or similar
    await expect(tooltipPanel).toContainText('Anno');
    await expect(tooltipPanel).toContainText('Debito Residuo');
    await expect(tooltipPanel).toContainText('Interessi Pagati');
  });
});
