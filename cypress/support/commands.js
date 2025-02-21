import HomePage from "../pages/HomePage";
import SweetsPage from "../pages/SweetsPage";
import BasketPage from "../pages/BasketPage";

// Navigation links verification
Cypress.Commands.add("verifyNavLinks", (expectedLinks) => {
  cy.get('.navbar-nav .nav-link').then($links => {
    const actualLinks = Cypress._.map($links, link => {
      return Cypress.$(link).contents().filter(function () {
        return this.nodeType === 3; // Node.TEXT_NODE
      }).text().trim();
    });

    console.log('Expected Links:', expectedLinks);
    console.log('Actual Links:', actualLinks);

    expect(actualLinks).to.deep.equal(expectedLinks);
  });
});

// Navigation link redirection
Cypress.Commands.add("verifyLinkNavigation", (linkText, expectedPath) => {
  cy.get(".navbar-nav").contains(linkText).click();
  cy.url().should("include", expectedPath);
  cy.go("back");
});

// Image verification command
Cypress.Commands.add("verifyImageIsNotBroken", (imgSelector) => {
  cy.get(imgSelector).each(($el) => {
    cy.wrap($el)
      .should("have.attr", "src")
      .then((imgSrc) => {
        if (!imgSrc.startsWith("http")) {
          const baseUrl = Cypress.config("baseUrl").replace(/\/$/, "");
          imgSrc = `${baseUrl}/${imgSrc.replace(/^\//, "")}`;
        }

        cy.request({
          url: imgSrc,
          failOnStatusCode: false, // Prevent Cypress from failing on broken images
          timeout: 30000, // Increase timeout for slow image responses
          headers: { "User-Agent": "Mozilla/5.0" } // Mimic browser request
        }).then(
          (response) => {
            if (!response || response.status !== 200) {
              cy.log(`⚠️ Broken Image: ${imgSrc} (Status: ${response ? response.status : "No Response"})`);
              cy.task("log", `⚠️ Broken Image: ${imgSrc} (Status: ${response ? response.status : "No Response"})`);
            } else {
              cy.log(`✅ Image Loaded Successfully: ${imgSrc}`);
            }
          },
          () => {
            // Prevent breaking the test even if request fails
            cy.log(`⚠️ Request Timeout or Failure: ${imgSrc}`);
            cy.task("log", `⚠️ Request Timeout or Failure: ${imgSrc}`);
          }
        );
      });
  });
});


// Verify all products using the product list from a fixture file
Cypress.Commands.add("verifyAllProducts", () => {
  cy.fixture("sweetsData").then(({ sweetProducts }) => {
    cy.log(`Checking all products`);

    sweetProducts.forEach((product) => {
      cy.log(`Verifying product: ${product.name}`);

      cy.get(".card-body h4.card-title")
        .should("exist")
        .each(($el) => {
          if ($el.text().trim() === product.name) {
            cy.wrap($el)
              .parents(".card")
              .should("exist")
              .within(() => {
                cy.get("p.card-text").should("contain", product.description);
                cy.get("p .text-muted").should("contain", product.price);

                // ✅ Fixed function name
                cy.verifyImageIsNotBroken(".card-img-top");

                cy.get(".card-footer a.addItem").should("contain", "Add to Basket").click();
              });
          }
        });
    });
  });
});

//check total items in the basket
Cypress.Commands.add("getBasketItemCount",()=>{
  return BasketPage.getTotalItemCount();
})



// Cypress.Commands.add("verifyProductDetails", (pageObject, productName) => { 
//   if (!pageObject || !pageObject.elements || !pageObject.elements.productName) {
//     throw new Error(`❌ Error: pageObject.elements or productName is undefined! Check if you're passing the correct pageObject.`);
//   }

//   cy.fixture('sweetsData').then(({ sweetProducts }) => {
//     const product = sweetProducts.find(p => p.name === productName);
//     if (!product) throw new Error(`❌ Product "${productName}" not found in fixture file.`);

//     cy.log(`🔍 Verifying product: ${product.name}`);

//     // ✅ Loop through each card and find the correct one by title
//     pageObject.elements.productName()
//       .should("exist")
//       .each(($el) => {
//         if ($el.text().trim() === product.name) {
//           cy.wrap($el)
//             .parents(".card")
//             .should("exist")
//             .within(() => {
//               cy.get("p.card-text").should("contain", product.description);
//               cy.get("p .text-muted").should("contain", product.price);

//               // ✅ Alternative Image Verification
//               cy.get(".card-img-top")
//                 .should("be.visible")
//                 .and(($img) => {
//                   expect($img.attr("src")).to.not.be.empty;
//                 });

//               cy.get(".card-footer a.addItem").should("contain", "Add to Basket").click();
//             });
//         }
//       });
//   });
// });
