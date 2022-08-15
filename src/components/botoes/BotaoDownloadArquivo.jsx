import useAppData from "../../data/hook/useAppData"
import FileDownload from 'js-file-download'
import endpoints from '../../data/endpoints.json'

export default function BotaoDownloadArquivo({ label = 'Download', chave, nome, className='' }) {
    const { axiosDownload, alerta } = useAppData()

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
                    const retorno = await axiosDownload(endpoints.DOWNLOAD_ARQUIVO, {chave})
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