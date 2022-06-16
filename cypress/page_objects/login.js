class Login {
  get emailInput() {
    return cy.get("#email");
  }

  get passwordInput() {
    return cy.get("#password");
  }

  get submitBtn() {
    return cy.get("button");
  }

  get errorAlert() {
    return cy.get("p.alert-danger");
  }

  get logoutBtn() {
    return cy.get(".nav-link").last();
  }

  login(email, password) {
    this.emailInput.type(email);
    this.passwordInput.type(password);
    this.submitBtn.click();
  }
}

export const login = new Login();
