import { useRouter } from "next/dist/client/router"

export default function BreadcrumbRouter(props) {
    const router = useRouter()

    return (
        <div className={`text-sm flex text-blue-900 ${props.className}`}>
            {router.pathname.substring(1).split('/').map(i => i.toUpperCase()).join(' > ')}
            {/*
                (`${router.pathname}`).split('/').join(' > ').map( (item, indice) =>{
                    return <>
                        <li><a class="font-bold">{item}</a></li>

                    </> 
                })
            */}
        </div>
    )
}