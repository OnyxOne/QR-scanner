// This is an example implementation

var onlyScanOnce = false;

// startSequence is the prefix programmed to the hardware
var startSequence = 'ff';
// startSequence is the suffix programmed to the hardware
var endSequence = '!!';

// Keep in mind that special characters in pre/suffix might cause issues
// due to keyboard layout. For example _ becomes ! on a mac keyboard.

// This is called when the listener detects a code scanned with above pre and suffix
function onFoundValue (value, self) {
  // Value is the content of the code without pre and suffix
  console.log('[App] found', value);

  document.getElementById('input').value = value;

  if (onlyScanOnce) {
    // self is the listener instance, you can make it stop or start listening with
    // self.stop(); / self.start();
    self.stop();
  }
}

// To use: 
// 1. create an instance
var listener = new QRContentListener({
  startSequence: startSequence,
  endSequence: endSequence,
  onFoundValue: onFoundValue
});
// 2. start listening
listener.start();
