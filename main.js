let game;
let zoom = 10;
let cam;
let tile;

let unitImgs = ['VillagerBlue','VillagerRed',"MilitaBlue","MilitaRed"];
function preload(){
  for(let i=0;i<unitImgs.length;i++){
    let unit = unitImgs[i];
    let img = loadImage('Units/'+unit+'.png');
    unitImgs[i] = [unit,img];
  }
}

function setup() {
  createCanvas(400, 400);
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
  controls();
}

function gotoTile(x,y){
  cam = createVector(0,0);
  tile = createVector(-x*zoom,-y*zoom);
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

  constructor(mapSize,terrain,objects,teams){
    this.mapSize = mapSize;
    if(terrain==null){
      this.terrain = this.randomTerrain(mapSize);
    }else{
      this.terrain = terrain;
    }
    if(objects==null){
      this.objects = [];
    }else{
      this.objects = objects;
    }
    this.teams = teams;
  }

  randomTerrain(mapSize){
    let tileTypes = ["plains","forest","ocean","river","hills","mountains","ford","swamp","bridge"];
    let map = make2Darray(mapSize.x,mapSize.y);
    for(let y=0;y<mapSize.y;y++){
      for(let x=0;x<mapSize.x;x++){
        map[x][y] = tileTypes[floor(random(tileTypes.length))];
      }
    }
    return map;
  }

  draw(width,height){
    for(let y=0;y<this.mapSize.y;y++){
      for(let x=0;x<this.mapSize.x;x++){
        switch(this.terrain[x][y]){
          case "plains":
            fill(0,255,0);
            break;
          case "forest":
            fill(0,255,100);
            break;
          case "ocean":
            fill(0,100,255);
            break;
          case "river":
            fill(0,0,255);
            break;
          case "hills":
            fill(0,200,0);
            break;
          case "mountains":
            fill(200,200,200);
            break;
          case "ford":
            fill(230,230,230);
            break;
          case "swamp":
            fill(40,50,200)
            break;
          case "bridge":
            fill(240,250,200)
            break;   
        }
        if(x==24){
          //console.log(this.terrain[x][y])
        }
        stroke(2);
        rectMode(CORNER);
        rect(x*zoom,y*zoom,zoom,zoom);
      }
    }
    for(let i=0;i<this.objects.length;i++){
      this.objects[i].show();
    }
  }

}

class preMade extends Game{
  constructor(preload){
    if(preload == 1){
      super(createVector(15,15),plainTerrain(15,15),plainObjects(),2);
    }
  
  }

}


function plainTerrain(length,height){
  let map = make2Darray(length,height);
  for(let y=0;y<height;y++){
    for(let x=0;x<length;x++){
      map[x][y] = "plains";
    }
  }
  return map;
}

function plainObjects(){
  let objects = [new Infantry("Villager",createVector(2,12),1,"Blue"),new Infantry("Milita",createVector(2,13),1,"Blue"),new Infantry("Villager",createVector(13,2),2,"Red"),new Infantry("Milita",createVector(13,3),2,"Red")];
  return objects;
}

class Infantry{
  constructor(type,start,team,colour){
    this.type = type;
    this.pos = start;
    this.team = team;
    this.img=unitImgs.filter(x=>x[0]==this.type+colour)[0][1];
    console.log(this.img)
  }


  show(){
    switch(this.team){
      case 1:
        stroke(0,0,255);
      break;
      case 2:
        stroke(255,0,0);
      break;
    }

    noSmooth()
    switch(this.type){
      case "Villager":
        fill(0,50,105);
        push();
        imageMode(CENTER)
        translate(this.pos.x*zoom,this.pos.y*zoom)
        rotate(radians(-45))
        scale(1,2)
        image(this.img,0,0,zoom,zoom);
        pop();
        break;
      case "Milita":
        fill(255,70,30)
        push();
        imageMode(CENTER)
        translate(this.pos.x*zoom,this.pos.y*zoom)
        rotate(radians(-45))
        scale(1,2)
        image(this.img,0,0,zoom,zoom);
        pop();
        break;
    }
  }
}

class Cavalry{

}