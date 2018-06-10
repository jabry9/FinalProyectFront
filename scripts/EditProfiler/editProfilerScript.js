var app = angular.module('editProfilerApp', []);

app.controller('editProfilerCtrl', function ($scope, $http) {

    alredyLogged(function(isLogged){
        if (!isLogged)
            $(location).attr('href', './index.html', '_top');
        
    });

    $scope.action = {
        name: 'Crear Empresa',
        color: 'blue'
    };

    $http.get(direction+"Usuarios/getUser?access_token="+getCookieAccesToken())
    .then(function(response) {
        $scope.usuario = response.data.User;       
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
            url: direction+"Usuarios/changeUser?name="+$scope.usuario.name+"&telephone="+$scope.usuario.telephone+"&photo="+$scope.usuario.photo+"&access_token="+getCookieAccesToken(),
            contentType: 'application/json',
        }).done(function (data) {
            console.log(true);
        }).fail(function (msg) {
            console.log(msg);
        });


        
    }

    $scope.selecionada = function(t) {

        const direction2 = direction+'containers/usuario'+$scope.usuario.id;

        up = new uploader(t, {
             url: direction2+'/upload',
             progress:function(ev){ 
                 //console.log('progress'); 
                 //console.log(((ev.loaded/ev.total)*100)+'%'); 
             },
             error:function(ev){ 
                 console.log('error'); 
             },
             success:function(data){ 
                $scope.usuario.photo =direction2+'/download/'+t.files[0].name;
             }
         });
 
         up.send();
 
 
     }
});
