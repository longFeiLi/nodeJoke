var http = require('http');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

var BufferHelper = require('bufferhelper');

var fs = require('./fs.js'); //引入读写文件的js

var file = "D:\\幽默笑话.txt"; //路径

// fs.writeFile(file);  &#xFFFD;
// fs.readFile(file);
//                               /yr_joke/628868.htm

function getUrlWriteFile(ulr) {
		http.get(ulr, function(res) {
			var html = '';
			//res.setEncoding('utf-8');
			var buffer = new BufferHelper();
			res.on('data', function(data) {
				buffer.concat(data);
			});
			res.on('end', function() {
				var str = iconv.decode(buffer.toBuffer(), 'gbk');
				fs.writeFile(file, filterChapters(str));
			});

		}).on('error', function() {
			console.info('获取url出错');

		});
}



function filterChapters(html) {
	var $ = cheerio.load(html);
	//所以帖子列表
	//var content = $("div[id^='post_content_']");
	var content = $('#endtext').text();

	//获取标题
	var title = $('.con').find("h1").text();
	return "\n\n" + title + content;
}



exports.getUrlWriteFile = getUrlWriteFile;