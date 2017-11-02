app.service('trelloAPI', function() {
    this.testService = function () {
        console.log("trelloAPI service loaded")
    }

    this.authenticationSuccess = function () {
        console.log('Successful authentication');
    };
    
    this.authenticationFailure = function () {
        console.log('Failed authentication');
    };
    
    this.authorize = function () {
        Trello.authorize({
            type: 'popup',
            name: 'Getting Started Application',
            scope: {
                read: 'true',
                write: 'true'
            },
            expiration: 'never',
            success: this.authenticationSuccess,
            error: this.authenticationFailure
        }); 
    }
});