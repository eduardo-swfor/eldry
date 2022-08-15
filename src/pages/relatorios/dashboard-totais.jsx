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
import BotaoOk from '../../components/botoes/BotaoOk'
import useAppData from '../../data/hook/useAppData'
import endpoints from '../../data/endpoints.json'

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
)

export default function DashboardTotais() {    

    const { axiosGet } = useAppData()

    return (
        <Layout titulo='Totais do período' icone={IconeGrafico()}>
            <BotaoOk
                onClick={async () => {
                    const retorno = await axiosGet(endpoints.DASHBOARD_OCORRENCIA, { totais: true })
                }}
            />
            
        </Layout>
    )
}