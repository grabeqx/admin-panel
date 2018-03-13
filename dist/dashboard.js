'use strict';

var classfieldController = function classfieldController(adverts, $http) {
    // Data
    var vm = this;
    this.adverts = adverts;
    this.page = 0;
    this.step = 50;
    this.from = 50;
    this.ordering = {
        idAdvert: { hidden: 0, up: 0, down: 1 },
        Title: { hidden: 1, up: 0, down: 1 },
        DateCreated: { hidden: 1, up: 0, down: 1 },
        category: { hidden: 1, up: 0, down: 1 }
    };
    this.sorting = 'idAdvert';
    this.sortDirection = 'DESC';
    this.searchActive = false;
    // Methods
    this.getAdvert = getAdvert;
    this.goForward = goForward;
    this.goBack = goBack;
    this.order = order;
    this.search = search;
    this.reset = reset;

    function getAdvert(from, to, sorting, sortDierction) {
        document.querySelector('#loader').classList.remove('hide-loader');
        return $http({
            method: 'GET',
            url: '/dashboard.php?function=getAdverts&limitFrom=' + from + '&limitTo=' + to + '&sorting=' + sorting + '&sortDierction=' + sortDierction
        }).then(function (response) {
            document.querySelector('#loader').classList.add('hide-loader');
            vm.adverts = response.data;
        });
    }

    function goForward() {
        vm.page += 1;
        vm.from = vm.page * vm.step;
        vm.getAdvert(vm.from, vm.step, vm.sorting, vm.sortDirection);
    }

    function goBack() {
        if (vm.page <= 0) {
            vm.page = 0;
        } else {
            vm.page -= 1;
        }
        vm.from = vm.page * vm.step;
        vm.getAdvert(vm.from, vm.step, vm.sorting, vm.sortDirection);
    }

    function order(type) {
        if (!vm.searchActive) {
            for (var i in vm.ordering) {
                i === type ? vm.ordering[i].hidden = 0 : vm.ordering[i].hidden = 1;
            }
            vm.ordering[type].up = !vm.ordering[type].up;
            vm.ordering[type].down = !vm.ordering[type].down;
            vm.sorting = type;
            vm.sortDirection = vm.ordering[type].up ? 'ASC' : 'DESC';
            vm.getAdvert(0, vm.step, vm.sorting, vm.sortDirection);
        }
    }

    function search(value) {
        document.querySelector('#loader').classList.remove('hide-loader');
        $http({
            method: 'GET',
            url: '/dashboard.php?function=search&searchValue=' + encodeURIComponent(value)
        }).then(function (response) {
            document.querySelector('#loader').classList.add('hide-loader');
            vm.adverts = response.data;
            vm.searchActive = true;
        });
    }

    function reset() {
        vm.getAdvert(0, vm.step, vm.sorting, vm.sortDirection).then(function () {
            vm.searchActive = false;
            vm.searchval = '';
        });
    }
};
var editController = function editController(advert, tags, postcodes, $http) {
    // Data
    var vm = this;
    this.advert = advert;
    this.tags = tags;
    this.postcodes = postcodes;
    this.images = this.advert.UploadedFiles ? this.advert.UploadedFiles.split('*') : [];
    delete this.advert.ValueText;
    this.adTags = this.advert.Tags.split(',');
    this.categories = [{ id: 1, name: 'Kupię Sprzedam' }, { id: 2, name: 'Auto-Moto' }, { id: 3, name: 'Pokoje do wynajęcia' }, { id: 7, name: 'Domy / Mieszkania do wynajęcia' }, { id: 4, name: 'Praca' }, { id: 6, name: 'Usługi / Biznes' }, { id: 9, name: 'Społeczność / Polacy w UK' }, { id: 5, name: 'Towarzystwo / Randki, Przyjaźń' }];
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
            url: '/dashboard.php?function=getTags&category=' + id
        }).then(function (result) {
            vm.tags = result.data;
            vm.adTags = [];
            vm.advert.Tags = '';
        });
    }

    function removeImg(index) {
        vm.images.splice(index, 1);
        vm.advert.UploadedFiles = vm.images.join('*');
    }

    function submit() {
        $http({
            method: 'GET',
            url: '/dashboard.php?function=submit&data=' + JSON.stringify(vm.advert)
        }).then(function (response) {
            vm.saved = 1;
        });
    }
};
var dashboard = angular.module('dashboard', ['ui.router']).controller('mainController', ['$scope', function ($scope) {}]);

dashboard.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: 'ogloszenia',
        url: '/ogloszenia',
        template: '\n            <div class="search-container">\n                <form id="search" ng-submit="classfield.search(classfield.searchval)">\n                    <h3>Szukaj</h3>\n                    <label>Tytu\u0142</label>\n                    <input type="text" \n                        ng-model="classfield.searchval"\n                        placeholder="min. 3 znaki"\n                    >\n                    <input type="submit" value="Szukaj" ng-disabled="!(classfield.searchval.length >= 3)">\n                    <button ng-click="classfield.reset()">Reset</button>\n                </form>\n            </div>\n            <div class="pagination" ng-if="!classfield.searchActive">\n                <button ng-click="classfield.goBack()"><i class="fa fa-angle-left"></i>  Wstecz</button>\n                <button ng-click="classfield.goForward()">Dalej  <i class="fa fa-angle-right"></i></button>\n            </div>\n            <div class="advert">\n                <table>\n                    <thead>\n                        <tr>\n                            <th ng-click="classfield.order(\'idAdvert\')" class="clickable">Index <i class="order fa" ng-class="{\n                                \'fa-angle-down\': classfield.ordering.idAdvert.down,\n                                \'fa-angle-up\': classfield.ordering.idAdvert.up, \n                                \'hidden\': classfield.ordering.idAdvert.hidden}"\n                                ng-if="!classfield.searchActive"></i></th>\n                            <th ng-click="classfield.order(\'Title\')" class="clickable">Tytu\u0142 <i class="order fa" ng-class="{\n                                \'fa-angle-down\': classfield.ordering.Title.down,\n                                \'fa-angle-up\': classfield.ordering.Title.up, \n                                \'hidden\': classfield.ordering.Title.hidden}"\n                                ng-if="!classfield.searchActive"></i></th>\n                            <th ng-click="classfield.order(\'DateCreated\')" class="clickable">Data utworzenia <i class="order fa" ng-class="{\n                                \'fa-angle-down\': classfield.ordering.DateCreated.down,\n                                \'fa-angle-up\': classfield.ordering.DateCreated.up, \n                                \'hidden\': classfield.ordering.DateCreated.hidden}"\n                                ng-if="!classfield.searchActive"></i></th>\n                            <th>Kategoria</th>\n                            <th>Wyga\u015Bni\u0119te</th>\n                            <th>Promowanie do</th>\n                            <th>E-mail</th>\n                            <th>Has\u0142o</th>\n                            <th>IP adres</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr ng-repeat="advert in classfield.adverts" ng-class="{promo: advert.promo}" ui-sref="edit({id: advert.idAdvert})">\n                            <td>{{advert.idAdvert}}</td>\n                            <td class="ad-title">\n                                <img ng-if="advert.MainFile" ng-src="/img/list/{{advert.MainFile}}"/>\n                                {{advert.Title}}\n                            </td>\n                            <td>{{advert.DateCreated}}</td>\n                            <td>{{advert.category}}</td>\n                            <td>{{advert.expires == 1 ? \'Nie\' : \'Tak\'}}</td>\n                            <td>{{advert.promoDo}}</td>\n                            <td>{{advert.Email}}</td>\n                            <td>{{advert.adPassword}}</td>\n                            <td>{{advert.ip}}</td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n            <div class="pagination" ng-if="!classfield.searchActive">\n                <button ng-click="classfield.goBack()"><i class="fa fa-angle-left"></i>  Wstecz</button>\n                <button ng-click="classfield.goForward()">Dalej  <i class="fa fa-angle-right"></i></button>\n            </div>\n        ',
        controller: classfieldController,
        controllerAs: 'classfield',
        resolve: {
            adverts: function adverts($http) {
                document.querySelector('#loader').classList.remove('hide-loader');
                return $http({
                    method: 'GET',
                    url: '/dashboard.php?function=getAdverts&limitFrom=0&limitTo=50&sorting=idAdvert&sortDierction=DESC'
                }).then(function (result) {
                    document.querySelector('#loader').classList.add('hide-loader');
                    return result.data;
                });
            }
        }
    }).state({
        name: 'edit',
        url: '/edit/:id',
        template: '\n            <div id="advert-content">\n                <form id="advert-form" ng-submit="edit.submit()">\n                    <label>Tytu\u0142</label>\n                    <input type="text" ng-model="edit.advert.Title">\n                    <label>Data utworzenia</label>\n                    <input type="text" ng-model="edit.advert.DateCreated">\n                    <label>Cena</label>\n                    <input type="text" ng-model="edit.advert.Price">\n                    <label>Warto\u015B\u0107 Tagi</label>\n                    <input type="text" ng-model="edit.advert.ValueTags">\n                    <label>Imi\u0119</label>\n                    <input type="text" ng-model="edit.advert.Name">\n                    <label>Email</label>\n                    <input type="text" ng-model="edit.advert.Email">\n                    <label>Telefon stacjonarny</label>\n                    <input type="text" ng-model="edit.advert.Landline">\n                    <label>Telefon</label>\n                    <input type="text" ng-model="edit.advert.Mobile">\n                    <label>Kategoria</label>\n                    <select ng-model="edit.advert.idCategory" ng-selected="edit.advert.idCategory" ng-change="edit.changeCategory(edit.advert.idCategory)">\n                        <option value="{{cat.id}}" ng-repeat="cat in edit.categories">{{cat.name}}</option>\n                    </select>\n                    <label>Tagi</label>\n                    <div class="tags-container">\n                        <label ng-repeat="tag in edit.tags">\n                            <input type="checkbox" value="{{tag.idSubcategory}}" ng-click="edit.toggleTags(tag.idSubcategory)" ng-checked="edit.checkTag(tag.idSubcategory)">\n                            {{tag.Subcategory}}\n                        </label>\n                    </div>\n                    <label>CountrySlug</label>\n                    <input type="text" ng-model="edit.advert.CountrySlug">\n                    <label>Lokalizacja</label>\n                    <input type="text" ng-model="edit.advert.LocationIndex">\n                    <label>Kod pocztowy</label>\n                    <input type="text" ng-model="edit.advert.Postcode">\n                    <label>Firma</label>\n                    <input type="text" ng-model="edit.advert.company">\n                    <label>Promowanie do</label>\n                    <input type="text" ng-model="edit.advert.promoDo">\n                    <label>Opis</label>\n                    <textarea ng-model="edit.advert.Description"></textarea>\n                    <label ng-if="edit.advert.UploadedFiles">Zdj\u0119cia</label>\n                    <div class="image-container" ng-if="edit.advert.UploadedFiles">\n                        <div ng-repeat="image in edit.images track by $index" ng-if="image.length">\n                            <button ng-click="edit.removeImg($index)"><i class="fa fa-times-circle"></i></button>\n                            <img ng-src="/img/ad/{{image}}">\n                        </div>\n                    </div>\n                    <input type="submit" value="Zapisz">\n                    <p class="save-info" ng-class="{\'seved\': edit.saved}">Zapisano</p>\n                </form>\n            </div>\n        ',
        controller: editController,
        controllerAs: 'edit',
        resolve: {
            advert: function advert($http, $stateParams) {
                document.querySelector('#loader').classList.remove('hide-loader');
                return $http({
                    method: 'GET',
                    url: '/dashboard.php?function=getAdvert&advertId=' + $stateParams.id
                }).then(function (result) {
                    console.log(result.data);
                    return result.data[0];
                });
            },
            tags: function tags($http, advert) {
                return $http({
                    method: 'GET',
                    url: '/dashboard.php?function=getTags&category=' + advert.idCategory
                }).then(function (result) {
                    return result.data;
                });
            },
            postcodes: function postcodes($http, advert) {
                return $http({
                    method: 'GET',
                    url: '/dashboard.php?function=getPostcode'
                }).then(function (result) {
                    document.querySelector('#loader').classList.add('hide-loader');
                    return result.data;
                });
            }
        }
    }).state({
        name: 'dodaj',
        url: '/dodaj',
        template: '\n            <div>\n                <iframe id="dodaj-ogloszenie" src="http://www.felcia.co.uk/nowe-ogloszenie/kategoria-i-tagi.html"></iframe>\n            </div>\n        ',
        controller: function controller() {
            document.querySelector('#loader').classList.add('hide-loader');
        }
    });

    $urlRouterProvider.otherwise('/ogloszenia');
});