import React from "react";

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

export default function ParticlesBackground() {
   const particlesInit = async (main) => {
      // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      await loadFull(main);
   };

   const particlesLoaded = (container) => {
      console.log(container);
   };

   return (
      <Particles
         id="tsparticles"
         init={particlesInit}
         loaded={particlesLoaded}
         options={{
            background: {
               color: {
                  value: "#3699f5",
               },
            },
            fpsLimit: 120,
            interactivity: {
               events: {
                  onHover: {
                     enable: true,
                     mode: "repulse",
                  },
               },
               modes: {
                  push: {
                     quantity: 5,
                  },
                  repulse: {
                     distance: 70,
                     duration: 1,
                  },
               },
            },
            particles: {
               color: {
                  value: "#ffffff",
               },
               links: {
                  color: "#ffffff",
                  distance: 150,
                  enable: true,
                  opacity: 0.5,
                  width: 1,
               },
               collisions: {
                  enable: true,
               },
               move: {
                  direction: "none",
                  enable: true,
                  outModes: {
                     default: "bounce",
                  },
                  random: false,
                  speed: 0.5,
                  straight: false,
               },
               number: {
                  density: {
                     enable: true,
                     area: 1100,
                  },
                  value: 90,
               },
               opacity: {
                  value: 0.7,
               },
               shape: {
                  type: "circle",
               },
               size: {
                  value: { min: 1, max: 2 },
               },
            },
            detectRetina: true,
         }}
      />
   );
}
