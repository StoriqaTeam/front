// @flow strict
// @flow-runtime

import { t } from 'translation/utils';
import type { Translation } from 'translation/utils';

type TranslationDicType = {|
  newTicketWasSuccessfullySent: string,
  ok: string,
  somethingIsGoingWrong: string,
  support: string,
  labelTicketTitle: string,
  labelYourProblem: string,
  createTicket: string,
|};
type TranslationsBundleType = Translation<TranslationDicType>;

const translations: TranslationsBundleType = {
  en: {
    newTicketWasSuccessfullySent: 'New ticket was successfully sent.',
    ok: 'Ok',
    somethingIsGoingWrong: 'Something is going wrong :(',
    support: 'Support',
    labelTicketTitle: 'Ticket Title',
    labelYourProblem: 'Your Problem',
    createTicket: 'Create Ticket',
  },
};

const validate = (json: {}, verbose: boolean = false): boolean => {
  try {
    (json: TranslationsBundleType); // eslint-disable-line
    return true;
  } catch (err) {
    verbose && console.error(err); // eslint-disable-line
    return false;
  }
};

export { translations, validate };
export default t(translations);
