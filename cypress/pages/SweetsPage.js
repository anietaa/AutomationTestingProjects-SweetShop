import HomePage from "./HomePage";

class SweetsPage extends HomePage {
  constructor() {
    super(); // ✅ Call the parent constructor correctly
  }

  verifySweetsPage() {
    this.elements.navLinks().contains("Sweets").click();
    cy.url().should("include", "/sweets");
  }

  verifySweetPageProducts(expectedCount) {
    this.elements.productCards().should("have.length", expectedCount);
    return this;
  }
}

// ✅ Now create and export an instance
export default new SweetsPage();

