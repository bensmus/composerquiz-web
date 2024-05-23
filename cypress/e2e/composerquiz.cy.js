describe('Composerquiz spec', () => {
    it('Should load and reload properly', () => {
        // Initial load: failed spotify search request, api token request, successful spotify search request.
        cy.visit('http://composerquiz.surge.sh/')
        cy.get('#choice-buttons button').each($btn => {
            cy.wrap($btn).should('have.text', 'Loading...')
        })
        cy.get('#audio').should('not.have.attr', 'src')
        cy.intercept('GET', '**/refreshSpotifyAuthToken').as('getSpotifyToken');
        cy.intercept('GET', 'https://api.spotify.com/v1/search**').as('getSpotifySearch');
        cy.wait('@getSpotifySearch'); // First should fail.
        cy.wait('@getSpotifyToken');
        cy.wait('@getSpotifySearch'); // Second with new token should succeed.
        cy.get('#choice-buttons button').each($btn => {
            cy.wrap($btn).should('not.have.text', 'Loading...')
        })
        cy.get('#audio').should('have.attr', 'src')

        // Clicking check button without selecting an option does nothing.
        cy.get('#check-button').should('have.text', 'Check')
        cy.get('#check-button').click()
        cy.get('#check-button').should('have.text', 'Check')

        // Select the first choice button and click it.
        cy.get('#choice-buttons button').eq(0).click()

        // Clicking check button should now make it say 'Next'.
        cy.get('#check-button').should('have.text', 'Check')
        cy.get('#check-button').click()
        cy.get('#check-button').should('not.have.text', 'Check')
        cy.get('#check-button').should('have.text', 'Next')

        // Should successfully fetch new spotify data after clicking next.
        cy.get('#check-button').click()
        cy.wait('@getSpotifySearch'); 
        cy.get('#check-button').should('have.text', 'Check')
    });
});
