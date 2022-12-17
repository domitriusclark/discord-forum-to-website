import { Handler, schedule } from "@netlify/functions";

const myHandler: Handler = async () => {
  fetch("https://api.netlify.com/build_hooks/639d1d0018290c31e7ff492d", {
    method: "POST",
  });

  return {
    statusCode: 200,
  };
};

const handler = schedule("@hourly", myHandler);

export { handler };
