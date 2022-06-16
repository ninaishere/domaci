/// <reference types="Cypress" />

import { login } from "../page_objects/login";
const faker = require("faker");

describe("Login test", () => {
  let loginData = {
    email: "nina@gmail.com",
    password: "test123456",
    fakeEmail: faker.internet.email(),
    fakePassword: faker.internet.password(),
  };

  beforeEach("visit login page", () => {
    cy.visit("/login");
    cy.url().should("include", "/login");
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 1.
  it("valid login", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/login",
    }).as("validLogin");

    login.login(loginData.email, loginData.password);

    cy.wait("@validLogin").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      cy.url().should("not.include", "/login");
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 2.
  it("wrong email", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/login",
    }).as("wrongEmail");

    login.login(loginData.fakeEmail, loginData.password);

    cy.wait("@wrongEmail").then((interception) => {
      expect(interception.response.statusCode).eq(401);
      cy.url().should("include", "/login");
      cy.get("#email").should("not.have.text", loginData.email);

      login.errorAlert.should("be.visible");
      login.errorAlert.should("have.text", "Bad Credentials");
      login.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 3.
  it("wrong password", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/login",
    }).as("wrongPass");

    login.login(loginData.email, loginData.fakePassword);

    cy.wait("@wrongPass").then((interception) => {
      expect(interception.response.statusCode).eq(401);
      cy.url().should("include", "/login");
      cy.get("#password").should("not.have.text", loginData.password);

      login.errorAlert.should("be.visible");
      login.errorAlert.should("have.text", "Bad Credentials");
      login.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 4.
  it("logout", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/auth/login",
    }).as("validLogin");

    login.login(loginData.email, loginData.password);

    cy.wait("@validLogin").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      cy.url().should("not.include", "/login");

      cy.intercept({
        method: "POST",
        url: "https://gallery-api.vivifyideas.com/api/auth/logout",
      }).as("logout");

      login.logoutBtn.click();

      cy.wait("@logout").then((interception) => {
        expect(interception.response.statusCode).eq(200);
        cy.url().should("include", "/login");
      });
    });
  });
});
