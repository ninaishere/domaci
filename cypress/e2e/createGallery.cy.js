/// <reference types="Cypress" />

import { createGallery } from "../page_objects/createGallery";
const faker = require("faker");

describe("Create gallery test", () => {
  let galleryId;
  let galleryData = {
    title: faker.name.firstName(),
    description: faker.name.firstName(),
    image: faker.image.avatar(),
    shortTitle: faker.random.alphaNumeric(),
    title256: faker.random.alpha(256),
    desc1001: faker.random.alpha(1001),
    notAimage: faker.internet.url(),
    phoneImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
    comment: faker.random.word(),
    comment1001: faker.random.alpha(1001),
  };

  beforeEach("login via backend", () => {
    cy.loginViaBackend();
    cy.visit("/create");
    cy.url().should("include", "/create");
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 1.
  it("create gallery", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/galleries",
    }).as("createGallery");

    createGallery.createGallery(
      galleryData.title,
      galleryData.description,
      galleryData.phoneImage
    );

    cy.wait("@createGallery").then((interception) => {
      galleryId = interception.response.body.id;

      expect(interception.response.body.title).eq(galleryData.title);
      expect(interception.response.body.description).eq(
        galleryData.description
      );
      expect(interception.response.statusCode).to.eql(201);

      cy.visit(`/galleries/${galleryId}`);
      // cy.visit('/galleries/' + galleryId)
      cy.url().should("not.include", "/create");
      cy.get("h1").should("have.text", galleryData.title);
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 2.
  it("create gallery without description", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/galleries",
    }).as("noDesc");

    createGallery.createGallery(galleryData.title, " ", galleryData.phoneImage);

    cy.wait("@noDesc").then((interception) => {
      galleryId = interception.response.body.id;

      expect(interception.response.body.description).to.not.eql(
        galleryData.description
      );
      expect(interception.response.statusCode).to.eql(201);

      cy.visit("/galleries/" + galleryId);
      cy.url().should("not.include", "/create");
      cy.get("p").should("not.have.text", galleryData.description);
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 3.
  it("short title", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/galleries",
    }).as("shortTitle");

    createGallery.createGallery(
      galleryData.shortTitle,
      galleryData.description,
      galleryData.phoneImage
    );

    cy.wait("@shortTitle").then((interception) => {
      expect(interception.response.statusCode).to.eql(422);

      cy.url().should("include", "/create");
      cy.get("#title").should("not.have.text", galleryData.title);
      createGallery.errorAlert.should("be.visible");
      createGallery.errorAlert.should(
        "have.text",
        "The title must be at least 2 characters."
      );
      createGallery.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 4.
  it("too long title", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/galleries",
    }).as("longTitle");

    createGallery.createGallery(
      galleryData.title256,
      galleryData.description,
      galleryData.phoneImage
    );

    cy.wait("@longTitle").then((interception) => {
      expect(interception.response.statusCode).to.eql(422);

      cy.url().should("include", "/create");
      cy.get("#title").should("not.have.text", galleryData.title);
      createGallery.errorAlert.should("be.visible");
      createGallery.errorAlert.should(
        "have.text",
        "The title may not be greater than 255 characters."
      );
      createGallery.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 5.
  it("too long description", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/galleries",
    }).as("longDesc");

    createGallery.createGallery(
      galleryData.title,
      galleryData.desc1001,
      galleryData.phoneImage
    );

    cy.wait("@longDesc").then((interception) => {
      expect(interception.response.statusCode).to.eql(422);

      cy.url().should("include", "/create");
      cy.get("#description").should("not.have.text", galleryData.description);
      createGallery.errorAlert.should("be.visible");
      createGallery.errorAlert.should(
        "have.text",
        "The description may not be greater than 1000 characters."
      );
      createGallery.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 6.
  it("wrong image format", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/galleries",
    }).as("wrongImgFormat");

    createGallery.createGallery(
      galleryData.title,
      galleryData.description,
      galleryData.notAimage
    );

    cy.wait("@wrongImgFormat").then((interception) => {
      expect(interception.response.statusCode).to.eql(422);

      cy.url().should("include", "/create");
      cy.get(createGallery.imageInput).should(
        "not.have.text",
        galleryData.phoneImage
      );
      createGallery.errorAlert.should("be.visible");
      createGallery.errorAlert.should("have.text", "Wrong format of image");
      createGallery.errorAlert.should(
        "have.css",
        "background-color",
        "rgb(248, 215, 218)"
      );
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 7.
  it("add comment on the created gallery", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/galleries",
    }).as("createG");

    createGallery.createGallery(
      galleryData.title,
      galleryData.description,
      galleryData.phoneImage
    );

    cy.wait("@createG").then((interception) => {
      galleryId = interception.response.body.id;

      expect(interception.response.statusCode).to.eql(201);

      cy.visit("/galleries/" + galleryId);
      cy.url().should("not.include", "/create");

      cy.intercept({
        method: "POST",
        url: "https://gallery-api.vivifyideas.com/api/comments",
      }).as("addComm");

      createGallery.addComment(galleryData.comment);

      cy.wait("@addComm").then((interception) => {
        expect(interception.response.statusCode).to.eql(200);
        cy.url().should("include", galleryId);
        // expect(interception.response.comments.body).to.eql(galleryData.comment);

        cy.get(".list-group-item > p")
          .first()
          .should("have.text", galleryData.comment);
      });
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 8.
  it("too long comment", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/galleries",
    }).as("create");

    createGallery.createGallery(
      galleryData.title,
      galleryData.description,
      galleryData.phoneImage
    );

    cy.wait("@create").then((interception) => {
      galleryId = interception.response.body.id;

      expect(interception.response.statusCode).to.eql(201);

      cy.visit("/galleries/" + galleryId);
      cy.url().should("not.include", "/create");

      cy.intercept({
        method: "POST",
        url: "https://gallery-api.vivifyideas.com/api/comments",
      }).as("longComm");

      createGallery.addComment(galleryData.comment1001);

      cy.wait("@longComm").then((interception) => {
        expect(interception.response.statusCode).to.eql(422);
        cy.url().should("include", galleryId);
        cy.get("textarea").should("not.have.text", galleryData.comment);

        createGallery.errorAlert.should("be.visible");
        createGallery.errorAlert.should(
          "have.text",
          "The body may not be greater than 1000 characters."
        );
        createGallery.errorAlert.should(
          "have.css",
          "background-color",
          "rgb(248, 215, 218)"
        );
      });
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 9.
  it("edit gallery", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/galleries",
    }).as("create");

    createGallery.createGallery(
      galleryData.title,
      galleryData.description,
      galleryData.phoneImage
    );

    cy.wait("@create").then((interception) => {
      galleryId = interception.response.body.id;

      expect(interception.response.statusCode).to.eql(201);

      cy.visit("/galleries/" + galleryId);
      cy.url().should("not.include", "/create");

      cy.intercept({
        method: "GET",
        url: `https://gallery-api.vivifyideas.com/api/galleries/${galleryId}/edit`,
      }).as("edit");

      createGallery.editGalleryBtn.click();

      cy.wait("@edit").then((interception) => {
        cy.visit("/edit-gallery/" + galleryId);
        expect(interception.response.statusCode).to.eql(200);
      });
    });
  });

  // ︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿︿
  // 10.
  it("delete gallery after creating", () => {
    cy.intercept({
      method: "POST",
      url: "https://gallery-api.vivifyideas.com/api/galleries",
    }).as("create");

    createGallery.createGallery(
      galleryData.title,
      galleryData.description,
      galleryData.phoneImage
    );

    cy.wait("@create").then((interception) => {
      galleryId = interception.response.body.id;

      expect(interception.response.statusCode).to.eql(201);

      cy.visit("/galleries/" + galleryId);
      cy.url().should("not.include", "/create");

      cy.intercept({
        method: "DELETE",
        url: `https://gallery-api.vivifyideas.com/api/galleries/${galleryId}`,
      }).as("delete");

      createGallery.deleteGalleryBtn.click();

      cy.wait("@delete").then((intercept) => {
        expect(intercept.response.statusCode).to.eql(200);
      });
    });
  });
});
