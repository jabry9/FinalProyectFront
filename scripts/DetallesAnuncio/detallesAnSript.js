var app = angular.module('detallesANApp', []);

app.controller('detallesANCtrl', function ($scope, $http) {


    alredyLogged(function(isLogged){
        if (isLogged){
            $scope.estoyLogeado = true;
            $scope.noEstoyLogeado = !$scope.estoyLogeado;
            $scope.$apply();
        }else{
            $scope.estoyLogeado = false;
            $scope.noEstoyLogeado = !$scope.estoyLogeado;
            $scope.$apply();
        }
        
    });

    if (null !== sessionStorage.getItem("anuncioSelecionado")){
        $scope.anuncioId = sessionStorage.getItem("anuncioSelecionado");
    }else {
        $(location).attr('href', './index.html', '_top');
    }

    $http.get(direction+"Anuncios/getAd?ads="+$scope.anuncioId)
        .then(function(response) {
            initMap();
            console.log(response.data);
        });

});





function initMap() {
  var posicion = new google.maps.LatLng(-34.397, 150.644);

  var mapCanvas = document.getElementById("map");
  var mapOptions = {
      center: posicion,
      zoom: 12,
      disableDefaultUI: true
  };
  var map = new google.maps.Map(mapCanvas, mapOptions);

  var myCity = new google.maps.Circle({
      center: posicion,
      radius: 500,
      strokeColor: "#e50b0b",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#e50b0b",
      fillOpacity: 0.4
  });
  myCity.setMap(map);
  
}