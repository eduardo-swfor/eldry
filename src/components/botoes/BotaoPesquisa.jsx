export default function BotaoPesquisa({ onClick=null, label = 'Pesquisar', className='' }) {

    return (
        <button className={`
                bg-blue-500 text-white hover:bg-blue-600
                uppercase font-bold text-xs p-2 rounded shadow
                hover:shadow-md outline-none focus:outline-none
                ease-linear transition-all duration-150 
                ${className}    
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                {/*IconePesquisa(4)*/} 
                <i className="fas fa-search" />
                { label ? <div className='ml-1'>{label}</div> : null }
            </div>
        </button>
    )
}