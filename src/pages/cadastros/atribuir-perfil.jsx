import Layout from '../../components/template/Layout'
import { IconeEscudo } from '../../components/icons'
import { useEffect, useState } from 'react'
import useAppData from '../../data/hook/useAppData'
import _ from 'lodash'
import Subtitulo from '../../components/labels/Subtitulo'
import SelectInput from '../../components/inputs/SelectInput'
import TextInput from '../../components/inputs/TextInput'
import SearchInput from '../../components/inputs/SearchInput'
import BotaoAdicionar from '../../components/botoes/BotaoAdicionar'
import BotaoExcluirTabela from '../../components/botoes/BotaoExcluirTabela'
import BotaoEditarTabela from '../../components/botoes/BotaoEditarTabela'
import TabelaDados from '../../components/tabelas/TabelaDados'
import { IconeUsuarios } from '../../components/icons'
import endpoints from '../../data/endpoints.json'

export default function AtribuirPerfil() {
  const voVazio = { email: '', _id_perfil:'', perfil: '' }
  const { alerta, pergunta, axiosGet, listarColecao, gravarObj, exibirToast, excluirObj } = useAppData()
  const [estado, setEstado] = useState(voVazio)
  const [dados, setDados] = useState([])
  const [dadosFiltrados, setDadosFiltrados] = useState([])
  const [perfis, setPerfis] = useState([])


  useEffect(() => {
    axiosGet(endpoints.PERFIL).then(p => {
      if (p != null) {
        setPerfis(p)
      }
    })
    listarColecao(endpoints.ATRIBUIR_PERFIL).then(r => {
      setDados(r)
      setDadosFiltrados(r)
    })

    return () => {
      setPerfis([])
      setDados([])
      setDadosFiltrados([])
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const excluiItem = itemParaExclusao => {
    pergunta("Confirma a exclusão do registro?", () => {
      excluirObj(endpoints.ATRIBUIR_PERFIL, itemParaExclusao._id).then(() => {
        setDados(dados.filter(item => item._id !== itemParaExclusao._id))
        setDadosFiltrados(dadosFiltrados.filter(item => itemParaExclusao._id !== item._id))
      })
    })    
  }

  const jsxBotoes = (p) => {
    return (
      <div>
        <BotaoExcluirTabela onClick={() => {
          excluiItem(p)          
        }}/>
        <BotaoEditarTabela onClick={() => {
          setEstado({
            email: p.email,
            perfil: p.perfil
          })
        }}/>
      </div>
    )
  }

  const gravaVo = () => {
    const perfilUsuario = {
      email: estado.email,
      perfil: estado.perfil
    }
    
    if (!perfilUsuario.email || !perfilUsuario.perfil) {
      alerta('Todos os campos são obrigatórios')
      return       
    }

    gravarObj(endpoints.ATRIBUIR_PERFIL, perfilUsuario).then(retorno =>{
      if (retorno) {
        setDados([retorno, ...dados.filter(item => retorno._id !== item._id)])
        setDadosFiltrados([retorno, ...dadosFiltrados.filter(item => retorno._id !== item._id)])
        setEstado(voVazio)
        exibirToast('Registro gravado', 'sucesso')
      }
    })
  }

  const aplicaFiltro = valor => {
    if (valor.toUpperCase().trim().length == 0) {
      setDadosFiltrados(dados)
    } else {
      setDadosFiltrados(dados.filter(i => {
        return i.email.toUpperCase().indexOf(valor.toUpperCase().trim()) >= 0
      }))
    }
  }

  return (
      <Layout titulo='Atribuição de perfil' icone={IconeEscudo()}>
        <div className='flex w-full content-end'>
          <Subtitulo className='flex-grow'>Selecione o usuário ou status para pesquisa</Subtitulo>
          <BotaoAdicionar onClick={() =>{
            gravaVo()
          }} />
        </div>

        <div className='flex flex-col w-full md:flex-row border-b pb-2'>
          <TextInput 
            required
            className='w-full md:w-3/4'
            label='E-mail do usuário' 
            value={estado.email}
            onChange={valor => {
              setEstado({...estado, email: valor})
            }}            
          />

          <SelectInput 
            required
            label='Perfil' 
            dados={perfis} 
            className='w-full md:w-1/4 md:pl-2'
            campoLabel='nome'
            textoItem={estado.perfil}
            onItemSelecionado={valor => {
              if (valor){
                setEstado({...estado, perfil: valor.nome,})
              } else {
                setEstado({...estado, perfil: ''})
              }
            }}            
          />
                 
        </div>

        <div className='mt-4'>
          <Subtitulo>Listagem de perfis já atribuídos</Subtitulo>
          <SearchInput 
            placeholder='Digite o texto para pesquisa' 
            className='w-full' 
            onChange={valor => {
              aplicaFiltro(valor)
            }}
          />
          <TabelaDados 
              className='w-full'
              propriedades={[
                {nome: 'email', tipo: 'string', titulo: 'E-mail' },
                {nome: 'perfil', tipo: 'string', titulo: 'Perfil' },
                {nome: 'acoes', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes }
              ]} 
              titulo='Perfis'
              dados={dadosFiltrados}
              icone={IconeUsuarios(5)}
          />    
        </div>

      </Layout>
    )
}