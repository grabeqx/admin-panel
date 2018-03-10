dashboard.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state({
        name: 'ogloszenia',
        url: '/ogloszenia',
        template: `
            <div class="advert">
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Tytuł</th>
                            <th>Data utworzenia</th>
                            <th>Wygaśnięte</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr ng-repeat="advert in classfield.adverts">
                            <td>{{advert.idAdvert}}</td>
                            <td>{{advert.Title}}</td>
                            <td>{{advert.DateCreated}}</td>
                            <td>{{advert.expires}}</td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        `,
        controller: classfieldController,
        controllerAs: 'classfield',
        resolve: {
            adverts: function ($http) {
                return $http({
                    method: 'GET',
                    url: `/dashboard.php?function=getAdvert&limitFrom=0&limitTo=150`
                }).then((result) => {
                    return result.data;
                })
            }
        }
    });


    $urlRouterProvider.otherwise('/ogloszenia');
});