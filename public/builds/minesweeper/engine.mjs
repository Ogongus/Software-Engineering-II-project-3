// Browser port of EECS 581 Group 2's Minesweeper rules.
export class Minesweeper {
  constructor(random = Math.random) { this.random = random; this.reset(); }
  reset() {
    this.size = 10; this.mineCount = 10; this.started = false; this.status = 'ready';
    this.cells = Array.from({length: 100}, () => ({mine:false, state:-1, count:0}));
  }
  neighbors(i) {
    const result = [], x = i % 10, y = Math.floor(i / 10);
    for (let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++) {
      if ((!dx && !dy) || x+dx<0 || x+dx>=10 || y+dy<0 || y+dy>=10) continue;
      result.push((y+dy)*10+x+dx);
    }
    return result;
  }
  placeMines(safe) {
    const candidates = this.cells.map((_,i)=>i).filter(i=>i!==safe);
    for(let i=candidates.length-1;i>0;i--) {
      const j=Math.floor(this.random()*(i+1));
      [candidates[i],candidates[j]]=[candidates[j],candidates[i]];
    }
    candidates.slice(0,10).forEach(i=>this.cells[i].mine=true);
    this.cells.forEach((cell,i)=>cell.count=this.neighbors(i).filter(n=>this.cells[n].mine).length);
    this.started=true; this.status='playing';
  }
  flag(i) {
    if (this.status==='won'||this.status==='lost') return;
    const c=this.cells[i];
    if(c.state===-1) c.state=-2; else if(c.state===-2) c.state=-1;
  }
  reveal(i) {
    if(this.status==='won'||this.status==='lost'||this.cells[i].state!==-1) return;
    if(!this.started) this.placeMines(i);
    if(this.cells[i].mine) {
      this.cells[i].state=-3; this.status='lost';
      this.cells.forEach(c=>{if(c.mine&&c.state!==-2)c.state=-3;});
      return;
    }
    const stack=[i];
    while(stack.length) {
      const n=stack.pop(), c=this.cells[n];
      if(c.state!==-1||c.mine) continue;
      c.state=c.count;
      if(!c.count) stack.push(...this.neighbors(n));
    }
    if(this.cells.every(c=>c.mine||c.state>=0)) {
      this.status='won'; this.cells.forEach(c=>{if(c.mine)c.state=-2;});
    }
  }
}
