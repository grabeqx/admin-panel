var editController = function (advert, tags, postcodes, $http, promoTypes, $state) {
    // Data
    var vm = this;
    this.advert = advert;
    this.tags = tags;
    this.postcodes = postcodes;
    this.promoTypes = promoTypes;
    this.images = this.advert.UploadedFiles ? this.advert.UploadedFiles.split('*'): [];
    delete(this.advert.ValueText);
    this.adTags = this.advert.Tags.split(',');
    this.categories = [
        {id: 1, name:'Kupię Sprzedam'},
        {id: 2, name: 'Auto-Moto'},
        {id: 3, name: 'Pokoje do wynajęcia'},
        {id: 7, name: 'Domy / Mieszkania do wynajęcia'},
        {id: 4, name: 'Praca'},
        {id: 6, name: 'Usługi / Biznes'},
        {id: 9, name: 'Społeczność / Polacy w UK'},
        {id: 5, name: 'Towarzystwo / Randki, Przyjaźń'}
    ];
    this.saved = 0;
    this.promoTyp = "";
    this.promoOd = "";
    this.promoDo = "";
    this.removeMessage = "";

    // Methods
    this.checkTag = checkTag;
    this.toggleTags = toggleTags;
    this.changeCategory = changeCategory;
    this.submit = submit;
    this.removeImg = removeImg;
    this.formatDate = formatDate;
    this.removePromo = removePromo;

    function formatDate(date) {
        var today = new Date(date),
            dd = today.getDate(),
            mm = today.getMonth()+1,
            yyyy = today.getFullYear(),
            hh = today.getHours(),
            min = today.getMinutes(),
            sec = today.getSeconds();

        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        }
        if(hh<10){
            hh='0'+hh;
        } 
        if(min<10){
            min='0'+min;
        } 
        if(sec<10){
            sec='0'+sec;
        } 

        return yyyy+'-'+mm+'-'+dd+' '+hh+':'+min+':'+sec;
    }

    function toggleTags(id) {
        var idx = vm.adTags.indexOf(id);

        if (idx > -1) {
            vm.adTags.splice(idx, 1);
        } else {
            vm.adTags.push(id);
        }
        vm.advert.Tags = vm.adTags.join(',');
    }

    function checkTag(tag) {
        return vm.adTags.indexOf(tag) != -1 ? true : false;
    }

    function changeCategory(id) {
        $http({
            method: 'GET',
            url: `/dashboard.php?function=getTags&category=${id}`
        }).then((result) => {
            vm.tags = result.data;
            vm.adTags = [];
            vm.advert.Tags = '';
        })
    }

    function removeImg(index) {
        vm.images.splice(index, 1);
        vm.advert.UploadedFiles = vm.images.join('*');
    }

    function submit() {
        var x = new Date(vm.promoDo);
        $http({
            method: 'GET',
            url: `/dashboard.php?function=submit&data=${JSON.stringify(vm.advert)}`
        }).then((response) => {
            if(vm.promoTyp != "") {
                vm.promoOd = new Date();
                vm.promoDo = new Date();
                vm.promoDo.setDate(vm.promoDo.getDate() + parseInt(vm.promoTyp));
                $http({
                    method: 'GET',
                    url: `/dashboard.php?function=makePromo&id=${vm.advert.idAdvert}&promoOd=${vm.formatDate(vm.promoOd)}&promoDo=${vm.formatDate(vm.promoDo)}&promoTyp=${vm.promoTyp}`
                })
            }
            vm.saved = 1;
            window.history.back();
        })
    }

    function removePromo() {
        $http({
            method: 'GET',
            url: `/dashboard.php?function=removePromo&id=${vm.advert.idAdvert}`
        }).then(() => {
            vm.removeMessage = "Promowanie wyłączone";
        })
    }
}