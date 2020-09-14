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
    //One line functions
    openUnitMenu(){currentMenu = new miniMenu(this.getOptions(this.movingPos))}
    lock(){this.units[this.movingPos.x][this.movingPos.y].lock()}
    deselect(){this.select(createVector(-1,-1))}
    onMap(pos){return pos.x>=0&&pos.x<this.mapSize.x&&pos.y>=0&&pos.y<this.mapSize.y;}
    build(building){this.buildings[this.movingPos.x][this.movingPos.y] = new building(this.turn,this.getCurrentTeam().getColour(),[255,0,0])}
    //Normal functions
    undoMove(){
      let unit = this.units[this.movingPos.x][this.movingPos.y];
      this.units[this.movingPos.x][this.movingPos.y]=null;
      this.units[this.lastPos.x][this.lastPos.y] = unit;
      this.select(this.lastPos);
    }

    select(pos){
      if(pos.x<0||pos.x>=this.mapSize.x||pos.y<0||pos.y>=this.mapSize.y){//Deselect if clicked off the map
        if(this.selected!=null){
          this.units[this.selected.x][this.selected.y].deselect();
          this.movementMap=null;
          this.buildMap=null;
          this.selected=null;
        }
        return true;
      }
      selectedPos = pos;
      let unitMoved = false;
      if(this.selected!=null){//Move unit if one is selected
        let unit = this.units[this.selected.x][this.selected.y]
        let map = searcher.getMovementMap(this.selected,unit.getTeam(),unit.getMovement());
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
        if(this.units[pos.x][pos.y]!=null){//If unit selected
          gotoTile(pos.x,pos.y);
          this.units[pos.x][pos.y].select();
          this.selected = pos;
          this.movementMap = searcher.getMovementMap(this.selected,this.units[pos.x][pos.y].getTeam(),this.units[pos.x][pos.y].getMovement());
          this.buildMap = searcher.getBuildMap(this.movementMap,this.turn,this.terrain,this.buildings,this.resources)
          if(this.units[pos.x][pos.y].getTeam()!=this.turn||this.units[pos.x][pos.y].getLocked()==true){
            return false;//If selected enemy
          }
        }
      }
      return true;
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
      this.teams[this.turn].unlockAll();
      //unlock everything
      this.turn=(this.turn+1)%this.teams.length;
      //Finish all buildings and units training
      for(let y=0;y<this.mapSize.y;y++){
        for(let x=0;x<this.mapSize.x;x++){
          let current = this.buildings[x][y];
          if(current!=null){
            if(current.getTeam()==this.turn){
              this.buildings[x][y].finish();
            }
          }
        }
      }
      let pos = sidebar.getNextUnit();
      gotoTile(pos.x,pos.y);
    }
  
    draw(width,height){
      for(let y=0;y<this.mapSize.y;y++){
        for(let x=0;x<this.mapSize.x;x++){
          this.terrain[x][y].show(x,y,zoom);
        }
      }
  
      for(let y=0;y<this.mapSize.y;y++){
        for(let x=0;x<this.mapSize.x;x++){
          if(x == selectedPos.x && y == selectedPos.y){
            strokeWeight(1)
            stroke(255);
            fill(0,0,0,0);
            rect(x*zoom,y*zoom,zoom,zoom);
          }
          if(this.movementMap!=null){
            if(this.movementMap[x][y]==true){
              strokeWeight(0)
              fill(255,255,0,180);
              rect(x*zoom,y*zoom,zoom,zoom)
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
          }
         
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

  //Gets movement maps, gets build map, search areas
  class searcher{
    static getMovementMap(pos,team,movesLeft){
      let map = clone(game.getTerrain());
      map[pos.x][pos.y]=true;
      searcher.threeDirection(map,pos,createVector(1,0),team,movesLeft);
      searcher.threeDirection(map,pos,createVector(-1,0),team,movesLeft);
      for(let y=0;y<map.length;y++){
        for(let x=0;x<map[0].length;x++){
          if(map[x][y]!=true){
            map[x][y] = null;
          }
        }
      }
      return map;
    }
    static threeDirection(map,pos,dir,team,movesLeft){
      let forward = p5.Vector.add(pos,dir);
      searcher.validMovement(map,forward,dir.copy(),team,movesLeft);
      let right = p5.Vector.add(pos,dir.copy().rotate(radians(90)));
      searcher.validMovement(map,right,dir,team,movesLeft);
      let left = p5.Vector.add(pos,dir.copy().rotate(radians(-90)));
      searcher.validMovement(map,left,dir,team,movesLeft);
    }
    static validMovement(map,pos,dir,team,movesLeft){
      pos.x=round(pos.x);
      pos.y=round(pos.y);
      if(game.onMap(pos)){
        let terrain = map[pos.x][pos.y];
        if(terrain==false||terrain==true){return;}//If terrain has already been looked at
        let movement = terrain.getMovement();
        if(movement==0||game.getUnits()[pos.x][pos.y]!=null){//If water or unit
          map[pos.x][pos.y]=false;
          return;
        }else if(game.getBuildings()[pos.x][pos.y]!=null){//If building
          if(game.getBuildings()[pos.x][pos.y].getTeam()!=team){//If not on team
            map[pos.x][pos.y]=false;
            return
          }
        }
        if(movesLeft-movement>=0){//If first position is valid <= add unit/building blocking
          map[pos.x][pos.y]=true;
          searcher.threeDirection(map,pos,dir,team,movesLeft-movement);
        }
      }
    }

    static getBuildMap(movementMap,team,terrain,buildings,resources){
      let map = clone(movementMap);
      for(let y=0;y<map.length;y++){
        for(let x=0;x<map[0].length;x++){
          let c = map[x][y]
          if(c!=null){
            if(searcher.getPossibleBuildingExtensions(createVector(x,y),team,terrain,buildings).length==0 || buildings[x][y]!=null || resources[x][y]!=null){
              map[x][y]=null;
            }
          }
        }
      }
      return map;
    }

    static getPossibleBuildings(pos,team,terrain,buildings,resources){//Add a way to grey out options if not enough resources
      if(buildings[pos.x][pos.y]!=null){return []}//Return if building already there
      if(resources[pos.x][pos.y]=="Wheat"){
        return ["Mill"];
      }
      if(resources[pos.x][pos.y]=="Gold"){
        return ["Mine"];
      }
      let options = searcher.getPossibleBuildingExtensions(pos,team,terrain,buildings);
      let types = terrain[pos.x][pos.y].getBuildings()
      if(types.includes("towns")){
        options.push("Town Center");//Validation for this needs adding
      }
      if(types.includes("castles")){
        options.push("Castle");
      }
  
      return options;
    }

    static getPossibleBuildingExtensions(pos,team,terrain,buildings){
      let options = [];
      let types = terrain[pos.x][pos.y].getBuildings();
      if(types.includes("farm")){
        if(searcher.nearBuilding(pos,team,Mill,buildings)){
          options.push("Farm");
        }
      }
      if(types.includes("towns")){
        if(searcher.nearBuilding(pos,team,TownCenter,buildings)){
          options.push("Barracks");
          options.push("Stables");
        }
      }
      return options;
    }

    static nearBuilding(pos,team,building,buildings){
      return searcher.isBuilding(p5.Vector.add(pos,createVector(1,0)),team,building,buildings) ||
      searcher.isBuilding(p5.Vector.add(pos,createVector(-1,0)),team,building,buildings) ||
      searcher.isBuilding(p5.Vector.add(pos,createVector(0,1)),team,building,buildings) ||
      searcher.isBuilding(p5.Vector.add(pos,createVector(0,-1)),team,building,buildings);
    }
  
    static isBuilding(pos,team,building,buildings){
      if(!game.onMap(pos)){return false}
      let current = buildings[pos.x][pos.y]
      if(current==null){return false}
      if(current.getTeam()!=team){return false}
      if(!(current instanceof building)){return false}
      return true;
    }

  }