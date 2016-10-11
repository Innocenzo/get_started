// Register `productList` component, along with its associated controller and template
angular.
  module('contactList').
  component('contactList', {
    // Note: The URL is relative to our `index.html` file
    templateUrl: 'contact-list/contact-list.template.html',
    controller: ['$scope','$http',
      function ContactListController($scope,$http) {
        var self = this;
        self.orderProp = 'name';
        $http.get("/contacts").success(function(data, status, headers, config) {
          // $scope.contacts = data;
          console.log(data);
          self.contacts = data;
        }).error(function(data, status, headers, config) {
            console.log("Ops: could not get any data");
        });
        self.list = [];

        self.sendData = function () {
          console.log("ciao");
          if (self.text) {
          self.list.push(this.text);
          self.text = '';
        }
        };

        //  self.sendData = function () {
        //   console.log("sendData");
        //   $http.post("/contacts",{
        //     name:$scope.contactName,
        //     surname:$scope.contactSurname,
        //     tel:$scope.contactTel,
        //   }).success(function(data, status, headers, config) {
        //     // $scope.contacts = data;
        //     console.log(data);
        //     // self.contacts.push({
        //     //   name:self.contactName,
        //     //   surname:self.contactSurname,
        //     //   tel:self.contactTel});
        //   }).error(function(data, status, headers, config) {
        //       console.log("Ops: could not get any data");
        //   });
        // };

      }
    ]
  });
