export default function BotaoExcluirTabela({ onClick, label = 'Excluir', className='' }) {

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
                <i className="far fa-trash-alt" />
                <div className='ml-1'>{label}</div>
            </div>
        </button>
    )
}