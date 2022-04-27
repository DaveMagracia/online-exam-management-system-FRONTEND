// THIS FILE WILL SAVE THE STATE OF THE SIDEBAR IF IT IS OPEN OR CLOSED
// THIS IS FOR THE SIDEBAR TO REMAIN OPEN OR CLOSED AS THE USER NAVIGATES THROUGH THE WEBPAGES
// BECAUSE THE SIDEBAR LOSES ITS STATE ONCE THE SIDEBAR REMOUNTS/RELOADS
var isOpen = true;

const saveSidebarState = (state) => {
   isOpen = state;
};

const getSidebarState = () => {
   return isOpen;
};

module.exports = {
   saveSidebarState,
   getSidebarState,
};
