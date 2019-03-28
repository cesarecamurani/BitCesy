module.exports = (a, b) => {
  if (a.includes(b))
    return true;
  throw new Error(`Object 1 does not include Object 2.\n\nFound: ${a}\nWanted: ${b}`);
};
