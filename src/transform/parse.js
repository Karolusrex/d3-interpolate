import decompose, { identity } from "./decompose";

var cssNode, cssRoot, cssView, svgNode;

function parseCssWithDOM(value) {
  if (!cssNode)
    (cssNode = document.createElement("DIV")),
      (cssRoot = document.documentElement),
      (cssView = document.defaultView);
  cssNode.style.transform = value;
  value = cssView
    .getComputedStyle(cssRoot.appendChild(cssNode), null)
    .getPropertyValue("transform");
  cssRoot.removeChild(cssNode);
  return value.slice(7, -1).split(",");
}

function parseCssWithoutDOM(string) {
  if (window.DOMMatrix) {
    const matrix = new DOMMatrix(string);
    return [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f];
  }
  return [];
}
export function parseCss(value) {
  if (value === "none") return identity;
  let parsedValue;
  try {
    parsedValue = parseCssWithoutDOM(value);
  } catch (error) {/* Do nothing */}
  if (!parsedValue || !parsedValue.length) parsedValue = parseCssWithDOM(value);
  return decompose(
    parsedValue[0],
    parsedValue[1],
    parsedValue[2],
    parsedValue[3],
    parsedValue[4],
    parsedValue[5]
  );
}

export function parseSvg(value) {
  if (value == null) return identity;
  if (!svgNode)
    svgNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svgNode.setAttribute("transform", value);
  if (!(value = svgNode.transform.baseVal.consolidate())) return identity;
  value = value.matrix;
  return decompose(value.a, value.b, value.c, value.d, value.e, value.f);
}
