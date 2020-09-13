'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with escolas
 */
const Database = use('Database')
const User = use('App/Models/User')
const Escola = use('App/Models/Escola')
const Endereco = use('App/Models/Endereco')
const { validateAll } = use('Validator')

class EscolaController {

  async index ({ response }) {
    try{
      const escolas = await Escola
        .query()
        .with('endereco')
        .with('usuario')
        .fetch()

      return response.status(200).json(escolas)

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
        'nome_responsavel.required': 'Esse campo é obrigatório',
        'telefone_responsavel.required': 'Esse campo é obrigatório',
        'telefone_responsavel.integer': 'Informe um valor inteiro',
        'email.required': 'Esse campo é obrigatório',
        'email.email': 'Informe um email válido',
        'email.unique': 'Esse email já existe',
        'tipo.required': 'Esse campo é obrigatório',
        'cnpj.required': 'Esse campo é obrigatório',
        'cnpj.integer': 'Informe um valor inteiro',
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
        nome_responsavel: 'required',
        telefone_responsavel: 'required|integer',
        email: 'required|email|unique:escolas',
        tipo: 'required',
        cnpj: 'required|integer'
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
        nome_responsavel,
        telefone_responsavel,
        email,
        tipo,
        cnpj
      } = request.all()

      const user = await User.create({
        username,
        password
      }, trx)

      const endereco = await Endereco.create({
        estado,
        cidade,
        bairro,
        rua,
        numero
      }, trx)

      await Escola.create({
        nome,
        telefone,
        nome_responsavel,
        telefone_responsavel,
        email,
        tipo,
        cnpj,
        user_id: user.id,
        endereco_id: endereco.id
      }, trx)

      await trx.commit()

      return response.status(201).send({message: 'Escola criada com sucesso'});

    }catch (err){
      await trx.rollback()

      return response.status(400).send({
        error: `Erro: ${err.message}`
      })
    }

  }

  async show ({ response, auth }) {
    try{
      const escolas = await Escola.findBy('user_id', auth.user.id)

      await escolas.loadMany(['endereco', 'usuario'])

      return response.status(200).json(escolas)

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
        'numero.integer': 'Informe um valor inteiro',
        'telefone.integer': 'Informe um valor inteiro',
        'telefone_responsavel.integer': 'Informe um valor inteiro',
        'cnpj.integer': 'Informe um valor inteiro',
      }

      const validation = await validateAll(request.all(), {
        username: 'min:5|unique:users',
        password: 'min:6',
        email: 'email',
        numero: 'integer',
        telefone: 'integer',
        telefone_responsavel: 'integer',
        cnpj: 'integer',
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
        nome_responsavel,
        telefone_responsavel,
        email,
        tipo,
        cnpj
      } = request.all()

      const user = await User.find(auth.user.id)

      if(user == null)
        return response.status(404).send({message: 'Usuário não localizado'})

      if( password != null )
        user.password = password
      if( username != null )
        user.username = username

      await user.save()

      const escola = await Escola.findBy('user_id', user.id)

      if(nome != null || telefone != null || nome_responsavel != null || telefone_responsavel != null || email != null || tipo != null || cnpj != null){

        if( nome != null )
          escola.nome = nome
        if( telefone != null )
          escola.telefone = telefone
        if( nome_responsavel != null )
          escola.nome_responsavel = nome_responsavel
        if( telefone_responsavel != null )
          escola.telefone_responsavel = telefone_responsavel
        if( email != null )
          escola.email = email
        if( tipo != null )
          escola.tipo = tipo
        if( cnpj != null )
          escola.cnpj = cnpj

        await escola.save()
      }

      if(estado != null || cidade != null || bairro != null || rua != null || numero != null){

        const endereco = await Endereco.findBy('id', escola.endereco_id)

        if( estado != null )
          endereco.estado = estado
        if( cidade != null )
          endereco.cidade = cidade
        if( bairro != null )
          endereco.bairro = bairro
        if( rua != null )
          endereco.rua = rua
        if( numero != null )
          endereco.numero = numero

        await endereco.save()
      }

      await trx.commit()

      return response.status(201).send({message: 'Escola alterada com sucesso'});

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

module.exports = EscolaController
