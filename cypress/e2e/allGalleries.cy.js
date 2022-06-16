/// <reference types="Cypress" />

import { allGalleries } from "../page_objects/allGalleries";
const faker = require("faker");

describe("AllGalleries test", () => {
  let searchTerm = faker.name.firstName();

  beforeEach("login via backend", () => {
    cy.loginViaBackend();
    cy.visit("/");
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 1.
  it("all galleries", () => {
    cy.intercept({
      method: "GET",
      url: "https://gallery-api.vivifyideas.com/api/galleries?page=1&term=",
    }).as("all");

    cy.get("a").eq(1).click();

    cy.wait("@all").then((interception) => {
      expect(interception.response.statusCode).eq(200);
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 2.
  it("test pagination", () => {
    cy.intercept({
      method: "GET",
      url: "https://gallery-api.vivifyideas.com/api/galleries?page=2&term=",
    }).as("pagination");

    allGalleries.loadMoreBtn.click();

    cy.wait("@pagination").then((interception) => {
      expect(interception.response.statusCode).to.eql(200);
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 3.
  it.only("search", () => {
    cy.intercept({
      method: "GET",
      url: `https://gallery-api.vivifyideas.com/api/galleries?page=1&term=${searchTerm}`,
    }).as("search");

    allGalleries.search(searchTerm);

    cy.wait("@search").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      // expect(interception.response.body.galleries.title).eq(searchTerm);
    });
  });
});
