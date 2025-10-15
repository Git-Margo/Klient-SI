const sexModify = (data, gender = hero.gender) => {
	let sexModify  = data.match(/\[SEX\=(.*?)\]/g);
	if (sexModify) {
		for (let k in sexModify) {
			let fullStr 		  = sexModify[k];
			let index= gender == 'm' ? 0 : 1;
			let stringToCheck = fullStr.replace('[SEX=', '').replace(']', '');
			let strByGender 	= stringToCheck.split('|')[index];

			data = data.replace(fullStr, strByGender);
		}
	}

	return data
}

const nickUppercase = (text) => {
	return text.replace(/\[NICK_UPPERCASE\]/, hero.nick.toUpperCase());
};

const nick = (text) => {
	return text.replace(/\[NICK\]/, hero.nick);
};

const parseText = (text) => {
	if (!isset(hero.id)) return text;

	text = sexModify(text);
	text = nickUppercase(text);
	text = nick(text);
	return text;
}

var TextModifyByTag = {
	sexModify,
	nickUppercase,
	parseText
};
