var http = require('http');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var filter = require('./demo1.js'); //引入读写文件的js

var url = 'http://www.haha365.com/joke/index_v_3.htm';
//获取分标题链接赋值给urlData
function getUrl() {
	var urlData; 
	http.get(url, function(res) {        
		var html = '';  //res.setEncoding('utf-8');
		var buffer = new BufferHelper();        
		res.on('data', function(data) {            
			buffer.concat(data);        
		});        
		res.on('end', function() {            
			var str = iconv.decode(buffer.toBuffer(), 'gbk');            
			urlData = filterChapters(str);
			for (var i = urlData.length - 1; i >= 0; i--) {
				console.info(urlData[i]);
				var chinUrl='http://www.haha365.com' +urlData[i];
				filter.getUrlWriteFile(chinUrl);
			}
		});     
	}).on('error', function() {    
		console.info('获取url出错');    
	}); 


} 
function filterChapters(html) {    
	var $ = cheerio.load(html);     //所以帖子列表
	     //var content = $("div[id^='post_content_']");
	    
	var content = $('.text_doublelist1 li');    
	var urlContent = [];    
	content.each(function() {        
		urlContent.push($(this).find('a').last().attr('href'));    
	});     //获取标题
	     //var title = $('.con').find("h1").text();
	    
	return urlContent;
}

getUrl();
