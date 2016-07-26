'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Propiedade = mongoose.model('Propiedade'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, propiedade;

/**
 * Propiedade routes tests
 */
describe('Propiedade CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Propiedade
    user.save(function () {
      propiedade = {
        name: 'Propiedade name'
      };

      done();
    });
  });

  it('should be able to save a Propiedade if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Propiedade
        agent.post('/api/propiedades')
          .send(propiedade)
          .expect(200)
          .end(function (propiedadeSaveErr, propiedadeSaveRes) {
            // Handle Propiedade save error
            if (propiedadeSaveErr) {
              return done(propiedadeSaveErr);
            }

            // Get a list of Propiedades
            agent.get('/api/propiedades')
              .end(function (propiedadesGetErr, propiedadesGetRes) {
                // Handle Propiedade save error
                if (propiedadesGetErr) {
                  return done(propiedadesGetErr);
                }

                // Get Propiedades list
                var propiedades = propiedadesGetRes.body;

                // Set assertions
                (propiedades[0].user._id).should.equal(userId);
                (propiedades[0].name).should.match('Propiedade name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Propiedade if not logged in', function (done) {
    agent.post('/api/propiedades')
      .send(propiedade)
      .expect(403)
      .end(function (propiedadeSaveErr, propiedadeSaveRes) {
        // Call the assertion callback
        done(propiedadeSaveErr);
      });
  });

  it('should not be able to save an Propiedade if no name is provided', function (done) {
    // Invalidate name field
    propiedade.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Propiedade
        agent.post('/api/propiedades')
          .send(propiedade)
          .expect(400)
          .end(function (propiedadeSaveErr, propiedadeSaveRes) {
            // Set message assertion
            (propiedadeSaveRes.body.message).should.match('Please fill Propiedade name');

            // Handle Propiedade save error
            done(propiedadeSaveErr);
          });
      });
  });

  it('should be able to update an Propiedade if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Propiedade
        agent.post('/api/propiedades')
          .send(propiedade)
          .expect(200)
          .end(function (propiedadeSaveErr, propiedadeSaveRes) {
            // Handle Propiedade save error
            if (propiedadeSaveErr) {
              return done(propiedadeSaveErr);
            }

            // Update Propiedade name
            propiedade.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Propiedade
            agent.put('/api/propiedades/' + propiedadeSaveRes.body._id)
              .send(propiedade)
              .expect(200)
              .end(function (propiedadeUpdateErr, propiedadeUpdateRes) {
                // Handle Propiedade update error
                if (propiedadeUpdateErr) {
                  return done(propiedadeUpdateErr);
                }

                // Set assertions
                (propiedadeUpdateRes.body._id).should.equal(propiedadeSaveRes.body._id);
                (propiedadeUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Propiedades if not signed in', function (done) {
    // Create new Propiedade model instance
    var propiedadeObj = new Propiedade(propiedade);

    // Save the propiedade
    propiedadeObj.save(function () {
      // Request Propiedades
      request(app).get('/api/propiedades')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Propiedade if not signed in', function (done) {
    // Create new Propiedade model instance
    var propiedadeObj = new Propiedade(propiedade);

    // Save the Propiedade
    propiedadeObj.save(function () {
      request(app).get('/api/propiedades/' + propiedadeObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', propiedade.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Propiedade with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/propiedades/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Propiedade is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Propiedade which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Propiedade
    request(app).get('/api/propiedades/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Propiedade with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Propiedade if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Propiedade
        agent.post('/api/propiedades')
          .send(propiedade)
          .expect(200)
          .end(function (propiedadeSaveErr, propiedadeSaveRes) {
            // Handle Propiedade save error
            if (propiedadeSaveErr) {
              return done(propiedadeSaveErr);
            }

            // Delete an existing Propiedade
            agent.delete('/api/propiedades/' + propiedadeSaveRes.body._id)
              .send(propiedade)
              .expect(200)
              .end(function (propiedadeDeleteErr, propiedadeDeleteRes) {
                // Handle propiedade error error
                if (propiedadeDeleteErr) {
                  return done(propiedadeDeleteErr);
                }

                // Set assertions
                (propiedadeDeleteRes.body._id).should.equal(propiedadeSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Propiedade if not signed in', function (done) {
    // Set Propiedade user
    propiedade.user = user;

    // Create new Propiedade model instance
    var propiedadeObj = new Propiedade(propiedade);

    // Save the Propiedade
    propiedadeObj.save(function () {
      // Try deleting Propiedade
      request(app).delete('/api/propiedades/' + propiedadeObj._id)
        .expect(403)
        .end(function (propiedadeDeleteErr, propiedadeDeleteRes) {
          // Set message assertion
          (propiedadeDeleteRes.body.message).should.match('User is not authorized');

          // Handle Propiedade error error
          done(propiedadeDeleteErr);
        });

    });
  });

  it('should be able to get a single Propiedade that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Propiedade
          agent.post('/api/propiedades')
            .send(propiedade)
            .expect(200)
            .end(function (propiedadeSaveErr, propiedadeSaveRes) {
              // Handle Propiedade save error
              if (propiedadeSaveErr) {
                return done(propiedadeSaveErr);
              }

              // Set assertions on new Propiedade
              (propiedadeSaveRes.body.name).should.equal(propiedade.name);
              should.exist(propiedadeSaveRes.body.user);
              should.equal(propiedadeSaveRes.body.user._id, orphanId);

              // force the Propiedade to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Propiedade
                    agent.get('/api/propiedades/' + propiedadeSaveRes.body._id)
                      .expect(200)
                      .end(function (propiedadeInfoErr, propiedadeInfoRes) {
                        // Handle Propiedade error
                        if (propiedadeInfoErr) {
                          return done(propiedadeInfoErr);
                        }

                        // Set assertions
                        (propiedadeInfoRes.body._id).should.equal(propiedadeSaveRes.body._id);
                        (propiedadeInfoRes.body.name).should.equal(propiedade.name);
                        should.equal(propiedadeInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Propiedade.remove().exec(done);
    });
  });
});
