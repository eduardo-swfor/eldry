import axios, { AxiosResponse } from 'axios'

interface UsuarioLocal {
    token: string
    email: string
}

const processaResponse = (r: AxiosResponse<any>): void => {
    if (r?.status === 401) {
        throw 'Usuário não tem permissão para acessar esta funcionalidade'
    } else if (r?.status >= 500) {
        if (r.data?.erro) {
            throw `Erro ao processar a operação: ${r.data.erro}`
        } else {
            throw `Erro ao processar a operação`
        }
    }
}

const getUsuarioLocal = (): UsuarioLocal => {
    const strItem = localStorage.getItem('usuario')
    return strItem ? JSON.parse(strItem) as UsuarioLocal : null
}

const getAuthHeader = (usuarioHeader?: UsuarioLocal) => {
    if (usuarioHeader) {
        return {
            'tokent4u': JSON.stringify(usuarioHeader)
        }
    }

    const usuario = getUsuarioLocal()
    
    return {
        'Authorization': 'Bearer ' + usuario.token
    }
}

const get = async (url: string, params?: any, usuarioHeader?: UsuarioLocal): Promise<AxiosResponse<any>> => {    
    try {
        const response = await axios.get(
            url,
            { 
                headers: getAuthHeader(usuarioHeader),
                params
            }
        )

        processaResponse(response)
        return response    
    } catch (error) {
        processaResponse(error.response)
    }
}

const post = async (url: string, data?: any, usuarioHeader?: UsuarioLocal): Promise<AxiosResponse<any>> => {   
    try {
        const response = await axios.post(
            url,
            data,
            { headers: getAuthHeader(usuarioHeader) }
        )
    
        processaResponse(response)
        return response  
    } catch (error) {
        processaResponse(error.response)
    }     
}

const put = async (url: string, data?: any, usuarioHeader?: UsuarioLocal): Promise<AxiosResponse<any>> => {    
    try {
        const response = await axios.put(
            url,
            data,
            { headers: getAuthHeader(usuarioHeader) }
        )
    
        processaResponse(response)
        return response    
    } catch (error) {
        processaResponse(error.response)
    }
}

const _delete = async (url: string, id: any, usuarioHeader?: UsuarioLocal): Promise<AxiosResponse<any>> => {
    try {
        const response = await axios.delete(
            url,
            { headers: getAuthHeader(usuarioHeader), params: { id } }
        )
    
        processaResponse(response)
        return response    
    } catch (error) {
        processaResponse(error.response)
    }
    
}

export default {
    get,
    post,
    put,
    delete: _delete
}