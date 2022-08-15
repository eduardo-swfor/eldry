import SearchInput from '../../components/inputs/SearchInput'
import Subtitulo from '../../components/labels/Subtitulo'
import Titulo from '../../components/labels/Titulo'
import Layout from '../../components/template/Layout'
import { useEffect, useState } from 'react'
import { formataData } from '../../utils/DateUtils'
import useAppData from '../../data/hook/useAppData'
import endpoints from '../../data/endpoints.json'
import { IconeDocumento, IconeDownload, IconeList } from '../../components/icons'
import FileDownload from 'js-file-download'

export default function PesquisaDocumento() {
    const [dadosOriginais, setDadosOriginais] = useState([])
    const [dadosFiltrados, setDadosFiltrados] = useState([])

    const { listarColecao, axiosDownload, alerta } = useAppData()

    useEffect(() => {
        listarColecao(endpoints.DOCUMENTO).then(lista => {
            setDadosOriginais(lista)
            setDadosFiltrados(lista)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const download = async (doc) => {
        try {
            const retorno = await axiosDownload(endpoints.DOWNLOAD_ARQUIVO, { chave: doc.arquivo.nomeGravado })
            FileDownload(retorno, doc.arquivo.nomeOriginal)
        } catch (error) {
            alerta(`Erro ao fazer o download: ${error}`)
        }
    }

    return (
        <Layout titulo='Pesquisa de documentos' icone={IconeDocumento()}>
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
                                return i.descricao.toUpperCase().indexOf(valor.toUpperCase().trim()) >= 0 ||
                                    formataData(i.dataInicio).indexOf(valor.toUpperCase().trim()) >= 0 ||
                                    formataData(i.dataFim).indexOf(valor.toUpperCase().trim()) >= 0
                            }
                            ))
                        }
                    }}
                />

                {
                    !dadosFiltrados || dadosFiltrados.length == 0 ?
                        <Titulo className='mt-2'>NENHUM REGISTRO ENCONTRADO</Titulo> :
                        (
                            <div className={`
                        flex items-center w-full border-t
                        mt-2 pt-2
                    `}>
                                {IconeList()}
                                <Subtitulo className='pt-1 ml-2'>Lista de documentos encontrados</Subtitulo>
                            </div>
                        )
                }

                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2 pt-1'>
                    {
                        dadosFiltrados.map((p, indice) => {
                            return (
                                <div
                                    className={`
                                    rounded shadow-sm border p-2 flex justify-between 
                                    w-full cursor-pointer
                                    bg-blue-50
                                `}
                                    onClick={() => {
                                        download(p)
                                    }}
                                    key={indice}
                                >
                                    <Subtitulo className='mr-2'>{p.descricao}</Subtitulo>
                                    <div className='text-blue-500'>
                                        {IconeDownload(8)}
                                    </div>
                                </div>
                            )

                        })
                    }
                </div>
            </div>
        </Layout>
    )
}