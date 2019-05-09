import { anyone, when, wish, claim, hasWishes, grantWishes } from '../parser';
import { i, say, chris, not_chris, have_colored_hair, blue, person, hair, legs, torso } from '../nouns';


when(anyone).wishes.to(say, function (words) {
  console.log(this.subject, 'says:', ...words);
});

when(chris).wishes.to(say, function (words) {
  console.log('more specifically, chris says:', ...words);
});

when(chris).is.a(person, function () {
  wish(chris).can(say, 'ayo');
});

when(anyone).except(chris).wishes.to(have_colored_hair, function (color) {
  console.log(color + ' really suits you, ' + this.subject);
});

when(chris).wishes.to(have_colored_hair, function (color) {
  console.log('silly crabl, you can\'t have ' + color + ' hair!')
});

wish(i).can(say, 'hello');
wish(chris).can(say, 'yo wassup homiessss');

claim(chris).is.a(person).with(hair, legs, torso);

wish(chris).can(have_colored_hair, blue);
wish(not_chris).can(have_colored_hair, blue);

while (hasWishes()) {
  grantWishes();
}
