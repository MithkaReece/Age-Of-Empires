class Terrain{
    constructor(img){
        this.img = img;
    }

    getMovement(){
        return this.movement
    }

    getBuildings(){
        return this.buildings;
    }

    show(x,y,scale){
        noSmooth();
        stroke(0);
        strokeWeight(1);
        fill(this.img);
        rectMode(CORNER);
        rect(x*scale,y*scale,scale,scale);
    }
}

class Ocean extends Terrain{
    constructor(){
        super([0,100,255])
        this.movement = 0;
        this.buildings = [];
    }
}

class River extends Terrain{
    constructor(){
        super([0,0,255])
        this.movement = 0;
        this.buildings = [];
    }
}

class Bridge extends Terrain{
    constructor(){
        super([100,250,200])
        this.movement = 2;
        this.buildings = [];
    }
}

class Plains extends Terrain{
    constructor(){
        super([0,255,0])
        this.movement = 2;
        this.buildings = ["towns","castles","farm"];
    }

    
}

class Desert extends Terrain{
    constructor(){
        super([255,255,0])
        this.movement = 2;
        this.buildings = ["towns","castles"];
    }
}

class Hills extends Terrain{
    constructor(){
        super([0,200,0])
        this.movement = 3;
        this.buildings = ["towns","castles"];
    }
}

class Forest extends Terrain{
    constructor(){
        super([0,255,100])
        this.movement = 3;
        this.buildings = ["towns","castles"];
    }
}

class Swamp extends Terrain{
    constructor(){
        super([40,50,200])
        this.movement = 3;
        this.buildings = [];
    }
}

class Ford extends Terrain{
    constructor(){
        super([130,130,130])
        this.movement = 3;
        this.buildings = [];
    }
}

class Mountains extends Terrain{
    constructor(){
        super([200,200,200])
        this.movement = 4;
        this.buildings = ["castles"]
    }
}

