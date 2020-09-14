class Team{
    constructor(units,buildings){
        this.units = units;
        this.buildings = buildings;
    }

    getUnits(){
        return this.units;
    }
    getBuildings(){
        return this.buildings;
    }

    unlockAll(){
        for(let i=0;i<this.units.length;i++){
            this.units[i].unlock();
        }
    }
}