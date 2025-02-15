---
layout: post
title:  Building a Focus App Using React
date:   2025-1-14 00:00:00 -0500
categories: jekyll update
---

## **Introduction**
This is a small writeup about my little [focus tracking app](https://github.com/jmdevy/focus).

The app is very simple: add **tasks** that that want you to spend certain amounts of time each day focusing on. Once you choose to focus on a task, a timer counts down for the duration you chose.


<br>


## **Technologies**

#### **Frontend**
* [React](https://react.dev/)
* [Next.JS](https://nextjs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [tailwindcss](https://tailwindcss.com/)
* [daisyUI](https://daisyui.com/)/[react-daisyui](https://github.com/daisyui/react-daisyui)

#### **Wireframe**
* [frame0](https://frame0.app/)


<br>


## **The Wireframe**
I used the **frame0** app for drawing out the UI/UX of the app. I only focused on desktop browsers but it could be slightly adjusted to work well on mobile too.

<div style="flex:1; display:flex; justify-content:space-evenly; align-items:center; flex-flow:row">
    <img width="100%" src="/assets/2025-1-14-building-a-focus-app-using-react/wireframe_todo.svg" alt=""/>
</div>
<center><i>Figure 1: TODO Filter Applied</i></center>
<br>

<div style="flex:1; display:flex; justify-content:space-evenly; align-items:center; flex-flow:row">
    <img width="100%" src="/assets/2025-1-14-building-a-focus-app-using-react/wireframe_done.svg" alt=""/>
</div>
<center><i>Figure 2: DONE Filter Applied</i></center>
<br>

<div style="flex:1; display:flex; justify-content:space-evenly; align-items:center; flex-flow:row">
    <img width="100%" src="/assets/2025-1-14-building-a-focus-app-using-react/wireframe_all.svg" alt=""/>
</div>
<center><i>Figure 3: ALL Filter Applied</i></center>
<br>

<div style="flex:1; display:flex; justify-content:space-evenly; align-items:center; flex-flow:row">
    <img width="100%" src="/assets/2025-1-14-building-a-focus-app-using-react/wireframe_add_task.svg" alt=""/>
</div>
<center><i>Figure 4: Add Task Popup</i></center>
<br>


<br>


## **The App**
Visit the [app](https://jmdevy.github.io/focus/) and try it out. I ended up deviating from the wireframe once I actually got into building it out.

Instead of a "frequency" dropdown, I went with a multi-selection radio element where you can select multiple days where you want the task to show up as a todo.