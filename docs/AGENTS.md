# Frontend Working Notes

## Coding Direction

- trabalhar por domínio, não por camada genérica demais
- manter tipagem forte nas fronteiras com a API
- preferir componentes server/client apenas quando houver razão clara
- evitar estado global cedo demais

## Contract Direction

- o backend é a fonte da regra de negócio
- o frontend não deve recalcular preço, status ou disponibilidade
- polling deve ser aplicado onde o backend já pressupõe atualização assíncrona, como PIX e possivelmente pedidos

## UX Direction

- admin e cliente têm necessidades diferentes
- o admin precisa de densidade informacional e clareza operacional
- o cliente precisa de passos simples e feedback forte de status
