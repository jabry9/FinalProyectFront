var app = angular.module('publishSolicitudApp', []);

app.controller('publishSolicitudCtrl', function ($scope, $http) {

    $scope.accion = 'Proponer Presupuesto';
    $scope.accionType = 'POST';
    $scope.data = {
        presupuestoMAX: 0,
        description: '',
        access_token: getCookieAccesToken()
    };

    if (null !== sessionStorage.getItem("anuncioSelecionado")){
        $scope.anuncioId = sessionStorage.getItem("anuncioSelecionado");

        alredyLogged(function(isLogged){
            if (isLogged){
                alReadyHaveSolicitud($scope.anuncioId, function(already){
                    if (already){
                        $scope.accion = 'Modificar Presupuesto';
                        $scope.accionType = 'PUT';
                        $scope.$apply();
                    }
                })
            }else{
                $(location).attr('href', './index.html', '_top');
            }
        });
    }else {
        $(location).attr('href', './index.html', '_top');
    }

    $scope.proponer = function() {
        insertOrUpdate($scope.accionType, $scope.data, function(good){
            if (good) {
                alert('mostrar que se ha creado correcto');
                $(location).attr('href', './index.html', '_top');
            }else {
                alert('mostrar que algo ha fallado');
            }
            
        })
    };

});

const alReadyHaveSolicitud = (anuncioId, cb) =>{
    $.get(direction+"Solicituds/getIfSolicitudIsMy?anuncioId="+anuncioId+"&access_token="+getCookieAccesToken())
    .then(function() {
        cb(true);
    })
    .fail(function(){
        cb(false);
    });
}

const insertOrUpdate = (actionType, data, cb) => {

    $.ajax({
        type: actionType,
        url: direction+"Solicituds",
        contentType: 'application/json',
        data: JSON.stringify(data),
    }).done(function () {
        cb(true);
    }).fail(function (msg) {
        cb(false);
    });
}