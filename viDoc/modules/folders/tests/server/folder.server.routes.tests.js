'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Folder = mongoose.model('Folder'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  folder;

/**
 * Folder routes tests
 */
describe('Folder CRUD tests', function () {

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

    // Save a user to the test db and create new Folder
    user.save(function () {
      folder = {
        name: 'Folder name'
      };

      done();
    });
  });

  it('should be able to save a Folder if logged in', function (done) {
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

        // Save a new Folder
        agent.post('/api/folders')
          .send(folder)
          .expect(200)
          .end(function (folderSaveErr, folderSaveRes) {
            // Handle Folder save error
            if (folderSaveErr) {
              return done(folderSaveErr);
            }

            // Get a list of Folders
            agent.get('/api/folders')
              .end(function (foldersGetErr, foldersGetRes) {
                // Handle Folders save error
                if (foldersGetErr) {
                  return done(foldersGetErr);
                }

                // Get Folders list
                var folders = foldersGetRes.body;

                // Set assertions
                (folders[0].user._id).should.equal(userId);
                (folders[0].name).should.match('Folder name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Folder if not logged in', function (done) {
    agent.post('/api/folders')
      .send(folder)
      .expect(403)
      .end(function (folderSaveErr, folderSaveRes) {
        // Call the assertion callback
        done(folderSaveErr);
      });
  });

  it('should not be able to save an Folder if no name is provided', function (done) {
    // Invalidate name field
    folder.name = '';

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

        // Save a new Folder
        agent.post('/api/folders')
          .send(folder)
          .expect(400)
          .end(function (folderSaveErr, folderSaveRes) {
            // Set message assertion
            (folderSaveRes.body.message).should.match('Please fill Folder name');

            // Handle Folder save error
            done(folderSaveErr);
          });
      });
  });

  it('should be able to update an Folder if signed in', function (done) {
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

        // Save a new Folder
        agent.post('/api/folders')
          .send(folder)
          .expect(200)
          .end(function (folderSaveErr, folderSaveRes) {
            // Handle Folder save error
            if (folderSaveErr) {
              return done(folderSaveErr);
            }

            // Update Folder name
            folder.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Folder
            agent.put('/api/folders/' + folderSaveRes.body._id)
              .send(folder)
              .expect(200)
              .end(function (folderUpdateErr, folderUpdateRes) {
                // Handle Folder update error
                if (folderUpdateErr) {
                  return done(folderUpdateErr);
                }

                // Set assertions
                (folderUpdateRes.body._id).should.equal(folderSaveRes.body._id);
                (folderUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Folders if not signed in', function (done) {
    // Create new Folder model instance
    var folderObj = new Folder(folder);

    // Save the folder
    folderObj.save(function () {
      // Request Folders
      request(app).get('/api/folders')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Folder if not signed in', function (done) {
    // Create new Folder model instance
    var folderObj = new Folder(folder);

    // Save the Folder
    folderObj.save(function () {
      request(app).get('/api/folders/' + folderObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', folder.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Folder with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/folders/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Folder is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Folder which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Folder
    request(app).get('/api/folders/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Folder with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Folder if signed in', function (done) {
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

        // Save a new Folder
        agent.post('/api/folders')
          .send(folder)
          .expect(200)
          .end(function (folderSaveErr, folderSaveRes) {
            // Handle Folder save error
            if (folderSaveErr) {
              return done(folderSaveErr);
            }

            // Delete an existing Folder
            agent.delete('/api/folders/' + folderSaveRes.body._id)
              .send(folder)
              .expect(200)
              .end(function (folderDeleteErr, folderDeleteRes) {
                // Handle folder error error
                if (folderDeleteErr) {
                  return done(folderDeleteErr);
                }

                // Set assertions
                (folderDeleteRes.body._id).should.equal(folderSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Folder if not signed in', function (done) {
    // Set Folder user
    folder.user = user;

    // Create new Folder model instance
    var folderObj = new Folder(folder);

    // Save the Folder
    folderObj.save(function () {
      // Try deleting Folder
      request(app).delete('/api/folders/' + folderObj._id)
        .expect(403)
        .end(function (folderDeleteErr, folderDeleteRes) {
          // Set message assertion
          (folderDeleteRes.body.message).should.match('User is not authorized');

          // Handle Folder error error
          done(folderDeleteErr);
        });

    });
  });

  it('should be able to get a single Folder that has an orphaned user reference', function (done) {
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

          // Save a new Folder
          agent.post('/api/folders')
            .send(folder)
            .expect(200)
            .end(function (folderSaveErr, folderSaveRes) {
              // Handle Folder save error
              if (folderSaveErr) {
                return done(folderSaveErr);
              }

              // Set assertions on new Folder
              (folderSaveRes.body.name).should.equal(folder.name);
              should.exist(folderSaveRes.body.user);
              should.equal(folderSaveRes.body.user._id, orphanId);

              // force the Folder to have an orphaned user reference
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

                    // Get the Folder
                    agent.get('/api/folders/' + folderSaveRes.body._id)
                      .expect(200)
                      .end(function (folderInfoErr, folderInfoRes) {
                        // Handle Folder error
                        if (folderInfoErr) {
                          return done(folderInfoErr);
                        }

                        // Set assertions
                        (folderInfoRes.body._id).should.equal(folderSaveRes.body._id);
                        (folderInfoRes.body.name).should.equal(folder.name);
                        should.equal(folderInfoRes.body.user, undefined);

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
      Folder.remove().exec(done);
    });
  });
});
