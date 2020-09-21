'use strict'

/*
|--------------------------------------------------------------------------
| PermissaoSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Permissao = use('App/Models/Permissao')

class PermissaoSeeder {
  async run () {
    await Permissao.create({ // permissão bolsista
      id: 1,
      meu_horario: true
    })

    await Permissao.create({ // permissão escola
      id: 2,
      agendar_visita: true,
      meus_agendamentos: true
    })
  }
}

module.exports = PermissaoSeeder
