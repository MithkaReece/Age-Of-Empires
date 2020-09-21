class Building{
    constructor(team,img,income,clickable){
        this.health=50;
        this.team = team;
        this.img = img;
        this.built = false;
        this.income = income;
        this.clickable = clickable;
    }

    getTeam(){return this.team}

    getIncome(){return this.income}

    getBuilt(){return this.built}

    isClickable(){return this.clickable}

    finish(){
        if(this.built==false){
            this.built = true;
            this.health+=50;
        }
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
        super(team,img,[25,30],true);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenter"+colour)[0][1];
        
    }
    static getFullName(){return TownCenter.getName() + " (" + TownCenter.getPrice()[0] + "f " + TownCenter.getPrice()[1] + "g)"}
    static getName(){return "Town Center"}
    getName(){return TownCenter.getName()}
    static getPrice(){return [600,400]}

    getOptions(){
        return [["Cancel",function(){currentMenu=null}]];
    }
    
}

class Barracks extends Building{
    constructor(team,colour,img){
        super(team,img,[0,0],true);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
    }
    static getFullName(){return Barracks.getName() + " (" + Barracks.getPrice()[0] + "f " + Barracks.getPrice()[1] + "g)"}
    static getName(){return "Barracks"}
    getName(){return Barracks.getName()}
    static getPrice(){return [360,240]}


    getOptions(){
        return [["Cancel",function(){currentMenu=null}]];
    }
}

class Stables extends Building{
    constructor(team,colour,img){
        super(team,img,[0,0],true);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
    }
    static getFullName(){return Stables.getName() + " (" + Stables.getPrice()[0] + "f " + Stables.getPrice()[1] + "g)"}
    static getName(){return "Stables"}
    getName(){return Stables.getName()}
    static getPrice(){return [360,240]}

    getOptions(){
        return [["Cancel",function(){currentMenu=null}]];
    }
}

class ArcheryRange extends Building{
    constructor(team,colour,img){
        super(team,img,[0,0],true);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
    }
    static getFullName(){return ArcheryRange.getName() + " (" + ArcheryRange.getPrice()[0] + "f " + ArcheryRange.getPrice()[1] + "g)"}
    static getName(){return "ArcheryRange"}
    getName(){return ArcheryRange.getName()}
    static getPrice(){return [360,240]}//unknownm

    getOptions(){
        return [["Cancel",function(){currentMenu=null}]];
    }
}

class Mill extends Building{
    constructor(team,colour,img){
        super(team,img,[50,0],false);
        this.img = buildingImgs.filter(x=>x[0]=="Mill"+colour)[0][1];
    }
    static getFullName(){return Mill.getName() + " (" + Mill.getPrice()[0] + "f " + Mill.getPrice()[1] + "g)"}
    static getName(){return "Mill"}
    getName(){return Mill.getName()}
    static getPrice(){return [120,80]} 
}

class Farm extends Building{
    constructor(team,colour,img){
        super(team,img,[50,0],false);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
    }
    static getFullName(){return Farm.getName() + " (" + Farm.getPrice()[0] + "f " + Farm.getPrice()[1] + "g)"}
    static getName(){return "Farm"}
    getName(){return Farm.getName()}
    static getPrice(){return [90,60]}
}

class Mine extends Building{
    constructor(team,colour,img){
        super(team,img,[0,160]);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
    }
    static getFullName(){return Mine.getName() + " (" + Mine.getPrice()[0] + "f " + Mine.getPrice()[1] + "g)"}
    static getName(){return "Mine"}
    getName(){return Mine.getName()}
    static getPrice(){return [360,240]}
}


class Castle extends Building{
    constructor(team,colour,img,locations){
        super(team,img);
        this.img = buildingImgs.filter(x=>x[0]=="TownCenterBlue")[0][1];
        this.locations = locations;
        this.cornerIndex = 0;
        this.nextAvailableCorner(1);
        this.poses;
    }   
    static getFullName(){return Castle.getName() + " (" + Castle.getPrice()[0] + "f " + Castle.getPrice()[1] + "g)"}
    static getName(){return "Castle"}
    getName(){return Castle.getName()}
    static getPrice(){return [840,560]}

    getCurrentCorner(){
        return this.locations[this.cornerIndex];
    }

    getOptions(){
        return [["Cancel",function(){currentMenu=null}]];
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
            for(let i=-1;i>-this.locations.length;i--){
                if(this.locations[(this.cornerIndex+i+this.locations.length)%this.locations.length]!=null){
                    this.cornerIndex=(this.cornerIndex+i+this.locations.length)%this.locations.length
                    return;
                }
            }
        }
    }

    onCorner(pos){
        let points = this.getCurrentCorner();
        for(let i=0;i<points.length;i++){
            let point = points[i];
            if(pos.x==point.x&&pos.y==point.y){return true}
        }
        return false;
    }

    settle(){
        this.poses = this.locations[this.cornerIndex];
    }

    

    show(x,y){
        super.show(x,y);

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
