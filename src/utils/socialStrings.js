// @flow

const facebookLoginString = () => {
  // $FlowIgnore
  const appId = `${process.env.REACT_APP_OAUTH_FACEBOOK_APP_ID}`;
  // $FlowIgnore
  const redirectUri = `${process.env.REACT_APP_OAUTH_FACEBOOK_REDIRECT_URI}`;
  return `https://www.facebook.com/v2.11/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=email,public_profile&response_type=token`;
};

const googleLoginString = () => {
  // $FlowIgnore
  const appId = `${process.env.REACT_APP_OAUTH_GOOGLE_CLIENT_ID}`;
  // $FlowIgnore
  const redirectUri = `${process.env.REACT_APP_OAUTH_GOOGLE_REDIRECT_URI}`;
  // $FlowIgnore
  const scopes = `${process.env.REACT_APP_OAUTH_GOOGLE_SCOPES}`;
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scopes}&response_type=token`;
};

export default {
  facebookLoginString,
  googleLoginString,
};
