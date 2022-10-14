# QR scanner

A library to listen to the input of a QR code scanner provided by Onyx One.

This repo provides 2 classes:

- QR Content Parser
- QR Content Listener

## QR Content Parser

This class will allow you to extract the **value** from the input received from the QR code scanner.

### Usage

```
// Create an instance
var listener = new QRContentListener({
  startSequence: startSequence,
  endSequence: endSequence,
  onFoundValue: onFoundValue
});
// Start listening
listener.start();
```

**startSequence:** The prefix programmed into the QR code scanner

**endSequence:** The suffix programmed into the QR code scanner

**onFoundValue:** The JS function that will be called after detecting a QR code scan. it receives 2 parameters: 

- **value:** The raw value from the QR code
- **self:** the instance created. Can be used to stop listening after a scan.