import HomePage from "./HomePage";
class BasketPage extends HomePage {

    constructor() {
        //Call the parent constructor correctly
        super();
    };
    elementsBasket = {
        basketBadgeIcon: () => cy.get('.navbar-nav .badge-success'),
        basketLink: () => cy.get(".navbar-nav .nav-link").contains("Basket"),

        //Your Basket 
        basketPageTitle: () => cy.get(".my-4 h1").contains("Your Basket"),
        basketPageTitleLeadText: () => cy.get(".my-4 p").contains("Please check your order details and then enter your payment and delivery details."),

        //Basket Items column
        basketColumnTitle: () => cy.get(".mb-4 h4 span.text-muted").contains("Your Basket"),
        basketItemTotalCount: () => cy.get("#basketCount"),
        basketItems: () => cy.get("#basketItems"),
        itemNames: () => cy.get("h6.my-0"),
        itemQuantities: () => cy.get("#basketItems li small.text-muted"),
        perItemPrice: () => cy.get("#basketItems li span.text-muted"),
        deleteItem: () => cy.get("#basketItems li a.small"),
        totalGBP: () => cy.get("#basketItems .list-group-item span:nth-child(1)"),
        toTalGBPPrice: () => cy.get("#basketItems .list-group-item strong:nth-child(2)"),

        //Billing Address
        billingAddressTitle: () => cy.get(".col-md-8 h4").contains("Billing address"),
        firstName: () => cy.get("#name").eq(0),
        lastName: () => cy.get("#name").eq(1),
        email: () => cy.get("#email"),
        address: () => cy.get("#address"),
        address2: () => cy.get("#address2"),
        country: () => cy.get("#country"),
        city: () => cy.get("#city"),
        zipCode: () => cy.get("#zip"),

        //payment
        paymentSectionTitle: () => cy.get("h4.mb-3").contains("Payment"),
        cardName: () => cy.get("#cc-name"),
        cardNumber: () => cy.get("#cc-number"),
        cardExpiration: () => cy.get("#cc-expiration"),
        cardCVV: () => cy.get("#cc-cvv"),

        //delivery section
        deliverySectionTitle: () => cy.get(".col-md-4 .mb-3.text-muted").contains("Delivery"),
        collectFree: () => cy.get("#exampleRadios1"),
        standardShipping: () => cy.get("#exampleRadios2"),
        promoCode: () => cy.get(".input-group:nth-child(1)"),
        emptyBasket: () => cy.get(".input-group:nth-child(2) a"),
       //Checkout
        submitButton: () => cy.get("button[type='submit']")

    };

    verifyBasketPageHeader(){
        this.elements.navLinks().contains(" Basket").click();
        cy.url().should("include","/basket");
        this.elementsBasket.basketPageTitle().should("be.visible");
        this.elementsBasket.basketPageTitleLeadText().should("be.visible");
    }
    //Verifying basket column
    verifyYourBasketColumn(){
        this.elementsBasket.basketColumnTitle().should("be.visible");

    }

    getTotalItemCount(){
        this.elementsBasket.basketItemTotalCount().its("length");
    }

    
}


export default new BasketPage;