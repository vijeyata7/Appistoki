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

/***/ "./.tmp/app_delmonte_core/js/addressBook.js":
/*!**************************************************!*\
  !*** ./.tmp/app_delmonte_core/js/addressBook.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval("\n\nvar processInclude = __webpack_require__(/*! ./util */ \"./.tmp/app_delmonte_core/js/util.js\");\n\n$(document).ready(function () {\n  processInclude(__webpack_require__(/*! ./addressBook/addressBook */ \"./.tmp/app_delmonte_core/js/addressBook/addressBook.js\"));\n});\n\n//# sourceURL=webpack://sfra/./.tmp/app_delmonte_core/js/addressBook.js?");

/***/ }),

/***/ "./.tmp/app_delmonte_core/js/addressBook/addressBook.js":
/*!**************************************************************!*\
  !*** ./.tmp/app_delmonte_core/js/addressBook/addressBook.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("\n\nvar formValidation = __webpack_require__(/*! ../components/formValidation */ \"./.tmp/app_delmonte_core/js/components/formValidation.js\");\n\nvar url;\nvar isDefault;\n/**\n * Create an alert to display the error message\n * @param {Object} message - Error message to display\n */\n\nfunction createErrorNotification(message) {\n  var errorHtml = '<div class=\"alert alert-danger alert-dismissible valid-cart-error ' + 'fade show\" role=\"alert\">' + '<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">' + '<span aria-hidden=\"true\">&times;</span>' + '</button>' + message + '</div>';\n  $('.error-messaging').append(errorHtml);\n}\n\nmodule.exports = {\n  removeAddress: function removeAddress() {\n    $('.remove-address').on('click', function (e) {\n      e.preventDefault();\n      isDefault = $(this).data('default');\n\n      if (isDefault) {\n        url = $(this).data('url') + '?addressId=' + $(this).data('id') + '&isDefault=' + isDefault;\n      } else {\n        url = $(this).data('url') + '?addressId=' + $(this).data('id');\n      }\n\n      $('.product-to-remove').empty().append($(this).data('id'));\n    });\n  },\n  removeAddressConfirmation: function removeAddressConfirmation() {\n    $('.delete-confirmation-btn').click(function (e) {\n      e.preventDefault();\n      $.ajax({\n        url: url,\n        type: 'get',\n        dataType: 'json',\n        success: function success(data) {\n          $('#uuid-' + data.UUID).remove();\n\n          if (isDefault) {\n            var addressId = $('.card .address-heading').first().text();\n            var addressHeading = addressId + ' (' + data.defaultMsg + ')';\n            $('.card .address-heading').first().text(addressHeading);\n            $('.card .card-make-default-link').first().remove();\n            $('.remove-address').data('default', true);\n\n            if (data.message) {\n              var toInsert = '<div><h3>' + data.message + '</h3><div>';\n              $('.addressList').after(toInsert);\n            }\n          }\n        },\n        error: function error(err) {\n          if (err.responseJSON.redirectUrl) {\n            window.location.href = err.responseJSON.redirectUrl;\n          } else {\n            createErrorNotification(err.responseJSON.errorMessage);\n          }\n\n          $.spinner().stop();\n        }\n      });\n    });\n  },\n  submitAddress: function submitAddress() {\n    $('form.address-form').submit(function (e) {\n      var $form = $(this);\n      e.preventDefault();\n      url = $form.attr('action');\n      $form.spinner().start();\n      $('form.address-form').trigger('address:submit', e);\n      $.ajax({\n        url: url,\n        type: 'post',\n        dataType: 'json',\n        data: $form.serialize(),\n        success: function success(data) {\n          $form.spinner().stop();\n\n          if (!data.success) {\n            formValidation($form, data);\n          } else {\n            location.href = data.redirectUrl;\n          }\n        },\n        error: function error(err) {\n          if (err.responseJSON.redirectUrl) {\n            window.location.href = err.responseJSON.redirectUrl;\n          }\n\n          $form.spinner().stop();\n        }\n      });\n      return false;\n    });\n  }\n};\n\n//# sourceURL=webpack://sfra/./.tmp/app_delmonte_core/js/addressBook/addressBook.js?");

/***/ }),

/***/ "./.tmp/app_delmonte_core/js/components/formValidation.js":
/*!****************************************************************!*\
  !*** ./.tmp/app_delmonte_core/js/components/formValidation.js ***!
  \****************************************************************/
/***/ (function(module) {

eval("\n/**\n * Remove all validation. Should be called every time before revalidating form\n * @param {element} form - Form to be cleared\n * @returns {void}\n */\n\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction clearFormErrors(form) {\n  $(form).find('.form-control.is-invalid').removeClass('is-invalid');\n}\n\nmodule.exports = function (formElement, payload) {\n  // clear form validation first\n  clearFormErrors(formElement);\n  $('.alert', formElement).remove();\n\n  if (_typeof(payload) === 'object' && payload.fields) {\n    Object.keys(payload.fields).forEach(function (key) {\n      if (payload.fields[key]) {\n        var feedbackElement = $(formElement).find('[name=\"' + key + '\"]').parent().children('.invalid-feedback');\n\n        if (feedbackElement.length > 0) {\n          if (Array.isArray(payload[key])) {\n            feedbackElement.html(payload.fields[key].join('<br/>'));\n          } else {\n            feedbackElement.html(payload.fields[key]);\n          }\n\n          feedbackElement.siblings('.form-control').addClass('is-invalid');\n        }\n      }\n    });\n  }\n\n  if (payload && payload.error) {\n    var form = $(formElement).prop('tagName') === 'FORM' ? $(formElement) : $(formElement).parents('form');\n    form.prepend('<div class=\"alert alert-danger\" role=\"alert\">' + payload.error.join('<br/>') + '</div>');\n  }\n};\n\n//# sourceURL=webpack://sfra/./.tmp/app_delmonte_core/js/components/formValidation.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./.tmp/app_delmonte_core/js/addressBook.js");
/******/ 	
/******/ })()
;