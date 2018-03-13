dashboard.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state({
        name: 'ogloszenia',
        url: '/ogloszenia',
        template: `
            <div class="search-container">
                <form id="search" ng-submit="classfield.search(classfield.searchval)">
                    <h3>Szukaj</h3>
                    <label>Tytuł</label>
                    <input type="text" 
                        ng-model="classfield.searchval"
                        placeholder="min. 3 znaki"
                    >
                    <input type="submit" value="Szukaj" ng-disabled="!(classfield.searchval.length >= 3)">
                    <button ng-click="classfield.reset()">Reset</button>
                </form>
            </div>
            <div class="pagination" ng-if="!classfield.searchActive">
                <button ng-click="classfield.goBack()"><i class="fa fa-angle-left"></i>  Wstecz</button>
                <button ng-click="classfield.goForward()">Dalej  <i class="fa fa-angle-right"></i></button>
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
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="advert in classfield.adverts" ng-class="{promo: advert.promo}" ui-sref="edit({id: advert.idAdvert})">
                            <td>{{advert.idAdvert}}</td>
                            <td class="ad-title">
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
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination" ng-if="!classfield.searchActive">
                <button ng-click="classfield.goBack()"><i class="fa fa-angle-left"></i>  Wstecz</button>
                <button ng-click="classfield.goForward()">Dalej  <i class="fa fa-angle-right"></i></button>
            </div>
        `,
        controller: classfieldController,
        controllerAs: 'classfield',
        resolve: {
            adverts: function ($http) {
                document.querySelector('#loader').classList.remove('hide-loader');
                return $http({
                    method: 'GET',
                    url: `/dashboard.php?function=getAdverts&limitFrom=0&limitTo=50&sorting=idAdvert&sortDierction=DESC`
                }).then((result) => {
                    document.querySelector('#loader').classList.add('hide-loader');
                    return result.data;
                })
            }
        }
    })
    .state({
        name: 'edit',
        url: '/edit/:id',
        template: `
            <div id="advert-content">
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
                    <label>Promowanie do</label>
                    <input type="text" ng-model="edit.advert.promoDo">
                    <label>Opis</label>
                    <textarea ng-model="edit.advert.Description"></textarea>
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
                    console.log(result.data);
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
            postcodes: function($http, advert) {
                return $http({
                    method: 'GET',
                    url: `/dashboard.php?function=getPostcode`
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


    $urlRouterProvider.otherwise('/ogloszenia');
});