# QA da cópia isolada — 22/10/2026

Base: `9bc32546293aaf6395fd65c7fb5d38b7108d77a3`. Conferida novamente antes de preparar este PR; `index.html` original tem blob `0cfd9ab9380428c23bfbe2f3aa9c4c08b455fadb`.

## Correções

- Após sair da Serra, restaurar o recorde normal no painel lateral. Reproduzido visualmente: o painel mostrava 700 da Serra, enquanto o recorde normal salvo era 711. Não houve evidência de perda do valor salvo.
- Ao ocultar a página, pausar também tutorial e contagem, além da corrida ativa. Reproduzido em harness determinístico. A pausa por perda de foco já existia e foi preservada.
- Corrigir o singular de uma moeda nos resultados do treino Chuva e no histórico.

## Testes automatizados

Sem dependências adicionais; executados com Node 24.19.0:

```sh
node --test tests/logic-regression.test.cjs tests/text-regression.test.cjs
```

28 testes aprovados. O harness executa o script real com DOM, canvas e armazenamento simulados: isso valida lógica, não renderização nem gameplay manual. Os testes cobrem setas/A/D, repetição de teclas, Shift esquerdo/direito, Espaço, X, 1/2 e teclado numérico; proteção de campos editáveis; pausa e retomada; reinício; recorde; singular/plural; blur e visibilidade em corrida/tutorial/contagem; eventos repetidos sem retomada involuntária; liquidação sem duplicar moedas.

A conclusão do campeonato (três etapas e placar 9 a 3) e a liquidação da Serra também foram testadas com estado controlado. Isso NÃO demonstra vitória de gameplay. Antes das correções, falharam os casos do recorde lateral, visibilidade em tutorial/contagem e singular de uma moeda. O teste de sintaxe do JavaScript passou.

## Partidas reais no Edge local

- Serra concluída em 45s, 700 pontos, 5 moedas, zero contatos e quatro curvas limpas. Comandos nativos de direção seguiram a indicação LIVRE visível; não foram injetados pontos, vitória ou invulnerabilidade. Recompensa Pôr do Sol e primeiro fantasma salvos.
- Campeonato: Cidade vencida por 3 a 1; reload do checkpoint preservou a próxima etapa e placar. Túnel vencido, total 6 a 2. Colisão na Chuva encerrou a tentativa com 2223 pontos, 8 moedas e 2/3 etapas. Campeonato completo real permanece pendente.
- Corrida rápida: início, transição Cidade/Túnel, colisão, reinício e persistência após reload verificados. Pausa pelo botão e Espaço verificadas separadamente.
- Viewports 390x844, 320x568 e 844x390 sem transbordamento horizontal observado. Console capturado ao encerrar sem entradas warn/error; isso não garante ausência de erros em outros fluxos.

## Limites antes de integrar

Vitória real completa do campeonato, toque em aparelho físico, Safari/iPhone, áudio e todas as combinações de carro/dificuldade permanecem pendentes. Parte da matriz de teclado foi verificada apenas no harness. A tentativa de alternar abas não ocultou a página; alternância real no navegador não foi confirmada. As correções finais de visibilidade e recorde passaram no harness, mas uma nova sequência visual completa pós-correção ainda é necessária.

O QA usou origem localhost separada do site publicado. Nenhuma publicação, merge, alteração financeira ou instalação de dependências foi realizada. Screenshot e logs locais foram preservados fora deste PR; não são necessários para executar os testes. Manter o PR em rascunho até revisão e conclusão dos testes pendentes.
