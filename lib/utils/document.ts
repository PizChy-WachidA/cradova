import { cssProps } from "./css";

class Element {
  tagName: string;
  properties: Record<string, any> = {};
  children: string[] = [];
  nodeType = 1;
  nodeC = true;
  style: Record<string, string> = cssProps();
  constructor(tagName: string) {
    this.tagName = tagName;
    console.log("boohoo");
  }
  setAttribute(key: string, value: string) {
    if (key.includes("class")) {
      if (this.properties["class"]) {
        this.properties["class"] += " " + value;
      } else {
        this.properties["class"] = value;
      }
      return;
    }
    if (key === "innerText") {
      this.children.push(value);
      return;
    }
    if (typeof value === "function") {
      this.properties[key] = "(function " + value + ")()";
      return;
    }
    this.properties[key] = value;
  }
  getAttribute(key: string) {
    return this.properties[key];
  }
  forgeAttributes() {
    const attribs: string[] = [];
    for (const key in this.properties) {
      attribs.push(" " + key + '="' + this.properties[key] + '" ');
    }
    if (attribs.length) {
      return attribs.join("");
    } else {
      return "";
    }
  }
  forgeStyles() {
    const attribs: string[] = [];
    for (const key in this.style) {
      if (this.style[key]) {
        attribs.push("" + key + ":" + this.style[key] + "; ");
      }
    }
    if (attribs.length) {
      return ' style="' + attribs.join("") + '"';
    }
    return "";
  }
  appendChild(child: any) {
    if (child.html) {
      this.children.push(child.html);
    } else {
      this.children.push(child);
    }
  }

  get firstChild() {
    return this.children[0];
  }
  set innerHTML(val: string) {
    if (val === "") {
      this.children.length = 0;
    } else {
      this.children.length = 0;
      this.children.push(val);
    }
  }
  set innerText(val: string) {
    this.children.push(val);
  }
  get innerHTML() {
    return this.children.join("");
  }
  get html() {
    // console.log({ child: this.children.length, tag: this.tagName });
    return (
      "<" +
      this.tagName +
      this.forgeAttributes() +
      this.forgeStyles() +
      ">" +
      this.children.join("") +
      "</" +
      this.tagName +
      ">"
    );
  }
}

export default Element;
