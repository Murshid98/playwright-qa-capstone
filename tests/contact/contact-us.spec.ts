import { test, expect } from '../../fixtures';
import usersData from '../../testdata/users.json';

test.describe('TC08: Contact Us Form', () => {
  test('TC08 - Submit contact form with valid data', async ({
    contactPage,
    homePage,
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
});
