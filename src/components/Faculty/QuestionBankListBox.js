import React from "react";
import css from "./css/QuestionBankListBox.module.css";

export default function QuestionBankListBox() {
  return (
    <>
      <div className={`${css.question_box} card p-4`}>
        <h4>Question Title</h4>
        <p className="text-muted">Time available - Duration</p>
        <p>Total items</p>
      </div>
    </>
  );
}
