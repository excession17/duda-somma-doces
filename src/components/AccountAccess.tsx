import {useState} from 'react';
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
  }catch{setError(mode==='login'?'Não foi possível entrar. Confira seu e-mail, sua senha e a confirmação do cadastro.':mode==='signup'?'Não foi possível criar a conta. Confira os dados ou tente entrar se já possui cadastro.':'Não foi possível enviar o e-mail. Tente novamente mais tarde.');}finally{setBusy(false)}
 }
 function switchMode(next:typeof mode){setMode(next);setError('');setMessage('');setPassword('')}
 return <div className="account-access"><h3>{mode==='signup'?'Criar conta':mode==='reset'?'Recuperar senha':'Entrar na sua conta'}</h3><form onSubmit={submit}>{mode==='signup'&&<label>Nome<input value={name} onChange={e=>setName(e.target.value)} minLength={2} maxLength={80} autoComplete="name" required/></label>}<label>E-mail<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" maxLength={254} required/></label>{mode!=='reset'&&<label>Senha<input type="password" value={password} onChange={e=>setPassword(e.target.value)} minLength={mode==='signup'?10:1} maxLength={128} autoComplete={mode==='signup'?'new-password':'current-password'} required/>{mode==='signup'&&<small>Use pelo menos 10 caracteres.</small>}</label>}<button className="main-button" disabled={busy}>{busy?'Aguarde…':mode==='signup'?'Criar conta':mode==='reset'?'Enviar instruções':'Entrar'}</button></form>{message&&<p role="status">{message}</p>}{error&&<p className="error" role="alert">{error}</p>}<div className="account-options"><button disabled={busy} onClick={()=>switchMode(mode==='login'?'signup':'login')}>{mode==='login'?'Criar uma conta':'Voltar para entrar'}</button>{mode==='login'&&<button disabled={busy} onClick={()=>switchMode('reset')}>Esqueci minha senha</button>}</div></div>
}
