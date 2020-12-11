import React, { memo } from "react";
import SwitchLine from "../../components/SwitchLine";

import { UPDATE_CIRCLE_PREF } from "../../graphql/mutations";
import { useMutation } from "@apollo/client";

export default memo(function SwitchLineWithQuery({ label, value, pref, id }) {
  const [_updateCirclePref] = useMutation(UPDATE_CIRCLE_PREF);

  const updatePref = async (flag) => {
    await _updateCirclePref({
      variables: {
        data: {
          id: id,
          [pref]: flag,
        },
      },
    });
  };

  return <SwitchLine label={label} value={value} onPress={updatePref} />;
});
