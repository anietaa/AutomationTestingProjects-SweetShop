/// <reference types="cypress" />

describe('Extract Sweets Page Data', () => {
  it('should extract and save sweets data in JSON', () => {
    cy.visit('/sweets'); // ✅ Uses baseUrl from config

    let sweetsData = [];

    cy.get('.card').each(($el) => {
      const name = $el.find('.card-title').text().trim();
      const description = $el.find('.card-text').text().trim();
      const price = $el.find('.text-muted').text().trim();
      const image = $el.find('.card-img-top').attr('src');

      sweetsData.push({ name, description, price, image });
    }).then(() => {
      cy.task("saveJSON", sweetsData); // ✅ Uses Cypress task to save data
      cy.log('✅ Scraped data saved to sweetsData.json');
    });
  });
});
