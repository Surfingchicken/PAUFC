Modification du Port de la Base de Données et de PhpMyAdmin
Pour garantir un fonctionnement correct de notre système, il est nécessaire d'apporter des modifications aux fichiers de configuration de nos conteneurs Docker. Suivez les étapes ci-dessous pour effectuer ces modifications :

Modification du Port de la Base de Données (MySQL)
Localisation du fichier : 
Accédez aux fichiers du conteneur MySQL en cliquant sur son nom.
Sélectionnez l'onglet "Files" pour voir la liste des fichiers.

Modification du fichier my.cnf :
Recherchez le fichier my.cnf dans le chemin /etc.
Cliquez sur l'emplacement du fichier et sélectionnez "Open File Editor" en haut à droite.
Ajoutez la ligne suivante à la 25ème ligne : 
port = 3307
Sauvegardez les modifications.

Modification du Port de PhpMyAdmin
PhpMyAdmin est configuré pour pointer vers le port 3306 par défaut, ce qui nécessite une mise à jour pour se connecter à la nouvelle base de données.

Localisation du fichier config.inc.php :
Accédez aux fichiers du conteneur PhpMyAdmin en cliquant sur son nom.
Naviguez vers le chemin /etc/phpmyadmin.

Modification du fichier config.inc.php :
Ouvrez le fichier config.inc.php.
Modifiez la ligne 65 en remplaçant :
$ports = [$_ENV['PMA_PORT']];

par 
$ports = ['3307'];
Ajoutez la ligne suivante à la ligne 70 :
$ports = ['3307'];
Sauvegardez les modifications.

Récapitulatif
Après avoir effectué ces modifications, la base de données sera configurée pour écouter sur le port 3307.
PhpMyAdmin sera également mis à jour pour pointer vers ce nouveau port, assurant ainsi un fonctionnement harmonieux de notre système.

En suivant ces étapes, vous devriez être en mesure de résoudre les problèmes de connexion et de garantir un fonctionnement optimal de notre système. 