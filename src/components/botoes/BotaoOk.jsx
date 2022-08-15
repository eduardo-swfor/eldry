export default function BotaoOk({ onClick=null, label = 'OK', className='', invertido = false, slim=false }) {

    return (
        <button className={`
                ${
                    invertido ? 
                        'text-blue-500 hover:bg-blue-200' : 
                        'bg-blue-500 text-white hover:bg-blue-600 shadow'
                }
                font-bold text-xs ${slim ? 'p-1' : 'p-2'} uppercase
                hover:shadow-md outline-none focus:outline-none
                ease-linear transition-all duration-150 rounded
                ${className}    
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                {/*IconeCheck(4)*/} 
                <i className="fas fa-check" />
                { label ? <div className='ml-1'>{label}</div> : null }
            </div>
        </button>
    )
}