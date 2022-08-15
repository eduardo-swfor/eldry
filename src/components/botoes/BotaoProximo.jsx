export default function BotaoProximo({ onClick=undefined, label = 'Próximo', className='' }) {

    return (
        <div className={`
                text-blue-500 font-bold uppercase 
                text-xs p-2 rounded hover:shadow-md outline-none 
                focus:outline-none ease-linear transition-all duration-150 
                ${className}    
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                <i className="fas fa-arrow-right" />
                <div className='ml-1'>{label}</div>
            </div>
        </div>
    )
}