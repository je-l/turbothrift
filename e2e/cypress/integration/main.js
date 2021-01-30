it('should show login page if not logged in', () => {
  cy.visit('http://localhost:8080');
  cy.contains('Turbothrift is a tool for advanced');
  cy.get('button:contains("Sign in with Google")');
  cy.injectAxe();
  cy.checkA11y();
})
