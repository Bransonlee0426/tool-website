import gql from 'graphql-tag';

export const BrandFragment = {
  details: gql`
  fragment BrandDetail on Brand {
    id
    name
    totalPages
    page
  },
`,
};

// example
export const ContactFragment = gql`
  fragment ContactDetail on Contact {
        id
        name
        createdAt
        updatedAt
        number
    }
`;

export default {
  ContactFragment,
  BrandFragment,
};
