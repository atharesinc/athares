const Buffer = require("buffer/").Buffer;

// for uploading files, accepts a uri filepath or base64
export const processFile = ({ uri, name = null }) => {
  let ext = getImageFileExtension(uri);
  let type = "application";
  // see if file is image, video, or otherwise

  const imgs = ["gif", "png", "jpg", "jpeg", "bmp"];
  const videos = ["mp4", "webm", "mkv", "3gp", "mov", "m4v"];

  if (imgs.indexOf(ext.toLowerCase()) !== -1) {
    type = "image";
  } else if (videos.indexOf(ext.toLowerCase()) !== -1) {
    type = "video";
  }

  const file = {
    uri,
    name: generateUUID(name, ext),
    type: type + "/" + ext,
  };

  return file;
};

// attach auth token and some other way to make sure only this function can call this url
export async function uploadToAWS(signedLink, file) {
  // // SIGNED UPLOAD WITH XHR
  if (/^data:.+;base64/.test(file.uri)) {
    file.buffer = Buffer.from(
      file.uri.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
  }

  // promisify the xmhttprequest because fetch didn't work for me =(
  return new Promise((resolve) => {
    console.log({ signedLink, file });
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedLink);
    xhr.setRequestHeader("Content-Type", file.type + "; charset=utf-8");
    xhr.setRequestHeader("X-Amz-ACL", "public-read");

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // resolve(xhr);
          resolve(
            "https://athares-images.s3.us-east-2.amazonaws.com/uploads/" +
              file.name
          );
        } else {
          throw "Could not upload file";
        }
      }
    };
    xhr.send(file.buffer ? file.buffer : file);
  });
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

function generateUUID(name = null, ext) {
  return (
    (name ? name + "-" : "") +
    (new Date().getTime() +
      "-" +
      Math.random().toString(16).replace(".", "") +
      "." +
      ext)
  );
}
