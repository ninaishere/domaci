class Register {
  get firstNameInput() {
    return cy.get("#first-name");
  }

  get lastNameInput() {
    return cy.get("#last-name");
  }

  get emailInput() {
    return cy.get("#email");
  }

  get passwordInput() {
    return cy.get("#password");
  }

  get passwordConfiramtionInput() {
    return cy.get("#password-confirmation");
  }

  get checkbox() {
    return cy.get(":checkbox");
  }

  get submitBtn() {
    return cy.get("button");
  }

  get errorAlert() {
    return cy.get("p.alert-danger");
  }

  register(firstName, lastName, email, password, confirmedPassword) {
    this.firstNameInput.type(firstName);
    this.lastNameInput.type(lastName);
    this.emailInput.type(email);
    this.passwordInput.type(password);
    this.passwordConfiramtionInput.type(confirmedPassword);
    this.checkbox.check();
    this.submitBtn.click();
  }

  checkboxNotChecked(firstName, lastName, email, password, confirmedPassword) {
    this.firstNameInput.type(firstName);
    this.lastNameInput.type(lastName);
    this.emailInput.type(email);
    this.passwordInput.type(password);
    this.passwordConfiramtionInput.type(confirmedPassword);
    this.submitBtn.click();
  }
}

export const register = new Register();
