import HomePage from "../pages/HomePage";
import SweetsPage from "../pages/SweetsPage";
import BasketPage from "../pages/BasketPage";


const homePage = new HomePage();

describe("Sweet Shop e2e Tests", () => {
  before(() => {
    cy.log("Starting Sweet Shop E2E Tests");
  });

  beforeEach(() => {
    homePage.visit();
  });

  it("should verify nav bar structure and branding", () => {
    homePage.verifyBranding();
  });

  it("should validate the navigation structure", () => {
    cy.fixture("navbarLinks").then((data) => {
      const { expectedLinks, linkDestinations } = data;
      cy.verifyNavLinks(expectedLinks);

      Object.entries(linkDestinations).forEach(([linkText, path]) => {
        cy.verifyLinkNavigation(linkText, path);
      });
    });
  });

  it("should verify all images on the homepage are not broken", () => {
    cy.verifyImageIsNotBroken("img"); // ✅ Checks all images
  });

  it("should verify advertisement image", () => {
    cy.verifyImageIsNotBroken("img");
    homePage.verifyAdvertisement();
  });

  it("should verify heading and tagline", () => {
    homePage.verifyShopHeadingandTagline();
  });

  it("should verify the browse button", () => {
    homePage.verifyBrowseSweets();
  });

  it("should verify the second heading and lead text", () => {
    homePage.verifySecondHeadingAndLeadText();
  });

  // it("should verify most popular sweets products", () => {
  //   homePage.verifyProductsCount(4);
  //   cy.verifyAllProducts();
  // });

  it("should verify footer text", () => {
    homePage.verifyFooterText();
  });

  it("should verify all images on the sweets page are not broken", () => {
    SweetsPage.verifySweetsPage();
    cy.verifyImageIsNotBroken("img"); // ✅ Checks all images on sweets page
  });

  // it.only("should verify the sweets page content and functionality", () => {
  //   SweetsPage.verifySweetsPage();
  //   cy.verifyAllProducts();
  // });

  it("should verify basket page contents and functionality",()=>{
    BasketPage.verifyBasketPageHeader();
  })
});
