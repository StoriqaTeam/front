// @flow strict

import * as React from 'react';
import { isEmpty, find, whereEq, reject, anyPass, isNil } from 'ramda';
import { Environment } from 'react-relay';

import { validate } from 'components/Forms/lib';
import type { AddAlertInputType } from 'components/App/AlertContext';
import { log, fromRelayError } from 'utils';

// TODO: move types to separate file
/*
  FS - type for inputs
  `type FormInputs = {
    name: string,
    age: number,
    currency: { id: string, label: string }
  }` for example.
  Same keys must be used in validator and handlers objects.
*/

type FormComponentPropsType<P> = P & {
  //
  relay: { environment: Environment, refetch: () => void }, // eslint-disable-line

  //
  showAlert: (input: AddAlertInputType) => void, // eslint-disable-line
};

type FormComponentStateType<FS> = {
  isSubmitting: boolean,
  form: FS,
  validationErrors: {
    [$Keys<FS>]: Array<string>,
  },
};

type FormHandlersType<FI> = {
  [$Keys<FI>]: (value: *) => (state: FI) => FI,
};
export type { FormHandlersType };

type FormValidatorType<FI> = {
  [$Keys<FI>]: $ReadOnlyArray<[(value: $Values<FI>) => boolean, string]>,
};
export type { FormValidatorType };

type TranslationType = {|
  +lang: string,
  +text: string,
|};
type UtilsType = {|
  getTextFromTranslation: (
    translation: $ReadOnlyArray<TranslationType>,
    lang?: string,
  ) => ?string,
|};

/*
  MV is type of mutation variables
*/
interface IFormComponent<FS: {}> {
  handlers: FormHandlersType<FS>;
  validators: FormValidatorType<FS>;
  validate: () => {
    [$Keys<FS>]: Array<string>,
  };
  submit: (callback?: () => void) => void;
  runMutations: () => Promise<*>;
  +transformValidationErrors: (serverValidationErrors: {
    [string]: Array<string>,
  }) => { [$Keys<FS>]: Array<string> };
}

class FormComponent<FormState: {}, Props>
  extends React.Component<
    FormComponentPropsType<Props>,
    FormComponentStateType<FormState>,
  >
  implements IFormComponent<FormState> {
  /*
    Common utils
  */
  // TODO: move to separate file
  static utils: UtilsType = {
    getTextFromTranslation: (
      roTranslation: $ReadOnlyArray<TranslationType>,
      lang: string = 'EN',
    ) => {
      const translation: Array<TranslationType> = Array(...roTranslation);
      const result = find(whereEq({ lang }), translation);
      return result && result.text;
    },
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  mutationId: number = 1;
  mounted: boolean = false;

  /*
    values are functions that take new value and FI's state and return updated FI
  */
  handlers: FormHandlersType<FormState> = {
    //
  };

  /*
    values are functions that take input value and return array with errors
    or empty array if errors not exist
  */
  validators: FormValidatorType<FormState> = {};

  /*
    Apply validation rules
  */
  validate = () => validate(this.state.form, this.validators);

  // eslint-disable-next-line
  transformValidationErrors(serverValidationErrors: {
    [string]: Array<string>,
  }): { [$Keys<FormState>]: Array<string> } {
    throw new Error(
      'You should implement `transformValidationErrors` in subclasses',
    );
  }

  runMutations = () => {
    throw new Error('You must implement `runMutations` in subclasses');
  };

  submit = (callback?: () => void) => {
    const validationErrors = this.validate();
    if (!isEmpty(validationErrors)) {
      this.setState({ validationErrors }); // eslint-disable-line
      return;
    }

    this.setState({ isSubmitting: true, validationErrors: {} }); // eslint-disable-line
    this.runMutations()
      .then(resp => {
        log.debug('form submit resposnse', resp);
        if (callback) {
          callback();
        }
      })
      .catch(err => {
        log.error('Mutation error', err);

        if (!this.mounted) {
          return;
        }

        const relayErrors = fromRelayError({ source: { errors: [err] } });
        const relayValidationErrors =
          relayErrors && relayErrors['100'] && relayErrors['100'].messages;
        if (relayValidationErrors && !isEmpty(relayValidationErrors)) {
          log.debug('validation errors', {
            relayValidationErrors,
            transformed: this.transformValidationErrors(relayValidationErrors),
          });
          this.setState({
            // eslint-disable-next-line
            validationErrors: {
              ...reject(
                anyPass([isEmpty, isNil]),
                this.transformValidationErrors(relayValidationErrors),
              ),
            },
          });
          return;
        }

        this.props.showAlert({
          type: 'danger',
          text: 'Error :(',
          link: { text: 'Close.' },
        });
      })
      .finally(() => {
        this.mutationId = this.mutationId + 1;
        if (this.mounted) {
          this.setState({ isSubmitting: false }); // eslint-disable-line
        }
      });
  };

  render() {
    throw new Error('You must implement `render` in subclasses');
    // $FlowIgnoreMe
    return null; // eslint-disable-line
  }
}

export default FormComponent;
