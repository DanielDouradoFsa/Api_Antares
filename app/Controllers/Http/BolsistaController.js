'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with bolsistas
 */

const Database = use('Database')
const Pessoa = use('App/Models/Pessoa')
const User = use('App/Models/User')
const Endereco = use('App/Models/Endereco')
const Bolsista = use('App/Models/Bolsista')
const Permissao = use('App/Models/Permissao')
const { validateAll } = use('Validator')

class BolsistaController {

  async index ({ response }) {

    try{
      const bolsistas = await Bolsista
        .query()
        .with('pessoa.endereco')
        .with('usuario', (builder) => {
          builder.where('ativo', true)
        })
        .fetch()

      return response.status(200).json(bolsistas)

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
        'cpf.required': 'Esse campo é obrigatório',
        'cpf.integer': 'Informe um valor inteiro',
        'matricula.required': 'Esse campo é obrigatório',
        'matricula.integer': 'Informe um valor inteiro',
        'matricula.unique': 'Essa matrícula já existe',
        'meu_horario.boolean': 'Informe um valor boleano',
      }

      const validation = await validateAll(request.all(), {
        username: 'required|min:5|unique:users',
        password: 'required|min:6',
        estado: 'required',
        cidade: 'required',
        bairro: 'required',
        rua: 'required',
        numero: 'required|integer',
        nome: 'required',
        telefone: 'required|integer',
        email: 'required|email',
        cpf: 'required|integer',
        matricula: 'required|integer|unique:bolsistas',
        meu_horario: 'boolean'
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
        cpf,
        email,
        telefone,
        matricula,
        meu_horario
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

      const permissao = await Permissao.create({
        user_id:user.id,
        meu_horario
      }, trx)

      await Bolsista.create({
        pessoa_id: pessoa.id,
        user_id: user.id,
        permissao_id:permissao.id,
        matricula
      }, trx)

      await trx.commit()

      return response.status(201).send({message: 'Bolsista criado com sucesso'});

    }catch (err){
      await trx.rollback()

      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  async show ({ response, auth }) {

    try{
      const bolsista = await Bolsista.findBy('user_id', auth.user.id)

      await bolsista.loadMany(['pessoa.endereco', 'usuario'])

      return response.status(200).json(bolsista)

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
        'matricula.integer': 'Informe um valor inteiro',
        'matricula.unique': 'Essa matricula já existe',
        'numero.integer': 'Informe um valor inteiro',
        'telefone.integer': 'Informe um valor inteiro',
        'cpf.integer': 'Informe um valor inteiro',
      }

      const validation = await validateAll(request.all(), {
        username: 'min:5|unique:users',
        matricula: 'integer|unique:bolsistas',
        password: 'min:6',
        email: 'email|unique:pessoas',
        numero: 'integer',
        telefone: 'integer',
        cpf: 'integer',
      }, erroMessage)

      if(validation.fails()){
        return response.status(400).send({
          message: validation.messages()
        })
      }

      const bolsista = await Bolsista.findBy('user_id', auth.user.id)
      const pessoa = await Pessoa.find(bolsista.pessoa_id)
      const endereco = await Endereco.findBy('pessoa_id', bolsista.pessoa_id)
      const usuario = await User.find(auth.user.id)

      const bolsistaReq = request.only(['matricula'])
      const pessoaReq = request.only(['nome', 'cpf', 'email', 'telefone'])
      const enderecoReq = request.only(['nome', 'cpf', 'email', 'telefone'])
      const usuarioReq = request.only(['estado', 'cidade', 'bairro', 'rua', 'numero'])

      bolsista.merge({ ...bolsistaReq })
      pessoa.merge({ ...pessoaReq })
      endereco.merge({ ...enderecoReq })
      usuario.merge({ ...usuarioReq })

      await bolsista.save(trx)
      await pessoa.save(trx)
      await endereco.save(trx)
      await usuario.save(trx)

      await trx.commit()

      return response.status(201).send({message: 'Bolsista alterado com sucesso'});

    }catch (err){
      await trx.rollback()

      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }
  }

  async destroy ({ response, auth }) {

    try{
      const user = await User.find(auth.user.id)

      if(user == null)
        return response.status(404).send({message: 'Usuário não localizado'})

      user.ativo = false
      await user.save()

      return response.status(204).send({message: 'Usuário foi desativado'})

    }catch (err){
      return response.status(404).send({
        error: `Erro: ${err.message}`
      })
    }
  }
}

module.exports = BolsistaController
