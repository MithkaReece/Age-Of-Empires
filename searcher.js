  //Gets movement maps, gets build map, search areas
  class searcher{
    static getMovementMap(pos,team,movesLeft){
      let terrain = game.getTerrain();
      let map = clone(game.getTerrain());
      map[pos.x][pos.y]=true;
      searcher.threeDirection(map,terrain,pos,createVector(1,0),team,movesLeft);
      searcher.threeDirection(map,terrain,pos,createVector(-1,0),team,movesLeft);
      for(let y=0;y<map.length;y++){
        for(let x=0;x<map[0].length;x++){
          if(map[x][y]!=true){
            map[x][y] = null;
          }else if(!(pos.x==x&pos.y==y)&&game.getUnits()[x][y]!=null){//If other friendly unit
            map[x][y] = false;//Stop player moving onto friendly unit
          }
        }
      }
      return map;
    }
    static threeDirection(map,terrain,pos,dir,team,movesLeft){
      let forward = p5.Vector.add(pos,dir);
      searcher.validMovement(map,terrain,forward,dir,team,movesLeft);
      let right = p5.Vector.add(pos,dir.copy().rotate(radians(90)));
      searcher.validMovement(map,terrain,right,dir,team,movesLeft);
      let left = p5.Vector.add(pos,dir.copy().rotate(radians(-90)));
      searcher.validMovement(map,terrain,left,dir,team,movesLeft);
    }
    static validMovement(map,terrain,pos,dir,team,movesLeft){
      pos.x=round(pos.x);
      pos.y=round(pos.y);
      if(game.onMap(pos)){
        let currentTerrain = terrain[pos.x][pos.y];
        let movement = currentTerrain.getMovement();
        if(movement==0){return};//If water
        if(game.getUnits()[pos.x][pos.y]!=null){//If unit
          if(game.getUnits()[pos.x][pos.y].getTeam()!=team){return}//If unit not on team
        }
        if(game.getBuildings()[pos.x][pos.y]!=null){//If building
          if(game.getBuildings()[pos.x][pos.y].getTeam()!=team){return}//If not on team
        }
        if(movesLeft-movement>=0){//If first position is valid <= add unit/building blocking
          map[pos.x][pos.y]=true;
          searcher.threeDirection(map,terrain,pos,dir,team,movesLeft-movement);
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

    static getPossibleBuildings(pos,team,terrain,buildings,units,resources){//Add a way to grey out options if not enough resources
      if(buildings[pos.x][pos.y]!=null){return []}//Return if building already there
      if(resources[pos.x][pos.y]=="Wheat"){
        return [Mill.getFullName()];
      }
      if(resources[pos.x][pos.y]=="Gold"){
        return [Mine.getFullName()];
      }
      let options = searcher.getPossibleBuildingExtensions(pos,team,terrain,buildings);
      let types = terrain[pos.x][pos.y].getBuildings()
      if(types.includes("towns")){
        options.push(TownCenter.getFullName());//Validation for this needs adding
      }
      if(types.includes("castles")){
        let result = searcher.getCastleWonders("castles",terrain,buildings,units,resources,pos);
        if(result.some(x=>x!=null)){
          options.push(Castle.getFullName());
        }
      }
  
      return options;
    }

    static getCastleWonders(type,terrain,buildings,units,resources,pos){
      return [searcher.checkCastleWonder(type,terrain,buildings,units,resources,createVector(pos.x,pos.y+1),createVector(pos.x+1,pos.y+1),createVector(pos.x+1,pos.y),pos),
        searcher.checkCastleWonder(type,terrain,buildings,units,resources,createVector(pos.x+1,pos.y),createVector(pos.x+1,pos.y-1),createVector(pos.x,pos.y-1),pos),
        searcher.checkCastleWonder(type,terrain,buildings,units,resources,createVector(pos.x,pos.y-1),createVector(pos.x-1,pos.y-1),createVector(pos.x-1,pos.y),pos),
        searcher.checkCastleWonder(type,terrain,buildings,units,resources,createVector(pos.x-1,pos.y),createVector(pos.x-1,pos.y+1),createVector(pos.x,pos.y+1),pos)]
    }

    static checkCastleWonder(type,terrain,buildings,units,resources,a,b,c,pos){
      if(!game.onMap(a)||!game.onMap(b)||!game.onMap(c)){return null}
      if(buildings[a.x][a.y]!=null||units[a.x][a.y]!=null||resources[a.x][a.y]!=null||!(terrain[a.x][a.y].getBuildings().includes(type))){return null}
      if(buildings[b.x][b.y]!=null||units[b.x][b.y]!=null||resources[b.x][b.y]!=null||!(terrain[b.x][b.y].getBuildings().includes(type))){return null}
      if(buildings[c.x][c.y]!=null||units[c.x][c.y]!=null||resources[c.x][c.y]!=null||!(terrain[c.x][c.y].getBuildings().includes(type))){return null}
      return [a,b,c,pos];
    }

    static getPossibleBuildingExtensions(pos,team,terrain,buildings){
      let options = [];
      let types = terrain[pos.x][pos.y].getBuildings();
      if(types.includes("farm")){
        if(searcher.nearBuilding(pos,team,Mill,buildings)){
          options.push(Farm.getFullName());
        }
      }
      if(types.includes("towns")){
        if(searcher.nearBuilding(pos,team,TownCenter,buildings)){
          options.push(Barracks.getFullName());
          options.push(Stables.getFullName());
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