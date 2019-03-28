module.exports = (fn, errorMsg = '') => {
  const didNotThrowError = new Error('Expect function to raise an error but nothing was raised!');
  try {
    fn();
    throw didNotThrowError;
  } catch (e) {
    if (e === didNotThrowError) throw didNotThrowError;
    if (!errorMsg || e.message === errorMsg) return true;

    throw new Error('The error message is different from what I was expecting!.' +
      `\n\nFound: ${e.message}\nWanted: ${errorMsg}`);
  }
};
