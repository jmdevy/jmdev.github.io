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
1. Download the libraries anywhere
2. Change two lines/paths in `libraries.h`
3. Run the one line command `gcc main.c && ./a.out` to compile and run this tutorial

No complicated build processes!

This tutorial is dedicated to showing you how to setup a C program that utilizes final_game_tech (FTB, just a cross platform library that handles drawing to a window) and CGLM (C version of the C++ math library GLM) plus a simple triangle rasterization routine to show triangles on screen.

I chose the above libraries since they are either cross platform or platform agnostic. I want this project to be as portable as possible so that it is easy to use in other languages. Both libraries are written such that the source is within the included headers, this means no extra linking! It just works!