'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with funcionarios
 */

const Database = use("Database")
const Funcionario = use('App/Models/Funcionario')
const Permissao = use('App/Models/Permissao')
const User = use('App/Models/User')
const Endereco = use('App/Models/endereco')
const Pessoa =  use('App/Models/Pessoa')
const { validateAll } = use('Validator')

class FuncionarioController {

  async index ({ response }) {

    try{
      const funcionarios = await Funcionario
        .query()
        .with('pessoa.endereco')
        .with('usuario.permissao')
        .fetch()

      return response.status(200).json(funcionarios)

    }catch (err){
      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }

  }

  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    try{
      const erroMessage = {
        'username.required': 'Esse campo é obrigatório',
        'username.unique': 'Esse usuário já existe',
        'username.min': 'O campo deve ter no mínimo 5 caracteres',
        'password.required': 'Esse campo é obrigatório',
        'password.min': 'O campo deve ter no mínimo 6 caracteres',
        'estado.required': 'Esse campo é obrigatório',
        'cidade.required': 'Esse campo é obrigatório',
        'bairro.required': 'Esse campo é obrigatório',
        'rua.required': 'Esse campo é obrigatório',
        'numero.required': 'Esse campo é obrigatório',
        'numero.integer': 'Informe um valor inteiro',
        'nome.required': 'Esse campo é obrigatório',
        'telefone.required': 'Esse campo é obrigatório',
        'telefone.integer': 'Informe um valor inteiro',
        'email.required': 'Esse campo é obrigatório',
        'email.email': 'Informe um email válido',
        'email.unique': 'Esse email já existe',
        'cpf.required': 'Esse campo é obrigatório',
        'cpf.unique': 'Esse cpf já existe',
        'gerir_bolsista.boolean': 'Informe um valor boleano',
        'gerir_bolsista.required': 'Esse campo é obrigatório',
        'gerir_funcionario.boolean': 'Informe um valor boleano',
        'gerir_funcionario.required': 'Esse campo é obrigatório',
        'agendamento.boolean': 'Informe um valor boleano',
        'agendamento.required': 'Esse campo é obrigatório',
        'relatorio.boolean': 'Informe um valor boleano',
        'relatorio.required': 'Esse campo é obrigatório',
        'cadastrar_atividade.boolean': 'Informe um valor boleano',
        'cadastrar_atividade.required': 'Esse campo é obrigatório',
        'gerir_horario_bolsista.boolean': 'Informe um valor boleano',
        'gerir_horario_bolsista.required': 'Esse campo é obrigatório',
        'gerir_backup.boolean': 'Informe um valor boleano',
        'gerir_backup.required': 'Esse campo é obrigatório',
        'ver_escolas.boolean': 'Informe um valor boleano',
        'ver_escolas.required': 'Esse campo é obrigatório',
        'meu_horario.boolean': 'Informe um valor boleano',
        'meu_horario.required': 'Esse campo é obrigatório',
        'agendar_visita.boolean': 'Informe um valor boleano',
        'agendar_visita.required': 'Esse campo é obrigatório',
        'meus_agendamentos.boolean': 'Informe um valor boleano',
        'meus_agendamentos.required': 'Esse campo é obrigatório',
        'editar_dados.boolean': 'Informe um valor boleano',
        'editar_dados.required': 'Esse campo é obrigatório',
      }

      const validation = await validateAll(request.all(), {
        username: 'required|min:5|unique:users',
        password: 'required|min:6',
        estado: 'required',
        cidade: 'required',
        cpf: 'required|unique:pessoas',
        bairro: 'required',
        rua: 'required',
        numero: 'required|integer',
        nome: 'required',
        telefone: 'required|integer',
        email: 'required|email|unique:pessoas',
        gerir_bolsista: 'required|boolean',
        gerir_funcionario: 'required|boolean',
        agendamento: 'required|boolean',
        relatorio: 'required|boolean',
        cadastrar_atividade: 'required|boolean',
        gerir_horario_bolsista: 'required|boolean',
        gerir_backup: 'required|boolean',
        ver_escolas: 'required|boolean',
        meu_horario: 'required|boolean',
        agendar_visita: 'required|boolean',
        meus_agendamentos: 'required|boolean',
        editar_dados: 'required|boolean'
      }, erroMessage)

      if(validation.fails()){
        return response.status(400).send({
          message: validation.messages()
        })
      }

      const {
        username,
        password,
        estado,
        cidade,
        bairro,
        rua,
        numero,
        nome,
        telefone,
        email,
        cpf,
        gerir_bolsista,
        gerir_funcionario,
        agendamento,
        relatorio,
        cadastrar_atividade,
        gerir_horario_bolsista,
        gerir_backup,
        ver_escolas,
        meu_horario,
        agendar_visita,
        meus_agendamentos,
        editar_dados
      } = request.all()

      const permissao = await Permissao.create({
        gerir_bolsista,
        gerir_funcionario,
        agendamento,
        relatorio,
        cadastrar_atividade,
        gerir_horario_bolsista,
        gerir_backup,
        ver_escolas,
        meu_horario,
        agendar_visita,
        meus_agendamentos,
        editar_dados
      }, trx)

      const user = await User.create({
        username,
        password,
        permissao_id: permissao.id
      }, trx)

      const endereco = await Endereco.create({
        estado,
        cidade,
        bairro,
        rua,
        numero
      }, trx)

      const pessoa = await Pessoa.create({
        nome,
        cpf,
        email,
        telefone,
        endereco_id: endereco.id
      }, trx)

      await Funcionario.create({
        user_id: user.id,
        pessoa_id: pessoa.id
      }, trx)

      await trx.commit()

      return response.status(201).send({message: 'Funcionario criado com sucesso'});
    }catch (err) {
      return response.status(400).send({error: `Erro: ${err.message}`})
   }
  }

  async show ({ response, auth }) {
    try{
      const funcionario = await Funcionario.findBy('user_id', auth.user.id)

      await funcionario.loadMany(['pessoa.endereco', 'usuario.permissao'])

      return response.status(200).json(funcionario)

    }catch (err){
      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  async update ({ request, response, auth }) {

    const trx = await Database.beginTransaction()

    try{
      const erroMessage = {
        'username.unique': 'Esse usuário já existe',
        'username.min': 'O campo deve ter no mínimo 5 caracteres',
        'password.min': 'O campo deve ter no mínimo 6 caracteres',
        'email.email': 'Informe um email válido',
        'email.unique': 'Esse email já existe',
        'numero.integer': 'Informe um valor inteiro',
        'telefone.integer': 'Informe um valor inteiro',
        'gerir_bolsista.boolean': 'Informe um valor boleano',
        'gerir_funcionario.boolean': 'Informe um valor boleano',
        'agendamento.boolean': 'Informe um valor boleano',
        'relatorio.boolean': 'Informe um valor boleano',
        'cadastrar_atividade.boolean': 'Informe um valor boleano',
        'gerir_horario_bolsista.boolean': 'Informe um valor boleano',
        'gerir_backup.boolean': 'Informe um valor boleano',
        'ver_escolas.boolean': 'Informe um valor boleano',
        'meu_horario.boolean': 'Informe um valor boleano',
        'agendar_visita.boolean': 'Informe um valor boleano',
        'meus_agendamentos.boolean': 'Informe um valor boleano',
        'editar_dados.boolean': 'Informe um valor boleano',
      }

      const validation = await validateAll(request.all(), {
        username: 'min:5|unique:users',
        matricula: 'integer|unique:bolsistas',
        password: 'min:6',
        email: 'email|unique:pessoas',
        numero: 'integer',
        telefone: 'integer',
        gerir_bolsista: 'boolean',
        gerir_funcionario: 'boolean',
        agendamento: 'boolean',
        relatorio: 'boolean',
        cadastrar_atividade: 'boolean',
        gerir_horario_bolsista: 'boolean',
        gerir_backup: 'boolean',
        ver_escolas: 'boolean',
        meu_horario: 'boolean',
        agendar_visita: 'boolean',
        meus_agendamentos: 'boolean',
        editar_dados: 'boolean'
      }, erroMessage)

      if(validation.fails()){
        return response.status(400).send({
          message: validation.messages()
        })
      }

      const usuario = await User.find(auth.user.id)
      const funcionario = await Funcionario.findBy('user_id', auth.user.id)
      const pessoa = await Pessoa.find(funcionario.pessoa_id)
      const endereco = await Endereco.findBy('pessoa_id', funcionario.pessoa_id)
      const permissao = await Permissao.find(usuario.permissao_id)

      const pessoaReq = request.only(['nome', 'cpf', 'email', 'telefone'])
      const enderecoReq = request.only(['estado', 'cidade', 'bairro', 'rua', 'numero'])
      const usuarioReq = request.only(['username', 'password'])
      const permissaoReq = request.only(
        [
          'gerir_bolsista',
          'gerir_funcionario',
          'agendamento',
          'relatorio',
          'cadastrar_atividade',
          'gerir_horario_bolsista',
          'gerir_backup',
          'ver_escolas',
          'meu_horario',
          'agendar_visita',
          'meus_agendamentos',
          'editar_dados'
      ])

      pessoa.merge({ ...pessoaReq })
      endereco.merge({ ...enderecoReq })
      usuario.merge({ ...usuarioReq })
      permissao.merge({ ...permissaoReq })

      await pessoa.save(trx)
      await endereco.save(trx)
      await usuario.save(trx)
      await permissao.save(trx)

      await trx.commit()

      return response.status(201).send({message: 'Funcionário alterado com sucesso'});

    }catch (err){
      await trx.rollback()

      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }

  }

  async destroy ({ request, response, auth }) {

    try{
      const user = await User.findBy('username', request.body.username)

      if(user == null)
        return response.status(404).send({message: 'Funcionário não localizado'})

      user.ativo = false
      await user.save()

      return response.status(200).send({message: 'Funcionário foi desativado'})

    }catch (err){
      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }
  }
}

module.exports = FuncionarioController
