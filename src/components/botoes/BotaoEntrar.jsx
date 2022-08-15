export default function BotaoEntrar({ onClick=null, label = 'Entrar', className = ''}) {

    return (
        <button className={`
                text-red-600 
                font-bold p-2 cursor-pointer rounded-md
                hover:shadow-md
                ${className}    
            `} 
            type="button"
            onClick={onClick}
        >
            <div className = 'flex items-center'>
                <i className='fas fa-sign-in-alt' />
                {label ? <div className='ml-2'>{label}</div> : null}
            </div>
        </button>
    )
}