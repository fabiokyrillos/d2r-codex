# Fase 3 — evidência visual

Capturas do build local de `8ebd7ec` (Chrome headless, `--headless=new`, tamanho de texto
padrão), nos dois idiomas, nas quatro larguras do plano. `index.txt` é o registro por captura das 48
combinações medidas (2 idiomas × 4 larguras × 6 estados): todas hidrataram (`[data-filters-ready]`),
nenhuma transbordou horizontalmente, o popover ficou dentro da viewport a 768 e 1280, a sheet abriu
a 320 e 390, o estado vazio foi alcançado por URL, a linha "No seu estágio" apareceu em todos os
cartões com preferência, e o console não registrou erro nem aviso de hidratação em nenhuma.

Os seis estados: `default` (`/builds`), `filtered` (`?class=sorceress,paladin&damage=cold,magic`,
7 builds), `disclosure-open` (`?class=sorceress` com "Mais filtros" aberto — popover ≥ 640,
sheet abaixo), `preference-budget` (`d2rc.tier=budget` e `?sort=stage`), `empty`
(`?class=necromancer&damage=cold`), `class-page` (`/classes/sorceress#builds` com
`d2rc.tier=early-hell`).

Dezoito das 48 estão versionadas aqui; as restantes são reproduzíveis com o mesmo script sobre o
mesmo SHA.

| Captura | O que mostra |
|---|---|
| `en-us-1280-default`, `pt-br-1280-default` | as duas linhas de controle, oito chips com glifo e contagem, grade em duas colunas |
| `en-us-768-default`, `pt-br-768-default` | os chips quebram em duas linhas no tablet; a segunda linha continua inteira |
| `en-us-390-default`, `pt-br-390-default`, `en-us-320-default`, `pt-br-320-default` | chips e estágio em rolagem horizontal com fade; linha de ferramentas; cartão compacto |
| `en-us-1280-disclosure-open`, `pt-br-768-disclosure-open` | o popover não modal, primeiro grupo aberto, opções em zero desabilitadas com `0` visível |
| `en-us-390-disclosure-open`, `pt-br-390-disclosure-open` | a sheet preservada, só com os grupos avançados |
| `en-us-1280-preference-budget`, `pt-br-390-preference-budget` | "Meu estágio", a frase de ajuda, "Para o meu estágio" ativo, a linha em cada cartão; a chip guardada centralizada no celular |
| `en-us-1280-empty`, `pt-br-390-empty` | o estado vazio por URL: "Remover {grupo}", "Limpar tudo", builds próximas rotuladas |
| `en-us-390-class-page`, `pt-br-1280-class-page` | a página de classe: sem chips de classe, com estágio e "Mais filtros" |
