export default function styleParsedMessage(content: HTMLElement): HTMLElement {
  content.querySelectorAll("a").forEach((a) => {
    // set classes hover:underline and color-blue-500
    a.setAttribute("class", "hover:underline text-blue-500");
  });

  // add some base styling for a code block
  content.querySelectorAll("pre").forEach((pre) => {
    pre.setAttribute("class", "bg-gray-800 p-4 text-purple-400 rounded-md");
  });

  // add some base styling for a code block
  content.querySelectorAll("code").forEach((code) => {
    // style the code block for a dark mode with purples
    code.setAttribute("class", "bg-gray-800 text-red-400 p-2 rounded-md");
  });

  return content;
}
