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

// Retorna todos os usuários ativos
Route.get('/usuarios', 'UserController.index').middleware('auth')

// Atualiza um usuário
Route.patch('/usuarios', 'UserController.update').middleware('auth')

// Acesso as escolas
Route.get('/escolas', 'EscolaController.index').middleware('auth')
Route.post('/escolas', 'EscolaController.store')
Route.patch('/escolas', 'EscolaController.update').middleware('auth')
Route.delete('/escolas', 'EscolaController.destroy').middleware('auth')
Route.get('/escolas/conta', 'EscolaController.show').middleware('auth') // Meus dados (Escola)

// Acesso aos funcionarios
Route.get('/funcionarios', 'FuncionarioController.index').middleware('auth')
Route.post('/funcionarios', 'FuncionarioController.store').middleware('auth')
Route.patch('/funcionarios', 'FuncionarioController.update').middleware('auth')
Route.delete('/funcionarios', 'FuncionarioController.destroy').middleware('auth')
Route.get('/funcionarios/conta', 'FuncionarioController.show').middleware('auth') // Meus dados (funcionarios)

// Acesso aos bolsistas
/*Route.get('/bolsistas', 'BolsistaController.index').middleware('auth')
Route.post('/bolsistas', 'BolsistaController.create').middleware('auth')
Route.patch('/bolsistas', 'BolsistaController.update').middleware('auth')*/
Route.delete('/bolsistas', 'BolsistaController.destroy').middleware('auth')
/*Route.get('/bolsistas/conta', 'BolsistaController.show').middleware('auth')*/ // Meus dados (bolsistas)
Route.resource('/bolsistas', 'BolsistaController').middleware('auth')

Route.get('/horarios', 'HorarioController.index').middleware('auth')
Route.post('/horarios', 'HorarioController.store').middleware('auth')
Route.patch('/horarios', 'HorarioController.update').middleware('auth')
Route.delete('/horarios', 'HorarioController.destroy').middleware('auth')
Route.get('/horarios/conta', 'HorarioController.show').middleware('auth')


/** Rotas a serem avaliadas

 // Acesso dos dados pessoais pelo usuário
Route.get('/usuario/conta', 'MinhaContaController.show').middleware('auth')
Route.patch('/usuario/conta', 'MinhaContaController.update').middleware('auth')

// Acesso aos usuarios gerais
Route.resource('/usuarios', 'UserController').apiOnly()

 **/
