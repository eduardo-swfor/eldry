export default function BotaoFechar({ onClick=undefined, label = 'Sair', className='', invertido = false }) {

    return (
        <button className={`
                bg-white text-gray-800 hover:bg-gray-400
                font-bold text-xs p-2 rounded uppercase
                hover:shadow-md outline-none focus:outline-none
                ease-linear transition-all duration-150 
                ${className}    
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                {/*IconeSair(4)*/} 
                <i className="fas fa-door-open" />
                <div className='ml-1'>{label}</div>
            </div>
        </button>
    )
}