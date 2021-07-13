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

/***/ "./.tmp/app_delmonte_core/js/storeLocator.js":
/*!***************************************************!*\
  !*** ./.tmp/app_delmonte_core/js/storeLocator.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

eval("\n\nvar processInclude = __webpack_require__(/*! ./util */ \"./.tmp/app_delmonte_core/js/util.js\");\n\n$(document).ready(function () {\n  processInclude(__webpack_require__(/*! ./storeLocator/storeLocator */ \"./.tmp/app_delmonte_core/js/storeLocator/storeLocator.js\"));\n});\n\n//# sourceURL=webpack://sfra/./.tmp/app_delmonte_core/js/storeLocator.js?");

/***/ }),

/***/ "./.tmp/app_delmonte_core/js/storeLocator/storeLocator.js":
/*!****************************************************************!*\
  !*** ./.tmp/app_delmonte_core/js/storeLocator/storeLocator.js ***!
  \****************************************************************/
/***/ (function(module) {

eval("/* globals google */\n\n/**\n * appends params to a url\n * @param {string} url - Original url\n * @param {Object} params - Parameters to append\n * @returns {string} result url with appended parameters\n */\n\nfunction appendToUrl(url, params) {\n  var newUrl = url;\n  newUrl += (newUrl.indexOf('?') !== -1 ? '&' : '?') + Object.keys(params).map(function (key) {\n    return key + '=' + encodeURIComponent(params[key]);\n  }).join('&');\n  return newUrl;\n}\n/**\n * Uses google maps api to render a map\n */\n\n\nfunction maps() {\n  var map;\n  var infowindow = new google.maps.InfoWindow(); // Init U.S. Map in the center of the viewport\n\n  var latlng = new google.maps.LatLng(37.09024, -95.712891);\n  var mapOptions = {\n    scrollwheel: false,\n    zoom: 4,\n    center: latlng\n  };\n  map = new google.maps.Map($('.map-canvas')[0], mapOptions);\n  var mapdiv = $('.map-canvas').attr('data-locations');\n  mapdiv = JSON.parse(mapdiv);\n  var bounds = new google.maps.LatLngBounds(); // Customized google map marker icon with svg format\n\n  var markerImg = {\n    path: 'M13.5,30.1460153 L16.8554555,25.5 L20.0024287,25.5 C23.039087,25.5 25.5,' + '23.0388955 25.5,20.0024287 L25.5,5.99757128 C25.5,2.96091298 23.0388955,0.5 ' + '20.0024287,0.5 L5.99757128,0.5 C2.96091298,0.5 0.5,2.96110446 0.5,5.99757128 ' + 'L0.5,20.0024287 C0.5,23.039087 2.96110446,25.5 5.99757128,25.5 L10.1445445,' + '25.5 L13.5,30.1460153 Z',\n    fillColor: '#0070d2',\n    fillOpacity: 1,\n    scale: 1.1,\n    strokeColor: 'white',\n    strokeWeight: 1,\n    anchor: new google.maps.Point(13, 30),\n    labelOrigin: new google.maps.Point(12, 12)\n  };\n  Object.keys(mapdiv).forEach(function (key) {\n    var item = mapdiv[key];\n    var lable = parseInt(key, 10) + 1;\n    var storeLocation = new google.maps.LatLng(item.latitude, item.longitude);\n    var marker = new google.maps.Marker({\n      position: storeLocation,\n      map: map,\n      title: item.name,\n      icon: markerImg,\n      label: {\n        text: lable.toString(),\n        color: 'white',\n        fontSize: '16px'\n      }\n    });\n    marker.addListener('click', function () {\n      infowindow.setOptions({\n        content: item.infoWindowHtml\n      });\n      infowindow.open(map, marker);\n    }); // Create a minimum bound based on a set of storeLocations\n\n    bounds.extend(marker.position);\n  }); // Fit the all the store marks in the center of a minimum bounds when any store has been found.\n\n  if (mapdiv && mapdiv.length !== 0) {\n    map.fitBounds(bounds);\n  }\n}\n/**\n * Renders the results of the search and updates the map\n * @param {Object} data - Response from the server\n */\n\n\nfunction updateStoresResults(data) {\n  var $resultsDiv = $('.results');\n  var $mapDiv = $('.map-canvas');\n  var hasResults = data.stores.length > 0;\n\n  if (!hasResults) {\n    $('.store-locator-no-results').show();\n  } else {\n    $('.store-locator-no-results').hide();\n  }\n\n  $resultsDiv.empty().data('has-results', hasResults).data('radius', data.radius).data('search-key', data.searchKey);\n  $mapDiv.attr('data-locations', data.locations);\n\n  if ($mapDiv.data('has-google-api')) {\n    maps();\n  } else {\n    $('.store-locator-no-apiKey').show();\n  }\n\n  if (data.storesResultsHtml) {\n    $resultsDiv.append(data.storesResultsHtml);\n  }\n}\n/**\n * Search for stores with new zip code\n * @param {HTMLElement} element - the target html element\n * @returns {boolean} false to prevent default event\n */\n\n\nfunction _search(element) {\n  var dialog = element.closest('.in-store-inventory-dialog');\n  var spinner = dialog.length ? dialog.spinner() : $.spinner();\n  spinner.start();\n  var $form = element.closest('.store-locator');\n  var radius = $('.results').data('radius');\n  var url = $form.attr('action');\n  var urlParams = {\n    radius: radius\n  };\n  var payload = $form.is('form') ? $form.serialize() : {\n    postalCode: $form.find('[name=\"postalCode\"]').val()\n  };\n  url = appendToUrl(url, urlParams);\n  $.ajax({\n    url: url,\n    type: $form.attr('method'),\n    data: payload,\n    dataType: 'json',\n    success: function success(data) {\n      spinner.stop();\n      updateStoresResults(data);\n      $('.select-store').prop('disabled', true);\n    }\n  });\n  return false;\n}\n\nmodule.exports = {\n  init: function init() {\n    if ($('.map-canvas').data('has-google-api')) {\n      maps();\n    } else {\n      $('.store-locator-no-apiKey').show();\n    }\n\n    if (!$('.results').data('has-results')) {\n      $('.store-locator-no-results').show();\n    }\n  },\n  detectLocation: function detectLocation() {\n    // clicking on detect location.\n    $('.detect-location').on('click', function () {\n      $.spinner().start();\n\n      if (!navigator.geolocation) {\n        $.spinner().stop();\n        return;\n      }\n\n      navigator.geolocation.getCurrentPosition(function (position) {\n        var $detectLocationButton = $('.detect-location');\n        var url = $detectLocationButton.data('action');\n        var radius = $('.results').data('radius');\n        var urlParams = {\n          radius: radius,\n          lat: position.coords.latitude,\n          long: position.coords.longitude\n        };\n        url = appendToUrl(url, urlParams);\n        $.ajax({\n          url: url,\n          type: 'get',\n          dataType: 'json',\n          success: function success(data) {\n            $.spinner().stop();\n            updateStoresResults(data);\n            $('.select-store').prop('disabled', true);\n          }\n        });\n      });\n    });\n  },\n  search: function search() {\n    $('.store-locator-container form.store-locator').submit(function (e) {\n      e.preventDefault();\n\n      _search($(this));\n    });\n    $('.store-locator-container .btn-storelocator-search[type=\"button\"]').click(function (e) {\n      e.preventDefault();\n\n      _search($(this));\n    });\n  },\n  changeRadius: function changeRadius() {\n    $('.store-locator-container .radius').change(function () {\n      var radius = $(this).val();\n      var searchKeys = $('.results').data('search-key');\n      var url = $(this).data('action-url');\n      var urlParams = {};\n\n      if (searchKeys.postalCode) {\n        urlParams = {\n          radius: radius,\n          postalCode: searchKeys.postalCode\n        };\n      } else if (searchKeys.lat && searchKeys.long) {\n        urlParams = {\n          radius: radius,\n          lat: searchKeys.lat,\n          long: searchKeys.long\n        };\n      }\n\n      url = appendToUrl(url, urlParams);\n      var dialog = $(this).closest('.in-store-inventory-dialog');\n      var spinner = dialog.length ? dialog.spinner() : $.spinner();\n      spinner.start();\n      $.ajax({\n        url: url,\n        type: 'get',\n        dataType: 'json',\n        success: function success(data) {\n          spinner.stop();\n          updateStoresResults(data);\n          $('.select-store').prop('disabled', true);\n        }\n      });\n    });\n  },\n  selectStore: function selectStore() {\n    $('.store-locator-container').on('click', '.select-store', function (e) {\n      e.preventDefault();\n      var selectedStore = $(':checked', '.results-card .results');\n      var data = {\n        storeID: selectedStore.val(),\n        searchRadius: $('#radius').val(),\n        searchPostalCode: $('.results').data('search-key').postalCode,\n        storeDetailsHtml: selectedStore.siblings('label').find('.store-details').html(),\n        event: e\n      };\n      $('body').trigger('store:selected', data);\n    });\n  },\n  updateSelectStoreButton: function updateSelectStoreButton() {\n    $('body').on('change', '.select-store-input', function () {\n      $('.select-store').prop('disabled', false);\n    });\n  }\n};\n\n//# sourceURL=webpack://sfra/./.tmp/app_delmonte_core/js/storeLocator/storeLocator.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./.tmp/app_delmonte_core/js/storeLocator.js");
/******/ 	
/******/ })()
;