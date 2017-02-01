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
Format.prototype.format = Format.noop;
Format.prototype.compress = function(data){
    return data.replace(/([\r\n]+|\/\*.*?\*\/)/g, '').replace(/[\t\s]+/g, ' ').replace(/\s*([=,:;<>\{\}])\s*/g, '$1');
};
Format.prototype.demo = function(){
	return (document.getElementById(this.type) || {}).innerHTML;
};
Format.regist = function(name, format, compress){
	var instant = Format[name] = new Format(name);
	instant.format = format || instant.format;
	instant.compress = compress || instant.compress;
};
Format.get = function(name){
	return Format[name] || new Format();
};

Format.regist('css', cssbeautify);
Format.regist('js', js_beautify);
Format.regist('json', js_beautify);
Format.regist('html', style_html);
Format.regist('markdown', new Markdown.Converter().makeHtml);

}();
