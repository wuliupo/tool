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
	return (document.getElementById(this.type) || {}).outerHTML;
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
Format.regist('markdown', toMarkdown, new Markdown.Converter().makeHtml);

}();
