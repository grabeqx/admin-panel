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
            url: `/dashboard.php?function=getAdverts&limitFrom=${from}&limitTo=${to}&sorting=${sorting}&sortDierction=${sortDierction}&searchValue=${encodeURIComponent(value)}&type=${type}&category=${cetegory}&city=${city}`
        }).then((response) => {
            document.querySelector('#loader').classList.add('hide-loader');
            vm.adverts = response.data;
            vm.sumAllPices(response.data);
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

    function sumAllPices(adverts) {
        var oneDay = 24*60*60*1000;
        var price = 0;
        adverts.map(advert => {
            if(advert.promoDo !== null) {
                var firstDate = new Date(advert.promoDo);
                var secondDate = new Date(advert.DateCreated);
                var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
                window.sumOfPromoValues = vm.sumOfPromoValues;
                if(diffDays <= 7) {
                    price += 15;
                } else if(diffDays > 7 && diffDays <= 14) {
                    price += 25;
                } else if(diffDays > 14 && diffDays <= 30) {
                    price += 35;
                } else if(diffDays > 30 && diffDays <= 60) {
                    price += 55;
                } else if(diffDays > 60 && diffDays <= 90) {
                    price += 85;
                } else if(diffDays > 90) {
                    price += 0;
                }
            };      
        });
        vm.sumOfPromoValues = price + '.00£';
    }

    function formatDate(date) {
        var today = new Date(date),
            dd = today.getDate(),
            mm = today.getMonth()+1,
            yyyy = today.getFullYear(),
            hh = today.getHours(),
            min = today.getMinutes(),
            sec = today.getSeconds();

        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        }

        return yyyy+'-'+mm+'-'+dd;
    }

    function getPromoSumValue() {
        if(!vm.promoOd || !vm.promoDo) {
            return;
        }
        $http({
            method: 'GET',
            url: `/dashboard.php?function=getPromo&promoOd=${formatDate(vm.promoOd)}&promoDo=${formatDate(vm.promoDo)}`
        }).then((response) => {
            var price = 0;
            var oneDay = 24*60*60*1000;
            response.data.map(advert => {
                var firstDate = new Date(advert.PromoDo);
                var secondDate = new Date(advert.PromoOd);
                var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
                if(diffDays <= 7) {
                    price += 15;
                } else if(diffDays > 7 && diffDays <= 14) {
                    price += 25;
                } else if(diffDays > 14 && diffDays <= 30) {
                    price += 35;
                } else if(diffDays > 30 && diffDays <= 60) {
                    price += 55;
                } else if(diffDays > 60 && diffDays <= 90) {
                    price += 85;
                } else if(diffDays > 90) {
                    price += 0;
                }     
            });
            vm.promoValue = price+'.00£';
        })
    }

}