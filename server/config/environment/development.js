'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb+srv://adminuser:dYHwmdGqMBacQOmL@clusterarc.qmiom.mongodb.net/test?retryWrites=true&w=majority'
  },


email:'test@test.com', // email configure for node-mailer
password:'Test@123',    // password configure for node-mailer
backendurl:'https://todo-project-new.herokuapp.com',
  seedDB: false  // set false if you don't want to create seed data when server starts
};
