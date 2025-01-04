---
layout: post
title:  Simulating 3D Golf Ball Trajectory
date:   2024-12-21 00:00:00 -0500
categories: jekyll update
---

## *The Equation*
Recently, for game mod I am developing, I researched simulating the trajectory of a golf ball in 3D. I found article ["Interactive 3D Golf Simulator"](https://www.researchgate.net/profile/Chang-Song-11/publication/267680093_Interactive_3D_Golf_Simulator/links/555c163508ae6aea0817315e/Interactive-3D-Golf-Simulator.pdf) very useful.

In the article, they mention this differential equation:


$$

\begin{align}  
    {m {d \vec{v}_{ball} \over dt}}  =  \vec{F}_{gravity} + \vec{F}_{drag} + \vec{F}_{magnus} \ [m/s] \\
    {d \vec{v}_{ball} \over dt}  = \frac{\vec{F}_{gravity} + \vec{F}_{drag} + \vec{F}_{magnus}}{m} \ [m/s]
\end{align}

$$

<center><i>Equation 1: How the translational velocity of a Golf ball changes over time</i></center>
<br>

We can solve this in real time using numerical methods like **Euler** or **Runge-Kutta**.


<br>

---

<br>


## *Coordinate system*
A coordinate system should be defined so we're on the same page:

<center>
    <div id="axesDiv" style="width:min-content; height:min-content; position:relative">
    </div>
</center>

This is mostly important for defining the y-axis as the up/down or the axis where gravity acts.


<br>

---

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

---

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


In these equations, the variables are as follows:

| Variable                           | Equation                                      | Units     |
|------------------------------------|-----------------------------------------------|-----------|
| Air density                        | $$ρ = 1.225$$                                 | $$[kg/m^3]$$ |
| Golf ball radius                   | $$b = 0.02135$$                               | $$[m]$$   |
| Golf ball cross-sectional area     | $$A = \pi b^2 = \pi(0.02135m)^2 = 0.00143$$   | $$[m^2]$$ |
| Golf ball drag coefficient         | $$C_D = (0.21 + 0.25)/2 = 0.23$$              | -         |
| Translational velocity vector      | $$\vec{v}_{ball} = <v_{ball_x}, v_{ball_y}, v_{ball_z}>$$ | $$[m/s]$$ |
| Angular velocity                   | $$\vec{ω}_{ball} = <ω_{ball_x}, ω_{ball_y}, ω_{ball_z}>$$ | $$[rad/s]$$ |
| Magnitude of translational velocity| $$\left\lvert \vec{v}_{ball} \right\rvert = \sqrt{v_{ball_x}^2+v_{ball_y}^2+v_{ball_z}^2}$$ | - |
| Magnitude of angular velocity      | $$\left\lvert \vec{ω}_{ball} \right\rvert = \sqrt{ω_{ball_x}^2+ω_{ball_y}^2+ω_{ball_z}^2}$$ | - |
| Translational velocity unit vector | $$\hat{\vec{v}}_{ball} = \frac{\vec{v}_{ball}}{\left\lvert \vec{v}_{ball} \right\rvert}$$ | - |
| Angular velocity unit vector       | $$\hat{\vec{ω}}_{ball} = \frac{\vec{ω}_{ball}}{\left\lvert \vec{ω}_{ball} \right\rvert}$$ | - |



<br>

---

<br>


## *Solving for Translational Velocity*
To solve the differential equation in *Equation 1*, we'll use the **Euler** method. This is a numerical and iterative approach that will be performed in $$n$$ number of steps:

**1.** Choose initial conditions for the translational and angular velocities when $$n = 0$$:

<br>

$$v_{ball_0} = <70.7, 70.7, 0> [m/s] \ \ \ \ w_{ball_0} = <0, 1000, 0> [rad/s]$$

<br>

These initial conditions would depend on how the ball was hit, but we'll just choose convenient values. The above values should hit the ball in the xy-plane at a 45-degree angle with a decent amount of counter-clockwise spin.


**2.** Choose how big of a time step to take between steps of $$n$$:

<br>

$$t_{n+1} - t_n = dt = 0.01 \ [s]$$

<center><i>Equation 7: Discrete time steps</i></center>
<br>

Smaller time steps provide better accuracy but require more steps $$n$$ to complete the trajectory.


**3.** Define the next velocity in terms of the previous velocity plus the change in velocity over discrete time steps:

<br>

$$v_{ball_{n+1}} = v_{ball_n} + {d \vec{v}_{ball} \over dt} * dt \ [m/s]$$

<center><i>Equation 8: Calculate next velocity after time dt</i></center>
<br>


<br>

---

<br>


## *Accounting for Wind Velocity*
At the end of *pg 5.* in the article, assuming the wind is constant, it can be modeled as a constant velocity affecting the ball's velocity:

<br>

$$v_{ball_{n+1}} = v_{ball_n} + {d \vec{v}_{ball} \over dt} * dt - v_{wind}$$

<center><i>Equation 9: Calculate next velocity after time dt while accounting for wind</i></center>
<br>

We'll set the wind velocity to something easy to visualize on a single axis:

$$v_{wind} = <10, 0, 0> \ [m/s]$$


<br>

---

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

---

<br>



## *Simulation Code*
In **JavaScript**, the entire simulation of the trajectory of the ball through calculating its position is as follows using THREE.js for some types:

```javascript
import * as THREE from 'three';

const ballMass      = 0.0459;                             // [kg]
const gravityVector = new THREE.Vector3(0.0, -9.81, 0.0); // [m/s^2]
const airDensity    = 1.225;                              // [kg/m^3]
const ballRadius    = 0.02135;                            // [m]
const ballCrossArea = Math.PI * (ballRadius)^2;           // [m^2]
const ballDragCoef  = 0.23;

// Come up with some initial values
const balTranslationalVelocity = new THREE.Vector3(0.707, 0.707, 0.707);   // [m/s]
const ballAngularVelocity      = new THREE.Vector3(0.0, 1.0, 0.0);         // [rad/s]

function gravityForce(){

}


function dragForce(){
    
}


function magnusForce(){
    
}
```



<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.171.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.171.0/examples/jsm/"
    }
  }
</script>


<style>
    .label {
        color: #FFF;
        font-family: sans-serif;
        padding: 2px;
        background: rgba( 0, 0, 0, .6 );
    }
</style>


<script src="/assets/2024-12-21-Simulating-3D-Golf-Ball-Trajectory/axes.js" type="module">
</script>

<script src="/assets/2024-12-21-Simulating-3D-Golf-Ball-Trajectory/simulation.js" type="module">
</script>


END