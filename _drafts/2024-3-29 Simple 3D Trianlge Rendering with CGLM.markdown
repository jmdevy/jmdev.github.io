---
layout: post
title:  Simple 3D Triangle Rendering with CGLM
date:   2024-3-29 00:10:00 -0500
categories: jekyll update
---


## **Introduction**
Want to render triangles as simply as possible? You're in the right spot!

This tutorial is dedicated to showing you how to setup a C program that renders 3D models made of triangles and textures to a frame buffer, and then how to draw that frame buffer to any screen.

I'll cover what it takes to give the models position, rotation, and scale as well as giving the camera position, rotation, and clipping planes.


<br>


## **Background**
I've been programming in C/C++, Python, Lua, C#, Rust, JavaScript, and Java for 10+ years but somehow have never run into rendering points/triangles in 3D until now. There were times when I wanted to implement this but the resources were vague and hard to find, but nowadays that doesn't seem to be a problem - there's a lot of information on the topic now!

I also like giving any publicity to useful projects and libraries that had a lot of work put into them but probably aren't as widely used due to no tutorials or projects utilizing them. The libraries I discuss below don't have much information on them outside of their respective GitHub repositories.

It is expected that you are familiar with C to follow this tutorial.

<br>


## **The Libraries**
Don't worry! I chose libraries for spawning a window and math operations that are drag and drop! You'll only need to:
1. Download the libraries anywhere on your computer
2. Change two lines/paths in `libraries.h`
3. Run the one line command `gcc main.c -lm -DUSERNAME=me && ./a.out` to compile and run the code

No complicated build processes!

We'll be using two main libraries:
* [**final_game_tech**](https://github.com/f1nalspace/final_game_tech/tree/master){:target="_blank"}{:rel="noopener noreferrer"} (FPL, just a cross platform library that handles drawing to a window and inputs from the keyboard/mouse)
* [**CGLM**](https://github.com/recp/cglm){:target="_blank"}{:rel="noopener noreferrer"} (C version of the C++ math library GLM)

I chose these libraries since they are either cross platform or platform agnostic and are single header (no linking!). I want this project to be as portable as possible so that it is easy to use on other platforms.


<br>


## **Getting Started**

Chose which way you'd like to use this project:

#### **Path 1**: Following Along
If you want to follow this tutorial step by step, start with the following:
1. Make a folder somewhere on your computer to hold the contents we'll make in this project. For example make a folder called `simple_c_renderer` at `C:\Users\Me\Desktop\simple_c_renderer`
2. Inside the `simple_c_renderer` folder create a file called `main.c`. This is where all the code in this tutorial will go
3. We will add one more file for including the single header libraries. Create a file called `libraries.h` inside `simple_c_renderer` alongside `main.c`
4. [**Download FPL**](https://github.com/f1nalspace/final_game_tech/archive/refs/heads/master.zip){:target="_blank"}{:rel="noopener noreferrer"} then right click it and extract it to your Downloads folder. Name the extracted folder `final_game_tech`.
5. [**Download CGLM**](https://github.com/recp/cglm/archive/refs/heads/master.zip){:target="_blank"}{:rel="noopener noreferrer"} then right click it and extract it to your Downloads folder. Name the extracted folder `cglm`.

We'll just go ahead and leave the libraries in the Downloads folder. After the above steps you should have files and folders:

`C:\Users\Me\Desktop\simepl_c_renderer\main.c`

`C:\Users\Me\Desktop\simepl_c_renderer\libraries.h`

`C:\Users\Me\Downloads\final_game_tech`

`C:\Users\Me\Downloads\cglm`

Unless you just care about running the complete project, skip to the next section called **Continuing Along**

#### **Path 2**: Running The Complete Project
If you just want to run the project, do the following:
1. Setup a Linux environment, it's just easier. If you want to, and know how compile C programs for your platform, then it shouldn't be too difficult, otherwise, follow the next steps
2. If you're on Windows, then you can setup WSL or WSL2 to run GUI Linux programs, see [**this**](https://learn.microsoft.com/en-us/windows/wsl/install){:target="_blank"}{:rel="noopener noreferrer"}.
3. [**Download the project**](https://github.com/jmdevy/SimpleCRenderer/archive/refs/heads/master.zip){:target="_blank"}{:rel="noopener noreferrer"} then right click it and extract it to your Downloads folder. Name the extracted folder `SimpleCRenderer`.
4. [**Download FPL**](https://github.com/f1nalspace/final_game_tech/archive/refs/heads/master.zip){:target="_blank"}{:rel="noopener noreferrer"} then right click it and extract it to your Downloads folder. Name the extracted folder `final_game_tech`.
5. [**Download CGLM**](https://github.com/recp/cglm/archive/refs/heads/master.zip){:target="_blank"}{:rel="noopener noreferrer"} then right click it and extract it to your Downloads folder. Name the extracted folder `cglm`.
6. Inside `SimpleCRenderer/libraries.h` change the top two lines to the folder locations of the two downloaded libraries, for example:
```C
#define PATH_TO_CGLM                /mnt/c/Users/USERNAME/Downloads/cglm
#define PATH_TO_FINAL_GAME_TECH     /mnt/c/Users/USERNAME/Downloads/final_game_tech
```
7. In Linux/WSL navigate to `SimpleCRenderer` and execute `gcc main.c -lm -DUSERNAME=me && ./a.out` (make sure to change the username to the one on your computer) to build a binary `a.out` while linking to a common math library using `-lm` and then run the binary

That's it! A window should pop up and you should be able to move with WASD and the mouse.


<br>


## **Setting Up Libraries**
Now that the FPL and CGLM libraries are downloaded and we created our `libraries.h` file, lets include them into our program.

Open `libraries.h` in your favorite IDE or text editor. The first two lines we'll include are:
```C
#define PATH_TO_CGLM                /mnt/c/Users/USERNAME/Downloads/cglm
#define PATH_TO_FINAL_GAME_TECH     /mnt/c/Users/USERNAME/Downloads/final_game_tech
```
This will define some base paths to the two libraries. The `USERNAME` in the above paths is passed from gcc (our compiler) by using `gcc main.c -DUSERNAME=my_username` (you could just replace them with absolute paths if you want).

Next, we'll need some macros for combining these paths with paths inside the folders to specific library files:
```C
#define S(x) #x
#define STR(x) S(x)
```
You can read about how these exactly work [**here**](https://stackoverflow.com/questions/50728230/concatenating-preprocessor-definition-and-string-to-create-include-path){:target="_blank"}{:rel="noopener noreferrer"}.

#### **Including CGLM**
Define the following in `libraries.h`:
```C
#define CGLM_FULL_PATH_TO_CGLM STR(PATH_TO_CGLM/include/cglm/cglm.h)
#define CGLM_FULL_PATH_TO_VEC3 STR(PATH_TO_CGLM/include/cglm/vec3.h)
#define CGLM_FULL_PATH_TO_VEC4 STR(PATH_TO_CGLM/include/cglm/vec4.h)
#define CGLM_FULL_PATH_TO_MAT4 STR(PATH_TO_CGLM/include/cglm/mat4.h)
#define CGLM_FULL_PATH_TO_CAM  STR(PATH_TO_CGLM/include/cglm/cam.h)
```
We'll need these for the library itself, positions, viewports, view & projections matrices, and the camera.

#### **Including final_game_tech**
Finally, add this to finish including everything we need to start programming!
```C
#define FPL_IMPLEMENTATION                      // Required to include the library
#define FPL_NO_AUDIO                            // Disable audio, do not need it
#define FPL_NO_VIDEO_VULKAN                     // Disable Vulkan, we're creating a software renderer
#define FPL_NO_VIDEO_OPENGL                     // Disable OpenGL, we're creating a software renderer
#define FPL__ENABLE_VIDEO_SOFTWARE              // Enable for OS windows
#define __USE_LARGEFILE64                       // Required, https://stackoverflow.com/a/45351963
// #define FPL__ENABLE_LOGGING                  // Enable logging
// #define FPL__ENABLE_LOG_MULTIPLE_WRITERS     // Enable logging

// Finally define the full path to the header
#define FLM_FULL_PATH_TO_IMPL STR(PATH_TO_FINAL_GAME_TECH/final_platform_layer.h)

// Actually include the paths we built using the preprocessor
#include CGLM_FULL_PATH_TO_CGLM
#include CGLM_FULL_PATH_TO_VEC3
#include CGLM_FULL_PATH_TO_VEC4
#include CGLM_FULL_PATH_TO_MAT4
#include CGLM_FULL_PATH_TO_CAM

#include FLM_FULL_PATH_TO_IMPL
```


<br>


## **Let's Code! Part #1: Opening a Window**
Again, we're using [**final_game_tech**](https://github.com/f1nalspace/final_game_tech){:target="_blank"}{:rel="noopener noreferrer"} libraries to handle OS level peripherals like windows and keyboard/mouse input. First we need to start the library and get the main loop rolling:

```C
void loop(){
    while(fplWindowUpdate()){
        
    }
}


int main(int argc, char **argv){
    // Start the final_game_tech platform library and end if it fails
    if(fplPlatformInit(fplInitFlags_All, fpl_null) == false){
        printf("ERROR: final_game_tech fpl library init failed! Enable logging in libraries.h!");
        return 1;
    }

    // Start the main game loop
    loop();

    // Stop the final_game_tech platform library
    fplPlatformRelease();

    return 0;
}
```

We created a `main` function for the entry point for our C program and called a couple of functions:
* [`fplPlatformInit(fplInitFlags_All, fpl_null)`](https://github.com/f1nalspace/final_game_tech/blob/7e0b312682267ed8e9b5dc76ebd0472b057f5357/final_platform_layer.h#L4135-L4143){:target="_blank"}: This initializes the platform library and takes flags indicating what we would like to enable as well as a settings structure that we leave `NULL`.
* `loop()`: This is our own function and will contain our main code for rendering and handling input provided by fpl.
* [`fplPlatformRelease()`](https://github.com/f1nalspace/final_game_tech/blob/7e0b312682267ed8e9b5dc76ebd0472b057f5357/final_platform_layer.h#L4150-L4155){:target="_blank"}: Releases anything allocated by fpl

Running the above code using `gcc main.c -lm -DUSERNAME=me && ./a.out` should show a window:
<center>
<img stroke="blue" width="45%" src="/assets/2024-3-29-Simple-3D-Triangle-Rendering-with-CGLM/first_window.png" alt="first_window"/>
<p class="center"><i>Figure 1: First Window</i></p>
</center>


<br>


## **Part #2: Drawing Pixels**
Obviously an empty window is not very interesting, we need to be able to draw to it. Let's add two lines to the `loop()` function:

```C
void loop(){
    while(fplWindowUpdate()){
        fplVideoBackBuffer *backBuffer = fplGetVideoBackBuffer();

        fplVideoFlip();
    }
}
```

The [`fplGetVideoBackBuffer()`](https://github.com/f1nalspace/final_game_tech/blob/7e0b312682267ed8e9b5dc76ebd0472b057f5357/final_platform_layer.h#L6720-L6725){:target="_blank"} function fetches the buffer that we are allowed to draw to. The other pixel buffer (the front) is the one being sent out to the screen while we draw to this back buffer (this is called double buffering and is a simple optimization). [`fplVideoFlip()`](https://github.com/f1nalspace/final_game_tech/blob/7e0b312682267ed8e9b5dc76ebd0472b057f5357/final_platform_layer.h#L6734-L6737){:target="_blank"} puts the back buffer that we just drew to in the front buffer's spot and vice versa (just a simple swap).

Running that won't actually draw anything, it's all just preparation. Let's make a new general function <ins>above</ins> `loop()` called `draw_pixel()`:

```C
void drawPixel(fplVideoBackBuffer *buffer, int32_t x, int32_t y, uint32_t color){
    
}
```

Before I fill in this function, let me explain the parameters:
1. `fplVideoBackBuffer *buffer`: Whenever we want to draw a pixel we'll need to pass a pointer to the area in memory where all the pixels we can draw to live currently.
2. `int32_t x`: The is an absolute x-axis coordinate, meaning that it may or may not be within the bounds of the `buffer` size.
3. `int32_t y`: Obviously just the other component for the pixel position that we're drawing
4. `uint32_t color`: The color of the pixel we're drawing. The pixel color format for flp is [`0xAABBGGRR`](https://github.com/f1nalspace/final_game_tech/blob/7e0b312682267ed8e9b5dc76ebd0472b057f5357/final_platform_layer.h#L6600){:target="_blank"}

Knowing all of that the `drawPixel()` function becomes:

```C
// Checks that pixel is in the bounds of `buffer` then copies `color` to the pixel buffer
void drawPixel(fplVideoBackBuffer *buffer, int32_t x, int32_t y, uint32_t color){
    if((x >= 0 && x<buffer->width) && (y >= 0 && y<buffer->height)){
        // Now that we know the x and y are within the screen,
        // find the 1D index by building up how many rows of
        // pixels it will be due to the `y` and then add `x`
        uint32_t pixel_index = y * buffer->width + x;
        buffer->pixels[pixel_index] = color;
    }
}
```

Now we can draw a pixel!

```C
void loop(){
    while(fplWindowUpdate()){
        fplVideoBackBuffer *backBuffer = fplGetVideoBackBuffer();
        drawPixel(backBuffer, backBuffer->width/2, backBuffer->height/2, 0xffffff);
        fplVideoFlip();
    }
}
```

<center>
<img stroke="blue" width="45%" src="/assets/2024-3-29-Simple-3D-Triangle-Rendering-with-CGLM/first_pixel.png" alt="first_pixel"/>
<p class="center"><i>Figure 2: First Pixel</i></p>
</center>


<br>


## **Part #3: Drawing Lines**
Single pixels are fun but lines are even cooler! We'll do this before triangles since this allows us to draw everything in a wire frame mode. Because this is just for wire frame we'll use the complicated sounding [**Digital Differential Analyzer**](https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm)){:target="_blank"} algorithm (an alternative is [**Bresenham Line Algorithm**](https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm){:target="_blank"} but we're not going for perfection here):

```C
// Use DDA to draw a quick line between two points
void drawLine(fplVideoBackBuffer *buffer, float x_start, float y_start, float x_end, float y_end, uint32_t color){
    // Figure out how far on the X and Y axes we'll
    // need to traverse while drawing, in total
    float dx = x_end - x_start;
    float dy = y_end - y_start;

    // Figure out which axis has the biggest difference
    // and use that as the 'good enough' number of times
    // we'll need to draw pixels to 'complete' the line
    float step_total = 0.0f;
    if(fabsf(dx) >= fabsf(dy)){
        step_total = fabsf(dx);
    }else{
        step_total = fabsf(dy);
    }

    // Calculate how big the steps on each axis
    // will need to be to 'complete' the line when
    // 'step_total' number of pixels are drawn
    float step_x = dx / step_total;
    float step_y = dy / step_total;

    // Define coordinate values that will be stepped
    // about the line. Start at initial point
    float x = x_start;
    float y = y_start;

    // Define values for tracking how many steps
    // we've done and how many total we need
    uint32_t step_index = 0;
    const uint32_t step_end = (uint32_t)step_total;

    // Step the coordinate `x` and `y` by
    // `step_x` and `step_y` for `step_end`
    // times and draw pixels
    while(step_index <= step_end){
        x += step_x;
        y += step_y;
        drawPixel(buffer, (int32_t)x, (int32_t)y, color);
        step_index++;
    }
}
```

Now we can draw a line with:

```C
void loop(){
    while(fplWindowUpdate()){
        fplVideoBackBuffer *backBuffer = fplGetVideoBackBuffer();

        float x_start = backBuffer->width/2 - backBuffer->width/4;
        float y_start = backBuffer->height/2 - backBuffer->height/4;

        float x_end = backBuffer->width/2 + backBuffer->width/4;
        float y_end = backBuffer->height/2 + backBuffer->height/4;

        drawLine(backBuffer, x_start, y_start, x_end, y_end, 0xffffff);
        fplVideoFlip();
    }
}
```

<center>
<img stroke="blue" width="45%" src="/assets/2024-3-29-Simple-3D-Triangle-Rendering-with-CGLM/first_line.png" alt="first_line"/>
<p class="center"><i>Figure 3: First Line</i></p>
</center>


<br>


## **Part #4: Setting Up the Camera**
In the global space of `main.c` we'll define some `vec3` variables to define the coordinate system as well as where we are and where we're looking:

```C
// The position of the camera in space
vec3 camera_pos = {0.0f, 0.0f, 0.0f};

// The position that we're looking at in space
vec3 target_pos = {0.0f, 0.0f, 0.0f};

// The normalized direction for UP in space
vec3 world_up = {0.0f, 1.0f, 0.0f};
```

Now comes the hard part, transformation and perspective. Instead of going over this topic, as has been done many many times on the internet, I'll refer you to this great book on [**Computer Graphics from Scratch**](https://gabrielgambetta.com/computer-graphics-from-scratch/09-perspective-projection.html){:target="_blank"}. Essentially, everything in our world, cameras and objects, will need a 4x4 matrix to represent their scale, rotation, and transformation. After everything is transformed around in 3D space, we'll also need more matrices to take points from 3D to 2D since our screens our 2D.

This is where the camera comes into play. The camera has a viewport, matrix for representing where we're looking, and a matrix for representing the projection with a FOV, near, and far plane. We'll define all of this in global `main.c` space:

```C
// Camera viewport
vec4 v_viewport = GLM_VEC4_ZERO_INIT;

// Represents where we're looking
mat4 m_view = GLM_MAT4_ZERO_INIT;

// Represents the projection of where we're looking
mat4 m_projection = GLM_MAT4_ZERO_INIT;
```

We'll also need to setup the viewport `vec4` and perspective projection matrix by adding some code to `main.c`:

```C
// Get the window size so we can size the viewport correctly
fplWindowSize window_size;
fplGetWindowSize(&window_size);

// Specify the position of the viewport in terms of our
// screen's top-left. Top-left on our screen is 0,0 so
// we'll put the viewport there. Also make the viewport
// the same size as the fpl window
v_viewport[0] = 0.0f;
v_viewport[1] = 0.0f;
v_viewport[2] = window_size.width;
v_viewport[3] = window_size.height;

// Setup the perspective projection matrix
// With FOV of 90 degrees, aspect ratio that
// matches the window, and near + far planes
// at 0.1 and 1000.0 respectively
glm_perspective(M_PI/2.0f, window_size.width/window_size.height, 0.1f, 1000.0f, m_projection);
```


<br>


## **Part #5: Moving the Camera**
Let's make a new function that will handle moving the camera's position and rotation:

```C
void handle_movement(){
    // Structure to hold event data for poll
    fplEvent event;

    // While there are events to handle, handle them
    while(fplPollEvent(&event)){
        // Figure out what type of event this is and then handle it from there
        if(event.type == fplEventType_Mouse){
            mouse_movement(&event);
        }else if(fplEventType_Keyboard){
            keyboard_movement(&event);
        }
    }
}
```

There are two other functions in there that we'll have to define:

```C
void keyboard_movement(fplEvent *event){
    switch(event->keyboard.keyCode){
        case 'w': { camera_pos[0] += 1.5f; } break;
        case 's': { camera_pos[0] -= 1.5f; } break;
        case 'a': { camera_pos[2] += 1.5f; } break;
        case 'd': { camera_pos[2] -= 1.5f; } break;
    }
}
```