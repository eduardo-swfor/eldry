export default function BotaoRefresh({ onClick=null, label = 'Atualizar', className=''}) {

    return (
        <button className={`
                font-bold text-xs p-2 rounded shadow-sm uppercase
                hover:shadow-md outline-none focus:outline-none
                ease-linear transition-all duration-150 border
                hover:bg-gray-200 text-green-500
                ${className}    
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                <i className='fas fa-sync-alt' />
                { label ? <div className='ml-1'>{label}</div> : null }
            </div>
        </button>
    )
}