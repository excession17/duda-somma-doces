export type AuthMode='login'|'signup'|'reset';
// Read only known error fields; never render raw provider responses, emails or tokens.
export function authErrorMessage(error:unknown,mode:AuthMode){
 let status:number|undefined;const messages:string[]=[];let current=error;
 for(let i=0;i<4&&current&&typeof current==='object';i++){
  const e=current as {status?:unknown;message?:unknown;name?:unknown;json?:{msg?:unknown;error?:unknown;error_description?:unknown};cause?:unknown};
  if(typeof e.status==='number'&&Number.isInteger(e.status)&&e.status>=400&&e.status<=599)status??=e.status;
  for(const value of [e.name,e.message,e.json?.msg,e.json?.error,e.json?.error_description])if(typeof value==='string')messages.push(value);
  current=e.cause;
 }
 const detail=messages.join(' ').toLowerCase();
 const code=`${mode==='signup'?'CADASTRO':mode==='reset'?'RECUPERACAO':'LOGIN'}-${status??'CONEXAO'}`;
 let message:string;
 if(status===429||/rate.?limit|too many requests|email.*limit|only request this after/.test(detail))message='O serviço limitou temporariamente as tentativas ou o envio de e-mails. Aguarde antes de tentar novamente; repetir agora pode manter o bloqueio.';
 else if(/signup.*(disabled|not allowed)|signups.*not allowed|registration.*disabled/.test(detail))message='O cadastro está desativado na configuração da loja. O responsável pelo site precisa liberar novos cadastros no Netlify.';
 else if(/email.*not confirmed|email.*not verified|confirm.*email/.test(detail))message='Confirme seu cadastro pelo link recebido no e-mail antes de entrar. Confira também a pasta de spam.';
 else if((status&&status>=500)||/smtp|error sending|failed to send/.test(detail))message='O serviço de acesso ou de envio de e-mails apresentou uma falha. O responsável pelo site precisa verificar o Netlify. Isso não significa que você preencheu os dados errados.';
 else if(/weak.*password|password.*(short|least|minimum)/.test(detail))message='Escolha uma senha com pelo menos 10 caracteres e evite senhas comuns.';
 else if(!status&&/fetch|network|load failed|failed to load|abort|timeout|missingidentityerror/.test(detail))message='Não foi possível conectar ao serviço de acesso. Confira a internet e tente abrir a loja diretamente no Safari ou Chrome.';
 else if(mode==='signup')message='Não foi possível concluir o cadastro. Confira os dados. Se já criou uma conta, use Entrar ou Recuperar senha. Se continuar, envie este código ao responsável pela loja.';
 else if(mode==='reset')message='Não foi possível solicitar a recuperação. Se este é seu primeiro acesso e você ainda não criou uma conta, escolha Criar conta. Se já tem cadastro, envie este código ao responsável pela loja.';
 else message='Não foi possível entrar. Confira o e-mail, a senha e a confirmação do cadastro. Se for seu primeiro acesso, escolha Criar conta.';
 return `${message} Código: ${code}.`;
}
