var app = angular.module('detallesANApp', []);

app.controller('detallesANCtrl', function ($scope, $http) {

    $scope.anuncio = null;
    $scope.onlyEmpresa = false;
    $scope.accion = 'Solicitar';
                           $scope.myObj = {
                                color: "red",
                                'background-color': "coral",
		        border: '3 solid red'
                            };

$scope.onlyEmpresaWithOutCredits = false;



    if (null !== sessionStorage.getItem("anuncioSelecionado")){
        $scope.anuncioId = sessionStorage.getItem("anuncioSelecionado");

        alredyLogged(function(isLogged){
            if (isLogged){
                $scope.estoyLogeado = true;
                isEmpresa(function(empres, complet){
                    alReadyHaveSolicitud($scope.anuncioId, function(already){
                        if (already){
                            $scope.accion = 'Modificar Solicitud';
                            $scope.onlyEmpresa = true;
                            $scope.onlyEmpresaWithOutCredits = false;
                            $scope.$apply();
                        }
                    })
                    if (empres && 0 >= complet.credits){
		                $scope.onlyEmpresa = false;
		                $scope.onlyEmpresaWithOutCredits = true;
                        $scope.$apply();
                    } else {
                        $scope.onlyEmpresa = empres;
                        $scope.$apply();
                    }                    
                })
            }
        });
    }else {
        $(location).attr('href', './index.html', '_top');
    }

$scope.dontHaveCredits = function() {
alert('no tiene creditos');
}

    getAd($scope.anuncioId, function(data){
if (null !== data){
        $scope.anuncio = data.ad;
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        const dateAux = new Date($scope.anuncio.date);
        $scope.anuncio.date = dateAux.getDate() + " " + monthNames[(dateAux.getMonth() + 1)] + " "+ dateAux.getFullYear();
        $scope.anuncio.solicitudes = $scope.anuncio.solicitudes.length;
        $scope.$apply();
        setTimeout(function(){
            initMap($scope.anuncio.location.lat, $scope.anuncio.location.lng);
        },1000);
   } else {
 $(location).attr('href', './index.html', '_top');
}     
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
                        console.log(error);
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
        if (null !== data.Empresa)
            cb(true, data.Empresa);
        else 
            cb(false, null);
    })
    .fail(function(){
        cb(false, null);
    });
}

const alReadyHaveSolicitud = (anuncioId, cb) =>{
    $.get(direction+"Solicituds/getIfSolicitudIsMy?anuncioId="+anuncioId+"&access_token="+getCookieAccesToken())
    .then(function() {
        cb(true);
    })
    .fail(function(){
        cb(false);
    });
}