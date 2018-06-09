const direction = 'https://waja.ovh:3000/api/'; 
let coord = {
        coords: {
            latitude: 37.8354703,
            longitude: -0.7913131000000249
    }
};

const setCookie = (cname, cvalue, exdays = 2) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const createCookieAccesToken = (cvalue) => {
    const d = new Date();
    d.setTime(d.getTime() + (10*24*60*60*1000));
    const expires = "expires="+ d.toUTCString();
    document.cookie = "access_token=" + cvalue + ";" + expires + ";path=/";
}

const getCookieAccesToken = () => {
    const name = "access_token=";
    const decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const removeCookieAccesToken = () => {
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

const getCookie = (cname) => {
    //return sessionStorage.getItem(cname);
    const name = cname + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const removeFromSessionStorage = (cname) => {
    sessionStorage.removeItem(cname);
}

const logOut = (cb) => {

    $.post(direction+'Usuarios/logout?access_token='+getCookieAccesToken()).
    then(function(data) {
        removeCookieAccesToken();
        cb(true);
    }).fail(function(error){
        cb(false);
    });
}


const alredyLogged = (cb) => {

    if (null != getCookieAccesToken()){
        $.get(direction+'Usuarios/getUser', {
            access_token: getCookieAccesToken()
        }).then(function(data) {
            cb(true);
        }).fail(function(){
            cb(false);
            removeCookieAccesToken();
        });
    }else 
        cb(false);
}

const getCurrentUserLogged = (cb) => {

    if (is)
        $.get(direction+'Usuarios/getUser', {
            access_token: getCookieAccesToken()
        }).then(function(data) {
            cb(data.User);
        }).fail(function(){
            cb(null);
        });

}

const getMyAds = (cb) => {
    
        $.get(direction+'Usuarios/getMyAds', {
            access_token: getCookieAccesToken()
        }).then(function(data) {
            cb(data.Ads);
        }).fail(function(){
            cb(null);
        });
}

const currentLocation = () => {
    if (navigator.geolocation) {
        return navigator.geolocation.getCurrentPosition(setCoord);
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

const setCoord = (position) => {
    coord = position;
}


const insertAd = (title, presupMAX, materialsINC, coord, description, categoryId, cb) => {

    if (alredyLogged())
        $.post(direction+'Anuncios?access_token='+getFromSessionStorage('access_token'),
        {
            titulo: title,
            presupMAX: presupMAX,
            materialsINC: materialsINC,
            location: {
                lat: coord.coords.latitude,
                lng: coord.coords.longitude
            },
            categoriaId: categoryId,
            description: description
        }
        ).then(function() {
            cb(true);
         }).fail(function(){
             cb(false);
         });
}


function uploader(input, options) {
	var $this = this;

	// Default settings (mostly debug functions)
	this.settings = {
		prefix:'file',
		multiple:false,
		autoUpload:false,
		url:window.location.href,
		onprogress:function(ev){ console.log('onprogress'); console.log(ev); },
		error:function(msg){ console.log('error'); console.log(msg); },
		success:function(data){ console.log('success'); console.log(data); }
	};
	$.extend(this.settings, options);

	this.input = input;
	this.xhr = new XMLHttpRequest();

	this.send = function(){
		// Make sure there is at least one file selected
		if($this.input.files.length < 1) {
			if($this.settings.error) $this.settings.error('Must select a file to upload');
			return false;
		}
		// Don't allow multiple file uploads if not specified
		if($this.settings.multiple === false && $this.input.files.length > 1) {
			if($this.settings.error) $this.settings.error('Can only upload one file at a time');
			return false;
		}
		// Must determine whether to send one or all of the selected files
		if($this.settings.multiple) {
			$this.multiSend($this.input.files);
		}
		else {
			$this.singleSend($this.input.files[0]);
		}
	};

	// Prep a single file for upload
	this.singleSend = function(file){
		var data = new FormData();
		data.append(String($this.settings.prefix),file);
		$this.upload(data);
	};

	// Prepare all of the input files for upload
	this.multiSend = function(files){
		var data = new FormData();
		for(var i = 0; i < files.length; i++) data.append(String($this.settings.prefix)+String(i), files[i]);
		$this.upload(data);
	};

	// The actual upload calls
	this.upload = function(data){
		$this.xhr.open('POST',$this.settings.url, true);
		$this.xhr.send(data);
	};

	// Modify options after instantiation
	this.setOpt = function(opt, val){
		$this.settings[opt] = val;
		return $this;
	};
	this.getOpt = function(opt){
		return $this.settings[opt];
	};

	// Set the input element after instantiation
	this.setInput = function(elem){
		$this.input = elem;
		return $this;
	};
	this.getInput = function(){
		return $this.input;
	};

	// Basic setup for the XHR stuff
	if(this.settings.onprogress) this.xhr.upload.addEventListener('progress',this.settings.onprogress,false);
	this.xhr.onreadystatechange = function(ev){
		if($this.xhr.readyState == 4) {
			if($this.xhr.status == 200) {
				if($this.settings.success) $this.settings.success($this.xhr.responseText,ev);
				$this.input.value = '';
			}
			else {
				if($this.settings.error) $this.settings.error(ev);
			}
		}
	};

	// onChange event for autoUploads
	if(this.settings.autoUpload) this.input.onchange = this.send;
}