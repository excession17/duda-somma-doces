import {useState} from 'react';
import {authErrorMessage} from '@/lib/auth-errors';
import {login,signup,requestPasswordRecovery,logout,getUser} from '@netlify/identity';
export async function signOut(){await logout();window.location.assign('/');}
export function AccountAccess(){
 const [mode,setMode]=useState<'login'|'signup'|'reset'>('login');
 const [email,setEmail]=useState(''),[name,setName]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 async function submit(event:React.FormEvent){
  event.preventDefault();setBusy(true);setError('');setMessage('');
  try{
   if(mode==='reset'){await requestPasswordRecovery(email.trim());setMessage('Se houver uma conta com este e-mail, você receberá as instruções para redefinir sua senha.');}
   else if(mode==='signup'){await signup(email.trim(),password,{full_name:name.trim()});if(await getUser())window.location.assign('/?account=1');else{setMessage('Cadastro enviado. Verifique seu e-mail e confirme sua conta antes de entrar.');setPassword('');setMode('login');}}
   else{await login(email.trim(),password);window.location.assign('/?account=1');}
  }catch(error){setError(authErrorMessage(error,mode));}finally{setBusy(false)}
 }
 function switchMode(next:typeof mode){setMode(next);setError('');setMessage('');setPassword('')}
 return <div className="account-access"><h3>{mode==='signup'?'Criar conta':mode==='reset'?'Recuperar senha':'Entrar na sua conta'}</h3><p>{mode==='signup'?'Primeiro acesso? Preencha nome, e-mail e uma senha com pelo menos 10 caracteres. Depois, confirme o cadastro pelo e-mail recebido.':mode==='reset'?'Esta opção é para quem já criou uma conta e esqueceu a senha. Se ainda não tem cadastro, toque em Criar conta abaixo.':'Já tem cadastro? Entre com seu e-mail e senha. Para o primeiro acesso, toque em Criar conta abaixo.'}</p><form onSubmit={submit}>{mode==='signup'&&<label>Nome<input value={name} onChange={e=>setName(e.target.value)} minLength={2} maxLength={80} autoComplete="name" required/></label>}<label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" maxLength={254} required/></label>{mode!=='reset'&&<label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={mode==='signup'?10:1} maxLength={128} autoComplete={mode==='signup'?'new-password':'current-password'} required/>{mode==='signup'&&<small>Use pelo menos 10 caracteres.</small>}</label>}<button className="main-button" disabled={busy}>{busy?'Aguarde…':mode==='signup'?'Criar conta':mode==='reset'?'Enviar instruções':'Entrar'}</button></form>{message&&<p role="status">{message}</p>}{error&&<p className="error" role="alert">{error}</p>}<div className="account-options">{mode!=='signup'&&<button disabled={busy} onClick={()=>switchMode('signup')}>Criar conta (primeiro acesso)</button>}{mode!=='login'&&<button disabled={busy} onClick={()=>switchMode('login')}>Já tenho conta: entrar</button>}{mode==='login'&&<button disabled={busy} onClick={()=>switchMode('reset')}>Esqueci minha senha</button>}</div></div>
}
