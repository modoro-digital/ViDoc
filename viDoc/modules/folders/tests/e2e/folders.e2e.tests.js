'use strict';

describe('Folders E2E Tests:', function () {
  describe('Test Folders page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/folders');
      expect(element.all(by.repeater('folder in folders')).count()).toEqual(0);
    });
  });
});
