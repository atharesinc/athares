import validate from "validate.js";

export const validateLogin = ({ email, password }) => {
  return validate(
    { password, email },
    {
      password: {
        presence: { allowEmpty: false },
        length: {
          minimum: 6,
          tooShort: "must be at least 6 characters.",
        },
      },
      email: {
        presence: { allowEmpty: false },
        email: true,
      },
    }
  );
};
export const validateRegister = ({ email, password, firstName, lastName }) => {
  return validate(
    {
      password,
      email,
      firstName,
      lastName,
    },
    {
      password: {
        presence: { allowEmpty: false },
        length: {
          minimum: 6,
          tooShort: "must be at least 8 characters.",
        },
      },
      email: {
        presence: { allowEmpty: false },
        email: true,
      },
      firstName: {
        presence: { allowEmpty: false },
      },
      lastName: {
        presence: { allowEmpty: false },
      },
    }
  );
};

export const validateCircle = ({ name, preamble }) => {
  return validate(
    { name, preamble },
    {
      name: {
        presence: { allowEmpty: false },
      },
      preamble: {
        presence: { allowEmpty: false },
      },
    }
  );
};

export const validateChannel = ({ name }) => {
  return validate(
    { name },
    {
      name: {
        presence: { allowEmpty: false },
      },
    }
  );
};

export const validateNewRevision = ({ title, text }) => {
  return validate(
    { title, text },
    {
      title: {
        presence: { allowEmpty: false },
      },
      text: {
        presence: { allowEmpty: false },
      },
    }
  );
};

export const validateUpdatedRevision = ({ text }) => {
  return validate(
    { text },
    {
      text: {
        presence: { allowEmpty: false },
      },
    }
  );
};
