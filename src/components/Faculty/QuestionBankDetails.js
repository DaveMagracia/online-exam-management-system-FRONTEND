import React from "react";
import { useParams } from "react-router-dom";

export default function QuestionBankDetails() {
   const { bank_id } = useParams();

   return (
      <>
         <div className="container">
            <h1 className="display-1">Question Bank Details {bank_id}</h1>
         </div>
      </>
   );
}
