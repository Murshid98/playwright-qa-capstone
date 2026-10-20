import { test, expect } from '../../fixtures';
import usersData from '../../testdata/users.json';

test.describe('TC14: Contact Us Form', () => {
  test('TC14 - Submit contact form with valid data', async ({
    contactPage,
    homePage,
    page,
  }) => {
    await contactPage.goto();
    expect(await contactPage.isContactPageVisible()).toBeTruthy();

    const { name, email, subject, message } = usersData.contactForm;

    await contactPage.fillContactForm({ name, email, subject, message });
    await contactPage.submitContactForm();

    expect(await contactPage.isSuccessMessageVisible()).toBeTruthy();

    const successText = await contactPage.getSuccessMessage();
    expect(successText).toContain('Success!');

    await contactPage.clickHomeButton();
    expect(await homePage.isHomePageVisible()).toBeTruthy();
  });

  test('TC14b - Contact form - home button returns to home page', async ({
    contactPage,
    homePage,
    page,
  }) => {
    await contactPage.goto();
    await expect(page.locator('h2:has-text("GET IN TOUCH")')).toBeVisible();

    await contactPage.fillContactForm({
      name: 'Validator Test',
      email: 'validator@test.com',
      subject: 'Test Subject',
      message: 'Test message body for validation purposes.',
    });

    await contactPage.submitContactForm();
    await contactPage.clickHomeButton();

    expect(page.url()).toBe('https://automationexercise.com/');
  });
});
