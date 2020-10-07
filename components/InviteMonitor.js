import { useGlobal, useEffect } from "reactn";
import { subDays } from "date-fns";
import { useSubscription } from "@apollo/client";

import { GET_MY_INVITES } from "../graphql/queries";
import { SUB_TO_INVITES } from "../graphql/subscriptions";
import useImperativeQuery from "../utils/useImperativeQuery";

export default function InviteMonitor() {
  const [user] = useGlobal("user");
  const [, setInvites] = useGlobal("invites");
  const queryRevisions = useImperativeQuery(GET_MY_INVITES);

  useSubscription(SUB_TO_INVITES, {
    variables: { user: user || "" },
    onSubscriptionData,
  });

  function onSubscriptionData({ subscriptionData }) {
    if (subscriptionData.data && subscriptionData.data.Invites.node) {
      // fire off query again  vs. just add the new value to candidates?
      getInvites();
    }
  }

  const getInvites = () => {
    queryRevisions({
      id: user || "",
      minDate:
        subDays(new Date(), 1).toJSON().substring(0, 10) + "T00:00:00.000Z",
    }).then(({ data }) => {
      console.log("im getting called!", data);
      setInvites(data.invitesList.items.map((i) => i.id));
    });
  };

  useEffect(() => {
    if (user) {
      getInvites();
    }
  }, [user]);
  return null;
}

// const exampleResponse = {
//   data: {
//     Invites: {
//       node: {
//         id: "ckfyvtbie009m07lbdz4r5va4",
//         inviter: {
//           id: "ckdhvv9eh007t07megt8f8hff",
//           firstName: "Test",
//           lastName: "Test",
//         },
//         createdAt: "2020-10-07T04:18:22.983Z",
//         circle: {
//           id: "ckdhvwcs900dm07jlgmo205k0",
//           name: "Athares Inc.",
//         },
//       },
//     },
//   },
//   error: null,
// };
