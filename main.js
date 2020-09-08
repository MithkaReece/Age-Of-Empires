let game;
let zoom = 20;
let cam;
let tile;
let selectedPos;
let unitImgs = ['VillagerBlue','VillagerRed',"MilitaBlue","MilitaRed"];
let onTerrainImgs = ['Gold',"Wheat"]
let terrain = ["Plains"]

let currentMenu = null;
function preload(){
  for(let i=0;i<unitImgs.length;i++){
    let unit = unitImgs[i];
    let img = loadImage('Units/'+unit+'.png');
    unitImgs[i] = [unit,img];
  }
  for(let i=0;i<onTerrainImgs.length;i++){
    let onTerrain = onTerrainImgs[i];
    let img = loadImage('OnTerrain/'+onTerrain+'.png');
    onTerrainImgs[i] = [onTerrain,img];
  }
  for(let i=0;i<terrain.length;i++){
    let cterrain = terrain[i];
    let img = loadImage('terrain/'+cterrain+'.png');
    terrain[i] = [cterrain,img];
  }
}

function setup() {
  createCanvas(800, 400);
  selectedPos = createVector(-1,-1)
  tile = createVector(0,0);
  cam = createVector(0,0);
  game = new preMade(1);
}

function draw(){ 
  background(0);
  push();
  scale(2,1)
  translate(-cam.x+width/4,-cam.y+height/2-3*zoom/4)
  rotate(radians(45))
  translate(tile.x,tile.y)
  game.draw(width,height);
  pop();
  ellipseMode(CENTER);
  ellipse(width/2,height/2,5,5)

  if(currentMenu!=null){
    currentMenu.show();
  }

  controls();
}

function gotoTile(x,y){
  cam = createVector(0,0);
  tile = createVector(-x*zoom,-y*zoom);
}

function mouseClicked(){
  if(currentMenu==null){
    let pos = createVector((mouseX-0.5*width+(cam.x+tile.x)*2),(mouseY-0.5*height+cam.y+tile.y))
    game.select(createVector(round(sqrt(2)*(0.5*pos.y+0.25*pos.x)/zoom),round(sqrt(2)*(0.5*pos.y-0.25*pos.x)/zoom)));
  }else{
    let result = currentMenu.click(mouseX,mouseY);
    if(result=="Undo Move"){
      if(currentMenu instanceof miniMenu){
        game.undoMove();
      }
      currentMenu=null;
    }else if(result=="Done"){
      currentMenu=null;
    }
  }
}

function mouseWheel(event){
  zoom-=0.01*event.delta;
}

function controls(){
  if(keyIsDown(87)){//w
    cam.y=cam.y-2;
  }
  if(keyIsDown(65)){//a
    cam.x=cam.x-2;
  }
  if(keyIsDown(83)){//s
    cam.y=cam.y+2;
  }
  if(keyIsDown(68)){//d
    cam.x=cam.x+2;
  }
}


const make2Darray = (cols,rows) => new Array(cols).fill().map(item =>(new Array(rows)))
const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);




class Game{
  constructor(mapSize,terrain,buildings,units,teams){
    this.mapSize = mapSize;
    if(terrain==null){
      this.terrain = this.randomTerrain(mapSize);
    }else{
      this.terrain = terrain;
    }
    if(buildings==null){
      this.buildings = make2Darray(mapSize.x,mapSize.y);
    }else{
      this.buildings = buildings
    }
    if(units==null){
      this.units = make2Darray(mapSize.x,mapSize.y);
    }else{
      this.units = units;
    }
    this.teams = teams;

    this.selected=null;
    this.undoPos=null;
    this.movingUnitPos=null;
    this.movementMap=null
  }

  randomTerrain(mapSize){
    let tileTypes = [new Plains,new Forest,new Ocean,new River,new Hills,new Mountains,new Ford,new Swamp,new Bridge,new Desert];
    let map = make2Darray(mapSize.x,mapSize.y);
    for(let y=0;y<mapSize.y;y++){
      for(let x=0;x<mapSize.x;x++){
        map[x][y] = tileTypes[floor(random(tileTypes.length))];
      }
    }
    return map;
  }

  undoMove(){
    let unit = this.units[this.movingUnitPos.x][this.movingUnitPos.y];
    this.units[this.movingUnitPos.x][this.movingUnitPos.y]=null;
    this.units[this.undoPos.x][this.undoPos.y] = unit;
    this.select(this.undoPos);
  }

  select(pos){
    if(pos.x<0||pos.x>=this.mapSize.x||pos.y<0||pos.y>=this.mapSize.y){//Deselect if clicked off the map
      if(this.selected!=null){
        this.units[this.selected.x][this.selected.y].deselect();
        this.movementMap=null;
        this.selected=null;
      }
      return;
    }
    
    let unitMoved = false;
    if(this.selected!=null){//Move unit if one is selected
      let unit = this.units[this.selected.x][this.selected.y]
      let map = this.getMovementMap(this.selected,unit.getTeam(),unit.getMovement());
      if(map[pos.x][pos.y]){//If valid move
        unitMoved = true;
        this.undoPos=this.selected.copy();//Saves last position
        this.movingUnitPos=pos.copy();
        this.units[this.selected.x][this.selected.y]=null;//Make last pos empty
        this.units[pos.x][pos.y]=unit;//Move unit
        currentMenu = new miniMenu(createVector(width/2,height/2),this.getOptions(pos));
      } 
      unit.deselect();//Unselect unit
      this.movementMap=null;
      this.selected=null;
    }

    if(unitMoved==false){//To select new square
      if(this.units[pos.x][pos.y]!=null){//If unit selected
        this.units[pos.x][pos.y].select();
        this.selected = pos;
        this.movementMap = this.getMovementMap(this.selected,this.units[pos.x][pos.y].getTeam(),this.units[pos.x][pos.y].getMovement());
      }
    }
  }


  getMovementMap(pos,team,movesLeft){
    let map = clone(this.terrain);
    map[pos.x][pos.y]=true;
    this.threeDirection(map,pos,createVector(1,0),team,movesLeft);
    this.threeDirection(map,pos,createVector(-1,0),team,movesLeft);

    for(let y=0;y<map.length;y++){
      for(let x=0;x<map.length;x++){
        if(map[x][y]!=true&&map[x][y]!=false){
          map[x][y] = null;
        }
      }
    }
    return map;
  }

  threeDirection(map,pos,dir,team,movesLeft){
    let forward = p5.Vector.add(pos,dir);
    this.validMovement(map,forward,dir.copy(),team,movesLeft);
    let right = p5.Vector.add(pos,dir.copy().rotate(radians(90)));
    this.validMovement(map,right,dir,team,movesLeft);
    let left = p5.Vector.add(pos,dir.copy().rotate(radians(-90)));
    this.validMovement(map,left,dir,team,movesLeft);
  }

  validMovement(map,pos,dir,team,movesLeft){
    pos.x=round(pos.x);
    pos.y=round(pos.y);
    if(pos.x>=0&&pos.x<this.mapSize.x&&pos.y>=0&&pos.y<this.mapSize.y){
      let terrain = map[pos.x][pos.y];
      if(terrain==false||terrain==true){return;}//If terrain has already been looked at
      let movement = terrain.getMovement();
      if(movement==0||this.units[pos.x][pos.y]!=null){//If water or unit
        map[pos.x][pos.y]=false;
        return;
      }else if(this.buildings[pos.x][pos.y]!=null){//If building
        if(this.buildings[pos.x][pos.y].getTeam()!=team){//If not on team
          map[pos.x][pos.y]=false;
          return
        }
      }
      if(movesLeft-movement>=0){//If first position is valid <= add unit/building blocking
        map[pos.x][pos.y]=true;
        this.threeDirection(map,pos,dir,team,movesLeft-movement);
      }
    }
  }

  getOptions(pos){
    let unit = this.units[pos.x][pos.y];
    let range = unit.getRange();
    let options = [];

    if(unit.getType()=="Villager"&&this.terrain[pos.x][pos.y].getBuilding().length>0){
      options.push("Build");
    }
    return options.concat(["Undo Move","Done"])
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

        noSmooth()
        push();
            imageMode(CENTER)
            translate((x+0.25)*zoom,(y+0.25)*zoom)
            rotate(radians(-45))
            scale(1,1.6)
            /*
        switch(this.terrain[x][y][1]){
          case "Wheat":
            image(onTerrainImgs.filter(x=>x[0]=="Wheat")[0][1],0,0,zoom,zoom)
          break;
          case "Gold":
            let img = onTerrainImgs.filter(x=>x[0]=="Gold")[0][1]
            image(img,0,0,zoom,zoom)
            fill(255,255,0);
          break;
        }
        */
        pop();

        
        if(this.buildings[x][y]!=null){
          this.buidlinngs[x][y].show(x,y);
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
      super(createVector(15,15),null,null,plainUnits(15,15),2);
    }
  
  }

}


function plainTerrain(length,height){
  let map = make2Darray(length,height);
  for(let y=0;y<height;y++){
    for(let x=0;x<length;x++){
      map[x][y] = ["Plains",];
      if(random(1)<0.03){
        map[x][y][1] = "Wheat"
      }else if(random(1)<0.02){
        map[x][y][1] = "Gold"
      }
    }
  }
  return map;
}

function plainUnits(length,height){
  let objects = make2Darray(length,height)
  objects[2][12] = new Infantry("Villager",1,"Blue");
  objects[2][13] = new Infantry("Milita",1,"Blue");
  objects[13][2] = new Infantry("Villager",2,"Red");
  objects[13][3] = new Infantry("Milita",2,"Red");
  return objects;
}

class Infantry{
  constructor(type,team,colour){
    this.type = type;
    this.team = team;
    this.img=unitImgs.filter(x=>x[0]==this.type+colour)[0][1];
    this.selected = false;
    this.movement = 7;
    this.range = 1;
  }
  getType(){
    return this.type;
  }
  getTeam(){
    return this.team;
  }
  getMovement(){
    return this.movement;
  }
  getRange(){
    return this.range;
  }

  select(){
    this.selected = true;
  }
  deselect(){
    this.selected = false;
  }

  show(x,y){
    if(this.selected){
      strokeWeight(0)
      fill(255,255,0,180);
      rect(x*zoom,y*zoom,zoom,zoom)
    }
    noSmooth()
    push();
        imageMode(CENTER)
        translate(x*zoom,y*zoom)
        rotate(radians(-45))
        scale(1,2)
        
    switch(this.type){
      case "Villager":
        image(this.img,0,0,zoom,zoom);
        break;
      case "Milita":
        image(this.img,0,0,zoom,zoom);
        break;
    }
    pop();


  }
}

class Cavalry{

}