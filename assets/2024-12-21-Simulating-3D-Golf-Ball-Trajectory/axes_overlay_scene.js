import * as THREE from 'three';
import {VIEWPORT_WIDTH, VIEWPORT_HEIGHT, VIEWPORT_ASPECT_RATIO} from "/assets/2024-12-21-Simulating-3D-Golf-Ball-Trajectory/common.js"

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
    const insetWidth = 100;
    const insetHeight = 100;
    renderer.setViewport(VIEWPORT_WIDTH - insetWidth - 10, 10, insetWidth, insetHeight);
    renderer.setScissor(VIEWPORT_HEIGHT - insetHeight - 10, 10, insetWidth, insetHeight);
    renderer.setScissorTest(true);
    renderer.render(axesScene, axesCamera);

    // Reset the viewport, scissor, and auto clearing
    renderer.setViewport(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    renderer.setScissorTest(false);
    renderer.autoClear = true;
}


function axesOverlayRender(mainCamera, controls, renderer){
    handleCamera(mainCamera, controls);
    handleRender(renderer);
}

export default axesOverlayRender;