// JPEG is supported by mobile canvas encoders, including browsers without WebP export.
// Re-encode until the saved image fits comfortably inside the catalog payload.
export function compressPhoto(source:CanvasImageSource,width:number,height:number,canvas:HTMLCanvasElement){
 const context=canvas.getContext('2d');
 if(!context||!width||!height)throw Error('Não foi possível processar a foto neste navegador.');
 for(const edge of [1200,1000,800,640,480,320]){
  const scale=Math.min(1,edge/Math.max(width,height));
  canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
  context.fillStyle='#ffffff';context.fillRect(0,0,canvas.width,canvas.height);
  context.drawImage(source,0,0,canvas.width,canvas.height);
  for(const quality of [.82,.7,.55,.4]){
   const result=canvas.toDataURL('image/jpeg',quality);
   if(/^data:image\/jpeg;base64,/.test(result)&&result.length<=120000)return result;
  }
 }
 throw Error('Não foi possível ajustar essa foto. Tente uma cópia em JPG.');
}
export async function prepareProductPhoto(file:File){
 if(file.size>30*1024*1024)throw Error('O arquivo ultrapassa 30 MB. Escolha uma versão menor da foto.');
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Escolha uma foto JPG, PNG ou WebP. Para HEIC, exporte a foto como JPG.');
 const canvas=document.createElement('canvas');
 if(typeof createImageBitmap==='function'){
  let bitmap:ImageBitmap|undefined;
  try{bitmap=await createImageBitmap(file)}catch{/* Older mobile browsers can decode through Image instead. */}
  if(bitmap){try{return compressPhoto(bitmap,bitmap.width,bitmap.height,canvas)}finally{bitmap.close()}}
 }
 const url=URL.createObjectURL(file);
 try{
  const image=new Image();
  await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(Error('Não foi possível abrir essa foto. Exporte uma cópia em JPG e tente novamente.'));image.src=url});
  return compressPhoto(image,image.naturalWidth,image.naturalHeight,canvas);
 }finally{URL.revokeObjectURL(url)}
}
