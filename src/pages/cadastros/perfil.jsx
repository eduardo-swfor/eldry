import Layout from '../../components/template/Layout'
import { IconeUsuarios } from '../../components/icons'
import { useEffect, useState } from 'react'
import EdicaoPerfil from '../../components/telas/perfil/EdicaoPerfil'
import PesquisaPerfil from '../../components/telas/perfil/PesquisaPerfil'
import useAppData from '../../data/hook/useAppData'
import _ from 'lodash'
import endpoints from '../../data/endpoints.json'

export default function Perfil() {
  const [edicao, setEdicao] = useState(null)
  const { 
    pergunta, listarColecao, 
    gravarObj, exibirToast, 
    excluirObj 
  } = useAppData()
  const [ dadosPesquisa, setDadosPesquisa ] = useState([])

  const excluiItem = itemParaExclusao => {
    excluirObj(endpoints.PERFIL, itemParaExclusao._id).then(retorno => {
      if (!retorno){
        return
      }
      
      const novosDados = dadosPesquisa.filter(item => item._id !== itemParaExclusao._id)
      setDadosPesquisa(novosDados)
    })
  }

  useEffect(()=>{    
    listarColecao(endpoints.PERFIL).then(setDadosPesquisa)

    return () =>{
      setDadosPesquisa(null)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function gravar(vo) {    
    vo.endpoints = vo.admin ? [] : vo.endpoints.filter(i => i.get || i.put || i.post || i.delete)
    vo.paginas = vo.admin ? [] : vo.paginas.filter(i => i.permitido)
    vo.itensPermitidos = []
    vo.itensPermitidos.push(...vo.paginas.map(i => i.route))
    vo.itensPermitidos.push(...vo.endpoints.map(i => i.route))

    gravarObj(endpoints.PERFIL, vo).then(retorno =>{
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
      <Layout titulo='Cadastro de perfis' icone={IconeUsuarios()}>
        { 
          edicao ?
            <EdicaoPerfil 
              gravar={obj => {
                pergunta('O registro será gravado. Confirma?', () => gravar(obj))
              }}
              voltar={() => {
                setEdicao(null)
              }} 
              objEditado={edicao} /> :

            <PesquisaPerfil 
              dados={dadosPesquisa}
              novo={()=>{
                setEdicao({nome: ''})
              }}
              copiar={valor=>{
                const novoValor = _.cloneDeep(valor)
                delete novoValor._id
                novoValor.nome = `${novoValor.nome} - Cópia`

                setEdicao(novoValor)
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