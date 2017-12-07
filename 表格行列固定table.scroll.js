/****************************************************************

jQuery 插件.

功能: 固定表格标题行或列头

Version: 1.0
Author: liuyar
Date: 2010-03-12

调用方法:
$('#myTable').fixTable(
	pRow, //可滚动区域第一行的行号
	pCol, //可滚动区域第一列的列号
	splitColor, //(可选)固定区域与滚动区域的分隔线颜色
);


****************************************************************/

jQuery.fn.extend({ fixTable: function(pRow, pCol, splitColor){
	//滚动条宽度
	var scrW = 16;

	//设置分隔线颜色
	if(!splitColor){
		splitColor = '#333';
	}

	//得到表格本身
	var t = $(this);
	var pid = 'fixbox_'+t.attr('id');
	
	t.show();

	//得到表格实际大小
	var tw = t.outerWidth(true);
	var th = t.outerHeight(true);

	//在外部包一个DIV,用来获取允许显示区域大小
	t.wrap("<div id='"+pid+"' ></div>");
	var p = $('#'+pid);
	p.css({
		width: '100%',
		height: '100%',
		border: '0px',
		margin: '0 0 0 0',
		padding: '0 0 0 0'
	});

	//允许显示区域大小
	t.hide();
	var cw = p.outerWidth(true);
	var ch = p.outerHeight(true);
	t.show();
	
	//拿到表格的HTML代码
	var thtml = p.html();

	//判断是否需要固定行列头
	if(tw<=cw && th<=ch){
		return;
	}
	//判断需要固定行/列/行列
	var fixType = 4;	//全固定
	if(tw<=cw-scrW){	//宽度够, 高度不够
		fixType = 1;	//行固定
		cw = tw+scrW;
	}else if(th<=ch-scrW){	//高度够, 宽度不够
		fixType = 2;	//列固定
		ch = th+scrW;
	}
	//固定单元格的位置
	var w1 = 0;
	var h1 = 0;

	var post = t.offset();

	var p1, p2, p3, p4;
	if(fixType==4){	//行头列头都需固定
		//取出指定行列单元格左上角的位置,单位px
		var pos = t.find('tr').eq(pRow).find('td').eq(pCol).offset();
		
		w1 = pos.left - post.left;
		h1 = pos.top - post.top;

		var tmp='<table style="background: #ECE9D8;" ';
		tmp+='border="0" cellspacing="0" cellpadding="0">';
		tmp+='<tr><td style="border-right: 1px solid '+splitColor+
			';border-bottom: 1px solid '+splitColor+'">';
		tmp+='<div id="'+pid+'1"></div></td>';
		tmp+='<td style="border-bottom: 1px solid '+splitColor+
			';"><div id="'+pid+'2"></div></td></tr>';
		tmp+='<tr><td valign="top" style="border-right: 1px solid '+
			splitColor+';"><div id="'+pid+'3"></div></td>';
		tmp+='<td><div id="'+pid+'4"></div></td></tr>';
		tmp+='</table>';

		p.before(tmp);
		
		$('div[id^='+pid+']').each(function(){
			$(this).css({
				background: 'white',
				overflow: 'hidden',
				margin: '0 0 0 0',
				padding: '0 0 0 0',
				border: '0'
			});
		});
		p1 = $('#'+pid+'1');
		p2 = $('#'+pid+'2');
		p3 = $('#'+pid+'3');
		p4 = $('#'+pid+'4');
		
		//左上角方块
		p1.html(thtml).css({width: w1-1, height: h1-1});
		p1.find('table:first').attr('id',undefined);

		//右上方块
		p2.html(thtml).css({width: cw-w1-scrW, height: h1-1});
		p2.find('table:first').css({
			position: 'relative',
			left: -w1
		}).attr('id',undefined);

		//左下方块
		p3.html(thtml).css({width: w1-1, height: ch-h1-scrW});
		p3.find('table:first').css({
			position: 'relative',
			top: -h1
		}).attr('id',undefined);

		//主方块
		p4.append(p).css({
			width: cw-w1, 
			height: ch-h1,
			overflow: 'auto'
		});

		t.css({
			position: 'relative',
			top: -h1,
			left: -w1
		});

		p.css({width: tw-w1, height: th-h1, overflow: 'hidden'});
		
		p4.scroll(function(){
			p2.scrollLeft($(this).scrollLeft());
			p3.scrollTop($(this).scrollTop());
		});
	}else if(fixType==1){	//只需固定行头
		var pos = t.find('tr').eq(pRow).find('td').first().offset();
		h1 = pos.top - post.top;

		var tmp='<table style="background: #ECE9D8;" ';
		tmp+='border="0" cellspacing="0" cellpadding="0">';
		tmp+='<tr><td style="border-bottom: 1px solid '+splitColor+'">';
		tmp+='<div id="'+pid+'1"></div></td></tr>';
		tmp+='<tr><td><div id="'+pid+'2"></div></td></tr>';
		tmp+='</table>';

		p.before(tmp);
		
		$('div[id^='+pid+']').each(function(){
			$(this).css({
				background: 'white',
				overflow: 'hidden',
				margin: '0 0 0 0',
				padding: '0 0 0 0',
				border: '0'
			});
		});
		p1 = $('#'+pid+'1');
		p2 = $('#'+pid+'2');
		//上方方块
		p1.html(thtml).css({width: tw, height: h1-1});
		p1.find('table:first').attr('id',undefined);

		//主方块
		p2.append(p).css({
			width: cw+1, 
			height: ch-h1,
			overflow: 'auto'
		});

		t.css({
			position: 'relative',
			top: -h1,
			left: 0
		});

		p.css({width: tw, height: th-h1, overflow: 'hidden'});
	}else if(fixType==2){	//只需固定列头
		var pos = t.find('tr').first().find('td').eq(pCol).offset();
		w1 = pos.left - post.left;

		var tmp='<table style="background: #ECE9D8;" ';
		tmp+='border="0" cellspacing="0" cellpadding="0">';
		tmp+='<tr><td valign="top" style="border-right: 1px solid '+splitColor+'">';
		tmp+='<div id="'+pid+'1"></div></td>';
		tmp+='<td><div id="'+pid+'2"></div></td></tr>';
		tmp+='</table>';

		p.before(tmp);
		
		$('div[id^='+pid+']').each(function(){
			$(this).css({
				background: 'white',
				overflow: 'hidden',
				margin: '0 0 0 0',
				padding: '0 0 0 0',
				border: '0'
			});
		});
		p1 = $('#'+pid+'1');
		p2 = $('#'+pid+'2');
		//上方方块
		p1.html(thtml).css({width: w1-1, height: th});
		p1.find('table:first').attr('id',undefined);

		//主方块
		p2.append(p).css({
			width: cw-w1, 
			height: ch+1,
			overflow: 'auto'
		});

		t.css({
			position: 'relative',
			top: 0,
			left: -w1
		});

		p.css({width: tw-w1, height: th, overflow: 'hidden'});
	}
}});