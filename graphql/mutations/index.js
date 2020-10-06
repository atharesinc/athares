import { gql } from "@apollo/client";

/*
  8base-updated mutations
*/

export const SIGN_UP = gql`
  mutation signup(
    $authProfileId: ID!
    $user: UserCreateInput!
    $password: String!
  ) {
    userSignUpWithPassword(
      authProfileId: $authProfileId
      password: $password
      user: $user
    ) {
      id
      email
    }
  }
`;

export const LOGIN = gql`
  mutation login($authProfileId: ID!, $email: String!, $password: String!) {
    userLogin(
      data: {
        authProfileId: $authProfileId
        email: $email
        password: $password
      }
    ) {
      auth {
        idToken
      }
      success
    }
  }
`;

/* Mutation for adding user with email */
// export const USER_SIGN_UP_MUTATION = gql`
//   mutation userSignUp($user: UserCreateInput!) {
//     userSignUp(user: $user) {
//       id
//       email
//     }
//   }
// `;

export const UPDATE_USER = gql`
  mutation(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $phone: String
    $uname: String
    $icon: String!
  ) {
    userUpdate(
      data: {
        id: $id
        firstName: $firstName
        lastName: $lastName
        phone: $phone
        uname: $uname
        icon: $icon
      }
    ) {
      id
      firstName
      lastName
      phone
      icon
      uname
    }
  }
`;

export const CREATE_CIRCLE = gql`
  mutation createCircle(
    $icon: String!
    $name: String!
    $preamble: String!
    $user: ID!
  ) {
    circleCreate(
      data: {
        icon: $icon
        name: $name
        preamble: $preamble
        users: { connect: { id: $user } }
        circlePermissions: {
          create: {
            useEmail: false
            useSMS: false
            usePush: false
            user: { connect: { id: $user } }
          }
        }
      }
    ) {
      id
      icon
      name
      preamble
    }
  }
`;

// use this with creating circle or when inviting users
// we also create a permission object for this circle and user
export const ADD_USER_TO_CIRCLE = gql`
  mutation addCircleToUser($circle: ID!, $user: ID!) {
    circleUpdate(data: { id: $circle, users: { connect: { id: $user } } }) {
      id
    }
    circlePermissionCreate(
      data: {
        amendments: false
        revisions: false
        useEmail: false
        usePush: true
        useSMS: false
        circle: { connect: { id: $circle } }
        user: { connect: { id: $user } }
      }
    ) {
      id
      user {
        id
      }
    }
  }
`;

export const CREATE_CHANNEL = gql`
  mutation createChannel(
    $name: String!
    $description: String
    $channelType: String!
    $circleId: ID!
  ) {
    channelCreate(
      data: {
        channelType: $channelType
        name: $name
        description: $description
        circle: { connect: { id: $circleId } }
      }
    ) {
      id
      name
    }
  }
`;

export const CREATE_DM_CHANNEL = gql`
  mutation createChannel(
    $name: String!
    $description: String
    $channelType: String!
    $id: ID!
  ) {
    channelCreate(
      data: {
        channelType: $channelType
        name: $name
        description: $description
        users: { connect: { id: $id } }
      }
    ) {
      id
      name
      description
      users {
        items {
          id
        }
      }
    }
  }
`;

export const ADD_CHANNEL_TO_CIRCLE = gql`
  mutation addChannelToCircle($channel: ID!, $circle: ID!) {
    circleUpdate(
      data: { id: $circle, channels: { connect: { id: $channel } } }
    ) {
      id
      name
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation createMessage(
    $text: String!
    $user: ID!
    $channel: ID!
    $file: String
  ) {
    messageCreate(
      data: {
        text: $text
        channel: { connect: { id: $channel } }
        user: { connect: { id: $user } }
        file: $file
      }
    ) {
      id
      text
      user {
        id
        icon
        firstName
        lastName
      }
      file
      createdAt
    }
  }
`;

// creates a new revision and casts the first vote
export const CREATE_REVISION = gql`
  mutation createRevision(
    $newText: String!
    $oldText: String
    $circle: ID!
    $user: ID!
    $title: String!
    $expires: DateTime!
    $voterThreshold: String!
    $hash: String!
    $repeal: Boolean!
  ) {
    revisionCreate(
      data: {
        newText: $newText
        oldText: $oldText
        circle: { connect: { id: $circle } }
        backer: { connect: { id: $user } }
        title: $title
        expires: $expires
        voterThreshold: $voterThreshold
        hash: $hash
        repeal: $repeal
        votes: { create: { user: { connect: { id: $user } }, support: true } }
      }
    ) {
      id
      passed
      amendment {
        id
      }
    }
  }
`;

// creates a revision from an existing amendment
export const CREATE_REVISION_FROM_AMENDMENT = gql`
  mutation createRevision(
    $newText: String!
    $oldText: String
    $circle: ID!
    $user: ID!
    $title: String!
    $amendment: ID
    $expires: DateTime!
    $voterThreshold: String!
    $hash: String!
    $repeal: Boolean!
  ) {
    revisionCreate(
      data: {
        newText: $newText
        oldText: $oldText
        circle: { connect: { id: $circle } }
        backer: { connect: { id: $user } }
        title: $title
        amendment: { connect: { id: $amendment } }
        expires: $expires
        voterThreshold: $voterThreshold
        hash: $hash
        repeal: $repeal
        votes: { create: { user: { connect: { id: $user } }, support: true } }
      }
    ) {
      id
      passed
      amendment {
        id
      }
    }
  }
`;

export const CREATE_VOTE = gql`
  mutation createVote($support: Boolean!, $user: ID!, $revision: ID!) {
    voteCreate(
      data: {
        support: $support
        user: { connect: { id: $user } }
        revision: { connect: { id: $revision } }
      }
    ) {
      id
    }
  }
`;

export const UPDATE_VOTE = gql`
  mutation updateVote($vote: ID!, $support: Boolean!) {
    voteUpdate(data: { id: $vote, support: $support }) {
      id
      support
    }
  }
`;

export const CREATE_AMENDMENT_FROM_REVISION = gql`
  mutation createAmendmentFromRevsion(
    $text: String!
    $revision: ID!
    $title: String!
    $circle: ID!
    $hash: String!
  ) {
    revisionUpdate(data: { id: $revision, passed: true }) {
      passed
      id
    }
    amendmentCreate(
      data: {
        text: $text
        title: $title
        circle: { connect: { id: $circle } }
        hash: $hash
      }
    ) {
      id
      title
    }
  }
`;

export const UPDATE_AMENDMENT_FROM_REVISION = gql`
  mutation createAmendmentFromRevsion(
    $text: String!
    $revision: ID!
    $title: String!
    $amendment: ID!
    $hash: String!
  ) {
    revisionUpdate(data: { id: $revision, passed: true }) {
      passed
      id
    }
    amendmentUpdate(
      data: { text: $text, title: $title, id: $amendment, hash: $hash }
    ) {
      id
      title
    }
  }
`;

export const UPDATE_AMENDMENT_FROM_REVISION_AND_DELETE = gql`
  mutation createAmendmentFromRevsion($revision: ID!, $amendment: ID!) {
    revisionUpdate(data: { id: $revision, passed: true }) {
      passed
      id
    }
    amendmentDelete(data: { id: $amendment }) {
      success
    }
  }
`;

export const DENY_REVISION = gql`
  mutation denyRevision($id: ID!) {
    revisionUpdate(data: { id: $id, passed: false }) {
      passed
      id
    }
  }
`;

export const DELETE_AMENDMENT = gql`
  mutation deleteAmendment($id: ID!) {
    amendmentDelete(data: { id: $id }) {
      success
    }
  }
`;

export const DELETE_USER_FROM_CIRCLE = gql`
  mutation($circle: ID!, $user: ID!, $permission: ID!) {
    circleUpdate(data: { id: $circle, users: { disconnect: { id: $user } } }) {
      id
    }
    circlePermissionDelete(filter: { id: $permission }) {
      success
    }
  }
`;

export const CREATE_KEY = gql`
  mutation($key: String!, $user: ID!, $channel: ID!) {
    keyCreate(
      data: {
        key: $key
        user: { connect: { id: $user } }
        channel: { connect: { id: $channel } }
      }
    ) {
      id
    }
  }
`;

/* this is for adding users to dm channels, otherwise they cant discover them */
export const ADD_USER_TO_CHANNEL = gql`
  mutation addUserToChannel($user: ID!, $channel: ID!) {
    channelUpdate(data: { id: $channel, users: { connect: { id: $user } } }) {
      id
    }
  }
`;

export const DELETE_USER_FROM_DM = gql`
  mutation deleteUserFromDM($channel: ID!, $user: ID!) {
    userUpdate(
      data: { id: $user, channels: { disconnect: { id: $channel } } }
    ) {
      id
      keys(filter: { channel: { id: { equals: $channel } } }) {
        items {
          id
        }
      }
    }
  }
`;

export const DELETE_USER_KEY = gql`
  mutation($id: ID!) {
    keyDelete(data: { id: $id }) {
      success
    }
  }
`;

export const UPDATE_CHANNEL_NAME = gql`
  mutation($id: ID!, $name: String!) {
    channelUpdate(data: { id: $id, name: $name }) {
      id
    }
  }
`;

/* User Permissions */
export const CREATE_USER_PREF = gql`
  mutation createUserPref($id: ID!) {
    userPrefCreate(
      data: {
        maySendMarketingEmail: true
        userDisabled: false
        user: { connect: { id: $id } }
      }
    ) {
      id
    }
  }
`;

export const UPDATE_AMENDEMENT_PERMISSION_FOR_CIRCLE = gql`
  mutation($flag: Boolean!, $id: ID!) {
    circlePermissionUpdate(data: { id: $id, amendments: $flag }) {
      id
      amendments
    }
  }
`;

/////////

export const UPDATE_REVISION_PERMISSION_FOR_CIRCLE = gql`
  mutation($flag: Boolean!, $id: ID!) {
    circlePermissionUpdate(data: { id: $id, revisions: $flag }) {
      id
      revisions
    }
  }
`;

export const UPDATE_EMAIL_PERMISSION_FOR_CIRCLE = gql`
  mutation($flag: Boolean!, $id: ID!) {
    circlePermissionUpdate(data: { id: $id, useEmail: $flag }) {
      id
      useEmail
    }
  }
`;

export const UPDATE_PUSH_PERMISSION_FOR_CIRCLE = gql`
  mutation($flag: Boolean!, $id: ID!) {
    circlePermissionUpdate(data: { id: $id, usePush: $flag }) {
      id
      usePush
    }
  }
`;
export const UPDATE_SMS_PERMISSION_FOR_CIRCLE = gql`
  mutation($flag: Boolean!, $id: ID!) {
    circlePermissionUpdate(data: { id: $id, useSMS: $flag }) {
      id
      useSMS
    }
  }
`;
export const UPDATE_ALLOW_MARKETING_EMAIL = gql`
  mutation($id: ID!, $flag: Boolean!) {
    userPrefUpdate(data: { id: $id, maySendMarketingEmail: $flag }) {
      id
      maySendMarketingEmail
    }
  }
`;

export const DELETE_CIRCLE_PERMISSION = gql`
  mutation($id: ID!) {
    circlePermissionDelete(data: { id: $id }) {
      success
    }
  }
`;

export const ADD_REVISION_TO_AMENDMENT = gql`
  mutation($revision: ID!, $amendment: ID!, $title: String!) {
    amendmentUpdate(
      data: {
        id: $amendment
        revision: { connect: { id: $revision } }
        title: $title
      }
    ) {
      id
    }
  }
`;

export const UPDATE_USER_GENERIC = gql`
  mutation($data: UserUpdateInput!) {
    userUpdate(data: $data) {
      id
      pub
      priv
    }
  }
`;

/* 
  DEPRECATED MUTATIONS

  These will not work since the switch to 8base, but they aren't necessary since 8base Auth0 handles auth management
*/

export const CREATE_USER = gql`
  mutation CREATE_USER(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $icon: String!
    $pub: String!
    $priv: String!
  ) {
    createUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      icon: $icon
      pub: $pub
      priv: $priv
    ) {
      id
      firstName
      lastName
      email
      icon
    }
  }
`;
export const CREATE_RESET_REQUEST = gql`
  mutation($token: String!, $email: String!) {
    createResetRequest(token: $token, email: $email) {
      id
    }
  }
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation($user: ID!, $password: String!) {
    updateUser(id: $user, password: $password) {
      id
    }
  }
`;

export const SIGNIN_USER = gql`
  mutation SIGNIN_USER($email: String!, $password: String!) {
    signinUser(email: $email, password: $password) {
      token
      userId
    }
  }
`;

export const CREATE_INVITE = gql`
  mutation($me: ID!, $other: String!, $circle: ID!, $hash: String!) {
    inviteCreate(
      data: {
        inviter: { connect: { id: $me } }
        invitee: $other
        circle: { connect: { id: $circle } }
        dateHash: $hash
      }
    ) {
      id
    }
  }
`;

export const UPDATE_INVITE = gql`
  mutation($id: ID!, $hasAccepted: Boolean!) {
    inviteUpdate(data: { id: $id, hasAccepted: $hasAccepted }) {
      id
      hasAccepted
    }
  }
`;

export const DELETE_INVITE = gql`
  mutation($id: ID!) {
    inviteDelete(data: { id: $id }) {
      success
    }
  }
`;

export const CREATE_WEB_SUB = gql`
  mutation($sub: Json!, $user: ID!) {
    createWebPushSubscription(subscription: $sub, userId: $user) {
      id
    }
  }
`;
export const DELETE_WEB_SUB = gql`
  mutation($id: ID!) {
    deleteWebPushSubscription(id: $id) {
      id
    }
  }
`;

/* not used directly, but occurrs when adding a user to a circle */
// export const CREATE_CIRCLE_PERMISSION = gql`
//   mutation($circle: ID!, $user: ID!) {
//     createCirclePermission(
//       amendments: false
//       revisions: false
//       useEmail: false
//       usePush: true
//       useSMS: false
//       circleId: $circle
//       userId: $user
//     ) {
//       id
//     }
//   }
// `;

export const DELETE_RESET_REQUEST = gql`
  mutation($id: ID!) {
    deleteResetRequest(id: $id) {
      success
    }
  }
`;

// Custom function Resolvers

export const CREATE_SIGNED_UPLOAD_LINK = gql`
  mutation($name: String!, $type: String!) {
    getSignedUrl(name: $name, type: $type) {
      url
    }
  }
`;

export const GET_REFRESH_TOKEN = gql`
  mutation($email: String!, $token: String!, $profileId: String!) {
    userRefreshToken(
      data: { email: $email, refreshToken: $token, authProfileId: $profileId }
    ) {
      idToken
      refreshToken
    }
  }
`;
