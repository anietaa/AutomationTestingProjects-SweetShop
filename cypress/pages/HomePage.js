class HomePage {
  elements = { 
    navbar: () => cy.get('nav.navbar'),
    brandLogo: () => cy.get('.navbar-brand img'),
    brandText: () => cy.get('.navbar-brand').not('img'),
    mobileMenuToggler: () => cy.get('.navbar-toggler'),
    navLinks: () => cy.get('.navbar-nav .nav-link'),
    basketBadge: () => cy.get('.navbar-nav .badge-success'),
    advertisementImage: () => cy.get(".advertising img"),
    shopHeading: () => cy.get(".my-4 h1"),
    shopTagLine: () => cy.get(".my-4 p"),
    browseSweets: () => cy.get(".my-4 a.sweets"),
    secondHeading: () => cy.get(".container h2"),
    secondHeadingLeadText: () => cy.get(".container p span.lead"),
    mostPopularSweetsSection: () => cy.get(".container .row.text-center"),
    productCards: () => cy.get(".card"),
    productName: () => cy.get(".card-body h4.card-title").parents(".card"),
    productDescription: (id) => cy.get(".card-body p.card-text").parents(".card"),
    productPrice: () => cy.get(".card-body p .text-muted").parents(".card"),
    productImage: () => cy.get(".card-img-top").parents(".card"),
    addToBasketButton: () => cy.get(".card-footer a.addItem"),
    footerText: () => cy.get(".py-5 p.m-0.text-center"),
  };

  visit() {
    //Uses baseUrl from cypress.config.js
    cy.visit("/");
    return this;
  }

  verifyBranding() {
    this.elements.brandLogo()
      .should('be.visible')
      .and('have.attr', 'src', 'favicon.png')
      .and('have.attr', 'width', '30')
      .and('have.attr', 'height', '30');

    this.elements.brandText()
      .should('contain', 'Sweet Shop');

    return this;
  }

  toggleMobileMenu() {
    this.elements.mobileMenuToggler().click();
    return this;
  }

  verifyAdvertisement() {
    this.elements.advertisementImage().should("be.visible")
      .and("have.attr", "src", "img/sale.gif")
      .and("have.attr", "alt", "Sale now on");
  }

  verifyShopHeadingandTagline() {
    this.elements.shopHeading().contains("Welcome to the sweet shop!");
    this.elements.shopTagLine().contains("The sweetest online shop out there.");
  }

  verifyBrowseSweets() {
    this.elements.browseSweets().should("be.visible")
      .and("have.text", "Browse Sweets")
      .and("have.attr", "href", "/sweets");
    this.elements.browseSweets().click();
    cy.url().should("include", "/sweets");
    cy.go("back");
  }

  verifySecondHeadingAndLeadText() {
    this.elements.secondHeading().should("be.visible")
      .and("have.text", "Most popular");
    this.elements.secondHeadingLeadText().should("be.visible")
      .and("have.text", "Our most popular choice of retro sweets.");
  }

  verifyPopularSweets() {
    this.elements.mostPopularSweetsSection();
  }

  verifyProductsCount(expectedCount) {
    this.elements.productCards().should('have.length', expectedCount);
    return this;
  }

  verifyFooterText() {
    this.elements.footerText().contains("Sweet Shop Project 2018");
  }
}

// ✅ Export the class itself, not an instance
export default HomePage;
