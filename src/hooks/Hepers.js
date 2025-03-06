export const formatAddress = (address) => {
  if (!address) return '';

  // Split the address by both English and Arabic commas
  const addressParts = address.split(/[,،]/);

  // Extract the relevant parts, for example, parts 1 through 3
  const relevantParts = addressParts.slice(1, 3);

  // Join the relevant parts and return the formatted address
  return relevantParts.join(', ').trim();
};
export const isTextOverflowing = (text) => {
  // Create a temporary span to measure the text width
  const span = document.createElement("span");
  span.style.visibility = "hidden";
  span.style.whiteSpace = "nowrap";
  span.style.fontSize = "12px"; // Match the button's font size
  span.innerText = text;
  document.body.appendChild(span);

  // Measure the width of the text
  const textWidth = span.offsetWidth;
  document.body.removeChild(span);

  // Compare with the max width of the button (120px in this case)
  return textWidth > 120; // Adjust this value based on your button's max-width
};
