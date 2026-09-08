import { spawn } from 'node:child_process';
const processes = [
  ['api','backend/server.js',{BACKEND_PORT:'3001'}],
  ['worker','backend/worker.js',{}],
  ['app','frontend-standalone/server.js',{PORT:'3000',HOSTNAME:'0.0.0.0'}],
  ['landing','landing-standalone/server.js',{PORT:'3002',HOSTNAME:'0.0.0.0'}],
];
let stopping=false;
const children=[];
function stop(code){
  if(stopping)return;stopping=true;process.exitCode=code;
  for(const child of children)child.kill('SIGTERM');
  const timeout=setTimeout(()=>{for(const child of children)child.kill('SIGKILL');process.exit(code);},10000);timeout.unref();
}
for(const [name,file,env] of processes){
  const child=spawn(process.execPath,[file],{stdio:'inherit',env:{...process.env,...env}});children.push(child);
  child.on('error',error=>{console.error(`${name} failed to start: ${error.message}`);stop(1);});
  child.on('exit',(code,signal)=>{if(!stopping){console.error(`${name} exited (${code ?? signal})`);stop(1);}});
}
process.on('SIGTERM',()=>stop(0));process.on('SIGINT',()=>stop(0));
