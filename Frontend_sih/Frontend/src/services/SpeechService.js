// A simple service to handle browser's Speech Synthesis API

const synth = window.speechSynthesis;

/**
 * Speaks the provided text.
 * @param {string} text - The text to be spoken.
 */
export const speak = (text) => {
  if (synth.speaking) {
    synth.cancel(); // Stop any currently speaking utterance
  }
  if (text !== '') {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1;
    utterance.rate = 1;
    synth.speak(utterance);
  }
};

/**
 * Stops the speech synthesis.
 */
export const stopSpeaking = () => {
  synth.cancel();
};