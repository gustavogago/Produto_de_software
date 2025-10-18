// cypress/e2e/Register.cy.js

// URL base só para referência; o intercept usa um GLOB tolerante também
const api = Cypress.env('apiUrl') || 'http://127.0.0.1:8000';
// cobre absoluta/relativa, com/sem barra final, com/sem query
const REGISTER_GLOB = '**/api/users/register*';
const REG_URLS = [`${api}/api/users/register/`, REGISTER_GLOB];

const $first    = () => cy.get('input[name="first_name"], input[placeholder="First Name"]').first();
const $last     = () => cy.get('input[name="last_name"],  input[placeholder="Last Name"]').first();
const $email    = () => cy.get('input[name="email"],      input[type="email"], input[placeholder="Email"]').first();
const $password = () => cy.get('input[name="password"][type="password"], input[placeholder="Password"]').first();
const $submit   = () => cy.get('button[type="submit"], .form-button').first();
const $form     = () => cy.get('form.login-form').first();

function fill({ first = 'Ada', last = 'Lovelace', email = 'user@example.com', pass = 'Pass12345!' } = {}) {
  $first().clear().type(first);
  $last().clear().type(last);
  $email().clear().type(email);
  $password().clear().type(pass);
}

/* =========================
   SUÍTE ENXUTA QUE DEVE PASSAR
   ========================= */
describe('Registro — básico estável', () => {
  beforeEach(() => {
    cy.visit('/register');
    cy.location('pathname').should('match', /register|signup/i);
  });

  it('renderiza campos, botão e link para login', () => {
    cy.contains(/give\.me/i).should('be.visible');
    cy.contains(/crie sua conta|create your account|sign up/i).should('be.visible');

    $first().should('be.visible');
    $last().should('be.visible');
    $email().should('be.visible');
    $password().should('be.visible');
    $submit().should('be.visible');

    cy.contains('a', /sign\s*in|entrar|login/i).should('exist');
  });

  it('sucesso (201) → envia os 4 campos e redireciona para /login', () => {
    cy.intercept('POST', REGISTER_GLOB, {
      statusCode: 201,
      headers: { 'content-type': 'application/json' },
      body: { id: 1, email: 'user@example.com' },
    }).as('regOk');

    fill();
    $submit().click();

    cy.wait('@regOk').its('request.body').should((body) => {
      expect(body).to.have.property('first_name');
      expect(body).to.have.property('last_name');
      expect(body).to.have.property('email');
      expect(body).to.have.property('password');
    });

    cy.location('pathname', { timeout: 4000 }).should('match', /login|signin/i);
  });

  it('409 (email já existe) → alerta e permanece na página', () => {
    cy.intercept('POST', REGISTER_GLOB, {
      statusCode: 409,
      body: { detail: 'Email already exists' },
    }).as('reg409');

    cy.window().then((win) => cy.stub(win, 'alert').as('alert'));

    fill();
    $submit().click();

    cy.wait('@reg409');
    cy.get('@alert').should('have.been.called');
    cy.get('@alert').should('have.been.calledWithMatch', /email|existe|exists/i);
    cy.location('pathname').should('match', /register|signup/i);
  });

  // 🔧 CORRIGIDO: desabilita validação nativa para permitir o POST 400
  it('400 (validação) → alerta genérico e permanece (sem bloquear pelo HTML5)', () => {
    cy.intercept('POST', REGISTER_GLOB, {
      statusCode: 400,
      body: { email: ['Formato inválido'] },
    }).as('reg400');

    // Desliga a validação nativa do navegador para este submit
    $form().invoke('attr', 'novalidate', 'novalidate');

    cy.window().then((win) => cy.stub(win, 'alert').as('alert'));

    // usa um email "válido" pra não acionar HTML5; quem retorna 400 é o backend simulado
    fill({ email: 'user@example.com', pass: '123' });
    $submit().click();

    cy.wait('@reg400');
    cy.get('@alert').should('have.been.called');
    cy.location('pathname').should('match', /register|signup/i);
  });

  it('link "Sign In" navega para /login', () => {
    cy.contains('a', /sign\s*in|entrar|login/i).click({ force: true });
    cy.location('pathname').should('match', /login|signin/i);
  });

  // 🆕 Caso do print: validação nativa (required) bloqueia submit quando First Name vazio
  it('bloqueia submit com HTML5 "required" quando First Name está vazio', () => {
    // Guarda de segurança: nenhuma chamada deve acontecer
    cy.intercept('POST', REGISTER_GLOB, () => {
      throw new Error('Não deveria chamar a API com campos required vazios');
    }).as('guard');

    // deixa o first_name vazio; preenche o restante
    $first().clear(); // vazio
    $last().clear().type('Lovelace');
    $email().clear().type('user@example.com');
    $password().clear().type('Pass12345!');

    // tenta enviar
    $submit().click();

    // formulário inválido
    $form().then(($f) => {
      expect($f[0].checkValidity()).to.eq(false);
    });

    // campo específico inválido + mensagem nativa
    $first().then(($i) => {
      const el = $i[0];
      expect(el.checkValidity()).to.eq(false);
      expect(el.validationMessage).to.match(/preencha|campo|fill|field/i);
    });

    // continua na mesma rota
    cy.location('pathname').should('match', /register|signup/i);

    // pequena espera para garantir que nada escapou
    cy.wait(200);
  });
    

  it('inputs possuem atributo required e password é type="password"', () => {
    $first().should('have.attr', 'required');
    $last().should('have.attr', 'required');
    $email().should('have.attr', 'required').and('have.attr', 'type', 'email');
    $password().should('have.attr', 'required').and('have.attr', 'type', 'password');
  });

  it('não envia quando Email é inválido (HTML5) — nenhum POST ocorre', () => {
    // guarda: nenhuma request deve sair
    cy.intercept('POST', REGISTER_GLOB, () => {
      throw new Error('Não deveria chamar a API com email inválido pelo HTML5');
    }).as('guard');

    // Preenche com email inválido (sem @)
    $first().clear().type('Ada');
    $last().clear().type('Lovelace');
    $email().clear().type('invalid-email');
    $password().clear().type('Pass12345!');

    $submit().click();

    // form e campo email inválidos
    cy.get('form.login-form').then(($f) => expect($f[0].checkValidity()).to.eq(false));
    $email().then(($i) => {
      const el = $i[0];
      expect(el.checkValidity()).to.eq(false);
      // mensagem varia por idioma/navegador; só checamos palavras comuns
      expect(el.validationMessage).to.match(/email|@|válido|valid/i);
    });

    cy.location('pathname').should('match', /register|signup/i);
    cy.wait(150);
  });

  it('não envia quando Last Name está vazio (HTML5 required)', () => {
    cy.intercept('POST', REGISTER_GLOB, () => {
      throw new Error('Não deveria chamar a API com last_name vazio');
    }).as('guard');

    $first().clear().type('Ada');
    $last().clear(); // vazio
    $email().clear().type('user@example.com');
    $password().clear().type('Pass12345!');

    $submit().click();

    cy.get('form.login-form').then(($f) => expect($f[0].checkValidity()).to.eq(false));
    $last().then(($i) => expect($i[0].checkValidity()).to.eq(false));
    cy.location('pathname').should('match', /register|signup/i);
    cy.wait(150);
  });

  it('não envia quando Password está vazio (HTML5 required)', () => {
    cy.intercept('POST', REGISTER_GLOB, () => {
      throw new Error('Não deveria chamar a API com password vazio');
    }).as('guard');

    $first().clear().type('Ada');
    $last().clear().type('Lovelace');
    $email().clear().type('user@example.com');
    $password().clear(); // vazio

    $submit().click();

    cy.get('form.login-form').then(($f) => expect($f[0].checkValidity()).to.eq(false));
    $password().then(($i) => expect($i[0].checkValidity()).to.eq(false));
    cy.location('pathname').should('match', /register|signup/i);
    cy.wait(150);
  });

  it('sucesso (201) — URL da request bate no endpoint de registro', () => {
    cy.intercept('POST', REGISTER_GLOB, (req) => {
      expect(req.method).to.eq('POST');
      expect(req.url).to.match(/\/api\/users\/register\/?/); // aceita com/sem barra final
      req.reply({ statusCode: 201, body: { id: 1, email: 'user@example.com' } });
    }).as('regOk2');

    fill();
    $submit().click();

    cy.wait('@regOk2');
    cy.location('pathname', { timeout: 4000 }).should('match', /login|signin/i);
  });

  it('sucesso (201) — payload não contém campos inesperados', () => {
    cy.intercept('POST', REGISTER_GLOB, (req) => {
      const keys = Object.keys(req.body || {});
      // Deve conter exatamente estes 4 campos (ordem não importa)
      expect(keys.sort()).to.deep.eq(['email', 'first_name', 'last_name', 'password'].sort());
      req.reply({ statusCode: 201, body: { id: 1, email: 'user@example.com' } });
    }).as('regOk3');

    fill();
    $submit().click();
    cy.wait('@regOk3');
  });

  it('500 (erro de servidor) — mostra alert amigável e permanece', () => {
    cy.intercept('POST', REGISTER_GLOB, {
      statusCode: 500,
      body: { detail: 'Server error' },
    }).as('reg500simple');

    cy.window().then((win) => cy.stub(win, 'alert').as('alert'));

    fill();
    $submit().click();

    cy.wait('@reg500simple');
    cy.get('@alert').should('have.been.called'); // não prendemos a regex de texto
    cy.location('pathname').should('match', /register|signup/i);
  });

  /* =========================
   SUÍTE FALHANDO DE PROPÓSITO
   ========================= */
describe('Registro — falhos de propósito', () => {
  beforeEach(() => {
    cy.visit('/register');
    cy.location('pathname').should('match', /register|signup/i);
  });

  it('mostra toast no DOM em vez de alert no 409 (vai falhar)', () => {
    cy.intercept('POST', REGISTER_GLOB, {
      statusCode: 409,
      body: { detail: 'Email already exists' },
    }).as('reg409');

    $first().clear().type('Ada');
    $last().clear().type('Lovelace');
    $email().clear().type('user@example.com');
    $password().clear().type('Pass12345!');

    $submit().click();
    cy.wait('@reg409');

    // o app usa window.alert; aqui exigimos um toast/alert DOM -> FALHA
    cy.get('[role="alert"], .toast-error, .alert-danger').should('contain.text', /email/i);
  });

  it('redireciona exatamente para /dashboard após sucesso (vai falhar)', () => {
    cy.intercept('POST', REGISTER_GLOB, {
      statusCode: 201,
      body: { id: 1, email: 'user@example.com' },
    }).as('ok');

    $first().clear().type('Ada');
    $last().clear().type('Lovelace');
    $email().clear().type('user@example.com');
    $password().clear().type('Pass12345!');

    $submit().click();
    cy.wait('@ok');

    // teu app redireciona para /login; aqui exigimos /dashboard -> FALHA
    cy.location('pathname').should('eq', '/dashboard');
  });

  it('trim estrito do email (vai falhar se o payload vier com espaços)', () => {
    cy.intercept('POST', REGISTER_GLOB, (req) => {
      // exige e-mail sem espaços no payload -> FALHA se o front não trimar antes de enviar
      expect(req.body?.email).to.eq('user@example.com');
      req.reply({ statusCode: 201, body: { id: 1, email: 'user@example.com' } });
    }).as('strictTrim');

    $first().clear().type('Ada');
    $last().clear().type('Lovelace');
    $email().clear().type('  user@example.com  ');
    $password().clear().type('Pass12345!');

    $submit().click();
    cy.wait('@strictTrim');
  });

  it('duplo clique bloqueado: exatamente 1 request (vai falhar)', () => {
    let hits = 0;
    cy.intercept('POST', REGISTER_GLOB, (req) => {
      hits += 1;
      req.reply({ statusCode: 201, body: { id: 1, email: 'user@example.com' } });
    }).as('ok');

    $first().clear().type('Ada');
    $last().clear().type('Lovelace');
    $email().clear().type('user@example.com');
    $password().clear().type('Pass12345!');

    $submit().click().click(); // spam proposital
    cy.wait('@ok');

    // exige 1 request exatamente -> usualmente >1 -> FALHA
    cy.wrap(null).should(() => expect(hits).to.eq(1));
  });

  it('campo "confirm" deve existir e ser obrigatório (vai falhar)', () => {
    // teu formulário não tem "confirm" -> FALHA
    cy.get('input[name="confirm"], input[name="password2"], input[placeholder*="Confirm"]').should('exist');

    $first().clear().type('Ada');
    $last().clear().type('Lovelace');
    $email().clear().type('user@example.com');
    $password().clear().type('Pass12345!');
    $submit().click();

    cy.contains(/confirme|confirm|igual/i).should('exist');
  });

  it('erro 400 deve ter header Content-Type JSON (vai falhar)', () => {
    cy.intercept('POST', REGISTER_GLOB, (req) => {
      // responde SEM content-type propositalmente
      req.reply({ statusCode: 400, body: { email: ['Formato inválido'] }, headers: {} });
    }).as('noCT');

    $first().clear().type('Ada');
    $last().clear().type('Lovelace');
    $email().clear().type('invalido');
    $password().clear().type('Pass12345!');

    $submit().click();
    cy.wait('@noCT');

    // exige presence do header que NÃO foi enviado -> FALHA
    cy.get('@noCT').its('response.headers.content-type').should('include', 'application/json');
  });

  it('salva email registrado no localStorage (vai falhar)', () => {
    cy.intercept('POST', REGISTER_GLOB, {
      statusCode: 201,
      body: { id: 1, email: 'user@example.com' },
    }).as('ok');

    $first().clear().type('Ada');
    $last().clear().type('Lovelace');
    $email().clear().type('user@example.com');
    $password().clear().type('Pass12345!');

    $submit().click();
    cy.wait('@ok');

    // teu app não grava isso -> FALHA
    cy.window().then((win) => {
      expect(win.localStorage.getItem('registered_email')).to.eq('user@example.com');
    });
  });

  it('mostra medidor de força de senha (vai falhar)', () => {
    $password().clear().type('Pass12345!');
    // teu app não tem este elemento -> FALHA
    cy.get('[data-cy="password-strength"], .password-strength, [role="meter"]').should('be.visible');
  });
});

});