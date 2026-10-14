import http from 'node:http';
import { randomBytes } from 'node:crypto';
const PORT=Number(process.env.PORT||3000), rooms=new Map();
const TTL=2*60*60*1000, MAX_ROOMS=1000;
const allowed=(process.env.MOVI_ORIGIN||'https://marinoguido2017-beep.github.io');
function cors(req,res){const origin=req.headers.origin;if(origin===allowed){res.setHeader('Access-Control-Allow-Origin',origin);res.setHeader('Vary','Origin')}res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');res.setHeader('Access-Control-Allow-Headers','Content-Type');res.setHeader('Cache-Control','no-store')}
function send(res,code,data){res.writeHead(code,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data))}
const token=()=>randomBytes(24).toString('hex');
const codeRoom=()=>randomBytes(4).toString('hex').toUpperCase();
function validateTitles(t){return Array.isArray(t)&&t.length===5&&new Set(t).size===5&&t.every(x=>Number.isInteger(x)&&x>=0&&x<63)}
function snapshot(room,who){return {code:room.code,titles:room.titles,votes:room.players.map(p=>p?{joined:true,done:Object.keys(p.votes).length===5,votes:who===room.players.indexOf(p)?p.votes:(Object.keys(p.votes).length===5?null:null)}:null),matches:room.players.every(p=>p&&Object.keys(p.votes).length===5)?room.titles.filter(id=>room.players.every(p=>p.votes[id]==='yes')):null,expiresAt:room.exp}}
function cleanup(){const now=Date.now();for(const [code,room] of rooms)if(room.exp<now)rooms.delete(code)}
setInterval(cleanup,60000).unref();
const serverInstance=http.createServer(async(req,res)=>{
 cors(req,res);if(req.method==='OPTIONS'){res.writeHead(204);res.end();return}
 if(req.url==='/health'){send(res,200,{ok:true});return}
 let url;try{url=new URL(req.url,'http://localhost')}catch{send(res,400,{error:'bad-url'});return}
 if(!url.pathname.startsWith('/api/')){send(res,404,{error:'not-found'});return}
 if(req.method==='POST'){
  let data='';for await(const chunk of req){data+=chunk;if(data.length>4096){send(res,413,{error:'too-large'});return}}
  let body;try{body=JSON.parse(data||'{}')}catch{send(res,400,{error:'bad-json'});return}
  if(url.pathname==='/api/rooms'){
   cleanup();if(rooms.size>=MAX_ROOMS){send(res,503,{error:'capacity'});return}
   if(!validateTitles(body.titles)){send(res,400,{error:'invalid-titles'});return}
   let c=codeRoom();while(rooms.has(c))c=codeRoom();
   const hostToken=token(),room={code:c,titles:body.titles,exp:Date.now()+TTL,players:[{token:hostToken,votes:{}},null]};rooms.set(c,room);
   send(res,201,{code:c,token:hostToken,player:0,expiresAt:room.exp});return;
  }
  const match=url.pathname.match(/^\/api\/rooms\/([A-F0-9]{8})\/(join|vote)$/);
  if(!match){send(res,404,{error:'not-found'});return}
  const room=rooms.get(match[1]);if(!room||room.exp<Date.now()){send(res,404,{error:'expired-room'});return}
  if(match[2]==='join'){
   if(room.players[1]){send(res,409,{error:'room-full'});return}
   const guestToken=token();room.players[1]={token:guestToken,votes:{}};send(res,200,{code:room.code,token:guestToken,player:1,titles:room.titles});return
  }
  const player=room.players.find(p=>p?.token===body.token);if(!player){send(res,403,{error:'unauthorized'});return}
  if(!room.titles.includes(body.titleId)||!['yes','no'].includes(body.vote)){send(res,400,{error:'invalid-vote'});return}
  player.votes[body.titleId]=body.vote;send(res,200,{ok:true});return;
 }
 const match=url.pathname.match(/^\/api\/rooms\/([A-F0-9]{8})$/);
 if(req.method==='GET'&&match){const room=rooms.get(match[1]);if(!room||room.exp<Date.now()){send(res,404,{error:'expired-room'});return}
 const auth=req.headers.authorization?.replace(/^Bearer /,'');const i=room.players.findIndex(p=>p?.token===auth);if(i<0){send(res,403,{error:'unauthorized'});return}
 const status={code:room.code,titles:room.titles,players:room.players.map(p=>({joined:!!p,done:!!p&&Object.keys(p.votes).length===5})),myVotes:room.players[i].votes,matches:room.players.every(p=>p&&Object.keys(p.votes).length===5)?room.titles.filter(id=>room.players.every(p=>p.votes[id]==='yes')):null,expiresAt:room.exp};
 send(res,200,status);return}
 send(res,404,{error:'not-found'});
});
serverInstance.listen(PORT,'0.0.0.0');
