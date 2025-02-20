import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import simulate from './simulation.js';
import axesOverlayRender from './axes_overlay_scene.js';
import {MAX_POINT_COUNT, manageRendererSize} from "/assets/2024-12-21-Simulating-3D-Golf-Ball-Trajectory-The-Drive/common.js"

const simulationDiv = document.getElementById("simulationDiv");


// Main renderer and scene
const renderer = new THREE.WebGLRenderer();
simulationDiv.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, 1, 1, 5000);
camera.position.set(-30, 100, 325);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);

const mainScene = new THREE.Scene();
const gridHelper = new THREE.GridHelper(600, 600);
mainScene.add(gridHelper);

const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(MAX_POINT_COUNT * 3); // 3 floats (x, y and z) per point
geometry.setAttribute('position', new THREE.BufferAttribute( positions, 3 ));
const material = new THREE.LineBasicMaterial( { color: 0x00ff00 } );
const line = new THREE.Line(geometry, material);
mainScene.add(line);

function simulationValueUpdated(){
    let vball0x = Number(document.getElementById("vball0x").value);
    let vball0y = Number(document.getElementById("vball0y").value);
    let vball0z = Number(document.getElementById("vball0z").value);

    let wball0x = Number(document.getElementById("wball0x").value);
    let wball0y = Number(document.getElementById("wball0y").value);
    let wball0z = Number(document.getElementById("wball0z").value);

    let wx = Number(document.getElementById("wx").value);
    let wy = Number(document.getElementById("wy").value);
    let wz = Number(document.getElementById("wz").value);


    const positionAttribute = line.geometry.getAttribute('position');
    const points = simulate(new THREE.Vector3(vball0x, vball0y, vball0z),
                            new THREE.Vector3(wball0x, wball0y, wball0z),
                            new THREE.Vector3(wx, wy, wz));

    for(let i=0; i<points.length; i++){
        positionAttribute.setXYZ(i, points[i].x, points[i].y, points[i].z);
    }

    line.geometry.setDrawRange(0, points.length);
    positionAttribute.needsUpdate = true; // required after the first render

    line.geometry.computeBoundingBox();
    line.geometry.computeBoundingSphere();
}

window.simulationValueUpdated = simulationValueUpdated;
simulationValueUpdated();



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