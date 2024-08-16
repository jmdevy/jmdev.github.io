---
layout: post
title:  DeskScreen Design I
date:   2024-1-7 00:10:00 -0500
categories: jekyll update
---

![image tooltip here](/assets/2024-1-7-DeskScreen-Design-I/MockupDrawing.svg)
<center ><i>Figure 1: Initial DeskScreen Mockup</i></center>

## **Introduction**

An interesting and relatively simple project I've wanted to work on for a while is a nice looking display that sits on a counter/table/desk and displays information neatly like the weather and time with handsfree interaction. There are other devices that incorporate high resolution LCDs or are literally large monitors, instead, this project aims for a minimalist style by using a simple inclosure and low resolution and single color display.

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
An obvious way to interact with the device is through buttons. Although intuitive and reliable, buttons are **boring**. I've decided to add a front-facing camera that waits for specific hand gestures that allow the user to scroll between interfaces. At the time writing, the [ESP32-P4](https://www.espressif.com/en/news/ESP32-P4){:target="_blank"}{:rel="noopener noreferrer"} is unreleased but looks like the best fit for handling the interaction. This new chip is faster than all other Espressif ICs, has a camera interface, and AI extension that can be utilized for recognizing hand gestures ([for example](https://blog.espressif.com/hand-gesture-recognition-on-esp32-s3-with-esp-deep-learning-176d7e13fd37){:target="_blank"}{:rel="noopener noreferrer"}).

Although I said I wouldn't use buttons, one should be built into the back in case the device needs to be put into bootloader mode.


## **Display**
Instead of using an OLED or LCD screen, the display will consist of individual single color LEDs in an enclosure with pockets to separate the individual lights. At the top of the pockets will be a material to diffuse the light.

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


#### **Connecting Multiplexed LEDs to Microcontroller**
According to the above diagram and the resolution stated earlier, 16 rows + 32 columns = 48 GPIO. Although the ESP32-P4 may have enough GPIO (unconfirmed at this time), I also want the display's resolution to be expandable in future projects. Two basic solutions for expanding IO are SPI/I2C expander ICs or shift registers. After a bit of searching, shift registers are much cheaper and these [TLC59283](https://www.digikey.com/en/products/detail/texas-instruments/TLC59283DBQR/3458112){:target="_blank"}{:rel="noopener noreferrer"} are designed for running LEDs anyway. 

Because of the size of the screen, 2 shift registers will be needed since each has 16 outputs (16-bit registers). Two to control the columns and transistors connected to the IC GPIO to control the rows.


#### **Dimming LEDs**
To provide another dimension to the display, the LEDs should be dimmable so that basic grayscale is possible. _Figure 2_ shows that all LEDs in a row get activated when the corresponding columns are closed, so _how can the LEDs be individually dimmed with respect to the LEDs in the same row?_ Although PWM is the typical solution, I came up with a different solution that suits the multiplexed configuration a little better.

Two buffers will be kept:
* `pixels_max_ticks` (how many times a pixel needs to be looped over before it is lit for a small amount of time)
* `pixels_tracked_ticks` (the number of times each pixel has been looped over)

Two for loops will loop over all elements in the 2D `pixels_tracked_ticks` array and increment the values in the elements. If a value in an element is > the corresponding value in `pixels_max_ticks` then that pixel will be lit, the corresponding values will be clocked into the column shift registers. To light the now lit LEDs in the row, the row MOSFET will be commanded to conduct for a certain duration.

Doing all of the above quickly ([at least > 50Hz ](https://electronics.stackexchange.com/a/79400/175939){:target="_blank"}{:rel="noopener noreferrer"}) should mean LEDs can appear to be dim based on the values in `pixels_max_ticks`.


```C
#define SCREEN_WIDTH 32
#define SCREEN_HEIGHT 16
#define SCREEN_BUFFER_SIZE_BYTES = (SCREEN_WIDTH * SCREEN_HEIGHT) * 2   // Times two since 16-bit

// Buffers for defining and tracking pixel brightness states
uint16_t pixels_max_ticks[SCREEN_WIDTH][SCREEN_HEIGHT];
uint16_t pixels_tracked_ticks[SCREEN_WIDTH][SCREEN_HEIGHT];

// ... load pixels_max_ticks with delay data to display something at some brightness ...


void load_row(uint8_t row){
    // Load last byte in register first (shift register, last goes first)
    for(uint8_t column=SCREEN_WIDTH-1; column>=0; column--){
        pixels_tracked_ticks[column][row]++;

        if(pixels_tracked_ticks[column][row] > pixels_max_ticks[column][row]){
            // ... load '1' for this LED since it is its time ....
            // Reset tick counter 
            pixels_tracked_ticks[column][row] = 0;
        }else{
            // ... load '0' for this LED since it is not time ...
        }
    }
}


int main(int argc, char *argv[]){
    // Make sure all tracked ticks are start at 0 initially
    memset(pixels_tracked_ticks, 0, SCREEN_BUFFER_SIZE_BYTES);

    for(uint8_t row=0; row<SCREEN_HEIGHT; row++){
        load_row(row);

        // ... make row MOSFET conduct using GPIO ...
        // ... wait some very small amount of time to let LEDs light ...
        // ... make row MOSFET stop conducting
    }

    return 0;
}
```
<p class="center"><i>Figure 3: Simple Pseudo C Code for Turning LEDs ON in Dimmable Fashion</i></p>

<center>
    <video width="640" height="480" controls>
        <source src="/assets/2024-1-7-DeskScreen-Design-I/driving_leds_animation.webm" type="video/webm">
    </video>
</center>
<p class="center"><i>Figure 4: Example of fig. 3 Code in Action</i></p>


#### **The LED**
To give the display a warm feeling, these [5630 Series 3000K 65mA CreeLED](https://www.digikey.com/en/products/detail/samsung-semiconductor-inc/SPMWH22286D7WAQMS3/7560861){:target="_blank"}{:rel="noopener noreferrer"} LEDs should do the job. So, *what voltage and current should these be driven at? What does that configuration look like in conjunction with the current sinking shift register?*


---
---
---
---
---
---
---
---
---

#### **Evaluating the TLC59283 Shift Register**
First things first, what the exact requirements for driving the LEDs?:
1. Each LED should be individually dimmable
2. Each LED should be driven with 3.2V - 3.3V (according to the [LM281BA+ datasheet](https://download.led.samsung.com/led/file/resource/2022/05/Data_Sheet_LM281BA_Plus_CRI90_Rev.1.53.pdf){:target="_blank"}{:rel="noopener noreferrer"} and [DigiKey](https://www.digikey.com/en/products/detail/samsung-semiconductor-inc/SPMWH22286D7WAQMS3/7560861){:target="_blank"}{:rel="noopener noreferrer"})
3. Each LED should be supplied with up to 60mA current (again according to the datasheet and Digikey)

Ok, let's go through each of these requirements and see if the shift register can handle it.


##### **#1. Each LED should be individually dimmable**
Although LEDs work best with a constant current source (as far as flicker is concerned) that requires more complex and expensive circuitry. The way to dim LEDs cheaply is by sending varying width pulses to them depending on how dim they should be.

Although using Pulse-Width-Modulation (PWM) is typical for dimming LEDs, I want to go with a different more consistent method I came up with where pulses are interleaved across all LEDs on the display very quickly. Instead of strictly updating LEDs based on how much time has passed since the last time they were updated, it will be by pulsing them every other so many ticks. In software there will be two buffers:

1. `pixels_max_ticks`: Each pixel gets 16-bits that represent how many times the row the pixel lives in needs to be touched before that pixel gets updated. For example, if a pixel has a value set by the software of 33, then the pixel only gets pulsed every 34th time the row is looped over (after 33 ticks over the row occurred). This may need to be double buffered so that work can be done on the other core while the LEDs stay lit based on previous data.
2. `pixels_tracked_ticks`: The actual number of ticks that have occurred on each pixel in each row. For example, each time the row is looped through, each of these 16-bit values will be incremented, and once the value for a pixel reaches > than the value in `pixels_max_ticks` the value for that pixel in this buffer is reset to `0` and the LED is pulsed.

Going off the above descriptions, the brightest an LED will be able to be run at is when its value in `pixels_max_ticks` is set to `0` meaning it gets a pulse every time its row is looped over. The dimmest an LED can be is off, but the dimmest while still remaining on will have to be determined later.

How fast can the rows and LEDs be looped over? Well that's a function of the complexity of the LED pulsing and checking algorithm, the microprocessor's speed, the rate at which shift registers can be loaded, and how long it takes for a row to be supplied max current by the transistor. Let's break these down one by one:

1. **Update algorithm complexity**
This should be a simple 2D loop over all rows and columns. When an LED has gone long enough without a pulse, load a `1` into the register otherwise `0`.

2. **Microprocessor's speed:**
According to pg. 3 of the [ESP32-S3 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32-s3_datasheet_en.pdf){:target="_blank"}{:rel="noopener noreferrer"}, the base clock rate is **240MHz** but the actual speed at which the algorithm will run will have to be experimentally determined.

3. **Shift register loading rate:**
The [TLC59283 datasheet](https://www.digikey.com/en/products/detail/texas-instruments/TLC59283DBQR/3458112){:target="_blank"}{:rel="noopener noreferrer"} mentions that data can be loaded into registers at 35MHz (35Mbps). Since there are going to be two for the columns and these should be able to latch data in at the same time once the GPIOs are set, plus they're 16-bits: `t_shift_reg_load_time = (1/35Mpbs) * 16 = 0.46us` at a minimum! Or 2MHz!

4. **Transistor turn-on time:**
We'll assume this is very small since most of the time it seems to be in the `ns` range.


#### **#2. Each LED should be driven with 3.2V - 3.3V**
According to [TLC59283 datasheet](https://www.digikey.com/en/products/detail/texas-instruments/TLC59283DBQR/3458112){:target="_blank"}{:rel="noopener noreferrer"} at pg. 5, the max V<sub>OUT</sub> that can be applied to each output sink pin is `11V`, that's more than enough.


#### **#3. Each LED should be supplied with up to 60mA current**
On the same page as the output voltage above, each LED can sink a max of `50mA`. This is a probably since the max forward voltage for the LED is `60mA`.

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

Based on the above, I implemented the algorithm in Octave using some made up values for assumed delay that will occur between, during, and after updating LEDs in each row. I ran the update algorithm across all the rows multiple times using the `pixels_max_ticks` values in the below table for a screen that is 4x3 pixels.

| Index  |  0  |  1  |  2  |  3  |
|:-:| :-: | :-: | :-: | :-: |
| 0 |  0  |  3  |  6  |  9  |
| 1 |  1  |  4  |  7  | 10  |
| 2 |  2  |  5  |  8  | 11  |

<p class="center"><i>Table 1: `pixels_max_ticks` Values for Plotting Screen Update Algorithm</i></p>




## **Enclosure and Size**

## **Power Delivery**

## **Connectivity and Provisioning**
The ESP32-S3 seems like a good fit since it comes with the AI extension/acceleration as well as wireless connectivity.

---


1. **LED pulsing/checking algorithm complexity:**
This shouldn't be very complex, here's some pseudo C code I can came up with:


That didn't give us any concrete proof of the time it will take to update the LEDs from row to row, but we'll assume it is very quick.