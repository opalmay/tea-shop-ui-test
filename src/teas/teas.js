import angular from 'angular';
import { MODULE_NAME } from '../config'

const module = angular.module(MODULE_NAME)
    .controller('TeasCtrl', function ($scope, Restangular) {
        $scope.filters = { text: '', type: '' };
        $scope.sortMethod = 'name';
        this.teasToShow = [];
        $scope.processTeasToShow = () => {
            $scope.filter();
            $scope.sort();
        }
        $scope.filter = () => {
            const filters = $scope.filters;
            this.teasToShow = this.teas.filter(tea =>
                (includesIgnoreCase(tea.name, filters.text) ||
                    includesIgnoreCase(tea.description, filters.text)) &&
                (tea.type === filters.type || filters.type === '')
            );
        }
        $scope.sort = () => {
            const sortMethod = $scope.sortMethod;
            this.teasToShow = this.teasToShow.sort((tea1, tea2) => {
                switch (sortMethod) {
                    case 'name':
                        return tea1.name.localeCompare(tea2.name);
                    case 'price_asc':
                        return tea1.price - tea2.price;
                    case 'price_desc':
                        return tea2.price - tea1.price;
                }
            });
        }

        var teas = Restangular.all('teas');
        teas.getList().then((teas) => {
            this.teas = teas;
            $scope.processTeasToShow();
        });
        var teaTypes = Restangular.all('teaTypes');
        teaTypes.getList().then((teaTypes) => {
            this.teaTypes = teaTypes;
        });
    });
function includesIgnoreCase(str1, str2) {
    return str1.toLowerCase().includes(str2.toLowerCase())
}
module.config(function ($routeProvider) {
    $routeProvider.when('/teas', {
        template: require('./teas.html'),
        controller: 'TeasCtrl',
        controllerAs: 'teas'
    })
})