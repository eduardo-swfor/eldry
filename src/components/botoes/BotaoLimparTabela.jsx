export default function BotaoLimparTabela({ onClick, label = 'Limpar', className='' }) {

    return (
        <button className={`
                text-red-500 font-bold text-xs p-2 rounded 
                hover:shadow-md outline-none focus:outline-none
                ease-linear transition-all duration-150 
                ${className}    
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                <i className="fas fa-eraser" />
                <div className='ml-1'>{label}</div>
            </div>
        </button>
    )
}