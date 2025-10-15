describe('Home (E2E)', () => {
  it('abre e exibe o título', () => {
    cy.visit('/');
    cy.title().should('match', /Home|Dashboard|Example/i);
    cy.contains('h1', /Home|Dashboard|Bem-vindo|Example/i).should('be.visible');
  });
});
