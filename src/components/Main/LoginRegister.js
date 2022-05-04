import React from "react";
import ParticlesBackground from "./ParticlesBackground";
import LoginRegisterForm from "./LoginRegisterForm";

export default function LoginRegister() {
   return (
      <>
         {/* <Navbar /> */}
         {/* BACKGROUND */}
         <ParticlesBackground />
         {/* HAD TO SEPARATE THIS COMPONENT SO THAT THE PARTICLES BACKGROUND DOESNT RE RENDER
            BECAUSE FOR EVERY STATE CHANGES IN LOGINREGISTER, THE WHOLE PAGE GETS REFRESHED
            THEN THE BACKGROUND REFRESHES
         */}
         <LoginRegisterForm />
      </>
   );
}
