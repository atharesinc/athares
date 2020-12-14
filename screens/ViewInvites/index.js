import React, { useGlobal, useState } from "reactn";

import {
  ScrollView,
  StyleSheet,
  // View
} from "react-native";
import { subDays } from "date-fns";

import { GET_MY_INVITES } from "../../graphql/queries";
import {
  UPDATE_INVITE,
  ADD_USER_TO_CIRCLE,
  DELETE_INVITE,
} from "../../graphql/mutations";

import { useQuery, useMutation } from "@apollo/client";

// import SwitchLine from "../../components/SwitchLine";
import Title from "../../components/Title";
import DisclaimerText from "../../components/DisclaimerText";
import InviteItem from "./InviteItem";

import CenteredLoaderWithText from "../../components/CenteredLoaderWithText";
import CenteredErrorLoader from "../../components/CenteredErrorLoader";

// import GlowButton from "../../components/GlowButton";

export default function ViewInvites() {
  const [user] = useGlobal("user");
  const [invites, setInvites] = useGlobal("invites");

  const [loadingState, setLoadingState] = useState({
    loading: false,
    id: null,
  });

  const { loading: loadingQuery, error, data } = useQuery(GET_MY_INVITES, {
    variables: {
      id: user,
      minDate:
        subDays(new Date(), 1).toJSON().substring(0, 10) + "T00:00:00.000Z",
    },
    skip: !user,
  });

  const refetchQueries = [
    {
      query: GET_MY_INVITES,
      skip: !user,
      variables: {
        id: user,
        minDate:
          subDays(new Date(), 1).toJSON().substring(0, 10) + "T00:00:00.000Z",
      },
    },
  ];

  const [updateInvite] = useMutation(UPDATE_INVITE, {
    refetchQueries,
  });

  const [deleteInvite] = useMutation(DELETE_INVITE, {
    refetchQueries,
  });

  const [addToCircle] = useMutation(ADD_USER_TO_CIRCLE);

  if (loadingQuery) {
    return <CenteredLoaderWithText text={"Getting Invites"} />;
  }

  // if (loading) {
  // return <CenteredLoaderWithText text={"Joining"} />;
  // }

  if (error) {
    return <CenteredErrorLoader text={"Error Getting Invites"} />;
  }

  const accept = async (id, circleId) => {
    try {
      setLoadingState({ loading: true, id });
      // accept the invite
      let p1 = await updateInvite({
        variables: {
          id,
          hasAccepted: true,
        },
      });

      // join the circle
      let p2 = addToCircle({
        variables: { circle: circleId, user },
      });

      await Promise.all([p1, p2]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingState({ loading: false, id: null });
      removeInvite(id);
    }
  };

  const removeInvite = (id) => {
    const newArr = invites.filter((i) => i !== id);
    setInvites(newArr);
  };

  const reject = async (id) => {
    try {
      setLoadingState({ loading: true, id });

      // deny the invite
      await deleteInvite({
        variables: {
          id,
        },
      });

      // thats it!
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingState({ loading: false, id: null });
      removeInvite(id);
    }
  };

  // const fakeData = [
  //   {
  //     id: "9a8s7d9fa87sdf",
  //     inviter: {
  //       id: "9s87df9b87",
  //       firstName: "Jim",
  //       lastName: "John",
  //     },
  //     createdAt: subDays(new Date(), 2).toJSON(),
  //     circle: {
  //       id: "98s7dfg9s87dfg",
  //       name: "Athares2",
  //     },
  //   },
  //   {
  //     id: "76cvb8n7c65v8b76",
  //     inviter: {
  //       id: "f98g7b6",
  //       firstName: "Allan",
  //       lastName: "Partridge",
  //     },
  //     createdAt: subDays(new Date(), 1).toJSON(),
  //     circle: {
  //       id: "98s7d6f9sdfgsdfg",
  //       name: "French Club",
  //     },
  //   },
  // ];
  return (
    <ScrollView contentContainerStyle={styles.wrapper}>
      <Title text={"Circle Invites"} />
      <DisclaimerText
        text={"Here you can accept or deny invitations to specific Circles"}
      />

      {data.invitesList.items.map((item) => (
        <InviteItem
          key={item.id}
          data={item}
          loading={loadingState.loading && item.id === loadingState.id}
          accept={accept}
          reject={reject}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "stretch",
    justifyContent: "flex-start",
    width: "100%",
    flex: 1,
    padding: 15,
  },
  marginTop: { marginTop: 20 },
});
