'use strict';

var classfieldController = function classfieldController($http, $state, $stateParams, categories) {
    // Data
    var vm = this;
    this.adverts = [];
    this.searchType = $stateParams.searchType;
    this.page = parseInt($stateParams.page, 10);
    this.selectStep = $stateParams.step;
    this.step = parseInt(vm.selectStep);
    this.from = vm.page * vm.step;
    this.ordering = {
        idAdvert: { hidden: 1, up: $stateParams.direction === 'DESC' ? 1 : 0, down: $stateParams.direction === 'DESC' ? 0 : 1 },
        Title: { hidden: 1, up: $stateParams.direction === 'DESC' ? 1 : 0, down: $stateParams.direction === 'DESC' ? 0 : 1 },
        DateCreated: { hidden: 1, up: $stateParams.direction === 'DESC' ? 1 : 0, down: $stateParams.direction === 'DESC' ? 0 : 1 },
        category: { hidden: 1, up: $stateParams.direction === 'DESC' ? 1 : 0, down: $stateParams.direction === 'DESC' ? 0 : 1 }
    };
    this.sorting = $stateParams.sorting;
    this.sortDirection = $stateParams.direction;
    this.ordering[$stateParams.sorting].hidden = 0;
    this.searchActive = false;
    this.idCategory = $stateParams.idCategory;
    this.city = $stateParams.city;
    this.categories = categories;
    this.searchval = $stateParams.search;
    this.promoOd = '';
    this.promoDo = '';
    // Methods
    this.getAdvert = getAdvert;
    this.goForward = goForward;
    this.goBack = goBack;
    this.order = order;
    this.search = search;
    this.reset = reset;
    this.remove = remove;
    this.selectAll = selectAll;
    this.strip = strip;
    this.changeStep = changeStep;
    this.getPromoValue = getPromoValue;
    this.sumAllPices = sumAllPices;
    this.getPromoSumValue = getPromoSumValue;

    _Init();

    function _Init() {
        vm.getAdvert(vm.from, vm.step, vm.sorting, vm.sortDirection, false, vm.searchval, vm.searchType, vm.idCategory, vm.city);
    }

    function strip(html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    function getAdvert(from, to, sorting, sortDierction, pagination, value, type, cetegory, city) {
        document.querySelector('#loader').classList.remove('hide-loader');
        return $http({
            method: 'GET',
            url: '/dashboard.php?function=getAdverts&limitFrom=' + from + '&limitTo=' + to + '&sorting=' + sorting + '&sortDierction=' + sortDierction + '&searchValue=' + encodeURIComponent(value) + '&type=' + type + '&category=' + cetegory + '&city=' + city
        }).then(function (response) {
            document.querySelector('#loader').classList.add('hide-loader');
            vm.adverts = response.data;
            vm.sumAllPices(response.data);
            $state.go('.', { page: vm.page, search: value, searchType: type, idCategory: cetegory, city: city, direction: vm.sortDirection, sorting: sorting });
        });
    }

    function goForward() {
        vm.page += 1;
        vm.from = vm.page * vm.step;
        vm.getAdvert(vm.from, vm.step, vm.sorting, vm.sortDirection, true, vm.searchval, vm.searchType, vm.idCategory, vm.city);
    }

    function goBack() {
        if (vm.page <= 0) {
            vm.page = 0;
        } else {
            vm.page -= 1;
        }
        vm.from = vm.page * vm.step;
        vm.getAdvert(vm.from, vm.step, vm.sorting, vm.sortDirection, true, vm.searchval, vm.searchType, vm.idCategory, vm.city);
    }

    function order(type) {
        if (!vm.searchActive) {
            for (var i in vm.ordering) {
                i === type ? vm.ordering[i].hidden = 0 : vm.ordering[i].hidden = 1;
            }
            vm.sorting = type;
            vm.sortDirection = vm.ordering[type].up ? 'ASC' : 'DESC';
            vm.getAdvert(vm.from, vm.step, vm.sorting, vm.sortDirection, false, vm.searchval, vm.searchType, vm.idCategory, vm.city);
        }
    }

    function search(value, type, category, city, limitFrom, limitTo) {
        vm.searchval = value;
        vm.searchType = type;
        vm.idCategory = category;
        vm.city = city;
        vm.page = 0;
        vm.getAdvert(vm.from, vm.step, vm.sorting, vm.sortDirection, false, vm.searchval, vm.searchType, vm.idCategory, vm.city);
    }

    function reset() {
        vm.getAdvert(0, vm.step, vm.sorting, vm.sortDirection).then(function () {
            vm.searchActive = false;
            vm.searchval = '';
        });
    }

    function remove() {
        var adToRemove = [];
        for (var i in vm.adverts) {
            if (vm.adverts[i].delete) {
                adToRemove.push(vm.adverts[i].idAdvert);
            }
        }
        document.querySelector('#loader').classList.remove('hide-loader');
        $http({
            method: 'GET',
            url: '/dashboard.php?function=remove&adToRemove=' + adToRemove
        }).then(function () {
            $state.reload();
            document.querySelector('#loader').classList.add('hide-loader');
        });
    }

    function selectAll(select) {
        if (select) {
            for (var i in vm.adverts) {
                vm.adverts[i].delete = true;
            }
        } else {
            for (var i in vm.adverts) {
                vm.adverts[i].delete = false;
            }
        }
    }

    function changeStep(step) {
        $state.go('.', { step: step }, { notify: false });
    }

    function getPromoValue(dateCreated, PromoDate) {
        if (PromoDate == null) {
            return "Za darmo";
        };
        var oneDay = 24 * 60 * 60 * 1000;
        var firstDate = new Date(PromoDate);
        var secondDate = new Date(dateCreated);
        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
        if (diffDays <= 7) {
            return "15.00£";
        } else if (diffDays > 7 && diffDays <= 14) {
            return "25.00£";
        } else if (diffDays > 14 && diffDays <= 30) {
            return "35.00£";
        } else if (diffDays > 30 && diffDays <= 60) {
            return "55.00£";
        } else if (diffDays > 60 && diffDays <= 90) {
            return "85.00£";
        } else if (diffDays > 90) {
            return "Brak wartości";
        }
    }

    function sumAllPices(adverts) {
        var oneDay = 24 * 60 * 60 * 1000;
        var price = 0;
        adverts.map(function (advert) {
            if (advert.promoDo !== null) {
                var firstDate = new Date(advert.promoDo);
                var secondDate = new Date(advert.DateCreated);
                var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
                window.sumOfPromoValues = vm.sumOfPromoValues;
                if (diffDays <= 7) {
                    price += 15;
                } else if (diffDays > 7 && diffDays <= 14) {
                    price += 25;
                } else if (diffDays > 14 && diffDays <= 30) {
                    price += 35;
                } else if (diffDays > 30 && diffDays <= 60) {
                    price += 55;
                } else if (diffDays > 60 && diffDays <= 90) {
                    price += 85;
                } else if (diffDays > 90) {
                    price += 0;
                }
            };
        });
        vm.sumOfPromoValues = price + '.00£';
    }

    function formatDate(date) {
        var today = new Date(date),
            dd = today.getDate(),
            mm = today.getMonth() + 1,
            yyyy = today.getFullYear(),
            hh = today.getHours(),
            min = today.getMinutes(),
            sec = today.getSeconds();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        return yyyy + '-' + mm + '-' + dd;
    }

    function getPromoSumValue() {
        if (!vm.promoOd || !vm.promoDo) {
            return;
        }
        $http({
            method: 'GET',
            url: '/dashboard.php?function=getPromo&promoOd=' + formatDate(vm.promoOd) + '&promoDo=' + formatDate(vm.promoDo)
        }).then(function (response) {
            var price = 0;
            var oneDay = 24 * 60 * 60 * 1000;
            response.data.map(function (advert) {
                var firstDate = new Date(advert.PromoDo);
                var secondDate = new Date(advert.PromoOd);
                var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / oneDay));
                if (diffDays <= 7) {
                    price += 15;
                } else if (diffDays > 7 && diffDays <= 14) {
                    price += 25;
                } else if (diffDays > 14 && diffDays <= 30) {
                    price += 35;
                } else if (diffDays > 30 && diffDays <= 60) {
                    price += 55;
                } else if (diffDays > 60 && diffDays <= 90) {
                    price += 85;
                } else if (diffDays > 90) {
                    price += 0;
                }
            });
            vm.promoValue = price + '.00£';
        });
    }
};
var editController = function editController(advert, tags, postcodes, $http, promoTypes, $state, fileUpload) {
    // Data
    var vm = this;
    this.advert = advert;
    this.tags = tags;
    this.postcodes = postcodes;
    this.promoTypes = promoTypes;
    this.images = this.advert.UploadedFiles ? this.advert.UploadedFiles.split('*') : [];
    delete this.advert.ValueText;
    this.adTags = this.advert.Tags.split(',');
    this.categories = [{ id: 1, name: 'Kupię Sprzedam' }, { id: 2, name: 'Auto-Moto' }, { id: 3, name: 'Pokoje do wynajęcia' }, { id: 7, name: 'Domy / Mieszkania do wynajęcia' }, { id: 4, name: 'Praca' }, { id: 6, name: 'Usługi / Biznes' }, { id: 9, name: 'Społeczność / Polacy w UK' }, { id: 5, name: 'Towarzystwo / Randki, Przyjaźń' }];
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
    this.addNewImage = addNewImage;

    function formatDate(date) {
        var today = new Date(date),
            dd = today.getDate(),
            mm = today.getMonth() + 1,
            yyyy = today.getFullYear(),
            hh = today.getHours(),
            min = today.getMinutes(),
            sec = today.getSeconds();

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        if (hh < 10) {
            hh = '0' + hh;
        }
        if (min < 10) {
            min = '0' + min;
        }
        if (sec < 10) {
            sec = '0' + sec;
        }

        return yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min + ':' + sec;
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
        var x = new Date(vm.promoDo);
        vm.advert['Mobile'] = encodeURIComponent(vm.advert['Mobile']);
        var desc = encodeURIComponent(vm.advert['Description']);
        delete vm.advert['Description'];
        $http({
            method: 'GET',
            url: '/dashboard.php?function=submit&data=' + JSON.stringify(vm.advert) + '&desc=' + desc
        }).then(function (response) {
            if (vm.promoDo != "") {
                vm.promoOd = new Date();
                $http({
                    method: 'GET',
                    url: '/dashboard.php?function=makePromo&id=' + vm.advert.idAdvert + '&promoOd=' + vm.formatDate(vm.promoOd) + '&promoDo=' + vm.formatDate(vm.promoDo) + '&promoTyp=' + 2
                }).then(function () {
                    window.history.back();
                });
            } else {
                window.history.back();
            }
        });
    }

    function removePromo() {
        $http({
            method: 'GET',
            url: '/dashboard.php?function=removePromo&id=' + vm.advert.idAdvert
        }).then(function () {
            vm.removeMessage = "Promowanie wyłączone";
        });
    }

    function addNewImage() {
        var file = vm.newImage;
        var uploadUrl = "/uploadimg.php";
        fileUpload.uploadFileToUrl(file, uploadUrl).then(function (response) {
            var uploadUrl = "/uploadimgBig.php";
            fileUpload.uploadFileToUrl(file, uploadUrl).then(function (response) {
                vm.images.push(response.data);
                vm.advert.UploadedFiles = vm.images.join('*');
            });
        });
    }
};
var dashboard = angular.module('dashboard', ['ui.router']).controller('mainController', ['$scope', function ($scope) {}]).directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]).service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function (file, uploadUrl) {
        var fd = new FormData();
        fd.append('file', file);
        return $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };
}]);

dashboard.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: 'ogloszenia',
        url: '/ogloszenia?page&search&searchType&idCategory&city&direction&sorting&step',
        params: {
            page: {
                value: '0',
                squash: true
            },
            direction: 'DESC',
            sorting: 'idAdvert',
            step: '50',
            search: '',
            searchType: 'Title',
            idCategory: '0',
            city: ''
        },
        template: '\n            <div class="search-container">\n                <form id="search" ng-submit="classfield.search(classfield.searchval, classfield.searchType, classfield.idCategory, classfield.city, 0, 50)">\n                    <h3>Szukaj</h3>\n                    <select ng-model="classfield.searchType">\n                        <option selected value="Title">Tytu\u0142</option>\n                        <option selected value="idAdvert">ID</option>\n                        <option value="Mobile">Numer telefonu</option>\n                        <option value="Description">Tre\u015B\u0107</option>\n                        <option value="idAdvert">Numer og\u0142oszenia</option>\n                        <option value="ip">IP</option>\n                        <option value="Email">E-mail</option>\n                    </select>\n                    <input type="text" \n                        ng-model="classfield.searchval"\n                        placeholder="Szukana fraza"\n                    >\n                    <label>Kategoria</label>\n                    <select ng-model="classfield.idCategory" ng-selected="classfield.idCategory">\n                        <option value="0">Wszystkie</option>\n                        <option value="{{cat.idCategory}}" ng-repeat="cat in classfield.categories">{{cat.ShortName}}</option>\n                    </select>\n                    <label>Miasto</label>\n                    <input type="text" placeholder="miasto" ng-model="classfield.city" />\n                    <input type="submit" value="Szukaj">\n                    <button ng-click="classfield.reset()">Reset</button>\n                </form>\n                <div class="promowanie-cena">\n                    <h3>Wyszukaj sumy warto\u015Bci og\u0142osze\u0144 premium</h3>\n                    <input type="date" ng-model="classfield.promoOd" placeholder="Promowanie od">\n                    <input type="date" ng-model="classfield.promoDo" placeholder="Promowanie Do">\n                    <button ng-click="classfield.getPromoSumValue()">Sprawd\u017A</button>\n                    <p ng-if="classfield.promoValue">Warto\u015B\u0107 to: {{classfield.promoValue}} </p>\n                </div>\n            </div>\n            <div class="pagination">\n                <button ng-click="classfield.goBack()"><i class="fa fa-angle-left"></i>  Wstecz</button>\n                <button ng-click="classfield.goForward()">Dalej  <i class="fa fa-angle-right"></i></button>\n                <select ng-model="classfield.selectStep" ng-change="classfield.changeStep(classfield.selectStep)">\n                    <option value="20">20</option>\n                    <option value="50">50</option>\n                    <option value="100">100</option>\n                </select>\n            </div>\n            <div class="advert">\n                <table>\n                    <thead>\n                        <tr>\n                            <th ng-click="classfield.order(\'idAdvert\')" class="clickable">Index <i class="order fa" ng-class="{\n                                \'fa-angle-down\': classfield.ordering.idAdvert.down,\n                                \'fa-angle-up\': classfield.ordering.idAdvert.up, \n                                \'hidden\': classfield.ordering.idAdvert.hidden}"\n                                ng-if="!classfield.searchActive"></i></th>\n                            <th ng-click="classfield.order(\'Title\')" class="clickable">Tytu\u0142 <i class="order fa" ng-class="{\n                                \'fa-angle-down\': classfield.ordering.Title.down,\n                                \'fa-angle-up\': classfield.ordering.Title.up, \n                                \'hidden\': classfield.ordering.Title.hidden}"\n                                ng-if="!classfield.searchActive"></i></th>\n                            <th ng-click="classfield.order(\'DateCreated\')" class="clickable">Data utworzenia <i class="order fa" ng-class="{\n                                \'fa-angle-down\': classfield.ordering.DateCreated.down,\n                                \'fa-angle-up\': classfield.ordering.DateCreated.up, \n                                \'hidden\': classfield.ordering.DateCreated.hidden}"\n                                ng-if="!classfield.searchActive"></i></th>\n                            <th>Kategoria</th>\n                            <th>Wyga\u015Bni\u0119te</th>\n                            <th>Promowanie do</th>\n                            <th>Warto\u015B\u0107<br>{{:: classfield.sumOfPromoValues}}</th>\n                            <th>E-mail</th>\n                            <th>Has\u0142o</th>\n                            <th>IP adres</th>\n                            <th><input type="checkbox" ng-model="classfield.removeAll" ng-click="classfield.selectAll(classfield.removeAll)" /> Usu\u0144</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        <tr ng-repeat="advert in classfield.adverts" ng-class="{promo: advert.promo}">\n                            <td>{{advert.idAdvert}}</td>\n                            <td class="ad-title" ui-sref="edit({id: advert.idAdvert})">\n                                <img ng-if="advert.MainFile" ng-src="/img/list/{{advert.MainFile}}"/>\n                                {{advert.Title}}\n                            </td>\n                            <td>{{advert.DateCreated}}</td>\n                            <td>{{advert.category}}</td>\n                            <td>{{advert.expires == 1 ? \'Nie\' : \'Tak\'}}</td>\n                            <td>{{advert.promoDo}}</td>\n                            <td>{{classfield.getPromoValue(advert.DateCreated, advert.promoDo)}}</td>\n                            <td>{{advert.Email}}</td>\n                            <td>{{advert.adPassword}}</td>\n                            <td>{{advert.ip}}</td>\n                            <td><input type="checkbox" ng-model="advert.delete" /></td>\n                        </tr>\n                    </tbody>\n                </table>\n            </div>\n            <div class="pagination">\n                <button ng-click="classfield.remove()" class="danger"><i class="fa fa-trash-alt"></i>  Usu\u0144</button>           \n                <button ng-click="classfield.goBack()"><i class="fa fa-angle-left"></i>  Wstecz</button>\n                <button ng-click="classfield.goForward()">Dalej  <i class="fa fa-angle-right"></i></button>\n            </div>\n        ',
        controller: classfieldController,
        controllerAs: 'classfield',
        resolve: {
            categories: function categories($http) {
                return $http({
                    method: 'GET',
                    url: '/dashboard.php?function=getCategories'
                }).then(function (result) {
                    return result.data;
                });
            }
        }
    }).state({
        name: 'edit',
        url: '/edit/:id',
        template: '\n            <div id="advert-content" ng-class="{\'promo\':edit.advert.promoDo}">\n                <form id="advert-form" ng-submit="edit.submit()">\n                    <label>Tytu\u0142</label>\n                    <input type="text" ng-model="edit.advert.Title">\n                    <label>Data utworzenia</label>\n                    <input type="text" ng-model="edit.advert.DateCreated">\n                    <label>Cena</label>\n                    <input type="text" ng-model="edit.advert.Price">\n                    <label>Warto\u015B\u0107 Tagi</label>\n                    <input type="text" ng-model="edit.advert.ValueTags">\n                    <label>Imi\u0119</label>\n                    <input type="text" ng-model="edit.advert.Name">\n                    <label>Email</label>\n                    <input type="text" ng-model="edit.advert.Email">\n                    <label>Telefon stacjonarny</label>\n                    <input type="text" ng-model="edit.advert.Landline">\n                    <label>Telefon</label>\n                    <input type="text" ng-model="edit.advert.Mobile">\n                    <label>Kategoria</label>\n                    <select ng-model="edit.advert.idCategory" ng-selected="edit.advert.idCategory" ng-change="edit.changeCategory(edit.advert.idCategory)">\n                        <option value="{{cat.id}}" ng-repeat="cat in edit.categories">{{cat.name}}</option>\n                    </select>\n                    <label>Tagi</label>\n                    <div class="tags-container">\n                        <label ng-repeat="tag in edit.tags">\n                            <input type="checkbox" value="{{tag.idSubcategory}}" ng-click="edit.toggleTags(tag.idSubcategory)" ng-checked="edit.checkTag(tag.idSubcategory)">\n                            {{tag.Subcategory}}\n                        </label>\n                    </div>\n                    <label>CountrySlug</label>\n                    <input type="text" ng-model="edit.advert.CountrySlug">\n                    <label>Lokalizacja</label>\n                    <input type="text" ng-model="edit.advert.LocationIndex">\n                    <label>Kod pocztowy</label>\n                    <input type="text" ng-model="edit.advert.Postcode">\n                    <label>Firma</label>\n                    <input type="text" ng-model="edit.advert.company">\n                    <div ng-if="edit.advert.promoDo">\n                        <label>Promowanie do</label>\n                        <input type="text" ng-model="edit.advert.promoDo">\n                        <label>Wy\u0142\u0105cz promowanie</label>\n                        <button ng-click="edit.removePromo()" class="danger">Wy\u0142\u0105cz</button>\n                        <p class="message" ng-class="{\'show\': edit.removeMessage}">{{edit.removeMessage}}</p>\n                    </div>\n                    <label>Wygasni\u0119te</label>\n                    <input type="text" ng-model="edit.advert.expires">\n                    <label>Opis</label>\n                    <textarea ng-model="edit.advert.Description"></textarea>\n                    <div class="promo-div" ng-if="!edit.advert.promoDo">\n                        <label>Promowanie do</label>\n                        <input type="date" ng-model="edit.promoDo"/>\n                    </div>\n                    <label ng-if="edit.advert.UploadedFiles">Zdj\u0119cia</label>\n                    <div class="image-container">\n                        <div ng-repeat="image in edit.images track by $index" ng-if="image.length">\n                            <button ng-click="edit.removeImg($index)"><i class="fa fa-times-circle"></i></button>\n                            <img ng-src="/img/ad/{{image}}">\n                        </div>\n                        <div class="file-upload">\n                            <input type="file" file-model="edit.newImage" />\n                            <input type="button" value="Dodaj zdj\u0119cie" ng-click="edit.addNewImage()" />\n                        </div>\n                    </div>\n                    <input type="submit" value="Zapisz">\n                    <p class="save-info" ng-class="{\'seved\': edit.saved}">Zapisano</p>\n                </form>\n            </div>\n        ',
        controller: editController,
        controllerAs: 'edit',
        resolve: {
            advert: function advert($http, $stateParams) {
                document.querySelector('#loader').classList.remove('hide-loader');
                return $http({
                    method: 'GET',
                    url: '/dashboard.php?function=getAdvert&advertId=' + $stateParams.id
                }).then(function (result) {
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
            postcodes: function postcodes($http) {
                return $http({
                    method: 'GET',
                    url: '/dashboard.php?function=getPostcode'
                }).then(function (result) {
                    return result.data;
                });
            },
            promoTypes: function promoTypes($http) {
                return $http({
                    method: 'GET',
                    url: '/dashboard.php?function=getPromoTypes'
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

    $urlRouterProvider.otherwise('/ogloszenia?page=0&search=&searchType=Title&idCategory=0&city=&direction=DESC&sorting=idAdvert&step=50');
});