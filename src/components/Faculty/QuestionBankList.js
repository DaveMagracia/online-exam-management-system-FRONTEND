import React from "react";
import QuestionBankListBox from "./QuestionBankListBox";
import css from "./css/QuestionBankList.module.css";

export default function QuestionBankList() {
  return (
    <>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 row-cols-xxl-5 g-3">
        <div class="col">
          <QuestionBankListBox />
        </div>
        <div class="col">
          <QuestionBankListBox />
        </div>
        <div class="col">
          <QuestionBankListBox />
        </div>
        <div class="col">
          <QuestionBankListBox />
        </div>
        <div class="col">
          <QuestionBankListBox />
        </div>
        <div class="col">
          <QuestionBankListBox />
        </div>
      </div>
    </>
  );
}
