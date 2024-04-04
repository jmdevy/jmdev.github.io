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


## **Background**
I've been programming in C/C++, Python, Lua, C#, Rust, JavaScript, and Java for 10+ years but somehow have never run into rendering points/triangles in 3D until now. There were times when I wanted to implement this but the resources were vague and hard to find, but nowadays that doesn't seem to be a problem - there's a lot of information on the topic now!

I also like giving any publicity to useful projects and libraries that had a lot of work put into them but probably aren't as widely used due to no tutorials or projects utilizing them. The libraries I discuss below don't have much information on them outside of their respective GitHub repositories.


## **The Libraries**
Don't worry! I chose libraries for spawning a window and math operations that are drag and drop! You'll only need to:
1. Download the libraries anywhere on your computer
2. Change two lines/paths in `libraries.h`
3. Run the one line command `gcc main.c -lm && ./a.out` to compile and run the code

No complicated build processes!

We'll be using two main libraries:
* [**final_game_tech**](https://github.com/f1nalspace/final_game_tech/tree/master){:target="_blank"}{:rel="noopener noreferrer"} (FTB, just a cross platform library that handles drawing to a window)
* [**CGLM**](https://github.com/recp/cglm){:target="_blank"}{:rel="noopener noreferrer"} (C version of the C++ math library GLM)

I chose these libraries since they are either cross platform or platform agnostic and are single header (no linking!). I want this project to be as portable as possible so that it is easy to use on other platforms.


## **Getting Started**

Chose which way you'd like to use this project:

#### **Path 1**: Following Along
If you want to follow this tutorial step by step, start with the following:
1. Make a folder somewhere on your computer to hold the contents we'll make in this project. For example make a folder called `simple_c_renderer` at `C:\Users\Me\Desktop\simple_c_renderer`
2. Inside the `simple_c_renderer` folder create a file called `main.c`. This is where all the code in this tutorial will go
3. We will add one more file for including the single header libraries. Create a file called `libraries.h` inside `simple_c_renderer` alongside `main.c`
4. [**Download FTB**](https://github.com/f1nalspace/final_game_tech/archive/refs/heads/master.zip){:target="_blank"}{:rel="noopener noreferrer"} then right click it and extract it to your Downloads folder. Name the extracted folder `final_game_tech`.
5. [**Download CGLM**](https://github.com/recp/cglm/archive/refs/heads/master.zip){:target="_blank"}{:rel="noopener noreferrer"} then right click it and extract it to your Downloads folder. Name the extracted folder `cglm`.

We'll just go ahead and leave the libraries in the Downloads folder. After the above steps you should have files and folders like:

`C:\Users\Me\Desktop\simepl_c_renderer\main.c`

`C:\Users\Me\Desktop\simepl_c_renderer\libraries.h`

`C:\Users\Me\Downloads\final_game_tech`

`C:\Users\Me\Downloads\cglm`

Unless you just care about running the complete project, skip to the next section called **Continuing Along**

#### **Path 2**: Running The Complete Project
If you just want to run the project, do the following:
1. Setup a Linux environment, it's just easier. If you want to or know how compile C programs for your platform then this won't be too difficult, otherwise, follow the next steps
2. If you're on Windows, then you can setup WSL or WSL2 to run GUI Linux programs, see [**this**](https://learn.microsoft.com/en-us/windows/wsl/install){:target="_blank"}{:rel="noopener noreferrer"}.
3. [**Download the project**](https://github.com/jmdevy/SimpleCRenderer/archive/refs/heads/master.zip){:target="_blank"}{:rel="noopener noreferrer"} then right click it and extract it to your Downloads folder. Name the extracted folder `SimpleCRenderer`.
4. [**Download FTB**](https://github.com/f1nalspace/final_game_tech/archive/refs/heads/master.zip){:target="_blank"}{:rel="noopener noreferrer"} then right click it and extract it to your Downloads folder. Name the extracted folder `final_game_tech`.
5. [**Download CGLM**](https://github.com/recp/cglm/archive/refs/heads/master.zip){:target="_blank"}{:rel="noopener noreferrer"} then right click it and extract it to your Downloads folder. Name the extracted folder `cglm`.
6. Inside `SimpleCRenderer/libraries.h` change teh top two lines to teh folder locations of the two downloaded libraries, for example:
```C
#define PATH_TO_CGLM                /mnt/c/Users/Me/Downloads/cglm
#define PATH_TO_FINAL_GAME_TECH     /mnt/c/Users/Me/Downloads/final_game_tech
```
7. In Linux/WSL navigate to `SimpleCRenderer` and execute `gcc main.c -lm && ./a.out` to build a binary `a.out` while linking to common math libraries using `-lm` and then run the binary

That's it! A window should pop up and you should be able to move with WASD and the mouse.

## **Continuing Along**

