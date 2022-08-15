export default function BotaoVoltar({ onClick=undefined, label = 'Voltar', className='' }) {

    return (
        <div className={`
                text-red-500 font-bold uppercase 
                text-xs p-2 rounded hover:shadow-md outline-none 
                focus:outline-none ease-linear transition-all duration-150 
                ${className}    
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                {/*IconeSetaEsquerda(4)*/} 
                <i className="fas fa-arrow-left" />
                <div className='ml-1'>{label}</div>
            </div>
        </div>
    )
}