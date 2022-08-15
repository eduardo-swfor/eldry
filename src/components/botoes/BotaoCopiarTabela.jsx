export default function BotaoCopiarTabla({ onClick=null, label = 'Duplicar', className='' }) {

    return (
        <button className={`
                text-blue-700 font-bold text-xs p-2 rounded 
                hover:shadow-md outline-none focus:outline-none
                ease-linear transition-all duration-150 
                ${className}    
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                <i className="far fa-copy" />
                <div className='ml-1'>{label}</div>
            </div>
        </button>
    )
}