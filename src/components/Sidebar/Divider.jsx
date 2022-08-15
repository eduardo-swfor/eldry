export default function Divider({className=null}) {
    return (
        <div className={`
            pt-1 border-b border-gray-200 m-2
            ${className}
        `} />
    )
}