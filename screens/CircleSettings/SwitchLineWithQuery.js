import React, { memo, useGlobal, useState } from "reactn";
import SwitchLine from "../../components/SwitchLine";

import MeshAlert from "../../utils/meshAlert";
import { GET_USER_ALLOW_PUSH } from "../../graphql/queries";

import { UPDATE_CIRCLE_PREF } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";

export default memo(function SwitchLineWithQuery({ label, value, pref, id }) {
  const [user] = useGlobal("user");
  const [valueTemp, setValueTemp] = useState(value);

  const [_updateCirclePref] = useMutation(UPDATE_CIRCLE_PREF, {
    refetchQueries: [
      {
        query: GET_USER_ALLOW_PUSH,
        variables: {
          id: user,
        },
        skip: !user,
      },
    ],
  });

  const updatePref = async (value) => {
    // optimisitically set value
    setValueTemp(value);

    if (value && pref.toLowerCase().includes("push")) {
      try {
        MeshAlert({
          title: "Enable Notifications?",
          text: `Select "Allow" to enable push notifications for this device`,
          onSubmit: async () => {
            // await getPushNotificationPermissions();
            await _updateCirclePref({
              variables: {
                data: {
                  id: id,
                  [pref]: value,
                },
              },
            });
            setValueTemp(true);
          },
          submitText: "Allow",
          icon: "info",
        });
      } catch (err) {
        if (err.includes("User denied permission to notifications")) {
          console.error("User denied permission to notifications");
        }
        setValueTemp(false);
      }
      return;
    }

    // Otherwise just let them update the permission
    await _updateCirclePref({
      variables: {
        data: {
          id: id,
          [pref]: value,
        },
      },
    });
    setValueTemp(value);
  };

  return <SwitchLine label={label} value={valueTemp} onPress={updatePref} />;
});
