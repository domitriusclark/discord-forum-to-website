import type {
  APIGuild,
  APIChannel,
  APIMessage,
  APIThreadList,
  APIThreadChannel,
  APIUser,
} from "discord-api-types/v9";

export async function createChannelInvite(
  channelId: string | number | undefined
) {
  try {
    const channel = await getChannel(channelId);
    const parent = channel.parent_id;
    const invite = await fetch(
      `https://discord.com/api/v9/channels/${parent}/invites`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${import.meta.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // infinite duration
          max_age: 0,
          max_uses: 0,
          temporary: false,
          validate: null,
        }),
      }
    ).then((res) => res.json());

    return invite;
  } catch (err) {
    console.log(err);
  }
}

// get guild from ID using REST endpoint and fetch
export async function getGuild() {
  try {
    const res = await fetch(
      `https://discord.com/api/v9/guilds/${import.meta.env.DISCORD_GUILD_ID}`,
      {
        headers: {
          Authorization: `Bot ${import.meta.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    const guild: APIGuild = await res.json();
    return guild;
  } catch (err) {
    console.log(err);
  }
}

export async function getUser(id: string) {
  const res = await fetch(`https://discord.com/api/v9/users/${id}`, {
    headers: {
      Authorization: `Bot ${import.meta.env.DISCORD_BOT_TOKEN}`,
    },
  });
  const user: APIUser = await res.json();

  return user;
}

export async function getChannelArchivedThreads(channelId: string) {
  try {
    const response = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/threads/archived/public`,
      {
        headers: {
          Authorization: `Bot ${import.meta.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const threads: APIThreadList = await response.json();

    async function sortThreads() {
      const sortedThreads = await Promise.all(
        threads.threads.map(async (thread: APIThreadChannel) => {
          const lastMessage = await getChannelMessage(
            thread.id,
            thread.last_message_id
          );
          return {
            ...thread,
            lastMessage,
          };
        })
      );

      const sorted = sortedThreads.sort(
        (a, b) =>
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
      );

      return sorted;
    }

    const sortedThreads = await sortThreads();

    return sortedThreads;
  } catch (err) {}
}

export async function getChannelMessage(channelId: string, messageId: string) {
  try {
    const response = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/messages/${messageId}`,
      {
        headers: {
          Authorization: `Bot ${import.meta.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const message: APIMessage = await response.json();
    return message;
  } catch (err) {
    console.log(err);
  }
}

// TODO: Come back and fix type issues with `activeThreadsFromForum`
export async function getGuildActiveThreads(forumChannel: APIChannel) {
  try {
    const response = await fetch(
      `https://discord.com/api/v9/guilds/${
        import.meta.env.DISCORD_GUILD_ID
      }/threads/active`,
      {
        headers: {
          Authorization: `Bot ${import.meta.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );

    const threads: APIThreadList = await response.json();

    const activeThreadsFromForum = threads.threads.filter(
      (thread: APIThreadChannel) => thread.parent_id === forumChannel.id
    );

    // Create a function that will sort the acriveThreadsFromForum, get the last message sent, and sort the array by message timestamp
    async function sortThreads() {
      const sortedThreads = await Promise.all(
        activeThreadsFromForum.map(async (thread: APIThreadChannel) => {
          const lastMessage = await getChannelMessage(
            thread.id,
            thread.last_message_id
          );
          return {
            ...thread,
            lastMessage,
          };
        })
      );

      const sorted = sortedThreads.sort(
        (a, b) =>
          new Date(b.lastMessage.timestamp).getTime() -
          new Date(a.lastMessage.timestamp).getTime()
      );

      return sorted;
    }

    const sortedThreads = await sortThreads();

    return sortedThreads;
  } catch (err) {
    console.log(err);
  }
}

export async function getChannelMessages(
  channelId: string | number | undefined
) {
  try {
    const response = await fetch(
      `https://discord.com/api/v9/channels/${channelId}/messages`,
      {
        headers: {
          Authorization: `Bot ${import.meta.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const messages: APIMessage[] = await response.json();
    return messages;
  } catch (err) {
    console.log(err);
  }
}

export async function getChannel(channelId: string | number | undefined) {
  try {
    const response = await fetch(
      `https://discord.com/api/v9/channels/${channelId}`,
      {
        headers: {
          Authorization: `Bot ${import.meta.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const channel: APIChannel = await response.json();
    return channel;
  } catch (err) {
    console.log(err);
  }
}

export async function getGuildChannels() {
  try {
    const response = await fetch(
      `https://discord.com/api/v9/guilds/${
        import.meta.env.DISCORD_GUILD_ID
      }/channels`,
      {
        headers: {
          Authorization: `Bot ${import.meta.env.DISCORD_BOT_TOKEN}`,
        },
      }
    );
    const channels = await response.json();

    return channels;
  } catch (err) {
    console.log(err);
  }
}

export function getForum(channels: APIChannel[]) {
  // 15 is the channel type for Forum Channels
  const forum = channels.find(
    (channel: APIChannel) =>
      channel.type === 15 && channel.name === import.meta.env.CHANNEL_NAME
  );

  if (!forum) {
    throw new Error(`Could not find channel ${import.meta.env.CHANNEL_NAME}`);
  }

  return forum;
}
