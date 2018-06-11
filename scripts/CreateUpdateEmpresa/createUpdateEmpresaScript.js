var app = angular.module('editProfilerApp', []);

app.controller('editProfilerCtrl', function ($scope, $http) {
    currentLocation();
    alredyLogged(function(isLogged){
        if (!isLogged)
            $(location).attr('href', './index.html', '_top');
        
    });
    $scope.cargando = true;
    $scope.action = 'Crear';
    $scope.empresa = {
        name: '',
        description: '',
        telephone: 0,
        logo: '',
        location: {
            lat: coord.coords.latitude,
            lng: coord.coords.longitude
        }
      };
    $http.get(direction+"Usuarios/getUser?access_token="+getCookieAccesToken())
    .then(function(response) {
        $scope.usuarioId = response.data.User.id;       
    });

    $http.get(direction+"Empresas/getCurrentLogedEmpresa?access_token="+getCookieAccesToken())
    .then(function(response) {

        if (null !== response.data.Empresa) {
            $scope.empresa = response.data.Empresa;
            $scope.empresa.location = {
                            lat: coord.coords.latitude,
                            lng: coord.coords.longitude
                        };
            $scope.empresa.profiler = null;
            $scope.action = 'Modificar';
            console.log($scope.empresa);
        }

        
            
    });
    
     

    $scope.guardaOcrea = function () {

        if ($scope.action === 'Modificar')
            $.ajax({
                type: 'PUT',
                url: direction+"Empresas?access_token="+getCookieAccesToken(),
                contentType: 'application/json',
                data: JSON.stringify($scope.empresa),
            }).done(function (data) {
                alert('mostrar que se ha Modificado bien');
            }).fail(function (msg) {
                console.log(msg);
            });
        else
            $.ajax({
                type: 'POST',
                url: direction+"Empresas?access_token="+getCookieAccesToken(),
                contentType: 'application/json',
                data: JSON.stringify($scope.empresa),
            }).done(function (data) {
                console.log('Creada');
                $scope.empresa = data;
                $scope.cargando = false;
                $scope.$apply();
                $(barraDeProgreso).css('width', '0%');
                $scope.subirIm.send();

            }).fail(function (msg) {
                console.log(msg);
            });


        
    }


    $scope.selecionada = function(t) {

        if ($scope.action === 'Modificar'){

            $scope.cargando = false;
            $scope.$apply();
            $(barraDeProgreso).css('width', '0%');

            const direction2 = direction+'containers/empresa'+$scope.empresa.id;
            up = new uploader(t, {
                url: direction2+'/upload',
                onprogress:function(ev){ 
                    var a = ((ev.loaded/ev.total)*100);
                    a = a+'%';
                    $(barraDeProgreso).css('width', a);
                },
                error:function(ev){ 
                    console.log('error'); 
                    $scope.cargando = true;
                    $scope.$apply();
                },
                success:function(data){ 
                    $scope.empresa.logo = direction2+'/download/'+t.files[0].name;
                    $scope.cargando = true;
                    $scope.$apply();
                }
            });

             up.send();
        }else {
            const direction2 = direction+'containers/empresa'+$scope.empresa.id;
            up = new uploader(t, {
                url: direction2+'/upload',
                onprogress:function(ev){ 
                    var a = ((ev.loaded/ev.total)*100);
                    a = a+'%';
                    $(barraDeProgreso).css('width', a);
                },
                error:function(ev){ 
                    console.log('error'); 
                    $scope.cargando = true;
                    $scope.$apply();
                },
                success:function(data){ 
                    $scope.empresa.logo = direction2+'/download/'+t.files[0].name;
                    $.ajax({
                        type: 'PUT',
                        url: direction+"Empresas?access_token="+getCookieAccesToken(),
                        contentType: 'application/json',
                        data: JSON.stringify($scope.empresa),
                    }).done(function (data) {
                        alert('mostrar que se ha creado bien');
                        $scope.cargando = true;
                        $scope.$apply();
                    }).fail(function (msg) {
                        console.log(msg);
                    });
                }
            });

            $scope.subirIm = up;
        }
     }
});
