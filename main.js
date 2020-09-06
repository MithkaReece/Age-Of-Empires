let game;
let zoom = 10;
let cam;
function setup() {
  createCanvas(400, 400);

  cam = createVector(0,0);
  game = new Game(createVector(25,25));
}

function draw(){ 
  background(0);
  push();
  scale(2,1)
  translate(-cam.x+width/4,-cam.y+height/2-3*zoom/4)
  rotate(radians(45))
  translate(-zoom,0)
  //translate(-0.009*width,-0.009*height);
  game.draw(width,height);
  pop();
  ellipseMode(CENTER);
  ellipse(width/2,height/2,5,5)
  controls();
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


  constructor(mapSize){
    this.mapSize = mapSize;
    this.terrain = this.createTerrain(mapSize,1);
    console.log(this.terrain)
  }

  createTerrain(mapSize,type){
    let tileTypes = ["plains","forest","ocean","river","hills","mountains","ford","swamp","bridge"];
    let map = make2Darray(mapSize.x,mapSize.y);
    switch (type){
      case 1:
        for(let y=0;y<mapSize.y;y++){
          for(let x=0;x<mapSize.x;x++){
            map[x][y] = tileTypes[floor(random(tileTypes.length))];
          }
        }
        break;
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
  }

}

