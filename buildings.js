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
        if(this.built==false){
            this.built = true;
            this.health+=50;
        }
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

    
    show(x,y){
        push();
        noSmooth()
        imageMode(CENTER)
        rectMode(CENTER)
        translate((x+0.25)*zoom,(y+0.25)*zoom)
        rotate(radians(-45))
        scale(1,2)
        stroke(0);
        if(this.built){
            image(this.img,0,0,zoom,zoom)
        }else{
            image(this.img,0,0,zoom,zoom)
            //fill(this.img);
        }
        pop();
    }
}

class TownCenter extends Building{
    constructor(team,colour,img){
        super(team,img);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenter"+colour)[0][1];
    }
}

class Barracks extends Building{
    constructor(team,colour,img){
        super(team,img);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
    }
}

class Stables extends Building{
    constructor(team,colour,img){
        super(team,img);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
    }
}

class ArcheryRange extends Building{
    constructor(team,colour,img){
        super(team,img);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
    }
}

class Mill extends Building{
    constructor(team,colour,img){
        super(team,img);
        this.img = buildingImgs.filter(x=>x[0]=="Mill"+colour)[0][1];
    }

}

class Farm extends Building{
    constructor(team,colour,img){
        super(team,img);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
    }

}

class Mine extends Building{
    constructor(team,colour,img){
        super(team,img);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
    }


}


class Castle extends Building{
    constructor(team,colour,img,locations){
        super(team,img);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
        this.locations = locations;
        this.cornerIndex = 0;
        this.nextAvailableCorner(1);
        console.log(this.cornerIndex);
    }   

    getCurrentCorner(){
        return this.locations[this.cornerIndex];
    }

    nextAvailableCorner(dir){
        if(dir>0){
            for(let i=1;i<this.locations.length;i++){
                if(this.locations[(this.cornerIndex+i)%this.locations.length]!=null){
                    this.cornerIndex=(this.cornerIndex+i)%this.locations.length
                    return;
                }
            }
        }else{
            for(let i=1;i>-this.locations.length;i--){
                if(this.locations[(this.cornerIndex+i+this.locations.length)%this.locations.length]!=null){
                    this.cornerIndex=(this.cornerIndex+i+this.locations.length)%this.locations.length
                    return;
                }
            }
        }
    }

}

class Wonder extends Building{
    constructor(team,colour,img,locations){
        super(team,img);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
        this.locations = locations;
    }
    getLocations(){
        return this.locations;
    }


}
