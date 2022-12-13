export default function styleParsedMessage(content: HTMLElement): HTMLElement {
  content.querySelectorAll("a").forEach((a) => {
    // set classes hover:underline and color-blue-500
    a.setAttribute("class", "hover:underline text-blue-500");
  });

  return content;
}
