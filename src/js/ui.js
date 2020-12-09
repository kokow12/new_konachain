(function() {
	var $DOC = $(document);
	var $WIN = $(window);

	// init. [.input-text, .search-input] btn-remove function
	$.fn.inputText = function(){
		$(this).each(function(){
			var $input = $(this).children('input');
			var $btn = $(this).children('.btn-remove');

			if($input.length > 0 && $btn.length > 0) {
				$input.off('.input-text').on('input.input-text', function(e){
					if(this.value.length > 0) {
						$btn.addClass('active');
					} else {
						$btn.removeClass('active');
					}
				}).trigger('input.input-text');

				$btn.on('click',function(e){
					e.preventDefault();

					$input.val('').focus();
					$btn.removeClass('active');
				});
			}

		});
	};

	// banner-box
	$.fn.bannerBox = function(){
		$(this).each(function(){
			var $this = $(this);
			var $target = $this.children();
			var open_flag = false;
			var sct = 0;
			var st_sc_l = 0;
			var timer = null;

			$target.on('touchstart',function(){
				$target.stop();
				clearTimeout(timer);
				st_sc_l = $target.scrollLeft();
			}).on('touchend',function(e){
				if(st_sc_l != $target.scrollLeft()) {
					e.preventDefault();
					if(open_flag) { //close
						clearTimeout(timer);
						timer = setTimeout(function(){
							open_flag = false;
							if($target.scrollLeft() > 0) {
								$target.animate({
									"scrollLeft" : 0
								},200);
							}
						},400);
					} else { //open
						clearTimeout(timer);
						timer = setTimeout(function(){
							open_flag = true;
							if($target.scrollLeft() < 80) {
								$target.animate({
									"scrollLeft" : 80
								},200);
							}
						},400);
					}
				}
			});

			$target.scroll(function(e){
				sct = $target.scrollLeft();
			});

			$this.find('.btn-banner-remove').on('click',function(){
				$target.off('touchstart');
				$target.off('touchend');
				$target.off('scroll');
				$this.slideUp();
			});
		});
	};

	// animateCounting
	$.fn.animateCounting = function(){
		$(this).each(function(){
			var $this = $(this);
			var num = Number($this.attr('data-counting'));
			var arr = [];
			var timer;

			$this.text(0);
			if(num > 50) {
				var n = Math.round(num/50);

				for(var i=0; i<50; i++) {
					arr.push((i*n).toLocaleString());
				}
				var i=0;
				var timer = setInterval(function(){
					$this.text(arr[i++]);

					if(i>49) {
						$this.text(num.toLocaleString());
						clearInterval(timer);
					}
				},20);
			} else {
				var i = 0;
				var timer = setInterval(function(){
					$this.text(i.toLocaleString());
					i++;

					if(i>num) {
						clearInterval(timer);
					}
				},20)
			}
		});
	};

	// open popup
	$.fn.openPopup = function(){
		$(this).addClass('open');
	};

	// close popup
	$.fn.closePopup = function(){
		$(this).removeClass('open');
	};

	// show active
	$.fn.showActive = function(){
		$(this).each(function(){
			console.log('target');
			var $target = $(this).find('.active');
			if($target.length == 1) {
				var $scrollWrap = $target.parent();
				var target_l = $target.offset().left;

				if($scrollWrap.width() < target_l + $target.outerWidth(true)) {
					$scrollWrap.scrollLeft(target_l - 16);
					// $scrollWrap.animate({
					// 	scrollLeft: target_l - 16
					// }, 1000);
				}
			}
		});
	};

	// accordion
	$.fn.accordionBox = function(){
		$(this).find('.acc-anchor').each(function(){
			var $anchor = $(this);
			var $panel = $anchor.next('.acc-panel');

			if($anchor.length == 1 && $panel.length == 1) {
				if($anchor.hasClass('active')) {
					$panel.show();
				} else {
					$panel.hide();
				}

				$anchor.off('.acc-anchor').on('click.acc-anchor',function(){
					var $this = $(this);
					if($this.hasClass('active')) { // close
						$this.removeClass('active');
						$panel.stop().slideUp(400);
					} else { // open
						$this.addClass('active');
						$panel.stop().slideDown(400);
					}
				});
			}
		});
	};

	// document ready
	$DOC.ready(function(){
		// sidebar open & close
		$('.btn-open-sidebar').on('click',function(e){ // open
			var $sidebar = $('.sidebar');

			if($sidebar.length > 0) {
				$sidebar.show();
				$('body, html').addClass('overflow-hidden');

				setTimeout(function(){
					$sidebar.addClass('open-ani'); //open animation start

					$sidebar.on('click', function(e){ //bind close event
						var $target = $(e.target);

						if($target.hasClass('sidebar') || $target.hasClass('btn-close-sidebar')) {
							e.preventDefault();
							$sidebar.off(e); // unbind close event
							$sidebar.removeClass('open-ani'); //close animaition start

							setTimeout(function(){ // after animation
								$sidebar.hide();
								$('body, html').removeClass('overflow-hidden');
							},600);
						}
					});
				},20);
			}
		});

		// gnb
		var $gnb_1depth_anchor = $('.gnb-1depth > li > a:not(:only-child)');

		$gnb_1depth_anchor.on('click',function (e){
			e.preventDefault();
			var $this = $(this);

			if($this.hasClass('active')) { // close
				$this.removeClass('active').next('.gnb-2depth').stop().slideUp(400);
			} else { // open
				if($gnb_1depth_anchor.filter('.active').length > 0) {
					$gnb_1depth_anchor.filter('.active').removeClass('active').next('.gnb-2depth').stop().slideUp(400);
				}
				$this.addClass('active').next('.gnb-2depth').stop().slideDown(400);
			}
		});

		var $gnb_1depth_anchor1 = $('.1depth > li > .depth_btn');

		$gnb_1depth_anchor1.on('click',function (e){
			e.preventDefault();
			var $this = $(this);

			if($this.hasClass('active')) { // close
				$this.removeClass('active').siblings('.gnb-2depth').stop().slideUp(400);
			} else { // open
				if($gnb_1depth_anchor1.filter('.active').length > 0) {
					$gnb_1depth_anchor1.filter('.active').removeClass('active').siblings('.gnb-2depth').stop().slideUp(400);
				}
				$this.addClass('active').siblings('.gnb-2depth').stop().slideDown(400);
			}
		});

		// nav-2depth
		$('.nav-2depth > .anchor').on('click', function(e){
			e.preventDefault();
			e.stopPropagation();

			var $this = $(this);
			var $list = $this.next('.list');
			var evt = null;

			if($list.length == 0) return;

			if($this.hasClass('active')) {
				// close
				$DOC.trigger('click.nav-2depth');
			} else {
				// open
				$this.addClass('active');
				$list.stop().slideDown(400);

				$DOC.on('click.nav-2depth',function(e){
					// click outside > close
					if($(e.target).closest('.nav-2depth').length == 0) {
						$this.removeClass('active');
						$list.stop().slideUp(400);

						$DOC.off(e);
					}
				});
			}
		});

		// search-select
		$('.search-select').each(function(){
			var $this = $(this);
			var $combobox = $this.children('.search-select-combobox');
			var $option =  $this.children('.search-select-option');
			var $option_items = $option.find('li');

			if($combobox.length == 0 || $option.length == 0 || $option_items.length == 0) return true;

			// open & close
			$combobox.on('click', function(e){
				e.preventDefault();
				e.stopPropagation();

				if($combobox.hasClass('active')) { // close option list
					$this.trigger('click');
				} else { // open option list
					$combobox.addClass('active');
					$option.stop().slideDown(200);

					$DOC.on('click',function(e){
						// close option list
						$combobox.removeClass('active');
						$option.stop().slideUp(200);

						$DOC.off(e);
					});
				}
			});

			// select option
			$option_items.on('click', function(e){
				var $this = $(this);

				if(!$this.hasClass('selected')) {
					$option_items.removeClass('selected');
					$this.addClass('selected');
					$combobox.text($this.text()).attr('data-value',$this.attr('data-value'));

					$combobox.trigger('option-change',{ // pass text, value, index
						"text" : $this.text(),
						"value" : $this.attr('data-value'),
						"index" : $this.index()
					}); // trigger custom event

					$combobox.focus();
				}
			});
		});

		var sct = $WIN.scrollTop();
		var d = sct + $WIN.height();

		// data-width-ani
		var $data_width_ani = $('[data-width-ani]');
		var $data_counting =  $('[data-counting]');

		$WIN.scroll(function(e){
			sct = $WIN.scrollTop();
			d = sct + $WIN.height();

			$data_width_ani.each(function(){
				var $this = $(this);
				if(d > $this.offset().top) {
					$this.css('width', $this.attr('data-width-ani') + '%').addClass('active');
					$data_width_ani = $('[data-width-ani]:not(.active)');
				}
			});

			$data_counting.each(function(){
				var $this = $(this);
				if(d > $this.offset().top) {
					$this.animateCounting();
					$this.addClass('active');
					$data_counting = $('[data-counting]:not(.active)');
				}
			});
		});

		$WIN.scroll();

		// init. result-box-accordion
		$('.result-box-accordion').accordionBox();

		// init. [.input-text, .search-input] btn-remove function
		$('.input-text, .search-input').inputText();

		// banner-box
		$('.banner-box').bannerBox();
		
		// select hour js
		var hour=[];
		var value="";
		for(var i = 0; i < 24; i++){
			if (i < 10) {
				value = "0" +i;
			}else{
				value = i;
			}
			hour[i] = "<option value="+value+">"+value+"</option>";
		}
		$("#hourStartTiem").append(hour.join(''));
		$("#hourEndTiem").append(hour.join(''));
		
		// select min js
		var min=[];
		var value="";
		for(var i = 0; i < 60; i+=10){
			if (i < 10) {
				value = "0" +i;
			}else{
				value = i;
			}
			min[i] = "<option value="+value+">"+value+"</option>";
		}
		$("#minStartTiem").append(min.join(''));
		$("#minEndTiem").append(min.join(''));

	}); // document ready

	// header js
	window.onscroll = function () { myFunction() };
	function myFunction() {
		if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 80) {
			document.getElementById("header-scroll").className = "header purple scroll";
		} else {
			document.getElementById("header-scroll").className = "header purple";
		}
	};
	
})
();

