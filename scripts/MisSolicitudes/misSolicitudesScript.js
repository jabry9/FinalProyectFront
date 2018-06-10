var app = angular.module('misSolicitudesApp', []);


app.controller('misSolicitudesCtrl', function ($scope, $http) {

    alredyLogged(function(isLogged){
        if (!isLogged)
        $(location).attr('href', './index.html', '_top');
    });

    $scope.misSolicitudes = null;

    $http.get(direction+"Solicituds/getSolicitudWithEmpresa?anuncioId="+sessionStorage.getItem('anuncioSolicitudes'))
    .then(function(response) {
        $scope.misSolicitudes = response.data;
    });
});