class TownCenter{

}

class Barracks{

}

class Stables{

}

class ArcheryRange{

}

class Mill{
    constructor(img){
        this.img=img;
    }

    show(){
        push();
        noSmooth()
        imageMode(CENTER)
        translate((x+0.25)*zoom,(y+0.25)*zoom)
        rotate(radians(-45))
        scale(1,1.6)
        pop();
    }
}

class Mine{
    constructor(img){
        this.img = img;
    }

    show(){
        push();
        noSmooth()
        imageMode(CENTER)
        translate((x+0.25)*zoom,(y+0.25)*zoom)
        rotate(radians(-45))
        scale(1,1.6)
        pop();
    }
}