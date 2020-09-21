class Team{
    constructor(units,buildings,colour){
        this.units = units;
        this.buildings = buildings;
        this.colour = colour;
        this.f=2000;
        this.g=2000;
    }

    getUnits(){
        return this.units;
    }
    getBuildings(){
        return this.buildings;
    }
    getColour(){
        return this.colour;
    }

    unlockAll(){
        for(let i=0;i<this.units.length;i++){
            this.units[i].unlock();
        }
    }

    afford(price){return this.f>=price[0]&&this.g>=price[1]};
    spend(price){
        this.f-=price[0];
        this.g-=price[1];
    }
    
    give(resources){
        this.f+=resources[0];
        this.g+=resources[1];
    }

    showResources(){
        let x = 400;
        let y = 10;
        let width = 130;
        let height = 40;
        strokeWeight(0)
        fill(222,184,135);
        rect(x,y,width,height);
        fill(255)
        textSize(0.8*height);
        text("F:"+this.f,x,height);
        
        fill(222,184,135);
        rect(x+width,y,width,height);
        fill(255)
        textSize(0.8*height);
        text("G:"+this.g,x+width,height);
        
    }
}