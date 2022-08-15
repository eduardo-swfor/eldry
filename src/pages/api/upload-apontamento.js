import nextConnect from 'next-connect'
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { verificaPermissaoRequest } from './verifica-permissao'
import { verificaAutenticacao } from './utils/firebase-helper'
import { registraApontamentoOcorrencia } from './utils/ocorrencia-utils'
import Colecoes from '../../data/colecoes.json'
import { trocaStringParaDateDoObjeto } from '../../utils/DateUtils'
import { getFilesFromRequest, gravaArquivosRelacionados } from './utils/upload-utils'

const diretorio = 'apontamentos'

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const apiRoute = nextConnect({
    onError(error, req, res) {
        return res.status(201).json(JSON.stringify(error))
    },
    onNoMatch(req, res) {
        return res.status(405).json({ error: `Método '${req.method}' não permitido` })
    },
})

async function verificaPermissaoMiddleware(req, res, next) {
    if (!await verificaPermissaoRequest(req)){
        return res.status(201).json('$USUÁRIO NÃO TEM PERMISSÃO PARA EXECUTAR ESTA OPERAÇÃO')
    } else {
        next()
    }
}

async function iniciaStorage(req, res, next) {
    const caminho = [
        process.env.NEXT_PUBLIC_AWS_STORAGE_ENDPOINT,
        (new Date()).getFullYear(),
        diretorio
    ].join('/')

    const spacesEndpoint = new aws.Endpoint(caminho)

    const s3 = new aws.S3({
        endpoint: spacesEndpoint
    })

    const upload = multer({
        storage: multerS3({
            s3: s3,
            bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
            acl: 'private'
        }),

    })

    const uploadMiddleware = upload.array('upload')   
    uploadMiddleware(req, res, next)
}

apiRoute.use(verificaPermissaoMiddleware)
apiRoute.use(iniciaStorage)

// Process a POST request
apiRoute.post(async (req, res) => {    
    try {
        const email = await verificaAutenticacao(req)
        const obj = JSON.parse(req.body.obj)
        
        const arquivos = await getFilesFromRequest(
            req, 
            diretorio, 
            '', 
            Colecoes.APONTAMENTOS,
            email
        )
    
        const objDatas = trocaStringParaDateDoObjeto(obj)
        objDatas.arquivos = arquivos
        const idApontamento = (await registraApontamentoOcorrencia(objDatas, email)).insertedId
    
        await gravaArquivosRelacionados(
            arquivos,
            idApontamento.toString(), 
            email
        )
        
        return res.status(201).json('Registro incluído com sucesso')
    } catch (error) {
        throw error
    }
})

export default apiRoute

export const config = {
    api: {
        bodyParser: false, 
        sizeLimit: '2mb'
    },
}