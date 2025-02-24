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
    if (!Cypress.env('totalPrice')) {
      Cypress.env('totalPrice', '0.00');
    }
  
    if (!Cypress.env('addedItems')) {
      Cypress.env('addedItems', {});
    }
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
    cy.verifyImageIsNotBroken("img");
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

  it("should verify most popular sweets products", () => {
    homePage.verifyProductsCount(4);
    cy.verifyProductDetails("mostPopularSweets.json");
  });

  it("should verify footer text", () => {
    homePage.verifyFooterText();
  });

  it("should verify all images on the sweets page are not broken", () => {
    SweetsPage.verifySweetsPage();
    cy.verifyImageIsNotBroken("img");
  });

  it("should verify the sweets page content and functionality", () => {
    SweetsPage.verifySweetsPage();
    cy.verifyProductDetails("sweetsData.json");
  });

  // Basket Page
  it("should add products and verify basket contents", () => {
    // let totalPrice = Cypress.env('totalPrice')
    cy.fixture("sweetsData.json").then((sweets) => {
      sweets.sweetProducts.forEach((product) => {
        cy.addProductToCart(product);
        
        //cy.log(totalPrice);
        cy.log(product.price)
        cy.log("Anita")

      });
      
    });
    let totalPrice = Cypress.env('totalPrice')

    cy.log(totalPrice);
    cy.log("anita2")

    
    BasketPage.verifyBasketPageHeader();
    BasketPage.validateBasketContents();

   
    
    cy.log('Checking if addProductToCart is being called');

    BasketPage.verifyTotalPrice(`${totalPrice}`);
  });

  it("should fill delivery, billing and payment details", () => {
   // BasketPage.fillDeliveryAddress();
    BasketPage.fillBillingDetails();
    BasketPage.fillPaymentDetails();
    BasketPage.selectDeliverType();
  });

  it("should place order successfully", () => {
    BasketPage.placeOrder();
  });
});
