import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import simulate from './simulation.js';
import axesOverlayRender from './axes_overlay_scene.js';
import {manageRendererSize} from "/assets/2024-12-21-Simulating-3D-Golf-Ball-Trajectory/common.js"

const simulationDiv = document.getElementById("simulationDiv");


// Main renderer and scene
const renderer = new THREE.WebGLRenderer();
// renderer.setSize(VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
simulationDiv.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, 1, 1, 5000);
camera.position.set(-30, 20, 100);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);

const mainScene = new THREE.Scene();
const gridHelper = new THREE.GridHelper(600, 600);
mainScene.add(gridHelper);


const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
const geometry = new THREE.BufferGeometry().setFromPoints(simulate());
const line = new THREE.Line(geometry, material);
mainScene.add(line);


function render(){
    manageRendererSize(renderer, camera, renderer.domElement, undefined, 500);

    controls.update();

    // Render the main scene
    renderer.clear();
    renderer.render(mainScene, camera);

    // Render the axes helper scene overlay
    axesOverlayRender(camera, controls, renderer);
}


renderer.setAnimationLoop( render );