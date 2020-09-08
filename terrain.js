class Terrain{
    constructor(img){
        this.img = img;
    }

    getMovement(){
        return this.movement
    }

    getBuilding(){
        return this.building;
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
        this.building = null;
    }
}

class River extends Terrain{
    constructor(){
        super([0,0,255])
        this.movement = 0;
        this.building = null;
    }
}

class Bridge extends Terrain{
    constructor(){
        super([100,250,200])
        this.movement = 2;
        this.building = null;
    }
}

class Plains extends Terrain{
    constructor(){
        super([0,255,0])
        this.movement = 2;
        this.building = ["towns","castles","farm"];
    }
}

class Desert extends Terrain{
    constructor(){
        super([255,255,0])
        this.movement = 2;
        this.building = ["towns","castles"];
    }
}

class Hills extends Terrain{
    constructor(){
        super([0,200,0])
        this.movement = 3;
        this.building = ["towns","castles"];
    }
}

class Forest extends Terrain{
    constructor(){
        super([0,255,100])
        this.movement = 3;
        this.building = ["towns","castles"];
    }
}

class Swamp extends Terrain{
    constructor(){
        super([40,50,200])
        this.movement = 3;
        this.building = null;
    }
}

class Ford extends Terrain{
    constructor(){
        super([130,130,130])
        this.movement = 3;
        this.building = null;
    }
}

class Mountains extends Terrain{
    constructor(){
        super([200,200,200])
        this.movement = 4;
        this.building = ["castles"]
    }
}

