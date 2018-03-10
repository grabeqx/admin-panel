var classfieldController = function (adverts, $http) {
    // Data
    var vm = this;
    this.adverts = adverts;
    // Methods
    this.getAdvert = getAdvert;
    this.test = test;

    function getAdvert() {
        $http({
            method: 'GET',
            url: `/dashboard.php?function=getAdvert&limitFrom=0&limitTo=120`
        })
    }
}