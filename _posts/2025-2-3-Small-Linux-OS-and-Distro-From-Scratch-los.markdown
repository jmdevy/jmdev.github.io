---
layout: post
title:  Small Linux OS and Distro From Scratch - los - DRAFT
date:   2025-2-18 00:10:00 -0500
categories: jekyll update
---

## **Introduction**
This page goes over the steps I used to choose and create a basic Linux image for my custom small embedded Linux computer. Why choose Linux? Are there any alternatives?

If you need an OS for an embedded device you have a few options:
* Real-time embedded OSes:
    * [FreeRTOS](https://www.freertos.org/)
    * [Zephyr](https://www.zephyrproject.org/)
    * [Mbed OS](https://os.mbed.com/mbed-os/)
* General-purpose embedded OSes:
    * [Linux](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/)
    * [FreeBSD/NanoBSD](https://docs.freebsd.org/en/articles/nanobsd/)
    * [Android](https://www.android.com/)

There are plenty of others but these are some of the popular OSes for embedded platforms. Why are the above platforms categorized into **Real-time** and **General-purpose**?

#### **Real-Time OSes**
These are projects that hide most of the low-level microcontroller/microprocessor SDK implementation from you under a common interface and are targeted at performing work in _real-time_. 

For example, if you were making flight control software for some flying vehicle, you might choose a real-time OS since it allows you to perform critical operations with more consistent timing then you'll likely get using a general-purpose OS.

Using a real-time OS is more convenient compared to using manufacturer SDKs and HALs since more people can learn one project/OS instead of many different SDKs. Real-time OS projects will use SDKs and HALs at a low-level but all of that will be hidden from you, ideally...

These type of OSes will also tend to use less resources (CPU time, memory, storage, etc.) but will typically offer less flexibility and pre-made software compared to general-purpose OSes.

#### **General-Purpose OSes**
These are flexible in terms of software offerings and configuration but will use a lot more resources compared to real-time alternatives. It will be harder to get consistent timing when performing critical tasks, at least, not without a lot of hacking...

However, these are great of general consumer devices that need to be very flexible in terms of software that can be installed and run.

You should be able to think of the two categories as:
* **Real-time**: Specific, fast, light on resources
* **General-purpose**: Flexible, slower, uses more resources

There's also a good summary of the differences [here](https://stackoverflow.com/questions/25871579/what-is-the-difference-between-rtos-and-embedded-linux).

<br>


## **Embedded Linux**
Although there are alternatives, I want a moderately flexible OS that more people have heard of and is flexible. In that case, I chose Linux. It will handle lots of stuff for us depending on the platform/microprocessor we choose:
* Wireless connectivity (depending...)
* Filesystem
* Peripheral interfaces (SPI, I2C, UART, etc.)
* Displays/screens
* Software process management
* Memory management
* A lot more...

Using Linux makes it easy to write code in a generic fashion, and because of its history, there are lots of resources to learn from. It's also open source!

There are a lot of resources on building Linux for resource constrained devices. Here are some I found that go over building the smallest images possible:
* [https://popovicu.com/posts/making-a-micro-linux-distro/](https://popovicu.com/posts/making-a-micro-linux-distro/)
* [https://popovicu.com/posts/789-kb-linux-without-mmu-riscv/](https://popovicu.com/posts/789-kb-linux-without-mmu-riscv/)
* [https://blinry.org/tiny-linux/](https://blinry.org/tiny-linux/)

Now, there's one more distinction that needs to be made. Linux is the primary software core/abstraction called the **kernal** that implements a generic interface/libraries we can use to create software that a user will actually find interesting. For example, by default Linux doesn't come with any kind of desktop environment, file manager, web browser, or email client, etc. All you start with if you build the Linux kernal is, hopefully, a UART I/O connection and a shell.

Linux makes it possible to more easily write code that displays a GUI/windows which means we could create a file manager interface, or an email client. In fact, there are decades of software projects for those types of applications! All we need to do is build the Linux kernal, compile the software projects, and upload all that to a device!


<br>


## **Building a Basic Embedded Linux Image**
With all that out of the way, how do we actually build a Linux kernal image with other software installed?

This is where the [**Yocto Project**](https://www.yoctoproject.org/) comes into play. This is a very verbosely [documented](https://docs.yoctoproject.org/) tool that is a framework that, to put it simply, builds the Linux kernal, any software (if you define all the steps), and packages it for upload onto a device.