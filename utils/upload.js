import getEnvVars from "../env";
const Buffer = require("buffer/").Buffer;

const { AUTH_URL, APP_VERSION } = getEnvVars();

// for uploading images, accepts a uri filepath or base64
export const processImage = ({ uri }) => {
  let ext = getImageFileExtension(uri);

  const file = {
    uri,
    name: generateUUID(ext),
    type: "image/" + ext,
  };

  return file;
};

// for uploading everything except images
export const uploadDocument = async ({ uri, name }) => {
  try {
    let ext = getImageFileExtension(name);

    const file = {
      uri,
      name: generateUUID(ext),
      type: `application/${ext}`,
    };

    let res = await uploadToAWS(file);

    if (res.error) {
      throw res.error;
    }
    return res;
  } catch (err) {
    throw err;
  }
};

// attach auth token and some other way to make sure only this function can call this url
export async function uploadToAWS(signedLink, file) {
  try {
    // // SIGNED UPLOAD WITH XHR
    if (/^data:.+;base64/.test(file.uri)) {
      file.buffer = Buffer.from(
        file.uri.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
    }

    // promisify the xmhttprequest because fetch didn't work for me =(
    await new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedLink);
      xhr.setRequestHeader("Content-Type", file.type + "; charset=utf-8");
      xhr.setRequestHeader("X-Amz-ACL", "public-read");

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(xhr);
          } else {
            throw "Could not upload file";
          }
        }
      };
      xhr.send(file.buffer ? file.buffer : file);
    });

    return (
      "https://athares-images.s3.us-east-2.amazonaws.com/uploads/" + file.name
    );
  } catch (err) {
    throw err;
  }
}

function getImageFileExtension(filename) {
  // if base64, get the file type from the 'header'
  if (/^data:.+;base64/.test(filename)) {
    return /^data:.+\/(.+);base64/.exec(filename)[1];
  }

  let extension =
    filename.substring(filename.lastIndexOf(".") + 1, filename.length) ||
    filename;
  return extension.toLowerCase() === "jpeg" ? "jpg" : extension.toLowerCase();
}

function generateUUID(ext) {
  return (
    new Date().getTime() +
    "-" +
    Math.random().toString(16).replace(".", "") +
    "." +
    ext
  );
}
