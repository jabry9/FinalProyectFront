var app = angular.module('editProfilerApp', []);

app.controller('editProfilerCtrl', function ($scope, $http) {
    
    alredyLogged(function(isLogged){
        if (!isLogged)
            $(location).attr('href', './index.html', '_top');
        
    });
    $scope.cargando = true;
    $scope.action = {
        name: 'Crear Empresa',
        color: 'blue'
    };

    $http.get(direction+"Usuarios/getUser?access_token="+getCookieAccesToken())
    .then(function(response) {
        $scope.usuario = response.data.User; 
        console.log($scope.usuario.photo);      
    });

    $http.get(direction+"Empresas/getCurrentLogedEmpresa?access_token="+getCookieAccesToken())
    .then(function(response) {

        if (null !== response.data.Empresa)
            $scope.action = {
                name: 'Modificar Empresa',
                color: 'green'
            }; 
        
            
    });
    
     

    $scope.guardaUser = function () {
        console.log($scope.usuario);

        $.ajax({
            type: 'PUT',
            url: direction+"Usuarios/changeUser?access_token="+getCookieAccesToken(),
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify($scope.usuario),
        }).done(function (data) {
            alert('mostrar que se ha Modificado bien');
        }).fail(function (msg) {
            alert('algo ha fallado');
        });
        
    }

    $scope.selecionada = function(t) {
        
        $scope.cargando = false;
        $scope.$apply();
        $(barraDeProgreso).css('width', '0%');

        const direction2 = direction+'containers/usuario'+$scope.usuario.id;

        up = new uploader(t, {
             url: direction2+'/upload',
             onprogress:function(ev){ 
                var a = ((ev.loaded/ev.total)*100);
                a = a+'%';
                $(barraDeProgreso).css('width', a);
            },
             error:function(ev){ 
                $scope.cargando = true;
                $scope.$apply();
                 console.log('error'); 
             },
             success:function(data){ 
                $scope.usuario.photo = direction2+'/download/'+t.files[0].name;
                $scope.cargando = true;
                $scope.$apply();
             }
         });
 
         up.send();
 
 
     }
});
