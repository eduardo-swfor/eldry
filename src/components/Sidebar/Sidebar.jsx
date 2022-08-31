import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import SidebarItem from './SidebarItem.jsx'
import Heading from './Heading'
import Divider from './Divider'
import { 
  IconeCasa, IconeGlobo, IconeEdit, IconeUsuarios, 
  IconePredio, IconeEscudo, IconeDolar, IconeArquivo, 
  IconeRelogio, IconeCarta, IconeExclamacao, IconeX,
  IconeDocumento, IconeColecao, IconeCalendario, IconeChave
} from '../icons'
import Image from 'next/image'
import logo from '../../../public/images/logo.png'
import useAuth from '../../data/hook/useAuth'
import BotaoSair from '../botoes/BotaoSair'
import useAppData from "../../data/hook/useAppData"
import permissoes from '../../data/permissoes.json'
import ItemCondicional from './ItemCondicional'
import tipoOcorrencias from '../../data/tipos-ocorrencias.json'
import endpoints from '../../data/endpoints.json'

export default function Sidebar({forcarVisivel}) {
  const router = useRouter()
  const tamanhoIcone = 5
  const { axiosGet } = useAppData()
  const { usuario } = useAuth()
  const [perfilUsuario, setPerfilUsuario] = useState(null)
  const [paginasPermitidas, setPaginasPermitidas] = useState([])

  useEffect(() => {    
    axiosGet(endpoints.CONSULTAR_PERFIL_USUARIO, {email: usuario.email}).then(retorno => {
      //mudou
      setPerfilUsuario(retorno)

      //mudou
      if (retorno.admin) {
        setPaginasPermitidas(permissoes.paginas)
      } else {
        setPaginasPermitidas(retorno.paginas.filter(p => p.permitido).map(p => p.route))
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`
      ${forcarVisivel ? '' : 'hidden'} md:block fixed left-0 top-0 
      h-full w-64 bg-gray-50 overflow-y-auto flex-col shadow-md z-20
    `}>
      
      
      <div className={`
        flex items-center justify-center
        pt-2 border-b mb-3
      `}>
        <div className='w-1/2 my-2'>
          <Image src={logo} alt='Logo'></Image>
        </div>
      </div>
      
      <div className={`
        flex flex-wrap w-full text-sm rounded px-3`
      }>        
        <div className={`
          flex flex-col font-bold text-sm 
          text-blueGray-500
        `}>
          {usuario.email.toLowerCase()}
        </div>

        <BotaoSair 
          tamanho={4} 
          className='ml-2 text-red-500' 
        />
        
      </div>
      <Divider className='mb-2 mt-2 '/>
      
      <SidebarItem route='/' title='Caixa de entrada' icone={IconeCasa(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
      <SidebarItem route='/alterar-senha' title='Alterar senha' icone={IconeChave(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />

      <div className='p-2'>

        <ItemCondicional paginaRaiz='/admin' paginasPermitidas={paginasPermitidas}>
          <Heading className='mt-3' title={'Admin'} />
          <Divider className='mb-3'/>
          <SidebarItem route='/cadastros/perfil' title='Perfis' icone={IconeUsuarios(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/cadastros/atribuir-perfil' title='Atribuir perfil' icone={IconeEscudo(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />        
          <SidebarItem route='/cadastros/atribuir-sla' title='SLA' icone={IconeRelogio(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/cadastros/dominio' title='Domínios' icone={IconeGlobo(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/cadastros/atribuir-responsavel' title='Responsáveis' icone={IconeEdit(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/ocorrencias/ocorrencias-sem-responsavel' title='Sem responsável' icone={IconeExclamacao(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />          
          <SidebarItem route='/cadastros/alterar-senha-usuarios' title='Alterar senha adm' icone={IconeEscudo(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/ocorrencias/encerramento-automatico' title='Encerramento' icone={IconeX(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
        </ItemCondicional>
        
        <ItemCondicional paginaRaiz='/cadastros' paginasPermitidas={paginasPermitidas}>
          <Heading className='mt-3' title={'Cadastros'} />        
          <Divider className='mb-3'/>
          
          <SidebarItem route='/cadastros/banco' title='Bancos' icone={IconeDolar(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/cadastros/grupo-empresa' title='Grupos' icone={IconeArquivo(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/cadastros/empresa' title='Empresas' icone={IconePredio(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/cadastros/mensagem' title='Mensagens' icone={IconeCarta(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/cadastros/tipo-comprovante' title='Tipos de comprovantes' icone={IconeDolar(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/cadastros/comprovante' title='Comprovantes' icone={IconeColecao(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/cadastros/comprovante-massivo' title='Comprovantes massivo' icone={IconeColecao(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/cadastros/documento' title='Documentos' icone={IconeDocumento(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/cadastros/feriado' title='Feriados' icone={IconeCalendario(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/cadastros/resposta-automatica' title='Respostas automáticas' icone={IconeDocumento(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
        </ItemCondicional>        

        <ItemCondicional paginaRaiz='/relatorios' paginasPermitidas={paginasPermitidas}>
          <Heading className='mt-3' title={'Relatórios'} />        
          <Divider className='mb-3'/>
          
          <SidebarItem route='/relatorios/usuarios-cadastrados' title='Usuários' icone={IconeDocumento(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/relatorios/documento' title='Documentos' icone={IconeDocumento(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/relatorios/comprovante' title='Comprovantes' icone={IconeColecao(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/relatorios/ocorrencia' title='Ocorrências' icone={IconeArquivo(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          {/*
          <SidebarItem route='/relatorios/dashboard-ocorrencia' title='Ocorrências' icone={IconeGrafico(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          <SidebarItem route='/relatorios/dashboard-totais' title='Resumo' icone={IconeGrafico(tamanhoIcone)} paginasPermitidas={paginasPermitidas} />
          */}
        </ItemCondicional>
        
        <ItemCondicional paginaRaiz='/ocorrencias' paginasPermitidas={paginasPermitidas}>
          <Heading className='mt-3' title={'Ocorrências'} />
          <Divider className='mb-3'/>

          {tipoOcorrencias.map((item, chave1) =>{            
            return (
              <ItemCondicional 
                key={chave1} 
                paginaRaiz={`/ocorrencias/${item.codigo}`} 
                paginasPermitidas={paginasPermitidas}
              >
                <Heading icone={IconeArquivo(tamanhoIcone)} className='mt-3 mb-3' title={`${item.codigo} - ${item.descricao}`} />
                {
                  item.itens.map((sub, chave2) => {
                    return (
                      <SidebarItem 
                        key={chave2} 
                        route={`/ocorrencias/inclusao/${sub.codigo}`} 
                        title={`${sub.codigo} - ${sub.descricao}`} 
                        
                        paginasPermitidas={paginasPermitidas} 
                      />
                    )
                  })
                }
              </ItemCondicional>  
            )
          })}
          
        </ItemCondicional>
      </div>
    </div>      
  )
}
