function checkFlexGap() {
  // Create flex container with row-gap set
  const flex = document.createElement("div");
  flex.style.display = "flex";
  flex.style.flexDirection = "column";
  flex.style.rowGap = "1px";
  flex.style.position = "absolute";
  flex.style.top = "0";
  flex.style.left = "-1000px";
  flex.style.visibility = "hidden";

  // Create two elements inside it
  flex.appendChild(document.createElement("div"));
  flex.appendChild(document.createElement("div"));

  // Append to DOM (needed to obtain scrollHeight)
  document.body.appendChild(flex);

  // Flex container should be 1px high from the row-gap
  const isSupported = flex.scrollHeight === 1;
  document.body.removeChild(flex);

  return isSupported;
}

(function () {
  // Only run if not already checked
  if (
    document.documentElement.classList.contains("flexbox-gap") ||
    document.documentElement.classList.contains("no-flexbox-gap")
  ) {
    return;
  }

  if (!checkFlexGap()) {
    document.documentElement.classList.add("no-flexbox-gap");
  } else {
    document.documentElement.classList.add("flexbox-gap");
  }
})();
