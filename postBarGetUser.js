var http = require('http');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var BufferHelper = require('bufferhelper');
var fs = require('./fs.js'); //引入读写文件的js
var file = "D:\\大深圳吧用户.txt"; //路径

var url = 'http://tieba.baidu.com/f/like/furank?kw=%B4%F3%C9%EE%DB%DA&pn=';

//获取分标题链接赋值给urlData
function getUrl(urlHttp) {
	var urlData; 
		http.get(urlHttp, function(res) {        
			var html = '';  //res.setEncoding('utf-8');
			var buffer = new BufferHelper();        
			res.on('data', function(data) {            
				buffer.concat(data);        
			});        
			res.on('end', function() {            
				var str = iconv.decode(buffer.toBuffer(), 'gbk');            
				urlData = filterChapters(str);
				//console.log(urlData);
				for (var i = urlData.length - 1; i >= 0; i--) {
					fs.writeFile(file, ('@' + urlData[i] + '\n'));
				}

			});     
		}).on('error', function() {    
			console.info('获取url出错');    
		}); 
}

// 构造url
function updateUrl(){
  var urlHttp;
  for (var i = 1; i < 70; i++) {
  	urlHttp=url+i;
  	getUrl(urlHttp);
  }

}


 
function filterChapters(html) {    
		var $ = cheerio.load(html);     //所以帖子列表
		//var content = $("div[id^='post_content_']");
		var content = $('.drl_item_card a');
		var urlContent = [];    
		content.each(function() {        
			urlContent.push($(this).text());    
		});     //获取标题
		//  var title = $('.con').find("h1").text();
		    
		return urlContent;
	}

	updateUrl();