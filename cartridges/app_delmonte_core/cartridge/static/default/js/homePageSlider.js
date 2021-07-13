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

/***/ "./.tmp/app_delmonte_core/js/homePageSlider.js":
/*!*****************************************************!*\
  !*** ./.tmp/app_delmonte_core/js/homePageSlider.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports) {

eval("\n\nexports.init = function () {\n  $('#homepage-slider') // responsive slides\n  .on('jcarousel:create jcarousel:reload', function () {\n    var element = $(this),\n        width = element.innerWidth();\n    element.jcarousel('items').css('width', width + 'px');\n  }).jcarousel({\n    wrap: 'circular'\n  }).jcarouselAutoscroll({\n    interval: 5000\n  });\n  $('#homepage-slider .jcarousel-control').on('jcarouselpagination:active', 'a', function () {\n    $(this).addClass('active');\n  }).on('jcarouselpagination:inactive', 'a', function () {\n    $(this).removeClass('active');\n  }).jcarouselPagination({\n    item: function item(page) {\n      return '<a href=\"#' + page + '\">' + page + '</a>';\n    }\n  });\n  $('#vertical-carousel').jcarousel({\n    vertical: true\n  }).jcarouselAutoscroll({\n    interval: 5000\n  });\n  $('#vertical-carousel .jcarousel-prev').on('jcarouselcontrol:active', function () {\n    $(this).removeClass('inactive');\n  }).on('jcarouselcontrol:inactive', function () {\n    $(this).addClass('inactive');\n  }).jcarouselControl({\n    target: '-=1'\n  });\n  $('#vertical-carousel .jcarousel-next').on('jcarouselcontrol:active', function () {\n    $(this).removeClass('inactive');\n  }).on('jcarouselcontrol:inactive', function () {\n    $(this).addClass('inactive');\n  }).jcarouselControl({\n    target: '+=1'\n  });\n};\n\n//# sourceURL=webpack://sfra/./.tmp/app_delmonte_core/js/homePageSlider.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./.tmp/app_delmonte_core/js/homePageSlider.js"](0, __webpack_exports__);
/******/ 	
/******/ })()
;