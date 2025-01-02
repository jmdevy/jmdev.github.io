---
layout: post
title:  Simulating 3D Golf Ball Trajectory
date:   2024-12-21 00:00:00 -0500
categories: jekyll update
---

## *The Equation*
Recently, for a mod for a game I am writing, I did some research into simulating the trajectory of a Golf ball in 3D, and I found this article very useful: ["Interactive 3D Golf Simulator"](https://www.researchgate.net/profile/Chang-Song-11/publication/267680093_Interactive_3D_Golf_Simulator/links/555c163508ae6aea0817315e/Interactive-3D-Golf-Simulator.pdf).

In the article they mention this differential equation:


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
First, a coordinate system should be defined:

<center>
    <div id="axesDiv" style="width:min-content; height:min-content; position:relative">
    </div>
</center>

This is mostly just important for defining the y-axis as the up/down or the axis gravity will act in.


<br>

---

<br>



## *Gravity Force: $$\vec{F}_{gravity}$$*
Everyone knows this one:


$$

\begin{align}  
    \vec{F}_{gravity} = m \vec{g} \ [N]
\end{align}

$$

<center><i>Equation 2: Gravity force</i></center>
<br>

The variables in this equation are typically the following:

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

<center><i>Equation 5: Lift coefficient calculation</i></center>
<br>


In this equation, the variables are as follows:
* Air density: $$ρ = 1.225 \ [kg/m^3]$$
* Golf ball radius: $$b = 0.02135 \ [m]$$
* Golf ball cross sectional area: $$A = \pi b^2 = \pi(0.02135m)^2 = 0.00143 \ [m^2]$$
* Golf ball drag coefficient: $$C_D = (0.21 + 0.25)/2 = 0.23$$
* Translational velocity vector: $$\vec{v}_{ball} = <v_{ball_x}, v_{ball_y}, v_{ball_z}> [m/s]$$
* Angular velocity: $$\vec{ω}_{ball} = <ω_{ball_x}, ω_{ball_y}, ω_{ball_z}> \ [rad/s]$$
* Magnitude of translational velocity: $$\left\lvert \vec{v}_{ball} \right\rvert = \sqrt{v_{ball_x}^2+v_{ball_y}^2+v_{ball_z}^2}$$
* Magnitude of angular velocity: $$\left\lvert \vec{ω}_{ball} \right\rvert = \sqrt{ω_{ball_x}^2+ω_{ball_y}^2+ω_{ball_z}^2}$$
* Translational velocity unit vector: $$\hat{\vec{v}}_{ball} = \frac{\vec{v}_{ball}}{\left\lvert \vec{v}_{ball} \right\rvert}$$
* Angular velocity unit vector: $$\hat{\vec{ω}}_{ball} = \frac{\vec{ω}_{ball}}{\left\lvert \vec{ω}_{ball} \right\rvert}$$


<br>

---

<br>


## *Solving*
To solve the differential equation in *Equation 1.* we'll use the **Euler** method. First, we'll start with an initial value for both the translational and angular $$\vec{v}_{ball}$$ & $$\vec{ω}_{ball}$$ velocities. The independent variable is time *t* which we'll set to $$t=0$$ at the start.

Second, we'll choose how much to change the time by each *step*. For example, a small change in time would be maybe be something like $$dt = 0.01$$.

Third, if we express the differential equation *Equation 1.* as a function with initial condition:

$$
f(t, \vec{v}_{ball}) = {d \vec{v}_{ball} \over dt} \ \ \ \ \vec{v}_{ball}(t_0) = \vec{v}_{ball_0}
$$

<center><i>Equation 6: Equation 1. as a function</i></center>
<br>


Then

$$
\vec{v}_{ball_{n+1}} = \vec{v}_{ball_n} + f(t_n, \vec{v}_{ball_n})(t_{n+1}-t_n) \ [m/s]
$$

<center><i>Equation 7: The Euler form for step-wise solving</i></center>
<br>

Finally, for each change in translational velocity $$\vec{v}_{ball}$$ we can calculate the newest position based on the last position and the newest approximated velocity:

$$
\vec{p}_{n+1} = \vec{p}_n + (\vec{v}_{ball_{n+1}})(t_{n+1} - t_n) \ [m]
$$

<center><i>Equation 8: Simulated Golf ball position calculation</i></center>
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

<script type="module">
    import * as THREE from 'three';

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, 600 / 600, 0.1, 1000 );

    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(600, 600);
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    function animate() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
    }
    renderer.setAnimationLoop( animate );
</script>