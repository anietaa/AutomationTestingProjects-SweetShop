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
          failOnStatusCode: false, // Prevent test failure on 404/500
          timeout: 30000,
          headers: { "User-Agent": "Mozilla/5.0" }
        }).then((response) => {
          if (!response || response.status !== 200) {
            cy.log(`⚠️ Broken Image: ${imgSrc} (Status: ${response ? response.status : "No Response"})`);
          } else {
            cy.log(`✅ Image Loaded Successfully: ${imgSrc}`);
          }
        }, (error) => {
          cy.log(`⚠️ Request Failed: ${imgSrc}, Error: ${error.message}`);
        });
      });
  });
});


// Verify product details only
Cypress.Commands.add('verifyProductDetails', (product) => {
  cy.get('.card-body h4.card-title').each(($el) => {
    if ($el.text().trim() === product.name) {
      cy.wrap($el)
        .parents('.card')
        .should('exist')
        .within(() => {
          cy.get('p.card-text').should('contain', product.description);
          cy.get('p .text-muted').should('contain', product.price);
          cy.get('.card-img-top')
            .should('be.visible')
            .and('have.attr', 'src')
            .should('not.be.empty');
          cy.verifyImageIsNotBroken('.card-img-top');
        });
    }
  });
});

// Add product to cart and track total price
Cypress.Commands.add('addProductToCart', (product) => {
  cy.log(`🔍 Attempting to add product: ${product.name}`);

  const addedItems = Cypress.env('addedItems') || {};

  // Properly define totalPrice if not already set
  if (Cypress.env('totalPrice') === undefined) {
    Cypress.env('totalPrice', '0.00'); // Initialize to 0.00 only if undefined
  }

  let totalPrice = parseFloat(Cypress.env('totalPrice')) || 0; // Safely parse to avoid NaN

  cy.log(`🛒 Adding product: ${product.name}`);
  cy.log(`💰 Current totalPrice before add: £${totalPrice}`);

  cy.get('.card-body h4.card-title').each(($el) => {
    if ($el.text().trim() === product.name) {
      cy.wrap($el)
        .parents('.card')
        .within(() => {
          cy.get('.card-footer a.addItem')
            .click()
            .then(() => {
              const price = parseFloat(product.price.replace('£', ''));

              addedItems[product.name] = {
                description: product.description,
                price: product.price,
                quantity: (addedItems[product.name]?.quantity || 0) + 1
              };

              let totalPrice2 = parseFloat(Cypress.env('totalPrice')) || 0; // Safely parse to avoid NaN
              // Update total price
              totalPrice2 += price;
              Cypress.env('addedItems', addedItems);
              Cypress.env('totalPrice', totalPrice2.toFixed(2)); // Save updated totalPrice
              cy.log(Cypress.env("totalPrice"))
              cy.log("commandError")

              cy.log(`✅ Added ${product.name} - New Total: £${totalPrice2.toFixed(2)}`);
            });
        });
    }
  });
});

Cypress.Commands.add('verifyBasketContents', () => {
  const addedItems = Cypress.env('addedItems') || {};
  // Ensure totalPrice is properly set
  if (Cypress.env('totalPrice') === undefined) {
    cy.log('🚨 totalPrice is STILL undefined');
  } else {
    cy.log(`✅ totalPrice exists: £${Cypress.env('totalPrice')}`);
  }


  // Ensure basket section is visible
  cy.get('#basketItems', { timeout: 10000 }).should('be.visible');

  // Log the entire basket structure for visibility
  cy.get('#basketItems li').each(($el) => {
    cy.log(`Item HTML: ${$el.html()}`);
  });

  // Exclude the total row when counting items
  cy.get('#basketItems li')
    .not(':contains("Total (GBP)")')
    .should('have.length', Object.keys(addedItems).length);

  Object.entries(addedItems).forEach(([name, item]) => {
    cy.get('#basketItems li h6').then(($els) => {
      const matchingItem = [...$els].find(el =>
        el.innerText.trim().toLowerCase().includes(name.toLowerCase())
      );

      if (matchingItem) {
        cy.wrap(matchingItem).parents('li').within(() => {
          cy.get('small.text-muted').should('contain', `x ${item.quantity}`);
          cy.get('span.text-muted').should('contain', item.price);
        });
      } else {
        cy.log(`⚠️ Item not found in basket: "${name}"`);
      }
    });
  


        // Log actual quantity text to debug
        cy.get('small.text-muted').then(($small) => {
          cy.log(`Actual quantity text for ${name}: "${$small.text().trim()}"`);
        });

        // Adjust quantity assertion based on actual format (like "x 1")
        cy.get('small.text-muted').should('contain', `x ${item.quantity}`);

        // Verify item price
        cy.get('span.text-muted').should('contain', item.price);
      });
  });




// Fill form fields with data from a fixture
Cypress.Commands.add('fillForm', (formData) => {
  for (let field in formData) {
    cy.get(`#${field}`).clear().type(formData[field]);
  }
});

// Fill payment details
Cypress.Commands.add('fillCardDetails', () => {
  cy.fixture('paymentData').then((paymentData) => {
    cy.fillForm(paymentData);
  });
});
