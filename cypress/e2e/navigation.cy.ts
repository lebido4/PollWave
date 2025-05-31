describe('Navigation', () => {
  it('should navigate through main pages', () => {
    cy.visit('/');
    
    // Check home page content
    cy.contains('Голосуй на PollWave').should('be.visible');
    
    // Navigate to polls page
    cy.contains('Посмотреть всё').click();
    cy.url().should('include', '/polls');
    
    // Navigate to login
    cy.contains('Войти').click();
    cy.url().should('include', '/login');
    
    // Navigate to register
    cy.contains('Создать её').click();
    cy.url().should('include', '/register');
  });

  it('should handle 404 page', () => {
    cy.visit('/non-existent-page');
    cy.contains('404').should('be.visible');
    cy.contains('Страница не найдена').should('be.visible');
  });

  it('should protect routes for unauthorized users', () => {
    cy.visit('/create');
    cy.url().should('include', '/login');
    
    cy.visit('/dashboard');
    cy.url().should('include', '/login');
  });
});