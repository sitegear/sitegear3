/*jslint node: true, nomen: true, white: true, unparam: true*/
/*globals describe, beforeEach, afterEach, it, expect, spyOn*/
/*!
 * Sitegear3
 * Copyright(c) 2014 Ben New, Sitegear.org
 * MIT Licensed
 */

(function (_, sitegear3, mockMediator) {
	"use strict";
	require('../../setupTests');

	describe('Application lifecycle: configureRoutes()', function () {
		var app;
		describe('Works correctly with correct configuration', function () {
			beforeEach(function () {
				app = sitegear3(require('../settings.json'));
				app.data = mockMediator();
				app.component = function (name) {
					if (name === 'products') {
						return {
							index: _.noop,
							item: _.noop
						};
					}
					if (name === 'default') {
						return {
							index: _.noop
						};
					}
					return null;
				};
				app.configureRoutes([
					{
						path: '/products',
						component: 'products'
					},
					{
						path: '/products/:item',
						component: 'products',
						action: 'item'
					},
					{
						path: '*'
					}
				]);
			});
			it('Adds all expected routes', function () {
				expect(_.size(app.routes.get)).toBe(3);
				expect(_.size(app.routes.post)).toBe(0);
				expect(_.size(app.routes.put)).toBe(0);
				expect(_.size(app.routes.dele)).toBe(0);
			});
			it('Correctly configures static routes to non-default components', function () {
				expect(app.routes.get[0].path).toBe('/products');
				expect(app.routes.get[0].method).toBe('get');
				expect(app.routes.get[0].callbacks.length).toBe(1);
				expect(_.isFunction(app.routes.get[0].callbacks[0])).toBeTruthy();
				expect(app.routes.get[0].keys.length).toBe(0);
				expect(app.routes.get[0].regexp.test('/products')).toBeTruthy();
				expect(app.routes.get[0].regexp.test('/products/')).toBeTruthy();
				expect(app.routes.get[0].regexp.test('/products/widgets')).toBeFalsy();
				expect(app.routes.get[0].regexp.test('/products/widgets/')).toBeFalsy();
				expect(app.routes.get[0].regexp.test('/')).toBeFalsy();
				expect(app.routes.get[0].regexp.test('//')).toBeFalsy();
				expect(app.routes.get[0].regexp.test('/about')).toBeFalsy();
				expect(app.routes.get[0].regexp.test('/about/')).toBeFalsy();
				expect(app.routes.get[0].regexp.test('/about/history')).toBeFalsy();
				expect(app.routes.get[0].regexp.test('/about/history/')).toBeFalsy();
			});
			it('Correctly configures slug routes', function () {
				expect(app.routes.get[1].path).toBe('/products/:item');
				expect(app.routes.get[1].method).toBe('get');
				expect(app.routes.get[1].callbacks.length).toBe(1);
				expect(_.isFunction(app.routes.get[1].callbacks[0])).toBeTruthy();
				expect(app.routes.get[1].keys.length).toBe(1);
				expect(app.routes.get[1].regexp.test('/products')).toBeFalsy();
				expect(app.routes.get[1].regexp.test('/products/')).toBeFalsy();
				expect(app.routes.get[1].regexp.test('/products/widgets')).toBeTruthy();
				expect(app.routes.get[1].regexp.test('/products/widgets/')).toBeTruthy();
				expect(app.routes.get[1].regexp.test('/')).toBeFalsy();
				expect(app.routes.get[1].regexp.test('//')).toBeFalsy();
				expect(app.routes.get[1].regexp.test('/about')).toBeFalsy();
				expect(app.routes.get[1].regexp.test('/about/')).toBeFalsy();
				expect(app.routes.get[1].regexp.test('/about/history')).toBeFalsy();
				expect(app.routes.get[1].regexp.test('/about/history/')).toBeFalsy();
			});
			it('Correctly configures the fallback route', function () {
				expect(app.routes.get[2].path).toBe('*');
				expect(app.routes.get[2].method).toBe('get');
				expect(app.routes.get[2].callbacks.length).toBe(1);
				expect(_.isFunction(app.routes.get[2].callbacks[0])).toBeTruthy();
				expect(app.routes.get[2].keys.length).toBe(0);
				expect(app.routes.get[2].regexp.test('/products')).toBeTruthy();
				expect(app.routes.get[2].regexp.test('/products/')).toBeTruthy();
				expect(app.routes.get[2].regexp.test('/products/widgets')).toBeTruthy();
				expect(app.routes.get[2].regexp.test('/products/widgets/')).toBeTruthy();
				expect(app.routes.get[2].regexp.test('/')).toBeTruthy();
				expect(app.routes.get[2].regexp.test('//')).toBeTruthy();
				expect(app.routes.get[2].regexp.test('/about')).toBeTruthy();
				expect(app.routes.get[2].regexp.test('/about/')).toBeTruthy();
				expect(app.routes.get[2].regexp.test('/about/history')).toBeTruthy();
				expect(app.routes.get[2].regexp.test('/about/history/')).toBeTruthy();
			});
			afterEach(function () {
				app.stop();
			});
		});
		describe('Handles invalid component', function () {
			beforeEach(function () {
				app = sitegear3(require('../settings.json'));
				app.data = mockMediator();
			});
			it('Throws an error when invalid component is specified', function () {
				try {
					app.configureRoutes([
						{
							path: '/some/path',
							component: 'INVALID'
						}
					]);
					expect('This code should not execute').toBeFalsy();
				} catch (error) {
					expect(error.toString()).toMatch(/Error: Cannot find module 'sitegear3-component-INVALID'/);
				}
			});
			afterEach(function () {
				app.stop();
			});
		});
		describe('Handles unknown action', function () {
			beforeEach(function () {
				app = sitegear3(require('../settings.json'));
				app.data = mockMediator();
				app.component = function (name) {
					if (name === 'default') {
						return {
							index: _.noop
						};
					}
					return null;
				};
			});
			it('Throws an error when invalid action is specified in a valid component', function () {
				try {
					app.configureRoutes([
						{
							path: '/another/path',
							action: 'INVALID'
						}
					]);
					expect('This code should not execute').toBeFalsy();
				} catch (error) {
					expect(error.toString()).toBe('Error: Unknown action "INVALID" specified for route at URL "/another/path"');
				}
			});
			afterEach(function () {
				app.stop();
			});
		});
	});
}(require('lodash'), require('../../../'), require('../_mock/mediator')));
