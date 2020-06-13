import { format, formatDistanceToNow, getUnixTime } from "date-fns";

export function fromNow(jsonDateString = new Date().toJSON()) {
  return (
    formatDistanceToNow(new Date(jsonDateString), { includeSeconds: true }) +
    " ago"
  );
}

export function parseDate(
  jsonDateString = new Date().toJSON(),
  textFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
) {
  return format(new Date(jsonDateString), textFormat);
}

// getUnixTime returns the number of seconds since 1970, so to grab those miliseconds we need to x1000
export function unixTime(jsonDateString = new Date().toJSON()) {
  return getUnixTime(new Date(jsonDateString)) * 1000;
}

export function insertBreaks(messages = []) {
  if (messages.length === 0) {
    return [];
  }

  let newArr = [];

  const parsed = "cccc, LLLL do";
  let mostRecentDay = parseDate(
    messages[messages.length - 1].createdAt,
    parsed
  );

  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const thisDay = parseDate(messages[i].createdAt, parsed);

    let shortArr = [];
    if (thisDay !== mostRecentDay) {
      shortArr.push({
        date: mostRecentDay,
        id: messages[i].id + "-" + mostRecentDay,
        user: {
          id: "",
        },
      });

      mostRecentDay = parseDate(messages[i].createdAt, parsed);
    }
    shortArr.push(messages[i]);
    newArr = [...shortArr, ...newArr];
  }

  // add the oldest day
  newArr.unshift({
    date: mostRecentDay,
    id: messages[0].id + "-" + mostRecentDay,
    user: {
      id: "",
    },
  });

  return newArr;
}
