var editController = function (advert, tags, postcodes, $http) {
    // Data
    var vm = this;
    this.advert = advert;
    this.tags = tags;
    this.postcodes = postcodes;
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

    // Methods
    this.checkTag = checkTag;
    this.toggleTags = toggleTags;
    this.changeCategory = changeCategory;
    this.submit = submit;
    this.removeImg = removeImg;

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
        $http({
            method: 'GET',
            url: `/dashboard.php?function=submit&data=${JSON.stringify(vm.advert)}`
        }).then((response) => {
            vm.saved = 1;
        })
    }
}