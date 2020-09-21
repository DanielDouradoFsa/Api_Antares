'use strict'

/*
|--------------------------------------------------------------------------
| FuncionarioSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Funcionario = use('App/Models/Funcionario')
const Permissao = use('App/Models/Permissao')
const User = use('App/Models/User')
const Endereco = use('App/Models/endereco')
const Pessoa =  use('App/Models/Pessoa')

class FuncionarioSeeder {
  async run () {
    const permissao = await Permissao.create({
      id: 3,
      gerir_bolsista: true,
      gerir_funcionario: true,
      agendamento: true,
      relatorio: true,
      cadastrar_atividade: true,
      gerir_horario_bolsista: true,
      gerir_backup: true,
      ver_escolas: true,
      meu_horario: true,
      agendar_visita: true,
      meus_agendamentos: true,
      editar_dados: true
    })

    const user = await User.create({
      username: 'administrador',
      password: '123456',
      permissao_id: permissao.id
    })

    const endereco = await Endereco.create({
      estado: 'BA',
      cidade: 'Feira de Santana',
      bairro: '',
      rua: '',
      numero: ''
    })

    const pessoa = await Pessoa.create({
      nome: 'Adm',
      cpf: '12345678910',
      email: 'adm@gmail.com',
      telefone: '123456789',
      endereco_id: endereco.id
    })

    await Funcionario.create({
      user_id: user.id,
      pessoa_id: pessoa.id
    })
  }
}

module.exports = FuncionarioSeeder
