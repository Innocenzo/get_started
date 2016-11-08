'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.OPENSHIFT_NODEJS_IP ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8080,

  // sequelize connection options
  sequelize: {
    uri:    process.env.SEQUELIZE_URI ||
            'mysql://root:biondo@127.0.0.1:3306/app211-dev'
  }
};
