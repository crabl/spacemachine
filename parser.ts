interface Wish {
  action: string;
  subject: string;
  params: any[];
}

const all_wishes: Wish[] = [];

function wish(subject: string) {
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
  grant: Function;
}

const wish_granters: Granter[] = [];

const anyone = 'anyone';
function when(subject: string) {
  const wishes = {
    to(doSomething: string, granter: Function) {
      wish_granters.push({
        action: doSomething,
        subject: subject === anyone ? null : subject,
        grant: granter
      })
    }
  };

  return {
    wishes,
    wish: wishes
  }
}

interface Claim {
  subject: string;
  is: string;
  properties: any[];
}

const all_claims: Claim[] = [];

function claim(subject: string) {
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

const i = 'i';
const say = 'say';
const chris = 'chris';
const have_colored_hair = 'have_colored_hair';
const blue = 'blue';

when(anyone).wishes.to(say, function(words) {
  // have to find a way to access the subject in here
  console.log(this.subject, 'says:', ...words);
});

when(chris).wishes.to(say, function(words) {
  console.log('more specifically, chris says:', ...words);
});

when(anyone).wishes.to(have_colored_hair, function(color) {

})

wish(i).can(say, 'hello');
wish(chris).can(say, 'yo wassup homiessss')

const person = 'person';
const hair = 'hair';
const legs = 'legs';
const torso = 'torso';
claim(chris).is.a(person).with(hair, legs, torso);

wish(chris).can(have_colored_hair, blue)

// engine
all_wishes.forEach((wish: Wish) => {
  const granters = wish_granters.filter((granter: Granter) => {
    const has_same_action = granter.action === wish.action;
    const has_same_subject = granter.subject === wish.subject;
    const grants_for_anyone = !granter.subject;

    const can_grant_wish = has_same_action && (has_same_subject || grants_for_anyone);
    return can_grant_wish;
  });

  granters.forEach((granter: Granter) => {
    granter.grant.bind({
      subject: wish.subject
    })(wish.params);
  });
});

