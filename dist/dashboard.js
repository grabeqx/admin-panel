'use strict';

var classfieldController = function classfieldController(adverts, $http) {
    // Data
    var vm = this;
    this.adverts = adverts;
    // Methods
    this.getAdvert = getAdvert;
    this.test = test;

    function getAdvert(from, to) {
        $http({
            method: 'GET',
            url: '/dashboard.php?function=getAdvert&limitFrom=' + from + '&limitTo=' + to
        }).then(function (result) {
            console.log(result.data);
            vm.lazyTo += 30;
        });
    }

    function test() {
        console.log('test');
    }
};
var dashboard = angular.module('dashboard', ['ui.router']);

dashboard.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: 'ogloszenia',
        url: '/ogloszenia',
        template: '\n            <div class="advert">\n            <div>\n                <table>\n                    <thead>\n                        <tr>\n                            <th>Index</th>\n                            <th>Tytu\u0142</th>\n                            <th>Data utworzenia</th>\n                            <th>Wyga\u015Bni\u0119te</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr ng-repeat="advert in classfield.adverts">\n                            <td>{{advert.idAdvert}}</td>\n                            <td>{{advert.Title}}</td>\n                            <td>{{advert.DateCreated}}</td>\n                            <td>{{advert.expires}}</td>\n                        </tr>\n                    </tbody>\n                </table>\n                </div>\n            </div>\n        ',
        controller: classfieldController,
        controllerAs: 'classfield',
        resolve: {
            adverts: function adverts($http) {
                return $http({
                    method: 'GET',
                    url: '/dashboard.php?function=getAdvert&limitFrom=0&limitTo=150'
                }).then(function (result) {
                    console.log(result.data);
                    return result.data;
                });
            }
        }
    });

    $urlRouterProvider.otherwise('/ogloszenia');
});