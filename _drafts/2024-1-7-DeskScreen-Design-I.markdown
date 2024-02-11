---
layout: post
title:  DeskScreen Design I
date:   2024-1-7 00:10:00 -0500
categories: jekyll update
---

![image tooltip here](/assets/2024-1-7-DeskScreen-Design-I/MockupDrawing.svg)
<center ><i>Figure 1: Initial DeskScreen Mockup</i></center>

## **Introduction**

An interesting and relatively simple project I've wanted to work on for a while is a nice looking display that sits on a counter/table/desk and displays information neatly like the weather and time. There are other devices that incorporate high resolution LCDs or are literally large monitors, instead, this project aims for a minimalist style by using a simple inclosure and low resolution and single color display.

This is the first document of potentially many as I go through the process of design, implementation, and debugging.

The individual components of this project are:
1. User interaction
2. Display
3. Enclosure and Size
4. Power delivery
5. Connectivity (WiFi and provisioning)
6. PCB design
7. Software


## **User Interaction**
An obvious way to interact with the device is through buttons. Although intuitive and reliable, buttons are **boring**. I've decided to add a front-facing camera that waits for specific hand gestures that allow the user to scroll between interfaces. The ESP32-S3 seems like a good fit since it comes with the AI extension/acceleration as well as wireless connectivity. This [article](https://blog.espressif.com/hand-gesture-recognition-on-esp32-s3-with-esp-deep-learning-176d7e13fd37){:target="_blank"}{:rel="noopener noreferrer"} has some decent information on how this could work.

Although I said I wouldn't use buttons, one should be built into the back in case the device needs to be put into bootloader mode.


## **Display**
Instead of using a OLED or LCD screen, the display will consist of individual single color LEDs in an enclosure with pockets to separate the individual lights. At the top of the pockets will be a material to diffuse the light. As with everything the focus is to keep the project as cheap as possible, therefore, I chose these [0.2W Samsung LM281BA+ LEDs](https://www.arrow.com/en/products/spmwh22286d7waqms3/samsung-electronics){:target="_blank"}{:rel="noopener noreferrer"} because they are very cheap ($0.002 when ordering 4000 = $8!). 

Although there are a [couple ways](https://electronics.stackexchange.com/questions/11046/how-can-i-control-many-leds-with-just-a-few-pins-on-my-micro){:target="_blank"}{:rel="noopener noreferrer"} of driving many LEDs, I chose [multiplexing](http://lednique.com/display-technology/multiplexed-display/){:target="_blank"}{:rel="noopener noreferrer"} because it is very simple to implement. The figure below shows a small 3x3 example circuit of LEDs in a multiplexed configuration.

<p class="center">
$$
\begin{circuitikz}
    \ctikzset{sources/fill=alpha}
    \draw[color=white]
    % Voltage
    (0,-5)  to[american voltage source, invert, l=$V_s_s$]  (0,6)
            to[short]                                       (2,6)

    (0,-5)  to[short]                                     ++(13,0)

    % Row 1
    (2,6)   to[normal open switch, l=$S_R_1$]               (5,6)
  ++(-3,0)  to[short, *-]                                 ++(0,-3)
            to[normal open switch, l=$S_R_2$, *-]         ++(3,0)
  ++(-3,0)  to[short, *-]                                 ++(0,-3)
            to[normal open switch, l=$S_R_3$, *-]         ++(3,0)

    (5,6)   to[empty led, l=$L_R_1_C_1$, *-]              ++(0,-2)
            to[short]                                     ++(2,0)
            to[short, -*]                                 ++(0,-7)
            to[normal open switch, l=$S_C_1$, -*]         ++(0,-2)
  ++(-2,11) to[short]                                     ++(3,0)

            to[empty led, l=$L_R_1_C_1$, *-]              ++(0,-2)
            to[short]                                     ++(2,0)
            to[short, -*]                                 ++(0,-7)
            to[normal open switch, l=$S_C_2$, -*]         ++(0,-2)
  ++(-2,11) to[short]                                     ++(3,0)

            to[empty led, l=$L_R_1_C_3$, *-]              ++(0,-2)
            to[short]                                     ++(2,0)
            to[short, -*]                                 ++(0,-7)
            to[normal open switch, l=$S_C_3$, -*]         ++(0,-2)

    
    (5,3)   to[empty led, l=$L_R_2_C_1$, *-]              ++(0,-2)
            to[short, -*]                                 ++(2,0)
  ++(-2,2)  to[short]                                     ++(3,0)

            to[empty led, l=$L_R_2_C_2$, *-]              ++(0,-2)
            to[short, -*]                                 ++(2,0)
  ++(-2,2)  to[short]                                     ++(3,0)

            to[empty led, l=$L_R_2_C_3$, *-]              ++(0,-2)
            to[short, -*]                                 ++(2,0)
    

    (5,0)   to[empty led, l=$L_R_3_C_1$, *-]              ++(0,-2)
            to[short, -*]                                 ++(2,0)
  ++(-2,2)  to[short]                                     ++(3,0)

            to[empty led, l=$L_R_3_C_2$, *-]              ++(0,-2)
            to[short, -*]                                 ++(2,0)
  ++(-2,2)  to[short]                                     ++(3,0)

            to[empty led, l=$L_R_3_C_3$, *-]              ++(0,-2)
            to[short, -*]                                 ++(2,0)
\end{circuitikz}
$$
</p>
<p class="center"><i>Figure 2: Simple Example of Multiplexed LED Matrix</i></p>


What if we wanted to turn on LEDs L<sub>R2C1</sub> and L<sub>R2C3</sub>? We can do so by closing switches S<sub>R2</sub>, S<sub>C1</sub>, and S<sub>C3</sub>.


### **Connecting Multiplexed LEDs to Microcontroller**
According to the above diagram, 16 rows + 32 columns = 48 GPIO and pg. 17 table 2-3 of [ESP32-S3 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf){:target="_blank"}{:rel="noopener noreferrer"} shows exactly that many, but we'll likely need some of those for other peripherals. To get around the GPIO limit we'll need IO expanders. Options are SPI/I2C expanders or shift registers, the former turns out to be more expensive. Shift registers are much cheaper and these [TLC59283](https://www.digikey.com/en/products/detail/texas-instruments/TLC59283DBQR/3458112){:target="_blank"}{:rel="noopener noreferrer"} are designed for running LEDs anyway.

Because of the size of the screen and the fact that the shift registers sink current, 2 shift registers will be needed since each has 16 outputs (16-bit registers). Two to control the columns and transistors to control the rows.


### **Evaluating the TLC59283 Shift Register**
First things first, what the exact requirements for driving the LEDs?:
1. Each LED should be individually dimmable
2. Each LED should be driven with 3.2V - 3.3V (according to the [LM281BA+ datasheet](https://download.led.samsung.com/led/file/resource/2022/05/Data_Sheet_LM281BA_Plus_CRI90_Rev.1.53.pdf){:target="_blank"}{:rel="noopener noreferrer"} and [DigiKey](https://www.digikey.com/en/products/detail/samsung-semiconductor-inc/SPMWH22286D7WAQMS3/7560861){:target="_blank"}{:rel="noopener noreferrer"})
3. Each LED should be supplied with up to 60mA current (again according to the datasheet and Digikey)

Ok, let's go through each of these requirements and see if the shift register can handle it.

#### **#1. Each LED should be individually dimmable**
Although LEDs work best with a constant current source (as far as flicker is concerned) that requires more complex and expensive circuitry. The way to dim LEDs cheaply is by sending varying width pulses to them depending on how dim they should be.

Although using Pulse-Width-Modulation (PWM) is typical for dimming LEDs, I want to go with a different more consistent method I came up with where pulses are interleaved across all LEDs on the display very quickly.

Instead of strictly updating LEDs based on how much time has passed since the last time they were updated, it will be by pulsing them every other so many ticks. In software there will be two buffers:
1. `pixels_max_ticks`: Each pixel gets 16-bits that represent how many times the row the pixel lives in needs to be touched before that pixel gets updated. For example, if a pixel has a value set by the software of 33, then the pixel only gets pulsed every 34th time the row is looped over (after 33 ticks over the row occurred). This may need to be double buffered so that work can be done on the other core while the LEDs stay lit based on previous data.
2. `pixels_tracked_ticks`: The actual number of ticks that have occurred on each pixel in each row. For example, each time the row is looped through, each of these 16-bit values will be incremented, and once the value for a pixel reaches > than the value in `pixels_max_ticks` the value for that pixel in this buffer is reset to `0` and the LED is pulsed.

Going off the above descriptions, the brightest an LED will be able to be run at is when its value in `pixels_max_ticks` is set to `0` meaning it gets a pulse every time its row is looped over. The dimmest an LED can be is off, but the above algorithm doesn't always turns the LED at some point. It will have to be determined how many ticks it takes before an LED turns off and just flashes, this will also determine the number of brightness values. For example, if it takes 100 ticks between pulsing the LED before it looks 'off,' then we'll only have 100 brightness levels. How fast the rows and LEDs can be looped over and loaded also determines how many brightness values are available.

How fast can the rows and LEDs be looped over? Well that's a function of the complexity of the LED pulsing and checking algorithm, the microprocessor's speed, the rate at which shift registers can be loaded, and how long it takes for a row to be supplied max current by the transistor. Let's break these down one by one:

1. **LED pulsing/checking algorithm complexity:**
This should be very complex, here's some pseudo C code I can came up with:

```C
#include <string.h>
#include <stdint.h>

#define SCREEN_WIDTH 32
#define SCREEN_HEIGHT 16
#define SCREEN_BUFFER_SIZE_BYTES = (SCREEN_WIDTH * SCREEN_HEIGHT) * 2   // Times two since 16-bit

// Buffers for defining and tracking pixel brightness states
uint16_t pixels_max_ticks[SCREEN_WIDTH][SCREEN_HEIGHT];
uint16_t pixels_tracked_ticks[SCREEN_WIDTH][SCREEN_HEIGHT];

// ... load pixels_max_ticks with delay data to display something at some brightness ...

// Make sure all tracked ticks are start at 0 initially
memset(pixels_tracked_ticks, 0, SCREEN_BUFFER_SIZE_BYTES);


void load_row(uint8_t row){
    for(uint8_t column=0; column<SCREEN_WIDTH; column++){

    }
}


int main(int argc, char *argv[]){

    for(uint8_t row=0; row<SCREEN_HEIGHT; row++){
        load_row(row);

        // ... make row MOSFET conduct ...
        // ... wait some very small amount of time to let LEDs light ...
        // ... make row MOS
    }

    return 0;
}
```

2. **Microprocessor's speed:**

3. **Shift register loading rate:**

4. **Transistor 'on' time:**

Based on the above, I implemented the algorithm in Octave using some made up values for assumed delay that will occur between, during, and after updating LEDs in each row. I ran the update algorithm across all the rows multiple times using the `pixels_max_ticks` values in the below table for a screen that is 4x3 pixels.

| Index  |  0  |  1  |  2  |  3  |
|:-:| :-: | :-: | :-: | :-: |
| 0 |  0  |  3  |  6  |  9  |
| 1 |  1  |  4  |  7  | 10  |
| 2 |  2  |  5  |  8  | 11  |

<p class="center"><i>Table 1: `pixels_max_ticks` Values for Plotting Screen Update Algorithm</i></p>

---
---
---
---
---
---
---
---
---
---
---
---
---


## **Enclosure and Size**

## **Power Delivery**

## **Connectivity and Provisioning**
