// @flow

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';

const AVAILABLEPACKAGES_QUERY = graphql`
  query fetchPackages_Query($countryCode: String!, $size: Int!, $weight: Int!) {
    availablePackages(countryCode: $countryCode, size: $size, weight: $weight) {
      local {
        companyPackageId
        companyPackageRawId
        name
        logo
        currency
      }
      international {
        companyPackageId
        companyPackageRawId
        name
        logo
        deliveriesTo {
          children {
            label
            children {
              parent
              alpha3
              alpha2
              label
            }
            alpha3
          }
        }
        currency
      }
    }
  }
`;

const fetchPackages = (
  environment: Environment,
  variables: {
    countryCode: string,
    size: number,
    weight: number,
  },
) => fetchQuery(environment, AVAILABLEPACKAGES_QUERY, variables);

export default fetchPackages;
