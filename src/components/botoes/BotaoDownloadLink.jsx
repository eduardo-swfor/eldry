import useAppData from "../../data/hook/useAppData"
import FileDownload from 'js-file-download'
import endpoints from '../../data/endpoints.json'
import { useRouter } from "next/router"

export default function BotaoDownloadLink({ label = 'Download', link, nome, className='' }) {
    const { axiosDownload, alerta } = useAppData()
    const router = useRouter()

    return (
        <button className={`
                text-blue-900 font-bold text-xs p-2 rounded 
                hover:shadow-md hover:bg-gray-50 outline-none 
                focus:outline-none ease-linear transition-all 
                duration-150 
                ${className}    
            `} 
            type="button"
            onClick={async () => {
                try {                  
                    const options = {
                        method: 'GET',
                        encoding: 'binary',
                        headers: {
                            'Subscription-Key': process.env.GUIDE_STAR_CHARITY_CHECK_API_PDF_KEY,
                            'Content-Type': 'application/json',
                        },
                        rejectUnauthorized: false,
                    }
                    
                    const binaryStream = await fetch(
                        'https://apidata.guidestar.org/charitycheckpdf/v1/pdf/26-4775012',
                        options
                    )
                    
                    FileDownload(retorno, nome)
                  } catch (error) {
                    alerta(`Erro ao fazer o download: ${error}`)
                  }
            }}
        >
            <div className = 'flex items-center'>
                <i className="fas fa-download" />
                {!label ? null : <div className='ml-1'>{label}</div>}
            </div>
        </button>
    )
}