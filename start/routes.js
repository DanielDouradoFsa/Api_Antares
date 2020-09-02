'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.post('/login', 'LoginController.login').middleware('guest')
Route.get('/logout', 'LoginController.logout').middleware('auth')

Route.get('/conta/usuario', 'MinhaContaController.show').middleware('auth')
Route.patch('/conta/usuario', 'MinhaContaController.update').middleware('auth')

Route.resource('/usuarios', 'UserController').apiOnly()
