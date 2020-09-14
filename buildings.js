class Building{
    constructor(team,img){
        this.health=50;
        this.team = team;
        this.img = img;
        this.built = false;
    }

    getTeam(){
        return this.team;
    }
    finish(){
        this.built = true;
        this.health+=50;
    }
    getBuilt(){
        return this.built;
    }

    giveHealth(health){
        this.health+=health;
        if(this.health>100){
            this.health=100;
        }
    }

    
    show(){
        push();
        noSmooth()
        imageMode(CENTER)
        rectMode(CENTER)
        translate((x+0.25)*zoom,(y+0.25)*zoom)
        rotate(radians(-45))
        scale(1,1.6)
        if(this.built){
            fill(img);
        }else{
            fill(10);
        }
        rect(0,0,zoom,zoom)
        pop();
    }
}

class TownCenter extends Building{
    constructor(team){
        super(team);
    }
}

class Barracks extends Building{
    constructor(team){
        super(team);
    }
}

class Stables extends Building{
    constructor(team){
        super(team);
    }
}

class ArcheryRange extends Building{
    constructor(team){
        super(team);
    }
}

class Mill extends Building{
    constructor(team,img){
        super(team,img);
    }

}

class Mine extends Building{
    constructor(team,img){
        super(team,img);
        
    }


}