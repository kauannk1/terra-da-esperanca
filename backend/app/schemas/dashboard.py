from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_acolhidos: int
    acolhidos_masculinos: int
    acolhidos_femininos: int
    alertas_estoque: int
    solicitacoes_senha_pendentes: int
