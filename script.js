const prizes=[
  {name:"25.000",color:"#660000"},
  {name:"50.000",color:"#990000"},
  {name:"75.000",color:"#660000"},
  {name:"100.000",color:"#990000"},
  {name:"150.000",color:"#660000"},
  {name:"200.000",color:"#990000"}
];

const WA_ADMIN="+6281361949050"; 
let rot=0,no=1;

const wheel=document.getElementById("wheel");
const slicesGroup=document.getElementById("slices");

// BUAT SLICES DAN ANGKA SIMETRIS
const sliceAngle=360/prizes.length;
const radius=90;
prizes.forEach((p,i)=>{
  const startAngle=i*sliceAngle;
  const endAngle=(i+1)*sliceAngle;
  const largeArc=endAngle-startAngle>180?1:0;
  const x1=100 + radius*Math.cos(Math.PI*startAngle/180);
  const y1=100 + radius*Math.sin(Math.PI*startAngle/180);
  const x2=100 + radius*Math.cos(Math.PI*endAngle/180);
  const y2=100 + radius*Math.sin(Math.PI*endAngle/180);

  const path=document.createElementNS("http://www.w3.org/2000/svg","path");
  path.setAttribute("d",`M100,100 L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`);
  path.setAttribute("fill",p.color);
  slicesGroup.appendChild(path);

  const midAngle=startAngle+sliceAngle/2;
  const tx=100 + (radius-30)*Math.cos(Math.PI*midAngle/180);
  const ty=100 + (radius-30)*Math.sin(Math.PI*midAngle/180);
  const text=document.createElementNS("http://www.w3.org/2000/svg","text");
  text.setAttribute("x",tx);
  text.setAttribute("y",ty);
  text.setAttribute("fill","#FFD700");
  text.setAttribute("font-size","12");
  text.setAttribute("text-anchor","middle");
  text.setAttribute("alignment-baseline","middle");
  text.setAttribute("transform",`rotate(${midAngle} ${tx} ${ty})`);
  text.textContent=p.name;
  slicesGroup.appendChild(text);
});

// TIMER
const end=Date.now()+3600000;
setInterval(()=>{
  const d=end-Date.now();
  if(d<0){timer.innerHTML="EVENT BERAKHIR";spinBtn.disabled=true;return;}
  timer.innerHTML="Berakhir dalam "+Math.floor(d/60000)+" menit";
},1000);

// SPIN
function pickPrize(){
  let r=Math.random()*100,sum=0;
  const chances=[40,25,15,10,8,2];
  for(let i=0;i<prizes.length;i++){sum+=chances[i]; if(r<=sum)return i;}
}

function spawnCoins(num){
  for(let i=0;i<num;i++){
    const coin=document.createElement('div');
    coin.className='coin';
    coin.style.left=Math.random()*window.innerWidth+'px';
    coin.style.animationDuration=(1+Math.random()*2)+'s';
    coin.style.width=20+Math.random()*15+'px';
    coin.style.height=20+Math.random()*15+'px';
    document.body.appendChild(coin);
    setTimeout(()=>coin.remove(),2500);
  }
}

function spawnDragons(num){
  for(let i=0;i<num;i++){
    const d=document.createElement('div');
    d.className='dragon-mini';
    d.style.left=(window.innerWidth/2 + (Math.random()*100 -50))+'px';
    d.style.top=(window.innerHeight/2 + (Math.random()*50 -25))+'px';
    d.style.animationDuration=(1+Math.random()*1.5)+'s';
    document.body.appendChild(d);
    setTimeout(()=>d.remove(),2000);
  }
}

function spin(){
  const id = uid.value.trim();
  if(!id){ alert("Masukkan User ID!"); return; }

  if(localStorage.getItem("spin_"+id)){
    alert("User ini sudah spin!");
    return;
  }

  spinBtn.disabled = true;
  spinSound.play().catch(()=>{});

  const idx = pickPrize();
  const prize = prizes[idx].name;
  const slice = 360 / prizes.length;
  
  // panah di ATAS (270°), menghadap ke tengah roda
  const targetAngle = 270 - (idx * slice + slice / 2);
  rot += 1440 + targetAngle;
  wheel.style.transform = `rotate(${rot}deg)`;

  setTimeout(()=>{
    winSound.play().catch(()=>{});
    localStorage.setItem("spin_"+id, prize);
    log.insertRow(1).innerHTML =
      `<td>${no++}</td><td>${id.slice(0,6)}***</td><td>${prize}</td>`;
    spawnCoins(20);
    spawnDragons(10);
    winText.innerText = "SELAMAT! Anda mendapatkan " + prize;
    waLink.href =
      `https://wa.me/${WA_ADMIN}?text=Saya%20menang%20${prize}%20UserID:${id}`;
    popup.style.display = "flex";
  },5000);
}

function closePop(){popup.style.display="none";}
