const MAX_POINT_COUNT = 1000;


function manageRendererSize(renderer, camera, childDivToMonitor, maxWidth, maxHeight){
    let parentDiv = childDivToMonitor.parentElement.parentElement;
    let parentWidth = parentDiv.offsetWidth;
    
    // If a max is `undefined`, return the below
    // respective values for that dimension
    let width = parentWidth;
    let height = width;
    // let height = window.innerHeight - 20;

    if(maxWidth != undefined && width > maxWidth){
        width = maxWidth;
    }

    if(maxHeight != undefined && height > maxHeight){
        height = maxHeight;
    }

    if(window.innerHeight - 20 < height){
        height = window.innerHeight - 20;
    }

    // renderer.setViewport(0, 0, width, height);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}


export {MAX_POINT_COUNT, manageRendererSize};