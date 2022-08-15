export default function BotaoVoltarVermelho({ onClick=undefined, label = 'Voltar', className='' }) {

    return (
        <div className={`
                text-white font-bold uppercase bg-red-500
                text-xs p-2 rounded hover:shadow-md outline-none 
                focus:outline-none ease-linear transition-all duration-150 
                ${className}    
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                <i className="fas fa-arrow-left" />
                <div className='ml-1'>{label}</div>
            </div>
        </div>
    )
}