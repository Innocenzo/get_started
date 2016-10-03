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
        $http.get('contacts/contacts.json').then(function(response) {
          self.contacts = response.data;
        });
      }
    ]
  });
