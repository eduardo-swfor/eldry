import { useEffect, useLayoutEffect, useState } from 'react'
import useAppData from '../../../data/hook/useAppData'
import TextInput from '../../inputs/TextInput'
import SearchInput from '../../inputs/SearchInput'
import endpoints from '../../../data/endpoints.json'
import BotaoPesquisa from '../../botoes/BotaoPesquisa'
import ModalSemBotao from '../../modal/ModalSemBotao'
import DialogPesquisaEmpresa from './DialogPesquisaEmpresa'

export default function CampoPesquisaEmpresa({onChange=null, value=null, className='', required=false, enter=null}) {
    const [codigo, setCodigo] = useState('')
    const [empresaSelecionada, setEmpresaSelecionada] = useState(null)
    const [atualizaPesquisa, setAtualizaPesquisa] = useState(false)
    const [listaEmpresas, setListaEmpresas] = useState([])
    const [pesquisa, setPesquisa] = useState(false)
    const { listarColecao, exibirModal, axiosGet, esconderModal } = useAppData()


    useLayoutEffect(() => {
        listarColecao(endpoints.EMPRESA).then(setListaEmpresas)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [atualizaPesquisa])
    
    useEffect(() => {
        if (value) {
            setEmpresaSelecionada(value)
            setCodigo(value.codigo)
        } else {
            setEmpresaSelecionada(null)
            setCodigo('')
        }
    }, [value])

    const selecionaEmpresa = valor => {
        setCodigo(valor)

        if (listaEmpresas) {
            const selecionada = listaEmpresas.filter(e => e.codigo.toUpperCase() === valor).pop()

            if (selecionada){
                setEmpresaSelecionada(selecionada)
                //if (onChange) onChange(selecionada)
            } else {
                setEmpresaSelecionada(null)    
            }

            if (onChange) onChange(selecionada)
        } else {
            setEmpresaSelecionada(null)
        }
    }    
    
    return (        
        <>
            {
                pesquisa ? 
                    <ModalSemBotao
                        conteudo={(
                            <DialogPesquisaEmpresa 
                                listaEmpresas={listaEmpresas}
                                selecionar={valor => selecionaEmpresa(valor)}
                                fechar={() => setPesquisa(false)}
                            />
                        )}
                        titulo='Pesquisa de empresas'
                        fechar={() => setPesquisa(false)}
                    /> :
                    null
            }
            <div className={`flex ${className}`}>
                <div className='w-1/4 flex flex-row items-center'>
                    <TextInput 
                        label='Empresa' 
                        className='w-full flex-grow'
                        value={codigo}
                        required={required}
                        onBlur={valor => {
                            selecionaEmpresa(valor)
                        }}  

                        onChange={valor =>{
                            selecionaEmpresa(valor)
                        }}

                        onKeyDown={evt => {
                            if (evt.key.toLowerCase() === 'enter') {
                                if (enter) enter()
                            }
                        }}

                    />
                    <BotaoPesquisa 
                        className='ml-1 mt-4 shadow-none'
                        label=''
                        onClick={async () => {
                            setPesquisa(true)
                        }}
                    />
                </div>
                
                <TextInput 
                    label='Nome'
                    required={required}
                    readOnly
                    desabilitarFocus
                    value={empresaSelecionada ? `${empresaSelecionada.codigo} - ${empresaSelecionada.nome}` : ''}
                    className='w-3/4 ml-2'
                />
            </div>
        </>
    )
}