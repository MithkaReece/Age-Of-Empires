class miniMenu{
    constructor(options){
        this.pos = createVector(width/2,height/2);
        this.width = 110;
        this.height = 20;
        this.innerBorder = 3;
        this.outerBorder = 10;
        this.options = options;
        this.selectedIndex = 0;
        this.previousOptions=null;
        this.toText = {
            "Town Center":TownCenter,
            "Mill":Mill,
            "Farm":Farm,
            "Mine":Mine,
            "Barracks":Barracks,
            "Stables":Stables,
            "ArcheryRange":ArcheryRange
        }
    }

    getSelectedIndex(){
        return this.selectedIndex;
    }

    move(dir){
        this.selectedIndex += dir;
        if(this.selectedIndex<0){this.selectedIndex=0};
        if(this.selectedIndex>=this.options.length){this.selectedIndex=this.options.length-1};
    }

    mouseOver(x,y){
        if(this.onMenu(x,y)){
            for(let i=0;i<this.options.length;i++){
                if(this.region(x,y,this.pos.x,this.pos.y+this.height*i,this.width,this.height)){
                    this.selectedIndex = i;
                }
            }
        }
    }

    mouseClick(x,y){
        if(this.onMenu(x,y)){//If clicked on menu
            this.clickOption(this.selectedIndex);
        }else{//Clicked off menu
            if(this.options.includes("Undo Move")){//Complete unselect
                game.undoMove();
                currentMenu=null;
            }else{//Go back a menu
                game.openUnitMenu();
            }
            
        }
    }

    clickOption(i){
        let result = this.options[i];
        switch(result){
            case "Done":
                game.lock();
                currentMenu=null;
                break;
            case "Undo Move":
                game.undoMove();
                currentMenu=null;
                break;
            case "Build":
                currentMenu=new miniMenu(searcher.getPossibleBuildings(game.getMovingPos(),game.getTurn(),game.getTerrain(),game.getBuildings(),game.getUnits(),game.getResources()).concat("Cancel"));
                break;
            case "Cancel":
                game.openUnitMenu();
                break;
            case "Castle":
                game.setCastleWonder(new Castle(game.getTurn(),game.getCurrentTeam().getColour(),[255,0,0],searcher.getCastleWonders("castles",game.getTerrain(),game.getBuildings(),game.getUnits(),game.getMovingPos())))
                currentMenu=null;
                break;
            case "Wonder":

                break;
        }
        if(Object.keys(this.toText).includes(result)){
            game.build(this.toText[result]);
            game.lock()
            currentMenu=null;
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
            if(i==this.selectedIndex){
                fill(0,100);
                rect(0,this.height*i,this.width,this.height);
            }
        }
        pop();
    }

}

class sideBar{
    constructor(width,height){
        this.width = 80
        this.height = height;
        this.pos = createVector(width-this.width,0)
        this.options = ["Info","MainMenu","NextUnit","TileSwitch","End Day"]
        this.topGap = 10;
        this.bottomGap = 10;
        this.leftGap = 10;
        this.rightGap = 10;
        this.betweenGap = 10;
    }

    click(x,y){
        if(this.region(x,y,this.pos.x,this.pos.y,this.width,this.height)){
            for(let i=0;i<this.options.length;i++){
                let h = (this.height-this.topGap-this.bottomGap-(this.options.length-1)*this.betweenGap)/this.options.length;
                let calcY = this.topGap+i*(h+this.betweenGap)
                if(this.region(x,y,this.pos.x,calcY,this.width,h)){
                    let result = this.options[i];
                    switch(result){
                        case "Info":
                        
                        case "MainMenu":

                        case "NextUnit":
                            let result = this.getNextUnit();
                            if(result!=null){
                                game.select(result);
                            }
                            break;
                        case "TileSwitch":

                        case "End Day":
                            game.endDay();
                        break;
                    }
                }
                
            }
        }else{
            return false;
        }
        return true;
    }

    getNextUnit(){
        let units = game.getCurrentTeam().getUnits().filter(x=>x.getLocked()==false);
        if(units.length==0){return null}
        let unit = null;
        if(game.onMap(selectedPos)){
            unit = game.getUnits()[selectedPos.x][selectedPos.y]
        }
        let index = 0;
        if(unit!=null){//If unit selected
            if(unit.getTeam()==game.getTurn()){//If unit selected is on team
                for(let i=0;i<units.length;i++){//Find selected unit
                    if(units[i]===unit){
                        index = (i+1)%units.length;
                    }
                }
            }
        }
        return units[index].getPos();
    }

    region(a,b,x,y,w,h){
        return a>=x && a<=x+w && b>=y && b<=y+h;
    }

    show(){
        push();
        translate(this.pos.x,0)
        fill(222,184,13);
        rect(0,0,this.width,height);
        for(let i=0;i<this.options.length;i++){
            let w = this.width-this.leftGap-this.rightGap;
            let x = this.leftGap;
            let h = (this.height-this.topGap-this.bottomGap-(this.options.length-1)*this.betweenGap)/this.options.length;
            let y = this.topGap+i*(h+this.betweenGap);
            fill(255,0,0);
            rect(x,y,w,h);
        }
        pop();
    }
}