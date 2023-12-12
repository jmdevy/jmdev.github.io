---
layout: post
title:  Designing a Multi-Functional Desktop Display
date:   2023-9-16 00:10:00 -0500
categories: jekyll update
---

![image tooltip here](/assets/2023-9-16-Multi-Function-Desk-Display/MockupDrawing.svg)
<center >Figure 1: Initial DeskScreen Mockup</center>

## Introduction

An interesting and relatively simple project I've wanted to work on for a while is a nice looking display that sits on a counter/table/desk and displays information neatly. Weather, time, etc. are basic information that can be displayed with cute little graphics, and that is the focus of the software I talk about later, but with more work services like Spotify or smartphone notifications could be implemented.

I like writing documentation of my projects for myself and others, to do that, this page goes over all my design thoughts, decisions, and processes for what I am calling the **DeskScreen** (clever, I know).

There are only a _couple_ topics needed to fully explain this project
1. User interaction
2. Display
3. Enclosure and Size
4. Power delivery
5. Connectivity (WiFi and provisioning)
6. PCB design
7. Software


## User Interaction
An obvious way to interact with the device is through buttons. Although intuitive and reliable, buttons are boring for a hobby project like this, because of that I decided to add a front-facing camera that will wait for specific hand gestures that allow the user to scroll between interfaces. To achieve this, I chose the ESP32-S3 as the microprocessor of this project since it comes with the AI Extension/Acceleration. Inspiration for PCB implementation was taken from the [ESP-EYE board](https://github.com/espressif/esp-who/blob/master/docs/en/get-started/ESP32-S3-EYE_Getting_Started_Guide.md#11-overview){:target="_blank"}{:rel="noopener noreferrer"}. This [article](https://blog.espressif.com/hand-gesture-recognition-on-esp32-s3-with-esp-deep-learning-176d7e13fd37){:target="_blank"}{:rel="noopener noreferrer"} has some decent information that helped me jump start this project.

I said I wouldn't use any buttons, but there will be one button on the side for putting the board into bootloader mode.


## Display
Instead of using a OLED or LCD screen, the device will consist of individual single color LEDs in an enclosure with pockets to separate the individual lights. At the top of the pockets will be material to diffuse the light. Since the enclosure's size will mostly depend on how big the pixels are, the smallest surface mount (SMD) LED package should be used.

There are two main ways to drive an arrow of LEDs, multiplexing and charlieplexing: https://electronics.stackexchange.com/questions/11046/how-can-i-control-many-leds-with-just-a-few-pins-on-my-micro

http://lednique.com/display-technology/multiplexed-display/

So the main options are shift registers and and I2C or SPI io expanders. IO expanders seem to be a lot more costly then these 16 output LED shift registers https://www.digikey.com/en/products/detail/texas-instruments/TLC59283DBQR/3458112

If out display is going to have a width of 32 and a height of 16 then we'll need (32+16)/16 = 3 shift registers which = 3 * $0.5 = $1.5, not bad

We'll also need some mosfets to provide current to each of the 16 rows. https://www.arrow.com/en/products/2n7002nxakr/nexperia where 16 * $0.059 = $0.944, not bad

We need some cheap LEDs as well like https://www.arrow.com/en/products/spmwh22286d7waqms3/samsung-electronics at 16*32 = 512, 512*0.002 = $1.024, not bad

All in all, that's $1.5 + $0.944 + $1.024 = $3.468 in parts for the display. This is not counting a microcontroller, buttton, passive components, USB connector, etc.


## Enclosure and Size

## Power Delivery

## Connectivity and Provisioning
