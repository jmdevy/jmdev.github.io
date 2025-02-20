---
layout: post
title:  Small Linux Computer From Scratch - lo - DRAFT
date:   2025-2-18 00:10:00 -0500
categories: jekyll update
---


<br>


## **Introduction**
This article will go through every topic related to developing an embedded Linux product from scratch.

Typically, hardware development blogs only go over high level concepts, like in the below posts, but I'm going to go over every last detail.

* [Type 1 diabetes watch](https://andrewchilds.com/posts/building-a-t1d-smartwatch-from-scratch)
* [Laptop from scratch](https://www.byran.ee/posts/creation/)
* [Fluid simulation pendant](https://mitxela.com/projects/fluid-pendant)

However, it is expected that you have basic electrical engineering, Linux, product development, mechanical, and software engineering knowledge.

~ _this is going to be a long one... Please understand that not everything I say in this blog may be completely accurate, especially in the future when it could be out of date._


<br>


## **What Exactly Are We Building? What Are the Product Specifications?**
We'll be building a retro themed handheld Linux computer. The development and product requirements are:

* **Processor**
    * *Product requirements*: OK with sacrificing speed/resources for correct package, but the faster and more memory, the better
    * *Development requirements*: Must be an system on a chip (SoC) with integrated RAM (avoids routing of dense high-speed busses) and in a package with easy to inspect pins (non-BGA, see [IPC-7351](https://datasheet.datasheetarchive.com/originals/crawler/fancort.com/428761382a93d283e0ca120b5c72d850.pdf) for package types)
* **Connectivity**
    * *Product requirements* At least Wi-Fi 2.4GHz and Bluetooth BLE 5. The longer the range and larger the bandwidth the better, but willing to sacrifice those for development constraints
    * *Development requirements*: Easy to use software-wise and must be a system on a module (SoM) to avoid FCC certification. Must be easy to solder and inspect
* **Display**
    * *Product requirements*: Going for a retro look, doesn't need to be too big or too high in resolution. Being OLED instead of LCD would be nice, but willing to use LCD
    * *Development requirements*: Flexible connector that can be plugged into a connector on the board instead of directly soldered
* **Battery**
    * *Product requirements*: Larger, more mAh is better, but will to work with whatever fits
    * *Development requirements*: Needs to have datasheet, certifications, connector that can be plugged in, and integrated over-voltage, over-current, and over-charge protections.
* **Input**
    * *Product requirements*: Keyboard and basic gamepad controls that are as usable and comfortable as possible
    * *Development requirements*: Pre-made keyboard module to reduce development time and cost, and simple joysticks and buttons for game pad controls


<br>


## **Where to Source Parts and Services from? What to Look for?**
There are a lot of different places to source parts and services from. Here's a relatively extensive list:
* [DigiKey](https://www.digikey.com/) (mainly electrical)
* [Mouser](https://www.mouser.com/) (mainly electrical)
* [LCSC](https://www.lcsc.com/) (mainly electrical)
* [McMaster-Carr](https://www.mcmaster.com/) (mainly mechanical)
* [Alibaba](https://www.alibaba.com/) (electrical, mechanical, & services)
* [Aliexpress](https://www.aliexpress.us/?gatewayAdapt=glo2usa) (electrical & mechanical)
* [Wkooa](https://www.wkooa.com/) (screws, bolts, nuts, & washers)
* [BuyDisplay](https://www.buydisplay.com/) (displays)
* [PCBWay](https://www.pcbway.com/) (China, PCBs, stencils, & services)
* [JLCPCB](https://jlcpcb.com/) (China, PCBs, stencils, & services)
* [OSHPark](https://oshpark.com/) (US, PCBs, & stencils)

This is the hardest part! These are some of key attributes you need to look at for every part you choose:
* **Cost**: This goes hand-in-hand with *manufacturer*, *consistency*, *reliability*, *availability*, *documentation*, and *support* depending on price.
    * *Cheaper parts*: relatively unknown manufacturer might disappear; might receive inconsistent fake/counterfeit parts; some parts might work and others won't (unreliable); less documentation and support
    * *Expensive parts*: Could be the opposite of each attribute when comparing to cheaper parts, depends though.
* **Manufacturer**: If you can justify it, try to pick known manufactures (TI, STM, etc.) of parts for at least complex components. You might be able to use unknown Chinese parts for simple components/parts
* **Consistency**: Try to pick parts that are consistent (not fake, counterfeit, or have different part numbers) by choosing known manufactures, if possible, and get samples to test
* **Reliability**: Some complex but very cheap parts but simply fall apart, not solder well, or have very loose tolerances in dimensions or other aspects. Some percentage of parts **will** fail.
* **Availability**: Try to pick parts that can easily be swapped out with alternatives, and pick parts that shouldn't be going out of stock permanently for one reason or another. Check that stocks of the part when buying the first time are relatively large to what you need. The more in stock, the better of a sign that it will stay in stock in the future
* **Documentation**: For complex parts, check that there is sufficient documentation on the part. If it is simple or mimics other parts, you can probably get away without extensive documentation if you can find the information somewhere else
* **Support**: This is the last bullet-point for a reason. It is relatively rare to get support from small Chinese distributors or large companies that will only talk to you if you are buying 100k+ ~ 1M+ parts.


<br>


# **Setting Up an ERP**
What is an **ERP**? It stands for [Enterprise Resource Planning](https://en.wikipedia.org/wiki/Enterprise_resource_planning) and is a software that handles lots of different aspects of running a company.

For us though, since we're just getting started building products and maybe don't have a company, we'll be using an ERP system for keeping track of parts and handling ordering of those parts.

For example, say we have a product with a screen, battery, electrical components, plastic enclosure, etc. Where do you keep the information about each component, it's price, manufacturer, availability, how to order it, etc? It would be nice to keep all that information in some kind of central database, right? That's one aspect of what ERP software can do.

There are lots of different commercial and open-source projects, here's some of those:
* 

<br>


# **Setting Up KiCAD**


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


## **Choosing a Processor**
Before we start anything (software, other components, KiCad library), we need a processor. Here's my justifications for most attributes you decide on when choosing a microprocessor SoC:

* **Speed:** It can be slow. We aren't making a Linux tablet, I'm fine with sacrificing this for other aspects
* **Flash:** I would prefer the SoC has integrated on-board flash memory, but external SPI flash is fine too
* **RAM:** Ideally, the SoC has some fast single-access SRAM but I need it to have integrated DDR RAM to reduce design time
* **Availability:** This is a one time build so it not begin very available is fine as long as I can buy a couple of them
* **Cost:** It's alright if the processor costs a decent amount. It should cost less than a modern CPU but I'm fine with the price being factors higher than a microcontroller for a one time build
* **Solder-ability:** I need it to be hand solder-able such that I can see the pins and fix any possible shorts (no BGA packages! I don't own an x-ray machine)

So how do we find it? There are a couple of good blogs about this subject (and about building Linux Devices in general):
* [https://jaycarlson.net/embedded-linux/](https://jaycarlson.net/embedded-linux/)
* [https://www.thirtythreeforty.net/posts/2019/12/mastering-embedded-linux-part-2-hardware/#bare-processors](https://www.thirtythreeforty.net/posts/2019/12/mastering-embedded-linux-part-2-hardware/#bare-processors)
* [https://hackaday.com/2018/09/17/a-1-linux-capable-hand-solderable-processor/](https://hackaday.com/2018/09/17/a-1-linux-capable-hand-solderable-processor/)

In the second link above, they mention the [**Nuvoton NUC980 series**](https://www.nuvoton.com/products/microprocessors/arm9-mpus/nuc980-industrial-control-iot-series/) processors. These are perfect. TODO: why they are perfect


<br>


## **Choosing a Wi-Fi Coprocessor Module**
First, we'll want to go with a System on a Module (SoM) instead of a System on a Chip (SoC) since using an SoC requires creating
* External to the chip transmit and receive circuitry (TX power amp and RX filter)
* Antenna matching circuitry
* Shielding

https://github.com/espressif/esp-hosted/blob/master/esp_hosted_ng/README.md#12-supported-esp-boards
https://www.espressif.com/en/products/socs#:~:text=ESP32%2DP4.asc-,ESP32%2DS%20Series,-ESP32%2DS3%20Series



<br>



## **Choosing a Display**


<br>


## **Choosing a Battery**


<br>


## **Starting the KiCad library**
Most tutorials don't explain how they manage their part libraries. There are lots of differing opinions on how this should be done. Apart from the electrical engineering part (which isn't very hard for an SoC with integrated RAM), you'll run into the following starting issues when building your own hardware:

* Q. Where do I get component schematic symbols?
    * A. You make them...
* Q. Where do I get component footprints?
    * A. You make them...
* Q. Where do I get component 3D models?
    * A. You make them...