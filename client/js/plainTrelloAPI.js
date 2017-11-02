var authenticationSuccess = function() {
    console.log('Successful authentication');
    };

    var authenticationFailure = function() {
    console.log('Failed authentication');
    };

    window.Trello.authorize({
    type: 'popup',
    name: 'Getting Started Application',
    scope: {
        read: 'true',
        write: 'true' },
    expiration: 'never',
    success: authenticationSuccess,
    error: authenticationFailure
});