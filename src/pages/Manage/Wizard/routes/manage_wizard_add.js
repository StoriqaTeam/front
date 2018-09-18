// @flow strict

import React from 'react';
import { Route } from 'found';
import { graphql } from 'react-relay';

import { log } from 'utils';

import Form from '../Steps/ProductsStep/WizardEditProductForm';

const route = (
  <Route
    path="/edit/:id"
    query={graphql`
      query manageWizardAdd_Query($id: Int!) {
        me {
          id
          wizardStore {
            id
            store {
              id
              rawId
            }
          }
          product(id: $id) {
            id
            ...WizardEditProductForm_product
          }
        }
        categories {
          id
          ...CategorySelector_rootCategory
        }
      }
    `}
    Component={Form}
    render={({ props, Component }) => {
      log.debug('manage/wizard/edit', props);
      return (
        props && (
          <Component categories={props.categories} product={props.me.product} />
        )
      );
    }}
    prepareVariables={(_, { params }) => ({
      id: parseInt(params.id, 10),
    })}
  />
);

export default route;
