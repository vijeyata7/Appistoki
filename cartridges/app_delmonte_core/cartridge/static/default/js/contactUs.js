/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./.tmp/app_delmonte_core/js/contactUs.js":
/*!************************************************!*\
  !*** ./.tmp/app_delmonte_core/js/contactUs.js ***!
  \************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval("\n\nvar processInclude = __webpack_require__(/*! ./util */ \"./.tmp/app_delmonte_core/js/util.js\");\n\n$(document).ready(function () {\n  processInclude(__webpack_require__(/*! ./contactUs/contactUs */ \"./.tmp/app_delmonte_core/js/contactUs/contactUs.js\"));\n});\n\n//# sourceURL=webpack://sfra/./.tmp/app_delmonte_core/js/contactUs.js?");

/***/ }),

/***/ "./.tmp/app_delmonte_core/js/contactUs/contactUs.js":
/*!**********************************************************!*\
  !*** ./.tmp/app_delmonte_core/js/contactUs/contactUs.js ***!
  \**********************************************************/
/***/ (function(module) {

eval("\n/**\n * Display the returned message.\n * @param {string} data - data returned from the server's ajax call\n * @param {Object} button - button that was clicked for contact us sign-up\n */\n\nfunction displayMessage(data, button) {\n  $.spinner().stop();\n  var status;\n\n  if (data.success) {\n    status = 'alert-success';\n  } else {\n    status = 'alert-danger';\n  }\n\n  if ($('.contact-us-signup-message').length === 0) {\n    $('body').append('<div class=\"contact-us-signup-message\"></div>');\n  }\n\n  $('.contact-us-signup-message').append('<div class=\"contact-us-signup-alert text-center ' + status + '\" role=\"alert\">' + data.msg + '</div>');\n  setTimeout(function () {\n    $('.contact-us-signup-message').remove();\n    button.removeAttr('disabled');\n  }, 3000);\n}\n\nmodule.exports = {\n  subscribeContact: function subscribeContact() {\n    $('form.contact-us').submit(function (e) {\n      e.preventDefault();\n      var form = $(this);\n      var button = $('.subscribe-contact-us');\n      var url = form.attr('action');\n      $.spinner().start();\n      button.attr('disabled', true);\n      $.ajax({\n        url: url,\n        type: 'post',\n        dataType: 'json',\n        data: form.serialize(),\n        success: function success(data) {\n          displayMessage(data, button);\n\n          if (data.success) {\n            $('.contact-us').trigger('reset');\n          }\n        },\n        error: function error(err) {\n          displayMessage(err, button);\n        }\n      });\n    });\n  }\n};\n\n//# sourceURL=webpack://sfra/./.tmp/app_delmonte_core/js/contactUs/contactUs.js?");

/***/ }),

/***/ "./.tmp/app_delmonte_core/js/util.js":
/*!*******************************************!*\
  !*** ./.tmp/app_delmonte_core/js/util.js ***!
  \*******************************************/
/***/ (function(module) {

eval("\n\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nmodule.exports = function (include) {\n  if (typeof include === 'function') {\n    include();\n  } else if (_typeof(include) === 'object') {\n    Object.keys(include).forEach(function (key) {\n      if (typeof include[key] === 'function') {\n        include[key]();\n      }\n    });\n  }\n};\n\n//# sourceURL=webpack://sfra/./.tmp/app_delmonte_core/js/util.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./.tmp/app_delmonte_core/js/contactUs.js");
/******/ 	
/******/ })()
;