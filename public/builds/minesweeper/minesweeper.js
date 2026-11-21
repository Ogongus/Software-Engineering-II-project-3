import { Minesweeper } from './engine.mjs';
const game=new Minesweeper(), board=document.querySelector('#board');
const status=document.querySelector('#status'), mode=document.querySelector('#mode');
let flagMode=false;
const buttons=[];
function label(text){const el=document.createElement('span');el.className='label';el.textContent=text;board.append(el);}
label('');for(let x=0;x<10;x++)label(String.fromCharCode(65+x));
for(let y=0;y<10;y++) {
  label(String(y+1));
  for(let x=0;x<10;x++) {
    const i=y*10+x, button=document.createElement('button'), img=document.createElement('img');
    button.className='tile';button.type='button';img.alt='';button.append(img);
    button.addEventListener('click',()=>{flagMode?game.flag(i):game.reveal(i);render();});
    button.addEventListener('contextmenu',e=>{e.preventDefault();game.flag(i);render();});
    button.addEventListener('keydown',e=>{
      if(e.key.toLowerCase()==='f'){e.preventDefault();game.flag(i);render();}
      let next=i;
      if(e.key==='ArrowLeft')next=y*10+Math.max(0,x-1);
      if(e.key==='ArrowRight')next=y*10+Math.min(9,x+1);
      if(e.key==='ArrowUp')next=Math.max(0,y-1)*10+x;
      if(e.key==='ArrowDown')next=Math.min(9,y+1)*10+x;
      if(e.key.startsWith('Arrow')){e.preventDefault();buttons[next].focus();}
    });
    buttons.push(button);board.append(button);
  }
}
function render(){
  game.cells.forEach((c,i)=>{
    const file=c.state===-1?'block':c.state===-2?'flag':c.state===-3?'bomb':c.state===0?'blankblock':`block${c.state}`;
    buttons[i].firstChild.src=`./assets/${file}.png`;
    const description=c.state===-1?'covered':c.state===-2?'flagged':c.state===-3?'mine':`${c.state} neighboring mines`;
    buttons[i].setAttribute('aria-label',`${String.fromCharCode(65+i%10)}${Math.floor(i/10)+1}: ${description}`);
  });
  document.querySelector('#counter').textContent=`Flags: ${game.cells.filter(c=>c.state===-2).length} / 10`;
  status.textContent={ready:'Choose a square. Your first reveal is safe.',playing:'Clear every safe square. Flag suspected mines.',won:'You win! All safe squares cleared. Press R to restart.',lost:'You hit a mine. Press R or New game to try again.'}[game.status];
}
function reset(){game.reset();flagMode=false;mode.setAttribute('aria-pressed','false');mode.textContent='Flag mode: off';render();}
mode.addEventListener('click',()=>{flagMode=!flagMode;mode.setAttribute('aria-pressed',String(flagMode));mode.textContent=`Flag mode: ${flagMode?'on':'off'}`;});
document.querySelector('#restart').addEventListener('click',reset);
document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='r'&&!e.ctrlKey&&!e.metaKey&&!e.altKey)reset();});
render();
