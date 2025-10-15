// Suporte para Component Testing (React)
import './commands';
import { mount } from 'cypress/react';

// Adiciona o comando "mount" globalmente para specs de componente
// Ex.: cy.mount(<Button />)
Cypress.Commands.add('mount', mount);
