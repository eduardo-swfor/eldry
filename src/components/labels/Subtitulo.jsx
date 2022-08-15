export default function Titulo(props) {
    return (
        <h6 className={`text-gray-600 ${props.className} `}>
            {props.children}
        </h6>
    )
}