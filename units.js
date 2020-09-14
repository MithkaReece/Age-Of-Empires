class Unit{
    constructor(type,pos,team,colour){
        this.pos = pos;
        this.team = team;
        this.img=unitImgs.filter(x=>x[0]==type+colour)[0][1];
        this.selected = false;
        this.locked = false;
    }
    getPos(){
        return this.pos;
    }
    getTeam(){
        return this.team;
    }
    getMovement(){
        return this.movement;
    }
    getRange(){
        return this.range;
    }
    getLocked(){
        return this.locked;
    }
    lock(){
        this.locked=true;
    }
    unlock(){
        this.locked=false;
    }

    select(){
        this.selected = true;
    }
    deselect(){
        this.selected = false;
    }
    show(x,y){
        if(this.selected){
            strokeWeight(0)
            fill(255,255,0,180);
            rect(x*zoom,y*zoom,zoom,zoom)
        }
        noSmooth()
        push();
        imageMode(CENTER)
        translate(x*zoom,y*zoom)
        rotate(radians(-45))
        scale(1,2)
        image(this.img,0,0,zoom,zoom);
        pop();


    }
}


class Infantry extends Unit{
    constructor(type,pos,team,colour){
        super(type,pos,team,colour)
        this.movement = 7;
        this.range = 1;
    }


  }
  
  class Villager extends Infantry{
    constructor(pos,team,colour){
      super("Villager",pos,team,colour)
    }
  }
  
  class Milita extends Infantry{
    constructor(pos,team,colour){
      super("Villager",pos,team,colour)
    }
  }
  class Cavalry{
  
  }