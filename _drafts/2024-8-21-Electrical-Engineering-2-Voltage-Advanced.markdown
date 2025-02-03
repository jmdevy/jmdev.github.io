---
layout: post
title:  Electrical Engineering 2 - Voltage, Advanced
date:   2024-8-21 00:00:00 -0500
categories: jekyll update
---

We'll get into more advanced situations involving **voltages at points** and **voltage differences**.


<br>

---

<br>


# _One After the Other **Voltages**_
<br>
<div style="flex:1; display:flex; justify-content:center; align-items:center; flex-flow:column">
    <img width="25%" src="/assets/2024-8-21-Electrical-Engineering-1-Voltage-Advanced/one-after-the-other.svg" alt="one after the otehr voltage example"/>
</div>
<center><i>Figure 2</i></center>
<br>

**One after the other** (more commonly referred to as **series voltages**) affects **voltage difference**. To start off, in _Figure 2_, the **voltages** at various **points** are:

$$V_A = 5V$$

$$V_B = 3V$$

$$V_C = 0V$$

Now, the reason we call it the **total** _voltage difference_ between two _points_ is because there can be many **voltages** between two points in a circuit, in series, as in _Figure 2_.

Let's look at each **total voltage difference** between the various **points** in _Figure 2_:

This means that the following is true:

$$\begin{align}  V_{AC} = V_A - V_C  \end{align}$$


<br>

---

<br>


# _Side-by-Side **Voltages**_
<br>
<div style="flex:1; display:flex; justify-content:center; align-items:center; flex-flow:column">
    <img width="45%" src="/assets/2024-8-21-Electrical-Engineering-1-Voltage-Advanced/side-by-side.svg" alt="side by side voltage example"/>
</div>
<center><i>Figure 1</i></center>
<br>

**DON'T DO THIS**

In this type of situation, **side-by-side** (more commonly referred to as **parallel**) voltages result in the highest of the **voltages** being carried by the wires connected to each side.

$$V_A$$ in _Figure 1_ will be _5V_ as that is the highest of the **side-by-side voltages** connected to wire _A_ ($$V_B$$ will be _0V_ as it is connected to the _GND_/negative side).

This means the **voltage differences** in _Figure 1_ are: 

$$\begin{align}  V_{AB} = 5V - 0V &= 5V  \\  V_{BA} = 0V - 5V &= -5V  \end{align}$$