import Layout from '../../components/template/Layout'
import { IconeGlobo } from '../../components/icons'
import { useEffect, useState } from 'react'
import EdicaoDominio from '../../components/telas/dominio/EdicaoDominio'
import PesquisaDominio from '../../components/telas/dominio/PesquisaDominio'
import useAppData from '../../data/hook/useAppData'
import _ from 'lodash'
import endpoints from '../../data/endpoints.json'

export default function Dominio() {
  const [edicao, setEdicao] = useState(null)
  const { pergunta, listarColecao, gravarObj, exibirToast, excluirObj } = useAppData()
  const [ dadosPesquisa, setDadosPesquisa ] = useState([])

  const excluiItem = itemParaExclusao => {
    excluirObj(endpoints.DOMINIO, itemParaExclusao._id).then(retorno => {
      if (!retorno){
        return
      }

      const novosDados = dadosPesquisa.filter(item => item._id !== itemParaExclusao._id)
      setDadosPesquisa(novosDados)
    })
  }
  
  useEffect(()=>{
    listarColecao(endpoints.DOMINIO).then(setDadosPesquisa)

    return () => {
      setDadosPesquisa([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  async function gravar(vo) {
    gravarObj(endpoints.DOMINIO, vo).then(retorno =>{
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
      <Layout titulo='Cadastro de domínios permitidos' icone={IconeGlobo()}>
        { 
          edicao ?

            <EdicaoDominio
              gravar={obj => {
                pergunta('O registro será gravado. Confirma?', () => gravar(obj))
              }}
              voltar={() => {
                setEdicao(null)
              }} 
              objEditado={edicao} /> :

            <PesquisaDominio 
              dados={dadosPesquisa}
              novo={()=>{
                setEdicao({nome: ''})
              }}
              editar={obj =>{
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