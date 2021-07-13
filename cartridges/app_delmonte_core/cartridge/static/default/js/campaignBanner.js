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

/***/ "./.tmp/app_delmonte_core/js/campaignBanner.js":
/*!*****************************************************!*\
  !*** ./.tmp/app_delmonte_core/js/campaignBanner.js ***!
  \*****************************************************/
/***/ (function() {

eval("\n\n$(document).ready(function () {\n  if (window.resetCampaignBannerSessionToken) {\n    window.sessionStorage.removeItem('hide_campaign_banner');\n  }\n\n  var campaignBannerStatus = window.sessionStorage.getItem('hide_campaign_banner');\n  $('.campaign-banner .close').on('click', function () {\n    $('.campaign-banner').addClass('d-none');\n    window.sessionStorage.setItem('hide_campaign_banner', '1');\n  });\n\n  if (!campaignBannerStatus || campaignBannerStatus < 0) {\n    $('.campaign-banner').removeClass('d-none');\n  }\n});\n\n//# sourceURL=webpack://sfra/./.tmp/app_delmonte_core/js/campaignBanner.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./.tmp/app_delmonte_core/js/campaignBanner.js"]();
/******/ 	
/******/ })()
;