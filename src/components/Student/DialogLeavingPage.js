import React from "react";
import { Modal, Button } from "react-bootstrap";
import css from "./css/DialogLeavingPage.module.css";

// SOURCE OF THIS CODE
// https://codesandbox.io/s/objective-resonance-rizh7n?fontsize=14&hidenavigation=1&theme=dark&file=/src/Pages/Home.js:1019-1035
export const DialogLeavingPage = ({
   showDialog,
   setShowDialog,
   cancelNavigation,
   confirmNavigation,
}) => {
   return (
      <Modal show={showDialog} onHide={cancelNavigation}>
         <Modal.Header closeButton>
            <Modal.Title>Exit</Modal.Title>
         </Modal.Header>
         <Modal.Body>
            The exam is still ongoing. Your exam will be marked as attempted and not be submitted
            once you leave this page. You will receive no points.
         </Modal.Body>
         <Modal.Footer>
            <Button variant="secondary" onClick={cancelNavigation}>
               Cancel
            </Button>
            <Button variant="primary" onClick={confirmNavigation}>
               Continue
            </Button>
         </Modal.Footer>
      </Modal>
   );
};
