import bcrypt from 'bcrypt'
import passwordValidator from 'password-validator'
import nextConnect from 'next-connect'
import { incluiRegistro, listarColecao, buscaPeloId, excluiRegistro, alteraRegistro } from './utils/crud-utils'
import { verificaPermissaoRequest } from './verifica-permissao'
import colecoes from '../../data/colecoes.json'
import { hashSenha } from './usuario'

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(501).json({ error: `Erro ao processar a requisição! ${error.message}` })
    },
    onNoMatch(req, res) {
        res.status(405).json({ error: `Método '${req.method}' não permitido` })
    },
})

async function verificaPermissaoMiddleware(req, res, next) {
    if (!await verificaPermissaoRequest(req)){
        return res.status(201).json('$USUÁRIO NÃO TEM PERMISSÃO PARA EXECUTAR ESTA OPERAÇÃO')
    } else {
        next()
    }
}

apiRoute.use(verificaPermissaoMiddleware)

apiRoute.post(async (req, res) => {
    const params = req.body.params.obj

    if (params?.email) {    
        const lista = await listarColecao(colecoes.USUARIOS, { email: params?.email.toUpperCase() })
        const usuario = lista.length > 0 ? lista[0] : null

        if (usuario) {
            if (!params?.bypass && !bcrypt.compareSync(params?.senhaAtual, usuario.senha)) {
                return res.status(201).json('$A senha atual está errada!')
            }

            if (params.novaSenha !== params.confirmacaoSenha) {
                return res.status(201).json('$A nova senha está diferente da confirmação!')
            }

            var schema = new passwordValidator();

            schema.is().min(8)
                .is().max(100)
                .has().uppercase()
                .has().lowercase()
                .has().digits(1)
                .has().not().spaces()

            if (!params?.bypass && !schema.validate(params.novaSenha)) {
                return res.status(201).json('$A senha informada não atende os critérios de segurança!')
            }

            usuario.senha = await hashSenha(params.novaSenha)
            await alteraRegistro(colecoes.USUARIOS, usuario, null, req)
            return res.status(201).json('ok')
        }
    }

    
    throw res.status(201).json('$Usuário não localizado')
})


export default apiRoute