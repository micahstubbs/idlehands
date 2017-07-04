/*
 * Grammars that make grammars
 */

function createLanguageGrammar() {
	// A language is created out of syntax, words, punctuations, and syllables

	// Syllable
	// surrounded by vowels ecca arra
	var syllables = [];

	var v0 = [
		'a',
		'e',
		'i',
		'o',
		'a',
		'e',
		'i',
		'o',
		'eu',
		'oi',
		'io',
		'ia',
		'u',
		'aa',
		'oo',
		'a',
		'ow',
		'ew',
		'e',
		'i',
		'o',
		'a',
		'e',
		'i',
		'o',
		'u',
		'aa',
		'oo',
		'a',
		'e',
		'i',
		'o',
		'a',
		'e',
		'i',
		'o',
		'u',
		'oo',
		'y',
		'a',
		'u',
		'ee',
		'iu',
		'uo',
		'ai',
		'ei',
		'e',
		'ia',
		'e',
		'i',
		'o',
		'a',
		'e',
		'i',
		'o',
		'u',
		'oo',
		'a',
		'e',
		'i',
		'o',
		'a',
		'e',
		'i',
		'o',
		'u',
		'oo',
		'oi',
		'oui',
		'ee',
		'ey',
		'ay',
		'ai',
		'ai',
		'y',
		'a',
		'u',
		'ee',
		'iu',
		'uo',
		'ai',
		'ei',
		'e',
		'ia',
		'io',
		'eu',
		'ie',
		'ai',
		'ei',
		'e',
		'ia',
		'io',
		'eu',
		'ie',
		'i',
		'au',
		'o',
		'ui'
	];
	var diacritical = ['ä', 'ö', 'å', 'á', 'æ', 'é', 'ø', 'í', 'ó', 'ú'];

	var cStart = [
		'fr',
		'str',
		'tr',
		'kl',
		'tw',
		'sl',
		'sn',
		'bl',
		'schr',
		'shr',
		'chr',
		'sp',
		'gr',
		'fl',
		'squ',
		'cl',
		'gl'
	];
	var cEnd = [
		'rp',
		'j',
		'nd',
		'mph',
		'ss',
		'lp',
		'rk',
		'lks',
		'ng',
		'tt',
		'rb',
		'tch',
		'ght',
		'nt',
		'ld',
		'rl',
		'nk',
		'lt',
		'rb',
		'wm',
		'nx',
		'x',
		'nth',
		'lk',
		'zz',
		'rg',
		'mb',
		'k',
		'ck',
		'rn',
		'rd',
		'lph',
		'll'
	];
	var cMid = ['cc', 'tt', 'rr', 'nn', 'xh', 'tz', 'rw', 'ñ', 'ny'];
	var cAny = [
		'b',
		'n',
		'b',
		'n',
		'p',
		'mn',
		'm',
		's',
		'l',
		'zh',
		'k',
		'r',
		'd',
		'v',
		'qu',
		'tz',
		'n',
		'm',
		's',
		'r',
		'd',
		'b',
		'n',
		'm',
		's',
		'r',
		'd',
		'd',
		'm',
		'gn',
		'm',
		'h',
		'd',
		'st',
		'j',
		'h',
		'q',
		'w',
		'g',
		'z',
		'sch',
		'sh',
		'ch',
		'm',
		'r',
		'n',
		'l',
		'k',
		'p',
		'ph',
		'ng',
		'b',
		'th',
		'v'
	];

	punctuation = ['.', '.', '.', '!', '!!', '?!', '...'];
	midPunctuation = [',', ',', ',', ';', ':', '...'];
	var language = {};

	// set the vowels

	function createVowels(count, set) {
		if (set === undefined) {
			set = v0.concat(v0);
			if (Math.random() > 0.4) {
				set = set.concat(diacritical);
			}
		}
		var vowels = [];
		for (var i = 0; i < count; i++) {
			vowels.push(getRandom(set));
		}

		return vowels;
	}

	var langVowels = createVowels(5);

	function getMeta(options, count) {
		var s = [];

		for (var i = 0; i < count; i++) {
			s.push(getMetaRandom.apply(undefined, options));
		}

		return s;
	}

	function getMetaRandom() {
		// pick an array, then pick from that array
		var arr = arguments[Math.floor(Math.random() * arguments.length)];
		return arr[Math.floor(Math.random() * arr.length)];
	}

	//language.countryMod = ["Imperial", "Sovereign", "Autonomous", "People's", "Holy", "Independent", "Free", "Liberated"],
	//	language.countryType = ["Empire", "State", "Region", "Principality", "Province"],

	//language.beloved = ["beloved", "popular", "favorite", "notable", "traditional"],
	//	language.mottoType = ["motto", "motto", "motto", "motto", "motto", "national song", "national saying", "tourism slogan", "slogan", "ancient saying", "#beloved# greeting", "#beloved# blessing", "#beloved# drinking song", "#beloved# folk song", "#beloved# toast", "#beloved# prayer", "famous poem", "national poem"];
	language.countryName = ['#word.capitalize#'];
	//language.country = ["#countryName#", "#countryName#", "Country of #countryName#", "Principality of #countryName#", "Great #countryName#", "Grand #countryName#", "Grand Dutchy of #countryName#", "Kingdom of #countryName#", "Independent State of #countryName#", "Republic of #countryName#", "#countryName# Republic", "#countryMod.capitalize# #countryMod# #countryType# of #countryName#", "#countryMod.capitalize# #countryType# of #countryName#", "#countryMod.capitalize# #countryName#", "#countryMod.capitalize# #countryName# #countryType#"];
	//	language.cityPrefix = ["old", "new", "west", "east", "south", "north", "northern", "outer", "inner", "lower", "upper", "port of"];
	//language.citySuffix = ["City", "Town", "Village"];
	//language.city = ["#word.capitalize#", "#word.capitalize#", "#cityPrefix.capitalize# #word.capitalize#", "#word.capitalize#", "#word.capitalize# #citySuffix.capitalize# ", "#word.capitalize#", "#word.capitalize#/#word.capitalize#"];

	language['cons-end'] = getMeta([cAny, cAny, cAny, cAny, cEnd, cEnd, cEnd], 4);
	language['cons-start'] = getMeta([cAny, cAny, cAny, cAny, cStart, cStart], 4);
	language['vowel-end'] = createVowels(3, langVowels);
	language['vowel-start'] = createVowels(3, langVowels);
	language['vowel-mid'] = createVowels(3, langVowels);
	language['title'] = ['#phrase-d#', '#phrase-c#'];
	language.punctuation = [
		getRandom(punctuation),
		getRandom(punctuation),
		getRandom(punctuation)
	];
	language.midPunctuation = [
		getRandom(midPunctuation),
		getRandom(midPunctuation)
	];

	// Syllable possibilities:

	function randomVariable(key) {
		if (Math.random() > 0.25) return getRandom(language[key]);
		else return '#' + key + '#';
	}

	function wordCons() {
		// cons-vowel-cons
		// vowel-cons
		// cons-vowel
		// vowel

		if (Math.random() > 0.95) {
			return (
				randomVariable('cons-start') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end')
			);
		}
		if (Math.random() > 0.93) {
			return (
				randomVariable('cons-start') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end')
			);
		}
		if (Math.random() > 0.88) {
			return (
				randomVariable('cons-start') +
				randomVariable('vowel-end') +
				randomVariable('cons-start') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end')
			);
		}
		if (Math.random() > 0.85) {
			return (
				randomVariable('cons-start') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end')
			);
		}
		if (Math.random() > 0.85) {
			return (
				randomVariable('cons-start') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end')
			);
		}

		if (Math.random() > 0.8) {
			return (
				randomVariable('cons-start') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end')
			);
		}

		if (Math.random() > 0.7) {
			return randomVariable('vowel-start') + randomVariable('cons-end');
		}

		if (Math.random() > 0.7) {
			return randomVariable('vowel-end');
		}
		if (Math.random() > 0.7) {
			return (
				randomVariable('cons-start') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end') +
				randomVariable('cons-start') +
				randomVariable('vowel-mid') +
				randomVariable('cons-end')
			);
		}

		if (Math.random() > 0.7) {
			return (
				randomVariable('cons-start') +
				randomVariable('vowel-mid') +
				"'" +
				randomVariable('vowel-mid') +
				randomVariable('cons-end')
			);
		}

		if (Math.random() > 0.8) {
			return wordCons() + '-' + wordCons();
		}

		return randomVariable('cons-start') + randomVariable('vowel-end');
	}

	// metatemplates
	// A is made from words,

	// a is made of some sequece of bs and below and words
	function makePhrases(options, count, maxLength) {
		var phrases = [];

		for (var i = 0; i < count; i++) {
			var len = Math.ceil(Math.random() * maxLength);
			var components = [];
			for (var j = 0; j < len; j++) {
				components[j] = getRandom(options);
			}
			phrases.push(components.join(' '));
		}

		return phrases;
	}

	var steps = ['a', 'b', 'c', 'd'];
	for (var i = 0; i < 6; i++) {
		var words = [];
		var count = Math.random() * 6 + 2;
		for (var j = 0; j < count; j++) {
			words.push(wordCons());
		}
		language['word-' + steps[i]] = words;
	}

	language['word'] = ['#word-a#', '#word-b#', '#word-c#', '#word-d#'];
	language['phrase-d'] = makePhrases(
		[
			'#word-' + getRandom(steps) + '#',
			'#word-' + getRandom(steps) + '#',
			'#word-' + getRandom(steps) + '#'
		],
		2,
		3
	);
	language['phrase-c'] = makePhrases(
		['#phrase-d#', '#phrase-d#', '#word-' + getRandom(steps) + '#'],
		2,
		3
	);
	language['phrase-b'] = makePhrases(
		[
			'#phrase-c#',
			'#phrase-c#',
			'#phrase-d#',
			'#word-' + getRandom(steps) + '#'
		],
		2,
		3
	);
	language['phrase-a'] = makePhrases(
		[
			'#phrase-b#',
			'#phrase-b##midPunctuation# #phrase-b#',
			'#phrase-b##midPunctuation# #phrase-b#',
			'#phrase-d##midPunctuation# #phrase-d#',
			'#phrase-d#',
			'#word-' + getRandom(steps) + '#'
		],
		1,
		3
	);
	language.sentence = ['#phrase-a.capitalize##punctuation#'];
	language.greeting = [
		'#phrase-a.capitalize##punctuation#',
		'#phrase-c.capitalize##punctuation#',
		'#phrase-b.capitalize##punctuation#'
	];

	language.art = ['#sentence#<br>#sentence#<br>#sentence#'];

	return language;
}

function createCountry() {
	var country = {
		name: '',
		cities: [],
		greetings: [],
		statements: [],

		grammar: tracery.createGrammar(createLanguageGrammar(), true)
	};

	var cityCount = Math.floor(Math.random() * 5);

	country.name = country.grammar.flatten('#country#');
	country.greeting = inQuotes(
		country.grammar.flatten('#phrase-b.capitalize##punctuation#')
	);
	country.motto = inQuotes(
		country.grammar.flatten('#phrase-a.capitalize##punctuation#')
	);
	country.mottoType = country.grammar.flatten('#mottoType#');
	for (var i = 0; i < cityCount; i++) {
		country.cities.push(country.grammar.flatten('#city#'));
	}
	return country;
}
