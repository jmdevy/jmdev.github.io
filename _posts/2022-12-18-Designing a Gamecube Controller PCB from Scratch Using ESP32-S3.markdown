---
layout: post
title:  Designing a Gamecube Controller PCB from Scratch Using ESP32-S3
date:   2023-6-13 00:10:00 -0500
categories: jekyll update
---

## Introduction

This tutorial will go through the steps to design a PCB for a Nintendo Gamecube contoller, from scratch using the internet.

## Features

The extra features I wanted to see this controller have are:
* USB-C port for computer and console connection
* Wireless connection through Bluetooth and 2.4GHz connection (2.4GHz connection handled with ESP-Now API and another ESP32-S3 part on the console)
* Li-ion battery and charging through USB-C port when connected to computer or console

## Software

Kicad will be used to create the schematic and layout the PCB.

## Background
# ESP32-S3
This is the heart of the controller.

# Joysticks

# Triggers (LR, RL, and Z)

# Buttons

# Software

# Wires

<p class="center">
$$
\begin{circuitikz}
  \draw[color=white]
    (0,0) to[battery] (0,4)
      to[ammeter, l=2mA] (4,4) -- (4,0)
      to[lamp, l=20W] (0,0)
    (0.5,0) -- (0.5,-2)
      to[voltmeter] (3.5,-2) -- (3.5,0)
    ;
    \end{circuitikz}
$$
</p>

<br>