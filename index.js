(function($, undefined) {
	var canvas = $("#canvas");
	var time = $("#time");
	var WINDOW = $(window);
	var Time = {
		map:null,
		bg:null
	};
	var Width = canvas.width();
	var Height = canvas.height();
	var fps = 24;
	var speed = 5;
	var m_length = 10;

	var jump_height = 100;
	var jump_time = (Width/m_length/speed)*fps*1.7;

	var Road = [];

	var width = Width/m_length;

	var G = {};
	// Width = (m_length+2)*Width/m_length;

	var registerKeyEvent = function(keys,eventFoo){
		keys = (keys+"").toUpperCase();
		var i=0;
		var Length = keys.length;
		var key;
		WINDOW.on("keydown",function(event) {
			// console.log(event.keyCode)
			for(i=0;i<Length;i+=1){
				if(event.keyCode === keys.charCodeAt(i)){
					eventFoo(event,keys.charAt(i));
				}
			}
			return false;
		});
	};


	canvas.on("mousedown",function(event){
		event.stopPropagation();
		// console.log("no selete");
		return false;
	});

	var Init = function(num){
		var Maps = [];
		var MapsBMP = [];
		var random_key = ~~(Math.random()*10000);
		var land = false;
		// var width = Width/m_length;
		var i;
		var t_m_length;
		for(i = 0;i<~~(m_length/2);i+=1){
			Maps[i] = {
				land : true,
				location : Width-i*width
			};
			// Maps[i] = i*width;
		}
		for(;i<m_length+2;i+=1){
			random_key = ~~(random_key*random_key/100);
			if (land) {//一旦上次的land是false，立马补一个true
				land = !!(random_key%2);
				Maps[i] = {
					land : land,
					location : Width-i*width
				};
				// if (land) {
				// 	Maps[i] = i*width;
				// }
			}else{
				Maps[i] = {
					land : true,
					location : Width-i*width
				};
				// Maps[i] = i*width;
				land = true;
			}
		}
		Road[num] = {
			data:Maps,
			bmp:MapsBMP,
			main:$('<ul id="land-'+num+'"></ul>'),
			obj:$('<div class="obj" id="obj-'+num+'">0 Deaths</div>')
		}
		canvas.append(Road[num].main);
		for(i-=1;i>=0;i-=1){
			if (Maps[i].land) {
				MapsBMP[i] = $('<li class="land" style="margin-left:'+Maps[i].location+'px;width:'+width+'px">'+i+'</li>');
			}else{
				MapsBMP[i] = $('<li class="empty-land" style="margin-left:'+Maps[i].location+'px;width:'+width+'px">'+i+'</li>');
			}
			Road[num].main.append(MapsBMP[i]);
		}

		var obj = Road[num].obj;
		canvas.append(obj);
		obj.offset({
			"top":Road[num].bmp[0].offset().top-obj.height(),
			"left":Width/2+1.2*width*num
		});

	};

	var refreshData = function(num){
		var Maps = Road[num].data;
		var Length = Maps.length;
		var t_Width = ~~(1.2*Width);
		var location;
		for (var i = 0; i < Length; i+=1) {
			location = Maps[i].location += speed;
			location%=t_Width;
			if (location!==Maps[i].location) {
				Maps[i].location = location;
				// console.log(location)
				if (Maps[(i-1+Length)%Length].land) {//如果上一个land不是true，马上补一个
					Maps[i].land = !!(~~(Math.random()*100)%2);
				}else{
					Maps[i].land = true;
				}
			};
		}
	};
	var refreshBMP = function(num){
		var Maps = Road[num].data;
		var MapsBMP = Road[num].bmp;
		var Length = Maps.length;
		for (var i = 0; i < Length; i+=1) {
			var dom = MapsBMP[i][0];
			if (Maps[i].land) {
				dom.className = "land";
			}else{
				dom.className = "empty-land";
			}
			// MapsBMP[i].animate({"marginLeft":(Maps[i].location-width+"px")},fps);
			dom.style.marginLeft = Maps[i].location-width+"px";
		}
	}

	var isDead = function(num){
		var obj = Road[num].obj;
		var Maps = Road[num].data;
		var location;
		var last_death = G["last_"+num+"_death"];
		if (!obj.location) {
			obj.location = obj.offset().left+obj.width()/2;
		}
		location = obj.location;
		var i,Length = Maps.length;
		for(i = 0;i < Length;i+=1){
			var map = Maps[i];
			if (!map.land/*&&!G["obj_"+num+"_jumping"]*/) {//no land,down?
				if(map.location > location&&map.location-width<location&&last_death!==i){
					// obj.html("beg:"+map.location+"<br/>"+"end:"+(map.location-width)+"<br/>"+"loc:"+location+"<br/>");
					// console.log("died~~");
					if(!G["obj_"+num+"_jumping"]){//no jumping
						console.log(G["obj_"+num+"_jumping"])
						obj.html(parseInt(obj.html())+1+" Deaths");
						G["last_"+num+"_death"] = i;
					}else{
						G["last_"+num+"_death"] = -1;
					}
					// obj.html(i+":"+G["last_"+num+"_death"]);

				}
			}
		}
	};


	Init(0);
	Init(1);


	G.obj_0_jumping = false;
	G.obj_0_top = parseFloat(Road[0].obj.css("top"));

	registerKeyEvent("df",function(){
		console.log("jump!!");
		if(G.obj_0_jumping===false){
			var obj = Road[0].obj;
			G.obj_0_jumping = true;
			var time = jump_time/2;

			obj.animate({
				top:(G.obj_0_top-jump_height)+"px"
			},time,"easeOutBack",function(){
				obj.animate({
					top:(G.obj_0_top+"px")
				},time,"easeInBack",function(){
						G.obj_0_jumping = false;
					});
			});

		}
	});

	G.obj_1_jumping = false;
	G.obj_1_top = parseFloat(Road[1].obj.css("top"));

	registerKeyEvent("jk",function(){
		console.log("jump!!");
		if(G.obj_1_jumping===false){
			var obj = Road[1].obj;
			G.obj_1_jumping = true;
			var time = jump_time/2;

			obj.animate({
				top:(G.obj_1_top-jump_height)+"px"
			},time,"easeOutBack",function(){
				obj.animate({
					top:(G.obj_1_top+"px")
				},time,"easeInBack",function(){
						G.obj_1_jumping = false;
					});
			});

		}
	});

	Time.map = null;
	Time.all = 0;
	registerKeyEvent(" ",function(){
		if(Time.map===null){
			Time.being = (new Date()).valueOf();
			Time.map = setInterval(function(){
				refreshData(0);
				refreshBMP(0);
				isDead(0);
				refreshData(1);
				refreshBMP(1);
				isDead(1);
				Time.end = (new Date()).valueOf();
				Time.all = ~~((Time.end - Time.being));
				Time.delay = new Date(Time.all);
				time.html(Time.delay.getMinutes()+":"+Time.delay.getSeconds());
			},fps);
		}else{
			clearInterval(Time.map);
			Time.map = null;
		}
	})



})(jQuery);