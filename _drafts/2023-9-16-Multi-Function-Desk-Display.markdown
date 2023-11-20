---
layout: post
title:  Designing a Multi-Functional Desktop Display
date:   2023-9-16 00:10:00 -0500
categories: jekyll update
---

## Introduction

An easy project idea I've had for a while is to create a multi-functional display device that sits on your desk and displays information about weather (current temperature, closest radar map data to your location, etc.), planes overhead, calendar, etc. Since it will sit on a desk it does not need a battery and can just stay plugged in.

Based on the above ideas, the following aspects of the device need to be designed and built:
* User interaction
* Display
* Enclosure and Size
* Power delivery
* Connectivity (WiFi Provisioning)

## User Interaction
A single button will be designed into the enclosure so the user can press it to cycle through different information screens.

## Display
Instead of using a OLED or LCD screen, the device will consist of individual RGB LEDs in an enclosure with pockets to separate the individual lights. At the top of the pockets will be some material to diffuse the light from the RGBs. Since the enclosure's size will mostly depend on how big the pixels are, the smallest RGB LED surface mount (SMD) package should be used.

There are plenty of options for RGB LEDs, for example, NeoPixel LEDs can be individually addressed and the connection is simple. The problems with using NeoPixels is that there size doesn't get very small and they are more expensive than other solutions.

## Enclosure and Size

## Power Delivery

## Connectivity and Provisioning
