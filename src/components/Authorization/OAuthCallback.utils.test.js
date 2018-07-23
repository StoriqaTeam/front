import prepareQueryString from './OAuthCallback.utils';

describe('Extract access token', () => {
  describe('for FB', () => {
    it('should extract correctly from url without question mark', () => {
      const url = 'https://localhost:3443/oauth_callback/fb#access_token=EAAGCu5VzWesBALNYsj6R7yZCjGbk2c3ebmIgGT2r730cMQFB9FsIK5wGT1Ji9haern6ZCUATQlyD7LOdDnF3HxgkmmPY5UihxxLItSCmav7xFWq3pOOIRjaETm1PG6VVH3qZA6lPZBhg4o9zay16eIvLQ7Fm2Pijh2ZBQ8E8NKsmrm5oxyoSIAOwwrLEyHI4ZD&expires_in=6644&reauthorize_required_in=7775999';
      const callbackUrl = 'https://localhost:3443/oauth_callback/fb';
      const queryString = prepareQueryString({
        url,
        callbackUrl,
      });
      expect(queryString).toEqual('access_token=EAAGCu5VzWesBALNYsj6R7yZCjGbk2c3ebmIgGT2r730cMQFB9FsIK5wGT1Ji9haern6ZCUATQlyD7LOdDnF3HxgkmmPY5UihxxLItSCmav7xFWq3pOOIRjaETm1PG6VVH3qZA6lPZBhg4o9zay16eIvLQ7Fm2Pijh2ZBQ8E8NKsmrm5oxyoSIAOwwrLEyHI4ZD&expires_in=6644&reauthorize_required_in=7775999');
    })
    it('should extract correctly from url with question mark', () => {
      const url = 'https://localhost:3443/oauth_callback/fb?#access_token=EAAGCu5VzWesBALNYsj6R7yZCjGbk2c3ebmIgGT2r730cMQFB9FsIK5wGT1Ji9haern6ZCUATQlyD7LOdDnF3HxgkmmPY5UihxxLItSCmav7xFWq3pOOIRjaETm1PG6VVH3qZA6lPZBhg4o9zay16eIvLQ7Fm2Pijh2ZBQ8E8NKsmrm5oxyoSIAOwwrLEyHI4ZD&expires_in=6644&reauthorize_required_in=7775999';
      const callbackUrl = 'https://localhost:3443/oauth_callback/fb';
      const queryString = prepareQueryString({
        url,
        callbackUrl,
      });
      expect(queryString).toEqual('access_token=EAAGCu5VzWesBALNYsj6R7yZCjGbk2c3ebmIgGT2r730cMQFB9FsIK5wGT1Ji9haern6ZCUATQlyD7LOdDnF3HxgkmmPY5UihxxLItSCmav7xFWq3pOOIRjaETm1PG6VVH3qZA6lPZBhg4o9zay16eIvLQ7Fm2Pijh2ZBQ8E8NKsmrm5oxyoSIAOwwrLEyHI4ZD&expires_in=6644&reauthorize_required_in=7775999');
    })
  })
})