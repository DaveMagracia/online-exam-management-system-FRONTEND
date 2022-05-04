import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function QuestionBankDetails() {
   const navigate = useNavigate();
   const { bank_id } = useParams();

   React.useEffect(() => {
      if (!localStorage.getItem("token")) {
         navigate("/login-register");
      }
   }, []);

   return (
      <>
         <div className="container">
            <h1 className="display-1">Question Bank Details {bank_id}</h1>
         </div>
      </>
   );
}
