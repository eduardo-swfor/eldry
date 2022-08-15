export default function BotaoCancelar({ onClick=null, label = 'Cancelar', className='', invertido = false }) {

    return (
        <button className={`                
                ${
                    invertido ? 
                        'bg-white text-red-500 hover:bg-red-200 ' : 
                        'bg-red-500 text-white active:bg-red-600 shadow'
                }
                font-bold text-xs px-2 py-2 rounded uppercase
                hover:shadow-md outline-none focus:outline-none
                ease-linear transition-all duration-150 
                ${className}
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                {/*IconeX(4)*/} 
                <i className="fas fa-times"></i>
                <div className='ml-1'>{label}</div>
            </div>
        </button>
    )
}