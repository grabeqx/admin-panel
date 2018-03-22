dashboard.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state({
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
        template: `
            <div class="search-container">
                <form id="search" ng-submit="classfield.search(classfield.searchval, classfield.searchType, classfield.idCategory, classfield.city, 0, 50)">
                    <h3>Szukaj</h3>
                    <select ng-model="classfield.searchType">
                        <option selected value="Title">Tytuł</option>
                        <option selected value="idAdvert">ID</option>
                        <option value="Mobile">Numer telefonu</option>
                        <option value="Description">Treść</option>
                        <option value="idAdvert">Numer ogłoszenia</option>
                        <option value="ip">IP</option>
                        <option value="Email">E-mail</option>
                    </select>
                    <input type="text" 
                        ng-model="classfield.searchval"
                        placeholder="Szukana fraza"
                    >
                    <label>Kategoria</label>
                    <select ng-model="classfield.idCategory" ng-selected="classfield.idCategory">
                        <option value="0">Wszystkie</option>
                        <option value="{{cat.idCategory}}" ng-repeat="cat in classfield.categories">{{cat.ShortName}}</option>
                    </select>
                    <label>Miasto</label>
                    <input type="text" placeholder="miasto" ng-model="classfield.city" />
                    <input type="submit" value="Szukaj">
                    <button ng-click="classfield.reset()">Reset</button>
                </form>
            </div>
            <div class="pagination">
                <button ng-click="classfield.goBack()"><i class="fa fa-angle-left"></i>  Wstecz</button>
                <button ng-click="classfield.goForward()">Dalej  <i class="fa fa-angle-right"></i></button>
                <select ng-model="classfield.selectStep" ng-change="classfield.changeStep(classfield.selectStep)">
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
            <div class="advert">
                <table>
                    <thead>
                        <tr>
                            <th ng-click="classfield.order('idAdvert')" class="clickable">Index <i class="order fa" ng-class="{
                                'fa-angle-down': classfield.ordering.idAdvert.down,
                                'fa-angle-up': classfield.ordering.idAdvert.up, 
                                'hidden': classfield.ordering.idAdvert.hidden}"
                                ng-if="!classfield.searchActive"></i></th>
                            <th ng-click="classfield.order('Title')" class="clickable">Tytuł <i class="order fa" ng-class="{
                                'fa-angle-down': classfield.ordering.Title.down,
                                'fa-angle-up': classfield.ordering.Title.up, 
                                'hidden': classfield.ordering.Title.hidden}"
                                ng-if="!classfield.searchActive"></i></th>
                            <th ng-click="classfield.order('DateCreated')" class="clickable">Data utworzenia <i class="order fa" ng-class="{
                                'fa-angle-down': classfield.ordering.DateCreated.down,
                                'fa-angle-up': classfield.ordering.DateCreated.up, 
                                'hidden': classfield.ordering.DateCreated.hidden}"
                                ng-if="!classfield.searchActive"></i></th>
                            <th>Kategoria</th>
                            <th>Wygaśnięte</th>
                            <th>Promowanie do</th>
                            <th>E-mail</th>
                            <th>Hasło</th>
                            <th>IP adres</th>
                            <th><input type="checkbox" ng-model="classfield.removeAll" ng-click="classfield.selectAll(classfield.removeAll)" /> Usuń</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="advert in classfield.adverts" ng-class="{promo: advert.promo}">
                            <td>{{advert.idAdvert}}</td>
                            <td class="ad-title" ui-sref="edit({id: advert.idAdvert})">
                                <img ng-if="advert.MainFile" ng-src="/img/list/{{advert.MainFile}}"/>
                                {{advert.Title}}
                            </td>
                            <td>{{advert.DateCreated}}</td>
                            <td>{{advert.category}}</td>
                            <td>{{advert.expires == 1 ? 'Nie' : 'Tak'}}</td>
                            <td>{{advert.promoDo}}</td>
                            <td>{{advert.Email}}</td>
                            <td>{{advert.adPassword}}</td>
                            <td>{{advert.ip}}</td>
                            <td><input type="checkbox" ng-model="advert.delete" /></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination">
                <button ng-click="classfield.remove()" class="danger"><i class="fa fa-trash-alt"></i>  Usuń</button>           
                <button ng-click="classfield.goBack()"><i class="fa fa-angle-left"></i>  Wstecz</button>
                <button ng-click="classfield.goForward()">Dalej  <i class="fa fa-angle-right"></i></button>
            </div>
        `,
        controller: classfieldController,
        controllerAs: 'classfield',
        resolve: {
            categories: function($http) {
                return $http({
                    method: 'GET',
                    url: `/dashboard.php?function=getCategories`
                }).then((result) => {
                    return result.data;
                })
            }
        }
    })
    .state({
        name: 'edit',
        url: '/edit/:id',
        template: `
            <div id="advert-content" ng-class="{'promo':edit.advert.promoDo}">
                <form id="advert-form" ng-submit="edit.submit()">
                    <label>Tytuł</label>
                    <input type="text" ng-model="edit.advert.Title">
                    <label>Data utworzenia</label>
                    <input type="text" ng-model="edit.advert.DateCreated">
                    <label>Cena</label>
                    <input type="text" ng-model="edit.advert.Price">
                    <label>Wartość Tagi</label>
                    <input type="text" ng-model="edit.advert.ValueTags">
                    <label>Imię</label>
                    <input type="text" ng-model="edit.advert.Name">
                    <label>Email</label>
                    <input type="text" ng-model="edit.advert.Email">
                    <label>Telefon stacjonarny</label>
                    <input type="text" ng-model="edit.advert.Landline">
                    <label>Telefon</label>
                    <input type="text" ng-model="edit.advert.Mobile">
                    <label>Kategoria</label>
                    <select ng-model="edit.advert.idCategory" ng-selected="edit.advert.idCategory" ng-change="edit.changeCategory(edit.advert.idCategory)">
                        <option value="{{cat.id}}" ng-repeat="cat in edit.categories">{{cat.name}}</option>
                    </select>
                    <label>Tagi</label>
                    <div class="tags-container">
                        <label ng-repeat="tag in edit.tags">
                            <input type="checkbox" value="{{tag.idSubcategory}}" ng-click="edit.toggleTags(tag.idSubcategory)" ng-checked="edit.checkTag(tag.idSubcategory)">
                            {{tag.Subcategory}}
                        </label>
                    </div>
                    <label>CountrySlug</label>
                    <input type="text" ng-model="edit.advert.CountrySlug">
                    <label>Lokalizacja</label>
                    <input type="text" ng-model="edit.advert.LocationIndex">
                    <label>Kod pocztowy</label>
                    <input type="text" ng-model="edit.advert.Postcode">
                    <label>Firma</label>
                    <input type="text" ng-model="edit.advert.company">
                    <div ng-if="edit.advert.promoDo">
                        <label>Promowanie do</label>
                        <input type="text" ng-model="edit.advert.promoDo">
                        <label>Wyłącz promowanie</label>
                        <button ng-click="edit.removePromo()" class="danger">Wyłącz</button>
                        <p class="message" ng-class="{'show': edit.removeMessage}">{{edit.removeMessage}}</p>
                    </div>
                    <label>Wygasnięte</label>
                    <input type="text" ng-model="edit.advert.expires">
                    <label>Opis</label>
                    <textarea ng-model="edit.advert.Description"></textarea>
                    <div class="promo-div" ng-if="!edit.advert.promoDo">
                        <label>Promowanie do</label>
                        <input type="date" ng-model="edit.promoDo"/>
                    </div>
                    <label ng-if="edit.advert.UploadedFiles">Zdjęcia</label>
                    <div class="image-container" ng-if="edit.advert.UploadedFiles">
                        <div ng-repeat="image in edit.images track by $index" ng-if="image.length">
                            <button ng-click="edit.removeImg($index)"><i class="fa fa-times-circle"></i></button>
                            <img ng-src="/img/ad/{{image}}">
                        </div>
                    </div>
                    <input type="submit" value="Zapisz">
                    <p class="save-info" ng-class="{'seved': edit.saved}">Zapisano</p>
                </form>
            </div>
        `,
        controller: editController,
        controllerAs: 'edit',
        resolve: {
            advert: function ($http, $stateParams) {
                document.querySelector('#loader').classList.remove('hide-loader');
                return $http({
                    method: 'GET',
                    url: `/dashboard.php?function=getAdvert&advertId=${$stateParams.id}`
                }).then((result) => {
                    return result.data[0];
                })
            },
            tags: function($http, advert) {
                return $http({
                    method: 'GET',
                    url: `/dashboard.php?function=getTags&category=${advert.idCategory}`
                }).then((result) => {
                    return result.data;
                })
            },
            postcodes: function($http) {
                return $http({
                    method: 'GET',
                    url: `/dashboard.php?function=getPostcode`
                }).then((result) => {
                    return result.data;
                })
            },
            promoTypes: function($http) {
                return $http({
                    method: 'GET',
                    url: `/dashboard.php?function=getPromoTypes`
                }).then((result) => {
                    document.querySelector('#loader').classList.add('hide-loader');
                    return result.data;
                })
            }
        }
    })
    .state({
        name: 'dodaj',
        url: '/dodaj',
        template: `
            <div>
                <iframe id="dodaj-ogloszenie" src="http://www.felcia.co.uk/nowe-ogloszenie/kategoria-i-tagi.html"></iframe>
            </div>
        `,
        controller: function() {
            document.querySelector('#loader').classList.add('hide-loader');
        }
    });


    $urlRouterProvider.otherwise('/ogloszenia?page=0&search=&searchType=Title&idCategory=0&city=&direction=DESC&sorting=idAdvert&step=50');
});