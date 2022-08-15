import Subtitulo from '../../labels/Subtitulo'
import TabelaDados from '../../tabelas/TabelaDados'
import BotaoAdicionar from '../../botoes/BotaoAdicionar'
import BotaoExcluirTabela from '../../botoes/BotaoExcluirTabela'
import { useState } from 'react'
import CampoPesquisaEmpresa from '../empresa/CampoPesquisaEmpresa'

export default function CampoEmpresas({className, label, onChange=null}) {
    const [empresaSelecionada, setEmpresaSelecioanda] = useState(null)
    const [empresas, setEmpresas] = useState([])    

    const jsxBotoesExcluir = (p) => {
        return <div>
            <BotaoExcluirTabela onClick={() => {
                const valores = empresas.filter(i => i !== p)
                setEmpresas(valores)
                
                if (onChange) {
                    onChange(valores)
                }
            }}/>
        </div>
    }

    const incluir = () => {
        if (empresaSelecionada) {
            const valores = [empresaSelecionada, ...empresas.filter(i => i !== empresaSelecionada)]
            setEmpresas(valores)
            setEmpresaSelecioanda(null)
            
            if (onChange) {
                onChange(valores)
            }
        }
    }

    return (
        <div className={`mt-2 ${className}`}>
            <div className='flex flex-wrap w-full h-full'>
                <div className='flex flex-row w-full'>
                    <Subtitulo className='flex-grow'>{label}</Subtitulo>
                </div>

                <div className='flex flex-row w-full items-center'>
                    <CampoPesquisaEmpresa 
                        value={empresaSelecionada}
                        onChange={setEmpresaSelecioanda}
                        enter={incluir}
                        className='w-full'
                    />
                    <BotaoAdicionar 
                        className='mt-6 ml-2'
                        label='Incluir'
                        onClick={incluir}
                    />
                </div>
                
                <TabelaDados className='w-full'
                    propriedades={[
                        {nome: 'grupoEmpresa.nome', tipo: 'string', titulo: 'Grupo' },
                        {nome: 'codigo', tipo: 'string', titulo: 'Código' }, 
                        {nome: 'nome', tipo: 'string', titulo: 'Empresa' }, 
                        {nome: 'acoes', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoesExcluir }
                    ]} 
                    titulo='Empresas adicionadas'
                    dados={empresas}
                />   
            </div>
        </div>
        )
}