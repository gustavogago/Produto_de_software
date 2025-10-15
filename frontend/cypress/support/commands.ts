// Comandos reutilizáveis
declare global {
  namespace Cypress {
    interface Chainable {
      loginUI(email?: string, senha?: string): Chainable<void>;
      mount(component: any): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginUI', (email = 'user@acme.com', senha = 'secret') => {
  cy.visit('/login');
  cy.get('[data-testid=email]').type(email);
  cy.get('[data-testid=senha]').type(`${senha}{enter}`);
  cy.contains(/dashboard|bem-vindo/i).should('be.visible');
});
