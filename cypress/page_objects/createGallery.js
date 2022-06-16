class CreateGallery {
  get titleInput() {
    return cy.get("#title");
  }

  get descriptionInput() {
    return cy.get("#description");
  }

  get imageInput() {
    return cy.get("input").last();
  }

  get submitBtn() {
    return cy.get("button").eq(-2);
  }

  get errorAlert() {
    return cy.get("p.alert-danger");
  }

  get commentInput() {
    return cy.get("textarea");
  }

  get submitCommBtn() {
    return cy.get("button").last();
  }

  get addedComment() {
    return cy.get(".list-group-item > p").first();
  }

  get deleteGalleryBtn() {
    return cy.get(".btn-custom").first();
  }

  get editGalleryBtn() {
    return cy.get(".btn-custom").eq(1);
  }

  createGallery(title, desc, image) {
    this.titleInput.type(title);
    this.descriptionInput.type(desc);
    this.imageInput.type(image);
    this.submitBtn.click();
  }

  addComment(comment) {
    this.commentInput.type(comment);
    this.submitCommBtn.click();
  }
}

export const createGallery = new CreateGallery();
