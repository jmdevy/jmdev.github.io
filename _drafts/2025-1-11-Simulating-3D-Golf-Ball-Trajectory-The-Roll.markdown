---
layout: post
title:  Simulating 3D Golf Ball Trajectory - The Roll
date:   2025-1-10 09:00:00 -0500
categories: jekyll update
---


<style>
    /* Axes labels */
    .label {
        color: #FFF;
        font-family: sans-serif;
        padding: 2px;
        background: rgba( 0, 0, 0, .6 );
    }

    /* Code block background */
    .highlighter-rouge .highlight {
        background: black;
    }
</style>

<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/"
    }
  }
</script>

<script src="/assets/2024-12-21-Simulating-3D-Golf-Ball-Trajectory-The-Drive/coordinate_system.js" type="module">
</script>

<script src="/assets/2024-12-21-Simulating-3D-Golf-Ball-Trajectory-The-Drive/main_scene.js" type="module">
</script>



## *Introduction*
Recently, for game mod I am developing, I researched simulating the trajectory of a golf ball in 3D. I found article ["Interactive 3D Golf Simulator"](https://www.researchgate.net/profile/Chang-Song-11/publication/267680093_Interactive_3D_Golf_Simulator/links/555c163508ae6aea0817315e/Interactive-3D-Golf-Simulator.pdf) very useful.

In the article, they mention this ordinary differential equation:


$$

\begin{align}  
    {m {d \vec{v}_{ball} \over dt}}  =  \vec{F}_{gravity} + \vec{F}_{drag} + \vec{F}_{magnus} \ [m/s] \\
    {d \vec{v}_{ball} \over dt}  = \frac{\vec{F}_{gravity} + \vec{F}_{drag} + \vec{F}_{magnus}}{m} \ [m/s]
\end{align}

$$

<center><i>Equation 1: How the translational velocity of a golf ball changes over time</i></center>
<br>

We can solve this in real time using numerical methods like **Euler** or **Runge-Kutta**.



<br>



## *Coordinate System*
A coordinate system should be defined so we're on the same page:

<center>
    <div id="axesDiv" style="width:min-content; height:min-content; position:relative">
    </div>
</center>

This is mostly important for defining the y-axis as the up/down or the axis where gravity acts.



<br>




## *Gravity Force: $$\vec{F}_{gravity}$$*
Simple enough:


$$

\begin{align}  
    \vec{F}_{gravity} = m \vec{g} \ [N]
\end{align}

$$

<center><i>Equation 2: Gravity force</i></center>
<br>

The variables in this equation typically have the following values:

* Golf ball mass: $$m = 0.0459 \ [kg]$$
* Gravity vector: $$\vec{g} = <0, -9.81, 0> [m/s^2]$$



<br>



## *Aerodynamic Drag and Spin Forces: $$\vec{F}_{drag}$$ & $$\vec{F}_{magnus}$$*
In the article, they came up with the following equations for the drag and spin forces:


$$

\begin{align}  
    \vec{F}_{drag} = -(\frac{1}{2}ρAC_D|\vec{v}_{ball}|^2)  \hat{\vec{v}}_{ball} \ [N]
\end{align}

$$

<center><i>Equation 3: Drag force</i></center>
<br>


$$

\begin{align}  
    \vec{F}_{magnus} = (\frac{1}{2}ρAC_L|\vec{v}_{ball}|^2) (\hat{\vec{ω}}_{ball} × \hat{\vec{v}}_{ball}) \ [N]
\end{align}

$$

<center><i>Equation 4: Magnus spin force</i></center>
<br>


$$

\begin{align}  
    C_{L} = -0.05 + \sqrt{0.0025 + 0.036 \left( \frac{b|\vec{ω}_{ball}|}{|\vec{v}_{ball}|} \right)}
\end{align}

$$

<center><i>Equation 5: Lift coefficient</i></center>
<br>


In these equations, the constant variables are as follows:

| Variable                           | Equation                                      | Units     |
|------------------------------------|-----------------------------------------------|-----------|
| Golf ball radius                   | $$b = 0.02135$$                               | $$[m]$$   |
| Golf ball cross-sectional area     | $$A = \pi b^2 = 0.00143$$                     | $$[m^2]$$ |
| Golf ball drag coefficient         | $$C_D = 0.23$$                                | -         |
| Air density                        | $$ρ = 1.225$$                                 | $$[kg/m^3]$$ |


In case you don't know, the vectors with the absolute symbol $$\left\lvert \right\rvert$$ around them means that we need the length or the magnitude of that vector. Any vectors with the little carrot/hat symbol $$ \hat{}  $$ are unit or normalized versions of the vector.



<br>




## *Solving for Translational Velocity*
To solve the differential equation in *Equation 1*, we'll use the **Euler** method. This is a numerical and iterative approach that will be performed in $$n$$ number of steps:

**1.** Choose initial conditions for the translational and angular velocities when $$n = 0$$:

<br>

$$v_{ball_0} = <70.7, 70.7, 0> [m/s]$$

$$w_{ball_0} = <0, 1000, 0> [rad/s]$$

<br>

These initial conditions would depend on how the ball was hit, but we'll just choose convenient values. The above values should hit the ball in the xy-plane at a 45-degree angle with a decent amount of counter-clockwise spin.


**2.** Choose how big of a time step to take between steps of $$n$$:

<br>

$$t_{n+1} - t_n = dt = 0.1 \ [s]$$

<center><i>Equation 7: Discrete time steps</i></center>
<br>

Smaller time steps provide better accuracy but require more steps $$n$$ to complete the trajectory.


**3.** Define the next velocity in terms of the previous velocity plus the change in velocity over discrete time steps:

<br>

$$v_{ball_{n+1}} = v_{ball_n} + {d \vec{v}_{ball} \over dt} * dt \ [m/s]$$

<center><i>Equation 8: Next velocity after time dt</i></center>
<br>



<br>



## *Accounting for Wind Velocity*
At the end of *pg 5.* in the article, assuming the wind is constant, it can be modeled as a constant velocity affecting the ball's velocity:

<br>

$$v_{ball_{n+1}} = v_{ball_n} + {d \vec{v}_{ball} \over dt} * dt + v_{wind}$$

<center><i>Equation 9: Next velocity after time dt while accounting for wind</i></center>
<br>

We'll set the wind velocity to something easy to visualize on a single axis:

$$v_{wind} = <0, 0, 10> \ [m/s]$$

If the initial conditions hit the ball in the xy-plane, wind on the z-axis will constantly alter the trajectory out of the plane.



<br>



## *Calculating Position for Trajectory*

Finally, for each change in translational velocity $$\vec{v}_{ball}$$ from *Equation 9*, we can calculate the newest position based on the last position and the newest approximated velocity in discrete steps:

<br>

$$
\vec{p}_{n+1} = \vec{p}_n + (\vec{v}_{ball_{n+1}})(t_{n+1} - t_n) \ [m]
$$

<center><i>Equation 10: Golf ball position calculation</i></center>
<br>



<br>




## *Simulation Code*
In **JavaScript**, the entire simulation of the trajectory of the ball through calculating its position is as follows using **Three.js** for some types:

```javascript
import * as THREE from 'three';

// Constants
const m = 0.0459;                               // Golf ball mass:                  [kg]
const b = 0.02135;                              // Golf ball radius:                [m]
const A = Math.PI * Math.pow(b, 2);             // Golf ball cross-sectional area:  [m^2]
const Cd = 0.23;                                // Golf ball drag coefficient
const g = new THREE.Vector3(0.0, -9.81, 0.0);   // Gravity acceleration vector:     [m/s^2]
const p = 1.225;                                // Air density:                     [kg/m^3]
const w = new THREE.Vector3(0, 0, 10);          // Constant wind velocity:          [m/s]
const dt = 0.1;                                 // Time step for solving:           [s]

// Set main variables to initial values
let vball    = new THREE.Vector3(70.7, 70.7, 0);    // Golf ball translational velocity: [m/s]   
let wball    = new THREE.Vector3(0, 1000.0, 0.0);   // Golf ball angular velocity:       [rad/s]
let position = new THREE.Vector3(0, 0, 0);          // Golf ball position:               [m]

function Fgravity(){
    return g.clone().multiplyScalar(m);
}

function Fdrag(){
    let vballMag  = vball.length();
    let vballUnit = vball.clone().normalize();

    let F = vballUnit;
    F.multiplyScalar(-0.5 * p * A * Cd * Math.pow(vballMag, 2));
    return F
}

function Fmagnus(){
    let vballMag  = vball.length();
    let vballUnit = vball.clone().normalize();

    let wballMag  = wball.length();
    let wballUnit = wball.clone().normalize();

    let CL = -0.05 + Math.sqrt(0.0025 + 0.036 * ((b * wballMag) / vballMag));

    let F = wballUnit.cross(vballUnit);
    F.multiplyScalar(0.5 * p * A * CL * Math.pow(vballMag, 2));
    return F
}

function calcDvdt(){
    let dvdt = Fgravity()
    dvdt.add(Fdrag());
    dvdt.add(Fmagnus());
    dvdt.divideScalar(m)
    return dvdt;
}

function simulate(){
    // Collect positions throughout trajectory
    const positions = [];
    positions.push(position.clone());

    // Vary velocity and position until the position
    // goes below ground or end after an unreasonable
    // number of cycles (hand-tweaked)
    let i = 0;
    while(position.y >= 0 && i < 250){
        let dvdt = calcDvdt();
        dvdt.multiplyScalar(dt);
        vball.add(dvdt);

        let vel = vball.clone().add(w).multiplyScalar(dt);
        position.add(vel);

        positions.push(position.clone());
        i++;
    }

    return positions;
}

export default simulate;
```



<br>



## *Simulation*
You can use the following controls to navigate the 3D scene:

#### **Desktop**
* Hold mouse left-click and move mouse to **rotate**
* Hold mouse right-click and move mouse to **pan**
* Mouse scroll-wheel to **zoom**

#### **Mobile**
* One finger and drag to **rotate**
* Two fingers and drag to **pan**
* Two fingers and pinch to **zoom**


<center>
    <div id="simulationDiv" style="width:min-content; height:min-content; position:relative">
    </div>
    
    <div style="width:100%; display:flex; flex-direction:column; justify-content:space-evenly; align-items:center">

        <div style="display:flex; height:24px; align-items:center; margin-top:10px; color:white">
            <i style="margin-top:8px; margin-right:5px"><p>v<sub>ball<sub>0</sub></sub></p></i>
            <input min="-10000" max="10000" value="70.7" id="vball0x" type="number" style="width:60px" oninput="window.simulationValueUpdated()"/>
            <input min="-10000" max="10000" value="70.7" id="vball0y" type="number" style="width:60px" oninput="window.simulationValueUpdated()"/>
            <input min="-10000" max="10000" value="0"    id="vball0z" type="number" style="width:60px" oninput="window.simulationValueUpdated()"/>
            <i style="margin-top:8px; margin-left:5px"><p>[m/s]</p></i>
        </div>

        <div style="display:flex; height:24px; align-items:center; margin-top:10px; color:white">
            <i style="margin-top:8px; margin-right:5px"><p>w<sub>ball<sub>0</sub></sub></p></i>
            <input min="-10000" max="10000" value="0"    step="100" id="wball0x" type="number" style="width:60px" oninput="window.simulationValueUpdated()"/>
            <input min="-10000" max="10000" value="1000" step="100" id="wball0y" type="number" style="width:60px" oninput="window.simulationValueUpdated()"/>
            <input min="-10000" max="10000" value="0"    step="100" id="wball0z" type="number" style="width:60px" oninput="window.simulationValueUpdated()"/>
            <i style="margin-top:8px; margin-left:5px"><p>[rad/s]</p></i>
        </div>

        <div style="display:flex; height:24px; align-items:center; margin-top:10px; color:white">
            <i style="margin-top:8px; margin-right:5px"><p>w<sub>wind</sub></p></i>
            <input min="-10000" max="10000" value="0"  id="wx" type="number" style="width:60px" oninput="window.simulationValueUpdated()"/>
            <input min="-10000" max="10000" value="0"  id="wy" type="number" style="width:60px" oninput="window.simulationValueUpdated()"/>
            <input min="-10000" max="10000" value="10" id="wz" type="number" style="width:60px" oninput="window.simulationValueUpdated()"/>
            <i style="margin-top:8px; margin-left:5px"><p>[m/s]</p></i>
        </div>

    </div>
</center>

<br>
<br>
<br>

In the next articles, we'll explore what happens to the ball when it bounces off the ground and the dynamics during putting.

COMING SOON