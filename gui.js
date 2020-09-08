class miniMenu{
    constructor(pos,options){
        this.pos = pos;
        this.width = 110;
        this.height = 20;
        this.innerBorder = 3;
        this.outerBorder = 10;
        this.options = options;
        this.selectedIndex = 0;
    }

    click(x,y){
        if(this.onMenu(x,y)){
            for(let i=0;i<this.options.length;i++){
                if(this.region(x,y,this.pos.x,this.pos.y+this.height*i,this.width,this.height)){
                    return this.options[i];
                }
            }
        }else{
            return "Undo Move";
        }
    }

    region(a,b,x,y,w,h){
        return a>=x && a<=x+w && b>=y && b<=y+h;
    }

    onMenu(x,y){
        return this.region(x,y,this.pos.x-this.innerBorder-this.outerBorder,this.pos.y-this.innerBorder-this.outerBorder,this.width+2*(this.innerBorder+this.outerBorder),this.height*this.options.length+2*(this.innerBorder+this.outerBorder));
    }

    show(){
        push();
        strokeWeight(0);
        rectMode(CORNER);
        translate(this.pos.x,this.pos.y);
        fill(139,69,19);
        rect(-this.innerBorder-this.outerBorder,-this.innerBorder-this.outerBorder,this.width+2*(this.innerBorder+this.outerBorder),this.height*this.options.length+2*(this.innerBorder+this.outerBorder));
        fill(222,184,135);
        rect(-this.innerBorder,-this.innerBorder,this.width+2*this.innerBorder,this.height*this.options.length+2*this.innerBorder);
        for(let i=0;i<this.options.length;i++){
            fill(222,184,135);
            rect(0,this.height*i,this.width,this.height);
            fill(0)
            textSize(this.height);
            text(this.options[i],0,this.height*(i+1));
        }
        pop();
    }

}