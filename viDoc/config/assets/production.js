'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/angular-material/angular-material.min.css',
        'public/lib/AdminLTE/dist/css/AdminLTE.min.css',
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-aria/angular-aria.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-material/angular-material.min.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/AdminLTE/dist/js/app.min.js',
        'public/lib/jquery-ui/jquery-ui.min.js',
        'public/lib/ckeditor/ckeditor.js',
        'public/lib/angular-ui-scroll/dist/ui-scroll.min.js',
        'public/lib/angular-ui-scroll/dist/ui-scroll-grid.min.js'
        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
