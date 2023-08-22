let game;
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
  loadAssets();
}
// Load assets
function loadAssets(){
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
  //cam = createVector(0,0);
  cam = new Camera(0,0);
  game = new preMade(1);
}

function draw(){ 
  background(0);

  
  push();
  cam.transform(tile);
  //scale(2,1)
  //translate(-cam.x-tile.x/2+width/4,-cam.y-tile.y+height/2-3*zoom/4)
  //rotate(radians(45))
  game.show(cam.zoom);
  pop();

  ellipseMode(CENTER);
  ellipse(width/2,height/2,5,5)
  game.showResources();
  sidebar.show();
  if(currentMenu!=null){
    currentMenu.show();
  }

  controls();
}

function gotoTile(x,y){
  tile = toScreen(x,y);
}


function mouseWheel(event){
  //cam.addZoom(-0.01*event.delta);
}
let mouseDown = false;
let unitSelected = null;
function toScreen(x,y){//If not affected by camera
  let c = cam.zoom/sqrt(2);
  return pos = createVector(c*(2*x-2*y),c*(x+y))  
}
function controls(){
  if(!mouseIsPressed || mouseDown==true)
    return;

  if(sidebar.click(mouseX,mouseY)==false){
    if(currentMenu==null){ //Not in menu
      unitSelected = game.select(cam.windowToLevel(tile, mouseX, mouseY));
    }else{//In menu
      currentMenu.mouseClick(mouseX,mouseY);
    }
  }
  mouseDown=true;
    
  
}

function selectedCamDist(){
  let a = toScreen(selectedPos.x,selectedPos.y);
  let b = toScreen(offset.x,offset.y);
  return dist(a.x,a.y,b.x,b.y);
}


function keyPressed(){
  switch(key.toLowerCase()) {
    case ' ':
      currentMenu==null ? unitSelected = game.select(selectedPos) :
      currentMenu.clickOption(currentMenu.getSelectedIndex());
      break;
    case 'w':
      if(selectedPos.y > 0 == false)
      break;

      currentMenu==null ? moveTileSelected(createVector(0,-1)) : currentMenu.move(-1) 
      break;
    case 'a':
      if(selectedPos.x > 0 == false)
        break;

      game.getCastleWonder()!=null ? game.rotateCastleWonder(1) : 
          currentMenu==null ? moveTileSelected(createVector(-1,0)) : null 

      break;
    case 's':
      if(selectedPos.y<game.getMapSize().y-1 == false)
        break;

      currentMenu==null ? moveTileSelected(createVector(0,1)) : currentMenu.move(1)
      break;
    case 'd':
      if(selectedPos.x<game.getMapSize().x-1 == false)
        break;

      game.getCastleWonder()!=null ? game.rotateCastleWonder(-1) :
        currentMenu==null ? moveTileSelected(createVector(1,0)) : null
      break;  
  }

  if(keyCode==13){//Enter
    game.endDay();
  }

}

function moveTileSelected(vector){
  selectedPos.add(vector);
  if(selectedCamDist()>viewArea){
    offset.add(vector);
    gotoTile(offset.x,offset.y);
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

function mouseMoved(){
  if(currentMenu!=null){currentMenu.mouseOver(mouseX,mouseY)}
}

function mouseReleased(){
  if(unitSelected==false){
    game.deselect();
  }
  mouseDown = false;
}

const make2Darray = (cols,rows) => new Array(cols).fill().map(item =>(new Array(rows)))
const clone = (items) => items.map(item => Array.isArray(item) ? clone(item) : item);

