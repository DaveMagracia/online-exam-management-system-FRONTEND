import React from "react";
import ParticlesBackground from "./ParticlesBackground";
import LoginRegisterForm from "./LoginRegisterForm";
import axios from "axios";

export default function LoginRegister() {
   async function getWebsiteContents() {
      await axios({
         method: "GET",
         headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
         },
         baseURL: `http://localhost:5000/admin/content`,
      })
         .then((res) => {
            document.title = `Login | ${res.data.contents.title}`;
         })
         .catch((err) => {
            console.log(err);
         });
   }

   React.useEffect(() => {
      getWebsiteContents();
   }, []);

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
