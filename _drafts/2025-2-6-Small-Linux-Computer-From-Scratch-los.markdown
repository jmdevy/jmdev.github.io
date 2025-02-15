---
layout: post
title:  Small Linux Computer From Scratch - lo
date:   2025-2-6 00:10:00 -0500
categories: jekyll update
---


<br>

## **Introduction**
It is rare to see blogs that go through the entire process of building a device from scratch. I have found a couple that provide brief overviews:

* [Type 1 diabetes watch](https://andrewchilds.com/posts/building-a-t1d-smartwatch-from-scratch)
* [Laptop from scratch](https://www.byran.ee/posts/creation/)
* [Fluid simulation pendant](https://mitxela.com/projects/fluid-pendant)

However, all of those only go over overview steps. I made this blog post to show every step I went through to create a little Linux handheld computer.

I will be taking the safe route and using a hand solder-able SoC that has integrated DDR RAM. Routing high speed buses is the most error prone task in this kind of project, and I don't have time to justify it.

~ _this is going to be a long one..._


<br>

## **What Exactly Are We Building?**
We are building a relatively simple retro-esque handheld Linux device. This means we'll have some simple inputs, low resolution screen, speaker for audio, and a chargeable battery.


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
* Q. Where do I source electrical and mechanical components from?
    * A.
        * [DigiKey](https://www.digikey.com/) (electrical)
        * [Mouser](https://www.mouser.com/) (electrical)
        * [LCSC](https://www.lcsc.com/) (electrical)
        * [McMaster-Carr](https://www.mcmaster.com/) (mechanical)
        * [Alibaba](https://www.alibaba.com/) (electrical, mechanical, & services)
        * [Aliexpress](https://www.aliexpress.us/?gatewayAdapt=glo2usa) (electrical & mechanical)
        * [Wkooa](https://www.wkooa.com/) (screws)
        * [BuyDisplay](https://www.buydisplay.com/) (displays)
* Q. Where do I get PCBs made along with stencils for solder pasting?
    * A.
        * [PCBWay](https://www.pcbway.com/) (China, PCBs, stencils, & services)
        * [JLCPCB](https://jlcpcb.com/) (China, PCBs, stencils, & services)
        * [OSHPark](https://oshpark.com/) (US, PCBs, & stencils)