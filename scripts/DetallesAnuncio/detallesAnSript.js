var app = angular.module('detallesANApp', []);

app.controller('detallesANCtrl', function ($scope, $http) {

    $scope.anuncio = null;
    $scope.onlyEmpresa = false;
    
    alredyLogged(function(isLogged){
        if (isLogged){
            $scope.estoyLogeado = true;
            isEmpresa(function(empres){
                $scope.onlyEmpresa = empres;
	$scope.$apply();
            })
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


        getAd($scope.anuncioId, function(data){
                    $scope.anuncio = data.ad;
                    const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                    ];
                    const dateAux = new Date($scope.anuncio.date);
                    $scope.anuncio.date = dateAux.getDate() + " " + monthNames[(dateAux.getMonth() + 1)] + " "+ dateAux.getFullYear();
                    $scope.anuncio.solicitudes = $scope.anuncio.solicitudes.length;
                    $scope.$apply();
                    initMap($scope.anuncio.location.lat, $scope.anuncio.location.lng);
        });
    

});

const getAd = (id, cb) => {
    $.get(direction+"Anuncios/getAd",
                   {
                        ads: id
                   }
                   ).then(function(data) {
                       cb(data);
                   }).fail(function(xhr, status, error){
                        cb(null);
                   });
   }




function initMap(Olat, Olng) {
  var posicion = new google.maps.LatLng(Olat, Olng);

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

const isEmpresa = (cb) =>{
    $.get(direction+"Empresas/getCurrentLogedEmpresa?access_token="+getCookieAccesToken())
    .then(function(data) {
 console.log(data);
        if (null !== data.Empresa)
            cb(true);
        else 
            cb(false);
    })
    .fail(function(){
        cb(false);
    });
}