import Colecoes from '../../../data/colecoes.json'
import { incluiRegistro, buscaPeloId, buscaPorPropriedade } from './crud-utils'
import aws from 'aws-sdk'

export async function downloadArquivo(caminho, chave) {    
    const caminhoEndpoint = caminho.replace(`${process.env.NEXT_PUBLIC_AWS_BUCKET}.`, '')
    const spacesEndpoint = new aws.Endpoint(caminhoEndpoint)

    const s3 = new aws.S3({
        endpoint: spacesEndpoint
    })
  
    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
        Key: chave
    }

    aws.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    })
  
    await s3.headObject(params).promise()
    return await s3.getObject(params).promise()
}

export async function excluiArquivo(caminho, chave) {    
    let caminhoEndpoint = caminho ? caminho.replace(`${process.env.NEXT_PUBLIC_AWS_BUCKET}.`, '') : ''

    if (!caminho) {
        const arquivos = await buscaPorPropriedade(Colecoes.ARQUIVOS, 'nomeGravado', chave)
        const arq = arquivos[0]
        caminhoEndpoint = `https://${process.env.NEXT_PUBLIC_AWS_STORAGE_ENDPOINT}/${arq.diretorio}`
    }
    const spacesEndpoint = new aws.Endpoint(caminhoEndpoint)

    const s3 = new aws.S3({
        endpoint: spacesEndpoint
    })
  
    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
        Key: chave
    }

    aws.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    })
  
    try {
        await s3.headObject(params).promise()

        try {
            await s3.deleteObject(params).promise()
        }
        catch (error) {
            throw error
        }
    } catch (error) {
        throw error
    }
}

export function getFilesFromRequest(req, diretorio, chaveVinculada, colecaoVinculada, email) {
    const arquivos = req.files.map(file => {        
        return {            
            chaveVinculada,
            nomeGravado: file.key, 
            nomeOriginal: file.originalname,
            diretorio: `${(new Date()).getFullYear()}/${diretorio}`, 
            colecaoVinculada,
            v2: true
        }
    })    

    return arquivos
}

export async function gravaArquivosRelacionados(arquivos, chaveVinculada, email) {
    if (arquivos && arquivos.length > 0) {
        return arquivos.map(async item => {
            if (chaveVinculada) {
                item.chaveVinculada = chaveVinculada
            }

            var resultado = await incluiRegistro(Colecoes.ARQUIVOS, item, email)
            return await buscaPeloId(Colecoes.ARQUIVOS, resultado.insertedId)
        })
    }

    return []
}