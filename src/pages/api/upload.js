import nextConnect from 'next-connect'
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { incluiRegistro } from './utils/crud-utils'
import { verificaPermissaoRequest } from './verifica-permissao'
import { verificaAutenticacao } from './utils/firebase-helper'
import log from '../../utils/app-log'

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const apiRoute = nextConnect({
    onError(error, req, res) {
        res.status(201).json({ error: `Erro ao fazer upload do arquivo! ${error.message}` })
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

async function iniciaStorage(req, res, next) {
    const diretorio = req.body['diretorio']
    
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
        })
    })

    const uploadMiddleware = upload.array('upload')   
    uploadMiddleware(req, res, next)
}

apiRoute.use(verificaPermissaoMiddleware)
apiRoute.use(iniciaStorage)

// Process a POST request
apiRoute.post(async (req, res) => {
    const email = await verificaAutenticacao(req)

    const diretorio = req.body.diretorio
    const rootEndpoint = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.${process.env.NEXT_PUBLIC_AWS_STORAGE_ENDPOINT}`

    const arquivos = req.files.map(file => {        
        return {
            chaveVinculada: req.body.chaveArquivo,
            nomeGravado: file.key, 
            nomeOriginal: file.originalname,
            caminhoCompleto: file.location,
            caminhoSemEndpont: file.location.replace(rootEndpoint, ''),
            diretorio: diretorio,
            dataGravacao: new Date(),
            gravadoPor: email
        }
    })    

    incluiRegistro('arquivos', arquivos[0], email, req)
    
    res.status(200).json(arquivos[0])
})

export default apiRoute

export const config = {
    api: {
        bodyParser: false, 
        sizeLimit: '5mb'
    },
}