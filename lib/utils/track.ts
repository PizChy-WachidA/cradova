import { frag } from "./fns";

// the global dispatcher
function cradovaDispatchTrack(nodes: any[], state?: Record<string, any>) {
  for (let i = 0; i < nodes.length; i++) {
    const element = nodes[i];
    if (!element) {
      continue;
    }
    if (typeof state === "object" && !Array.isArray(state)) {
      // updating the element's state
      for (const key in state) {
        // updating element styling
        if (key === "style") {
          for (const [k, v] of Object.entries(state[key])) {
            if (typeof element.style[k] !== "undefined" && k !== "src") {
              element.style[k] = v;
            } else {
              throw new Error(
                "✘  Cradova err : " + k + " is not a valid css style property"
              );
            }
          }
          continue;
        }

        if (typeof element.style[key] !== "undefined" && key !== "src") {
          element.style[key] = state[key];
          continue;
        }
        if (typeof element[key] === "function") {
          element[key].apply(element);
          continue;
        }
        // updating element's inner text
        if (key === "text") {
          element.innerText = state[key];
          continue;
        }
        // adding class name to element
        if (
          key === "class" &&
          typeof state[key] === "string" &&
          state[key] !== ""
        ) {
          const classes = state[key].split(" ");
          for (let i = 0; i < classes.length; i++) {
            if (classes[i]) {
              element.classList.add(classes[i]);
            }
          }
          continue;
        }
        //removing element element
        if (key === "remove") {
          if (element.parentElement) {
            element.parentElement?.removeChild(element);
          } else {
            element.remove();
          }
          continue;
        }

        // setting data attribute
        if (key.includes("$")) {
          element.setAttribute("data-" + key.split("$")[1], state[key]);
          continue;
        }

        // changing the element children tree
        if (key === "tree") {
          // replace the component tree
          element.innerHTML = "";
          element.appendChild(frag(state[key]));
          continue;
        }
        // trying to set other values
        try {
          if (typeof element[key] !== "undefined") {
            element[key] = state[key];
          } else {
            element[key] = state[key];
            if (
              key !== "for" &&
              key !== "text" &&
              key !== "class" &&
              !key.includes("aria")
            ) {
              console.error(" ✘  Cradova err:  invalid html attribute " + key);
            }
          }
        } catch (error) {
          console.error(" ✘  Cradova err: Cradova got ", state);
          console.error(" ✘  Cradova err:  ", error);
        }
      }
    } else {
      throw new TypeError(" ✘  Cradova err:   invalid state object" + state);
    }
  }
}

type stateType =
  | Partial<HTMLElement>
  | {
      class?: string;
      text?: string;
      style?: Partial<CSSStyleDeclaration>;
      tree?: Function | HTMLElement;
      remove?: boolean;
    };

/**
 * Send a new state to specified element with stateID
 *
 * @param stateID
 * @param state
 * @returns element(s)
 */

export function dispatch(
  stateID: string | Record<string, stateType>,
  state?: stateType
) {
  let ele;
  if (stateID instanceof HTMLElement) {
    ele = stateID;
  }
  let updated = undefined;
  if (typeof state === "undefined" && typeof stateID === "object" && !ele) {
    for (const [id, eachState] of Object.entries(stateID)) {
      const elements = document.querySelectorAll(
        "[data-cra-id=" + id + "]"
      ) as any;
      updated = elements.length === 1 ? elements[0] : elements;
      cradovaDispatchTrack(elements, eachState);
    }
  } else {
    if (typeof stateID === "string") {
      const elements = document.querySelectorAll(
        "[data-cra-id=" + stateID + "]"
      ) as any;
      if (elements.length) {
        updated = elements.length === 1 ? elements[0] : elements;
        // @ts-ignore
        if (!state?.cradovaDispatchTrackBreak) {
          cradovaDispatchTrack(elements, state);
        }
      }
    }
    if (ele) {
      cradovaDispatchTrack([ele] as any, state);
    }
  }
  return updated;
}