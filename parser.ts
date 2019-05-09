interface Wish {
  action: string;
  subject: string;
  params: any[];
}

const all_wishes: Wish[] = [];

export function wish(subject: string) {
  return {
    can: function (doSomething: string, ...args) {
      all_wishes.push({
        action: doSomething,
        subject,
        params: args
      });
    }
  }
}

interface Granter {
  action: string;
  subject: string;
  exceptions: string[];
  grant: Function;
}

const all_granters: Granter[] = [];

export const anyone = 'anyone';
export function when(subject: string) {
  var exceptions = [];

  const wishes = {
    to
  };

  function except(...subjects) {
    exceptions = subjects;
    return {
      wishes,
      wish: wishes,
      is: { a: to }
    };
  }

  function to(doSomething: string, granter: Function) {
    all_granters.push({
      action: doSomething,
      subject: subject === anyone ? null : subject,
      exceptions,
      grant: granter
    })
  }

  return {
    except,
    wishes,
    wish: wishes,
    is: { a: to }
  }
}

interface Claim {
  subject: string;
  is: string;
  properties: any[];
}

const all_claims: Claim[] = [];

export function claim(subject: string) {
  return {
    is: {
      a(thing: any) {
        return {
          with(...properties) {
            all_claims.push({
              subject,
              is: thing,
              properties
            });
          }
        };
      }
    }
  };
}

// engine
function _grantWishes(wishes: Wish[], granters: Granter[]) {
  const wish = wishes.shift();

  const applicable_granters = granters.filter((granter: Granter) => {
    const has_same_action = granter.action === wish.action;
    const has_same_subject = granter.subject === wish.subject;
    const grants_for_anyone = !granter.subject;
    const can_grant_to_subject = !granter.exceptions.includes(wish.subject);

    const can_grant_wish = can_grant_to_subject && has_same_action && (has_same_subject || grants_for_anyone);
    return can_grant_wish;
  });

  applicable_granters.forEach((granter: Granter) => {
    granter.grant.bind({
      subject: wish.subject
    })(wish.params);
  });
}

export function hasWishes() {
  return all_wishes.length;
}

export function grantWishes() {
  _grantWishes(all_wishes, all_granters);
}

