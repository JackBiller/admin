/** Arquivo de Funções genericas para ajudar na parametrização da aplicação */

/**
 * Se tenta criar uma perperctiva sobre mim
 * Porém eu não sou um espectativa
 * Eu sou um personagem real nesse mundo de faz de contas
 *
 * O que disserem, do que fizeram, ofender o seu ego, é sinapcial
*/
var isMobile_Global = false, userAgent = String(navigator.userAgent).toUpperCase(), plataformasMobile = ['ANDROID','IOS'];
for (var i = 0; i < plataformasMobile.length; i++) if (userAgent.indexOf(plataformasMobile[i]) != -1) isMobile_Global = true;

var objParamGrade_Global = {
	tamanhoFont: 12,
	fontFamily: 'NomeDaFont',

	// Config Table
	classTable: 		'table table-bordered stripe table-hover table-condensed backTeste', // table-striped table-responsive
	titleTableBgColor: 	'#D5DEE3', 	// '#981818',
	titleTableColor: 	'black',
	titleTableWeight: 	'bold',		// 'bold',
	headTableBgColor: 	'#D5DEE3', 	// '#c52e32',
	headTableColor: 	'black',
	headTableWeight: 	'bold',		// 'normal',
	footTableBgColor: 	'#D5DEE3', 	// '#e74f54',
	footTableColor: 	'black',
	footTableWeight: 	'bold',		// 'normal',
	// stripTableColors: 	[{bgcolor:'#E8E8E8'},{bgcolor:'#c0c0c0'}],
	stripTableColors: 	[{bgcolor:'white'}],
	hoverTrTableColor: 	'lightblue',
	activeTrTableColor: '#66ccff',
	// stripTableColors: 	[{bgcolor:'lightgreen'},{bgcolor:'cadetblue'}],
	padination: 		[15,25],

	// Cofig plataforma
	isMobile_Global: 	isMobile_Global,
	// stripTableColors: [{bgcolor:'tomato'},{bgcolor:'mediumseagreen'}],
	no_scrollX: 		true,
	languageJson: 		'../js/Portuguese.json'
}

function resolvBarraBotoes() {
	var barraBotoes = {
		div: {
			class: 'text-right',
			style: { 'margin-top':'5px', 'margin-right': '5px', 'margin-bottom':'4px' },
			ctx: [
				{ title: 'Novo' 		, btn: 'primary' 	, click: 'incluirDados' 		, icon: 'file' 			, key: "n" },
				{ title: 'Salvar' 		, btn: 'success' 	, click: 'gravaDados' 			, icon: 'floppy-o' 		, key: "s" },
				{ title: 'Inativar' 	, btn: 'danger' 	, click: 'inativaDados' 		, icon: 'times' 		, key: "e" },
				{ title: 'Imprimir' 	, btn: 'warning' 	, click: 'imprimirDados' 		, icon: 'print' 		, key: "p" },
				{ title: 'Primeiro' 	, btn: 'info' 		, click: 'posicionarPrimeiro' 	, icon: 'arrow-left' 	, key: "8" },
				{ title: 'Anterior' 	, btn: 'info' 		, click: 'posicionarAnterior' 	, icon: 'chevron-left' 	, key: "4" },
				{ title: 'Próximo' 		, btn: 'info' 		, click: 'posicionarProximo' 	, icon: 'chevron-right' , key: "6" },
				{ title: 'Último' 		, btn: 'info' 		, click: 'posicionarUltimo' 	, icon: 'arrow-right' 	, key: "2" },
			].map(function(p) {
				var { title, btn, click, icon, key } = p
				, 	onclick, id = 'btn' + tirarAcentuacao(title), disabled = title == 'Imprimir';
				eval(`onclick = function() { ${click}(); }`);

				return { button: {
					id, title, onclick, class: 'btn btn-' + btn, accesskey: key, icon: icon + ' fa-lg', disabled
				} };
			}),
		},
	};

	return barraBotoes;
}

function resolvAbaMenu(array) {
	var html = '';
	for (var i = 0; i < array.length; i++) {
		html += ""
			+ 	"<div class='col-md-3 col-sm-6 col-xs-12' data-file='" + array[i].file + "'"
			+ 		"onclick='abrirConteudo(this, \"" + array[i].desc + "\""
			+ 			(arguments.length > 1 ? "," + arguments[1] : '') + ");'"
			+ 	">"
			+ 		"<div class='box box-solid box-default' data-widget='box-widget'>"
			+ 			"<div class='box-header'>"
			+ 				"<h3 class='box-title'>" + array[i].desc + "</h3>"
			+ 			"</div>"
			+ 			"<div class='box-body'>"
			+ 				"<center>"
			+ 					((array[i].icon || '') == '' ? "" : "<img src='img/icones/" + array[i].icon + "' width='40%'><br>")
			+ 				"</center>"
			+ 			"</div>"
			+ 		"</div>"
			+ 	"</div>"
	}
	$("#conteudoAbaMenu").html(html);
}

function resolveMenu(menu, template='adminLTE') {
	var html = "", linkMenu_i;
	for (var i = 0; i < menu.length; i++) {
		if ((menu[i].header || '') != '')
			html += template == 'adminLTE'
				? "<li class=\"header\">" + menu[i].header + "</li>"
				: "<li class=\"app-sidebar__heading\">" + menu[i].header + "</li>"
				;
		else if ((menu[i].itens || '') == '')
			html += template == 'adminLTE'
				? ""
					+ 	"<li class=\"treeview\">"
					+ 		"<a href=\"#\" data-file=\"" + menu[i].file + "\" "
					+ 			"onclick=\"abrirConteudo(this,'" + (menu[i].desc || '') + "');\""
					+ 		">"
					+ 			(menu[i].desc || '')
					+ 		"</a>"
					// + 		"<ul class=\"treeview-menu\">"
					// + 			"<li><a href=\"principal.html\"><i class=\"fa fa-circle-o\"></i> Principal</a></li>"
					// + 		"</ul>"
					+ 	"</li>"
				: ""
					+ 	"<li" + (i == 0 ? ' class="mm-active"' : '') + ">"
					+ 		"<a href=\"#\" data-file=\"" + menu[i].file + "\""
					+ 			"onclick=\"abrirConteudo(this,'" + (menu[i].desc || '') + "');\""
					+ 		">"
					+ ((menu[i].icon || '') == '' ? '' : ''
						+ 		"<i class=\"metismenu-icon " + menu[i].icon + "\"></i>"
					)
					+ 			(menu[i].desc || '')
					+ 		"</a>"
					+ 	"</li>"
				;
		else {
			linkMenu_i = ((menu[i].file || '') == '' ? '' : menu[i].file + ",") + menu[i].desc;

			html += template == 'adminLTE'
				? ""
					+ 	"<li class=\"treeview\">"
					+ 		"<a href=\"#\">"
					+ 			"<span>" + menu[i].desc + "</span>"
					+ 			"<span class=\"pull-right-container\">"
					+ 				"<i class=\"fa fa-angle-left pull-right\"></i>"
					+ 			"</span>"
					+ 		"</a>"
					+ 		"<ul class=\"treeview-menu\">"
				: ""
					+ 	"<li" + (i == 0 ? ' class="mm-active"' : '') + ">"
					+ 		"<a href=\"#\">"
					+ ((menu[i].icon || '') == '' ? '' : ''
						+ 		"<i class=\"metismenu-icon " + menu[i].icon + "\"></i>"
					)
					+ 			(menu[i].desc || '')
					+ 			"<i class=\"metismenu-state-icon pe-7s-angle-down caret-left\"></i>"
					+ 		"</a>"
					+ 		"<ul>"
				;
			for (var j = 0; j < menu[i].itens.length; j++) {
				if (
					parseInt(usuario_Global.CK_ADMIN || 0) == 1 ||
					(menu[i].itens[j].admin || '') == ''
				) {
					html += template == 'adminLTE'
						? ""
							+ 	"<li>"
							+ 		"<a href=\"#\" data-file=\"" + menu[i].itens[j].file + "\""
							+ 			" onclick=\"abrirConteudo(this,'" + menu[i].itens[j].desc + "','" + linkMenu_i + "');\""
							+ 		">"
							+ 			"<i class=\"fa fa-circle-o\"></i> " + menu[i].itens[j].desc
							+ 		"</a>"
							+ 	"</li>"
						: ""
							+ 	"<li>"
							+ 		"<a href=\"#\" data-file=\"" + menu[i].itens[j].file + "\""
							+ 			" onclick=\"abrirConteudo(this,'" + menu[i].itens[j].desc + "','" + linkMenu_i + "');\""
							+ 		">"
							+ 			"<i class=\"metismenu-icon\"></i> " + menu[i].itens[j].desc
							+ 		"</a>"
							+ 	"</li>"
						;
				}
			}
			html += ""
				+ 		"</ul>"
				+ 	"</li>"
		}
	}
	return html;
}

var processAjax_Global = false;
function ajax(option) {
	registerAjaxFunc(function() { ajaxExecute(option) });
}

function ajaxExecute(option) {
	processAjax_Global = true;


	if ((option.erro || '') == '' && (option.error || '') != '') {
		if (typeof(option.error) == 'function') {
			var erro = option.error
		} else {
			eval(option.error);
		}
	} else if (typeof(option.erro) == 'function') {
		var erro = option.erro
	} else {
		eval(option.erro);
	}

	$.ajax({
		  url: 		(option.url 		|| (window['caminhoRequisicao'] || '../') + 'controller/controller.php')
		, type: 	(option.type 		|| 'POST')
		, dataType: (option.dataType 	|| 'text')
		, data: 	$.extend({}, usuario_Global, (option.param || {}))
		, error: 	erro
	}).done(function (data) {
		processAjax_Global = false;
		data = data.replace(//g, '');

		if ((option.consoleLog || '') != '') {
			console.log('option.param');
			console.log(option.param);
		}

		if (typeof(option.done) == 'function') {
			option.done(data, option.param);
		} else {
			eval(option.done);
		}
	});
}

var funcListFila_Global = [];
function registerAjaxFunc(code) {
	funcListFila_Global.push(code);
}

function observerAjaxFunc() {
	if (funcListFila_Global.length > 0 && !processAjax_Global) {
		try {
			if (funcListFila_Global[0] == 'string') {
				eval(funcListFila_Global[0]);
			} else {
				var func = funcListFila_Global[0];
				func();
			}
		} catch(e) { console.error(e); }
		funcListFila_Global.splice(0,1);
	}
}
setInterval(function() { observerAjaxFunc(); }, 100);

function mudarPagina(el, divId, name, nameDiv) {
	var elementoMenu = document.getElementsByName(name);
	var elementoContMenu = document.getElementsByName(nameDiv);
	for (var i = 0; i < elementoMenu.length; i++) {
		elementoMenu[i].className = "";
		elementoContMenu[i].style.display = "none";
	}
	$(el)[0].className = "active";
	$("#" + divId)[0].style.display = "block";
}

function capitalize(s) {
	if (typeof s !== 'string') return ''
	return s.charAt(0).toUpperCase() + s.slice(1)
}

function paramCapitalize(descricao) {
	descricao = tirarAcentuacao((descricao || '')).toLowerCase().replace(/ /g , "_").replace(/-/g, "");
	descricao = descricao.split('');
	descricao[0] = descricao[0].toUpperCase();
	descricao = descricao.join('');
	return descricao;
}

function valorPorExtenso(valor) {
	// Define as partes do valor por extenso
	var extenso = [];

	extenso[1] = 'um(a)';
	extenso[2] = 'dois(uas)';
	extenso[3] = 'tres';
	extenso[4] = 'quatro';
	extenso[5] = 'cinco';
	extenso[6] = 'seis';
	extenso[7] = 'sete';
	extenso[8] = 'oito';
	extenso[9] = 'nove';
	extenso[10] = 'dez';
	extenso[11] = 'onze';
	extenso[12] = 'doze';
	extenso[13] = 'treze';
	extenso[14] = 'quatorze';
	extenso[15] = 'quinze';
	extenso[16] = 'dezesseis';
	extenso[17] = 'dezessete';
	extenso[18] = 'dezoito';
	extenso[19] = 'dezenove';
	extenso[20] = 'vinte';
	extenso[30] = 'trinta';
	extenso[40] = 'quarenta';
	extenso[50] = 'cinquenta';
	extenso[60] = 'sessenta';
	extenso[70] = 'setenta';
	extenso[80] = 'oitenta';
	extenso[90] = 'noventa';
	extenso[100] = 'cem';
	extenso[200] = 'duzentos(as)';
	extenso[300] = 'trezentos(as)';
	extenso[400] = 'quatrocentos(as)';
	extenso[500] = 'quinhentos(as)';
	extenso[600] = 'seiscentos(as)';
	extenso[700] = 'setecentos(as)';
	extenso[800] = 'oitocentos(as)';
	extenso[900] = 'novecentos(as)';

	var restante = valor;
	var retorno = '';

	var trilhao = 	1000000000000,
		bilhao 	= 	1000000000,
		milhao 	= 	1000000;

	function getCentena(restante) {
		var retorno = '';

		if (restante >= 100) {
			var milhas = Math.trunc(restante / 100) * 100
			restante = restante - milhas;
			retorno += (retorno == '' ? '' : ' ') + (milhas === 1 ? 'cento' : extenso[milhas]);
			if (restante > 0) retorno += ' e';
		}

		if (restante >= 10) {
			var milhas;
				 if (restante >= 20) milhas = Math.trunc(restante / 10) * 10;
			else if (restante <  19) milhas = restante;
			restante = restante - milhas;
			retorno += (retorno == '' ? '' : ' ') + extenso[milhas];
			if (restante > 0) retorno += ' e';
		}

		if (restante >= 1) {
			var milhas = Math.trunc(restante / 1)
			restante = restante - milhas;
			retorno += (retorno == '' ? '' : ' ') + extenso[milhas];
			if (restante > 0) retorno += ' e';
		}
		return retorno;
	}

	var test;
	['tri','bi','mi'].forEach(function(pre) {
		eval(`test = ${pre}lhao`);
		if (restante >= test) {
			var tests = Math.trunc(restante / test) ;
			restante = restante - (tests * test);
			retorno += tests > 1 ? getCentena(tests) + ` ${pre}lhões` : extenso[tests] + ` ${pre}lhão`;
			if (restante > 0) retorno += ', ';
		}
	});

	if (restante >= 1000) {
		var milhas = Math.trunc(restante / 1000)
		restante = restante - (milhas * 1000);
		retorno += getCentena(milhas) + ' mil';
		if (restante > 0) retorno += ', ';
	}
	retorno += getCentena(restante);
	return retorno;
}

function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function confirmModal(options) {
	/*
		options: {
			msm: '' 				-- Mensagem a ser mostrada na tela
			done: function() {} 	-- Função disparada quando confirmar
			btnDesc: 'Confirmar' 	-- Descrição do botão de confirmação
			btnIcon: 'check' 		-- Icone do botão de confirmação
			btnClass: 'success' 	-- Class do botão de confirmação
			manualClose: (0|1) 		-- Fechar modal manualmente
		}
	*/
	var { done } = options;
	eval(''
		+ 	'done = function() { '
		+ 		((options.manualClose || '') == '' ? 'closeModal();' : '')
		+ 		'var func = ' + String(done || function() {})
		+ 		';func();'
		+ 	'}'
	);

	openModal({
		head: options.msm,
		foot: resolvConfig({
			button: {
				  desc: 	(options.btnDesc 	|| 'Confirmar')
				, icon: 	(options.btnIcon 	|| 'check')
				, class: 	'btn btn-' + (options.btnClass || 'success')
				, click: 	done
			}
		})
	});
}

function openModal(options={}) {
	/*
		options: {
			head: '' 				-- Cabeçario do modal
			body: '' 				-- Corpo do modal
			foot: '' 				-- Rodapé do modal
			onOpen: function() 		-- Função executada quando abrir o modal
			onClose: function() 	-- Função executada quando fechar o modal
		}
	*/
	$("#modalGenerico").on('hidden.bs.modal', function() { onCloseModal(); });
	onCloseModal = (options.onClose || function() { });

	$("#modalHeadGenerico").html((options.head || ''));
	$("#modalBodyGenerico").html((options.body || ''))
		.css('display',((options.body || '') == '' ? 'none' : 'block'));
	$("#modalFootGenerico").html((options.foot || ''));

	if ($('#modalGenerico').is(':visible')) {
		(options.onOpen || function() { $("#modalCloseGenerico")[0].focus(); })()
	} else {
		$("#modalGenerico").on('shown.bs.modal', function() { onOpenModal(); });
		onOpenModal = (options.onOpen || function() { $("#modalCloseGenerico")[0].focus(); });

		$("#modalGenerico").modal('show');
	}
}
function onOpenModal() { }
function onCloseModal() { }

function closeModal() {
	$("#modalGenerico").modal('hide');
}

function time2Int(time) {
	if ((time || '') == '') time =  '00:00:00';
	time = time.split(':');
	var horas 	= parseInt(time[0]);
	var minuto 	= parseInt(time[1]);
	var segundo = parseInt(time[2]);
	return (horas * 3600) + (minuto * 60) + segundo;
}

function int2Time(value, rmDecimal=false) {
	var horas = 0, minutos = 0, segundos = 0

	if (value >= 3600) {
		horas = parseInt(String(value / 3600).split('.')[0]);
		value -= horas * 3600;
	}

	if (value >= 60) {
		minutos = parseInt(String(value / 60).split('.')[0]);
		value -= minutos * 60;
	}
	horas 		= (horas 	< 10 ? '0' : '') + String(horas);
	minutos 	= (minutos 	< 10 ? '0' : '') + String(minutos);
	segundos 	= (value 	< 10 ? '0' : '') + String(value);

	if (isNaN(segundos)) segundos = '00';

	var result = horas + ':' + minutos + ':' + segundos;
	if (rmDecimal) result = result.split('.')[0];
	return result;
}

function orderArray(array, param='', paramSecond='') {
	var dataTemp, verify;
	var paramE = param == ''
		? 'array[i] < array[j]'
		: `array[i]["${param}"] < array[j]["${paramSecond == '' ? param : paramSecond}"]`;

	for (var i = 0; i < array.length; i++) {
		for (var j = 0; j < array.length; j++) {
			eval(`verify = ${paramE}`);

			if (verify) {
				dataTemp = array[i];
				array[i] = array[j];
				array[j] = dataTemp;
			}
		}
	}
	return array;
}

var loaderBg_Global = '#11ACED';
var alertOld = alert;
setTimeout(function() {
	alert = function(text, options={}) {
		try {
			$.toast({
				heading: options.head || $(".titulo_pagina").html() || 'Aviso',
				text,
				showHideTransition: options.animation || 'slide',
				icon: options.icon || 'warning',
				position: options.position || "bottom-right",
				loaderBg: options.loaderBg || loaderBg_Global,
				hideAfter: options.time || 2500
			});
		} catch(e) {
			// console.error(e);
			alertOld(text);
		}
	}
}, 500);

/**************************************************/
/** Operações Aplicação */
/**************************************************/
var paginaAtual_Global = '';
function abrirConteudo(el, titulo) {
	$(".titulo_pagina").html(titulo);
	var arg = arguments;

	if (titulo == 'Principal') {
		$(".breadcrumb").html(""
			+ (template_Global == 'adminLTE'
				? "<li class='active'>Principal</li>"
				: "<li class=\"active breadcrumb-item\" aria-current=\"page\">Principal</li>"
			)
		)
	} else {
		$(".breadcrumb").html(""
			+ (template_Global == 'adminLTE'
				? "<li><a href='#' data-file='main' onclick='abrirConteudo(this, \"Principal\")'>Principal</a></li>"
				: ""
					+ 	"<li class=\"breadcrumb-item\">"
					+ 		"<a href='#' data-file='main' onclick='abrirConteudo(this, \"Principal\")'>"
					+ 			"Principal"
					+ 		"</a>"
					+ 	"</li>"
			)
			+ (arg.length < 2 ? '' : ""
				+ (function(args) {
					var html = '';
					for (var i = args.length-1; i >= 2; i--) {
						html += ""
							+ (template_Global == 'adminLTE'
								? "<li>"
								: "<li class=\"breadcrumb-item\">"
							)
							+ (args[i].split(',').length < 2 ? args[i].split(',')[0] : ''
								+ 	"<a href='#' data-file='" + args[i].split(',')[0] + "'"
								+ 		" onclick='abrirConteudo(this,\"" + args[i].split(',')[1] + "\""
								+ (i == 2 ? '' : ","
									+ (function(argsI, i) {
										var htmlI = '';
										for (var j = i; j >= 2; j--)
											htmlI += (htmlI == '' ? '' : ',') + "\"" + argsI[j] + "\"";
										return htmlI;
									}(args,(i-1)))
								)
								+		")'"
								+ 	">"
								+ 		args[i].split(',')[1]
								+ 	"</a>"
							)
							+ "</li>"
					}
					return html;
				}(arg))
			)
			+ (template_Global == 'adminLTE'
				? "<li class='active'>" + titulo + "</li>"
				: "<li class=\"active breadcrumb-item\" aria-current=\"page\">" + titulo + "</li>"
			)
		)
	}

	$("#conteudo_pagina").html(""
		+ "<img src='../img/carrega.gif'>"
	);

	if (["SuSE","Android","iOS","Windows Phone"].indexOf(platform.os.family) >= 0
		&& ($("body").attr('class') || '') != ''
		&& $("body").attr('class').indexOf('sidebar-open') >= 0
	) {
		$(".sidebar-toggle")[0].click();
	}

	var done = function(data) {
		$("#conteudo_pagina").html(''
			+ data.replace(/<\/\"\+\"script>/g, "</"+"script>")
			+ '<script>resolvImg();</'+'script>'
		);
	};
	var view = $(el).data('file');
	paginaAtual_Global = view;

	if ((window['isApp_Global'] || '') != '') {
		getCtx(`${caminhoRequisicao}view/${view}.html`, view, done);
	} else {
		ajax({ // Carregar paginas da aplicação
			param: { 'loadView': true, view }, done
			, error: function() { alert('Não consegui carregar pagina!'); }
		});
	}
}

function resolvImg() {
	var imgs = $('#conteudo_pagina').find("img");
	for (var i = 0; i < imgs.length; i++) {
		imgs[i].onerror = function() {
			if (this.src != 'error.jpg' && $(this).attr('src').indexOf(caminhoRequisicao) < 0)
				this.src = ($(this).attr('src') || '').replace('../', caminhoRequisicao);
		}
	}
}

function logoff() {
	if (!confirm('Deseja sair da aplicação?')) return false;
	localStorage.removeItem('usuario');
	window.location.assign('../index.html');
}

var template_Global = 'adminLTE';
function initComponet() {
	var bootstrap = $.fn.tooltip.Constructor.VERSION.slice(0,1);

	$("body").append(''
		+ '<style>'
		+ 	'h1, h3, p, blockquote, pre {'
		+ 		'font-family: Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif;'
		+ 		'font-style: normal;'
		+ 		'font-variant: normal;'
		+ 	'}'
		+ 	'h1, h3 { font-weight: 700; }'
		+ 	'p, blockquote, pre { font-weight: 400; }'
		+ 	'h1 '			+ '{ font-size: 24px; line-height: 26.4px; }'
		+ 	'h3 '			+ '{ font-size: 14px; line-height: 15.4px; }'
		+ 	'p '			+ '{ font-size: 14px; line-height: 20px; }'
		+ 	'blockquote '	+ '{ font-size: 21px; line-height: 30px; }'
		+ 	'pre '			+ '{ font-size: 13px; line-height: 18.5714px; }'
		+ '</style>'
		+ (bootstrap == '4'
			? ''
				+ `<div class="modal" id="modalGenerico">`
				+ 	`<div class="modal-dialog modal-lg">`
				+ 		`<div class="modal-content">`
				+ 			`<div class="modal-header">`
				+ 				`<h4 class="modal-title" id="modalHeadGenerico"></h4>`
				+ 				`<button id="modalCloseGenerico" type="button" class="close" data-dismiss="modal">&times;</button>`
				+ 			`</div>`
				+ 			`<div class="modal-body" id="modalBodyGenerico"></div>`
				+ 			`<div class="modal-footer">`
				+ 				`<span id="modalFootGenerico"></span>`
				+ 				`<button type="button" class="btn btn-light" data-dismiss="modal">Fechar</button>`
				+ 			`</div>`
				+ 		`</div>`
				+ 	`</div>`
				+ `</div>`
			: ''
				+ `<div class="modal fade" id="modalGenerico" role="dialog">`
				+ 	`<div class="modal-dialog">`
				+ 		`<div class="modal-content">`
				+ 			`<div class="modal-header">`
				+ 				`<button type="button" class="close" id="modalCloseGenerico" data-dismiss="modal">&times;</button>`
				+ 				`<h4 class="modal-title" id="modalHeadGenerico"></h4>`
				+ 			`</div>`
				+ 			`<div class="modal-body" id="modalBodyGenerico"></div>`
				+ 			`<div class="modal-footer">`
				+ 				`<span id="modalFootGenerico"></span>`
				+ 				`<button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>`
				+ 			`</div>`
				+ 		`</div>`
				+ 	`</div>`
				+ `</div>`
		)
	);

	if ((usuario_Global.FOTO_USUARIO || '') != '') {
		var path = '../img/perfil/';
		if (usuario_Global.CK_USE_AWS == 1) {
			var bucket = usuario_Global.AWS_BUCKET
			, 	region = usuario_Global.AWS_REGION;
			path = 'https://' + bucket + '.s3.' + region + '.amazonaws.com/perfil/';
		}
		$(".foto-user").attr('src', path + usuario_Global.FOTO_USUARIO);
	}

	// $(".foto-user").attr("src","../img/perfil/" + JSON.parse(localStorage.getItem('usuario')).ID_USUARIO + ".png");
	// $(".btn-logoff").attr('onclick', function(){ logoff(); });
	// $(".linkProduto")[0].onclick = function(){  }
	try { $('.sidebar-menu').tree(); } catch(e) {}
	$(".nome_usuario").html(JSON.parse(localStorage.getItem('usuario')).NOME);
	$(".btn-logoff")[0].onclick = function(){ logoff(); }
	abrirConteudo($(document.createElement('span')).attr('data-file','main'),'Principal');


	var configPrincipal = {
		param: { 'getConfigPrincipal': true },
		done: function(data) {
			console.log(data);
			data = JSON.parse(data);
			console.log(data);

			template_Global = data.template || 'adminLTE';

			$(".titulo_projeto").html(''
				+ ((data.logo_png || '') == '' ? '' : "<img src='../img/"+data.logo_png+".png' height='30px'> ")
				+ ((data.logo_png || '') != '' ? '' : (data.nome_projeto || ''))
			);
			$(".titulo_projeto_title").html((data.nome_projeto || ''));
			$(".titulo_projeto_mini").html(
				((data.logoMini_png 	|| '') != '' ? "<img src='../img/" + data.logoMini_png + ".png' height='40px'>" : ''
					+ ((data.logo_png 	|| '') == '' ? '' : "<img src='../img/" + data.logo_png + ".png' height='40px'>")
				)
			);

			if ((data['color-holder_sidebar'] || '') != '') {
				$(".titulo_projeto").parent().css('background-color', data['color-holder_sidebar']);
			}

			if ((data.perfilPage || '') != '') {
				$("#btn-perfil")
					.data('file', data.perfilPage.file)
					.click(function() { abrirConteudo(this, data.perfilPage.desc); });
			}

			if (((data.foot || {}).developer || '') != '') {
				$("#developerFoot").html(
					((data.foot || {}).developerSite || '') != ''
					? `<a target="_blank" href="${data.foot.developerSite}">${data.foot.developer}</a>`
					: data.foot.developer
				);
			}

			if ((data.version || '') != '') $("#verionFoot").html(data.version);

			$("body").attr("class", $("body").attr("class") + " skin-" + (data['color-app'] || 'blue'))

			if ((data['color-teste_menu'] || '') != '')
				$(".navbar-static-top").css('color', data['color-teste_menu'])

			if ((data['color-nome_usuario'] || '') != '' && template_Global == 'adminLTE')
				$(".nome_usuario").css('color', data['color-nome_usuario'])

			loaderBg_Global = data['colorLoadAlert'] || '#11ACED';

			if (template_Global == 'architectui') {
				$("body").append(''
					+ 	'<style>'
					+ 	'.app-header__logo .logo-src {'
					+ 		'background: url("../img/' + data.logo_png + '.png") !important;'
					+ 	'}'
					+ 	'.app-header.header-text-dark .app-header__logo .logo-src {'
					+ 		'background: url("../img/' + data.logo_png + '.png") !important;'
					+ 	'}'
					+ 	'.app-logo {'
					+ 		'background: url("../img/' + data.logo_png + '.png") !important;'
					+ 	'}'
					+ 	'.app-header.header-text-light .app-header__logo .logo-src {'
					+ 		'background: url("../img/' + data.logo_png + '.png") !important;'
					+ 	'}'
					+ 	'.app-sidebar.sidebar-text-light .app-header__logo .logo-src {'
					+ 		'background: url("../img/' + data.logo_png + '.png") !important;'
					+ 	'}'
					+ 	'.app-logo-inverse {'
					+ 		'background: url("../img/' + data.logo_png + '.png") !important;'
					+ 	'}'
					+ 	'</style>'
				);
			}
		}
	}

	var menu = {
		param: { 'getMenu': true },
		done: function(dataMenu) {
			console.log(dataMenu);
			dataMenu = JSON.parse(dataMenu);
			console.log(dataMenu);
			$(".sidebar-menu").html(resolveMenu(dataMenu.menu, (dataMenu.template || 'adminLTE')));
			if ((dataMenu.template || '') == 'architectui') {
				loadTemplate();
			}
		}
	}

	if ((window['isApp_Global'] || '') != '') {
		getCtx(configPrincipal.param, 'configPrincipal', configPrincipal.done);
		getCtx(menu.param, 'menu', menu.done);

		importLib(caminhoRequisicao + "js/resolvConfig.full.js", 'RESOLV');
		// importLib(caminhoRequisicao + "principal/styleMap.css", 'styleMap');
		importLib(caminhoRequisicao + "principal/style.css", 'style');
		$(".main-footer")
			.css('position','fixed').css('bottom','0').css('width','100%')
			.html($(".main-footer").html().replace(' Todos os direitos reservados.',''));
		$("#developerFoot").css('color','#5bc0de');
		// initApp();
	} else {
		ajax(configPrincipal);
		ajax(menu);
	}
}

function mensagemSave(data, msmSuccess, callBack, callBackSuccess=function(){}) {
	if (data != '0' && !isNaN(data)) {
		alert(msmSuccess, { icon: 'success' });
		callBackSuccess();
	} else {
		alert('Falha: ' + data, { icon: 'error' });
	}
	callBack();
}

function replaceUnicode(texto) {
	var replace = " ¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹º»¼½¾¿"
		+ "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ";

	var search = [
		 'u00A0','u00A1','u00A2','u00A3','u00A4','u00A5','u00A6','u00A7','u00A8','u00A9'
		,'u00AA','u00AB','u00AC','u00AE','u00AF','u00B0','u00B1','u00B2','u00B3','u00B4'
		,'u00B5','u00B6','u00B7','u00B8','u00B9','u00BA','u00BB','u00BC','u00BD','u00BE'
		,'u00BF','u00C0','u00C1','u00C2','u00C3','u00C4','u00C5','u00C6','u00C7','u00C8'
		,'u00C9','u00CA','u00CB','u00CC','u00CD','u00CE','u00CF','u00D0','u00D1','u00D2'
		,'u00D3','u00D4','u00D5','u00D6','u00D7','u00D8','u00D9','u00DA','u00DB','u00DC'
		,'u00DD','u00DE','u00DF','u00E0','u00E1','u00E2','u00E3','u00E4','u00E5','u00E6'
		,'u00E7','u00E8','u00E9','u00EA','u00EB','u00EC','u00ED','u00EE','u00EF','u00F0'
		,'u00F1','u00F2','u00F3','u00F4','u00F5','u00F6','u00F7','u00F8','u00F9','u00FA'
		,'u00FB','u00FC','u00FD','u00FE','u00FF'
	];

	for (var i=0; i < search.length; i++) {
		texto = texto.replace(new RegExp(search[i], 'gi'), replace[i]);
	}
	return texto;
}
