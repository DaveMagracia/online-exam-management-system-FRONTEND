import React from "react";
import css from "./css/PrintTOS.module.css";
import { GiBrain } from "react-icons/gi";

export const PrintTOS = React.forwardRef(({ tableObject, examDetails, facultyUsername }, ref) => {
   return (
      <>
         {tableObject && (
            <div ref={ref} className={css.tos_root}>
               <div className="text-center mt-5">
                  <span className={`${css.logoTOS} m-0 text-center`} href="/">
                     Ex
                     <GiBrain className={`m-0`} />
                     mplify
                  </span>
                  <div className="d-flex">
                     <img
                        className="d-flex img-responsive"
                        src="/images/res/bulsu_logo.png"
                        alt=""
                        height={120}
                        width={120}
                     />
                     <div className={`${css.school_college} d-flex flex-column`}>
                        <p className={`${css.head} m-0  mt-3 fw-bold`}>Bulacan State University</p>
                        <p className={`${css.head_cict}  m-0 mb-2 fw-bolder`}>
                           College of Information And Communication Technology
                        </p>
                        <p className={`${css.head} m-0`}>Guinhwa City of Malolos</p>
                     </div>
                     <img
                        className="d-flex img-responsive"
                        src="/images/res/cict_logo.png"
                        alt=""
                        height={120}
                        width={120}
                     />
                  </div>
               </div>
               <div className="text-center mt-5">
                  <p className={`${css.head}  m-0 fw-bold`}>{examDetails.subject}</p>
                  <p className={`${css.head} m-0`}>Two-Dimentional Table of Specifications</p>
                  <p className={`${css.head}  m-0`}>{examDetails.title}</p>
               </div>
               <p className={`${css.head} m-0 text-center mt-4 fw-bold`}>{facultyUsername}</p>
               <div className="mt-2 d-flex flex-column align-items-center justify-content-center ">
                  <table className="table-bordered w-100">
                     <thead>
                        <tr>
                           <th className=" text-center p-2 py-3" rowSpan="2">
                              KNOWLEDGE
                              <br />
                              DIMENSION
                           </th>

                           <th colSpan="7" className="text-center py-3">
                              COGNITIVE PROCESS DIMENSION
                           </th>
                        </tr>

                        <tr>
                           <td className={`${css.cpd} col p-2`}>Remember</td>
                           <td className={`${css.cpd} col p-2`}>Understand</td>
                           <td className={`${css.cpd} col p-2`}>Apply</td>
                           <td className={`${css.cpd} col p-2`}>Analyze</td>
                           <td className={`${css.cpd} col p-2`}>Evaluate</td>
                           <td className={`${css.cpd} col p-2`}>Create</td>
                           <th className={`${css.cpd} col p-2`}>Total</th>
                        </tr>
                     </thead>

                     <tbody>
                        {/* FACTUAL */}
                        <tr>
                           <td className={`${css.kd_col} p-2`}>Factual</td>
                           {/* factual remember */}
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.a1 &&
                                 [...tableObject.a1.val].length > 0 &&
                                 [...tableObject.a1.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.a1.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.a2 &&
                                 [...tableObject.a2.val].length > 0 &&
                                 [...tableObject.a2.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.a2.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.a3 &&
                                 [...tableObject.a3.val].length > 0 &&
                                 [...tableObject.a3.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.a3.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.a4 &&
                                 [...tableObject.a4.val].length > 0 &&
                                 [...tableObject.a4.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.a4.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.a5 &&
                                 [...tableObject.a5.val].length > 0 &&
                                 [...tableObject.a5.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.a5.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.a6 &&
                                 [...tableObject.a6.val].length > 0 &&
                                 [...tableObject.a6.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.a6.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <th className={`${css.cpd} p-2 text-break`}>
                              {tableObject.a1 &&
                                 tableObject.a2 &&
                                 tableObject.a3 &&
                                 tableObject.a4 &&
                                 tableObject.a5 &&
                                 tableObject.a6 &&
                                 tableObject.a1.length_ +
                                    tableObject.a2.length_ +
                                    tableObject.a3.length_ +
                                    tableObject.a4.length_ +
                                    tableObject.a5.length_ +
                                    tableObject.a6.length_}
                           </th>
                        </tr>

                        {/* CONCEPTUAL */}
                        <tr>
                           <td className={`${css.kd_col} p-2`}>Conceptual</td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.b1 &&
                                 [...tableObject.b1.val].length > 0 &&
                                 [...tableObject.b1.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.b1.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.b2 &&
                                 [...tableObject.b2.val].length > 0 &&
                                 [...tableObject.b2.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.b2.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.b3 &&
                                 [...tableObject.b3.val].length > 0 &&
                                 [...tableObject.b3.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.b3.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.b4 &&
                                 [...tableObject.b4.val].length > 0 &&
                                 [...tableObject.b4.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.b4.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.b5 &&
                                 [...tableObject.b5.val].length > 0 &&
                                 [...tableObject.b5.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.b5.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.b6 &&
                                 [...tableObject.b6.val].length > 0 &&
                                 [...tableObject.b6.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.b6.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <th className={`${css.cpd} p-2 text-break`}>
                              {tableObject.b1 &&
                                 tableObject.b2 &&
                                 tableObject.b3 &&
                                 tableObject.b4 &&
                                 tableObject.b5 &&
                                 tableObject.b6 &&
                                 tableObject.b1.length_ +
                                    tableObject.b2.length_ +
                                    tableObject.b3.length_ +
                                    tableObject.b4.length_ +
                                    tableObject.b5.length_ +
                                    tableObject.b6.length_}
                           </th>
                        </tr>

                        {/* PROCEDURAL */}
                        <tr>
                           <td className={`${css.kd_col} p-2`}>Procedural</td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.c1 &&
                                 [...tableObject.c1.val].length > 0 &&
                                 [...tableObject.c1.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.c1.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.c2 &&
                                 [...tableObject.c2.val].length > 0 &&
                                 [...tableObject.c2.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.c2.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.c3 &&
                                 [...tableObject.c3.val].length > 0 &&
                                 [...tableObject.c3.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.c3.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.c4 &&
                                 [...tableObject.c4.val].length > 0 &&
                                 [...tableObject.c4.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.c4.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.c5 &&
                                 [...tableObject.c5.val].length > 0 &&
                                 [...tableObject.c5.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.c5.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.c6 &&
                                 [...tableObject.c6.val].length > 0 &&
                                 [...tableObject.c6.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.c6.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <th className={`${css.cpd} p-2 text-break`}>
                              {tableObject.c1 &&
                                 tableObject.c2 &&
                                 tableObject.c3 &&
                                 tableObject.c4 &&
                                 tableObject.c5 &&
                                 tableObject.c6 &&
                                 tableObject.c1.length_ +
                                    tableObject.c2.length_ +
                                    tableObject.c3.length_ +
                                    tableObject.c4.length_ +
                                    tableObject.c5.length_ +
                                    tableObject.c6.length_}
                           </th>
                        </tr>

                        {/* METACOGNITIVE */}
                        <tr>
                           <td className={`${css.kd_col} p-2`}>Metacognitive</td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.d1 &&
                                 [...tableObject.d1.val].length > 0 &&
                                 [...tableObject.d1.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.d1.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.d2 &&
                                 [...tableObject.d2.val].length > 0 &&
                                 [...tableObject.d2.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.d2.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.d3 &&
                                 [...tableObject.d3.val].length > 0 &&
                                 [...tableObject.d3.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.d3.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.d4 &&
                                 [...tableObject.d4.val].length > 0 &&
                                 [...tableObject.d4.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.d4.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.d5 &&
                                 [...tableObject.d5.val].length > 0 &&
                                 [...tableObject.d5.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.d5.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <td className={`${css.cpd} p-2 text-break`}>
                              {tableObject.d6 &&
                                 [...tableObject.d6.val].length > 0 &&
                                 [...tableObject.d6.val].map((val, i) => (
                                    <span>
                                       {i + 1 === [...tableObject.d6.val].length ? val : val + ", "}
                                    </span>
                                 ))}
                           </td>
                           <th className={`${css.cpd} p-2 text-break`}>
                              {tableObject.d1 &&
                                 tableObject.d2 &&
                                 tableObject.d3 &&
                                 tableObject.d4 &&
                                 tableObject.d5 &&
                                 tableObject.d6 &&
                                 tableObject.d1.length_ +
                                    tableObject.d2.length_ +
                                    tableObject.d3.length_ +
                                    tableObject.d4.length_ +
                                    tableObject.d5.length_ +
                                    tableObject.d6.length_}
                           </th>
                        </tr>

                        {/* TOTAL */}
                        <>
                           {tableObject.a1 &&
                              tableObject.a2 &&
                              tableObject.a3 &&
                              tableObject.a4 &&
                              tableObject.a5 &&
                              tableObject.a6 &&
                              tableObject.b1 &&
                              tableObject.b2 &&
                              tableObject.b3 &&
                              tableObject.b4 &&
                              tableObject.b5 &&
                              tableObject.b6 &&
                              tableObject.c1 &&
                              tableObject.c2 &&
                              tableObject.c3 &&
                              tableObject.c4 &&
                              tableObject.c5 &&
                              tableObject.c6 &&
                              tableObject.d1 &&
                              tableObject.d2 &&
                              tableObject.d3 &&
                              tableObject.d4 &&
                              tableObject.d5 &&
                              tableObject.d5 &&
                              tableObject.total && (
                                 <tr>
                                    <th className={`${css.kd_col} p-2`}>Total </th>

                                    <th className={`${css.cpd} p-2 text-break`}>
                                       {tableObject.a1.length_ +
                                          tableObject.b1.length_ +
                                          tableObject.c1.length_ +
                                          tableObject.d1.length_}
                                    </th>
                                    <th className={`${css.cpd} p-2 text-break`}>
                                       {tableObject.a2.length_ +
                                          tableObject.b2.length_ +
                                          tableObject.c2.length_ +
                                          tableObject.d2.length_}
                                    </th>
                                    <th className={`${css.cpd} p-2 text-break`}>
                                       {tableObject.a3.length_ +
                                          tableObject.b3.length_ +
                                          tableObject.c3.length_ +
                                          tableObject.d3.length_}
                                    </th>
                                    <th className={`${css.cpd} p-2 text-break`}>
                                       {tableObject.a4.length_ +
                                          tableObject.b4.length_ +
                                          tableObject.c4.length_ +
                                          tableObject.d4.length_}
                                    </th>
                                    <th className={`${css.cpd} p-2 text-break`}>
                                       {tableObject.a5.length_ +
                                          tableObject.b5.length_ +
                                          tableObject.c5.length_ +
                                          tableObject.d5.length_}
                                    </th>
                                    <th className={`${css.cpd} p-2 text-break`}>
                                       {tableObject.a6.length_ +
                                          tableObject.b6.length_ +
                                          tableObject.c6.length_ +
                                          tableObject.d6.length_}
                                    </th>

                                    <th className={`${css.cpd} p-2 text-break`}>
                                       {tableObject.total}
                                    </th>
                                 </tr>
                              )}
                        </>
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </>
   );
});
