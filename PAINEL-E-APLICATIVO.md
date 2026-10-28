# Painel da dona e aplicativo instalável

Esta versão preserva o catálogo inicial, a identidade visual, a sacola e o envio manual de encomendas pelo WhatsApp. O painel permite adicionar produtos, editar preço, descrição, categoria e foto, ocultar itens e definir quantidade disponível. Fotos são reduzidas no celular antes de serem salvas.

## Ativação no Netlify

1. Publique primeiro esta branch em uma prévia com Functions, Identity e Blobs disponíveis. Não use um upload estático de `dist`.
2. No Identity do projeto, mantenha a confirmação de e-mail ativada. A dona deve criar a própria conta com o e-mail informado para a administração e confirmar o e-mail. O login existente por e-mail e senha foi preservado; login com Google não foi configurado.
3. Confira com a dona que a conta é dela. No painel Identity, copie o ID dessa conta confirmada.
4. Nas variáveis de ambiente do Netlify, adicione `DUDA_OWNER_USER_ID` com esse ID, disponível para as Functions. Publique novamente após configurar. O ID permanece na configuração do servidor e não deve ser colocado no repositório.
5. Ao entrar com a conta autorizada, “Administrar minha loja” aparece no topo e dentro de Minha conta. A API exige ID configurado e confirmação. Se a verificação falhar para a conta conectada, Minha conta mostra um código de diagnóstico e permite verificar novamente. A verificação no navegador nunca concede permissão de gravação por si só.
6. Faça os testes abaixo no domínio real e só então integre esta branch em `main`.

## Uso pela dona

Entre em Minha conta, abra Administrar minha loja e toque em Adicionar produto ou Editar. Preencha os dados, escolha uma foto e toque em Salvar produto. Uma quantidade igual a zero deixa o doce esgotado. Quantidade vazia significa sob encomenda. “Ocultar da vitrine” retira o doce sem apagar referências de sacolas antigas.

O estoque é atualizado manualmente após confirmar uma venda. Uma sacola ou clique no WhatsApp não reserva nem baixa estoque. Não há pagamento ou confirmação de pedido no servidor.

As promoções originais continuam nos produtos e preços originais. Alterar o preço de um produto promocional remove a promoção daquele item e redefine a apresentação para “Unidade”. Outros itens da promoção permanecem participantes. A edição de regras promocionais não faz parte deste painel.

## Instalação

Em HTTPS, toque em Instalar no celular no rodapé. Navegadores compatíveis oferecem instalação; o botão também explica a instalação manual. O app tem ícone, nome e abertura independente. Sem internet, mostra um aviso de reconexão; preços, contas e sacolas não são armazenados pelo service worker.

Esta entrega é uma PWA, não um APK/AAB nem uma publicação na Play Store. O pacote Android depende do domínio definitivo, associação do domínio ao aplicativo e assinatura. A publicação exige a conta Play Console e seu processo de testes/revisão.

## Validação

- `npm test`: preços, promoções, sacolas, autorização, confirmação da conta proprietária, origem das requisições, dados inválidos, concorrência do catálogo, novos IDs e limite de estoque.
- `npm run build`: TypeScript e compilação Vite.
- Conferência visual local bloqueada: o download do navegador de teste falhou neste ambiente. Validar o layout na prévia antes de publicar.
- Teste real pendente: e-mails e login, uploads persistidos no Netlify, catálogo em outro dispositivo, permissão negada para uma conta cliente e instalação em Android/iPhone.
- O catálogo suporta até 150 produtos, foto processada de até 700 mil caracteres e envio total de até 4 milhões de caracteres. A combinação de muitas fotos pode atingir esse limite; nesse caso, o painel apresenta erro e mantém o catálogo anterior. Para catálogos maiores, mover imagens para armazenamento individual.
- Produtos e preços são consultados ao abrir a loja e ao retornar à aba. Mudanças de preço/estoque posteriores ao envio de uma mensagem precisam ser conferidas no atendimento.

Para desfazer a funcionalidade, volte ao commit anterior e publique novamente. Os produtos cadastrados ficam no store `duda-catalog` do Netlify Blobs, separados das sacolas. Não apague esse armazenamento ao reverter o código.
