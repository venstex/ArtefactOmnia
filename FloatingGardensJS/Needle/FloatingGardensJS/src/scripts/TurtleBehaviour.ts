import { Behaviour, euler, GameObject, getComponent, getWorldPosition, getWorldQuaternion, getWorldRotation, PointerEventData, Renderer, serializable, setWorldPosition, setWorldQuaternion, setWorldRotation } from "@needle-tools/engine";
import { debug } from "@needle-tools/engine/lib/engine-components/ReflectionProbe";
import { transform } from "lodash";
import { Object3D,Line,BufferGeometry,BufferAttribute,Float32BufferAttribute, Vector3, LineBasicMaterial, Material,MeshBasicMaterial, Mesh, Scene, BoxGeometry, CapsuleGeometry, TubeGeometry, ConeGeometry, RingGeometry, LatheGeometry, MeshToonMaterial, ShaderMaterial, ShadowMaterial, CylinderGeometry, Cylindrical, Euler, Quaternion, MeshLambertMaterial, DoubleSide, TorusGeometry, SphereGeometry } from "three"
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { Rotate } from "./Rotate";
import { string, vec3 } from "three/examples/jsm/nodes/shadernode/ShaderNode";

let distance: number = 0.04;
let heading: number = (89/2) * (Math.PI/180);
// let heading: number = (60) * (Math.PI/180);
let generations: number;
let iteration = 0;
let char = '';
let axiom: string;
let rulep0: string;
let rulep1: string;
let rulep2: string;
let rulep3: string;
let lindenmayer: string ='';
let worldPosition: Vector3 = new Vector3(0,0,0);
let worldRotation: Vector3 = new Vector3(0,0,0);
let turtle: Object3D;
let scene: Scene;
const savedPosition: Vector3[] = [];
const saveRotation: Vector3[] = [];
let drawing: boolean;

export class TurtleBehaviourTs extends Behaviour {
  // @serializable(Object3D)
  // generations: number = 3;
  // iteration: number = 0;
  // length: number = 0.1;
  // axiom: string ='F';
  // rulep0: string ='F>F';
  // rulep1: string ='F>F';
  // rulep2: string ='F>F';
  // lindenmayer: string ='F';
  // // worldPosition: Vector3 = Vector3(0,0,0);
  // // worldRotation: Quaternion = new Quaternion();
  // turtle: Object3D = this.gameObject;
  // offspring: boolean = false;
  // savedPosition: Vector3[] = [];
  // saveRotation: Vector3[] = [];
  // drawing: boolean = false;
  
    start() {
        SetAxiomRules();
        lindenmayer = Production();

        scene = this.scene;
        turtle = this.gameObject;
        worldPosition = getWorldPosition(turtle).clone();
        worldRotation = getWorldRotation(turtle).clone();
        
        console.log(lindenmayer);
        drawing = true;
        
      }
    //   update() {
    //     while(drawing){
    //         ReadLindenmayer();
    //     }

    // }
  }
  
  setInterval(ReadLindenmayer, 20)

// function SetAxiomRulesTree1(){
//   axiom = 'FX';
//   rulep0 = 'X>@A[[@@++AP]F-AX]+BX'
//   rulep1 = 'P>-S--S'
//   rulep2 = 'S>SAS--SAS'
//   rulep3 = 'A>FA'
//   generations = 5;
// }

// function SetAxiomRules(){
//   // axiom = 'S%%%##P%%%##S%%%##P';
//   // axiom = 'S&@+++P%#+++S';
//   axiom = 'A&@B&#A';
//   rulep0 = 'A>+BF-AFA-FB+'
//   rulep1 = 'B>-AF+BFB+FA-'
//   rulep2 = 'X>X'
//   rulep3 = 'C>C'
//   generations = 4;
// }

function SetAxiomRules(){
  axiom = 'PSX';
  rulep0 = 'X>@P[-PX]+PX'
  rulep1 = 'S>P'
  rulep2 = 'P>SS'
  rulep3 = 'C>C'
  generations = 6;
}


function Production(){

    let _lindenmayer = axiom;
    let newLindenmayer = '';
    const rule0: string[] = rulep0.split('>');
    const rule1: string[] = rulep1.split('>');
    const rule2: string[] = rulep2.split('>');
    const rule3: string[] = rulep3.split('>');

    // console.log(generations);

    for (let i = 0; i < generations; i++) {


      for (let j = 0; j < _lindenmayer.length; j++) {
        if(_lindenmayer.charAt(j) == rule0[0]){
          newLindenmayer = newLindenmayer.concat(rule0[1]);
          // console.log('apply rule0:' + rule0 + ' Result:' + newLindenmayer);
          
        }else if (_lindenmayer.charAt(j) == rule1[0]){
          newLindenmayer = newLindenmayer.concat(rule1[1]);
          // console.log('apply rule1:' + rule1+ ' Result:' + newLindenmayer);
          
        }else if (_lindenmayer.charAt(j) == rule2[0]){
          newLindenmayer = newLindenmayer.concat(rule2[1]);
          // console.log('apply rule2:' + rule2+ ' Result:' + newLindenmayer);
        }else if (_lindenmayer.charAt(j) == rule3[0]){
          newLindenmayer = newLindenmayer.concat(rule3[1]);
          // console.log('apply rule3:' + rule3+ ' Result:' + newLindenmayer);  

        }else{
          newLindenmayer = newLindenmayer.concat(_lindenmayer.charAt(j));
          // console.log('No rule: ' + lindenmayer.charAt(j), newLindenmayer);
        }
      }
      _lindenmayer = newLindenmayer;
      newLindenmayer = '';
      // console.log("Produced Lindenmayer: " + newLindenmayer);
    } 
    return _lindenmayer;
  }  


function ReadLindenmayer(){
  
    let length = lindenmayer.length;
    // console.log('Currently loaded lindenmayer: ' + lindenmayer);
    // console.log('Length set: '+ length);
  
    
  if(iteration<length){
    worldPosition = getWorldPosition(turtle).clone();
    worldRotation = getWorldRotation(turtle).clone();
    
    char =lindenmayer.charAt(iteration);
    switch (char) {
      case 'A':
        DrawLine(0xD0E3CC);
        break;
      case 'B':
        DrawLine(0xDBA159);
        break;
      case 'F':
        DrawLine(0xFFF5FF);
        break;
      case 'S':
        DrawLine(0xF7FFDD);
        break;
      case 'P':
        DrawLine(0xFCFDAF);
        break;
      case 'X':
        DrawLine(0xEFD780);
        break;
      case '+':
        Turn(-heading);
        break;
      case '-':
        Turn(+heading);
        break;
      case '&':
        Pitch(+heading);
        break;
      case '%':
        Pitch(-heading);
        break;
      case '@':
        Roll(+heading);
        break;
      case '#':
        Roll(-heading);
        break;
      case '[':
        savedPosition.push(worldPosition);
        saveRotation.push(worldRotation);
        DrawSphere();
        break;
      case ']':
        const newposition: Vector3 = savedPosition.pop()!;
        const newrotation: Vector3 = saveRotation.pop()!;
        if (newposition.isVector3 && newrotation.isVector3) {
          // DrawSphere();
          DrawLathe();
          setWorldPosition(turtle,newposition);
          setWorldRotation(turtle,newrotation);
        }
        break;
      default:
        break;
    }
    iteration++;
    // console.log('Current iteration: ' + iteration);
  }else{
    drawing = false;
  }
}


function DrawLine(colour: number){
  
  const geometry = new BoxGeometry();
  const material = new MeshLambertMaterial({
      color: colour,
      opacity: 1,
      side: DoubleSide,
      transparent: true
      
    });

    const size = 1.4;

    geometry.scale(distance/size,distance,distance/size);
    geometry.translate(0,distance/size,0);
    const mesh = new Mesh(geometry, material);
    mesh.position.add(turtle.position);
    mesh.rotation.copy(turtle.rotation);
    mesh.rotateOnAxis(new Vector3(0,0,1),90*(Math.PI/180));
    mesh.rotateOnAxis(new Vector3(1,0,0),90*(Math.PI/180));
    scene.add(mesh);
    Move(distance);

    return;
  }

  

function DrawLathe(){
  const geometry = new LatheGeometry();
  const material = new MeshToonMaterial({
    color: 0xD9D9F3,
    opacity: 1,
    side: DoubleSide,
    transparent: true
  });

  const size = 0.5;
  geometry.scale(distance/size,distance/(size/2),distance/size);
  const mesh = new Mesh(geometry, material);
  mesh.position.add(turtle.position);
  mesh.rotation.copy(turtle.rotation);
  mesh.rotateOnAxis(new Vector3(0,0,1),90*(Math.PI/180));
  mesh.rotateOnAxis(new Vector3(1,0,0),90*(Math.PI/180));
  // mesh.translateOnAxis(new Vector3(0,1,0),distance*2);
  
  scene.add(mesh);
}

function DrawSphere(){
  const geometry = new SphereGeometry();
  const material = new MeshToonMaterial({
    color: 0xFFF5FF,
    opacity: 1,
    side: DoubleSide,
    transparent: true
  });

  const size = 1.5;
  geometry.scale(distance/size,distance/size,distance/size);
  const mesh = new Mesh(geometry, material);
  mesh.position.add(turtle.position);
  mesh.rotation.copy(turtle.rotation);
  
  scene.add(mesh);
}


function Turn(_heading){
  turtle.rotateOnAxis(new Vector3(0,1,0),_heading)
}


function Pitch(_heading){
  turtle.rotateOnAxis(new Vector3(1,0,0),-_heading)
}


function Roll(_heading){
  turtle.rotateOnAxis(new Vector3(0,0,1),_heading)
}


function Move(distance){
  turtle.translateOnAxis(new Vector3(0,0,1),distance)
}
