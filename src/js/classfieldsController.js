var classfieldController = function (adverts, $http, $state) {
    // Data
    var vm = this;
    this.adverts = adverts;
    this.searchType = 'Title';
    this.page = 0;
    this.step = 50;
    this.from = 50;
    this.ordering = {
        idAdvert: {hidden: 0, up: 0, down: 1},
        Title: {hidden: 1, up: 0, down: 1},
        DateCreated: {hidden: 1, up: 0, down: 1},
        category: {hidden: 1, up: 0, down: 1}
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
    this.remove = remove;
    this.selectAll = selectAll;
    this.strip = strip;

    function strip(html) {
        var tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    function getAdvert(from, to, sorting, sortDierction) {
        document.querySelector('#loader').classList.remove('hide-loader');
        return $http({
            method: 'GET',
            url: `/dashboard.php?function=getAdverts&limitFrom=${from}&limitTo=${to}&sorting=${sorting}&sortDierction=${sortDierction}`
        }).then((response) => {
            document.querySelector('#loader').classList.add('hide-loader');
            vm.adverts = response.data;
        })
    }

    function goForward() {
        vm.page += 1;
        vm.from = vm.page * vm.step;
        vm.getAdvert(vm.from, vm.step, vm.sorting, vm.sortDirection);
    }

    function goBack() {
        if(vm.page <= 0) {
            vm.page = 0
        } else {
            vm.page -= 1;
        }
        vm.from = vm.page * vm.step;
        vm.getAdvert(vm.from, vm.step, vm.sorting, vm.sortDirection);
    }

    function order(type) {
        if(!vm.searchActive) {
            for(var i in vm.ordering) {
                i === type ? vm.ordering[i].hidden = 0 : vm.ordering[i].hidden = 1;
            }
            vm.ordering[type].up = !vm.ordering[type].up;
            vm.ordering[type].down = !vm.ordering[type].down;
            vm.sorting = type;
            vm.sortDirection = vm.ordering[type].up ? 'ASC' : 'DESC';
            vm.getAdvert(0, vm.step, vm.sorting, vm.sortDirection);
        }
    }

    function search(value, type) {
        document.querySelector('#loader').classList.remove('hide-loader');
        $http({
            method: 'GET',
            url: `/dashboard.php?function=search&searchValue=${encodeURIComponent(value)}&type=${type}`
        }).then((response) => {
            document.querySelector('#loader').classList.add('hide-loader');
            vm.adverts = response.data;
            vm.searchActive = true;
        })
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
        }).then((response) => {
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

}