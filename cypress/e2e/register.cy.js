/// <reference types="Cypress" />

import { register } from "../page_objects/register";
const faker = require("faker");

describe("Register test", () => {
  let registerData = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    takenEmail: "domaci@gmail.com",
    password: faker.internet.password(8, false),
    shortPassword: faker.internet.password(4, false),
    invalidPassword: faker.random.alpha(8),
    longName: faker.random.alpha(256),
    noPassword: "        ",
    wrongEmail: "wrong@email",
  };

  beforeEach("visit register page", () => {
    cy.visit("/register");
    cy.url().should("include", "/register");
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 1.
  it("register with valid credentials", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/register",
    }).as("validRegister");

    register.register(
      registerData.firstName,
      registerData.lastName,
      registerData.email,
      registerData.password,
      registerData.password
    );

    cy.wait("@validRegister").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      cy.url().should("not.include", "/register");
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 2.
  it("taken email", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/register",
    }).as("taken");

    register.register(
      registerData.firstName,
      registerData.lastName,
      registerData.takenEmail,
      registerData.password,
      registerData.password
    );

    cy.wait("@taken").then((interception) => {
      expect(interception.response.statusCode).eq(422);
      cy.get("#email").should("not.have.text", registerData.email);
      cy.url().should("include", "/register");

      register.errorAlert.should("be.visible");
      register.errorAlert.should(
        "have.text",
        "The email has already been taken."
      );
      register.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 3.
  it("password doesnt match", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/register",
    }).as("doesntMatch");

    register.register(
      registerData.firstName,
      registerData.lastName,
      registerData.email,
      registerData.password,
      registerData.firstName
    );

    cy.wait("@doesntMatch").then((interception) => {
      expect(interception.response.statusCode).eq(422);
      cy.get("#password-confirmation").should(
        "not.have.text",
        registerData.password
      );
      cy.url().should("include", "/register");

      register.errorAlert.should("be.visible");
      register.errorAlert.should(
        "have.text",
        "The password confirmation does not match."
      );
      register.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 4.
  it("short password", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/register",
    }).as("shortPass");

    register.register(
      registerData.firstName,
      registerData.lastName,
      registerData.email,
      registerData.shortPassword,
      registerData.shortPassword
    );

    cy.wait("@shortPass").then((interception) => {
      expect(interception.response.statusCode).eq(422);
      cy.get("#password").should("not.have.text", registerData.password);
      cy.url().should("include", "/register");

      register.errorAlert.should("be.visible");
      register.errorAlert.should(
        "have.text",
        "The password must be at least 8 characters."
      );
      register.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 5.
  it("invalid password format", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/register",
    }).as("invalidFormat");

    register.register(
      registerData.firstName,
      registerData.lastName,
      registerData.email,
      registerData.invalidPassword,
      registerData.invalidPassword
    );

    cy.wait("@invalidFormat").then((interception) => {
      expect(interception.response.statusCode).eq(422);
      cy.get("#password").should("not.have.text", registerData.password);
      cy.url().should("include", "/register");

      register.errorAlert.should("be.visible");
      register.errorAlert.should(
        "have.text",
        "The password format is invalid."
      );
      register.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 6.
  it("terms and conditions not accepted", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/register",
    }).as("notAccepted");

    register.checkboxNotChecked(
      registerData.firstName,
      registerData.lastName,
      registerData.email,
      registerData.password,
      registerData.password
    );

    cy.wait("@notAccepted").then((interception) => {
      expect(interception.response.statusCode).eq(422);
      cy.url().should("include", "/register");
      cy.get(":checkbox").should("not.be.checked");

      register.errorAlert.should("be.visible");
      register.errorAlert.should(
        "have.text",
        "The terms and conditions must be accepted."
      );
      register.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 7.
  it("too long first or last name", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/register",
    }).as("tooLong");

    register.register(
      registerData.longName,
      registerData.lastName,
      registerData.email,
      registerData.password,
      registerData.password
    );

    cy.wait("@tooLong").then((interception) => {
      expect(interception.response.statusCode).eq(500);
      cy.get("#first-name").should("not.have.text", registerData.firstName);
      cy.url().should("include", "/register");
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 8.
  it("password with 8 spaces", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/register",
    }).as("noPass");

    register.register(
      registerData.firstName,
      registerData.lastName,
      registerData.email,
      registerData.noPassword,
      registerData.noPassword
    );

    cy.wait("@noPass").then((interception) => {
      expect(interception.response.statusCode).eq(422);
      cy.get("#password").should("not.have.text", registerData.password);
      cy.url().should("include", "/register");

      register.errorAlert.should("be.visible");
      register.errorAlert.should(
        "have.text",
        "The password field is required."
      );
      register.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 9.
  it.only("invalid email", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/register",
    }).as("invalidEmail");

    register.register(
      registerData.firstName,
      registerData.lastName,
      registerData.wrongEmail,
      registerData.password,
      registerData.password
    );

    cy.wait("@invalidEmail").then((interception) => {
      expect(interception.response.statusCode).eq(422);
      cy.get("#email").should("not.have.text", registerData.email);
      cy.url().should("include", "/register");

      register.errorAlert.should("be.visible");
      register.errorAlert.should(
        "have.text",
        "The email must be a valid email address."
      );
      register.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });
});
