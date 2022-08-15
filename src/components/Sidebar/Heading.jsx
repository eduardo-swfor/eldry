export default function Heading({title, icone = null, className=null}) {
    return (
        <div className={`
            text-xs uppercase font-bold pt-1 
            mx-2 text-blueGray-500 flex flex-row ${className}
        `}>
            {icone ? <div className='mr-2'>{icone}</div> : null}
            {title}
        </div>
    )
}