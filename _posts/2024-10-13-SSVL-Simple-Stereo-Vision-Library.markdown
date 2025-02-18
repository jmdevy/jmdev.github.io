---
layout: post
title:  SSVL - Simple Stereo Vision Library - DRAFT
date:   2025-2-18 00:10:00 -0500
categories: jekyll update
---

## **Introduction**
SSVL is my stereo vision library I made for learning. Given a field of view (FOV) or a focal length and an image from each camera at the same moment in time, the library will calculate a depth map. See the `README.md` [here](https://github.com/jmdevy/simple_stereo_vision_lib) on how to use the `C` library in your own project.

This article goes over the basics of camera, stereo depth calculations, and the library and how to use it.


<br>


## **How do physical and virtual cameras work?**
To understand how stereo depth calculations work when using two camera, we first need to understand how cameras work.

#### **Sensors**
As you likely know, at a high level, cameras take images and store them digitally as pixels. Those pixels are colors that come from **projected/focused** rays from geometry. In the physical world we live in, pixels/colors are captured by a sensor of a physical size. This can be thought of as a plane subdivided into a bunch of segments called pixels.

In a virtual environment, this segmented sensor plane also exists! However, usually we don't think of it as having dimensions, but we can assign dimensions to the virtual sensor plane if we want.

<br>
<div style="flex:1; display:flex; justify-content:space-evenly; align-items:center; flex-flow:row">
    <img width="85%" src="/assets/2024-10-13-SSVL-Simple-Stereo-Vision-Library/sensors.png" alt=""/>
</div>
<center><i>Figure 1: Physical and virtual sensor examples</i></center>
<br>

As you can see above, the left physical sensor always has a physical size because we don't have any other option, it has to exist! However, the virtual sensor is a little more confusing because we might not typically assign units to the sensor, but we can if we want to.

#### **Lenses**
This is where cameras (physical or virtual) start to get harder to understand. Let's start with these questions first: **do we need a lense? What happens if we don't use one?** That should be a little confusing to think about because even the way you, as a human, see is through lenses in your eyes! In any case, the below simulation should provide a neat example of what happens.