import { createElement } from "../utils/dom.js";

const TITLE_ID = "cart-drawer-title";

/**
 * @param {string} title
 * @param {(Node | string)[]} children
 * @returns {HTMLElement}
 */
const createMessage = (title, children) =>
  createElement("div", {
    className: "cart-drawer__message",
    children: [
      createElement("h3", { className: "cart-drawer__message-title", text: title }),
      ...children,
    ],
  });

/**
 * @param {string} text
 * @returns {HTMLElement}
 */
const createText = (text) =>
  createElement("p", { className: "cart-drawer__text", text });

export const createCartDrawer = () => {
  const close = createElement("button", {
    className: "close-button",
    text: "×",
    attrs: { type: "button", "aria-label": "Close collection" },
  });

  const count = createElement("p", { className: "cart-drawer__count" });

  const header = createElement("div", {
    className: "cart-drawer__header",
    children: [
      createElement("div", {
        children: [
          createElement("h2", {
            className: "cart-drawer__title",
            text: "Your collection",
            attrs: { id: TITLE_ID },
          }),
          count,
        ],
      }),
      close,
    ],
  });

  const list = createElement("ul", { className: "cart-drawer__list" });

  const empty = createMessage("Your collection is empty", [
    createText("Add plants from the catalog and they will appear here."),
    createElement("a", {
      className: "button button--primary",
      text: "Browse plants",
      attrs: { href: "./catalog.html" },
    }),
  ]);

  const statusText = createText("");

  const retry = createElement("button", {
    className: "button button--secondary",
    text: "Try again",
    attrs: { type: "button" },
  });

  const status = createElement("div", {
    className: "cart-drawer__message",
    attrs: { role: "status" },
    children: [statusText, retry],
  });

  const doneText = createText("");

  const continueButton = createElement("button", {
    className: "button button--primary",
    text: "Continue shopping",
    attrs: { type: "button" },
  });

  const done = createMessage("Thank you!", [doneText, continueButton]);

  const body = createElement("div", {
    className: "cart-drawer__body",
    children: [list, empty, status, done],
  });

  const total = createElement("strong", { className: "cart-drawer__price" });

  const checkout = createElement("button", {
    className: "button button--primary",
    text: "Checkout",
    attrs: { type: "button" },
  });

  const footer = createElement("div", {
    className: "cart-drawer__footer",
    children: [
      createElement("p", {
        className: "cart-drawer__total",
        children: [createElement("span", { text: "Total" }), total],
      }),
      checkout,
      createElement("p", {
        className: "cart-drawer__note",
        text: "Demo checkout: nothing is charged and no order is placed.",
      }),
    ],
  });

  const dialog = /** @type {HTMLDialogElement} */ (
    createElement("dialog", {
      className: "cart-drawer",
      attrs: { "aria-labelledby": TITLE_ID },
      children: [
        createElement("div", {
          className: "cart-drawer__panel",
          children: [header, body, footer],
        }),
      ],
    })
  );

  return {
    dialog,
    elements: {
      close,
      count,
      list,
      footer,
      total,
      checkout,
      retry,
      statusText,
      doneText,
      continueButton,
      views: { items: list, empty, status, done },
    },
  };
};
