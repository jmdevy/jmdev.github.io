---
layout: post
title:  Simulating 3D Golf Ball Trajectory
date:   2024-12-21 00:00:00 -0500
categories: jekyll update
---

## *The Equation*
Recently, for a mod for a game I writing, I did some research into simulating the trajectory of a Golf ball in 3D. I found this article very useful: ["Interactive 3D Golf Simulator"](https://www.researchgate.net/profile/Chang-Song-11/publication/267680093_Interactive_3D_Golf_Simulator/links/555c163508ae6aea0817315e/Interactive-3D-Golf-Simulator.pdf).

In the article they mention this differential equation:


$$

\begin{align}  
    {m {d \vec{v}_{ball} \over dt}}  =  \vec{F}_{gravity} + \vec{F}_{drag} + \vec{F}_{magnus} \\
    {d \vec{v}_{ball} \over dt}  = \frac{\vec{F}_{gravity} + \vec{F}_{drag} + \vec{F}_{magnus}}{m}
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
    \vec{F}_{gravity} = m \vec{g}
\end{align}

$$

<center><i>Equation 2: Gravity force</i></center>
<br>

The variables in this equation are typically the following:

* Golf ball mass: $$m = 0.0459kg$$
* Gravity vector: $$\vec{g} = <0, -9.81, 0> [m/s^2]$$


<br>

---

<br>


## *Aerodynamic Drag Force: $$\vec{F}_{drag}$$*
In the article, they came up with the following equation for drag:


$$

\begin{align}  
    \vec{F}_{drag} = -(\frac{1}{2}ρAC_D|\vec{v}_{ball}|^2)  \hat{\vec{v}}_{ball}
\end{align}

$$

<center><i>Equation 3: Drag force</i></center>
<br>




<br>

---

<br>


## *Spin Force: $$\vec{F}_{magnus}$$*
They also came up with the following equations:


$$

\begin{align}  
    \vec{F}_{magnus} = (\frac{1}{2}ρAC_L|\vec{v}_{ball}|^2) (\hat{\vec{ω}}_{ball} × \hat{\vec{v}}_{ball})
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