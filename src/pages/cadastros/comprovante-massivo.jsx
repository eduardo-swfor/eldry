import { useDropzone } from 'react-dropzone'
import Layout from '../../components/template/Layout'
import { IconeArquivo, IconeColecao, IconeDiretorio, IconeCheck, IconeX, IconeSoma } from '../../components/icons'
import { useEffect, useState } from 'react'
import useAppData from '../../data/hook/useAppData'
import endpoints from '../../data/endpoints.json'
import _ from 'lodash'
import BotaoGravar from '../../components/botoes/BotaoGravar'
import IntegerInput from '../../components/inputs/IntegerInput'
import TabelaDados from '../../components/tabelas/TabelaDados'
import { formataData } from '../../utils/DateUtils'
import If from '../../components/utils/If'
import DateInput from '../../components/inputs/DateInput'
import SelectComboColecao from '../../components/inputs/SelectComboColecao'
import Subtitulo from '../../components/labels/Subtitulo'


export default function ComprovantMassivo() {
    const { listarColecao } = useAppData()
    const [estado, setEstado] = useState({})
    const [empresas, setEmpresas] = useState([])
    const [arquivos, setArquivos] = useState([])
    const [erros, setErros] = useState([])
    const { 
        pergunta, alerta, exibirModal, erro, 
        uploadArquivoCadastro, axiosPost 
    } = useAppData()

    useEffect(() => {
        listarColecao(endpoints.EMPRESA).then(res => {
            setEmpresas(res)
        })

        return () => {
            setEmpresas(null)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

    useEffect(() => {
        if (!empresas) {
            setArquivos([])
            setErros([])
        } else {
            setErros([])

            const arquivosProcessados = acceptedFiles.map(file => {
                const itens = file.path.split('.').map(i => i.trim())
        
                let arquivo = {
                    erros: [],
                    arquivo: file
                }
        
                if (itens.length < 2) {
                    arquivo.erros = ['Formato errado']
                } else {
                    let erros = []
                    
                    if (!estado.data) {
                        erros.push('Data não selecionada')
                    } else {
                        arquivo.data = formataData(estado.data)
                    }

                    if (!estado.tipo) {
                        erros.push('Tipo não informado')
                    } else {
                        arquivo.tipo = estado.tipo
                    }
                    
                    if (!estado.banco) {
                        erros.push('Banco não informado')
                    } else {
                        arquivo.banco = estado.banco
                    }
        
                    const codigoInformado = itens[0].trim().toUpperCase()
                    const empresaFiltrada = empresas.filter(t => t.codigo.toUpperCase() == codigoInformado)
                    arquivo.empresa = empresaFiltrada.length > 0 ? empresaFiltrada.pop() : ''
                    if (!arquivo.empresa) erros.push('Empresa não cadastrada')
        
                    if (erros.length > 0) {
                        arquivo.erros = erros
                    }
                }
        
                return arquivo
            })

            const arquivosSemErrosValidacao = arquivosProcessados.filter(i => i.erros.length == 0)

            if (arquivosSemErrosValidacao.length > 0) {
                
                const arquivosValidacao = arquivosSemErrosValidacao.map(item => {
                    const copiaItem = _.cloneDeep(item)
                    delete copiaItem.arquivo
                    copiaItem.nomeArquivo = item.arquivo.name
                    
                    return copiaItem
                })

                axiosPost(endpoints.COMPROVANTE, { validacaoMassivo: true, comprovantes: arquivosValidacao }).then(retorno => {
                    retorno.map(dup => {
                        arquivosProcessados
                            .filter(item => dup.nomeArquivo === item.arquivo.name)
                            .map(item => {
                                item.erros.push('Arquivo já cadastrado')
                            })
                    })
    
                    setArquivos(arquivosProcessados)
                })
            } else {
                setArquivos(arquivosProcessados)
            }
            
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [acceptedFiles])
    
    const jsxBotoes = (p) => {
        return p.erros.length ? 
                    <div className='flex flex-col'>
                        <div className='text-red-500 flex'>{IconeX(5)} Não aprovado</div> 
                        {p.erros.map((e, indice) => <div key={indice} className='text-sm pl-2'>{e}</div>)}
                    </div> :
                    <div className='text-green-500 flex'>{IconeCheck(5)} Aprovado</div>
    }

    async function gravarRegistros() {
        const arquivosParaGravar = arquivos.filter(i => i.erros?.length == 0)

        if (!arquivosParaGravar || !arquivosParaGravar.length) {
            alerta('Nenhum registro pode ser importado')
        } else {            
            const exec = async () => {
                try {
                    let qtd = 0

                    for (let indice in arquivosParaGravar) {
                        const item = arquivosParaGravar[indice]

                        const novoVo = _.cloneDeep(item)
                        delete novoVo.arquivo         
                        try {
                            await uploadArquivoCadastro(endpoints.UPLOAD_COMPROVANTE, item.arquivo, novoVo)
                            qtd++
                        } catch (error) {
                            setErros([...erros, item])                               
                        }
                    }
                    
                    setArquivos([])
                    exibirModal('Registros gravados', `${qtd} registro(s) gravados com sucesso!`)
                } catch (error) {
                    erro(JSON.stringify(error))
                }
            }

            pergunta(`Confirma o envio de ${arquivosParaGravar.length} arquivo(s)?`, exec)
        }
      }

    return (
        <Layout titulo='Cadastro massivo de comprovantes' icone={IconeColecao()}>
            <div {...getRootProps({className: 'dropzone'})} className={`
                w-full flex flex-wrap p-6 border-dashed  border-2
                rounded bg-blue-50 items-center justify-center
                cursor-pointer
            `}>
                <div className='flex items-center'>{IconeDiretorio(10)}{IconeSoma(5)}</div>
                <input {...getInputProps()}/>
                <p className='text-lg'>{'Arraste os arquivos para esta área ou clique em qualquer local para selecioná-los'}</p>
                <div className='w-full mt-2 border-t pt-2 border-gray-400'>
                    <div className='flex'>
                        <div className='text-sm font-bold text-red-500'>Formato esperado do arquivo:</div>
                        <div className='ml-2 text-sm font-bold text-red-500'>EMPRESA.EXTENSÃO</div>
                    </div>
                    <div className='flex mt-1'>
                        <div className='text-sm font-bold'>EMPRESA:</div>
                        <div className='ml-2 text-sm'>Código da empresa cadastrado no sistema</div>
                    </div>
                    <div className='flex mt-1'>
                        <div className='text-sm font-bold'>EXTENSÃO:</div>
                        <div className='ml-2 text-sm'>Extensão do arquivo, os comprovantes geralmente são do tipo .pdf ou .jpg</div>
                    </div>
                </div>
            </div>                    
            
            <div className='flex flex-col items-end w-full mt-2'>
                <If exibir={arquivos.length > 0}>
                    <div className='grid grid-cols-3 w-full md:w-3/5 gap-2 items-center'>
                        <IntegerInput 
                            readOnly
                            label='OK' 
                            value={arquivos.filter(i => i.erros?.length == 0).length}
                        />
                        <IntegerInput 
                            readOnly
                            label='Erros' 
                            value={arquivos.filter(i => i.erros?.length > 0).length}
                        />
                        <div className='w-full flex justify-end'>
                            <BotaoGravar
                                className='mt-4 w-min'
                                onClick={gravarRegistros}
                            />
                        </div>
                    </div>
                </If>                
            </div>

            <Subtitulo className='mt-2'>
                Preencha todos os campos abaixo, sem seguida selecione os arquivos
            </Subtitulo>

            <div className='grid grid-cols-1 md:grid-cols-3'>                
                <DateInput
                    required
                    label='Data comprovantes'
                    value={estado ? estado.data : ''}
                    onChange={valor => {
                        setEstado({...estado, data: valor})
                    }}
                />
                <SelectComboColecao 
                    required
                    campoLabel='descricao'
                    label='Tipo comprovante'
                    className='md:ml-2'
                    endpoint={endpoints.TIPO_COMPROVANTE}
                    onChange={valor => {
                        setEstado({...estado, tipo: valor?.descricao})
                    }}
                />
                <SelectComboColecao 
                    required
                    campoLabel='nome'
                    label='Banco'
                    className='md:ml-2'
                    endpoint={endpoints.BANCO}
                    onChange={valor => {                        
                        setEstado({...estado, banco: valor})
                    }}
                />
            </div>

            <If exibir={erros.length > 0}>
                <div className='w-full flex mt-2'>
                    <div className='text-sm font-bold text-red-500 mb-2'>Listagem de erros do envio</div>

                    <TabelaDados 
                        className='w-full'
                        propriedades={[
                            {nome: 'data', tipo: 'string', titulo: 'Data' }, 
                            {nome: 'tipo', tipo: 'string', titulo: 'Tipo' }, 
                            {nome: 'banco.nome', tipo: 'string', titulo: 'Banco' }, 
                            {nome: 'empresa.nome', tipo: 'string', titulo: 'Empresa'}, 
                            {nome: 'arquivo.name', tipo: 'string', titulo: 'Arquivo'}, 
                        ]} 
                        titulo='Erros'
                        dados={erros ? erros : []}
                        icone={IconeX(5)}
                    />
                </div>
            </If>

            <TabelaDados 
                className='w-full'
                propriedades={[
                    {nome: 'Aprovado?', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes },
                    {nome: 'data', tipo: 'string', titulo: 'Data' }, 
                    {nome: 'tipo', tipo: 'string', titulo: 'Tipo' }, 
                    {nome: 'banco.nome', tipo: 'string', titulo: 'Banco' }, 
                    {nome: 'empresa.nome', tipo: 'string', titulo: 'Empresa'}, 
                    {nome: 'arquivo.name', tipo: 'string', titulo: 'Arquivo'}, 
                ]} 
                titulo='Arquivos importados'
                dados={arquivos ? arquivos : []}
                icone={IconeArquivo(5)}
            />      
        </Layout>
    )
}