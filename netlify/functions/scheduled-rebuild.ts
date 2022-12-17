import { Handler, schedule } from "@netlify/functions";

const myHandler: Handler = async () => {
  fetch("https://api.netlify.com/build_hooks/639d1e25ca15d528a170336e", {
    method: "POST",
  });

  return {
    statusCode: 200,
  };
};

const handler = schedule("@daily", myHandler);

export { handler };
