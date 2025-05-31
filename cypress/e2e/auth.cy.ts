describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should register a new user', () => {
    cy.visit('/register');
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="confirmPassword"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Should redirect to dashboard after successful registration
    cy.url().should('include', '/dashboard');
  });

  it('should login an existing user', () => {
    cy.login('test@example.com', 'password123');
    cy.url().should('include', '/dashboard');
  });

  it('should display validation errors for invalid login', () => {
    cy.visit('/login');
    cy.get('button[type="submit"]').click();
    cy.contains('Email не введён').should('be.visible');
    cy.contains('Введите Пароль').should('be.visible');
  });

  it('should logout user', () => {
    cy.login('test@example.com', 'password123');
    cy.contains('button', 'Выйти').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});