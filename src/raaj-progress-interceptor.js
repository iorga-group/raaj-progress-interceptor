/*
 * Copyright (C) 2013 Iorga Group
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see [http://www.gnu.org/licenses/].
 */
(function () {
    'use strict';

    angular.module('raaj-progress-interceptor', [])
        .provider('raajProgressInterceptor', function() {
            var defaultMessage;
            var callback = function(nbRequests, message, config) {
                var raajGlobalProgressEl = jQuery('[raajGlobalProgress]');
                if (raajGlobalProgressEl.length == 0) {
                    jQuery(document.body).append('<div raajGlobalProgress><span raajGlobalProgressImg ></span><span raajGlobalProgressNbRequests class="badge"></span><span raajGlobalProgressMessage /></div>');
                    raajGlobalProgressEl = jQuery('[raajGlobalProgress]');
                }
                var raajGlobalProgressMessageEl = raajGlobalProgressEl.find('[raajGlobalProgressMessage]');
                if (nbRequests == 0) {
                    raajGlobalProgressEl.hide();
                    raajGlobalProgressMessageEl.empty();
                } else {
                    var raajGlobalProgressNbRequestsEl = raajGlobalProgressEl.find('[raajGlobalProgressNbRequests]');
                    if (nbRequests > 1)	{
                        raajGlobalProgressNbRequestsEl.text(nbRequests);
                        raajGlobalProgressNbRequestsEl.show();
                    } else {
                        raajGlobalProgressNbRequestsEl.hide();
                    }
                    // first apply default message if any
                    if (!message) {
                        if (defaultMessage) {
                            message = defaultMessage;
                        } else if (config) {
                            // if there is no message, defaultMessage but config is defined, take the url
                            message = config.url;
                        }
                    }
                    if (message) {
                        raajGlobalProgressMessageEl.text(message);
                    }
                    raajGlobalProgressEl.show();
                }
            };

            this.setCallback = function(callbackParam) {
                callback = callbackParam;
            };

            this.setDefaultMessage = function(defaultMessageParam) {
                defaultMessage = defaultMessageParam;
            };

            this.$get = function() {
                return {
                    callback: callback
                };
            };
        })
        .factory('raajProgressRequestInterceptor', function($q, $rootScope, raajProgressInterceptor) {
        	var nbRequests = 0;
            return {
                'request': function(config) {
                    nbRequests++;
                    raajProgressInterceptor.callback(nbRequests, config.raajProgressMessage, config);
                    return config;
                },
                'response': function(response) {
                    nbRequests--;
                    raajProgressInterceptor.callback(nbRequests);
                    return response;
                },
                'responseError': function(rejection) {
                    nbRequests--;
                    raajProgressInterceptor.callback(nbRequests);
                    return $q.reject(rejection);
                }
            };
        })
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('raajProgressRequestInterceptor');
        })
    ;
})();