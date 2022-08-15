import nextConnect from 'next-connect'
import { verificaPermissaoRequest } from './verifica-permissao'
import { buscaPorPropriedade } from './utils/crud-utils'
import aws from 'aws-sdk'
import Colecoes from '../../data/colecoes.json'

const apiRoute = nextConnect({
    onError(error, req, res) {
        return res.status(201).json(JSON.stringify(error.message))
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

apiRoute.get(async (req, res) => {    
    const chave = req.query.chave
    
    if (chave) {
        try {
            const arquivos = await buscaPorPropriedade(Colecoes.ARQUIVOS, 'nomeGravado', chave)
            
            if (!arquivos || arquivos.length == 0) {
                throw 'Arquivo não localizado'
            }

            const arquivo = arquivos[0]
            let caminhoEndpoint = ''

            if (arquivo.v2) {
                caminhoEndpoint = `https://${process.env.NEXT_PUBLIC_AWS_STORAGE_ENDPOINT}/${arquivo.diretorio}`
            } else {
                caminhoEndpoint = arquivo.caminhoSemNome.replace(`${process.env.NEXT_PUBLIC_AWS_BUCKET}.`, '')
            }

            const spacesEndpoint = new aws.Endpoint(caminhoEndpoint)
            const s3 = new aws.S3({
                endpoint: spacesEndpoint
            })

            const params = {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
                Key: arquivo.nomeGravado
            }

            aws.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                region: process.env.AWS_REGION
            })

            await s3.getObject(params).on('httpHeaders', (statusCode, headers) => {
                if (statusCode < 300) {
                    res.setHeader('Cache-Control', 'public, max-age=31536000')
                    res.setHeader('Accept-Ranges', headers['accept-ranges'])
                    res.setHeader('Content-Length', headers['content-length'])
                    res.setHeader('Content-Type', headers['content-type'])
                    res.setHeader('ETag', headers.etag)
                    res.setHeader('Content-Disposition', 'attachment')
                }

            })
            .createReadStream()
            .on('error', (err) => {
                throw err
            })
            .pipe(res)            
        } catch (error) {
            throw error
        }
        
    } else {
        throw '$Parâmetros inválidos'
    }
    
})

export default apiRoute