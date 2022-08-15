import Cadastro from '../../components/cadastro/Cadastro'
import endpoints from '../../data/endpoints.json'

export default function CadastroRespostasAutomaticas() {
  return (
      <Cadastro
          colunas={4}
          endpoint={endpoints.RESPOSTA_AUTOMATICA}
          titulo= 'Cadastro de respostas automáticas'
          campos={[
            {
                nome: 'descricao'
                ,tipo: 'textarea'
                ,titulo: 'Descrição'
                ,exibicao: 'ambos'
                ,required: true
                ,colunas:4
            }
          ]} 
          aplicaFiltro = {(vo, valorFiltro) => {
              return vo.descricao?.indexOf(valorFiltro) >= 0
        }}
      />
  )
}