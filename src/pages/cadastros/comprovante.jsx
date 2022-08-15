import Layout from '../../components/template/Layout'
import { IconeColecao } from '../../components/icons'
import { useEffect, useState } from 'react'
import Edicao from '../../components/telas/comprovante/Edicao'
import Pesquisa from '../../components/telas/comprovante/Pesquisa'
import useAppData from '../../data/hook/useAppData'
import endpoints from '../../data/endpoints.json'
import _ from 'lodash'

export default function Comprovante() {
  const [edicao, setEdicao] = useState(null)
  const { pergunta, listarColecao, exibirToast, 
        excluirObj, uploadArquivoCadastro, axiosPost } = useAppData()
  const [ dadosPesquisa, setDadosPesquisa ] = useState([])

  const excluiItem = itemParaExclusao => {
    excluirObj(endpoints.COMPROVANTE, itemParaExclusao._id).then(retorno => {
      if (!retorno){
        return
      }

      const novosDados = dadosPesquisa.filter(item => item._id !== itemParaExclusao._id)
      setDadosPesquisa(novosDados)
    })
  }

  /*
  useEffect(()=>{
    listarColecao(endpoints.COMPROVANTE).then(setDadosPesquisa)

    return () => {
      setDadosPesquisa([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  */
  
  async function gravar(vo) {
    const novoVo = _.cloneDeep(vo)

    if (!novoVo._id) {
      delete novoVo.arquivo 
    }
    
    await axiosPost(endpoints.COMPROVANTE, novoVo)
    
    uploadArquivoCadastro(endpoints.UPLOAD_COMPROVANTE, (vo._id ? null : vo.arquivo), novoVo).then(retorno =>{
      if (!retorno) {
        return
      }
      
      setDadosPesquisa([
        retorno, 
        ...dadosPesquisa.filter(item => retorno._id !== item._id)
      ])

      exibirToast('Registro gravado', 'sucesso')
      setEdicao(null)
    })
  }

  return (
      <Layout titulo='Cadastro de comprovantes' icone={IconeColecao()}>
        { 
          edicao ?

            <Edicao
              gravar={obj => {
                pergunta('O registro será gravado. Confirma?', () => gravar(obj))
              }}
              voltar={() => {
                setEdicao(null)
              }}               
              objEditado={edicao} 
            /> :
            <Pesquisa 
              dados={dadosPesquisa}
              
              novo={()=>{
                setEdicao({})
              }}
              edicao={(obj) => {
                setEdicao(obj)
              }}
              excluir={obj =>{
                pergunta('Confirma a exclusão do registro?', ()=>{excluiItem(obj)})        
              }}
            />
        }
      </Layout>
    )
}