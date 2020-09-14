class Team{
    constructor(units,buildings,colour){
        this.units = units;
        this.buildings = buildings;
        this.colour = colour;
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
}