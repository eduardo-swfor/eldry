import nextConnect from 'next-connect'
import { enviaEmail } from '../api/utils/envio-email'
import generator from 'generate-password'
import { incluiRegistro, excluiRegistro, listarColecao, buscaPorPropriedade, alteraRegistro } from './utils/crud-utils'
import colecoes from '../../data/colecoes.json'
import { adicionaMinutosNaData } from '../../utils/DateUtils'
import bcrypt from 'bcrypt'
import moment from 'moment'

const apiRoute = nextConnect({
    onError(error, req, res) {
        return res.status(201).json(JSON.stringify(error.message))
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Método '${req.method}' não permitido` })
    },
})

export async function criaUsuario(email, senha) {
    return await incluiRegistro(colecoes.USUARIOS, {email: email.toUpperCase(), senha}, '<SEM EMAIL>')
}

export async function reiniciaSenha(email, codigo) {
    const tokensJaGerados = await listarColecao(colecoes.TOKENS_SENHAS, { email: email.toUpperCase() })
    tokensJaGerados.forEach(item => excluiRegistro(colecoes.TOKENS_SENHAS, item._id, '<SEM EMAIL>'))
    const objToken = {
        email: email.toUpperCase(), 
        token: codigo, 
        dataHoraGeracao: new Date(), 
        dataValidade: adicionaMinutosNaData(3, new Date())
    }

    return await incluiRegistro(colecoes.TOKENS_SENHAS, objToken, '<SEM EMAIL>')
}

export async function utilizaToken(token) {
    const tokens = await listarColecao(colecoes.TOKENS_SENHAS, { token })
    
    if (!tokens || tokens.length == 0) {
        throw '$Chave inválida'
    }

    const tokenGravado = tokens[0]
    const diferenca = moment(tokenGravado.dataValidade).diff(new Date(), 'seconds')

    if (diferenca < 0) {
        throw '$Fazem mais de 3 minutos que esta chave foi gerada, gere outra e tente novamente'
    }
    
    await excluiRegistro(colecoes.TOKENS_SENHAS, tokenGravado._id, '<SEM EMAIL>')
    await alteraSenhaUsuario(tokenGravado.email)
}

async function alteraSenhaUsuario(email) {
    const registroCadastrado = await buscaPorPropriedade(colecoes.USUARIOS, 'email', email.toUpperCase())

    if (!registroCadastrado || registroCadastrado.length == 0) {
        throw '$Usuário não localizado'
    }

    const registro = registroCadastrado[0]
    const senha = geraSenha()
    registro.senha = await hashSenha(senha)

    alteraRegistro(colecoes.USUARIOS, registro, '<SEM EMAIL>').then(retorno =>{
        enviaEmail(email, 'Alteração de senha - Portal AFC', `
            Sua senha foi alterada com sucesso, por favor guarde os dados abaixo:            
            <br/><br/><b>Usuário:</b>${email}
            <br/><b>Senha:</b><pre>${senha}</pre>
        `)
    })
}

export function geraSenha() {
    return generator.generate({
        length: 8,
        numbers: true,
        uppercase: true,
        symbols: false,
        excludeSimilarCharacters: true        
    })
}

export async function hashSenha(senha) {
    return await bcrypt.hash(senha, 12)
}

apiRoute.post(async (req, res) => {
    const params = req.body
    
    try {
        if (params?.criarUsuario) {
            const email = params.email.toLowerCase().trim()

            if (!email) {
                throw '$Informe o e-mail'
            }

            const registroCadastrado = await buscaPorPropriedade(colecoes.USUARIOS, 'email', email.toUpperCase())

            if (registroCadastrado && registroCadastrado.length > 0) {
                throw '$Usuário já cadastrado'
            }

            const senhaGerada = geraSenha()
            const senhaCriprografada = await hashSenha(senhaGerada)

            criaUsuario(email, senhaCriprografada).then(retorno => {
                enviaEmail(email, 'Cadastro Portal AFC', `
                    Seu e-mail foi cadastrado com sucesso no portal afc, por favor guarde os dados abaixo:            
                    <br/><br/><b>Usuário:</b>${email}
                    <br/><b>Senha:</b><pre>${senhaGerada}</pre>
                `)
            })

            return res.status(201).json('ok')
        } else if (params?.reiniciarSenha) {
            const email = params.email.toLowerCase()
            const codigo = `${Math.trunc(Math.random() * 1000000)}`

            await reiniciaSenha(email, codigo)
            enviaEmail(email, 'Redefinir senha', `
                Para redefinir sua senha acesse o sistema com o código: ${codigo}
            `)

            return res.status(201).json('ok')
        } else if (params?.tokenInformado) {
            await utilizaToken(params?.tokenInformado)
            return res.status(201).json('ok')
        }
    
        throw '$Selecione uma opção'
    } catch (error) {
        if (!error.toString().startsWith('$')) {
            return res.status(201).json(`$${error}`)
        } else {
            return res.status(201).json(error)
        }
    }
})


export default apiRoute