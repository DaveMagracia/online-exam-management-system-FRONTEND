import React from "react";
import ExamListBox from "./ExamListBox";
import css from "./css/ExamList.module.css";

export default function ExamList() {
  return (
    <>
      <h3>Exams</h3>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-xl-4 row-cols-xxl-5 g-3">
        <div class="col">
          <ExamListBox examId={1} />
        </div>
        <div class="col">
          <ExamListBox />
        </div>
        <div class="col">
          <ExamListBox />
        </div>
        <div class="col">
          <ExamListBox />
        </div>
        <div class="col">
          <ExamListBox />
        </div>
        <div class="col">
          <ExamListBox />
        </div>
      </div>
    </>
  );
}
