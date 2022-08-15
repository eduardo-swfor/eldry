export default function BotaoOk({ onClick=undefined, label = 'Novo', className='', invertido = false }) {

    return (
        <button className={`
                ${
                    invertido ? 
                        'bg-white text-blue-500 hover:bg-blue-200' : 
                        'bg-blue-500 text-white hover:bg-blue-600'
                }
                font-bold text-xs p-2 rounded shadow uppercase
                hover:shadow-md outline-none focus:outline-none
                ease-linear transition-all duration-150 
                ${className}    
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                {/*IconeSoma(4)*/} 
                <i className="fas fa-plus" />
                <div className='ml-1'>{label}</div>
            </div>
        </button>
    )
}