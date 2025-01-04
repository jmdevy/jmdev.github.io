import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Constants
const ballMass = 0.0459;                             // [kg]
const gravityAccelVec = new THREE.Vector3(0.0, -9.81, 0.0); // [m/s^2]
const airDensity = 1.225;                              // [kg/m^3]
const ballRadius = 0.02135;                            // [m]
const ballCrossArea = Math.PI * Math.pow(ballRadius, 2);  // [m^2]
const ballDragCoef = 0.23;

// Initial values
let ballVelVec = new THREE.Vector3(108 * Math.cos(0.707), 108 * Math.sin(0.707), 0);   // [m/s]
let ballAngularVelVec = new THREE.Vector3(100.0, 1000.0, 0.0);                                // [rad/s]
let windVel = new THREE.Vector3(10, 0, 0);                                          // [m/s]

function gravityForce() {
    let gravityForceVec = gravityAccelVec.clone();
    gravityForceVec.multiplyScalar(ballMass);
    return gravityForceVec;
}

function dragForce() {
    let ballVelUnitVec = ballVelVec.clone().normalize();
    let ballVelMag = ballVelVec.length();
    let dragForce = ballVelUnitVec.multiplyScalar((-1 / 2) * airDensity * ballCrossArea * ballDragCoef * Math.pow(ballVelMag, 2));
    return dragForce;
}

function magnusForce() {
    let ballVelMag = ballVelVec.length();
    let ballAngularVelMag = ballAngularVelVec.length();
    let ballLiftCoef = -0.05 + Math.sqrt(0.0025 + 0.036 * ((ballRadius * ballAngularVelMag) / ballVelMag));

    let ballVelUnitVec = ballVelVec.clone().normalize();
    let ballAngularVelUnitVec = ballAngularVelVec.clone().normalize();
    let magnusForce = ballAngularVelUnitVec.cross(ballVelUnitVec).multiplyScalar((1 / 2) * airDensity * ballCrossArea * ballLiftCoef * Math.pow(ballVelMag, 2));

    return magnusForce;
}

function calculateDeltaVBall() {
    let deltaVBall = gravityForce().add(dragForce()).add(magnusForce());
    deltaVBall.divideScalar(ballMass);
    return deltaVBall;
}

// Main renderer and scene
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(600, 600);
document.body.appendChild(renderer.domElement);

const mainCamera = new THREE.PerspectiveCamera(45, 600 / 600, 1, 5000);
mainCamera.position.set(-30, 20, 100);
mainCamera.lookAt(0, 0, 0);

const controls = new OrbitControls(mainCamera, renderer.domElement);

const mainScene = new THREE.Scene();
const gridHelper = new THREE.GridHelper(600, 600);
mainScene.add(gridHelper);

// Create line geometry
const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
const points = [];
let dt = 0.1;
let position = new THREE.Vector3(0, 0, 0);
points.push(position.clone());

for (let i = 0; i < 100; i++) {
    let dvdt = calculateDeltaVBall();
    dvdt.multiplyScalar(dt);
    ballVelVec.add(dvdt);

    let vel = ballVelVec.clone().sub(windVel).multiplyScalar(dt);
    position.add(vel);

    points.push(position.clone());
}

const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);
mainScene.add(line);

// Axes scene setup
const axesScene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(5); // Adjusted size for better visibility
axesScene.add(axesHelper);

const axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
axesCamera.position.set(2, 2, 2);
axesCamera.lookAt(axesHelper.position);

const axesControls = new OrbitControls(axesCamera, renderer.domElement);
axesControls.enableZoom = false;
axesControls.enablePan = false;

function render() {
    requestAnimationFrame(render);

    controls.update();
    axesControls.update();

    // Render the main scene
    renderer.setViewport(0, 0, 600, 600);
    renderer.clear();
    renderer.render(mainScene, mainCamera);

    // Disable auto clearing for the axes scene
    renderer.autoClear = false;

    // Render the axes scene in the top-right corner without clearing the background
    const insetWidth = 100;
    const insetHeight = 100;
    renderer.setViewport(490, 10, insetWidth, insetHeight);
    renderer.setScissor(490, 10, insetWidth, insetHeight);
    renderer.setScissorTest(true);
    renderer.render(axesScene, axesCamera);

    // Reset the viewport, scissor, and auto clearing
    renderer.setViewport(0, 0, 600, 600);
    renderer.setScissorTest(false);
    renderer.autoClear = true;
}


renderer.setAnimationLoop( render );