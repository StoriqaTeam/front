// @flow

import { fetchQuery, graphql } from 'react-relay';
import { Environment } from 'relay-runtime';

const AVAILABLEPACKAGES_QUERY = graphql`
  query fetchPackages_Query(
    $countryCode: String!
    $size: Float!
    $weight: Float!
  ) {
    availablePackages(countryCode: $countryCode, size: $size, weight: $weight) {
      local {
        companyPackageId
        companyPackageRawId
        name
        logo
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
