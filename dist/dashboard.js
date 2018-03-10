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
var editController = function editController(advert, $http) {
    // Data
    var vm = this;
    this.advert = advert;
};
var dashboard = angular.module('dashboard', ['ui.router']).controller('mainController', ['$scope', function ($scope) {}]);

dashboard.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: 'ogloszenia',
        url: '/ogloszenia',
        template: '\n            <div class="search-container">\n                <form id="search" ng-submit="classfield.search(classfield.searchval)">\n                    <h3>Szukaj</h3>\n                    <label>Tytu\u0142</label>\n                    <input type="text" \n                        ng-model="classfield.searchval"\n                        placeholder="min. 3 znaki"\n                    >\n                    <input type="submit" value="Szukaj" ng-disabled="!(classfield.searchval.length >= 3)">\n                    <button ng-click="classfield.reset()">Reset</button>\n                </form>\n            </div>\n            <div class="pagination" ng-if="!classfield.searchActive">\n                <button ng-click="classfield.goBack()"><i class="fa fa-angle-left"></i>  Wstecz</button>\n                <button ng-click="classfield.goForward()">Dalej  <i class="fa fa-angle-right"></i></button>\n            </div>\n            <div class="advert">\n                <table>\n                    <thead>\n                        <tr>\n                            <th ng-click="classfield.order(\'idAdvert\')" class="clickable">Index <i class="order fa" ng-class="{\n                                \'fa-angle-down\': classfield.ordering.idAdvert.down,\n                                \'fa-angle-up\': classfield.ordering.idAdvert.up, \n                                \'hidden\': classfield.ordering.idAdvert.hidden}"\n                                ng-if="!classfield.searchActive"></i></th>\n                            <th ng-click="classfield.order(\'Title\')" class="clickable">Tytu\u0142 <i class="order fa" ng-class="{\n                                \'fa-angle-down\': classfield.ordering.Title.down,\n                                \'fa-angle-up\': classfield.ordering.Title.up, \n                                \'hidden\': classfield.ordering.Title.hidden}"\n                                ng-if="!classfield.searchActive"></i></th>\n                            <th ng-click="classfield.order(\'DateCreated\')" class="clickable">Data utworzenia <i class="order fa" ng-class="{\n                                \'fa-angle-down\': classfield.ordering.DateCreated.down,\n                                \'fa-angle-up\': classfield.ordering.DateCreated.up, \n                                \'hidden\': classfield.ordering.DateCreated.hidden}"\n                                ng-if="!classfield.searchActive"></i></th>\n                            <th ng-click="classfield.order(\'category\')" class="clickable">Kategoria <i class="order fa" ng-class="{\n                                \'fa-angle-down\': classfield.ordering.category.down,\n                                \'fa-angle-up\': classfield.ordering.category.up, \n                                \'hidden\': classfield.ordering.category.hidden}"\n                                ng-if="!classfield.searchActive"></i></th>\n                            <th>Wyga\u015Bni\u0119te</th>\n                            <th>Promowanie do</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr ng-repeat="advert in classfield.adverts" ng-class="{promo: advert.promo}" ui-sref="edit({id: advert.idAdvert})">\n                            <td>{{advert.idAdvert}}</td>\n                            <td class="ad-title">\n                                <img ng-if="advert.MainFile" ng-src="/img/list/{{advert.MainFile}}"/>\n                                {{advert.Title}}\n                            </td>\n                            <td>{{advert.DateCreated}}</td>\n                            <td>{{advert.category}}</td>\n                            <td>{{advert.expires == 1 ? \'Nie\' : \'Tak\'}}</td>\n                            <td>{{advert.promoDo}}</td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n            <div class="pagination" ng-if="!classfield.searchActive">\n                <button ng-click="classfield.goBack()"><i class="fa fa-angle-left"></i>  Wstecz</button>\n                <button ng-click="classfield.goForward()">Dalej  <i class="fa fa-angle-right"></i></button>\n            </div>\n        ',
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
        template: '\n            <div id="advert-content">\n                <form id="advert-form">\n                    <label>Tytu\u0142</label>\n                    <input type="text" ng-model="edit.advert.Title">\n                    <label>Cena</label>\n                    <input type="text" ng-model="edit.advert.Price">\n                    <label>Cena text</label>\n                    <input type="text" ng-model="edit.advert.ValueText">\n                    <label>Imi\u0119</label>\n                    <input type="text" ng-model="edit.advert.Name">\n                    <label>Email</label>\n                    <input type="text" ng-model="edit.advert.Email">\n                    <label>Lokalizacja</label>\n                    <input type="text" ng-model="edit.advert.LocationIndex">\n                    <label>Kod pocztowy</label>\n                    <input type="text" ng-model="edit.advert.Postcode">\n                    <label>Telefon</label>\n                    <input type="text" ng-model="edit.advert.Mobile">\n                    <label>Tagi</label>\n                    <input type="text" ng-model="edit.advert.Tags">\n                    <label>Kategoria</label>\n                    <input type="text" ng-model="edit.advert.category">\n                    <label>Firma</label>\n                    <input type="text" ng-model="edit.advert.company">\n                    <label>Promowanie do</label>\n                    <input type="text" ng-model="edit.advert.promoDo">\n                    <label>Opis</label>\n                    <textarea ng-model="edit.advert.Description"></textarea>\n                    <input type="submit" value="Zapisz">\n                </form>\n            </div>\n        ',
        controller: editController,
        controllerAs: 'edit',
        resolve: {
            advert: function advert($http, $stateParams) {
                document.querySelector('#loader').classList.remove('hide-loader');
                return $http({
                    method: 'GET',
                    url: '/dashboard.php?function=getAdvert&advertId=' + $stateParams.id
                }).then(function (result) {
                    document.querySelector('#loader').classList.add('hide-loader');
                    return result.data[0];
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