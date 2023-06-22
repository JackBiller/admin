<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

date_default_timezone_set('America/Sao_Paulo');

if (is_file(__DIR__ . '/../vendor/autoload.php'))
	require_once __DIR__ . '/../vendor/autoload.php';

if (is_file(__DIR__ . '/../biblioteca/dompdf/autoload.inc.php'))
	require_once __DIR__ . '/../biblioteca/dompdf/autoload.inc.php';

include "./constConfig.php";
include "./funcoes.php";
$pdo = getConection();

if (is_file('./ClassSQL/classSQL.php')) include './ClassSQL/classSQL.php';

$config = json_decode(CONFIG_JSON);
$inativo = !empty($config->login->login_ckInativo) ? $config->login->login_ckInativo : '';

function returnUser($pdo, $hash, $inativo='') {
	if ($inativo != '') $inativo = "AND $inativo = 0";

	$sql = "SELECT 	USUARIO.ID_USUARIO
					, USUARIO.NOME
					, USUARIO.CK_ADMIN
					-- , COALESCE((
					-- 	SELECT GROUP_CONCAT(COMANDO.DS_COMANDO)
					-- 	FROM USUARIO_COMANDO
					-- 	INNER JOIN COMANDO ON COMANDO.ID_COMANDO = USUARIO_COMANDO.ID_COMANDO
					-- 	WHERE COMANDO.CK_INATIVO = 0
					-- 	AND USUARIO_COMANDO.ID_USUARIO = USUARIO.ID_USUARIO
					-- ),'') AS COMANDO
			FROM USUARIO
			INNER JOIN USUARIO_HASH ON USUARIO_HASH.ID_USUARIO = USUARIO.ID_USUARIO
				AND USUARIO_HASH.CK_INATIVO = 0
			WHERE USUARIO_HASH.HASH = '$hash'
			$inativo";
	// printQuery($sql);
	$resultado = padraoResultado($pdo, $sql);
	$resultado = $resultado[0];
	return $resultado->get('debug') == 'OK' ? $resultado : false;
}

if (!empty($_REQUEST['HASH'])) {
	$usuario_Global = returnUser($pdo, $_REQUEST['HASH'], $inativo); // $_REQUEST['id_usuario'];
	if ($usuario_Global === false) {
		echo toJson(array(new FalseDebug('Não esta logado no sistema!')));
		return;
	}
} else {
	echo toJson(array(new FalseDebug('Não esta logado no sistema!')));
	return;
}
$id_usuario = $usuario_Global->get('ID_USUARIO');

$empresa = '';
if (!empty($_REQUEST['CK_EMPRESA'])) {
	$sql = "SELECT	EMPRESA.ID_EMPRESA
			, 		EMPRESA.NOME_EMPRESA
			, 		EMPRESA.CNPJ_EMPRESA
			, 		EMPRESA.TELEFONE_EMPRESA
			, 		EMPRESA.EMAIL_EMPRESA
			, 		EMPRESA.ENDERECO_EMPRESA
			, 		EMPRESA.MUNICIPIO_EMPRESA
			, 		EMPRESA.DS_ATIVIDADES_EMPRESA
			, 		EMPRESA.TIPO_SERVICO_EMPRESA
			, 		EMPRESA.CK_INATIVO
			FROM 	EMPRESA
			WHERE 	EMPRESA.CK_INATIVO = 0
			LIMIT 	1";
	$empresa = padraoResultado($pdo, $sql);
	$empresa = $empresa[0];
}


$nome = $_REQUEST['nome'];

include './report/' . $nome . '.php';

$html = '';
eval("\$html = " . $nome . "();");


$tituloRelatorio = "Relatório";
if (!empty($_REQUEST['tituloRelatorio'])) {
	$tituloRelatorio = $_REQUEST['tituloRelatorio'];
}

echo "
<!-- script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js\"></script -->
<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js\"></script>
<div class=\"printview\">
	<div class=\"toolbar\">
		<button id=\"print\">Print</button>
	</div>
	<div class=\"page\">
		<div class=\"page-header\">
			 <!-- h1>Funciona pelo amor de Deus</h1 -->
			 <table border=\"0\" width=\"100%\" style=\"border: 0px black solid;\">
				<tr>
					<td rowspan=\"1\" colspan=\"1\">
						<table width=\"100%\" border=0>
							<tr style=\"border: none;\">
								<td style=\"border: none;text-align: center;\">
									<img src=\"../img/logo.png\" alt=\"LogoTipo\"
										style=\"height: 19mm;width: auto\"
									>
									<!-- width=\"100\" height=\"100\" -->
								</td>
								<td style=\"vertical-align: middle;border: none;text-align: center;font-weight: bold;\">
									$tituloRelatorio
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<!-- tr>
					<td colspan=\"1\" class=\"cel1\">
						<label>
							Data e Hora da Emissão
						</label>
						<br>
						<span id=\"data_emissao\">" . date('d/m/Y H:i:s') . "</span>
					</td>
				</tr -->
			</table>
		</div>
		<div class=\"page-body\"></div>
		<div class=\"page-footer\"></div>
	</div>
</div>
<div class=\"content\">";
echo $html;
echo "
</div>";



echo "
<style>
	body {
		margin: 0;
		padding: 0;
		background-color: none repeat scroll 0% 0% rgba(0, 0, 255, 0.3);
		background-color: rgb(64, 64, 64);
		/*background-image: url(\"http://raw.github.com/mozilla/pdf.js/master/web/images/texture.png\");*/
		font: 10pt\"Arial\";
		color: #444;
		-webkit-print-color-adjust: exact;
	}
	* {
		-webkit-box-sizing: border-box;
		-khtml-box-sizing: border-box;
		-moz-box-sizing: border-box;
		-ms-box-sizing: border-box;
		-o-box-sizing: border-box;
		box-sizing: border-box;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		-o-user-select: none;
		user-select: none;
	}
	.printview {
		margin-left: 10px;
		margin-right: 10px;
		width: 70%;
	}
	.toolbar {
		background: none repeat scroll 0% 0% rgba(0, 0, 255, 0.3);
		background-color: rgb(71, 71, 71);
		-webkit-print-color-adjust: exact;
		min-height: 32px;
		width: 100%;
		box-shadow: 1px 0px 0px rgba(255, 255, 255, 0.08) inset, 0px 1px 1px rgba(0, 0, 0, 0.15) inset, 0px -1px 0px rgba(255, 255, 255, 0.05) inset, 0px 1px 0px rgba(0, 0, 0, 0.15), 0px 1px 1px rgba(0, 0, 0, 0.1);
		padding: 0;
		position: absolute;
		left: 0px;
		top: 0px;
	}
	.page {
		width: 21cm;
		min-height: 29.7cm;
		padding: 1.0cm 1.0cm 1.0cm 1.0cm;
		margin-top: 5%;
		margin-left: 5%;
		border: 1px #D3D3D3 solid;
		background-color: white;
		-webkit-print-color-adjust: exact;
		/*background-image: url(\"http://subtlepatterns.com/patterns/lightpaperfibers.png\");*/
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
	}
	.printview:first-child {
		margin-top: 10%;
	}
	.page:last-child {
		margin-bottom: 5%;
	}
	.page-header {
		padding: 0.2cm;
		border-top: 1px #ccc dotted;
		border-right: 1px #ccc dotted;
		border-left: 1px #ccc dotted;
		height: 20mm;
		text-align: center;
	}
	.page-body {
		padding: 0.2cm;
		border-right: 1px #ccc dotted;
		border-left: 1px #ccc dotted;
		height: 241.8mm;
		text-align:justify;
		text-justify:inter-word;
	}
	.page-footer {
		bottom: 0;
		padding: 0.2cm;
		border-right: 1px #ccc dotted;
		border-bottom: 1px #ccc dotted;
		border-left: 1px #ccc dotted;
		height: 10mm;
		text-align: right;
	}
	.content {
		display: none;
	}
	.tftable {font-size:12px;color:#333333;width:100%;border-width: 1px;border-color: #a9a9a9;border-collapse: collapse;}
	.tftable th {font-size:12px;background-color:#b8b8b8;border-width: 1px;padding: 8px;border-style: solid;border-color: #a9a9a9;text-align:left;}
	.tftable tackground-color:#ffffff;}
	.tftable td {font-size:12px;border-width: 1px;padding: 8px;border-style: solid;border-color: #a9a9a9;}
	.columns-2 p {
		width: 49%;
		float: left;
	}
	.columns-2 p:nth-child(even) {
		margin-left: 2%;
	}
	.columns-2 p:nth-child(odd){
		clear: left;
	}
	@media print {
		@page {
			size: A4;
			margin: 0;
		}
		.printview {
			margin: initial;
			width: initial;
		}
		.toolbar {
			display: none;
		}
		.page {
			margin: 0;
			border: none;
			border-radius: 0;
			width: 209mm;
			min-height: 295mm;
			box-shadow: 0;
			background: initial;
			page-break-after: always;
		}
		.page-header, .page-footer, .page-body {
			border: none;
		}
		.content {
			flow: page-flow;
			-webkit-flow: page-flow;
			display: none;
		}
		.printview:first-child {
			margin-top: 0;
		}
		.page:last-child {
			margin-bottom: 0;
		}
	}
</style>
";

echo "
<script>
	$.fn.hasOverflow = function () {
		var el = $(this)[0];
		return el.scrollHeight > el.clientHeight;
	};
	$.fn.isTable = function () {
		var el = $(this)[0];
		return el.nodeType === 1 && (el.tagName || '').toUpperCase() === 'TABLE';
	};
	$.fn.withColumns = function(){
		var el = $(this);
		return el.is('[class^=\"columns\"]');
	}
	var g = {}; // Globals
	function makePage(template) {
		console.log('Making a new page');
		var clone = $('.page').first().clone();
		$(clone).find('.page-body').empty();
		$(clone).appendTo('.printview');
		g.currentPage = clone;
		g.currentPbody  =  getPageBody(clone);
		return $(clone).hasOverflow()? undefined: clone;
	}
	function getPageBody(page) {
		//console.log('Getting the page-body');
		var currentPage = page || makePage();
		return currentPage.find('.page-body');
	}
	function paginate(content,  page, cont) {
		//console.log('pagination initiated');
		if (!Object.hasOwnProperty(g, 'currentPage')){
			g.currentPage = page || makePage();
		}
		if (!Object.hasOwnProperty(g, 'currentPbody')){
			g.currentPbody = getPageBody(page || g.currentPage || MakePage());
		}
		var currentContent = $(content),
			container;
		if (currentContent.withColumns()){
			container = currentContent.clone().empty().appendTo(g.currentPbody);
		} else if (currentContent.parent().withColumns() && cont){
			container = cont;
		} else {
			container = null;
		}
		console.log(container);
		if (currentContent.isTable()) {
			console.log('working with a table');
			paginateTable(currentContent, g.currentPage);
		} else if (currentContent.children().size()>0) {
			//console.log('element has childrens');
			console.log(container);
			var i = 0,
				childrens = currentContent.children(),
				l = childrens.size(),
				child;
			for (; i < l; i++) {
				child = childrens[i];
				paginate( child,  g.currentPage, container);
			}
		} else {
			//console.log('working with text content');
			paginateText(currentContent, g.currentPage, container);
		}
	}
	function paginateText(node, page, cont) {
		var currentPbody = getPageBody(page || g.currentPage || getMakePage()),
			container = node.clone().empty(),
			contentText = node.text(),
			wordArray = contentText.split(\" \"),
			currentText = \"\",
			i = 0,
			l = wordArray.length,
			oldText,
			word;
		container.appendTo(cont ? cont : currentPbody);
		//console.log(currentPbody);
		for (; i < l; i++) {
			word = wordArray[i];
			oldText = currentText;
			currentText += word + \" \";
			container.text(currentText);
			if (currentPbody.hasOverflow()) {
				//console.log('in text has encountred overflow');
				container.text(oldText);
				//console.log([word, wordArray.slice(i)]);
				paginate(
					node.clone().empty().text(wordArray.slice(i - 1).join(' ')),
					makePage()
				);
				break;
			}
		}
	}
	function paginateTable(table, page, cont) {
		var currentPbody = getPageBody(page || g.currentPage || makePage()),
			container = cont || table.clone(),
			currentTbody = container.find('tbody'),
			currentRows = container.find('tbody > tr'),
			i = 0,
			l = currentRows.length,
			row;

		currentTbody.empty();
		container.appendTo(currentPbody);
		for (; i < l; i++) {
			row = $(currentRows[i]);
			currentTbody.append(row);
			if (currentPbody.hasOverflow()) {
				//console.log('in table has encountred overflow');
				//console.log([container, container.find('tbody > tr').length]);
				//console.log([i, container.has(currentTbody) ? 'Sim' : 'Não']);
				row.detach();
				container = $(container).clone();
				currentTbody = container.find('tbody');
				currentTbody.empty().append(currentRows.slice(i));
				//console.log([container, currentTbody.find('tr').length]);
				paginate(container, makePage());
				break;
			}
		}
	}
	$(function () {
		/* insert content and generate regions */
		paginate (
			$('.content'),
			$('.page')
		);
		/* remove pages without content
		$('.page').each(function(){
			var pbody = $(this).find('.page-body');
			if (pbody.text().length===0){
				$(this).remove();
			}
		});*/
		/* define page numbers and add current date */
		var pages = $('.page').length,
			date = new Date(),
			tDate = ''
				+ (parseInt(date.getDate()) < 10 ? '0' : '') + date.getDate()
				+ '/'
				+ (parseInt(date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)
				+ '/'
				+ date.getFullYear()
				+ ' '
				+ (parseInt(date.getHours()) < 10 ? '0' : '') + date.getHours()
				+ ':'
				+ (parseInt(date.getMinutes()) < 10 ? '0' : '') + date.getMinutes()
				+ ':'
				+ (parseInt(date.getSeconds()) < 10 ? '0' : '') + date.getSeconds();
		$('.page').each(function (i, p) {
			var foot = $(p).find('.page-footer');
			$(foot).html(
				'<span style=\"float: left;\">' + tDate + '</span><span style=\"float: right\">Página ' + (1 + i) + ' de ' + pages + '</span>');
		});
		$('#print').click(function (ev) {
			window.print();
		});
		console.log($('.page').size());
	});

	setTimeout(function() {
		window.print();
		setTimeout(function() {
			// window.close();
		}, 1000);
	}, 200);
</script>
";

?>