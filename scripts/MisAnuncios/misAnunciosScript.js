var app = angular.module('misAnunciosApp', []);


app.controller('misAnunciosCtrl', function ($scope, $http) {

    alredyLogged(function(isLogged){
        if (!isLogged)
        $(location).attr('href', './index.html', '_top');
    });

    $scope.misAnuncios = null;

    $http.get(direction+"Anuncios/getMyAds?access_token="+getCookieAccesToken())
    .then(function(response) {
        $scope.misAnuncios = response.data;

    });

    $scope.misSolicitudes = function (anuncioId) {

            sessionStorage.setItem('anuncioSolicitudes', anuncioId);
            $(location).attr('href', './Solicitudes.html', '_top');
    }
});