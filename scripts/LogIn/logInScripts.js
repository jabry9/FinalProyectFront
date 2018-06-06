alredyLogged(function(isLogged){
    if (isLogged)
        $(location).attr('href', './index.html', '_top');

});

var app = angular.module('logInApp', []);

app.config( function($httpProvider) {
	$httpProvider.defaults.headers.commonAccept = 'application/json, text/plain'
        $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }
    );
app.controller('logInCtrl', function ($scope, $http) {


    $scope.logIn = function () {
	//alert('uuu');
        logIn('a', 'a', function(correct){
            if (correct) {
                $(location).attr('href', './index.html', '_top');
            } else {
                alert('mostrar al usuario que algo ha salido mal a la hora de hacer un log in d');
            }
        });
    }

});

const logIn = (nameOrEmail = '', password = '', cb) => {
 $.post(direction+'Usuarios/login',
                {
                    username: nameOrEmail,
                    password: password
                }
                ).then(function(data) {
                    createCookieAccesToken(data.id, data.created, data.ttl);
                    cb(true);
                }).fail(function(xhr, status, error){
                    $.post(direction+'Usuarios/login',
                        {
                            email: nameOrEmail,
                            password: password
                        }
                        ).then(function(data) {
                            createCookieAccesToken(data.id, data.created, data.ttl);
                            cb(true);
                        }).fail(function(xhr, status, error){
                            cb(false);
                        });
                });
}