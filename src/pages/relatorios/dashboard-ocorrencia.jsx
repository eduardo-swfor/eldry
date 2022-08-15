import Layout from '../../components/template/Layout'
import { IconeGrafico } from '../../components/icons'
import { 
    Chart as ChartJS, ArcElement, Tooltip, 
    Legend, BarElement, CategoryScale, 
    LinearScale, Title 
} from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'
import StatusOcorrencia from '../../data/status-ocorrencia.json'
import TabelaDados from './../../components/tabelas/TabelaDados'
import Subtitulo from '../../components/labels/Subtitulo'
import { geraArrayCores } from '../../utils/funcoes-gerais'

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
)

export default function DashboardOcorrencia() {    

    const data = {
        labels: [
            StatusOcorrencia.NOVA, 
            StatusOcorrencia.EM_ANALISE, 
            StatusOcorrencia.DADOS_ATUALIZADOS, 
            StatusOcorrencia.REDISTRIBUIDO, 
            StatusOcorrencia.SOLICITADO_INFORMACOES_ADICIONAIS, 
            StatusOcorrencia.INFORMACOES_FORNECIDAS, 
            StatusOcorrencia.OCORRENCIA_ATUALIZADA, 
            StatusOcorrencia.ENCERRADA, 
            StatusOcorrencia.REABERTA 
        ],
        datasets: [
        {
            label: 'SLA ocorrências',
            data: [12, 19, 3, 5, 2, 3, 7, 6, 20],
            backgroundColor: geraArrayCores(9),
            
            borderWidth: 1,
        },
        ],
    }

    const dadosTabela = data.labels.map((item, indice) => {
        return {
            descricao: item,
            valor: data.datasets[0].data[indice]
        }
    })

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'SLA por categoria',
            },
        },
    }

    const labels2  = [ 
        '1 - Recepção de NFs',
        '2 - Escrituração de NFs',
        '3 - Pagamento de NFs',
        '4 - Retenções contratuais',
        '5 - PDPs'
    ]

    const data2 = {
        labels: labels2,
        datasets: [
          {
            label: 'Eldry',
            data: [10, 30, 15, 50, 33],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'EGP',
            data: [17, 22, 18, 25, 30],
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
    }

    const dadosTabela2 = _.flatten(
        data2.datasets.map(empresa => {
            return empresa.data.map((item, indice) => {
                return {
                    grupoEmpresa: empresa.label,
                    tipoOcorrencia: labels2[indice],
                    valor: item
                }
            })
        })
    )

    return (
        <Layout titulo='Dashboard ocorrência' icone={IconeGrafico()}>
            <Subtitulo>Ocorrências em aberto por tipo</Subtitulo>
            <div className='flex w-full md:flex-row'>
                <div className='w-full md:w-1/2'>
                    <Doughnut data={data} />
                </div>
                <div className='w-full md:w-1/2'>
                    <TabelaDados 
                        className='w-full'
                        propriedades={[
                            {nome: 'descricao', tipo: 'string', titulo: 'Descrição' }, 
                            {nome: 'valor', tipo: 'integer', titulo: 'Quantidade' }
                        ]} 
                        titulo='Pesquisa'
                        dados={dadosTabela}
                    /> 
                </div>
            </div>
            <div className='w-full flex flex-col'>
                <Bar 
                    options={options} 
                    data={data2} 
                />

                <TabelaDados 
                    className='w-full'
                    propriedades={[
                        {nome: 'grupoEmpresa', tipo: 'string', titulo: 'Grupo empresa' }, 
                        {nome: 'tipoOcorrencia', tipo: 'string', titulo: 'Tipo ocorrência' }, 
                        {nome: 'valor', tipo: 'integer', titulo: 'SLA médio' }
                    ]} 
                    titulo='Pesquisa'
                    dados={dadosTabela2}
                /> 
            </div>
        </Layout>
    )
}