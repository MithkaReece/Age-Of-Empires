class Unit{
    constructor(type,pos,team,colour,startHealth){
        this.pos = pos;
        this.team = team;
        this.img=unitImgs.filter(x=>x[0]==type+colour)[0][1];
        this.selected = false;
        this.locked = false;

        this.trained = false;
        this.health = startHealth
    }
    getPos(){
        return this.pos;
    }
    setPos(pos){
        this.pos = pos.copy();
    }
    getTrained(){return this.trained}
    getTeam(){return this.team}
    getMovement(){return this.movement}
    getRange(){return this.range}
    getLocked(){return this.locked}
    lock(){
        this.locked=true;
    }
    unlock(){
        this.locked=false;
    }

    train(){
        if(this.trained)
            return;

        this.trained = true;
        this.health+=50;
    }

    select(){
        this.selected = true;
    }
    deselect(){
        this.selected = false;
    }
    show(x,y, zoom){
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
    constructor(type,pos,team,colour,startHealth){
        super(type,pos,team,colour,startHealth)
        this.movement = 7;
        this.range = 1;
    }
  }
  
  class Villager extends Infantry{
    constructor(pos,team,colour,startHealth){
      super("Villager",pos,team,colour,startHealth)
    }
    static getName(){return "Villager"}
    getName(){return Villager.getName()}

    static getPrice(){return [100,100]}
  }
  
  class Milita extends Infantry{
    constructor(pos,team,colour,startHealth){
      super("Villager",pos,team,colour,startHealth)
    }
    static getName(){return "Milita"}
    getName(){return Milita.getName()}

    static getPrice(){return [600,400]}//Unknown
  }
  class Cavalry{
  
  }