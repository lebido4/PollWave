// Custom commands for Cypress tests

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('createPoll', (title: string, description: string, options: string[]) => {
  cy.visit('/create');
  cy.get('input[id="title"]').type(title);
  cy.get('textarea[id="Описание"]').type(description);
  
  options.forEach((option, index) => {
    if (index >= 2) {
      cy.contains('button', 'Добавить выбор').click();
    }
    cy.get('.optionsContainer input').eq(index).type(option);
  });

  // Set end date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const formattedDate = tomorrow.toISOString().slice(0, 16);
  cy.get('input[type="datetime-local"]').type(formattedDate);

  cy.contains('button', 'Создать').click();
});