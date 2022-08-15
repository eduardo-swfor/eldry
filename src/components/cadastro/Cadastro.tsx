import Layout from '../template/Layout'
import { IconeGlobo } from '../icons'
import { useEffect, useState } from 'react'
import Edicao from './Edicao'
import Pesquisa from './Pesquisa'
import { Tipo } from '../tabelas/TabelaDados'
import useAppData from '../../data/hook/useAppData'
import _ from 'lodash'

interface Campo extends Tipo {
    required?: boolean
    colunas: number
    exibicao: 'tabela' | 'form' | 'ambos'    
    endpointColecao?: string
    labelColecao?: string    
    gravarSomenteLabelColecao?: boolean
}

interface CadastroGenericoProps {
    colunas: number
    endpoint: string
    titulo: string
    campos: Campo[]
    aplicaFiltro: (vo:any, valorFiltro: string) => boolean
}

export default function CadastroGenerico(props: CadastroGenericoProps) {
    const [edicao, setEdicao] = useState(null)
    const { pergunta, listarColecao, gravarObj, exibirToast, excluirObj } = useAppData()
    const [ dadosPesquisa, setDadosPesquisa ] = useState([])    
  
    const excluiItem = itemParaExclusao => {
      excluirObj(props.endpoint, itemParaExclusao._id).then(retorno => {
        if (!retorno){
          return
        }
  
        const novosDados = dadosPesquisa.filter(item => item._id !== itemParaExclusao._id)
        setDadosPesquisa(novosDados)
      })
    }
    
    useEffect(()=>{
      listarColecao(props.endpoint).then(setDadosPesquisa)
  
      return () => {
        setDadosPesquisa([])
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    
    async function gravar(vo: any) {
      gravarObj(props.endpoint, vo).then(retorno =>{
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
        <Layout titulo={props.titulo} icone={IconeGlobo()}>
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
                    colunas={4}
                    campos={props.campos.filter(c => ['form', 'ambos'].find( i => i === c.exibicao) )}
                /> :
                <Pesquisa 
                    dados={dadosPesquisa}
                    aplicaFiltro={props.aplicaFiltro}
                    campos={props.campos.filter(c => ['tabela', 'ambos'].find( i => i === c.exibicao) )}

                    novo={()=>{
                        setEdicao({})
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