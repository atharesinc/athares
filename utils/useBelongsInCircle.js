import { useQuery } from "@apollo/client";
import { IS_USER_IN_CIRCLE } from "../graphql/queries";

// TODO: This needs some memoization, BUT in the case where a user leaves a circle,
// the memoized value would be incorrect. There needs to be some thought on how to deal with that

// hook to check if the user belongs to this circle
export default function ({ user, circle }) {
  let belongsToCircle = false;
  const { data: belongsToCircleData } = useQuery(IS_USER_IN_CIRCLE, {
    variables: {
      circle,
      user,
    },
  });

  if (
    belongsToCircleData?.circlesList &&
    belongsToCircleData.circlesList.items.length !== 0 &&
    belongsToCircleData.circlesList.items[0].id === circle
  ) {
    belongsToCircle = true;
  }

  return belongsToCircle;
}
