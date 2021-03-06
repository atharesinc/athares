import { gql } from "@apollo/client";

export const GET_ALL_NOTICES = gql`
  {
    noticesList {
      items {
        id
        title
        text
        createdAt
        circle {
          id
        }
      }
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query getUserById($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      icon
      pub
    }
  }
`;

export const GET_USER_BY_ID_WITH_PRIV = gql`
  query getUserById($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      icon
      pub
      priv
    }
  }
`;

export const GET_USER_BY_EMAIL = gql`
  query($email: String!) {
    user(email: $email) {
      id
    }
  }
`;

export const GET_USER_BY_ID_ALL = gql`
  query getUserByIdAll($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      icon
      uname
      createdAt
      circles {
        items {
          id
        }
      }
      revisions {
        items {
          id
          passed
        }
      }
      votes {
        items {
          id
        }
      }
    }
  }
`;

export const GET_CIRCLES_BY_USER_ID = gql`
  query getCirclesByUserId($id: ID!) {
    user(id: $id) {
      id
      circles {
        items {
          id
          icon
          name
        }
      }
    }
  }
`;

export const GET_CHANNELS_BY_CIRCLE_ID = gql`
  query getChannelsByCircleId($id: ID!) {
    circle(id: $id) {
      id
      name
      preamble
      channels {
        items {
          id
          name
          channelType
          createdAt
        }
      }
    }
  }
`;

export const GET_CIRCLE_NAME_BY_ID = gql`
  query getCircleNameById($id: ID!) {
    circle(id: $id) {
      id
      name
    }
  }
`;

export const GET_CHANNEL_NAME_BY_ID = gql`
  query getChannelNameById($id: ID!) {
    channel(id: $id) {
      id
      name
    }
  }
`;

export const GET_MESSAGES_FROM_CHANNEL_ID = gql`
  query getMessagesByChannelId($id: ID!, $skip: Int!) {
    channel(id: $id) {
      id
      name
      description
      messages(skip: $skip, last: 20) {
        items {
          id
          text
          createdAt
          file
          user {
            id
            icon
            firstName
            lastName
          }
        }
      }
    }
  }
`;

export const GET_AMENDMENTS_FROM_CIRCLE_ID = gql`
  query getAmendmentsFromCircleId($id: ID!) {
    circle(id: $id) {
      id
      name
      users {
        items {
          id
        }
      }
      preamble
      amendments {
        items {
          id
          title
          text
          createdAt
          updatedAt
          revision {
            id
            passed
          }
        }
      }
    }
  }
`;

export const GET_REVISION_BY_ID = gql`
  query getRevisionById($id: ID!) {
    revision(id: $id) {
      id
      circle {
        id
      }
      repeal
      title
      oldText
      newText
      passed
      voterThreshold
      expires
      createdAt
      amendment {
        id
      }
      backer {
        id
        icon
        firstName
        lastName
      }
      votes {
        items {
          id
          updatedAt
          support
          user {
            id
          }
        }
      }
    }
  }
`;

export const GET_REVISIONS_FROM_CIRCLE_ID = gql`
  query getRevisionsFromCircleId($id: ID!) {
    circle(id: $id) {
      id
      name
      preamble
      revisions {
        items {
          passed
          backer {
            id
            icon
          }
          repeal
          expires
          voterThreshold
          id
          title
          newText
          createdAt
          amendment {
            id
          }
          votes {
            items {
              support
            }
          }
        }
      }
    }
  }
`;

export const GET_ACTIVE_REVISIONS_BY_USER_ID = gql`
  query getActiveRevisionsByUserId($id: ID!) {
    user(id: $id) {
      id
      circles {
        items {
          id
          revisions(filter: { passed: { is_empty: true } }) {
            items {
              repeal
              expires
              passed
              voterThreshold
              id
              title
              newText
              oldText
              amendment {
                id
              }
              votes {
                items {
                  id
                  support
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const SEARCH_FOR_USER = gql`
  query searchForUser($text: String!) {
    usersList(
      filter: {
        OR: [
          { firstName: { contains: $text } }
          { lastName: { contains: $text } }
          { email: { contains: $text } }
          { uname: { contains: $text } }
        ]
      }
    ) {
      items {
        id
        firstName
        lastName
        uname
        icon
        pub
        email
      }
    }
  }
`;

export const SEARCH_FOR_USER_NOT_IN_CIRCLE = gql`
  query searchForUser($circle: ID!, $text: String!, $user: ID!) {
    usersList(
      first: 5
      filter: {
        id: { not_equals: $user }
        circles: { none: { id: { equals: $circle } } }
        OR: [
          { firstName: { contains: $text } }
          { lastName: { contains: $text } }
          { email: { contains: $text } }
          { uname: { contains: $text } }
        ]
      }
    ) {
      items {
        id
        firstName
        lastName
        uname
        icon
        pub
        uname
        email
      }
    }
  }
`;

export const GET_MY_INVITES = gql`
  query($id: String!, $minDate: DateTime!) {
    invitesList(
      filter: {
        createdAt: { gte: $minDate }
        invitee: { equals: $id }
        hasAccepted: { equals: false }
      }
    ) {
      items {
        id
        inviter {
          id
          firstName
          lastName
        }
        createdAt
        circle {
          id
          name
        }
      }
    }
  }
`;

export const SEARCH_FOR_USER_WITH_PUB = gql`
  query searchForUser($text: String!) {
    usersList(
      filter: {
        pub: { not_equals: null }
        OR: [
          { firstName: { contains: $text } }
          { lastName: { contains: $text } }
          { email: { contains: $text } }
          { uname: { contains: $text } }
        ]
      }
    ) {
      items {
        id
        firstName
        lastName
        uname
        icon
        pub
        email
      }
    }
  }
`;

export const GET_USERS_BY_CIRCLE_ID = gql`
  query getUsersByCircleId($id: ID!) {
    circle(id: $id) {
      id
      users {
        items {
          id
        }
      }
    }
  }
`;

export const GET_DMS_BY_USER = gql`
  query getDMsByUser($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      channels(filter: { channelType: { equals: "dm" } }) {
        items {
          id
          name
          channelType
          users {
            items {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_RESET_REQUEST = gql`
  query($token: String!) {
    resetRequestsList(last: 1, filter: { token: { equals: $token } }) {
      items {
        id
        email
      }
    }
  }
`;

export const GET_USER_KEYS = gql`
  query getUserKeys($user: ID!, $channel: ID) {
    user(id: $user) {
      id
      priv
      firstName
      lastName
      keys(
        filter: {
          user: { id: { equals: $user } }
          channel: { id: { equals: $channel } }
        }
      ) {
        items {
          id
          key
        }
      }
    }
  }
`;

export const SEARCH_ALL = gql`
  query searchForUser($text: String!, $id: ID!) {
    circlesList(
      last: 5
      filter: { OR: [{ id: { equals: $id } }, { name: { contains: $text } }] }
    ) {
      items {
        id
        name
        icon
      }
    }
    channelsList(
      last: 5
      filter: {
        channelType: { equals: "group" }
        OR: [{ id: { equals: $id } }, { name: { contains: $text } }]
      }
    ) {
      items {
        id
        name
        description
        createdAt
        circle {
          id
          name
        }
      }
    }
    revisionsList(
      last: 5
      filter: { OR: [{ id: { equals: $id } }, { title: { contains: $text } }] }
    ) {
      items {
        id
        title
        createdAt
        circle {
          id
          name
        }
      }
    }
    amendmentsList(
      last: 5
      filter: { OR: [{ id: { equals: $id } }, { title: { contains: $text } }] }
    ) {
      items {
        id
        title
        text
        createdAt
        circle {
          id
          name
        }
      }
    }
    usersList(
      last: 5
      filter: {
        OR: [
          { id: { equals: $id } }
          { firstName: { contains: $text } }
          { lastName: { contains: $text } }
          { email: { contains: $text } }
          { uname: { contains: $text } }
        ]
      }
    ) {
      items {
        id
        firstName
        lastName
        icon
      }
    }
  }
`;

export const GET_INVITE_BY_ID = gql`
  query getInviteById($id: ID!) {
    invite(id: $id) {
      id
      hasAccepted
      inviter {
        id
        firstName
        lastName
        icon
      }
      circle {
        id
        name
        icon
      }
    }
  }
`;

export const GET_USERS_BY_CHANNEL_ID = gql`
  query getUsersByChannelId($id: ID!) {
    channel(id: $id) {
      id
      users {
        items {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const GET_WEB_SUBS = gql`
  query getWebSubs($id: ID!) {
    user(id: $id) {
      id
      webSubs {
        id
        subscription
      }
    }
  }
`;

export const GET_ALL_USERS_CIRCLES_CHANNELS = gql`
  query getAllMyChannels($id: ID!) {
    user(id: $id) {
      id
      circles {
        items {
          id
          channels {
            items {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_CIRCLE_PREFS_FOR_USER = gql`
  query($user: ID!, $circle: ID!) {
    circlePermissionsList(
      filter: {
        user: { id: { equals: $user } }
        circle: { id: { equals: $circle } }
      }
    ) {
      items {
        id
        onAmendments
        onRevisions
        revisionsEmail
        revisionsPush
        amendmentsEmail
        amendmentsPush
        circle {
          id
          name
        }
      }
    }
  }
`;

export const GET_USER_WITH_PREF_BY_ID = gql`
  query($id: ID!) {
    user(id: $id) {
      id
      email
      phone
      prefs {
        id
        maySendMarketingEmail
      }
      firstName
      lastName
      icon
      uname
      createdAt
      circles {
        items {
          id
        }
      }
      revisions {
        items {
          id
          passed
        }
      }
      votes {
        items {
          id
        }
      }
    }
  }
`;

export const CHECK_IF_UNAME_TAKEN = gql`
  query($id: ID!, $uname: String!) {
    usersList(filter: { id: { not_equals: $id }, uname: { equals: $uname } }) {
      items {
        id
      }
    }
  }
`;

export const CHECK_IF_EMAIL_TAKEN = gql`
  query($id: ID!, $email: String!) {
    usersList(filter: { id: { not_equals: $id }, email: { equals: $email } }) {
      items {
        id
      }
    }
  }
`;

export const CHECK_IF_PHONE_TAKEN = gql`
  query($id: ID!, $phone: String!) {
    usersList(filter: { id: { not_equals: $id }, phone: { equals: $phone } }) {
      items {
        id
      }
    }
  }
`;

export const GET_CIRCLE_NOTICES = gql`
  query($id: ID!) {
    circle(id: $id) {
      id
      notices(sort: { createdAt: DESC }) {
        items {
          id
          title
          text
          createdAt
        }
      }
    }
  }
`;

export const IS_USER_IN_CIRCLE = gql`
  query($circle: ID!, $user: ID!) {
    circlesList(
      filter: {
        AND: [
          { id: { equals: $circle } }
          { users: { some: { id: { equals: $user } } } }
        ]
      }
      first: 1
    ) {
      items {
        id
      }
    }
  }
`;

export const DOES_AMENDMENT_EXIST = gql`
  query doesAmendmentExistInCircle($title: String!, $circleId: ID!) {
    amendmentsList(
      filter: {
        title: { equals: $title }
        circle: { id: { equals: $circleId } }
      }
    ) {
      items {
        id
        title
      }
    }
  }
`;

export const GET_AMENDMENT_BY_ID = gql`
  query($id: ID!) {
    amendment(id: $id) {
      id
      title
      circle {
        id
        name
        users {
          items {
            id
          }
        }
      }
      text
    }
  }
`;

/*
  8base queries
*/

/* Query the for the ID of the logged in user */
export const CURRENT_USER_QUERY = gql`
  query currentUser {
    user {
      id
      prefs {
        id
      }
    }
  }
`;

export const TEST_QUERY = gql`
  query {
    usersList {
      items {
        id
        email
        icon
      }
    }
  }
`;

export const GET_USER_EXPO_TOKEN = gql`
  query($id: ID!) {
    user(id: $id) {
      id
      pushTokens {
        items {
          id
          token
        }
      }
    }
  }
`;

export const GET_USER_ALLOW_PUSH = gql`
  query($id: ID!) {
    user(id: $id) {
      id
      circlePermissions(
        filter: {
          OR: [
            { revisionsPush: { equals: true } }
            { amendmentsPush: { equals: true } }
          ]
        }
      ) {
        count
        items {
          id
          revisionsPush
          amendmentsPush
        }
      }
    }
  }
`;
