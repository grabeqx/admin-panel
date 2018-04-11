var classfieldController = function ($http, $state, $stateParams, categories) {
    // Data
    var vm = this;
    this.adverts = [];
    this.searchType = $stateParams.searchType;
    this.page = parseInt($stateParams.page, 10);
    this.selectStep = $stateParams.step;
    this.step = parseInt(vm.selectStep);
    this.from = vm.page * vm.step;
    this.ordering = {
        idAdvert: {hidden: 1, up: $stateParams.direction === 'DESC' ? 1 : 0, down: $stateParams.direction === 'DESC' ? 0 : 1},
        Title: {hidden: 1, up: $stateParams.direction === 'DESC' ? 1 : 0, down: $stateParams.direction === 'DESC' ? 0 : 1},
        DateCreated: {hidden: 1, up: $stateParams.direction === 'DESC' ? 1 : 0, down: $stateParams.direction === 'DESC' ? 0 : 1},
        category: {hidden: 1, up: $stateParams.direction === 'DESC' ? 1 : 0, down: $stateParams.direction === 'DESC' ? 0 : 1}
    };
    this.sorting = $stateParams.sorting;
    this.sortDirection = $stateParams.direction;
    this.ordering[$stateParams.sorting].hidden = 0;
    this.searchActive = false;
    this.idCategory = $stateParams.idCategory;
    this.city = $stateParams.city;
    this.categories = categories;
    this.searchval = $stateParams.search;
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
            url: `/dashboard.php?function=getAdverts&limitFrom=${from}&limitTo=${to}&sorting=${sorting}&sortDierction=${sortDierction}&searchValue=${encodeURIComponent(value)}&type=${type}&category=${cetegory}&city=${city}`
        }).then((response) => {
            document.querySelector('#loader').classList.add('hide-loader');
            vm.adverts = response.data;
            $state.go('.', {page: vm.page, search: value , searchType: type, idCategory: cetegory, city: city, direction: vm.sortDirection , sorting: sorting});
        })
    }

    function goForward() {
        vm.page += 1;
        vm.from = vm.page * vm.step;
        vm.getAdvert(vm.from, vm.step, vm.sorting, vm.sortDirection, true, vm.searchval, vm.searchType, vm.idCategory, vm.city);
    }

    function goBack() {
        if(vm.page <= 0) {
            vm.page = 0
        } else {
            vm.page -= 1;
        }
        vm.from = vm.page * vm.step;
        vm.getAdvert(vm.from, vm.step, vm.sorting, vm.sortDirection, true, vm.searchval, vm.searchType, vm.idCategory, vm.city);
    }

    function order(type) {
        if(!vm.searchActive) {
            for(var i in vm.ordering) {
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
        vm.getAdvert(0, vm.step, vm.sorting, vm.sortDirection)
            .then(() => {
                vm.searchActive = false;
                vm.searchval = '';
            });
    }

    function remove() {
        var adToRemove = [];
        for(var i in vm.adverts) {
            if(vm.adverts[i].delete) {
                adToRemove.push(vm.adverts[i].idAdvert);
            }
        }
        document.querySelector('#loader').classList.remove('hide-loader');
        $http({
            method: 'GET',
            url: `/dashboard.php?function=remove&adToRemove=${adToRemove}`
        }).then(() => {
            $state.reload();
            document.querySelector('#loader').classList.add('hide-loader');
        })
    }

    function selectAll(select) {
        if(select) {
            for(var i in vm.adverts) {
                vm.adverts[i].delete = true;
            }
        } else {
            for(var i in vm.adverts) {
                vm.adverts[i].delete = false;
            }
        }
    }

    function changeStep(step) {
        $state.go('.', {step: step}, {notify: false});
    }

    function getPromoValue(dateCreated, PromoDate) {
        if(PromoDate == null) {
            return "Za darmo";
        };
        var oneDay = 24*60*60*1000; 
        var firstDate = new Date(PromoDate);
        var secondDate = new Date(dateCreated);

        var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
        if(diffDays <= 7) {
            return "15.00£";
        } else if(diffDays > 7 && diffDays <= 14) {
            return "25.00£";
        } else if(diffDays > 14 && diffDays <= 30) {
            return "35.00£";
        } else if(diffDays > 30 && diffDays <= 60) {
            return "55.00£";
        } else if(diffDays > 60 && diffDays <= 90) {
            return "85.00£";
        } else if(diffDays > 90) {
            return "Brak wartości";
        }
    }

}