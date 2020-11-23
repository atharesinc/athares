import { Platform, Alert } from "react-native";

const shouldUseSweet = Platform.OS === "web";

const swal = shouldUseSweet ? require("sweetalert") : null;

const MeshAlert = async ({
  title,
  text = "",
  onSubmit = null,
  okayButtonName = null,
  icon = null,
}) => {
  if (shouldUseSweet) {
    let res = await swal({
      title,
      text,
      icon,
      buttons: [true, okayButtonName || "OK"],
    });

    if (res && onSubmit) {
      onSubmit(res);
    }
    return;
  }
  Alert.alert(
    title,
    text,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: okayButtonName || "OK",
        onPress: onSubmit ? () => onSubmit(true) : null,
      },
    ],
    { cancelable: true }
  );
};

export default MeshAlert;

// full example of buttons property config
// buttons: {
//   cancel: {
//     text: "Cancel",
//     value: null,
//     visible: false,
//     className: "",
//     closeModal: true,
//   },
//   confirm: {
//     text: "OK",
//     value: true,
//     visible: true,
//     className: "",
//     closeModal: true
//   }
// }

// EXAMPLE USAGE
// All properties are optional except for title
// MeshAlert({
//   title: 'Title',
//   text: 'example',
//   onSubmit: (val) => {
//     console.log('hellor', val);
//   },
//   okayButtonName: 'wowowo',
//   icon: 'success',
// });
