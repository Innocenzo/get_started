// Register `productList` component, along with its associated controller and template
angular.
  module('contactList').
  component('contactList', {
    // Note: The URL is relative to our `index.html` file
    templateUrl: 'contact-list/contact-list.template.html',
    controller: ['$http',
      function ContactListController($http) {
        var self = this;
        self.orderProp = 'name';
        $http.get("/contacts").success(function(data, status, headers, config) {
          // $scope.contacts = data;
          console.log(data);
          self.contacts = data;
        }).error(function(data, status, headers, config) {
            console.log("Ops: could not get any data");
        });
      }
    ]
  });
