(function () {
  'use strict';

  describe('Folders Route Tests', function () {
    // Initialize global variables
    var $scope,
      FoldersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _FoldersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      FoldersService = _FoldersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('folders');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/folders');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          FoldersController,
          mockFolder;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('folders.view');
          $templateCache.put('modules/folders/client/views/view-folder.client.view.html', '');

          // create mock Folder
          mockFolder = new FoldersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Folder Name'
          });

          // Initialize Controller
          FoldersController = $controller('FoldersController as vm', {
            $scope: $scope,
            folderResolve: mockFolder
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:folderId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.folderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            folderId: 1
          })).toEqual('/folders/1');
        }));

        it('should attach an Folder to the controller scope', function () {
          expect($scope.vm.folder._id).toBe(mockFolder._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/folders/client/views/view-folder.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          FoldersController,
          mockFolder;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('folders.create');
          $templateCache.put('modules/folders/client/views/form-folder.client.view.html', '');

          // create mock Folder
          mockFolder = new FoldersService();

          // Initialize Controller
          FoldersController = $controller('FoldersController as vm', {
            $scope: $scope,
            folderResolve: mockFolder
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.folderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/folders/create');
        }));

        it('should attach an Folder to the controller scope', function () {
          expect($scope.vm.folder._id).toBe(mockFolder._id);
          expect($scope.vm.folder._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/folders/client/views/form-folder.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          FoldersController,
          mockFolder;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('folders.edit');
          $templateCache.put('modules/folders/client/views/form-folder.client.view.html', '');

          // create mock Folder
          mockFolder = new FoldersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Folder Name'
          });

          // Initialize Controller
          FoldersController = $controller('FoldersController as vm', {
            $scope: $scope,
            folderResolve: mockFolder
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:folderId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.folderResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            folderId: 1
          })).toEqual('/folders/1/edit');
        }));

        it('should attach an Folder to the controller scope', function () {
          expect($scope.vm.folder._id).toBe(mockFolder._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/folders/client/views/form-folder.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
