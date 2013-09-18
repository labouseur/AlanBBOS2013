/* ----------------------------------
   deviceDriverStatusBar.js
   
   Requires deviceDriver.js
   
   The device driver for the status bar hardware device.
   ---------------------------------- */

DeviceDriverStatusBar.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverStatusBar()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnStatusBarDriverEntry;
    this.isr = null;
    // "Constructor" code.
}

function krnStatusBarDriverEntry()
{
    // Initialization routine for the kernel-mode Status Bar Device Driver.
    this.status = "loaded";
    // More?
}

// Write a status message.
function updateStatusMessage(msg) {
	
}

// Updated the date/time portion of the display.
function updateClockDisplay(date_time) {

}