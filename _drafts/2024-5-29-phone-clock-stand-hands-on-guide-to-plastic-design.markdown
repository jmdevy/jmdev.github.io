---
layout: post
title:  Phone Clock Stand - A Hands-on Guide to Designing Plastic Products
date:   2024-5-29 00:10:00 -0500
categories: jekyll update
---


## **Introduction**
This page goes over my design process for a simple phone clock stand. Obviously there are likely tons of models for this online, but this is a simple project to showcase lots of different design guidelines for plastic parts.

The guidelines discussed here are for injection molding, citations are included for reference. Since I can't afford to injection mold this part, I will 3D print it but still follow injection molding guidelines for everything except clearances.

This is my first time taking the time and following every guideline I can find to a T. I can't guarantee that the information here is the best. Also, this is a simple part, it won't be taking on any serious load, it just sits on a flat surface and holds a phone. We also aren't designing this to be assembled quickly or on a massive scale.

## **Design Rules**
During the entire design process I will include citations inside my drawings for each feature from these great resources provided by Bayer: 

* [**Part and Mold Design**](https://web.archive.org/web/20240531004633/https://kompozit.org.tr/wp-content/uploads/2021/11/A_Design_Guide_Part_and_Mold_Design_Engi.pdf){:target="_blank"}{:rel="noopener noreferrer"}

* [**Snap-Fit Joints for Plastics**](https://web.archive.org/web/20230816100057/https://fab.cba.mit.edu/classes/S62.12/people/vernelle.noel/Plastic_Snap_fit_design.pdf){:target="_blank"}{:rel="noopener noreferrer"}

* [**Engineering Plastics Joining Techniques**](https://web.archive.org/web/20230816100057/https://fab.cba.mit.edu/classes/S62.12/people/vernelle.noel/Plastic_Snap_fit_design.pdf){:target="_blank"}{:rel="noopener noreferrer"}

## **Product Features**
What are we designing? Well I, the author, wanted a simple stand that holds my Iphone on its side while charging at night. This will allow me to [**StandBy**](https://support.apple.com/guide/iphone/use-standby-iph878d77632/ios){:target="_blank"}{:rel="noopener noreferrer"} to have a bedside clock. Here's what I want:
* Simple and heavy plastic base
* Rubber feet to reduce sliding
* Adjustable back for adjusting phone angle

## **The Design: Part #1**
We need to collect some general dimensional requirements that dictate how big the product will be (all units **mm**):

* The size of the phone dictates the general size of the geometry
<div style="flex:1; display:flex; justify-content:center; align-items:center; flex-flow:column">
    <img width="100%" src="/assets/2024-5-29-phone-clock-stand-hands-on-guide-to-plastic-design/iphone_drawing.svg" alt="iphone_drawing"/>
</div>
<center><i>Figure 1: IPhone 13 Extents</i></center>

<br>

* A wall thickness of 0.1" or 2.54mm is relatively strong for polycarbonate ([**Figure 2-1**](https://web.archive.org/web/20240531004633/https://kompozit.org.tr/wp-content/uploads/2021/11/A_Design_Guide_Part_and_Mold_Design_Engi.pdf#page=20){:target="_blank"}{:rel="noopener noreferrer"})
<div style="flex:1; display:flex; justify-content:center; align-items:center; flex-flow:column">
    <img width="100%" src="/assets/2024-5-29-phone-clock-stand-hands-on-guide-to-plastic-design/wall_thickness_drawing.svg" alt="wall_thickness_drawing"/>
</div>
<center><i>Figure 2: Wall Thickness Example</i></center>



* In cases where stackup doesn't matter, for 3D printing I will use a general line-to-line clearances of (not exactly applicable to injection molding):
    * **0.15mm** (tight-fit)
    * **0.225mm** (normal)
    * **0.3mm** (loose)
* To keep the product looking consistent I'll use a fillet radius of 3mm on edges
* I want to use sand to provide some weight, according to Google the smartphones can weigh up to 198g so I'll target that (sand has a density of 0.001602g/mm<sup>3</sup>)