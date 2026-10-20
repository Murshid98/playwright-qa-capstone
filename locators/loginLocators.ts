// Locator constants for the Login / Register page — automationexercise.com

export const LoginLocators = {
  // Login form
  loginHeading: 'h2:has-text("Login to your account")',
  loginEmail: 'input[data-qa="login-email"]',
  loginPassword: 'input[data-qa="login-password"]',
  loginButton: 'button[data-qa="login-button"]',
  loginError: 'p:has-text("Your email or password is incorrect!")',

  // Register form
  registerHeading: 'h2:has-text("New User Signup!")',
  registerName: 'input[data-qa="signup-name"]',
  registerEmail: 'input[data-qa="signup-email"]',
  registerButton: 'button[data-qa="signup-button"]',
  registerError: 'p:has-text("Email Address already exist!")',
};
