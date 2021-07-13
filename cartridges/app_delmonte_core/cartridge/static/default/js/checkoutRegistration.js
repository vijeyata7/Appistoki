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

/***/ "./.tmp/app_delmonte_core/js/checkoutRegistration.js":
/*!***********************************************************!*\
  !*** ./.tmp/app_delmonte_core/js/checkoutRegistration.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval("\n\nvar formValidation = __webpack_require__(/*! ./components/formValidation */ \"./.tmp/app_delmonte_core/js/components/formValidation.js\");\n\n$(document).ready(function () {\n  $('form.checkout-registration').submit(function (e) {\n    var form = $(this);\n    e.preventDefault();\n    var url = form.attr('action');\n    form.spinner().start();\n    $.ajax({\n      url: url,\n      type: 'post',\n      dataType: 'json',\n      data: form.serialize(),\n      success: function success(data) {\n        form.spinner().stop();\n\n        if (!data.success) {\n          formValidation(form, data);\n        } else {\n          location.href = data.redirectUrl;\n        }\n      },\n      error: function error(err) {\n        if (err.responseJSON.redirectUrl) {\n          window.location.href = err.responseJSON.redirectUrl;\n        }\n\n        form.spinner().stop();\n      }\n    });\n    return false;\n  });\n});\n\n//# sourceURL=webpack://sfra/./.tmp/app_delmonte_core/js/checkoutRegistration.js?");

/***/ }),

/***/ "./.tmp/app_delmonte_core/js/components/formValidation.js":
/*!****************************************************************!*\
  !*** ./.tmp/app_delmonte_core/js/components/formValidation.js ***!
  \****************************************************************/
/***/ (function(module) {

eval("\n/**\n * Remove all validation. Should be called every time before revalidating form\n * @param {element} form - Form to be cleared\n * @returns {void}\n */\n\nfunction _typeof(obj) { \"@babel/helpers - typeof\"; if (typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; } return _typeof(obj); }\n\nfunction clearFormErrors(form) {\n  $(form).find('.form-control.is-invalid').removeClass('is-invalid');\n}\n\nmodule.exports = function (formElement, payload) {\n  // clear form validation first\n  clearFormErrors(formElement);\n  $('.alert', formElement).remove();\n\n  if (_typeof(payload) === 'object' && payload.fields) {\n    Object.keys(payload.fields).forEach(function (key) {\n      if (payload.fields[key]) {\n        var feedbackElement = $(formElement).find('[name=\"' + key + '\"]').parent().children('.invalid-feedback');\n\n        if (feedbackElement.length > 0) {\n          if (Array.isArray(payload[key])) {\n            feedbackElement.html(payload.fields[key].join('<br/>'));\n          } else {\n            feedbackElement.html(payload.fields[key]);\n          }\n\n          feedbackElement.siblings('.form-control').addClass('is-invalid');\n        }\n      }\n    });\n  }\n\n  if (payload && payload.error) {\n    var form = $(formElement).prop('tagName') === 'FORM' ? $(formElement) : $(formElement).parents('form');\n    form.prepend('<div class=\"alert alert-danger\" role=\"alert\">' + payload.error.join('<br/>') + '</div>');\n  }\n};\n\n//# sourceURL=webpack://sfra/./.tmp/app_delmonte_core/js/components/formValidation.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./.tmp/app_delmonte_core/js/checkoutRegistration.js");
/******/ 	
/******/ })()
;