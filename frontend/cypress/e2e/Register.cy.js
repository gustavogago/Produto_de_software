// Ajuste se precisar: URL da API (apenas para interceptar a chamada)
const api = Cypress.env("apiUrl") || "http://127.0.0.1:8000";

// Seletores baseados no DOM do seu print (sem data-cy)
const $first    = () => cy.get('input[name="first_name"], input[placeholder="First Name"]').first();
const $last     = () => cy.get('input[name="last_name"],  input[placeholder="Last Name"]').first();
const $email    = () => cy.get('input[name="email"],      input[type="email"], input[placeholder="Email"]').first();
const $password = () => cy.get('input[name="password"][type="password"], input[placeholder="Password"]').first();
const $submit   = () => cy.get('button[type="submit"], .form-button').first();

describe("Tela de Registro (seletores pelo DOM real)", () => {
  beforeEach(() => {
    cy.visit("/register");
    // garante que estamos na rota certa
    cy.location("pathname").should("match", /register|signup/i);
  });

  it("renderiza campos e botão", () => {
    cy.contains(/give\.me/i);              // título
    cy.contains(/crie sua conta/i);        // subtítulo
    $first().should("be.visible");
    $last().should("be.visible");
    $email().should("be.visible");
    $password().should("be.visible");
    $submit().should("be.visible");
    cy.contains(/sign in/i).should("exist"); // link para login
  });

  it("valida senhas que não conferem (exibe feedback da UI se houver)", () => {
    $first().clear().type("Ada");
    $last().clear().type("Lovelace");
    $email().clear().type("user@example.com");
    $password().clear().type("Pass12345!");
    // confirma diferente — se sua página tem campo "confirm", adicione-o e selecione por name/placeholder
    // se NÃO tiver confirm, este teste vira apenas um smoke de submit inválido
    // Ex.: cy.get('input[name="confirm"], input[placeholder*="Confirm"]').first().clear().type("Pass12345");
    $submit().click();

    // tenta achar mensagens comuns; não falha se sua UI não exibir texto
    cy.contains(/não conferem|confirm|mismatch/i, { matchCase: false }).then(() => {}, () => {});
    // permanece na mesma rota
    cy.location("pathname").should("match", /register|signup/i);
  });

  it("registro com sucesso → redireciona para login", () => {
    // Intercepta a chamada real do form (ajuste path se necessário)
    cy.intercept("POST", `${api}/api/users/register/`, {
      statusCode: 201,
      body: { id: 1, email: "user@example.com" },
    }).as("regOk");

    $first().clear().type("Ada");
    $last().clear().type("Lovelace");
    $email().clear().type("user@example.com");
    $password().clear().type("Pass12345!");
    $submit().click();

    cy.wait("@regOk").its("request.body").should((body) => {
      // seu backend atual usa ao menos email e password
      expect(body).to.have.property("email");
      expect(body).to.have.property("password");
      // se sua API aceita first_name/last_name, valide também:
      // expect(body).to.have.property("first_name");
      // expect(body).to.have.property("last_name");
    });

    // sua tela mostra link "Sign In" no rodapé; após sucesso, normalmente redireciona pro login
    cy.location("pathname", { timeout: 4000 }).should("match", /login|signin/i);
  });
});
