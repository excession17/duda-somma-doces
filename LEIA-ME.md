# Duda Somma Doces — publicação no Netlify

Este pacote contém a loja, as fotos, a mascote, os nove produtos e os preços informados. As encomendas são enviadas pelo WhatsApp. Não há cobrança on-line nem confirmação automática de pagamento.

## Publicar pelo painel (recomendado)

1. Extraia este ZIP. A pasta do projeto é `duda-somma-netlify`.
2. Crie um repositório no GitHub, de preferência privado, e envie **o conteúdo dessa pasta**, mantendo as subpastas. `package.json` e `netlify.toml` devem ficar na raiz do repositório. Envie também `package-lock.json`, `src`, `public`, `netlify` e `tests`. Não envie `node_modules`.
3. Acesse https://app.netlify.com/ e escolha **Add new project → Import an existing project**. Conecte o GitHub e selecione o repositório.
4. Confira a configuração abaixo e publique. O arquivo `netlify.toml` já contém esses valores:

| Configuração | Valor |
|---|---|
| Base directory | Deixe vazio, se os arquivos estiverem na raiz |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |
| Node.js | `22` |

5. No projeto publicado, abra **Identity** e clique em **Enable Identity**. Nas configurações de cadastro, permita novos usuários (**Open**, não apenas convidados) e mantenha a confirmação de e-mail ativada. O site já tem cadastro, entrada, confirmação de e-mail, recuperação de senha e aceitação de convites.
6. Em **Domain management**, altere o nome do projeto para `dudasommadoces`, se estiver disponível. O endereço gratuito terá o formato `dudasommadoces.netlify.app`. A disponibilidade desse nome não foi reservada nem verificada. Um endereço próprio `.com.br` requer registrar um domínio à parte.
7. Se o endereço mudar, confira que o **Site URL** usado pelo Identity corresponde ao endereço definitivo. Depois, faça o teste de cadastro descrito abaixo.

**Não publique apenas arrastando o ZIP ou a pasta `dist` no Netlify Drop.** Esse envio estático não configura as funções necessárias para salvar sacolas de clientes. Use a importação do projeto acima ou a alternativa com terminal abaixo.

## Alternativa: publicar por terminal, sem GitHub

Em um computador com Node.js 22.12 ou superior, abra o terminal dentro da pasta do projeto:

```sh
npm ci
npm test
npm run build
npx netlify-cli login
npx netlify-cli deploy --dir=dist --functions=netlify/functions --prod
```

O comando de publicação permite criar ou selecionar um projeto no Netlify. Autorize o acesso à sua conta no navegador. Depois da publicação, habilite o Identity e ajuste o nome conforme os passos 5 a 7. Não compartilhe senhas nem tokens de acesso.

## Conferência antes de enviar aos clientes

- Abra o endereço publicado no celular e no computador. Confira as fotos, a mascote, as categorias, a pesquisa, os favoritos e os detalhes de um doce.
- Adicione dois pudins: total R$ 15. Adicione dois bolos, inclusive um de cada sabor: total R$ 25. Diminuir a quantidade deve remover o desconto do par desfeito.
- Abra a sacola, recarregue a página e confirme a seleção. Como visitante, a sacola fica neste navegador.
- Crie uma conta com um e-mail seu, abra o link de confirmação recebido e entre. Confirme a sacola em outro navegador conectado à mesma conta.
- Saia, solicite recuperação de senha e confira o link recebido. O site deve exibir o formulário para definir uma nova senha.
- Na sacola, confira o texto gerado ao abrir o WhatsApp: produtos, quantidades, descontos e total, sem frete. O envio da mensagem é uma ação do cliente. O site não envia a mensagem automaticamente.

A integração real de login, envio de e-mails e armazenamento precisa dessa conferência no seu projeto Netlify: não há uma conta Netlify conectada a este pacote, e ele ainda não foi publicado lá.

## Preços incluídos

| Produto | Preço |
|---|---|
| Bombom de uva | R$ 10 |
| Bombom de morango | R$ 10 |
| Morango cravejado | R$ 15 |
| Caixinha com 4 brigadeiros | R$ 15 |
| Pudim de leite Ninho | 1 por R$ 8; 2 por R$ 15 |
| Bolo de cenoura no pote | 1 por R$ 13; 2 por R$ 25 |
| Bolo chocolatudo no pote | 1 por R$ 13; 2 por R$ 25 |
| Copo da felicidade de uva | R$ 12 |
| Copo da felicidade de morango | R$ 12 |

Os bolos de sabores diferentes participam juntos do desconto. Cada par recebe a promoção; unidades restantes ficam com o preço individual. O bombom de uva mantém a apresentação com o nome do produto, pois não foi fornecida uma foto específica dele.

## Como atualizar depois

- Produtos, textos e preços: `src/lib/catalog.ts`.
- Regras dos descontos: `src/lib/pricing.ts`.
- Fotos: `public/images`.
- Conteúdo da página, WhatsApp e Instagram: `src/App.tsx`.
- Aparência: `src/style.css`.
- Login: `src/components/AccountAccess.tsx` e `AuthGate.tsx`.
- Sacola autenticada: `netlify/functions/store.ts` e `netlify/lib/store-core.ts`.

Com o GitHub conectado, cada atualização enviada à branch de produção inicia uma nova publicação no Netlify. Confira o resultado do build no painel.

## Dados e funcionamento

O login é por e-mail e senha, usando Netlify Identity. Senhas não são gravadas pelo código da loja. Sacolas e nomes de clientes conectados são salvos em Netlify Blobs, separados pelo identificador autenticado do usuário. O serviço cria o armazenamento quando necessário; nenhuma chave secreta precisa ser colocada no código.

Cadastros e sacolas do domínio antigo do ChatGPT **não são migrados automaticamente**. Clientes precisam criar uma conta no novo site; o rascunho de visitante também é separado por domínio. A versão original permanece disponível na hospedagem anterior.

O Netlify oferece plano gratuito com limites de uso. Acompanhe o consumo no painel; este pacote não contrata um plano pago nem garante hospedagem ilimitada.

## Validação e desenvolvimento

`npm test` verifica preços, ofertas, validação de itens, autorização, isolamento de contas, limite de quantidade e atualização concorrente da sacola. Repetir uma operação após falha de conexão não adiciona o mesmo item duas vezes.

A prévia no navegador de teste deste ambiente foi bloqueada; a conferência visual final deve ser feita no endereço publicado. Os testes automáticos usam armazenamento simulado para validar a lógica; não substituem a conferência do serviço real.

`npm run build` verifica os tipos e gera a versão de produção em `dist`.

`npm run dev` abre a interface local. Para testar funções e Identity, conecte o projeto a um projeto Netlify com Identity habilitado e use `npx netlify-cli dev`. O teste completo de e-mails deve ser feito no endereço HTTPS publicado.

A pasta `dist` incluída é a compilação da interface. O código das funções está na pasta `netlify`; ambos devem participar da publicação completa.

Documentação oficial:
- https://docs.netlify.com/start/overview/
- https://docs.netlify.com/manage/security/secure-access-to-sites/identity/get-started/
- https://docs.netlify.com/build/data-and-storage/netlify-blobs/
