import SearchInput from '../../components/inputs/SearchInput'
import Layout from '../../components/template/Layout'
import { useEffect, useState } from 'react'
import useAppData from '../../data/hook/useAppData'
import endpoints from '../../data/endpoints.json'
import { IconeDocumento } from '../../components/icons'
import TabelaDados from '../../components/tabelas/TabelaDados'

export default function UsuariosCadastrados() {
    const [dadosOriginais, setDadosOriginais] = useState([])
    const [dadosFiltrados, setDadosFiltrados] = useState([])

    const { listarColecao } = useAppData()

    useEffect(() => {
        listarColecao(endpoints.LISTAR_USUARIOS).then(lista => {
            setDadosOriginais(lista)
            setDadosFiltrados(lista)
        })
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Layout titulo='Listagem de usuários cadastrados' icone={IconeDocumento()}>
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
                            }
                            ))
                        }
                    }}
                />

               

                <TabelaDados 
                    className='w-full max-h-screen'
                    propriedades={[
                        {nome: 'email', tipo: 'string', titulo: 'E-mail' }, 
                        {nome: 'perfil', tipo: 'string', titulo: 'Perfil' }
                    ]} 
                    titulo='Usuários'
                    dados={dadosFiltrados}
                />
            </div>
        </Layout>
    )
}