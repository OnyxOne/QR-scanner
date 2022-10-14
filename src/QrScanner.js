// Private class fields and methods browser support:
// https://caniuse.com/mdn-javascript_classes_private_class_fields
// https://caniuse.com/mdn-javascript_classes_private_class_methods

class QRContentParser {
  #regex = undefined;
  #startSequence = '';
  #endSequence = '';

  constructor(options) {
    if (!options.startSequence) {
      throw Error('[QRContentParser] No start provided');
    }

    if (!options.endSequence) {
      throw Error('[QRContentParser] No end provided');
    }

    this.#startSequence = options.startSequence;
    this.#endSequence = options.endSequence;
    this.#regex = this.#createRegex(options.startSequence, options.endSequence);
  }

  parse(input) {
    if (!this.#test(input)) {
      console.log('[QRContentParser] Input is not valid');
      return null;
    }

    var withoutStart = input.replace(this.#startSequence, '');
    var withoutEnd = withoutStart.substr(0, withoutStart.length - this.#endSequence.length);
    return withoutEnd;    
  }

  #createRegex(startSequence, endSequence) {
    return new RegExp('^' + startSequence + '.*' + endSequence + '$');
  }

  #test(input) {
    return this.#regex.test(input);
  };
}

class QRContentListener {
  #contentParser = undefined;
  #startSequence = '';
  #endSequence = '';
  #state = -1;
  #sequence = '';
  #callback = undefined;
  #handler = undefined;

  constructor(options) {
    if (!options.onFoundValue) {
      throw Error('[QRContentListener] No callback provided');
    }

    this.#startSequence = options.startSequence;
    this.#endSequence = options.endSequence;
    this.#callback = options.onFoundValue;

    this.#contentParser = new QRContentParser({
      startSequence: options.startSequence,
      endSequence: options.endSequence,
    });
  }

  start() {
    console.log('[QRContentListener] start listening');
    this.#state = 0;
    this.#handler = this.#keyUpHandler.bind(this);
    document.addEventListener('keyup', this.#handler);
  }

  stop() {
    console.log('[QRContentListener] stop listening');
    this.#state = -1;
    document.removeEventListener('keyup', this.#handler);
  }

  #keyUpHandler(e) {
    if (this.#state === -1) {
      // Don't do anything when stopped
      return;
    }

    const key = e.key;

    if (key.length > 1) {
      // ignore special keys like 'Shift'
      return;
    }

    console.log('[QRContentListener] key up', e.key);
    this.#sequence += e.key;

    // Take action according to current state
    switch (this.#state) {
      case 0:
        this.#listenForStartSequence(key);
        break;
      case 1:
        this.#listenForEndSequence(key);
        break;
    }

    if (this.#state === 2) {
      this.#executeCallback();
    } 
  }

  #listenForStartSequence(key) {
    if (this.#sequence.includes(this.#startSequence)) {
      console.log('[QRContentListener] Found start sequence');
      this.#state = 1;
      this.#sequence = this.#startSequence;
      return;
    }
    // Make sure sequence never gets longer than search to avoid false positives
    if (this.#sequence.length > this.#endSequence.length) {
      this.#sequence = this.#sequence.substring(1, this.#sequence.length);
    }
  }

  #listenForEndSequence(key) {
    if (this.#sequence.includes(this.#endSequence)) {
      console.log('[QRContentListener] Found end sequence');
      this.#state = 2;
      return;
    } 
  }

  #executeCallback() {
    var value = this.#contentParser.parse(this.#sequence);
    this.#state = 0;
    this.#sequence = '';
    this.#callback(value, this);
  }
}

window.QRContentParser = QRContentParser;
window.QRContentListener = QRContentListener;
