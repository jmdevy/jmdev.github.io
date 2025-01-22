import * as THREE from 'three';
import { CSS2DRenderer, CSS2DObject  } from 'three/addons/renderers/CSS2DRenderer.js';
import {manageRendererSize} from "/assets/2024-12-21-Simulating-3D-Golf-Ball-Trajectory-The-Drive/common.js"

// #1: Setup the scene/THREE.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);

const renderDiv = document.getElementById("axesDiv");

const renderer = new THREE.WebGLRenderer({alpha: true});
renderer.setClearColor(0x000000, 0);
renderDiv.appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
renderDiv.appendChild(labelRenderer.domElement);

camera.position.x = 1.5;
camera.position.y = 1.5;
camera.position.z = 1.5;

camera.lookAt(new THREE.Vector3(0.0, 0.0, 0.0));

// Add the axes to render
const axes = new THREE.AxesHelper(1.25);
scene.add(axes);

const xAxisLabelDiv = document.createElement( 'div' );
xAxisLabelDiv.className = 'label';
xAxisLabelDiv.textContent = 'X';
xAxisLabelDiv.style.backgroundColor = 'transparent';

const yAxisLabelDiv = document.createElement( 'div' );
yAxisLabelDiv.className = 'label';
yAxisLabelDiv.textContent = 'Y';
yAxisLabelDiv.style.backgroundColor = 'transparent';

const zAxisLabelDiv = document.createElement( 'div' );
zAxisLabelDiv.className = 'label';
zAxisLabelDiv.textContent = 'Z';
zAxisLabelDiv.style.backgroundColor = 'transparent';

const xAxisLabel = new CSS2DObject(xAxisLabelDiv);
xAxisLabel.position.set(1.325, 0, 0);
xAxisLabel.center.set(0.5, 0.5);
xAxisLabel.layers.set(0);

const yAxisLabel = new CSS2DObject(yAxisLabelDiv);
yAxisLabel.position.set(0, 1.325, 0);
yAxisLabel.center.set(0.5, 0.5);
yAxisLabel.layers.set(0);

const zAxisLabel = new CSS2DObject(zAxisLabelDiv);
zAxisLabel.position.set(0, 0, 1.325);
zAxisLabel.center.set(0.5, 0.5);
zAxisLabel.layers.set(0);

scene.add(xAxisLabel);
scene.add(yAxisLabel);
scene.add(zAxisLabel);

// Run render loop
function animate(){
    manageRendererSize(renderer,      camera, renderer.domElement, 500, 500);
    manageRendererSize(labelRenderer, camera, renderer.domElement, 500, 500);

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );