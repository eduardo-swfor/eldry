import axios from 'axios'
import Usuario from '../model/Usuario'

export function getUrl() {
    return `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
}

function getDefaulHeader(usuario) {    
    const config = {
        headers: {
            'Authorization': 'Bearer ' + usuario?.token
        }
    }
    
    return config
}

export async function get(url, usuario=null, params={}) {
    const config = {...getDefaulHeader(usuario), params: {obj:{...params}}}    
    const dados = await axios.get(
        `${getUrl()}${url}`
        ,config
    )     
    return dados
}

export async function getDownload(url, usuario = null, params={}) {
    const config = {...getDefaulHeader(usuario), responseType: 'blob', params: {...params}}    
    const dados = await axios.get(
        `${getUrl()}${url}`
        ,config
    )     
    return dados
}

export async function post(url, usuario, params={}){
    const config = { params: {obj:{...params} } }    
    
    const dados = await axios.post(
        `${getUrl()}${url}`
        ,config
        ,getDefaulHeader(usuario)
    )

    return dados
}

export async function postUpload(endpoint, usuario, chaveArquivo, diretorio, arquivo) {
    const config = {
        headers: { 
            'Authorization': 'Bearer ' + usuario?.token,
            'content-type': 'multipart/form-data'
        }
    }

    const dataForm = new FormData()

    dataForm.append( 
        'upload', 
        arquivo,
        arquivo.name
    )
    dataForm.append('chaveArquivo', chaveArquivo)
    dataForm.append('diretorio', diretorio)

    const response = await axios.post(
        `${getUrl()}${endpoint}`, 
        dataForm, 
        config
    )    
    
    return response
}

export async function postUploadCadastro(endpoint, usuario, arquivo, obj) {
    const config = {
        headers: { 
            'Authorization': 'Bearer ' + usuario?.token,
            'content-type': 'multipart/form-data'
        }
    }

    const dataForm = new FormData()
    
    if (arquivo) {
        if (Array.isArray(arquivo)) {
            arquivo.map(item => {
                dataForm.append( 
                    'upload', 
                    item,
                    item.name
                )    
            })
        } else {
            dataForm.append( 
                'upload', 
                arquivo,
                arquivo.name
            )
        }
    }
    
    dataForm.append('obj', JSON.stringify(obj))

    const response = await axios.post(
        `${getUrl()}${endpoint}`, 
        dataForm, 
        config
    )    
    
    return response
}

export async function put(url, usuario, params={}){
    const config = { params: {obj:JSON.stringify({...params}) } }
    
    const dados = await axios.put(
        `${getUrl()}${url}`
        ,config
        ,getDefaulHeader(usuario)
    )     
    return dados
}

export async function deleteAxios(url, usuario, id){
    const config = {...getDefaulHeader(usuario), params: {id}}
    
    const dados = await axios.delete(
        `${getUrl()}${url}`
        ,config
    )   

    return dados
}