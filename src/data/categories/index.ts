import generators from './generators.json';
import security from './security.json';
import converters from './converters.json';
import social from './social.json';
import productivity from './productivity.json';
import financial from './financial.json';
import calculations from './calculations.json';

const categories: Record<string, any> = {
  generators,
  security,
  converters,
  social,
  productivity,
  financial,
  calculations,
};

export default categories;
