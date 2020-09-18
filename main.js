let game;
let zoom = 60;
let cam;
let tile;
let selectedPos;
let offset;//Holds tile where camera is centred
let viewArea;//radius of view
let unitImgs = ['VillagerBlue','VillagerRed',"MilitaBlue","MilitaRed"];
let onTerrainImgs = ['Gold',"Wheat"]
let terrainImgs = ["Plains"]
let buildingImgs = ["TownCenterBlue","TownCenterRed","MillBlue","MillRed"];

let currentMenu = null;
let sidebar;
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
  for(let i=0;i<terrainImgs.length;i++){
    let terrain = terrainImgs[i];
    let img = loadImage('terrain/'+terrain+'.png');
    terrainImgs[i] = [terrain,img];
  }
  for(let i=0;i<buildingImgs.length;i++){
    let building = buildingImgs[i];
    let img = loadImage('buildings/'+building+'.png');
    buildingImgs[i] = [building,img];
  }
}

function setup() {
  createCanvas(1200, 800);
  viewArea = 0.3*(width+height)/2;
  sidebar = new sideBar(width,height);
  selectedPos = createVector(0,0)
  offset = createVector(0,0)
  tile = createVector(0,0);
  cam = createVector(0,0);
  game = new preMade(1);
}

function draw(){ 
  background(0);
  push();
  scale(2,1)
  translate(-cam.x-tile.x/2+width/4,-cam.y-tile.y+height/2-3*zoom/4)
  rotate(radians(45))
  game.draw(width,height);
  pop();
  ellipseMode(CENTER);
  ellipse(width/2,height/2,5,5)
  sidebar.show();
  if(currentMenu!=null){
    currentMenu.show();
  }

  controls();
}

function gotoTile(x,y){
  cam = createVector(0,0);
  tile = toScreen(x,y);
}


function mouseWheel(event){
  zoom-=0.01*event.delta;
}
let mouseDown = false;
let unitSelected = null;
function toGrid(x,y){//Does take camera into account
  let pos = createVector((x-0.5*width+(cam.x+tile.x/2)*2),(y-0.5*height+cam.y+tile.y))
  let c = sqrt(2)/zoom
  return createVector(round(c*(0.5*pos.y+0.25*pos.x)),round(c*(0.5*pos.y-0.25*pos.x)));
}
function toScreen(x,y){//If not affected by camera
  let c = zoom/sqrt(2);
  return pos = createVector(c*(2*x-2*y),c*(x+y))  
}
function controls(){
  if(mouseIsPressed){
    if(mouseDown==false){
      if(sidebar.click(mouseX,mouseY)==false){
        if(currentMenu==null){
          unitSelected = game.select(toGrid(mouseX,mouseY));
        }else{//In menu
          currentMenu.click(mouseX,mouseY);
        }
      }
      
      mouseDown=true;
    }
  
  }
  if(keyIsDown(87)){//w
    //cam.y=cam.y-2;
  }
  if(keyIsDown(65)){//a
    //cam.x=cam.x-2;
  }
  if(keyIsDown(83)){//s
    //cam.y=cam.y+2;
  }
  if(keyIsDown(68)){//d
    //cam.x=cam.x+2;
  }
}

function selectedCamDist(){
  let a = toScreen(selectedPos.x,selectedPos.y);
  let b = toScreen(offset.x,offset.y);
  return dist(a.x,a.y,b.x,b.y);
}


function keyPressed(){
  if(keyCode==32){//space
    unitSelected = game.select(selectedPos);
  }
  if(unitSelected==false){return;}

  if(keyCode==87&&selectedPos.y>0){//w
    selectedPos.add(createVector(0,-1))
    if(selectedCamDist()>viewArea){
      offset.add(createVector(0,-1));
      gotoTile(offset.x,offset.y);
    }
  }
  if(keyCode==65&&selectedPos.x>0){//a
    selectedPos.add(createVector(-1,0));
    if(selectedCamDist()>viewArea){
      offset.add(createVector(-1,0));
      gotoTile(offset.x,offset.y);
    }
  }
  if(keyCode==83&&selectedPos.y<game.getMapSize().y-1){//s
    selectedPos.add(createVector(0,1));
    if(selectedCamDist()>viewArea){
      offset.add(createVector(0,1));
      gotoTile(offset.x,offset.y);
    }
  }
  if(keyCode==68&&selectedPos.x<game.getMapSize().x-1){//d
    selectedPos.add(createVector(1,0))
    if(selectedCamDist()>viewArea){
      offset.add(createVector(1,0));
      gotoTile(offset.x,offset.y);
    }
  }

}

function keyReleased(){
  if(keyCode==32){
    if(unitSelected==false){
      game.deselect();
      unitSelected=null;
    }
  }
}

function mouseReleased(){
  if(unitSelected==false){
    game.deselect();
  }
  mouseDown = false;
}

const make2Darray = (cols,rows) => new Array(cols).fill().map(item =>(new Array(rows)))
const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);

