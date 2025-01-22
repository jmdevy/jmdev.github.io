import * as THREE from 'three';
import {manageRendererSize} from "/assets/2024-12-21-Simulating-3D-Golf-Ball-Trajectory-The-Drive/common.js"

// Axes scene setup
const axesScene = new THREE.Scene();
const axesHelper = new THREE.AxesHelper(3); // Adjusted size for better visibility
axesScene.add(axesHelper);

// Axes camera setup
const axesCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
axesCamera.position.set(2, 2, 2);
axesCamera.lookAt(axesHelper.position);


function handleCamera(mainCamera, controls){
    let mainCameraPosition = mainCamera.position.clone();
    mainCameraPosition.sub(controls.target);    // Remove pan translation
    mainCameraPosition.normalize();             // Remove zoom
    mainCameraPosition.multiplyScalar(5);       // Set rotation distance

    axesCamera.position.set(mainCameraPosition.x, mainCameraPosition.y, mainCameraPosition.z);
    axesCamera.rotation.set(mainCamera.rotation.x, mainCamera.rotation.y, mainCamera.rotation.z);
}


function handleRender(renderer){
    // Disable auto clearing for the axes scene
    renderer.autoClear = false;

    // Render the axes scene in the top-right corner without clearing the background
    const axesViewportDim = 100;
    const axesViewportMargin = 10;
    renderer.setViewport(axesViewportMargin, axesViewportMargin, axesViewportDim, axesViewportDim);
    renderer.setScissor(axesViewportMargin, axesViewportMargin, axesViewportDim, axesViewportDim);
    renderer.setScissorTest(true);
    renderer.render(axesScene, axesCamera);

    // Reset the viewport, scissor, and auto clearing
    renderer.setScissorTest(false);
    renderer.autoClear = true;
}


function axesOverlayRender(mainCamera, controls, renderer){
    handleCamera(mainCamera, controls);
    handleRender(renderer);
}

export default axesOverlayRender;