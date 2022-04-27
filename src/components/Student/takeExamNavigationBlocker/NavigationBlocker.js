import * as React from "react";
import { UNSAFE_NavigationContext } from "react-router-dom";

// SOURCE OF THIS CODE
// https://codesandbox.io/s/objective-resonance-rizh7n?fontsize=14&hidenavigation=1&theme=dark&file=/src/Pages/Home.js:1019-1035
export function NavigationBlocker(navigationBlockerHandler, canShowDialogPrompt) {
   const navigator = React.useContext(UNSAFE_NavigationContext).navigator;

   React.useEffect(() => {
      if (!canShowDialogPrompt) return;

      // For me, this is the dark part of the code
      // maybe because I didn't work with React Router 5,
      // and it emulates that
      const unblock = navigator.block((tx) => {
         const autoUnblockingTx = {
            ...tx,
            retry() {
               unblock();
               tx.retry();
            },
         };

         navigationBlockerHandler(autoUnblockingTx);
      });

      return unblock;
   });
}
