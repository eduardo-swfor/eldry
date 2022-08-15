import { useEffect, useState } from 'react'
import useAppData from '../../../data/hook/useAppData'
import SelectInput from '../../inputs/SelectInput'
import endpoints from '../../../data/endpoints.json'

export default function SelectResponsavel(props) {

    const [emails, setEmails] = useState([])
    const { axiosGet } = useAppData()

    useEffect(() => {        
        axiosGet(endpoints.CONSULTAR_PERFIL_USUARIO, {pagamentos: true}).then(retorno =>{
          setEmails(retorno)
        })

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

    return (
        <div className={props.className}>
            <SelectInput 
                label={'Novo responsável'}
                className='w-full'
                dados={emails}
                onItemSelecionado={props.onChange}
            />
        </div>
    )

}