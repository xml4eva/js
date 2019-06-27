/*----------/
/*  Common  /
/*---------*/

function SetUniqueRadioButton(nameregex, current)
{

	//-- Use as follows:
	//-- <input value="radSize" type="radio" id="repCollectionModuleTabs_radSize_0" />
	//-- radSize.Attributes.Add("onclick", "SetUniqueRadioButton('repCollectionModuleTabs_radSize', this);");

	re = new RegExp(nameregex);

	//-- Loop ALL the controls in the form
	for (i = 0; i < document.forms[0].elements.length; i++)
	{

		//-- If it is a radio button and it belongs to the Repeater we are checking, uncheck the control
		if (document.forms[0].elements[i].type == 'radio')
		{
			if (re.test(document.forms[0].elements[i].id))
				document.forms[0].elements[i].checked = false;
		}

	}

	//-- And of course check the one the user clicked
	current.checked = true;

}


function RemoveURLParameter(url, parameter)
{

	var urlparts = url.split('?');   

	if (urlparts.length >= 2)
	{

		var prefix = encodeURIComponent(parameter) + '=';
		var pars = urlparts[1].split(/[&;]/g);

		for (var i = pars.length; i-- > 0;)
		{    
			if (pars[i].lastIndexOf(prefix, 0) !== -1)
				pars.splice(i, 1);
		}

		return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');

	}
	
	return url;

}


function getParameterByName(name, url)
{
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}


/*--------/
/*  Util  /
/*-------*/

let UtilIndex = function()
{

	let preventClosingDropDown = function ()
	{		
		$(document).on("click", ".dropdown-menu", function (e)
		{
			if(! $(this).closest(".bs-select").length )
				e.stopPropagation();
		});	
	};
	
	
	let generateExpander = function()
	{
	
		$(".expandable-list").each(function (index)
		{
			if ($(this).children("li").size() > 12)
				$(this).append('<li class="expander"></li>');
		});
		
		$(".expandable-list-xs").each(function (index)
		{
			if ($(this).children("li").size() > 7)
				$(this).append('<li class="expander"></li>');
		});
		
	};
	
	
	let expandLists = function()
	{
		$(".expandable-list .expander, .expandable-list-xs .expander").click(function ()
		{
			$(this).parent().toggleClass('expanded');
		});
	};
	
	
	let setTickColor = function()
	{
		$('.checkbox-container, .radio-container').each(function (pos, el)
		{
			let color = $(el).find('span').css('background-color');
			let colorIsLight = isLight(color);

			if(!colorIsLight)
				$(this).find('input').addClass('lightTick');
			else
				$(this).find('input').addClass('darkTick');
		});		
	};


	let isLight = function (color)
	{

		let r, g, b, hsp;

		if (color.match(/^rgb/))
		{
			color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

			r = color[1];
			g = color[2];
			b = color[3];
		}
		else
		{
			color = +("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));
			r = color >> 16;
			g = color >> 8 & 255;
			b = color & 255;
		}

		hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

		return hsp > 127.5 ? true: false;

	};
	
	
	let trimPageSubtitle = function (numOfLines)
	{
	
		if ($('.page-subtitle').length === 1)
		{
		
			var tmpLineHeight = $('.page-subtitle').css('line-height');
			var lineHeight = tmpLineHeight.substr(0, tmpLineHeight.indexOf('p'));
			var totalAllowedLineHeight = Math.floor((+lineHeight * numOfLines));
			var currHeight = $('.page-subtitle').outerHeight();
			
			if (currHeight > totalAllowedLineHeight)
			{
				$('.page-subtitle').addClass().css({ "max-height": `${totalAllowedLineHeight}px`, "overflow": "hidden" });
				
				if ($('.page-subtitle').find('span').length !== 1)
				{
					$('.page-subtitle').append("<span class='link'><a href='#'> ...La lire Suite</a></span>");
					showFullPageListSubtitle();
				}
			}
			else
				$('.page-subtitle .link').hide();
		}
		
	};
	
	
	let showFullPageListSubtitle = function ()
	{
		$('.page-subtitle .link').click(function ()
		{
			$('.page-subtitle').toggleClass('show');
			$('.page-subtitle .link').toggleClass('position-initial');//css('position', 'inherit');
		});
	};
	

	let selectKeyboardTrigger = function ()
	{
		
		$('body').on("keyup", ".bootstrap-select.show", function (e)
		{

			e.preventDefault();
			var $options, $select, ctrl = this;
			ctrl.buffer = (ctrl.buffer || "");
			$select = $(ctrl).find("select");
			$options = $select.find("option");
			
			if (ctrl.capture)
				clearTimeout(ctrl.capture);
			
			ctrl.capture = window.setTimeout(function ()
			{
				ctrl.buffer = "";
				ctrl.capture = null;
			}, 1000);
			
			ctrl.buffer += String.fromCharCode(e.which);
			var searchVal = ctrl.buffer.charAt(0).toUpperCase() + ctrl.buffer.slice(1);
			var opt = $select.find('option:contains(' + searchVal + ')');
			
			$select.selectpicker("val", opt.val());
			$select.selectpicker('refresh');
			return false;
		
		});
	
	};

	
	return {
		init: function() {
			preventClosingDropDown();
			generateExpander();
			expandLists();
			setTickColor();
			trimPageSubtitle(3);
			selectKeyboardTrigger();
		},

		setTickColor: function() {
			setTickColor();
		}
	};
	
}();


function NewsletterSubscription(emailAddress, fromWhere)
{

	var args = "{\"emailAddress\":\"" + emailAddress + "\", \"fromWhere\":\"" + fromWhere + "\"}";

	$.ajax
	(
		{
			url: "/services/customer/serviceCustomer.aspx/NewsletterSubscription",
			async: true,
			cache: false,
			type: "POST",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: args,

			success: function (data, textStatus, jqXHR)
			{			

				//-- .NET 4 Compatibility
				if (data.d != null)
					data = data.d;

				//-- Success check
				if (data.isSuccess)
				{
					
					//-- Display error message
					$(".newsletter-confirmation").show();
					$(".newsletter-confirmation").html(data.errorMessage);
					$(".newsletter-confirmation").addClass("newsletter-success");

					//-- Redirect in the background to fire statistics like OfSys
					$.get(data.redirectionURL);

				}
				else
				{

					//-- Display error message
					$(".newsletter-confirmation").show();
					$(".newsletter-confirmation").html(data.errorMessage);
					$(".newsletter-confirmation").addClass("newsletter-error");

				}

			},

			error: function (jqXHR, textStatus, errorThrown)
			{
				console.log(textStatus, errorThrown);
			}
		}
	);

}


/*----------/
/*  Header  /
/*---------*/

let Header = function ()
{

	let headerVisibility = function()
	{
		if (window.innerWidth < 992)
		{
			$(window).scroll
			(
				function()
				{
					if (isDomInView('#sectionFooterFaq'))
						$('.fixed-header').fadeOut();
					else
						$('.fixed-header').fadeIn();
				}
			);
		}
	};
	

	let isDomInView = function(elem)
	{
		return $(elem).offset().top - $(window).scrollTop() < $(elem).height();
	};


	return { init: function ()
		{
			headerVisibility();			
		}
	};

}();


var dynamicBasketIsVisible = false;

function HeaderLoadDynamicBasket(isAfterAddingItemInBasket)
{

	//-- If coming after the customer added an item to the Basket, make sure Ajax will be called
	if (isAfterAddingItemInBasket)
		dynamicBasketIsVisible = false;

	//-- Do nothing if we're on one of the checkout pages
	if (window.location.href.toLowerCase().indexOf("shoppingbasket") == -1)
	{
	
		$('#divHeaderBasket').click(function (e)
		{
			
			//-- If link is not "#" (because it's "/shoppingbasket/basket.aspx") do nothing, else continue
			if (($(this).find("a").attr("href") == "#") && (!dynamicBasketIsVisible))
			{

				//-- Hide icon, show indicator
				$(".dynamic-basket-indicator").removeClass("d-none")
				$("#divHeaderBasket").removeClass("d-md-block");

				//-- Set variable
				dynamicBasketIsVisible = true;

				$.ajax
				(
					{

						url: "/services/shoppingBasket/serviceBasket.aspx/GetDynamicBasket",
						async: true,
						cache: false,
						type: "POST",
						contentType: "application/json; charset=utf-8",
						dataType: "json",

						success: function (data, textStatus, jqXHR)
						{			

							//-- .NET 4 Compatibility
							if (data.d != null)
								data = data.d;

							//-- Show icon, hide indicator
							$(".dynamic-basket-indicator").addClass("d-none")
							$("#divHeaderBasket").addClass("d-md-block");

							//-- Set HTML and show it just in case the user was on a PDP, opened it, removed the only item and clicked the Add to Basket button
							$("#divHeaderDynamicBasket").html(data.html);
							$("#divHeaderBasket").addClass("show");
							$("#divHeaderDynamicBasket").addClass("show");
							$("#divHeaderDynamicBasket").show();

							//-- And attach remove click event
							$('.basket-remove-from-cart').click(function (e)
							{

								var args = "{\"shoppingCartLineID\":\"" + $(this).parent().parent().parent().find("[id*=hidShoppingCartLineID]").val() + "\"}";
								var clickedX = $(this);

								$.ajax
								(
									{

										url: "/services/shoppingBasket/serviceBasket.aspx/RemoveItemFromBasket",
										async: true,
										cache: false,
										type: "POST",
										contentType: "application/json; charset=utf-8",
										dataType: "json",
										data: args,

										success: function (data, textStatus, jqXHR)
										{			

											//-- .NET 4 Compatibility
											if (data.d != null)
												data = data.d;

											//-- Remove it
											$(clickedX).closest(".product-line-item").remove();

											//-- Was it the last item?
											if ($("#divHeaderBasket").find(".product-line-item").length == 0)
											{
												oldHTML = $("#aHeaderBasket").html();
												$("#divHeaderDynamicBasket").hide();
												$("#aHeaderBasket").replaceWith('<a href="/shoppingbasket/basket.aspx" id="aHeaderBasket">' + oldHTML + '</a>');
											}
											else
											{

												//-- Since it was not the last item, we have to update the title and footer with the new quantities and price
												$("#h4HeaderDynamicBasketTitle").html(data.dynamicBasketTitle);
												$("#h5HeaderDynamicBasketFooter").html(data.dynamicBasketFooter);

											}

											//-- And the items in basket in the header
											$("#spanHeaderBasketCount").html(data.totalItemsInBasket);

										},

										error: function (jqXHR, textStatus, errorThrown)
										{
											console.log(textStatus, errorThrown);
										}
									}
								);

							});

						},

						error: function (jqXHR, textStatus, errorThrown)
						{
							console.log(textStatus, errorThrown);
						}

					}

				);

			}

		});

	}

}


var searchLayerIsVisible = false;

function HeaderSearchLayerFirstTimeLoad()
{

	var args = "{\"searchQuery\":\"" + $("#txtSearchLayer").val() + "\"}";

	$.ajax
	(
		{
			url: "/services/header/serviceHeader.aspx/GetSearchLayerFirstTimeLoad",
			async: true,
			cache: false,
			type: "POST",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: args,

			success: function (data, textStatus, jqXHR)
			{

				//-- .NET 4 Compatibility
				if (data.d != null)
					data = data.d;

				//-- Set HTML
				$("#searchModal").html(data.html);

				//-- Close button event
				$('.search-modal-close').click(function()
				{
					
					if (searchLayerIsVisible)
					{
					
						$('.fixed-header').css('position', 'fixed');
						$('#menu-nav').css('margin-top', '125px');
						$('#searchModal').modal('hide');
						searchLayerIsVisible = !searchLayerIsVisible;

						//-- For PDP only
						if ($("#hidIsPDP").val() == "1")
							$("body").addClass("product-page");

					}

				});

			},

			error: function (jqXHR, textStatus, errorThrown)
			{
				console.log(textStatus, errorThrown);
			}
		}
	);

	//-- And attach click event
	$('.search-input-header').click(function()
	{

		//-- For PDP only, but we can go ahaed and remove it regardless where we are
		$("body").removeClass("product-page");

		if (window.innerWidth > 992)
			$('.fixed-header').css('position', 'initial');

		if (!searchLayerIsVisible)
		{
			$('#menu-nav').css('margin-top', '0');
			$('#searchModal').modal({ show: true, backdrop: 'static', keyboard: false });
			searchLayerIsVisible = !searchLayerIsVisible;
		}

		$(".search-modal").on('shown.bs.modal', function()
		{
			if (window.innerWidth < 992)
				$(document).off('focusin.modal');
			else
				$(".search-modal-input").focus();;
		});

		//-- Refresh carousels
		$('.search-layer-empty-carousel').slick('refresh');
		$('.search-layer-filled-carousel').slick('refresh');

	});

}


var searchSuggestionsTimespan;

function GetSearchSuggestions(event, searchQuery, txtSearchLayer)
{

	//-- Ignore everything if the user did not type a valid key
	if ((event.ctrlKey) || (event.altKey) || (event.metaKey))
		return;

	validKey = ((event.which <= 90 && event.which >= 48) || (event.which == 8) || (event.which == 32) || (event.which <= 105 && event.which >= 96));

	if (!validKey)
		return;

	//-- CSS class
	$(txtSearchLayer).addClass('typing');

	//-- If search query is less than 3 characters long, stop only if the empty type is already displayed, else call the BLL
	if ($(txtSearchLayer).val().length < 3)
	{

		//-- Button switch
		$('header .header-top_search .btn-header').removeClass('gold-search-icon');
		$('.btn-search-modal').css('background-color', '#d2d7d7');
		$(txtSearchLayer).unbind('keypress');
		$('.btn-search-modal').unbind('click');

		//-- If empty block is already being displayed, return since there is no need to call the BLL
		if ($("#hidSearchLayerIsEmpty").val() == "true")
			return;
		else
			$("#hidSearchLayerIsEmpty").val("true");

	}
	else
	{

		//-- Button switch
		$('header .header-top_search .btn-header').addClass('gold-search-icon');
		$('.btn-search-modal').css('background-color', '#412814');

		//-- Events
		$(txtSearchLayer).keypress(function (e)
		{
			if (e.which == 13)
			{
				$('.btn-search-modal').click();
				return false;
			}
		});

		$('.btn-search-modal').click(function (e)
		{
			window.location = '/rechercher/results/' + $(txtSearchLayer).val() + '.aspx';
		});

	}

	//-- Anti-spam
	if (searchSuggestionsTimespan != undefined)
		clearTimeout(searchSuggestionsTimespan);

	//-- Make AJAX call
	searchSuggestionsTimespan = setTimeout(function()
	{

		var args = "{\"searchQuery\":\"" + searchQuery + "\"}";

		$.ajax(
			{
				url: "/services/header/serviceHeader.aspx/GetSearchLayerWithUserQuery",
				async: true,
				cache: false,
				type: "POST",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: args,

				success: function (data, textStatus, jqXHR)
				{

					//-- .NET 4 Compatibility
					if (data.d != null)
						data = data.d;

					//-- Set HTML
					$('[id*="divSearchLayerBlock"]').html(data.html);

					//-- Was empty returned?
					if (data.searchLayerType == "empty")
						$("#hidSearchLayerIsEmpty").val("true");
					else
					{

						$("#hidSearchLayerIsEmpty").val("false");

						//-- Mobile layout changes, this is for when the search returns a Product
						if (data.searchLayerType == "product")
						{

							if (window.innerWidth < 768)
								$('.search-modal-match-product-size-dropdown').remove().appendTo('.product-details-image-container');
							else if (window.innerWidth > 767.98 && window.innerWidth < 991.98)
								$('.search-modal-match-product-size-dropdown').remove().appendTo('.search-body-product-details');
							else if (window.innerWidth > 992)
								$('.search-match-product-sizes').remove().appendTo('.search-body-product-details').insertBefore('.search-match-product-find-size-container');

							if (window.innerWidth < 767.98)
								$('.search-modal-match-product-price-container').remove().appendTo($('.search-layer-product').find('.product-details-image-container').parent());
							else
								$('.search-modal-match-product-price-container').remove().appendTo($('.search-layer-product').find('.search-body-product-details-container'));
					
							//-- And the drop down menu always in case of a search which returns a Product
							if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent))
								$('.bs-select').selectpicker('mobile');
							else
								$('.bs-select').selectpicker();

						}

					}

					//-- Refresh carousels
					$('.search-layer-empty-carousel').slick('refresh');
					$('.search-layer-filled-carousel').slick('refresh');

				},
				error: function (jqXHR, textStatus, errorThrown)
				{
					console.log(textStatus, errorThrown);
				}

			}
		);

	}, 400);

}


/*--------/
/*  Menu  /
/*-------*/

let Menu = function()
{
	
	const delay = 100;
	
	const originalResize = function()
	{
		fixBannerCTA();
	};
	
	
	let resizeTaskId = null;
	
	
	let removeStyles = function()
	{
		if ($(window).outerWidth() >= 991)
		{
			$('.menu-first-level_div, .menu-final-level_div-container').css({'display': '',});
		}
	};
	
	
	let resizeEventListener = function()
	{
		window.addEventListener('resize', evt =>
		{
			if (resizeTaskId !== null)
			{
				clearTimeout(resizeTaskId);
			}
			
			resizeTaskId = setTimeout(() =>
			{
				resizeTaskId = null;
				originalResize(evt);
			}, delay);
		});
	};


	let removeClasses = function()
	{
		$('.menu').removeAttr("style");
		$('body').removeClass("menu-active");
		$('.menu-step').removeClass("ws-activearrow");
		$('.menu-step02').removeClass("ws-activearrow02");
		$('.menu-step03').removeClass("ws-activearrow03");
	};
	
	
	let closeCurrentSubMenu = function()
	{
		$(".sidenav-menu-arrow-back").on('click', function ()
		{
			$(this).parent().parent().hide();
		});
	};
	
	
	let openClosestSubMenu = function()
	{
		$(".sidenav-menu-arrow").on('click', function ()
		{
			$(this).parent().find(".sidenav-menu-links")[0].style.display = 'flex';
		});
	};
	
	
	let closeSideMenu = function()
	{
		$(".sidenav-overlay, .sidenav-close").on('click', function ()
		{
			$(".sidenav-menu-links").hide();
			$(".sidenav-overlay").hide();
			$(".sidenav-overlay").css('z-index', 98);
			document.body.style.overflowY = "auto";
		});
	};
	
	
	let addBackArrows = function()
	{
		$(".menu_header-sm").each(function ()
		{
			if ($(this).parent().parent().closest('.sidenav-menu-links').length !== 0)
				$(this).prepend('<span class="sidenav-menu-arrow-back"></span>');
			
			$(this).append('<span class="sidenav-close"></span>');
		});
	};
	
	
	let addArrowsMobMenu = function()
	{
		$(".sidenav-menu-links>ul>li").each(function ()
		{
			if ($(this).find('.sidenav-menu-links').length !== 0)
				$(this).prepend('<span class="sidenav-menu-arrow"></span>');
		});
	};
	
	
	let addClassEveryTabbingMenu = function()
	{
		$(".menu_div-inner_list > li").on('mouseenter', function ()
		{
			$('li.menu-final-level_link-active').removeClass('menu-final-level_link-active');
			$(this).addClass("menu-final-level_link-active").siblings(this).removeClass("menu-final-level_link-active");
			return false;
		});
	};
	
	
	let menuFirstLevelEvents = function()
	{
		$('.menu-first-level li').mouseenter(function ()
		{
			$("#sidenav-overlay").show();
		});
		
		$('.menu-first-level li').mouseleave(function ()
		{
			$("#sidenav-overlay").hide();
		});
	};
	
	
	let fixBannerCTA = function()
	{
		
		let ctaContainerHeight = $('.header-banner-cta-container').outerHeight();
		
		if (window.innerWidth < 768)
			$('.header-banner-bg').css("margin-bottom", ctaContainerHeight + 'px');
		else
			$('.header-banner-bg').css("margin-bottom", 0);
	};


	return {
		init: function() {
			fixBannerCTA();
			menuFirstLevelEvents();
			resizeEventListener();
			addArrowsMobMenu();
			addBackArrows();
			openClosestSubMenu();
			closeSideMenu();
			closeCurrentSubMenu();
			addClassEveryTabbingMenu();
			removeStyles();
			resizeEventListener();
			$(window).trigger('resize');
		},

		onWindowResize: function() {
			removeStyles();
			removeClasses();
		}
	};

}();


jQuery(document).ready(function()
{
	Menu.init();
});


jQuery(window).resize(function()
{
	Menu.onWindowResize();
});


function MenuShowForMobile(sidenav, fullWidth)
{
	$(".sidenav-overlay").css('z-index', 102);
	$("#sidenav-overlay").show();

	if (fullWidth)
		document.getElementById(sidenav).style.width = '100%';
	else
	{
		document.getElementById(sidenav).style.display = 'flex';
		document.body.style.overflowY = "hidden";
	}
}


/*-----------------/
/*  Scroll to Top  /
/*----------------*/

let Scroll = function ()
{

	let scrollToTop = function ()
	{
		$('.btn-scroll-to-top').click(function (e)
		{
			e.preventDefault();
			$('html, body').animate({scrollTop: 0}, '300');
		});
	};

	return {
		init: function () {
			scrollToTop();
		}
	};

}();


/*----------------/
/*  Product Card  /
/*---------------*/

let ProductCard = function ()
{

	let showProductSizeContainer = function ()
	{

		if (window.innerWidth < 992)
		{
			$('.product-card-overlay').mouseenter(function ()
			{
				$(this).find('.product-card-size-container').hide();
				$(this).find('.product-card-color-icon-container').show();
				$(this).css('padding-bottom', '10px');
			});
		}
		else
		{

			$('.product-card-overlay').mouseenter(function ()
			{
				$(this).find('.product-card-size-container').show();
				$(this).css('padding-bottom', 0);
				$(this).find('.product-card-color-icon-container').css('display', 'none');
			});

			$('.product-card-overlay').mouseleave(function ()
			{
				$(this).find('.product-card-size-container').hide();
				$(this).find('.product-card-color-icon-container').show();
				$(this).css('padding-bottom', '10px');
			});

		}

	};

	let markSizesAsSelected = function()
	{

		$(document).on("click", ".product-size-container div" , function()
		{

			if (!$(this).hasClass('not-available'))
			{

				$(this).parent().children('div').each(function (el, item)
				{
					$(item).removeClass('selected');
				});
				
				$(this).addClass('selected');
			
				//-- Only if we're on a PLP, save the clicked size in the LocalStorage
				if($(this).parents('.page-list-card-container').length == 1)
					localStorage.setItem('lastSelectedSize', $(this).find("span").html());

			}

		});

	};	
	
	let addToWishlist = function()
	{
		$(document).on("click", ".product-card-item .fav-icon" , function()
		{
			//let productId = $(this).closest('.product-card-item').data( "productId" );
		});
	};

	return {
		init: function() {
			showProductSizeContainer();
			markSizesAsSelected();
			addToWishlist();
		},

		onWindowResize: function() {
			showProductSizeContainer();
		},

		showProductSizeContainer: function() {
			showProductSizeContainer();
		}
	};

}();


/*----------/
/*  Footer  /
/*---------*/

let Footer = function()
{

	let toggleFooterInnerListItems = function()
	{

		if (window.innerWidth < 992)
		{
			$('.footer-list-expand-row-container').click(function()
			{
				$(this).find('.footer-list-inner-items').toggleClass('show');
				$(this).find('.footer-list-expander-container').toggleClass('shrink');
			});
		}
		else
		{
			$('.footer-list-inner-items').each(function()
			{
				$(this).addClass('show');
			});
		}
		
		$('#btnFooterNewsletter').click(function()
		{
			NewsletterSubscription($('#txtFooterNewsletter').val(), 'footer');
		});

		$("#txtFooterNewsletter").keypress(function (event)
		{
			if (event.keyCode == 13)
			{
				$("#btnFooterNewsletter").click();
				return false;
			}
		});

	};
	
	let footerNewsletterInit = function()
	{

		if (window.innerWidth < 992)
			$("#btnFooterNewsletter").html('Ok');

	};

	return {
		init: function() {
			toggleFooterInnerListItems();
			footerNewsletterInit();
		},

		onWindowResize: function() {
			footerNewsletterInit();
		},
	};
            
}();


/*-------------------/
/*  Initializations  /
/*------------------*/

jQuery(document).ready(function ()
{
	Header.init();
	HeaderSearchLayerFirstTimeLoad();
	HeaderLoadDynamicBasket(false);
	Menu.init();
	Scroll.init();
	ProductCard.init();
	Footer.init();
	UtilIndex.init();
});


jQuery(window).resize(function ()
{
	ProductCard.onWindowResize();
	Header.init();
	Menu.onWindowResize();
});
