const direction2 = direction+'containers/anuncio'+sessionStorage.getItem("anuncioInsertado");

var app = angular.module('publishUpdateAd1App', []);

app.controller('publishUpdateAd1Ctrl', function ($scope, $http) {

    $scope.direction2 = direction2;
    $scope.categories = [];
    $scope.bread = [];
    $scope.bread.push(0);
    $scope.oldI = 0;
    $scope.currentCat = 'Toda las categorias';
    $scope.materialsINC = false;

    currentLocation();
    alredyLogged(function(isLogged){
        if (!isLogged)
        $(location).attr('href', './index.html', '_top');
    });

    $http.get(direction+"Categories/getByParentCategory?parentCategory=0")
    .then(function(response) {
        response.data.map(e => {
            $scope.categories.push({cat: e.name, val: e.id});
        });
    });


    carga();

    function carga () {
        $.ajax({
            url: direction2+'/files',  
            type: 'GET',
            success:function(data){
                $scope.files = data;
                $scope.$apply();
            }
        });
    }

  
      $scope.delete = function (index, id) {
        $.ajax({
            url: direction2+'/files/' + encodeURIComponent(id),  
            type: 'DELETE',
            success:function(data, status, headers){
                $scope.files.splice(index, 1);
                $scope.$apply();
                carga();
            }
        });
      };


    $scope.selecionada = function(t) {

       

       up = new uploader(t, {
            url: direction2+'/upload',
            progress:function(ev){ 
                console.log('progress'); 
                console.log(((ev.loaded/ev.total)*100)+'%'); 
            },
            error:function(ev){ 
                console.log('error'); 
            },
            success:function(data){ 
                data = JSON.parse(data);
                type = data.result.files.file[0].type;

                       $.ajax({
                        url: direction+'Multimedia',  
                        type: 'POST',
                        data: {
                            anuncioId: sessionStorage.getItem("anuncioInsertado"),
                            url: direction2+'/download/'+t.files[0].name,
                            type: type
                        },
                        success:function(data){
                            
                            console.log('insertada bien la foto');
                            carga();
                        }
                    });
                 
            }
        });

        up.send();


    }



    $scope.publicaAd = function() {

        $scope.anuncio.location = {
            lat: coord.coords.latitude,
            lng: coord.coords.longitude
          };
        $scope.anuncio.categoriaId = $scope.oldI;
        $scope.anuncio.materialsINC = $scope.materialsINC;

        insertOrUpdate('POST', $scope.anuncio, function(good){
            if (good){
                alert('insertado con exito');
                $(location).attr('href', './Publish Ad 2.html', '_top');
            }
            else
                alert('algo ha salido mal');
        });

    };


    $scope.back = function() {
        if ($scope.bread.length > 2){
            const cate = parseInt($scope.bread.shift());
            $scope.currentCat = $scope.categories.filter(function( obj ) {
                return obj.val == cate;
              });
              $scope.currentCat = $scope.currentCat[0].cat;
            $http.get(direction+"Categories/getByParentCategory?parentCategory="+cate)
            .then(function(response) {
                if (0 !== response.data.length) {
                    $scope.categories = [];
                    response.data.map(e => {
                        $scope.categories.push({cat: e.name, val: e.id});
                    });
                }
            });
        }else if ($scope.bread.length === 2){
            $scope.currentCat = 'Toda las categorias';
            $http.get(direction+"Categories/getByParentCategory?parentCategory=0")
            .then(function(response) {
                if (0 !== response.data.length) {
                    $scope.categories = [];
                    response.data.map(e => {
                        $scope.categories.push({cat: e.name, val: e.id});
                    });
                }
            });
        }
     }

    $scope.update = function() {
        if (null != $scope.item){
            $scope.currentCat = $scope.categories.filter(function( obj ) {
                return obj.val == $scope.item;
              });
              $scope.currentCat = $scope.currentCat[0].cat;
            $http.get(direction+"Categories/getByParentCategory?parentCategory="+parseInt($scope.item))
            .then(function(response) {
                
                if (0 !== response.data.length) {
                    $scope.bread.unshift($scope.oldI);
                    $scope.oldI = $scope.item;
                    $scope.categories = [];
                    response.data.map(e => {
                        $scope.categories.push({cat: e.name, val: e.id});
                    });
                }
            });
        }
     }
})

const insertOrUpdate = (actionType, data, cb) => {

    $.ajax({
        type: actionType,
        url: direction+"Anuncios?access_token="+getCookieAccesToken(),
        contentType: 'application/json',
        data: JSON.stringify(data),
    }).done(function (data) {
        sessionStorage.setItem("anuncioInsertado", data.id);
        cb(true);
    }).fail(function (msg) {
        cb(false);
    });
}