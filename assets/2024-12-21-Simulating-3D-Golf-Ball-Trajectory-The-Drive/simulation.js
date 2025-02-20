import {MAX_POINT_COUNT} from "/assets/2024-12-21-Simulating-3D-Golf-Ball-Trajectory-The-Drive/common.js"
import * as THREE from 'three';

// Constants
const m = 0.0459;                               // Golf ball mass:                  [kg]
const b = 0.02135;                              // Golf ball radius:                [m]
const A = Math.PI * Math.pow(b, 2);             // Golf ball cross-sectional area:  [m^2]
const Cd = 0.23;                                // Golf ball drag coefficient
const g = new THREE.Vector3(0.0, -9.81, 0.0);   // Gravity acceleration vector:     [m/s^2]
const p = 1.225;                                // Air density:                     [kg/m^3]
let   w = new THREE.Vector3(0, 0, 10);          // Constant wind velocity:          [m/s]
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

function simulate(vball0, wball0, wind){
    position.set(0, 0, 0);
    vball = vball0
    wball = wball0;
    w = wind;

    // Collect positions throughout trajectory
    const positions = [];
    positions.push(position.clone());

    // Vary velocity and position until the position
    // goes below ground or end after an unreasonable
    // number of cycles (hand-tweaked)
    let i = 0;
    while(position.y >= 0 && i < MAX_POINT_COUNT){
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