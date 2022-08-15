import TextInput from '../../inputs/TextInput'
import Subtitulo from '../../labels/Subtitulo'
import TabelaDados from '../../tabelas/TabelaDados'
import BotaoGravar from '../../botoes/BotaoGravar'
import BotaoVoltar from '../../botoes/BotaoVoltar'
import { getEstruturaPermissoes } from '../../../utils/permissao-utils'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import CheckboxInput from '../../inputs/CheckboxInput'
import useAppData from '../../../data/hook/useAppData'

export default function EdicaoPerfil({objEditado, voltar, gravar}) {
    
    const [vo, setVo] = useState(objEditado)
    const { erro } = useAppData()

    useEffect(()=>{
        const dados = getEstruturaPermissoes()        
        const novoVo = _.cloneDeep(objEditado)        
        
        novoVo.paginas = dados.paginas.map(i => { 
            if (!vo.paginas) {
                return i
            }

            const achado = vo.paginas.filter(o => o.route === i.route)
            return achado && achado.length > 0 ? _.cloneDeep(achado[0]) : i
        })
        
        novoVo.endpoints = dados.endpoints.map(i => { 
            if (!vo.endpoints) {
                return i
            }

            const achado = vo.endpoints.filter(o => o.route === i.route)
            return achado && achado.length > 0 ? _.cloneDeep(achado[0]) : i
         })

        setVo(novoVo)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function validaDados() {
        const erros = []

        if (!vo.nome) {
            erros.push('O campo nome deve ser preenchido')
        }

        if (erros.length > 0) {
            erro(erros.join('\n'))
            return false
        }

        return true
    }

    const jsxRodapeEndpoint = () => {        
        return (
            <>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-2 justify-between'>
                    <CheckboxInput 
                        label='Pesquisar' 
                        onChange={valor => {                            
                            const novo = _.cloneDeep(vo)                        
                            novo.endpoints.map(p => {
                                p.get = valor
                            })
                            setVo(novo)
                        }}
                    /> 
                    <CheckboxInput 
                        label='Gravar' 
                        onChange={valor => {
                            const novo = _.cloneDeep(vo)                        
                            novo.endpoints.map(p => {
                                p.post = valor
                            })
                            setVo(novo)
                        }}
                    /> 
                    <CheckboxInput 
                        label='Alterar' 
                        onChange={valor => {
                            const novo = _.cloneDeep(vo)                        
                            novo.endpoints.map(p => {
                                p.put = valor
                            })
                            setVo(novo)
                        }}
                    />                 
                    <CheckboxInput 
                        label='Excluir' 
                        onChange={valor => {
                            const novo = _.cloneDeep(vo)                        
                            novo.endpoints.map(p => {
                                p.delete = valor
                            })
                            setVo(novo)
                        }}
                    />                    
                </div>
            </>
        )
    }

    const getJsxTabelas = () => {
        return (
            <>
                <TabelaDados 
                    className='w-full max-h-96'
                    propriedades={[
                        {nome: 'route', titulo: 'Caminho', tipo:'string', edicao: false}, 
                        {nome: 'permitido', titulo: 'Permitido', tipo:'boolean', edicao: true}
                    ]} 
                    titulo='Permissões de páginas'
                    dados={vo.paginas}
                    onChange={valor => {
                        const novoVo = _.cloneDeep(vo)
                        novoVo.paginas = _.cloneDeep(valor)
                        setVo(novoVo)
                    }}
                    jsxRodape={
                        <CheckboxInput 
                            label='Permitido' 
                            onChange={valor => {                                
                                const novo = _.cloneDeep(vo)                        
                                novo.paginas.map(p => {p.permitido = valor})
                                setVo(novo)
                            }}
                            className='mr-4'
                        /> 
                    }
                />
                                
                <TabelaDados 
                    className='w-full max-h-96'
                    propriedades={[
                        {nome: 'route', titulo: 'Nome', tipo:'string', edicao: false}, 
                        {nome: 'get', titulo: 'Pesquisar', tipo:'Boolean', edicao: true}, 
                        {nome: 'post', titulo: 'Gravar', tipo:'Boolean', edicao: true}, 
                        {nome: 'put', titulo: 'Alterar', tipo:'Boolean', edicao: true}, 
                        {nome: 'delete', titulo: 'Excluir', tipo:'Boolean', edicao: true}
                    ]} 
                    titulo='Permissões de API'
                    dados={vo.endpoints}
                    onChange={valor => {
                        const novo = _.cloneDeep(vo)
                        novo.endpoints = _.cloneDeep(valor)
                        setVo(novo)
                    }}
                    jsxRodape={jsxRodapeEndpoint()}
                />
            </>
        )
    }

    return (
        <>
            <div className='flex flex-wrap w-full h-full px-2'>
                <div className='flex flex-row w-full'>
                    <Subtitulo className='flex-grow'>Alteração/Inclusão de perfil</Subtitulo>
                    <div className='flex'>
                        <BotaoVoltar 
                            className='mr-3'
                            onClick={voltar}
                        />
                        <BotaoGravar 
                            onClick={() => {
                                if (validaDados()) {
                                    gravar(vo)
                                }
                            }} />
                    </div>
                </div>
                
                <TextInput 
                    required
                    label='Nome do perfil' 
                    placeholder='Digite aqui o nome do perfil' 
                    className='w-full' 
                    value={vo.nome}
                    onChange={valor => { 
                        setVo({...vo, nome: valor})
                     }}
                /> 
                <div className='flex flex-wrap'>
                    <CheckboxInput 
                        value={vo.admin}
                        label='Admin?'
                        onChange={valor => {
                            setVo({...vo, admin: valor})
                         }}
                        className='mr-2'
                    />

                    <CheckboxInput 
                        value={vo.padrao}
                        label='Padrão?'
                        onChange={valor => { 
                            setVo({...vo, padrao: valor})
                        }}
                        className='mr-2'
                    />

                    <CheckboxInput 
                        value={vo.areaPagamentos}
                        label='Área pagamentos?'
                        onChange={valor => { 
                            setVo({...vo, areaPagamentos: valor})
                         }}
                    />
                </div>                  
                         
                {vo.admin ? null : getJsxTabelas()}                
                
            </div>
        </>
      )
}