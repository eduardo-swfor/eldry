import Layout from '../../components/template/Layout'
import { IconeCarta } from '../../components/icons'
import { useEffect, useState } from 'react'
import Edicao from '../../components/telas/mensagem/Edicao'
import Pesquisa from '../../components/telas/mensagem/Pesquisa'
import useAppData from '../../data/hook/useAppData'
import _ from 'lodash'
import endpoints from '../../data/endpoints.json'

export default function Mensagem() {
  const [edicao, setEdicao] = useState(null)
  const { pergunta, listarColecao, exibirToast, 
    excluirObj, uploadArquivoCadastro } = useAppData()
  const [ dadosPesquisa, setDadosPesquisa ] = useState([])

  const excluiItem = itemParaExclusao => {
    excluirObj(endpoints.MENSAGEM, itemParaExclusao._id).then(retorno => {
      if (!retorno){
        return
      }

      const novosDados = dadosPesquisa.filter(item => item._id !== itemParaExclusao._id)
      setDadosPesquisa(novosDados)
    })
  }
  
  useEffect(()=>{
    listarColecao(endpoints.MENSAGEM).then(setDadosPesquisa)

    return () => {
      setDadosPesquisa([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  async function gravar(vo) {
    const novoVo = _.cloneDeep(vo)
    delete novoVo.arquivo 
    
    uploadArquivoCadastro(endpoints.UPLOAD_MENSAGEM, vo.arquivo, novoVo).then(retorno =>{
      if (!retorno) {
        return
      }

      if (vo._id) {
        setDadosPesquisa(dadosPesquisa.map(item => retorno._id === item._id ? retorno : item))
      } else {
        setDadosPesquisa([ retorno, ...dadosPesquisa ])
      }

      exibirToast('Registro gravado', 'sucesso')
      setEdicao(null)
    })
  }

  return (
      <Layout titulo='Cadastro de mensagens' icone={IconeCarta()}>        
        { 
          edicao ?

            <Edicao
              gravar={obj => {
                pergunta('O registro será gravado. Confirma?', () => gravar(obj))
              }}
              voltar={() => {
                setEdicao(null)
              }} 
              objEditado={edicao} /> :

            <Pesquisa 
              dados={dadosPesquisa}
              
              novo={()=>{
                setEdicao({})
              }}
              
              excluir={obj =>{
                pergunta('Confirma a exclusão do registro?', ()=>{excluiItem(obj)})        
              }}
            />
        }
      </Layout>
    )
}