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
        console.log(response.data)
        /*response.data.map(e => {
            $scope.categories.push({cat: e.name, val: e.id});
        });*/
    });

});