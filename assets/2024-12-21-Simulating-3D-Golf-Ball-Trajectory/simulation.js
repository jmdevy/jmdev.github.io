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
let vball    = new THREE.Vector3(108 * Math.cos(0.707), // Current golf ball translational velocity: [m/s]
                                 108 * Math.sin(0.707),
                                 0);   
let wball    = new THREE.Vector3(100.0, 1000.0, 0.0);   // Current golf ball angular velocity:       [rad/s]
let position = new THREE.Vector3(0, 0, 0);              // Current golf ball position:               [m]

function Fgravity(){
    return g.clone().multiplyScalar(m);
}

function Fdrag(){
    let vballMag  = vball.length();
    let vballUnit = vball.clone().normalize();

    return vballUnit.multiplyScalar((-1 / 2) * p * A * Cd * Math.pow(vballMag, 2));
}

function Fmagnus(){
    let vballMag  = vball.length();
    let vballUnit = vball.clone().normalize();

    let wballMag  = wball.length();
    let wballUnit = wball.clone().normalize();

    let CL = -0.05 + Math.sqrt(0.0025 + 0.036 * ((b * wballMag) / vballMag));

    return wballUnit.cross(vballUnit).multiplyScalar((1 / 2) * p * A * CL * Math.pow(vballMag, 2));
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