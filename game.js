class Game{
    constructor(mapSize,terrain,resources,teams){
      this.mapSize = mapSize;
      if(terrain==null){
        this.terrain = mapGen.randomTerrain(mapSize);
      }else{
        this.terrain = terrain;
      }
      if(resources==null){
        this.resources = mapGen.randomResources(mapSize.x,mapSize.y,this.terrain);
      }else{
        this.resources = resources;
      }
      if(teams==null){
        this.teams = mapGen.plainTeams(mapSize.x,mapSize.y);
      }else{
        this.teams = teams;
      }
      this.buildings = make2Darray(mapSize.x,mapSize.y)
      for(let i=0;i<this.teams.length;i++){
        let current = this.teams[i].getBuildings();
        for(let k=0;k<current.length;k++){
          let building = current[k];
          let pos = building.getPos();
          this.buildings[pos.x][pos.y]=building;
        }
      }
      this.units = make2Darray(mapSize.x,mapSize.y);
      for(let i=0;i<this.teams.length;i++){
        let current = this.teams[i].getUnits();
        for(let k=0;k<current.length;k++){
          let unit = current[k];
          let pos = unit.getPos();
          this.units[pos.x][pos.y]=unit;
        }
      }
      
      this.turn = 0;
  
      this.selected=null;
      this.lastPos=null;
      this.movingPos=null;
      this.movementMap=null;//Positions you can move
      this.buildMap=null;//Positions you can move to and build off from something
      this.castleWonder=null;
    }
    //Getters & Setters
    getTurn(){
      return this.turn;
    }
    getCurrentTeam(){
      return this.teams[this.turn];
    }
    getTerrain(){
      return this.terrain;
    }
    getUnits(){
      return this.units;
    }
    getBuildings(){
      return this.buildings;
    }
    getResources(){
      return this.resources;
    }
    getMovingPos(){
      return this.movingPos;
    }
    getMapSize(){
      return this.mapSize;
    }
    getCastleWonder(){
      return this.castleWonder;
    }
    setCastleWonder(value){
      this.castleWonder = value;
    }
    //One line functions
    openUnitMenu(){currentMenu = new miniMenu(this.getOptions(this.movingPos))}
    lock(){this.units[this.movingPos.x][this.movingPos.y].lock()}
    deselect(){this.select(createVector(-1,-1))}
    onMap(pos){return pos.x>=0&&pos.x<this.mapSize.x&&pos.y>=0&&pos.y<this.mapSize.y;}
    build(building){this.buildings[this.movingPos.x][this.movingPos.y] = new building(this.turn,this.getCurrentTeam().getColour(),[255,0,0])}
    //Normal functions
    rotateCastleWonder(dir){
      this.castleWonder.nextAvailableCorner(dir)
    }

    undoMove(){
      let unit = this.units[this.movingPos.x][this.movingPos.y];
      this.units[this.movingPos.x][this.movingPos.y]=null;
      this.units[this.lastPos.x][this.lastPos.y] = unit;
      this.select(this.lastPos);
    }

    select(pos){
      if(!this.onMap(pos)){//Deselect if clicked off the map
        if(this.selected!=null){
          this.units[this.selected.x][this.selected.y].deselect();
          this.movementMap=null;
          this.buildMap=null;
          this.selected=null;
        }
        if(this.castleWonder!=null){
          currentMenu=new miniMenu(searcher.getPossibleBuildings(game.getMovingPos(),game.getTurn(),game.getTerrain(),game.getBuildings(),game.getUnits(),game.getResources()).concat("Cancel"));
          this.castleWonder=null;
        }
        return true;
      }
      this.moveCamToSelected(pos);
      selectedPos=pos;
      let unitMoved = false;
      if(this.selected!=null){//Move unit if one is selected 
        let unit = this.units[this.selected.x][this.selected.y]
        let map = searcher.getMovementMap(this.selected.copy(),unit.getTeam(),unit.getMovement());
        if(map[pos.x][pos.y]){//If valid move
          unitMoved = true;
          this.lastPos=this.selected.copy();//Saves last position
          this.movingPos=pos.copy();
          this.units[this.selected.x][this.selected.y]=null;//Make last pos empty
          this.units[pos.x][pos.y]=unit;//Move unit
          unit.setPos(pos);
          this.openUnitMenu();
        } 
        unit.deselect();//Unselect unit
        this.movementMap=null;
        this.buildmap=null;
        this.selected=null;
      }
  
      if(unitMoved==false){//To select new square
        if(this.castleWonder!=null){//If castle/wonder being built
          if(this.castleWonder.onCorner(pos)){//If clicked on castle
            this.castleWonder.settle();
            let poses = this.castleWonder.getCurrentCorner();
            for(let i=0;i<poses.length;i++){
              let pos = poses[i];
              this.buildings[pos.x][pos.y]=this.castleWonder;
            }
          }else{
            currentMenu=new miniMenu(searcher.getPossibleBuildings(game.getMovingPos(),game.getTurn(),game.getTerrain(),game.getBuildings(),game.getUnits(),game.getResources()).concat("Cancel"))}
          this.castleWonder=null;
          return true;
        }
        if(this.buildings[pos.x][pos.y]!=null&&this.units[pos.x][pos.y]!=null){//If unit on building
          if(this.buildings[pos.x][pos.y].isClickable()&&this.units[pos.x][pos.y].getLocked()==false){//If both clickable
            currentMenu=new miniMenu([[this.buildings[pos.x][pos.y].getName(),function(){game.selectBuilding(true)}]
            ,[this.units[pos.x][pos.y].getName(),function(){game.selectUnit()}]
            ,["Cancel",function(){currentMenu=null}]])
          }else if(this.buildings[pos.x][pos.y].isClickable()){//Just building clickable
            this.selectBuilding(true);
          }else if(this.units[pos.x][pos.y].getLocked()==false){//Just unit clickable
            this.selectUnit();
          }else{//Neither clickable
            this.selectUnit();
            return false;  
          }
          return true;
        }
        else if(this.buildings[pos.x][pos.y]!=null){
          this.selectBuilding();
        }
        else if(this.units[pos.x][pos.y]!=null){//If unit selected
          this.selectUnit()
          if(this.units[pos.x][pos.y].getTeam()!=this.turn||this.units[pos.x][pos.y].getLocked()==true){
            return false;//If selected enemy
          }
        }
      }
      return true;
    }

    selectBuilding(remove=false){
      gotoTile(selectedPos.x,selectedPos.y);
      if(remove){
        currentMenu=new miniMenu(this.buildings[selectedPos.x][selectedPos.y].getOptions());
      }else{
        currentMenu=new miniMenu([["train"]].concat(this.buildings[selectedPos.x][selectedPos.y].getOptions()));
      }
    }

    selectUnit(){
      gotoTile(selectedPos.x,selectedPos.y);
      currentMenu=null;
      this.units[selectedPos.x][selectedPos.y].select();
      this.selected = selectedPos.copy();
      this.movementMap = searcher.getMovementMap(this.selected.copy(),this.units[selectedPos.x][selectedPos.y].getTeam(),this.units[selectedPos.x][selectedPos.y].getMovement());
      this.buildMap = searcher.getBuildMap(this.movementMap,this.turn,this.terrain,this.buildings,this.resources)  
    }

    moveCamToSelected(pos){
      let difference = p5.Vector.sub(pos,selectedPos);
      for(let i=0;i<max(abs(difference.x),abs(difference.y));i++){
        if(i<abs(difference.x)){
          selectedPos.add(createVector(difference.x/abs(difference.x),0));
          if(selectedCamDist()>viewArea){
            offset.add(createVector(difference.x/abs(difference.x),0));
            gotoTile(offset.x,offset.y);
          }
        }
        if(i<abs(difference.y)){
          selectedPos.add(createVector(0,difference.y/abs(difference.y)));
          if(selectedCamDist()>viewArea){
            offset.add(createVector(0,difference.y/abs(difference.y)));
            gotoTile(offset.x,offset.y);
          }
        }
      }
    }
  
    getOptions(pos){
      let unit = this.units[pos.x][pos.y];
      let range = unit.getRange();
      let options = [];
  
      if(unit instanceof Villager&&this.terrain[pos.x][pos.y].getBuildings().length>0){
        options.push("Build");
      }
      return options.concat(["Undo Move","Done"])
    }
  
    endDay(){
      let team = this.getCurrentTeam();
      team.unlockAll();
      //unlock everything
      
      //Finish all buildings and units training
      for(let y=0;y<this.mapSize.y;y++){
        for(let x=0;x<this.mapSize.x;x++){
          let current = this.buildings[x][y];
          if(current!=null){//If building
            if(current.getTeam()==this.turn){//If building on team
              this.buildings[x][y].finish();
              team.give(this.buildings[x][y].getIncome());
            }
          }
        }
      }
      this.turn=(this.turn+1)%this.teams.length;
      let pos = sidebar.getNextUnit();
      gotoTile(pos.x,pos.y);
    }
  
    show(width,height){
      for(let y=0;y<this.mapSize.y;y++){
        for(let x=0;x<this.mapSize.x;x++){
          this.terrain[x][y].show(x,y,zoom);
        }
      }//Terrain
  
      for(let y=0;y<this.mapSize.y;y++){
        for(let x=0;x<this.mapSize.x;x++){
          if(x == selectedPos.x && y == selectedPos.y){
            strokeWeight(1)
            stroke(255);
            fill(0,0,0,0);
            rect(x*zoom,y*zoom,zoom,zoom);
          }//White Selected
          if(this.movementMap!=null){
            if(this.movementMap[x][y]!=null){
              strokeWeight(0)
              fill(255,255,0,180);
              rect(x*zoom,y*zoom,zoom,zoom)
            }
          }//movement map
          if(this.castleWonder!=null){
            let list = this.castleWonder.getCurrentCorner();
            for(let i=0;i<list.length;i++){
              let pos = list[i];
              if(pos.x==x&&pos.y==y){
                strokeWeight(0)
                fill(255,255,0,180);
                rect(x*zoom,y*zoom,zoom,zoom)
              }
            }
          }
          if(this.selected!=null){
            if(this.buildMap!=null&&this.units[this.selected.x][this.selected.y] instanceof Villager){
              if(this.buildMap[x][y]==true){
                strokeWeight(0)
                fill(0,206,209,180);
                rect(x*zoom,y*zoom,zoom,zoom)
              }
            }
          }//Build map
         
          push();
          noSmooth()
          imageMode(CENTER)
          translate((x+0.25)*zoom,(y+0.25)*zoom)
          rotate(radians(-45))
          scale(1,1.6)
          if(this.buildings[x][y]==null){
            switch(this.resources[x][y]){
              case "Wheat":
                image(onTerrainImgs.filter(x=>x[0]=="Wheat")[0][1],0,0,zoom,zoom)
              break;
              case "Gold":
                let img = onTerrainImgs.filter(x=>x[0]=="Gold")[0][1]
                image(img,0,0,zoom,zoom)
                fill(255,255,0);
              break;
            }
          }
          pop();
  
          
          if(this.buildings[x][y]!=null){
            this.buildings[x][y].show(x,y);
          }
          if(this.units[x][y]!=null){
            this.units[x][y].show(x,y);
          }
  
        }
      }
      
    }
  
    showResources(){
      this.getCurrentTeam().showResources();
    }

  }
  
  class preMade extends Game{
    constructor(preload){
      if(preload == 1){
        super(createVector(15,15),null,null,null);
      }
    
    }
  
  }

  class mapGen{
    
    static randomTerrain(mapSize){
      let tileTypes = [new Plains,new Forest,new Ocean,new River,new Hills,new Mountains,new Ford,new Swamp,new Bridge,new Desert];
      tileTypes = [new Plains,new Hills]
      let map = make2Darray(mapSize.x,mapSize.y);
      for(let y=0;y<mapSize.y;y++){
        for(let x=0;x<mapSize.x;x++){
          map[x][y] = tileTypes[floor(random(tileTypes.length))];
        }
      }
      return map;
    }

    static randomResources(length,height,terrain){
      let map = make2Darray(length,height);
      let wheat = 15;
      let gold = 8;
      for(let y=0;y<height;y++){
        for(let x=0;x<length;x++){
          let c = terrain[x][y];
          if(wheat>0){
            if(c instanceof Plains && random(1)<0.1){
              map[x][y] = "Wheat";
              wheat--;
            }
          }
          if(gold>0){
            if(c instanceof Hills || c instanceof Mountains){
              map[x][y] = "Gold"
              gold--;
            }
          }
        }
      }
      return map;
    }

    static plainTeams(length,height){
      let one = new Team([new Villager(createVector(2,length-3),0,"Blue"),new Milita(createVector(2,length-2),0,"Blue")],[],"Blue");
      let two = new Team([new Villager(createVector(length-2,2),1,"Red"),new Milita(createVector(length-2,3),1,"Red")],[],"Red");
      return [one,two];
    }

  }
