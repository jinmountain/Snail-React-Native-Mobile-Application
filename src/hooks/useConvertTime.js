const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const convertToDateInMs = (timestamp) => {
	// timestampe: number
	// return number
	var getTime = new Date(timestamp);
	var year = getTime.getFullYear();
	var monthIndex = getTime.getMonth();
	var date = getTime.getDate();

  var dateTimestamp = new Date(year, monthIndex, date).getTime();
	return dateTimestamp;
};

const getDayIndex = (year, monthIndex, date) => {
	var getTime = new Date(year, monthIndex, date);
	var dayIndex = getTime.getDay();

	return dayIndex;
};

const getDateTimestamp = (year, monthIndex, date) => {
	var dateTimestamp = new Date(year, monthIndex, date).getTime();
	return dateTimestamp;
};

const convertToTime = (timestamp) => {
	// timestampe: number
	// return object
	var getTime = new Date(timestamp);
	var year = getTime.getFullYear();
	var monthIndex = getTime.getMonth();
	var month = months[getTime.getMonth()];
	var date = getTime.getDate();
	var dayIndex = getTime.getDay();
	var day = days[getTime.getDay()];
	var hour = getTime.getHours();
  var min = getTime.getMinutes();

  var pmOrAm;
  var normalHour;
	if (hour > 12) {
  	pmOrAm = 'PM';
  	normalHour = hour - 12;
  } else {
  	pmOrAm = 'AM';
  	normalHour = hour;
  }

	return {
		timestamp: timestamp,
		year: year,
		monthIndex: monthIndex,
		month: month,
		date: date,
		dayIndex: dayIndex,
		day: day,
		hour: hour,
		normalHour: normalHour,
		pmOrAm: pmOrAm,
		min: min,
		normalMin: min < 10 ? `0${min}` : min
	};
};

const convertToMDD = (timestamp) => {
	var getTime = new Date(timestamp);
	var monthIndex = getTime.getMonth();
	var month = months[getTime.getMonth()];
	var date = getTime.getDate();
	var dayIndex = getTime.getDay();
	var day = days[getTime.getDay()];

	return month + ", " + date + ", " + day
};

const convertToNormHourMin = (timestamp) => {
	var getTime = new Date(timestamp);
	var hour = getTime.getHours();
  var min = getTime.getMinutes();
  var normalMin;
  if (min < 10) { 
  	normalMin = `0${min}`;
  } 
  else { 
  	normalMin = min;
  };

  var pmOrAm;
  var normalHour;
	if (hour > 12) {
  	pmOrAm = 'PM';
  	normalHour = hour - 12;
  } else {
  	pmOrAm = 'AM';
  	normalHour = hour;
  }
  return normalHour + " : " + normalMin + " " + pmOrAm;
};

const convertEtcToHourMin = (etc) => {
	const etcNumber = Number(etc);
	if (etcNumber >= 60) {
		const hour = Math.floor(etcNumber/60);
		const hourString = String(hour);
		const min = etcNumber - (60 * hour)
		const minString = String(min);
		if (min == 0) {
			return hourString + ' hour'
		} else {
			return hourString + ' hour ' + minString + ' min'
		}
	} else {
		return String(etcNumber) + ' min'
	}
};

const convertToWeekInMs = (timestamp) => {
	// timestamp: number
	// return number
	const dayInMs = 86400000;
	var getTime = new Date(timestamp);
	var year = getTime.getFullYear();
	var monthIndex = getTime.getMonth();
	var date = getTime.getDate();
	var day = getTime.getDay();
	var dateTimestamp = new Date( year, monthIndex, date).getTime();
	// 0      (0 - 6)
	// sunday day
	var sundayDiff = day * dayInMs;
	var sundayTimestamp = dateTimestamp - sundayDiff;

	return sundayTimestamp;
};

const convertToMonthInMs = (timestamp) => {
	// timestamp: number
	// return number
	var getTime = new Date(timestamp);
	var year = getTime.getFullYear();
	var monthIndex = getTime.getMonth();
	var monthTimestamp = new Date( year, monthIndex, 1).getTime();

	return monthTimestamp;
};

const convertToYearInMs = (timestamp) => {
	// timestamp: number
	// return number
	var getTime = new Date(timestamp);
	var year = getTime.getFullYear();
	var yearTimestamp = new Date( year, 0, 1).getTime();

	return yearTimestamp;
};

const convertToMonthly = (timestamp) => {
	var getTime = new Date(timestamp);
	var year = String(getTime.getFullYear());
	var abbreviatedYear = year.slice(2, 4);
	var monthIndex = getTime.getMonth();
	var month = months[getTime.getMonth()];
	var date = getTime.getDate();
	var dayIndex = getTime.getDay();
	var day = days[getTime.getDay()];

	return month + ", " + abbreviatedYear
}

var getDaysInMonth = (month, year) => {
  // Day 0 is the last day in the previous month
 	return new Date(year, month+1, 0).getDate();
};

export default { 
	convertToDateInMs,
	getDayIndex,
	getDateTimestamp,
	convertToTime, 
	convertToMDD, 
	convertToNormHourMin, 
	convertEtcToHourMin, 
	convertToWeekInMs, 
	convertToMonthInMs, 
	convertToYearInMs, 
	convertToMonthly,
	getDaysInMonth
}