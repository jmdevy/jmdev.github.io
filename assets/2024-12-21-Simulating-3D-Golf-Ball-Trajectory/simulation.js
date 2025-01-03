import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const ballMass        = 0.0459;                             // [kg]
const gravityAccelVec = new THREE.Vector3(0.0, -9.81, 0.0); // [m/s^2]
const airDensity      = 1.225;                              // [kg/m^3]
const ballRadius      = 0.02135;                            // [m]
const ballCrossArea   = Math.PI * Math.pow(ballRadius, 2);  // [m^2]
const ballDragCoef    = 0.23;

// Come up with some initial values
// const ballVelVec          = new THREE.Vector3(1000.707, 1000.707, 1000.707);   // [m/s]
let ballVelVec          = new THREE.Vector3(108 * Math.cos(0.707), 108 * Math.sin(0.707), 0);   // [m/s]
let ballAngularVelVec   = new THREE.Vector3(100.0, 1000.0, 0.0);         // [rad/s]
let windVel             = new THREE.Vector3(10 * Math.cos(0.707), 10 * Math.cos(0.707), 10 * Math.cos(0.707));


function gravityForce(){
    let gravityForceVec = gravityAccelVec.clone();
    gravityForceVec.multiplyScalar(ballMass);

    return gravityForceVec;
}


function dragForce(){
    let ballVelUnitVec = ballVelVec.clone();
    ballVelUnitVec.normalize();

    let ballVelMag = ballVelVec.length();

    let dragForce = ballVelUnitVec.multiplyScalar((-1/2) * airDensity * ballCrossArea * ballDragCoef * Math.pow(ballVelMag, 2));

    return dragForce;
}


function magnusForce(){
    let ballVelMag = ballVelVec.length();
    let ballAngularVelMag = ballAngularVelVec.length();
    let ballLiftCoef = -0.05 + Math.sqrt(0.0025 + 0.036 * ((ballRadius * ballAngularVelMag) / ballVelMag));


    let ballVelUnitVec = ballVelVec.clone();
    ballVelUnitVec.normalize();

    let ballAngularVelUnitVec = ballAngularVelVec.clone();
    ballAngularVelUnitVec.normalize();

    let magnusForce = ballAngularVelUnitVec.cross(ballVelUnitVec).multiplyScalar(((1/2) * airDensity * ballCrossArea * ballLiftCoef * Math.pow(ballVelMag, 2)));

    return magnusForce;
}


function calculateDeltaVBall(){
    let deltaVBall = gravityForce().add(dragForce()).add(magnusForce());
    deltaVBall.divideScalar(ballMass);
    return deltaVBall;
}


const renderer = new THREE.WebGLRenderer();
renderer.setSize(700, 700);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, 700 / 700, 1, 5000);
camera.position.set(-30, 20, 100);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls( camera, renderer.domElement );

controls.update();



const scene = new THREE.Scene();

const gridHelper = new THREE.GridHelper(600, 600);
scene.add(gridHelper);

//create a blue LineBasicMaterial
const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

const points = [];

let dt = 0.1;
let t = 0
let position = new THREE.Vector3(0, 0, 0);
points.push(position.clone());

for(let i=0; i<80; i++){
    let dvdt = calculateDeltaVBall();
    dvdt.multiplyScalar(dt);
    ballVelVec.add(dvdt);


    let vel = ballVelVec.clone();
    let wvel = windVel.clone();
    
    vel.sub(wvel)
    vel.multiplyScalar(dt);

    position.add(vel);

    points.push(position.clone());

    t += dt;
}

const geometry = new THREE.BufferGeometry().setFromPoints(points);

const line = new THREE.Line(geometry, material);

scene.add(line);

function animate() {

	requestAnimationFrame( animate );

	controls.update();

	renderer.render( scene, camera );

}

animate();