~function(){
var Format = window.Format = window.Format || function (type){
	this.type = type;
	this.toString = function(){
		return this.type;
	}
}
Format.noop = function(data){
	return data;
};
Format.prototype.func1 = Format.noop;	// format
Format.prototype.func2 = function(data){	// compress
    return data.replace(/([\r\n]+|\/\*.*?\*\/)/g, '').replace(/[\t\s]+/g, ' ').replace(/\s*([=,:;<>\{\}])\s*/g, '$1');
};
Format.prototype.loadDemo = function(){
	return (document.getElementById(this.type) || {}).innerHTML;
};
Format.regist = function(name, func1, func2){
	var instant = Format[name] = new Format(name);
	instant.func1 = func1 || instant.func1;
	instant.func2 = func2 || instant.func2;
};
Format.get = function(name){
	return Format[name] || new Format();
};

Format.regist('css', cssbeautify);
Format.regist('js', js_beautify);
Format.regist('json', js_beautify);
Format.regist('jade', function(html, cb){
	Html2Jade.convertHtml(html, {
		tabs: false,
		nspaces: 4,
		donotencode: true,
		bodyless: !(/<html>/i).test(html),
	}, function (err, jade) {
		cb(jade);
	});
});

Format.regist('html', style_html);

Format.regist('sensors', function(str, cb) {
	if (!str) {
		return;
	}
	try {
		str = JSON.stringify(JSON.parse(decodeURIComponent(escape(window.atob(decodeURIComponent(str))))), null, 4);
	} catch (e) {
		str = '<span style="color: #f1592a;font-weight:bold;">' + e + '</span>';
	}
	cb(str);
}, function(str, cb) {
	if (!str) {
		return;
	}
	try {
		str = JSON.parse(str);
		str = window.btoa(unescape(encodeURIComponent(JSON.stringify(str))));
		// 传递给 url query params 时，需要再 encodeURIComponent 一次
	} catch (e) {
		str = '<span style="color: #f1592a;font-weight:bold;">' + e + '</span>';
	}
	cb(str);
});

Format.regist('foxer', function(str, cb) {
	if (!str) {
		return;
	}
	try {
		str = JSON.stringify(JSON.parse(decodeURIComponent(unescape(atob(decodeURIComponent(str))))), null, 4);
	} catch (e) {
		str = '<span style="color: #f1592a;font-weight:bold;">' + e + '</span>';
	}
	cb(str);
}, function(str, cb) {
	if (!str) {
		return;
	}
	try {
		str = JSON.parse(str);
		str = encodeURIComponent(window.btoa(escape(encodeURIComponent(JSON.stringify(str)))));
		// 传递给 url query params 时，需要再 encodeURIComponent 一次
	} catch (e) {
		str = '<span style="color: #f1592a;font-weight:bold;">' + e + '</span>';
	}
	cb(str);
});

Format.regist('interface', function(str, cb) {
	if (!str) {
		return;
	}
	var result = 'interface xxx {';
	try {
		var obj = JSON.parse(str);
		Object.keys(obj).forEach(function(key) {
			var type = typeof obj[key];
			if (type === 'function') {
				type = 'Function';
			} else if (type === 'object') {
				type = 'any';
			}
			result += '\n\t' + key + ': ' + type + ';';
		});
		str = result + '\n}';
	} catch (e) {
		str = '<span style="color: #f1592a;font-weight:bold;">' + e + '</span>';
	}
	cb(str);
}, function(str, cb) {
	if (!str) {
		return;
	}
	cb(str);
});

Format.regist('markdown', toMarkdown, new Markdown.Converter().makeHtml);

}();
