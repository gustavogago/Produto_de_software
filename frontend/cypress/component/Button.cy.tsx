import React from 'react';
import Button from '../../src/components/Button';

describe('Button (CT)', () => {
  it('renderiza e clica', () => {
    const onClick = cy.spy().as('onClick');
    cy.mount(<Button label="Clique aqui" onClick={onClick} />);
    cy.get('[data-testid=btn]').should('contain.text', 'Clique aqui').click();
    cy.get('@onClick').should('have.been.calledOnce');
  });
});
