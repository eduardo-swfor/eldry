import { createContext, useEffect, useRef, useState } from 'react'
import Modal from '../../components/modal/Modal'
import DialogPergunta from '../../components/modal/DialogPergunta'
import DialogErro from '../../components/modal/DialogErro'
import DialogAlerta from '../../components/modal/DialogAlerta'
import SpinnerCentro from '../../components/utils/SpinnerCentro'
import ToastWarning from '../../components/utils/ToastWarning'
import ToastSucesso from '../../components/utils/ToastSucesso'
import ToastInfo from '../../components/utils/ToastInfo'
import { get, post, put, deleteAxios, getDownload,
    postUpload, postUploadCadastro } from '../../utils/axios-helper'
import useAuth from '../hook/useAuth'
import { useRouter } from 'next/router'
import rotasSemSeguranca from '../rotas-sem-seguraca.json'
import log from '../../utils/app-log'

interface AppContextProps {
    exibirLoading?: () => void
    esconderLoading?: () => void
    exibirModal?: (titulo: string, conteudo: any, tamanho?: string) => void
    esconderModal?: () => void
    exibirToast?: (conteudo: any, tipo: string) => void
    pergunta?: (texto?: string, ok?: () => void, cancelar?: () => void) => void
    erro?: (conteudo?: any) => void
    alerta?: (conteudo?: any) => void
    listarColecao?: (url: string, params?: object) => any
    gravarObj?: (url: string, obj: object) => any
    excluirObj?: (url: string, id: string) => any
    axiosGet?: (url: any, params?: object) => any
    axiosDownload?: (url: any, params?: object) => any
    uploadArquivo?: (endpoint: string, chaveArquivo: string, diretorio: string, arquivo: any) => any
    uploadArquivoCadastro?: (endpoint: string, arquivo: any, obj: any) => any
    axiosPost?: (url: string, obj: object) => any
    executaComLoading?: (funcao: () => Promise<any>) => Promise<void>
}

const AppContext = createContext<AppContextProps>({})

export function AppProvider(props) {
    const [modal, setModal] = useState(false)
    const [conteudoModal, setConteudoModal] = useState({conteudo: null, titulo: '', tamanho: ''})
    const [loading, setLoading] = useState(false)
    const [estadoToast, setEstadoToast] = useState([])
    const conteudoToastAlerta = useRef([])
    const [conteudoPergunta, setConteudoPergunta] = useState(null)
    const [exibeErro, setExibeErro] = useState(false)
    const [conteudoErro, setConteudoErro] = useState(null)   
    const [conteudoAlerta, setConteudoAlerta] = useState(null)   
    const { usuario, getUsuarioStorage } = useAuth()
    const [exibirChildren, setExibirChildren] = useState(false)
    const router = useRouter()

    useEffect(()=>{
        setExibirChildren(true)
        /*        
        if (rotasSemSeguranca.indexOf(router.pathname) >= 0) {
            setExibirChildren(true)
        } else if (usuario) {
            setExibirChildren(true)
        } else {
            setExibirChildren(false)
        }
        */

    }, [usuario])

    const executaComLoading = async(funcao: () => Promise<void>) => {
        exibirLoading()
        try {
            await funcao()
        } catch (error) {
            erro(error)
        } finally {            
            esconderLoading()
        }
    }
    
    function exibirToast(conteudo: any, tipo: string) {
        const obj = {chave: Math.random(), conteudo, data: new Date(), tipo: !tipo ? '' : tipo}
        conteudoToastAlerta.current = ([obj, ...conteudoToastAlerta.current])
        setEstadoToast(conteudoToastAlerta.current)

        setTimeout(()=>{
            conteudoToastAlerta.current = (conteudoToastAlerta.current.filter(e => e.chave != obj.chave))
            setEstadoToast(conteudoToastAlerta.current)
        }, 3000)
    }

    function exibirModal(titulo: string, conteudo:any, tamanho?: string) {
        setConteudoModal({titulo, conteudo, tamanho})
        setModal(true)
    }

    function esconderModal() {
        setModal(false)
    }

    function exibirLoading() {
        setLoading(true)
    }

    function esconderLoading() {
        setLoading(false)
    }

    const getJsxToastContainer = () => {
        if (estadoToast.length == 0){
            return null
        }
        
        return (
            <div className={`
                fixed-bottom flex items-end
            `}>
                <div className='ml-2'>
                    {
                        estadoToast.map((e,i) => {
                            if (['success', 'sucesso', 's'].indexOf(e.tipo.toLowerCase()) >= 0) {
                                return <div key={i}><ToastSucesso className='mb-2' conteudo={e.conteudo} data={e.data} /></div>    
                            } else if (['alert', 'alerta', 'warning', 'a'].indexOf(e.tipo.toLowerCase()) >= 0) {
                                return <div key={i}><ToastWarning className='mb-2' conteudo={e.conteudo} data={e.data} /></div>
                            } else {
                                return <div key={i}><ToastInfo className='mb-2' conteudo={e.conteudo} data={e.data} /></div>
                            }
                        })
                    }
                </div>
            </div>
        )
    }
    
    const pergunta = (texto: string, ok?: () => void, cancelar?: () => void) => {
        setConteudoPergunta({texto, ok, cancelar})
    }

    const erro = (conteudo: any) => {
        setExibeErro(true)
        setConteudoErro(conteudo)
    }

    const alerta = (conteudo: any) => {
        setConteudoAlerta(conteudo)
    }

    const listarColecao = async (url: string, params?: object) => {
        const usuarioLocal = usuario ? usuario : getUsuarioStorage()

        if (!usuarioLocal) {
            return []
        }
        
        exibirLoading()

        try {        
            const dados = await get(url, usuarioLocal, params)

            if (dados.status === 201 && dados.data && dados.data.indexOf('$') >= 0) {
                throw `${dados.status} - ${dados.data.substring(1)}`
            } else if (dados.status !== 200) {
                throw `A consulta não retornou dados: ${dados.status} - ${dados.data}`
            } else {
                return dados.data
            }
          } catch(ex){
            erro(`${ex}`)
            esconderLoading()
            throw ex
          } finally {
            esconderLoading()
          }
    }

    const gravarObj = async (url: string, obj: object) => {
        const usuarioLocal = usuario ? usuario : getUsuarioStorage()

        if (!usuarioLocal) {
            return []
        }

        exibirLoading()

        try {      
            const res = obj['_id'] ? 
                await put(url, usuarioLocal, obj) : 
                await post(url, usuarioLocal, obj)

            if (res.status == 201) {
                if (res.data.toString().startsWith('$')) {
                    throw res.data.substring(1)
                }
                
                return res.data
            }
        } catch(ex){
            log('desenv', ex)
            erro(`${ex}`)
            esconderLoading()
            throw ex
        } finally {
            esconderLoading()
        }
    }

    const axiosPost = async (url: string, obj: object) => {
        const usuarioLocal = usuario ? usuario : getUsuarioStorage()

        if (!usuarioLocal) {
            return []
        }

        exibirLoading()

        try {   
            const res = await post(url, usuarioLocal, obj)

            if (res.status == 201) {
                if (res.data.toString().startsWith('$')) {
                    throw res.data.substring(1)
                }
                
                return res.data
            }
        } catch(ex){
            log('desenv', ex)
            erro(`${ex}`)
            esconderLoading()
            throw ex
        } finally {
            esconderLoading()
        }
    }

    const uploadArquivo = async (endpoint: string, chaveArquivo: string, diretorio: string, arquivo: any) => {
        const usuarioLocal = usuario ? usuario : getUsuarioStorage()

        if (!usuarioLocal) {
            return []
        }

        exibirLoading()

        try {            
            const res = await postUpload(endpoint, usuarioLocal, chaveArquivo, diretorio, arquivo)
            
            if (res.status == 201) {
                if (res.data.toString().startsWith('$')) {
                    throw res.data.substring(1)
                }
                
                return res.data
            }

            return res.data
        } catch(ex){
            log('desenv', ex)
            erro(`${ex}`)
            esconderLoading()
            throw ex
        } finally {
            esconderLoading()
        }
    }

    const uploadArquivoCadastro = async (endpoint: string, arquivo: any, obj: any) => {
        const usuarioLocal = usuario ? usuario : getUsuarioStorage()

        if (!usuarioLocal) {
            return []
        }

        exibirLoading()

        try {
            const res = await postUploadCadastro(endpoint, usuarioLocal, arquivo, obj)
            const dataStr = JSON.stringify(res.data)

            if (res.status == 201) {
                if (dataStr.toString().startsWith('$')) {
                    throw dataStr.substring(1)
                }
                
                return dataStr
            }

            return res.data
        } catch(ex){
            log('desenv', ex)
            erro(`${ex}`)
            esconderLoading()
            throw ex
        } finally {
            esconderLoading()
        }
    }

    const excluirObj = async (url: string, id: string) => {
        const usuarioLocal = usuario ? usuario : getUsuarioStorage()

        if (!usuarioLocal) {
            return []
        }

        try {      
            exibirLoading()            
            log('desenv', `Antes de executar o delete, url=${url}, id=${id}`)
            const retorno = await deleteAxios(url, usuarioLocal, id)

            if (retorno.data.toString().startsWith('$')) {
                throw retorno.data.toString().substring(1)
            }

            return retorno
        } catch(ex){
            erro(`${ex}`)
            esconderLoading()
            throw ex
        } finally {
            esconderLoading()
        }
    }

    const axiosGet = async (url: any, params?: object) => {  
        const usuarioLocal = usuario ? usuario : getUsuarioStorage()

        if (!usuarioLocal) {
            return []
        }
        
        exibirLoading()

        try {        
            const dados = await get(url, usuarioLocal, params)
            const dadosStr = `${JSON.stringify(dados.data)}`
            
            if (dados.status === 201 && dadosStr.indexOf('$') >= 0) {
                throw `${dados.status} - ${dados.data.substring(1)}`
            } else if (dados.status !== 200) {
                throw `A consulta não retornou dados: ${dados.status} - ${dados.data}`
            } else {
                return dados.data
            }
        } catch(ex){
            erro(`${ex}`)
            esconderLoading()
            throw ex
        } finally {
            esconderLoading()
        }
    }

    const axiosDownload = async (url: any, params?: object) => { 
        const usuarioLocal = usuario ? usuario : getUsuarioStorage()

        if (!usuarioLocal) {
            return []
        }
        
        exibirLoading()

        try {        
            const dados = await getDownload(url, usuarioLocal, params)
            
            if (dados.status !== 200) {
                throw `A consulta não retornou dados: ${dados.status} - ${dados.data}`
            } else {
                return dados.data
            }
        } catch(ex){
            erro(`${ex}`)
            esconderLoading()
            throw ex
        } finally {
            esconderLoading()
        }
    }

    return (
        <AppContext.Provider value={{
            exibirLoading,
            esconderLoading,
            exibirModal,
            esconderModal,
            exibirToast,
            pergunta,
            erro,
            listarColecao,
            gravarObj,
            excluirObj,
            axiosGet,
            alerta,
            uploadArquivo,
            axiosPost,
            uploadArquivoCadastro,
            axiosDownload,
            executaComLoading
        }}>
            {
                conteudoPergunta ? 
                <DialogPergunta 
                    conteudo={conteudoPergunta.texto} 
                    ok={conteudoPergunta.ok}
                    cancelar={conteudoPergunta.cancelar}
                    sair={() => { setConteudoPergunta(null) }}
                /> : 
                null
            } 
            {
                !exibeErro ? 
                    null :
                    <DialogErro conteudo={conteudoErro} visivel sair={()=>{setExibeErro(false)}} />
            }
            {
                !conteudoAlerta ? 
                    null :
                    <DialogAlerta conteudo={conteudoAlerta} visivel sair={()=>{setConteudoAlerta(null)}} />
            }
            {getJsxToastContainer()}
            {
                modal ? 
                    <Modal 
                        conteudo={conteudoModal.conteudo} 
                        titulo={conteudoModal.titulo} 
                        tamanho={conteudoModal.tamanho}
                    /> : 
                    null
            }
            {loading ? <SpinnerCentro /> : null}
            {exibirChildren ? props.children : <SpinnerCentro />}
        </AppContext.Provider>
    )
}

export default AppContext