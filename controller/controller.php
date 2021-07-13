<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);

date_default_timezone_set('America/Sao_Paulo');

if (is_file('../vendor/autoload.php')) require '../vendor/autoload.php';

use Aws\S3\S3Client;
use Aws\S3\Exception\S3Exception;

include "./constConfig.php";
include "./funcoes.php";
$pdo = getConection();

if (is_file('./ClassSQL/classSQL.php')) include './ClassSQL/classSQL.php';

$config = json_decode(CONFIG_JSON);
$inativo = !empty($config->login->login_ckInativo) ? $config->login->login_ckInativo : '';

// if (!empty($_POST['HASH'])) {
// 	$id_usuario = $_POST['HASH'];
// } else {
// 	echo toJson(array(new FalseDebug('Não esta logado no sistema!')));
// 	// if (gettype($pdo) == 'resource') ibase_close($pdo);
// 	return;
// }
// if (empty($_POST['master'])) {
	if (!empty($_POST['HASH'])) {
		$usuario_Global = returnUser($pdo, $_POST['HASH'], $inativo); // $_POST['id_usuario'];
		if ($usuario_Global === false) {
			echo toJson(array(new FalseDebug('Não esta logado no sistema!')));
			return;
		}
	} else {
		echo toJson(array(new FalseDebug('Não esta logado no sistema!')));
		return;
	}
	$id_usuario = $usuario_Global->get('ID_USUARIO');
// }

if (is_file('./include.php')) include './include.php';


if (!empty($_POST['updateUser'])) {
	if (isset($usuario_Global)) {
		echo toJson($usuario_Global);
	} else {
		echo '{ "debug": "NO_VALID" }';
	}
}

if (!empty($_POST['getConfigPrincipal'])) {
	$config->principal->nome_projeto = $config->nome_projeto;
	if (isset($config->colorLoadAlert))
		$config->principal->colorLoadAlert = $config->colorLoadAlert;
	echo json_encode($config->principal);
}

if (!empty($_POST['getMenu'])) {
	class MenuItem extends PadraoObjeto {
		var $header;
		var $desc;
		var $file;
		var $itens = array();
	}

	$menuAcesso = array();
	$menu = $config->menu;

	// Percorre menu
	for ($i=0; $i < sizeof($menu); $i++) {
		$itemMenuParent = $menu[$i];

		// Verifica se tem acesso ao menu
		if (
			!isset($usuario_Global) || (
				isset($usuario_Global) && (
					$usuario_Global->get('CK_ADMIN') == 1 || 
					empty($itemMenuParent->admin) || 
					$itemMenuParent->admin == false
				)
			)
		) {
			$indice = sizeof($menuAcesso);
			array_push($menuAcesso, new MenuItem());

			$itemMenuParentAcesso = $menuAcesso[$indice];

			// Se o item do menu for só header
			if (!empty($itemMenuParent->header)) {
				$itemMenuParentAcesso->set($itemMenuParent->header, 'header');
			} else {
				// Seta item menu descrição e arquivo caso tenha
				$itemMenuParentAcesso->set($itemMenuParent->desc, 'desc');
				if (!empty($itemMenuParent->file)) 
					$itemMenuParentAcesso->set($itemMenuParent->file, 'file');

				// Verfica se tem itens de menu
				if (!empty($itemMenuParent->itens)) {
					$itensMenu = $itemMenuParent->itens;

					// Percorre os itens de menu
					for ($j=0; $j < sizeof($itensMenu); $j++) {
						$itemMenu = $itensMenu[$j];
						// Verifica se tem acesso ao item
						if (
							!isset($usuario_Global) || (
								isset($usuario_Global) && (
									$usuario_Global->get('CK_ADMIN') == 1 || 
									empty($itemMenu->admin) || $itemMenu->admin == false
								)
							)
						) {
							// Seta o item de menu
							$indiceItem = sizeof($itemMenuParentAcesso->get('itens'));
							$itemMenuParentAcesso->push(new MenuItem(), 'itens');
							$itemMenuAcesso = $itemMenuParentAcesso->get('itens')[$indiceItem];

							$itemMenuAcesso->set($itemMenu->desc,'desc');
							$itemMenuAcesso->set($itemMenu->file,'file');

							$itemMenuParentAcesso->get('itens')[$indiceItem] = $itemMenuAcesso;
						}
					}

				}
			}
			// Seta menu
			$menuAcesso[$indice] = $itemMenuParentAcesso;
		}
	}
	echo toJson($menuAcesso);
}

if (!empty($_POST['loadView'])) {
	$view = $_POST['view'];
	if (!empty($_POST['isApp']) && $view == "main") $view = 'mainApp';
	$ctsView = file_get_contents('../view/' . $view . '.' . EXT_VIEW);

	if (EXT_VIEW == 'php') {
		$ctsView = explode("\n", $ctsView);
		$ctsView = array_splice($ctsView, 1, sizeof($ctsView));
		$ctsView = implode("\n", $ctsView);
	}
	echo $ctsView;
}

if (!empty($_POST['dataFile'])) {
	echo filemtime($_POST['path']);
}
/* Enviar arquivo via base64 */
if (!empty($_POST['sendBase64'])) {
	$tempName = !empty($_POST['tempName']) ? $_POST['tempName'] : date('ymdHis').rand(0,100);
	$base64 = $_POST['base64'];

	if (!is_dir('./temp')) mkdir('./temp');

	$arquivo = fopen('./temp/'.$tempName, 'a');
	fwrite($arquivo, $base64);
	fclose($arquivo);

	echo $tempName;
}

if (!empty($_POST['doneSendBase64'])) {
	$tempName 		= $_POST['tempName'];
	$fileName 		= $_POST['fileName'];
	$path 			= $_POST['path'];
	$ext 			= $_POST['ext'];
	$arrayExtText 	= array('txt','csv');

	if (is_file('./upload.php')) include './upload.php';

	$arquivo = fopen('./temp/'.$tempName, "r") or die("Unable to open file!");
	$ctx = fread($arquivo, filesize('./temp/'.$tempName));
	fclose($arquivo);

	$path = resolvPath($path, empty($_POST['use_aws']));
	if (!empty($_POST['use_userPath'])) {
		if (empty($_POST['use_aws'])) resolvPath($path.$id_usuario.'/');
		$fileName = $id_usuario.'/'.$fileName;
	}

	$ctx = empty($_POST['no_base64']) ? base64_decode($ctx) : $ctx;
	$ctx = in_array(strtolower($ext), $arrayExtText) ? utf8_encode($ctx) : $ctx;

	if (empty($_POST['use_aws'])) {
		// echo 'não usar aws';
		$arquivo2 = fopen($path.$fileName.'.'.$ext, "w") or die("Unable to open file!");
		fwrite($arquivo2, $ctx);
		fclose($arquivo2);
	} else {
		// echo 'usar aws';
		$configEnv 		= json_decode(CONFIG_ENV);
		$bucketName 	= $configEnv->aws->bucket;
		$IAM_KEY 		= $configEnv->aws->user->accessKey;
		$IAM_SECRET 	= $configEnv->aws->user->secretKey;
		$region 		= $configEnv->aws->region;

		try {
			$s3 = S3Client::factory(array(
				'credentials' => array(
					'key' => $IAM_KEY,
					'secret' => $IAM_SECRET
				),
				'version' => 'latest',
				'region'  => $region
			));
		} catch (Exception $e) {
			// echo 'Error S3';
			die("Error: " . $e->getMessage());
		}
		// For this, I would generate a unqiue random string for the key name. But you can do whatever.
		// $keyName = 'test_example/' . basename($_FILES["fileToUpload"]['tmp_name']);
		$keyName = $path.$fileName.'.'.$ext;
		$pathInS3 = 'https://s3.' . $region . '.amazonaws.com/' . $bucketName . '/' . $keyName;

		try {
			$arquivo = fopen('./temp/'.$tempName, "w") or die("Unable to open file!");
			fwrite($arquivo, $ctx);
			fclose($arquivo);

			$file = './temp/'.$tempName;

			$result = $s3->putObject(
				array(
					// 'ACL' => 'public-read-write',
					'ACL' => 'public-read',
					'Bucket'=> $bucketName,
					'Key' => $keyName,
					'SourceFile' => $file,
					'StorageClass' => 'REDUCED_REDUNDANCY'
					// 'StorageClass' => 'STANDARD'
				)
			);
		} catch (S3Exception $e) {
			// echo 'S3Exception com s3';
			die('Error:' . $e->getMessage());
		} catch (Exception $e) {
			// echo 'Exception sem s3';
			die('Error:' . $e->getMessage());
		}
	}

	$file = './temp/'.$tempName;
	if (is_file($file)) unlink($file);

	if (!empty($_POST['returnNamePhoto'])) {
		echo "$fileName.$ext";
	} else {
		echo '1';
	}
}
/* End: Enviar arquivo via base64 */


function log_banco($nomeDaTabela, $identificador, $modificacoes, $tipo, $pdo, $id_usuario) {
	// class Log extends PadraoObjeto {
	// 	var $data;
	// 	var $tipo;
	// 	var $descricao;
	// 	var $id_usuario;
	// }

	// $log = new Log();
	// $log->set($id_usuario,			'id_usuario' );
	// $log->set($tipo,				'tipo'		 );
	// $log->set($modificacoes,		'descricao'	 );
	// $log->set(date('Y-m-d H:i:s'),	'data'		 );

	$sql = "SELECT id_$nomeDaTabela, COALESCE(logs, '') AS logs
			FROM $nomeDaTabela 
			WHERE id_$nomeDaTabela = $identificador";
	$recebe = padraoResultado($pdo, $sql);
	$recebe = $recebe[0];

	if ($recebe->get('debug') != "OK") return false;
	// if ($recebe->debug != "OK") return false;

	$logs = array();
	$log = array(
		'data'=> date('Y-m-d H:i:s'),
		'tipo'=> $tipo,
		'descricao'=> $modificacoes,
		'id_usuario'=> $id_usuario 
	);

	if ($recebe->get('logs') == '') array_push($logs, $log);
	else 							array_push($logs, json_decode($recebe->get('logs')), $log);

	$logs = json_encode($logs);
	$sql = "UPDATE $nomeDaTabela SET logs = '$logs' WHERE id_$nomeDaTabela = $identificador";
	return padraoExecute($pdo, $sql);
}

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

// if (gettype($pdo) == 'resource') ibase_close($pdo);

?>