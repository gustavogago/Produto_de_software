describe('Dashboard - API intercept (E2E)', () => {
  it('lista tickets da API com fixture', () => {
    cy.intercept('GET', '/api/tickets', { fixture: 'tickets.json' }).as('getTickets');
    cy.visit('/dashboard');
    cy.wait('@getTickets');
    cy.get('[data-testid=ticket-row]').should('have.length.at.least', 1);
  });
});
