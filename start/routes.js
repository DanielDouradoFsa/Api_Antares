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

Route.post('/login', 'UserController.login').middleware('guest')
Route.get('/logout', 'UserController.logout').middleware('auth')
// Acesso dos dados pessoais pelo usuário
Route.get('/usuario/conta', 'MinhaContaController.show').middleware('auth')
Route.patch('/usuario/conta', 'MinhaContaController.update').middleware('auth')

// Acesso aos usuarios gerais
Route.resource('/usuarios', 'UserController').apiOnly()

// Acesso aos usuarios gerais
Route.resource('/escolas', 'EscolaController').apiOnly().middleware('auth')

// Acesso aos usuarios gerais
Route.resource('/funcionarios', 'FuncionarioController').apiOnly().middleware('auth')

// Acesso aos usuarios gerais
Route.resource('/bolsistas', 'BolsistaController').apiOnly().middleware('auth')

