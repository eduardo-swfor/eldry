import { useState } from 'react'
import SearchInput from '../../inputs/SearchInput'
import TabelaDados from '../../tabelas/TabelaDados'
import BotaoOk from '../../botoes/BotaoOk'

export default function DialogPesquisaEmpresa({listaEmpresas, fechar, selecionar}) {

    const [empresasFiltradas, setEmpresasFiltradas] = useState(listaEmpresas)

    const jsxBotoes = (p) => {
        return (
            <div>
                <BotaoOk 
                    onClick={() => {
                        selecionar(p.codigo)
                        fechar()
                    }}
                    slim
                    invertido
                />
            </div>
        )
    }

    return (
        <div className='w-full'>
            <SearchInput 
                placeholder='Digite o texto para pesquisa' 
                className='w-full' 
                value='' 
                onChange={valor => {
                    if (valor.toUpperCase().trim().length == 0) {
                        setEmpresasFiltradas([...listaEmpresas])
                    } else {
                        setEmpresasFiltradas(listaEmpresas.filter(i => {
                            return i.nome.toUpperCase().indexOf(valor.toUpperCase().trim()) >= 0 ||
                                i.codigo.toUpperCase().indexOf(valor.toUpperCase().trim()) >= 0
                        }))
                    }
                }}
            />
            <TabelaDados 
                className='flex-grow  max-h-96'
                propriedades={[
                    {nome: 'acoes', tipo: 'jsx', titulo: 'Ações', jsx: jsxBotoes },
                    {nome: 'codigo', tipo: 'string', titulo: 'Código' }, 
                    {nome: 'nome', tipo: 'string', titulo: 'Nome' },
                ]} 
                titulo='Pesquisa'
                dados={empresasFiltradas}
            />
        </div>
    )
}