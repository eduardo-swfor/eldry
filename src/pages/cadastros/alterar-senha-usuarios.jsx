import SearchInput from '../../components/inputs/SearchInput'
import Layout from '../../components/template/Layout'
import { useEffect, useState } from 'react'
import useAppData from '../../data/hook/useAppData'
import endpoints from '../../data/endpoints.json'
import { IconeEscudo } from '../../components/icons'
import TabelaDados from '../../components/tabelas/TabelaDados'
import BotaoEditarTabela from '../../components/botoes/BotaoEditarTabela'
import FormAlterarSenhaAdm from '../../components/auth/FormAlterarSenhaAdm'
import Subtitulo from '../../components/labels/Subtitulo'
import BotaoVoltar from '../../components/botoes/BotaoVoltar'

export default function AlterarSenhaUsuarios() {
    const [dadosOriginais, setDadosOriginais] = useState([])
    const [dadosFiltrados, setDadosFiltrados] = useState([])
    const [usuarioEditado, setUsuarioEditado] = useState('') 
    
    const { listarColecao } = useAppData()

    useEffect(() => {
        listarColecao(endpoints.LISTAR_USUARIOS).then(lista => {
            setDadosOriginais(lista)
            setDadosFiltrados(lista)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const jsxBotoes = (p) => {
        return (
            <div>
                <BotaoEditarTabela 
                    label='Alterar senha'                    
                    onClick={() => setUsuarioEditado(p.email)}
                />
            </div>
        )
      }

    return (        
        <Layout titulo='Listagem de usuários cadastrados' icone={IconeEscudo()}>
            {
                usuarioEditado ? 
                    <div className='w-full flex flex-col items-end'>
                        <div className='w-full flex flex-row'>
                            <Subtitulo className='flex-grow'>
                                {`Alterar senha do usuário: ${usuarioEditado}`}
                            </Subtitulo>
                            <BotaoVoltar 
                                className='ml-2'
                                onClick={() => setUsuarioEditado('')}
                            />
                        </div>
                        <FormAlterarSenhaAdm 
                            className='w-full'
                            usuario={usuarioEditado}
                            sair={() => setUsuarioEditado('')}
                        />
                    </div> :
                    <div className='flex flex-wrap w-full h-full'>
                        <SearchInput
                            placeholder='Digite o texto para pesquisa'
                            className='w-full'
                            value=''
                            onChange={valor => {
                                if (valor.toUpperCase().trim().length == 0) {
                                    setDadosFiltrados(dadosOriginais)
                                } else {
                                    setDadosFiltrados(dadosOriginais.filter(i => {
                                        return i.email.toUpperCase().indexOf(valor.toUpperCase().trim()) >= 0 ||
                                            i.perfil?.toUpperCase().indexOf(valor.toUpperCase().trim()) >= 0
                                    }))
                                }
                            }}
                        />

                    

                        <TabelaDados 
                            className='w-full'
                            propriedades={[
                                {nome: 'Ações', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes },
                                {nome: 'email', tipo: 'string', titulo: 'E-mail' }, 
                                {nome: 'perfil', tipo: 'string', titulo: 'Perfil' }
                            ]} 
                            titulo='Usuários'
                            dados={dadosFiltrados}
                        />
                    </div>
            }
            
        </Layout>
    )
}