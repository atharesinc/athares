import { useEffect, useGlobal, useRef, useState } from "reactn";

import { unixTime } from "../utils/transform";
import {
  CREATE_AMENDMENT_FROM_REVISION,
  DENY_REVISION,
  UPDATE_AMENDMENT_FROM_REVISION,
  UPDATE_AMENDMENT_FROM_REVISION_AND_DELETE,
} from "../graphql/mutations";
import { GET_ACTIVE_REVISIONS_BY_USER_ID } from "../graphql/queries";
import { SUB_TO_USERS_REVISIONS } from "../graphql/subscriptions";

import { useMutation, useSubscription } from "@apollo/client";
import { sha } from "../utils/crypto";
import useImperativeQuery from "../utils/useImperativeQuery";

export default function RevisionMonitor() {
  const [candidates, setCandidates] = useState([]);
  const checkItemsTimer = useRef(false);
  const [user] = useGlobal("user");

  const queryRevisions = useImperativeQuery(GET_ACTIVE_REVISIONS_BY_USER_ID);

  const [deleteAmendment] = useMutation(
    UPDATE_AMENDMENT_FROM_REVISION_AND_DELETE
  );
  const [updateAmendment] = useMutation(UPDATE_AMENDMENT_FROM_REVISION);
  const [createAmendmentFromRevision] = useMutation(
    CREATE_AMENDMENT_FROM_REVISION
  );

  const [denyRevision] = useMutation(DENY_REVISION);

  const { data: sub, error } = useSubscription(SUB_TO_USERS_REVISIONS, {
    variables: { id: user || "" },
    onSubscriptionData,
  });

  function onSubscriptionData({ subscriptionData }) {
    if (
      subscriptionData.data &&
      candidates.findIndex(
        (c) => c.id === subscriptionData.data.Revisions.node.id
      ) === -1
    ) {
      // fire off query again  vs. just add the new value to candidates
      queryRevisions({ id: user }).then(({ data }) => {
        setCandidates(getFlatRevisions(data));
      });
    }
  }

  // kick off this whole thing
  useEffect(() => {
    if (user) {
      queryRevisions({ id: user }).then(({ data }) => {
        setCandidates(getFlatRevisions(data));
      });
    }
    return () => {
      clearInterval(checkItemsTimer.current);
    };
  }, [user]);

  useEffect(() => {
    if (candidates.length > 0) {
      getNext();
    }
    return () => {
      clearInterval(checkItemsTimer.current);
    };
  }, [candidates]);

  function getFlatRevisions(data) {
    return data.user.circles.items
      .map((c) => c.revisions.items.map((r) => ({ ...r, circle: c.id })))
      .flat(1);
  }
  // function getAllRevisions() {
  //   return data.user.circles.items
  //     .map((c) => c.revisions.items.map((r) => ({ ...r, circle: c.id })))
  //     .flat(1);
  // }

  function getNext() {
    console.log("getting the next revision");
    clearTimeout(checkItemsTimer.current);
    let now = unixTime();

    if (!user) {
      return false;
    }

    let revisions = candidates;
    console.log("we got these many to go through", revisions.length);

    let items = revisions.sort(
      (a, b) => unixTime(a.expires) - unixTime(b.expires)
    );

    if (items.length === 0) {
      return;
    }

    // find soonest ending item, see if it has expired
    for (let i = 0, j = items.length; i < j; i++) {
      console.log("checking this one", items[i]);
      if (unixTime(items[i].expires) <= now) {
        // process this item
        console.log("checking if pass!");
        checkIfPass(items[i]);
        break;
      } else if (unixTime(items[i].expires) > now) {
        // there aren't any revisions that need to be processed, set a timer for the soonest occurring one
        let time = unixTime(items[i].expires) - now;
        console.log("none to check");
        checkItemsTimer.current = setTimeout(getNext, time);
        break;
      }
    }
    return;
  }

  // a revision has expired or crossed the voter threshold
  // see if it has passed and becomes an amendment or fails and lives in infamy
  async function checkIfPass(revision) {
    try {
      // get the votes for this revision in this circle
      let {
        votes: { items: votes },
      } = revision;

      let supportVotes = votes.filter((v) => v.support === true);
      // // it passes because the majority of votes has been reached after the expiry period
      // AND enough people have voted to be representative of the population for a fair referendum

      if (
        supportVotes.length > votes.length / 2 &&
        unixTime() >= unixTime(revision.expires) &&
        votes.length >= revision.voterThreshold
      ) {
        console.log("this one has passed!");
        // if this revision is a repeal, update the revision like in updateAmendment but also delete amendment
        if (revision.repeal === true) {
          console.log("it has been repealed");
          await deleteAmendment({
            variables: {
              revision: revision.id,
              amendment: revision.amendment.id,
            },
          });
          // getNext();
        } else {
          // create a separate unique identifier to make sure our new amendment doesn't get created twice

          let hash = sha(
            JSON.stringify({
              id: revision.id,
              title: revision.title,
              text: revision.newText,
            })
          );
          console.log(revision, !!revision.amendment);
          if (revision.amendment) {
            console.log("updating amendment");

            await updateAmendment({
              variables: {
                amendment: revision.amendment.id,
                title: revision.title,
                text: revision.newText,
                revision: revision.id,
                circle: revision.circle,
                hash,
              },
            });
            // getNext();
          } else {
            console.log("creating new amendment");

            await createAmendmentFromRevision({
              variables: {
                title: revision.title,
                text: revision.newText,
                revision: revision.id,
                circle: revision.circle,
                hash,
              },
            });
            // getNext();
          }
        }
      } else {
        console.log("it failed!");
        // it fails and we ignore it forever
        await denyRevision({
          variables: {
            id: revision.id,
          },
        });
        // getNext();
      }

      // in any case, remove this one and start over
      setCandidates(candidates.filter((c) => c.id !== revision.id));
    } catch (e) {
      if (e.message.includes("'Amendment' has no item with id")) {
        return;
      }
      // TODO: catch error if hash unique constraint fails, because thats okay
      console.error(e);
    }
  }
  return null;
}

const exampleResponse = {
  data: {
    Revisions: {
      previousValues: null,
      mutation: "create",
      node: {
        circle: {
          id: "ckd64p7y600co07mp579r8mc3",
        },
        repeal: false,
        expires: "2020-07-29T02:27:04.367Z",
        passed: null,
        voterThreshold: "0",
        id: "ckd6qz8ut00ou07lbc7ckf6hk",
        title: "asdvasdvasdv",
        newText: "asdvasdv",
        oldText: null,
        amendment: null,
        votes: {
          items: [
            {
              id: "ckd6qz8wq00ow07lbd7xz9y2c",
              support: true,
            },
          ],
        },
      },
    },
  },
  error: null,
};
