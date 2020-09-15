'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with funcionarios
 */

const Database = use("Database")
const Funcionario = use('App/Models/Funcionario')
const User = use('App/Models/User')
const Endereco = use('App/Models/endereco')
const Pessoa =  use('App/Models/Pessoa')
const { validateAll } = use('Validator')

class FuncionarioController {

  async index ({ response }) {

    try{
      const funcionarios = await Escola
        .query()
        .with('pessoa.endereco')
        .with('usuario')
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
        'nome.required': 'Esse campo é obrigatório',
        'telefone.required': 'Esse campo é obrigatório',
        'email.required': 'Esse campo é obrigatório',
        'email.email': 'Informe um email válido',
      }

      const validation = await validateAll(request.all(), {
        username: 'required|min:5|unique:users',
        password: 'required|min:6',
        estado: 'required',
        cidade: 'required',
        bairro: 'required',
        rua: 'required',
        numero: 'required',
        nome: 'required',
        telefone: 'required',
        email: 'required|email',
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
        ativo
      } = request.all()

      const user = await User.create({
        username,
        password
      }, trx)

      const pessoa = await Pessoa.create({
        nome,
        cpf,
        email,
        telefone
      }, trx)

      await Endereco.create({
        estado,
        cidade,
        bairro,
        rua,
        numero,
        pessoa_id: pessoa.id
      }, trx)

      await Funcionario.create({
        user_id: user.id,
        pessoa_id: pessoa.id,
        ativo: ativo
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

      await funcionario.loadMany(['pessoa.endereco', 'usuario'])

      return response.status(200).json(funcionario)

    }catch (err){
      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  async update ({ request, response }) {

    const trx = await Database.beginTransaction()

    try{
      const erroMessage = {
        'username.unique': 'Esse usuário já existe',
        'username.min': 'O campo deve ter no mínimo 5 caracteres',
        'password.min': 'O campo deve ter no mínimo 6 caracteres',
        'email.email': 'Informe um email válido',
        'email.unique': 'Esse email já existe',
        'numero.integer': 'Informe um valor inteiro',
        'telefone.integer': 'Informe um valor inteiro'
      }

      const validation = await validateAll(request.all(), {
        username: 'min:5|unique:users',
        matricula: 'integer|unique:bolsistas',
        password: 'min:6',
        email: 'email|unique:pessoas',
        numero: 'integer',
        telefone: 'integer'
      }, erroMessage)

      if(validation.fails()){
        return response.status(400).send({
          message: validation.messages()
        })
      }

      const funcionario = await Funcionario.findBy('user_id', auth.user.id)
      const pessoa = await Pessoa.find(funcionario.pessoa_id)
      const endereco = await Endereco.findBy('pessoa_id', funcionario.pessoa_id)
      const usuario = await User.find(auth.user.id)

      const pessoaReq = request.only(['nome', 'cpf', 'email', 'telefone'])
      const enderecoReq = request.only(['nome', 'cpf', 'email', 'telefone'])
      const usuarioReq = request.only(['estado', 'cidade', 'bairro', 'rua', 'numero'])

      pessoa.merge({ ...pessoaReq })
      endereco.merge({ ...enderecoReq })
      usuario.merge({ ...usuarioReq })

      await pessoa.save(trx)
      await endereco.save(trx)
      await usuario.save(trx)

      await trx.commit()

      return response.status(201).send({message: 'Funcionário alterado com sucesso'});

    }catch (err){
      await trx.rollback()

      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }

  }

  async destroy ({ response, auth }) {

    try{
      const funcionario = await Funcionario.find(auth.user.id)

      if(funcionario == null)
        return response.status(404).send({message: 'Funcionário não localizado'})

      funcionario.ativo = false
      await funcionario.save()

      return response.status(204).send({message: 'Funcionário foi desativado'})

    }catch (err){
      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }
  }
}

module.exports = FuncionarioController
