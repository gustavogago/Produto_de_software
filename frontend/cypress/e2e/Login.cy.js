const api = Cypress.env("apiUrl") || <Link data-cy="go-login" to="/login">Sign In</Link>


describe("Tela de Login", () => {
  beforeEach(() => cy.visit("/login"));

  it("renderiza componentes principais", () => {
    cy.contains(/give\.me/i);
    cy.dataCy("login-email").should("be.visible");
    cy.dataCy("login-password").should("be.visible");
    cy.dataCy("login-submit").should("be.visible");
    cy.dataCy("go-signup").should("be.visible");
  });

  it("mostra erro com credenciais inválidas", () => {
    cy.intercept("POST", `${api}/api/users/login/`, { statusCode: 401, fixture: "auth.invalid.json" }).as("loginFail");
    cy.dataCy("login-email").clear().type("admin@example.com");
    cy.dataCy("login-password").clear().type("wrong");
    cy.dataCy("login-submit").click();
    cy.wait("@loginFail");
    cy.dataCy("login-error").should("exist");
    cy.location("pathname").should("match", /login|signin/i);
  });

  it("login com sucesso redireciona", () => {
    cy.intercept("POST", `${api}/api/users/login/`, { statusCode: 200, fixture: "auth.success.json" }).as("loginOk");
    cy.dataCy("login-email").clear().type("admin@example.com");
    cy.dataCy("login-password").clear().type("Pass12345!");
    cy.dataCy("login-submit").click();
    cy.wait("@loginOk");
    cy.location("pathname").should("match", /dashboard|home|items|app/i);
  });
});
