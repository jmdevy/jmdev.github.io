---
layout: post
title:  Simulating 3D Golf Ball Trajectory - The Bounce
date:   2025-1-10 00:00:00 -0500
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




## *Introduction*
Continuing on from the last post where we simulated a golf ball getting hit by a club, now it's time to ask, **what happens to the ball when it hits and bounces on the ground?**

Fortunately, someone has done to the work approximate this: ["Flight and bounce of spinning sports balls"](https://d1wqtxts1xzle7.cloudfront.net/108549885/10.000165920231208-1-ctedme-libre.pdf?1702051279=&response-content-disposition=inline%3B+filename%3DFlight_and_bounce_of_spinning_sports_bal.pdf&Expires=1736580168&Signature=E3vGXNFUvUSmxX4MdtpmV3Ha52etm7feRn0Miz07kiHd8ZtnWRIyarWI0uq~U1zfJN3MFRa0CyUAk4eIOmUkhlfxp3C10rWXKiyaWlBb~LBopayEgtwKxxlDqYnxJ5pmbFl6LPHijO0N78wUFrsJLvHSaPK~acc-TjgyEqJKHjWyqVfAVX2cojIkBw1HX80UxxodMnPLckppZ-cZgbQiuwIcQigF51XaJa8kF90N2SIbPQfZCNxi-Zu-BAcEn~6MOf9hs6bDlLAQ2vSUdn5I76wvM6Z--CMTEMxHuShYrXKMx0BoxYDFiaOIWoLcxiewQrLAZg-DqMw7W3weN9EovA__&Key-Pair-Id=APKAJLOHF5GGSLRBV4ZA) and ["The physics of golf"](https://www.discountpdh.com/wp-content/themes/discountpdh/pdf-course/physics-golf.pdf?#page=23).