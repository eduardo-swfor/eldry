export default function ItemCondicional({paginaRaiz, paginasPermitidas, children}) {

    function getJsx() {
        return (
            <>
                {children}
            </>
        )
    }

    return paginasPermitidas.indexOf(paginaRaiz) >= 0 ? getJsx() : null
}