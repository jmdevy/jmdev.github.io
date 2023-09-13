---
layout: post
title:  Designing a Gamecube Controller PCB from Scratch Using ESP32-S3
date:   2023-6-13 00:10:00 -0500
categories: jekyll update
---

## Introduction

This post shows the design steps used to create a wired and wireless GameCube controller.

I intend to help others see the design process I go through when building a product.

Criticism of my process is welcome, I hope to improve.

### Features

What I personally want to see in the controller:
* USB-C port for hardwired computer and console connection
* Ability to act as a Bluetooth gamepad for wireless connection to computers
* Ability to wirelessly connect to Wii and GameCube through custom adapter
* Li-ion battery with wireless charging implemented with a charging station that supports multiple controllers

Summarizing the above, three major components need to be designed and manufactured:
1. **Controller**
2. **Wireless adapter**
3. **Wireless charging station**


---


## Software Used

Software that will be mentioned in this post:
* [Fusion 360 Personal](https://www.autodesk.com/products/fusion-360/personal){:target="_blank"}{:rel="noopener noreferrer"} (3D CAD/Mechanical design)
  * I enjoy using FreeCAD but it doesn't handle organic shapes well, so Fusion was used instead.
* [KiCad 7.0.7](https://www.kicad.org/){:target="_blank"}{:rel="noopener noreferrer"} (EDA/Schematic and PCB design)
  * Everything else costs too much money for personal projects
* [UltiMaker Cura](https://ultimaker.com/software/ultimaker-cura/){:target="_blank"}{:rel="noopener noreferrer"} (3D printing slicer)
  * Great, free 3D printer slicer
* [Visual Studio Code](https://code.visualstudio.com/){:target="_blank"}{:rel="noopener noreferrer"} (Code editor/"IDE")
  * Free, unbeatable even if it takes more manual configuration vs. Visual Studio or Netbeans

## Languages Used
Here are programming/scripting languages used for this project:
* C/C++
  * The firmware in the controller, adapter, and charging station will use lower level firmware written in C/C++ (as opposed to using MicroPython, for example)
* Python
  * For scripts to test hardware during production
* JavaScript/HTML
  * Used for controller settings web app

---


## High Level Project Layout
The following block diagrams depict structure of the product as layman or user would see it.

### **Controller** Layout
{% blockdiag %}
blockdiag {
   A -> B -> C -> D;
   A -> E -> F -> G;
}
{% endblockdiag %}

### **Wireless Adapter** Layout
{% blockdiag %}
blockdiag {
   A -> B -> C -> D;
   A -> E -> F -> G;
}
{% endblockdiag %}

### **Wireless Charging Station** Layout
{% blockdiag %}
blockdiag {
   A -> B -> C -> D;
   A -> E -> F -> G;
}
{% endblockdiag %}


---


## Low Level Project Layout

The next sections show the lowest level individual components for this product and how they connect together. This is what all engineers on the project should refer to and be assigned work from.

During development issues will arise and blocks may need to be expanded or taken away. Having the block diagram will help for assigning work or research for engineers to carry out to decide if certain blocks need adjustment.


# ESP32-S3
This is the heart of the controller.

# Joysticks

# Triggers (LR, RL, and Z)

---

## Z Button
The manually measured dimensions and actuation distance of the original Z button are as follows:
* **Width:** 6.25mm
* **Height:** 6.92mm
* **Depth (not pressed):** 4.5mm
* **Depth (fully pressed):** 3.2mm
* **Actuation distance/travel:** 4.5-3.2 = 1.3mm
* **Actuator diameter:** 3.0mm
* **Actuator length**: 1.3mm

This is a right angle/vertical/side actuated mounted tactile button that feels slightly like that of a silicone button with a soft press.

The most important aspects of the button are the height (from the board) and feel of the of the press (soft/silicone). Being round is not important.

The operating/push force of the button is unknown.

The filters for searching on Digikey should be set as [so](https://www.digikey.com/en/products/filter/tactile-switches/197?s=N4IgjCBcoGwJxVAYygMwIYBsDOBTANCAPZQDaIAzACwVhgAMIhV9cVATI83XOxALqEADgBcoIAMoiATgEsAdgHMQAX0Jg4ADgTQQKSBhwFiZEI35qQAWnaI9UGQFdjJSOQCsIC4Ssw7%2BpxdTCi8VS1s3EBF0JBFZTFwAAmwAd1kRJAALXGwvQk9dISgwYSLIdncwoA){:target="_blank"}{:rel="noopener noreferrer"}

Possible switches:
1. **https://www.digikey.com/en/products/detail/e-switch/TL1105VF160Q/378974** looks visually close to what is on the controller but the travel is 0.25mm instead of 1.3mm
2. **https://www.digikey.com/en/products/detail/c-k/KT11B2SAM34LFS/1012123** looks different. KT11 series with B2 actuator might work well enough (https://www.ckswitches.com/media/1468/kt.pdf). Won't be exact replacement.

---

## Rumble motor
* **Diameter without foam:** 30.65mm
* **Diameter with foam:** 34.0mm
* **Depth:** 12.55mm
* **Shaft length (does not use external weight on shaft):** 6.5mm
* **Weight:** 33.5g

Unfortunately, OEM motors and equivalent are not sold online except for a single listing on eBay at the time of writing. Searching "Replacement rumble motors" on Google brings up multiple listings for Xbox 360 motors.

According to [this](https://www.reddit.com/r/xbox360/comments/14fryun/weight_of_rumble_motors_out_of_a_360_controller/){:target="_blank"}{:rel="noopener noreferrer"} two OEM Xbox 360 motors weigh 1.646oz or 46.67g. A single motor weighs 23.3g.

Voltage, current consumption, and other parameters of the motor are luckily listed [here](https://www.reddit.com/r/diyelectronics/comments/lbaagm/anyone_know_the_max_voltage_for_xbox_one/icpj7ty/){:target="_blank"}{:rel="noopener noreferrer"} as:
* **Motor Voltage**: 5V max
* **Starting Current**: 260 mA max
* **Rated Load Current**: 150mA max
* **NO Load Current**: 35mA max
* **Rated Load Speed**: 2550±10%rpm

Because we're limited by the the availability of rumble motors similar to the ones in the GameCube Controller, the dimensions and weight will have to do.

### Driving the rumble motor
The microcontroller needs a way to turn the rumble motor on and off. Looking at the pg. 56 and 57 of the ESP32-S3 [datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf){:target="_blank"}{:rel="noopener noreferrer"} shows that the high-level source current is typically 40mA. By Googling [around](https://esp32.com/viewtopic.php?t=27985){:target="_blank"}{:rel="noopener noreferrer"}, the ESP32-S3 is likely limited to about 40mA per GPIO. This means that the microcontroller will not be able to source the 260mA needed to the motor during starting. Custom motor driving circuitry is required to drive the motor.

The design requirements for the circuitry driving the motor are as follows:
* Operates at 5V (The motor will always be driven off the battery since USB power is limited to 500mA by best and 100mA at worst)
* Able to handle currents up to 500mA (nearly 2x safety margin)
* Drive the motor in forward and reverse directions (need reverse direction to stop quickly instead of spinning down)

#### First assumptions for motor driving
Depicted below is the most simple form of a typical half-bridge (also referred to as an H-bridge) circuit just using manual switches (instead of transistors) and a voltage source. This circuit can drive the motor in forwards and reverse:

<p class="center">
$$
\begin{circuitikz}
  \ctikzset{
    sources/fill=black
  }
  \draw[color=white]
  (0,0) to[american voltage source, invert, l=5V] (0,4)
        to[short] (4,4)
        to[normal open switch, l=$S_1$] (4,2)
        to[normal open switch, l=$S_2$] (4,0)
        to[short] (0,0)
  (4,4) to[short] (8,4)
        to[normal open switch, l=$S_3$] (8,2)
        to[normal open switch, l=$S_4$] (8,0)
        to[short] (4,0)
  (4,2) to[Telmech=M, l=M1, fill=black] (8,2)        
\end{circuitikz}
$$
</p>
<p class="center">
Figure 1: Basic H-Bridge Using Manual Switches
</p>

The next two figures depict driving the motor forwards and backwards:
<p class="center">
$$
\begin{circuitikz}
  \ctikzset{
    sources/fill=black
  }
  \draw[color=white]
  (0,0) to[american voltage source, invert, l=5V] (0,4)
        to[short] (4,4)
        to[color=red, short, l=$S_1$] (4,2)
        to[normal open switch, l=$S_2$] (4,0)
        to[short] (0,0)
  (4,4) to[short] (8,4)
        to[normal open switch, l=$S_3$] (8,2)
        to[color=red, short, l=$S_4$] (8,0)
        to[short] (4,0)
  (4,2) to[Telmech=M, l=M1, fill=black] (8,2)
\end{circuitikz}
$$
</p>
<p class="center">
(a)
</p>

<p class="center">
$$
\begin{circuitikz}
  \ctikzset{
    sources/fill=black
  }
  \draw[color=white]
  (0,0) to[american voltage source, invert, l=5V] (0,4)
        to[short] (4,4)
        to[normal open switch, l=$S_1$] (4,2)
        to[color=red, short, l=$S_2$] (4,0)
        to[short] (0,0)
  (4,4) to[short] (8,4)
        to[color=red, short, l=$S_3$] (8,2)
        to[normal open switch, l=$S_4$] (8,0)
        to[short] (4,0)
  (4,2) to[Telmech=M, l=M1, fill=black] (8,2)
\end{circuitikz}
$$
</p>
<p class="center">
(b)
</p>
<p class="center">
Figure 2: Rotate motor clockwise (a) and counterclockwise (b) using H-bridge
</p>

[Wikipedia](https://en.wikipedia.org/wiki/H-bridge){:target="_blank"}{:rel="noopener noreferrer"} has similar depictions and extra information on the subject. In the figures above, the polarities of the DC motor can be reversed using the switches and therefore the rotation will also reverse.

Although this circuit could be implemented with discrete components, the cost and size of the circuit will likely be larger than needed. The easiest solution is to use a brushed DC motor driver IC from [Digikey](https://www.digikey.com/en/products/filter/motor-drivers-controllers/744?s=N4IgjCBcpgTAnFUBjKAzAhgGwM4FMAaEAeygG0RYBmANgHYqAWEI2AVjYA42qXK6EbCK041Y1PmDDw6bAAx9GHNoiKNOVOnT4c5jYSC6d4bPjTnww2omHormN9nLoLH8UdfBUwPA2Fpyenywcj7wDuB05nQR4nTSsMGMWnI0wTRiNAYImrARVHrGiAC6RAAOAC5QIADKFQBOAJYAdgDmIAC%2BrFFIIKiQmLiEJOSGbFppaqKccIo0bLBgEVlU45I0xkrr8IGT4DQ7IZKw8RI2BQWe-oucnJJU4nK85%2BJW9693L9QR1yeJX5wrg8Cv8vOpGM8waJVFCtPdGDsfkxwkCEfN4d5snITjtgtjOIxYviGCBSiBKtU6k02p0iFpEtA%2BuhsPgiKRIBQqPBzAZxpwjlMNrMiFkTntGPNFst-GsbBtwpDbJtTHLjLL9jsnttdtqBRrsYqDtigTdPl5FvAYb9nO9Fq5zX93iD4QTFUxoS64ecIVI8bACUT-STWHIPCVylVILUGi12l19jRmIz%2BoNWSMOSBgVzeGSKVGqbHaSAALQMlBQBoAV2G7IoKpAJXjxbSyYr9WrbNGOY68YZFAAtsQKsR6gACAAmTQAbnh6qSRb1GuPqsWwKE%2BHmQHwKgBPMp4aoYHCoHtAA){:target="_blank"}{:rel="noopener noreferrer"}. The [A3910EEETR-T (IC MOTOR DRIVER 2.5V-5.5V 8DFN)](https://www.digikey.com/en/products/detail/allegro-microsystems/A3910EEETR-T/3973532){:target="_blank"}{:rel="noopener noreferrer"} can provide 500mA at supply voltage + 1V. If the 3.7V battery is used, then ideally the motor could be driven with 3.7V + 1V = 4.7V. That may be close enough in the ideal case but the battery can drain to 3.2V. This will have to do for now and can be switched out later. For example, although this is a 5V motor, it may still [work](https://electronics.stackexchange.com/a/443968){:target="_blank"}{:rel="noopener noreferrer"}.


# Buttons

# Software

# Wires

# Battery and charging
A very common rechargeable battery to see nowadays in consumer products are [these](https://www.epectec.com/batteries/prismatic-pouch-packs.html){:target="_blank"}{:rel="noopener noreferrer"} li-ion pouch batteries. Another example are [these](https://tinycircuits.com/collections/batteries){:target="_blank"}{:rel="noopener noreferrer"} that include built-in protection circuitry.

The implementation used for charging teh li-ion battery in this circuit will be derived from [this](https://www.youtube.com/watch?v=wy516po6uVU){:target="_blank"}{:rel="noopener noreferrer"} video.

## Battery requirements
As explained throughout the rest of the page, the battery should be able to provide a decent amount of current. For example, just the motor alone can draw 290mA. Also, the bigger capacity of the battery the better. Looking at the [datasheet](https://github.com/TinyCircuits/LaTex-Battery-Datasheets/raw/main/Datasheet_500mAh.pdf){:target="_blank"}{:rel="noopener noreferrer"} for [this](https://tinycircuits.com/products/lithium-ion-polymer-battery-3-7v-500mah){:target="_blank"}{:rel="noopener noreferrer"} battery shows the following:
* Nominal 500 mAh capacity
* Nominal 3.7V voltage
* Maximum Discharge current of 1.0C therefor 1.0 * 500mAh = 500mA

This works work well because a USB device can request 500mA from a charger too.

## Battery Safety, NO Fires
Obviously, the controller shouldn't catch on fire, and unprotected lithium-ion cells definitely can. Luckily, the 500mAh cell mentioned earlier has protection circuitry for the following conditions (see pages 3 through 5 of the datasheet):
* Charge cut-off voltage protection (do not want to overcharge if charging circuit fails): cuts off charging at 4.2V
* Discharge cut-off voltage protection (do not want to discharge so slow that battery chemistry becomes unstable and shorts): cuts off output at 2.45V
* Thermal shock protection (do not want battery to explode if temperature changes relatively quickly and is hot for a while): can survive at ~90.0 degrees Fahrenheit for at least 30 minutes. Separately, the IEC62133 certification this battery has indicates it also received a test where the battery experienced 130 Celsius (266 Fahrenheit) for at least 10 minutes without explosion or fire. See [page 17 here](http://www.nrccsafety.com/upload/portal/20200811/2466b1d6cac677ccbdeb6588b02136f5.pdf){:target="_blank"}{:rel="noopener noreferrer"} for details on that part of the certification
* Over-charge protection: Can survive 3C charge (3*500=1500mA) at 4.6V with no fire or smoke
* Over-discharge protection: can survive being lowered to cut-off voltage (2.45V) and then connected to external load for 24 hours without smoke or fire
* Short Circuit protection: can survive terminals being shorted with low impedance wire for 6 hours without fire or smoke

This seems pretty thorough and like a good candidate. Depending on the charge IC and potential voltage regulators, there could be options for a second layer of protection to help limit current. For example, a simple fuse could be put inline with the + terminal of the battery to disconnect it permanently if a short occurs. it should be good practice to try to stay well under the limits of even the battery protection circuitry.

## Battery Charging
There are a bunch of ways to charge a li-ion cell. This [video](https://www.youtube.com/watch?v=wy516po6uVU){:target="_blank"}{:rel="noopener noreferrer"} outlines a couple different ways of handling battery charging, especially when connected and charging but power is still needed for the device.

### How does battery charging work?
This [video](https://youtu.be/A6mKd5_-abk){:target="_blank"}{:rel="noopener noreferrer"} by EEVblog goes into the basics of Lithium Ion/Polymer (essentially the same thing) charging very well.

This [part](https://youtu.be/A6mKd5_-abk?t=398){:target="_blank"}{:rel="noopener noreferrer"} of the video shows the way in which current and voltage are measured by a typical charging IC. As seen below, there are three main portions of the graph, **Precharge (PRE)**, **Constant Current (CC)**, and **Constant Voltage (CV)**:
<p class="center">
$$
\begin{circuitikz}
  \ctikzset{
    sources/fill=black
  }
  \draw[color=white]                              % Draw axes of plot
  (0,0) to[short] (18,0)                             % X (time)
  (0,0) to[short] (0,11)                             % Y (voltage and current)
  (-2.5,11) node [color=green, V] {$V_{measured}$}   % Voltage Y axis label
  (-1,11) node [color=cyan, I] {$I_{\% of C}$}       % Current Y axis label
  (9,-0.5) node [color, T] {TIME}                    % Time X axis label
  \draw[color=white, dashed]                      % Draw dashed lines for regions
  (4,0) to[short] (4, 11)                            % Start to pre end region
  (10,0) to[short] (10, 11)                          % pre end to CC end region
  (16,0) to[short] (16, 11)                          % CC end to CV end region
  \draw[color=white]                              % Draw region labels
  (2,11) node [PRE] {PRE}                            % PRE region
  (7,11) node [CC] {CC}                              % Constant current region
  (13,11) node [CV] {CV}                             % Constant voltage region
  \draw[color=green]
  (0,1) to[out=30, in=190] (4,3)
  (4,3) to[out=45, in=180] (10,10)
  (10,10) to[short] (16,10)
  \draw[color=cyan]
  (0,2) to[short] (4,2)
  (4,2) to[short] (4,10)
  (4,10) to[short] (10,10)
  (10,10) to[out=-85, in=180] (16,1)
  
\end{circuitikz}
$$
</p>

### #1 Connecting charging IC, battery, and the load in parallel
* [Reference](https://youtu.be/wy516po6uVU?t=60){:target="_blank"}{:rel="noopener noreferrer"} 

<p class="center">
$$
\begin{circuitikz}
  \ctikzset{
    sources/fill=black
  }
  \draw[color=white]
  (0,0) to[american voltage source, invert, l=$V_{supply}$] (0,4)
        to[short] (4,4)
        to[short] (4,5)
        to[short] (8,5)
        to[short] (8,-1)
        to[short] (4,-1)
        to[short] (4,0)
        to[short] (0,0)
  (4,0) to[short] (4,4)
  \draw[color=white]
  (6,3) node [N] {Li-Ion}
  (6,2) node [N] {Charge}
  (6,1) node [N] {IC}
  \draw[color=white]
  (8,4) to[short] (10,4)
        to [battery2, l=$V_{li-ion}$] (10, 0)
        to[short] (8,0)
  \draw[color=white]
  (10,4) to[short] (14,4)
  \draw[color=white]
  (10,0) to[short] (14,0)
  \draw[color=white]
  (14,2) node [N] {Load}
\end{circuitikz}
$$
</p>

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
---

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

# Resources
These are great resources for learning about various electronics topics and PCB design:
* [MicroType Engineering Youtube](https://www.youtube.com/@MicroTypeEngineering){:target="_blank"}{:rel="noopener noreferrer"}
* [Phil's Lab Youtube](https://www.youtube.com/@PhilsLab){:target="_blank"}{:rel="noopener noreferrer"}