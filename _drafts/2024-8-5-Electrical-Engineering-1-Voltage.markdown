---
layout: post
title:  Electrical Engineering 1 - Voltage
date:   2024-8-5 00:00:00 -0500
categories: jekyll update
---

Hi, I'm going to explain the basics of Electrical Engineering as practically as possible - just the ideas you'd use in day-to-day work.

Be nice to yourself - keep the number of ideas in your head at one time to a minimum.

_NOTE: There are clarifying summary notes at the end of sections, indicated by [1], [2, 3], etc. Read those after reading the entire section as they clarify using the full information of the section_


<br>

---

<br>


# _What is **Voltage At a Point?**_
Think of this term, "**voltage**," as the **pressure** at a point.

Where is this point? For us, the **voltage** (**pressure**) is on a segment of wire. Wire connected to a **voltage at a point** takes on/continues the **voltage** at that point.

We'll say that two points of **voltages** are created by two sides of a battery, and when you connect wires to those sides, they are now at the voltage of that side:

<br>
<div style="flex:1; display:flex; justify-content:center; align-items:center; flex-flow:column">
    <img width="35%" src="/assets/2024-8-5-Electrical-Engineering-1-Voltage/voltage-at-a-point.svg" alt="voltage at points"/>
</div>
<center><i>Figure 1</i></center>
<br>

As you can see, the **voltage** of the wire connected to the "+" side is _5V_ (indicated as _A_) and on the "-" it is _0V_ (indicated as _B_).


<br>

---

<br>


# _What is **Voltage Difference?**_
Think of **voltage difference** as a **pressure difference** between wires. **Voltage difference** is commonly created by two sides of a battery, as in _Figure 1_

For example, the **voltage difference** between wire _A_ and wire _B_ can be expressed as:

$$\begin{align}  V_{AB} &= V_A - V_B  \\  &= 5V - 0V  \\  &= \boxed{5V}  \end{align}$$

<center><i>Equation 1</i></center>
<br>

It's important to know that you can also express the voltage from _B_ to _A_ (_Figure 1_) as

$$\begin{align}  V_{BA} &= V_B - V_A  \\  &= 0V - 5V  \\  &= \boxed{-5V}  \end{align}$$

<center><i>Equation 2</i></center>
<br>


<br>

---

<br>


# _**Summary**_
* _Two points of voltage are created by the two ends of a battery_
* _Voltage difference is the difference of the voltage values at two points/ends of a battery/wires and can be expressed in two directions_


<br>

---

<br>


# _**Exercises**_

#### **#1**
What is the voltage difference $$V_{AB}$$ and $$V_{BA}$$ of the following setup:
<br>
<div style="flex:1; display:flex; justify-content:center; align-items:center; flex-flow:column">
    <img width="35%" src="/assets/2024-8-5-Electrical-Engineering-1-Voltage/exercise_1.svg" alt="exercise #1 image"/>
</div>
<center><i>Figure 2</i></center>
<br>

<details>
    <summary><i><b>#1 Detailed Answer</b></i></summary>

    $$\begin{align}  V_{AB} &= V_A - V_B  \\  &= 3V - 0V  \\  &= \boxed{3V}  \end{align}$$

    <center><i>Equation 3</i></center>
    <br>


    $$\begin{align}  V_{BA} &= V_B - V_A  \\  &= 0V - 3V  \\  &= \boxed{-3V}  \end{align}$$

    <center><i>Equation 4</i></center>
    <br>
  
</details>